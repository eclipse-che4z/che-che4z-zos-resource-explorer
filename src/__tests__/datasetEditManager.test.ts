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

import * as vscode from "vscode";
import { Connection } from "../model/Connection";
import { Dataset, Member } from "../model/DSEntities";
import { DatasetEditManager } from "../service/DatasetEditManager";
import { DatasetService } from "../service/DatasetService";
import { SettingsFacade } from "../service/SettingsFacade";
import { ZoweRestClient } from "../service/ZoweRestClient";

describe("DatasetEditMember", () => {
    const host: Connection = { name: "", url: "", username: "" };
    const dataset: Dataset = {
        allocatedSize: 50,
        allocationUnit: "",
        averageBlock: 2,
        blockSize: 50,
        catalogName: "",
        creationDate: "",
        dataSetOrganization: "",
        deviceType: "",
        directoryBlocks: 1,
        expirationDate: "",
        migrated: false,
        name: "",
        primary: 1,
        recordFormat: "",
        recordLength: 20,
        secondary: 10,
        used: 1,
        volumeSerial: "",
    };
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

    beforeEach(() => {
        require("fs");
    });

    it("Should Mark Member as Edited", () => {
        datasetEditManager.register([], context);
        vscode.commands.executeCommand("zosexplorer.editMember", {
            dataset,
            host,
            member,
        });
    });

    it("Save to Mainframe", () => {
        const a = vscode.window.showWarningMessage;
        // const b = SettingsFacade.findHostByName;
        vscode.window.showWarningMessage = jest.fn().mockReturnValue("Save");
        // SettingsFacade.findHostByName = jest.fn().mockReturnValue(undefined);
        datasetEditManager.saveToMainframe(
            "C:HarddriveMyHostFILE.COBOL_FILE.cbl",
        );
        vscode.window.showWarningMessage = a;
        // SettingsFacade.findHostByName = b;
    });
});
