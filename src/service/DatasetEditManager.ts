/*
 * Copyright (c) 2019 Broadcom.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *   Broadcom, Inc. - initial API and implementation
 */

import fs = require("fs");
import os = require("os");
import path = require("path");
import * as vscode from "vscode";
import { Connection } from "../model/Connection";
import { Dataset, Member } from "../model/DSEntities";
import { DatasetDataProvider } from "../ui/tree/DatasetDataProvider";
import { ensureDirectoryExistence, generateTempFileName } from "../utils";
import { DatasetService } from "./DatasetService";
import { SettingsFacade } from "./SettingsFacade";

const DEFAULT_ENCODING: string = "utf8";

interface MemberQualifier {
    hostName: string;
    datasetName: string;
    memberName: string;
}

export const SEPARATOR = "_";

export class DatasetEditManager {
    private static processFilePath(filePath: string): MemberQualifier {
        const pathArray = filePath.split(path.sep);
        const dataSetwithMember = pathArray[pathArray.length - 1].split(
            SEPARATOR,
        );
        return {
            datasetName: dataSetwithMember[0],
            hostName: pathArray[pathArray.length - 2],
            memberName: dataSetwithMember[1].split(".")[0],
        };
    }
    private editedMemList = {};

    constructor(private datasetService: DatasetService) {}

    public register(
        subscriptions: vscode.Disposable[],
        dataProvider: DatasetDataProvider,
    ) {
        subscriptions.push(
            vscode.commands.registerCommand(
                "zosexplorer.edit",
                async (arg) => {
                    try {
                        await this.editMember(
                            arg.host,
                            arg.dataset,
                            arg.member,
                            dataProvider,
                        );
                    } catch (error) {
                        vscode.window.showErrorMessage(
                            "Edit member error: " + error,
                        );
                    }
                },
            ),
        );
        subscriptions.push(
            vscode.workspace.onDidChangeTextDocument(
                (event: vscode.TextDocumentChangeEvent) => {
                    if (
                        this.isDataSetFile(event.document.fileName) &&
                        event.document.isDirty &&
                        this.markedMember(
                            DatasetEditManager.processFilePath(
                                event.document.fileName,
                            ),
                        )
                    ) {
                        dataProvider.refresh();
                    }
                },
            ),
        );
        subscriptions.push(
            vscode.workspace.onDidCloseTextDocument(
                (closedDocument: vscode.TextDocument) =>
                    this.closeDocument(closedDocument),
            ),
        );
        subscriptions.push(
            vscode.workspace.onWillSaveTextDocument(
                async (saveEvent: vscode.TextDocumentWillSaveEvent) => {
                    if (
                        saveEvent.reason ===
                        vscode.TextDocumentSaveReason.Manual
                    ) {
                        this.saveDocument(saveEvent.document, dataProvider);
                    }
                },
            ),
        );
    }

    public async saveToMainframe(filePath: string): Promise<boolean> {
        const message = await vscode.window.showWarningMessage(
            "Do you want to save changes to Mainframe?",
            "Save",
        );
        if (message === "Save") {
            try {
                await this.uploadtoMainframe(filePath);
                this.unmarkEditedMember(
                    DatasetEditManager.processFilePath(filePath),
                );
                return true;
            } catch (error) {
                if (error.message === "fwrite() error") {
                    await vscode.window.showErrorMessage(
                        "Action failed: Data set size exceeded or file corrupted.",
                    );
                }
                await vscode.window.showErrorMessage(error.toString());
            }
        }
        return false;
    }

    public isEditedMember(
        hostName: string,
        dataSetName: string,
        memberName?: string,
    ): boolean {
        if (!this.editedMemList[hostName]) {
            return false;
        }
        const editedMembers = this.editedMemList[hostName];
        if (!editedMembers[dataSetName]) {
            return false;
        }
        if (memberName) {
            return editedMembers[dataSetName].has(memberName);
        }
        return true;
    }

    public cleanEditedMember(
        host: Connection,
        dataSet: Dataset,
        member: Member,
    ): boolean {
        const filePath: string = generateTempFileName(host, dataSet, member);
        if (!fs.existsSync(filePath)) {
            return false;
        }
        try {
            fs.unlinkSync(filePath);
        } catch (error) {
            vscode.window.showErrorMessage("Unlink file error: " + error);
            return false;
        }
        return true;
    }

    public unmarkMember(
        hostName: string,
        datasetName: string,
        memberName: string,
    ) {
        this.unmarkEditedMember({ datasetName, hostName, memberName });
    }
    public markedMember(memberQualifier: MemberQualifier): boolean {
        return this.markEditedMember(memberQualifier);
    }

