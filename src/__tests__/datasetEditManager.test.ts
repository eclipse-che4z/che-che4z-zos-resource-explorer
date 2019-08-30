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

import * as vscode from "vscode";
import { Connection } from "../model/Connection";
import { Dataset, Member } from "../model/DSEntities";
import { DatasetCache } from "../service/DatasetCache";
import { DatasetEditManager } from "../service/DatasetEditManager";
import { DatasetService } from "../service/DatasetService";
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
    it("Should Mark Member as Edited", () => {
        datasetEditManager.register([], context);
        vscode.commands.executeCommand("zosexplorer.editMember", {});
    });
});
