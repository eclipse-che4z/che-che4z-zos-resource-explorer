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
// tslint:disable: no-duplicate-string
jest.mock("../service/ZoweRestClient");
jest.mock("../service/DatasetService");
jest.mock("../service/SettingsFacade");
jest.mock("fs");

import * as path from "path";
import * as vscode from "vscode";
import { Connection } from "../model/Connection";
import { Dataset, Member } from "../model/DSEntities";
import { DatasetEditManager } from "../service/DatasetEditManager";
import { DatasetService } from "../service/DatasetService";
import { SettingsFacade } from "../service/SettingsFacade";
import { ZoweRestClient } from "../service/ZoweRestClient";
import { DatasetDataProvider } from "../ui/tree/DatasetDataProvider";
import { generateTempFileName } from "../utils";
import { createDummyDataset } from "./utils/DatasetUtils";
import { generateConnection } from "./utils/TestUtils";

beforeEach(() => {
    require("fs");
});

describe("DatasetEditMemberTest", () => {
    const connection: Connection = {
        name: "Mocky",
        url: "https://mock.com",
        username: "USERNAME",
    };

    const dataset: Dataset = createDummyDataset();
    const member: Member = {
        name: "",
    };
    const context: any = {
        asAbsolutePath: () => undefined,
    };

    const creds: any = {};
    const rest: ZoweRestClient = new ZoweRestClient(creds);
    const datasetService: DatasetService = new DatasetService(rest);
    const datasetEditManager: DatasetEditManager = new DatasetEditManager(datasetService);
    const cache = {
        getItemCollapsState: jest.fn().mockReturnValue(vscode.TreeItemCollapsibleState.Collapsed),
    };

    it("Should Mark Member as Edited", () => {
        datasetEditManager.register([], context);
        vscode.commands.executeCommand("zosexplorer.edit", {
            dataset,
            host: connection,
            member,
        });
    });

    it("Mark Member", () => {
        const mark1 = datasetEditManager.marked({
            datasetName: "Mark_Member",
            hostName: "MyHost",
            memberName: "Member1",
        });
        const mark2 = datasetEditManager.marked({
            datasetName: "Mark_Member",
            hostName: "MyHost",
            memberName: "Member2",
        });
        const mark3 = datasetEditManager.marked({
            datasetName: "Mark_Member",
            hostName: "MyHost",
            memberName: "Member2",
        });

        expect(mark1).toEqual(true);
        expect(mark2).toEqual(true);
        expect(mark3).toEqual(false);
    });

    it("Mark PS", () => {
        const markPS1 = datasetEditManager.marked({
            datasetName: "Mark_PS",
            hostName: "MyHost",
            memberName: undefined,
        });
        expect(markPS1).toEqual(true);

        const markPS2 = datasetEditManager.marked({
            datasetName: "Mark_PS",
            hostName: "MyHost",
            memberName: undefined,
        });
        expect(markPS2).toEqual(false);

        datasetEditManager.unmark(
            "MyHost",
            "Mark_PS",
            undefined,
        );

        const markPS3 = datasetEditManager.marked({
            datasetName: "Mark_PS",
            hostName: "MyHost",
            memberName: undefined,
        });
        expect(markPS3).toEqual(true);
    });

    it("Save to Mainframe with no marked dataset", async () => {
        await verifySaveToMainframe(
            connection,
            "C:" +
                path.sep +
                "HarddriveMyHostFILE" +
                path.sep +
                Buffer.from(connection.name).toString("base64") +
                path.sep +
                "USERNAME.COBOL_FILE",
        );
    });

    it("Save to Mainframe with marked dataset", async () => {
        datasetEditManager.marked({
            datasetName: "DATASET",
            hostName: connection.name,
            memberName: "FILE",
        });
        await verifySaveToMainframe(
            connection,
            "C:" + path.sep + "HarddriveMyHostFILE" + path.sep + connection.name + path.sep + "DATASET_FILE.cbl",
        );
    });

    it("Close document", () => {
        const closeDocListener = jest.spyOn(datasetEditManager, "closeFileDocument");
        const textDocument: any = {
            fileName:
                "C:" + path.sep + "HarddriveMyHostFILE" + path.sep + connection.name + path.sep + "DATASET_FILE.cbl",
        };
        datasetEditManager.closeFileDocument(textDocument);
        expect(closeDocListener).toBeCalled();
    });

    it("Clean edited member", () => {
        const utils = require("../utils");
        const cleanMember = jest.spyOn(datasetEditManager, "cleanEdited");
        jest.spyOn(utils, "generateTempFileName");
        datasetEditManager.cleanEdited(connection, dataset, member);
        expect(cleanMember).toReturnWith(true);
        expect(generateTempFileName).toReturn();
    });

    it("Clean edited PS", () => {
        const utils = require("../utils");
        const cleanPS = jest.spyOn(datasetEditManager, "cleanEdited");
        jest.spyOn(utils, "generateTempFileName");
        datasetEditManager.cleanEdited(connection, dataset, undefined);
        expect(cleanPS).toReturnWith(true);
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
        const textDocument: any = {
            fileName: "C:" + path.sep + "HarddriveMyHostFILE" + path.sep + "Mocky" + path.sep + "DATASET_FILE.cbl",
        };
        datasetEditManager.saveDocumentFile(textDocument, datasetDataProvider);
        expect(datasetEditManager.saveDocumentFile).toBeCalled();
    });

    async function verifySaveToMainframe(con: Connection, uri: string) {
        const a = vscode.window.showWarningMessage;
        vscode.window.showWarningMessage = jest.fn().mockReturnValue("Save");
        try {
            jest.spyOn(datasetEditManager, "saveToMainframe");
            jest.spyOn(SettingsFacade, "findHostByName");
            SettingsFacade.listHosts = jest.fn().mockReturnValue([con]);
            await datasetEditManager.saveToMainframe(uri);
            expect(datasetEditManager.saveToMainframe).toBeCalled();
            expect(SettingsFacade.listHosts).toBeCalled();
            expect(SettingsFacade.findHostByName).toBeCalled();
        } finally {
            vscode.window.showWarningMessage = a;
        }
    }
});