    private async editMember(
        host: Connection,
        dataset: Dataset,
        member: Member,
        dataProvider: DatasetDataProvider,
    ) {
        const content = await this.datasetService.getContent(
            host,
            `${dataset.name}(${member.name})`,
        );
        const filePath: string = generateTempFileName(host, dataset, member);
        ensureDirectoryExistence(filePath);
        if (
            fs.existsSync(filePath) &&
            fs.readFileSync(filePath, DEFAULT_ENCODING) !== content
        ) {
            const open = await vscode.window.showInformationMessage(
                "Previous edits could not be saved to the server and were autosaved locally. Open autosave file?",
                "Yes",
                "No",
            );
            if (open !== "Yes") {
                fs.writeFileSync(filePath, content, DEFAULT_ENCODING);
                this.unmarkEditedMember(
                    DatasetEditManager.processFilePath(filePath),
                );
                dataProvider.refresh();
            }
        } else {
            fs.writeFileSync(filePath, content, DEFAULT_ENCODING);
        }
        const document: vscode.TextDocument = await vscode.workspace.openTextDocument(
            filePath,
        );
        await vscode.window.showTextDocument(document, { preview: false });
    }

    private async saveDocument(
        savedDoc: vscode.TextDocument,
        dataProvider: DatasetDataProvider,
    ) {
        const memberQualifier: MemberQualifier = DatasetEditManager.processFilePath(
            savedDoc.fileName,
        );
        if (
            this.isEditedMember(
                memberQualifier.hostName,
                memberQualifier.datasetName,
                memberQualifier.memberName,
            ) &&
            (await this.saveToMainframe(savedDoc.fileName))
        ) {
            dataProvider.refresh();
        }
    }

    private isDataSetFile(fileName: string): boolean {
        const tmpFolder: string = path.join(os.tmpdir(), "zosExplorer");
        // Ignore unrelated documents
        if (os.platform() === "win32") {
            if (fileName.toLowerCase().startsWith(tmpFolder.toLowerCase())) {
                return true;
            }
        } else {
            if (fileName.startsWith(tmpFolder)) {
                return true;
            }
        }
        return false;
    }
    private closeDocument(closedDocument: vscode.TextDocument) {
        if (!closedDocument.isClosed) {
            return;
        }
        let fileName: string;
        // Bug in vscode? workaround
        if (closedDocument.uri.scheme === "git") {
            fileName = JSON.parse(closedDocument.uri.query).path;
        } else {
            fileName = closedDocument.fileName;
        }
        if (!this.isDataSetFile(fileName)) {
            return;
        }
        const memberQualifier: MemberQualifier = DatasetEditManager.processFilePath(
            fileName,
        );
        if (
            !this.isEditedMember(
                memberQualifier.hostName,
                memberQualifier.datasetName,
                memberQualifier.memberName,
            ) &&
            fs.existsSync(fileName)
        ) {
            try {
                fs.unlinkSync(fileName);
            } catch (error) {
                vscode.window.showErrorMessage("Unlink file error: " + error);
            }
        }
    }

    private markEditedMember(memberQualifier: MemberQualifier): boolean {
        if (!this.editedMemList[memberQualifier.hostName]) {
            this.editedMemList[memberQualifier.hostName] = {};
        }

        const editedMembers = this.editedMemList[memberQualifier.hostName];

        if (!editedMembers[memberQualifier.datasetName]) {
            editedMembers[memberQualifier.datasetName] = new Set();
            editedMembers[memberQualifier.datasetName].add(
                memberQualifier.memberName,
            );
            return true;
        }

        if (
            !editedMembers[memberQualifier.datasetName].has(
                memberQualifier.memberName,
            )
        ) {
            editedMembers[memberQualifier.datasetName].add(
                memberQualifier.memberName,
            );
            return true;
        }

        return false;
    }

    private unmarkEditedMember(memberQualifier: MemberQualifier) {
        if (
            !this.isEditedMember(
                memberQualifier.hostName,
                memberQualifier.datasetName,
                memberQualifier.memberName,
            )
        ) {
            return;
        }

        this.editedMemList[memberQualifier.hostName][
            memberQualifier.datasetName
        ].delete(memberQualifier.memberName);
        if (
            this.editedMemList[memberQualifier.hostName][
                memberQualifier.datasetName
            ].size === 0
        ) {
            delete this.editedMemList[memberQualifier.hostName][
                memberQualifier.datasetName
            ];
        }
        if (
            Object.keys(this.editedMemList[memberQualifier.hostName]).length ===
            0
        ) {
            delete this.editedMemList[memberQualifier.hostName];
        }
    }

    private async uploadtoMainframe(filePath: string) {
        const content = fs.readFileSync(filePath, DEFAULT_ENCODING);
        const memberQualifier: MemberQualifier = DatasetEditManager.processFilePath(
            filePath,
        );
        const host: Connection | undefined = SettingsFacade.findHostByName(
            memberQualifier.hostName,
            SettingsFacade.listHosts(),
        );
        if (host === undefined) {
            throw new Error(
                `hostName ${memberQualifier.hostName} is not define`,
            );
        }
        await SettingsFacade.requestCredentials(host);
        await this.datasetService.putContent(
            host,
            content,
            memberQualifier.datasetName,
            memberQualifier.memberName,
        );
    }
}
