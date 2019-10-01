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

import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as vscode from "vscode";
import { Connection } from "../model/Connection";
import { Dataset, Member } from "../model/DSEntities";
import { DatasetDataProvider } from "../ui/tree/DatasetDataProvider";
import { ensureDirectoryExistence, generateTempFileName } from "../utils";
import { DatasetService } from "./DatasetService";
import { SettingsFacade } from "./SettingsFacade";

const DEFAULT_ENCODING: string = "utf8";

interface Qualifier {
    hostName: string;
    datasetName: string;
    memberName?: string;
}

export const SEPARATOR = "_";

export class DatasetEditManager {
    private static processFilePath(filePath: string): Qualifier {
        const pathArray = filePath.split(path.sep);
        const lastPathArray = pathArray[pathArray.length - 1];
        const dataSetWithMember: string[] = lastPathArray.split(
            SEPARATOR,
        );
        let datasetName;
        let extIndex;
        if (dataSetWithMember.length === 2) {
            datasetName = dataSetWithMember[0];
        } else {
            extIndex = lastPathArray.lastIndexOf(".");
            datasetName = lastPathArray.slice(0, extIndex);
        }
        const hostData = Buffer.from(pathArray[pathArray.length - 2], "base64");
        const memberName = dataSetWithMember.length === 2 ? dataSetWithMember[1].split(".")[0] : undefined;
        let qualifier: Qualifier;
        qualifier = {
            datasetName,
            hostName: hostData.toString("utf-8"),
            memberName,
        };
        return qualifier;
    }
    private editedList = {};

    constructor(private datasetService: DatasetService) { }

    public register(
        subscriptions: vscode.Disposable[],
        dataProvider: DatasetDataProvider,
    ) {
        subscriptions.push(
            vscode.commands.registerCommand(
                "zosexplorer.edit",
                async (arg) => {
                    try {
                        await this.edit(
                            arg.host,
                            arg.dataset,
                            arg.member,
                            dataProvider,
                        );
                    } catch (error) {
                        vscode.window.showErrorMessage(
                            "Edit error: " + error,
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
                        this.marked(
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
                this.unmarkEdited(
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

    public isEdited(
        hostName: string,
        dataSetName: string,
        memberName?: string,
    ): boolean {
        if (!this.editedList[hostName]) {
            return false;
        }
        const edited = this.editedList[hostName];
        if (!edited[dataSetName]) {
            return false;
        }
        if (memberName) {
            return edited[dataSetName].has(memberName);
        }
        return true;
    }

    public cleanEdited(
        host: Connection,
        dataSet: Dataset,
        member: Member | undefined,
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

    public unmark(
        hostName: string,
        datasetName: string,
        memberName: string | undefined,
    ) {
        this.unmarkEdited({ datasetName, hostName, memberName });
    }

    public marked(qualifier: Qualifier): boolean {
        return this.markEdited(qualifier);
    }

    public closeFileDocument(closedDocument: vscode.TextDocument) {
        return this.closeDocument(closedDocument);
    }

    public saveDocumentFile(
        savedDoc: vscode.TextDocument,
        dataProvider: DatasetDataProvider,
    ) {
        return this.saveDocument(savedDoc, dataProvider);
    }

    private async edit(
        host: Connection,
        dataset: Dataset,
        member: Member | undefined,
        dataProvider: DatasetDataProvider,
    ) {
        const name = member ? `${dataset.name}(${member.name})` : `${dataset.name}`;
        const content = await this.datasetService.getContent(
            host, name,
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
                this.unmarkEdited(
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
        const qualifier: Qualifier = DatasetEditManager.processFilePath(
            savedDoc.fileName,
        );
        if (
            this.isEdited(
                qualifier.hostName,
                qualifier.datasetName,
                qualifier.memberName,
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
        const qualifier: Qualifier = DatasetEditManager.processFilePath(
            fileName,
        );
        if (
            !this.isEdited(
                qualifier.hostName,
                qualifier.datasetName,
                qualifier.memberName,
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

    private markEdited(qualifier: Qualifier): boolean {
        if (!this.editedList[qualifier.hostName]) {
            this.editedList[qualifier.hostName] = {};
        }

        const edited = this.editedList[qualifier.hostName];

        if (qualifier.memberName === undefined) {
            qualifier.memberName = qualifier.datasetName;
        }
        if (!edited[qualifier.datasetName]) {
            edited[qualifier.datasetName] = new Set();
            edited[qualifier.datasetName].add(
                qualifier.memberName,
            );
            return true;
        }

        if (
            !edited[qualifier.datasetName].has(
                qualifier.memberName,
            )
        ) {
            edited[qualifier.datasetName].add(
                qualifier.memberName,
            );
            return true;
        }

        return false;
    }

    private unmarkEdited(qualifier: Qualifier) {
        if (
            !this.isEdited(
                qualifier.hostName,
                qualifier.datasetName,
                qualifier.memberName,
            )
        ) {
            return;
        }

        this.editedList[qualifier.hostName][
            qualifier.datasetName
        ].delete(qualifier.memberName === undefined ? qualifier.datasetName : qualifier.memberName);

        if (
            this.editedList[qualifier.hostName][
                qualifier.datasetName
            ].size === 0
        ) {
            delete this.editedList[qualifier.hostName][
                qualifier.datasetName
            ];
        }
        if (
            Object.keys(this.editedList[qualifier.hostName]).length ===
            0
        ) {
            delete this.editedList[qualifier.hostName];
        }
    }

    private async uploadtoMainframe(filePath: string) {
        const content = fs.readFileSync(filePath, DEFAULT_ENCODING);
        const qualifier: Qualifier = DatasetEditManager.processFilePath(
            filePath,
        );
        const host: Connection | undefined = SettingsFacade.findHostByName(
            qualifier.hostName,
            SettingsFacade.listHosts(),
        );
        if (host === undefined) {
            throw new Error(
                `hostName ${qualifier.hostName} is not defined`,
            );
        }
        await SettingsFacade.requestCredentials(host);
        await this.datasetService.putContent(
            host,
            qualifier.datasetName,
            qualifier.memberName,
            content,
        );
    }
}
