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
jest.mock("../service/ZoweRestClient");
jest.mock("../service/DatasetService");
jest.mock("../service/SettingsFacade");
jest.mock("fs");

import * as path from "path";
import * as vscode from "vscode";
import { TextDocument, Uri } from "../__mocks__/vscode";
import { Connection } from "../model/Connection";
import { Dataset, Member } from "../model/DSEntities";
import { DatasetEditManager } from "../service/DatasetEditManager";
import { DatasetService } from "../service/DatasetService";
import { SettingsFacade } from "../service/SettingsFacade";
import { ZoweRestClient } from "../service/ZoweRestClient";
import { DatasetDataProvider } from "../ui/tree/DatasetDataProvider";
import { generateTempFileName } from "../utils";
import { createDummyDataset } from "./utils/DatasetUtils";

describe("DatasetEditMember", () => {
    const host: Connection = { name: "", url: "", username: "" };
    const dataset: Dataset = createDummyDataset();
    const member: Member = {
        name: "",
    };
    const context: any = {
        asAbsolutePath() {
            return undefined;
        },
    };
    const creds: any = {};
    const rest: ZoweRestClient = new ZoweRestClient(creds);
    const datasetService: DatasetService = new DatasetService(rest);
    const datasetEditManager: DatasetEditManager = new DatasetEditManager(datasetService);
    const cache = {
        getItemCollapsState: jest.fn().mockReturnValue(vscode.TreeItemCollapsibleState.Collapsed),
    };
    const link = "https://mock.com";
    const textDocument: TextDocument = {
        eol: undefined,
        fileName: "C:" + path.sep + "HarddriveMyHostFILE" + path.sep + "Mocky" + path.sep + "DATASET_FILE.cbl",
        isClosed: true,
        isDirty: true,
        isUntitled: true,
        languageId: "COBOL",
        lineCount: 12,
        uri: new Uri("", "", "", "", "", ""),
        version: 1,
        save() {
            return undefined;
        },
        lineAt(line: number) {
            return undefined;
        },
        offsetAt(position: any) {
            return undefined;
        },
        positionAt(offset: number) {
            return undefined;
        },
        getText(range?: any) {
            return "undefined";
        },
        getWordRangeAtPosition(position: any, regex?: RegExp) {
            return undefined;
        },
        validateRange(range: any) {
            return undefined;
        },
        validatePosition(position: any) {
            return undefined;
        },
    };

    beforeEach(() => {
        require("fs");
    });

    it("Should Mark Member as Edited", () => {
        datasetEditManager.register([], context);
        vscode.commands.executeCommand("zosexplorer.edit", {
            dataset,
            host,
            member,
        });
    });

    it("Mark Member", () => {
        const mark1 = datasetEditManager.markedMember({
            datasetName: "Mark_Member",
            hostName: "MyHost",
            memberName: "Member1",
        });
        const mark2 = datasetEditManager.markedMember({
            datasetName: "Mark_Member",
            hostName: "MyHost",
            memberName: "Member2",
        });
        const mark3 = datasetEditManager.markedMember({
            datasetName: "Mark_Member",
            hostName: "MyHost",
            memberName: "Member2",
        });

        expect(mark1).toEqual(true);
        expect(mark2).toEqual(true);
        expect(mark3).toEqual(false);
    });

    it("Save to Mainframe with no marked dataset", async () => {
        const connection: Connection = {
            name: "RealMock",
            url: link,
            username: "USERNAME",
        };
        await saveToMainframe(
            connection,
            "C:" + path.sep + "HarddriveMyHostFILE" + path.sep + "RealMock" + path.sep + "USERNAME.COBOL_FILE",
        );
    });

    it("Save to Mainframe with different dataset", async () => {
        const connection: Connection = {
            name: "Mocky",
            url: link,
            username: "USERNAME",
        };
        datasetEditManager.markedMember({
            datasetName: "DATASET2",
            hostName: connection.name,
            memberName: "FILE",
        });
        await saveToMainframe(
            connection,
            "C:" + path.sep + "HarddriveMyHostFILE" + path.sep + "Mocky" + path.sep + "DATASET_FILE.cbl",
        );
    });

    it("Save to Mainframe with marked dataset", async () => {
        const connection: Connection = {
            name: "Mocky",
            url: link,
            username: "USERNAME",
        };
        datasetEditManager.markedMember({
            datasetName: "DATASET",
            hostName: connection.name,
            memberName: "FILE",
        });
        await saveToMainframe(
            connection,
            "C:" + path.sep + "HarddriveMyHostFILE" + path.sep + "Mocky" + path.sep + "DATASET_FILE.cbl",
        );
    });

    it("Close document", () => {
        const closeDocListener = jest.spyOn(
            datasetEditManager,
            "closeFileDocument",
        );
        datasetEditManager.closeFileDocument(textDocument);
        expect(closeDocListener).toBeCalled();
    });

    it("Clean edited member", () => {
        const utils = require("../utils");
        const cleanMember = jest.spyOn(datasetEditManager, "cleanEditedMember");
        jest.spyOn(utils, "generateTempFileName");
        datasetEditManager.cleanEditedMember(host, dataset, member);
        expect(cleanMember).toReturnWith(true);
        expect(generateTempFileName).toReturn();
    });

    it("Save Document", () => {
        jest.spyOn(datasetEditManager, "saveDocumentFile");
        const datasetDataProvider: DatasetDataProvider = new DatasetDataProvider(
            context,
            datasetEditManager as any,
            cache as any,
            datasetService,
        );
        datasetEditManager.saveDocumentFile(textDocument, datasetDataProvider);
        // tslint:disable-next-line: no-unused-expression
        expect(datasetEditManager.saveDocumentFile).toBeCalled;
    });

    async function saveToMainframe(connection: Connection, uri: string) {
        const a = vscode.window.showWarningMessage;
        jest.spyOn(datasetEditManager, "saveToMainframe");
        jest.spyOn(SettingsFacade, "findHostByName");
        vscode.window.showWarningMessage = jest.fn().mockReturnValue("Save");
        SettingsFacade.listHosts = jest.fn().mockReturnValue([connection]);
        await datasetEditManager.saveToMainframe(uri);
        expect(datasetEditManager.saveToMainframe).toBeCalled();
        expect(SettingsFacade.listHosts).toBeCalled();
        expect(SettingsFacade.findHostByName).toBeCalled();
        vscode.window.showWarningMessage = a;
    }
});
