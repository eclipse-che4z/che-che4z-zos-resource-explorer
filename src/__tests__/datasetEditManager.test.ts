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

import { anyTypeAnnotation } from "@babel/types";
import * as vscode from "vscode";
import { TextDocument, Uri } from "../__mocks__/vscode";
import { Connection } from "../model/Connection";
import { Dataset, Member } from "../model/DSEntities";
import { DatasetEditManager } from "../service/DatasetEditManager";
import { DatasetService } from "../service/DatasetService";
import { SettingsFacade } from "../service/SettingsFacade";
import { ZoweRestClient } from "../service/ZoweRestClient";
import { createDummyDataset } from "./utils/DatasetUtils";

describe("DatasetEditMember", () => {
    const host: Connection = { name: "", url: "", username: "" };
    const dataset: Dataset = createDummyDataset();
    const member: Member = {
        name: "",
    };
    const context: any = {};
    const creds: any = {};
    const rest: ZoweRestClient = new ZoweRestClient(creds);
    const datasetService: DatasetService = new DatasetService(rest);
    const datasetEditManager: DatasetEditManager = new DatasetEditManager(
        datasetService,
    );
    const link = "https://mock.com";
    const textDocument: TextDocument = {
        eol: undefined,
        fileName: "",
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
        datasetEditManager.markedMember({
            datasetName: "Mark_Member",
            hostName: "MyHost",
            memberName: "Member1",
        });
        datasetEditManager.markedMember({
            datasetName: "Mark_Member",
            hostName: "MyHost",
            memberName: "Member2",
        });
        datasetEditManager.markedMember({
            datasetName: "Mark_Member",
            hostName: "MyHost",
            memberName: "Member2",
        });
    });

    it("Save to Mainframe with no marked dataset", () => {
        const connection: Connection = {
            name: "RealMock",
            url: link,
            username: "USERNAME",
        };
        saveToMainframe(
            connection,
            "C:HarddriveMyHostFILE\\RealMock\\USERNAME.COBOL_FILE",
        );
    });

    it("Save to Mainframe with different dataset", () => {
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
        saveToMainframe(
            connection,
            "C:HarddriveMyHostFILE\\Mocky\\DATASET_FILE.cbl",
        );
    });

    it("Save to Mainframe with marked dataset", () => {
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
        saveToMainframe(
            connection,
            "C:HarddriveMyHostFILE\\Mocky\\DATASET_FILE.cbl",
        );
    });

    it("Close document", () => {
        datasetEditManager.closeFileDocument(textDocument);
    });

    function saveToMainframe(connection: Connection, uri: string) {
        const a = vscode.window.showWarningMessage;

        vscode.window.showWarningMessage = jest.fn().mockReturnValue("Save");
        SettingsFacade.listHosts = jest.fn().mockReturnValue([connection]);
        datasetEditManager.saveToMainframe(uri);
        vscode.window.showWarningMessage = a;
    }
});
