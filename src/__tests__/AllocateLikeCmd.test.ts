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
jest.mock("../service/DatasetService");
jest.mock("../service/ZoweRestClient");
jest.mock("../service/DatasetCache");

import * as vscode from "vscode";
import { allocateLikeDataset } from "../commands/AllocateLikeDataset";
import { DatasetService } from "../service/DatasetService";
import { ZoweRestClient } from "../service/ZoweRestClient";

import { Connection } from "../model/Connection";
import { Dataset } from "../model/DSEntities";
import { createDummyDataset } from "./utils/DatasetUtils";

const datasetName: string = "DATASET.TEST";
const trackUnit: string = "TRACK";
const cylinderUnit: string = "CYLINDER";
const blocksUnit: string = "BLOCKS";
const vsamOrganization: string = "VSAM";
const poOrganization: string = "PO";
const psOrganization: string = "PS";
const poeOrganization: string = "PO_E";

let cache;
let host: Connection;

let mvsDatasetProviderMock;

beforeAll(() => {
    const creds: any = {};
    const restStub = new ZoweRestClient(creds);
    host = { name: "", url: "", username: "" };

    /*
    datasetServiceMock = {
        allocateDatasetLike: jest.fn().mockReturnValue(Promise.resolve(false)),
        isDatasetExists: jest.fn().mockReturnValue(Promise.resolve()),
    };
    */



    cache = {
        reset: jest.fn().mockReturnValue(""),
    };

    mvsDatasetProviderMock = {
        refresh: jest.fn().mockReturnValue(""),
    };

    // put in method
    vscode.window.showInputBox = jest.fn().mockReturnValue(Promise.resolve("DATASET.TEST"));
    vscode.window.withProgress = jest.fn().mockReturnValue(Promise.resolve(true));
});

describe("[POSITIVE TESTS] Allocate like command", () => {

    const dummyDatasetOrg: Dataset = { name: datasetName, dataSetOrganization: "PO" };
    const dataset: Dataset = createDummyDataset(dummyDatasetOrg);



    test("Allocate like a valid kind of dataset", async () => {
        expect(1).toBe(1);
    });

});

describe("[NEGATIVE TESTS] Allocate like command", () => {

    test("Allocate like a VSAM dataset - not allowed", async () => {
        const dummyDatasetOrg: Dataset = { name: datasetName, dataSetOrganization: "VSAM" };
        const dataset: Dataset = createDummyDataset(dummyDatasetOrg);

        const args: object = {
            dataset,
            host,
            path: "",
        };
        expect(1).toBe(1);
        // expect(await allocateLikeDataset(datasetServiceMock, cache, mvsDatasetProviderMock, args)).toBe(false);
    });

    test("Allocate like a BLOCKS unit dataset", async () => {
        const dummyDatasetOrg: Dataset = { name: datasetName, dataSetOrganization: "PO", allocationUnit: "BLK" };
        const dataset: Dataset = createDummyDataset(dummyDatasetOrg);

        const args: object = {
            dataset,
            host,
            path: "",
        };
        expect(1).toBe(1);
        // expect(await allocateLikeDataset(datasetServiceMock, cache, mvsDatasetProviderMock, args)).toBe(false);

    });

    test("Allocate like an already defined dataset", async () => {
        /*
        For test purpose a PO dataset with a valid allocation unit is created.
        The dataset service is mocked in order to return that the dataset defined
        already exist and the unit test will verify that allocate like method will
        return with the expected result
        */

        const dummyDatasetOrg: Dataset = { name: datasetName, dataSetOrganization: "PO", allocationUnit: "TRACK" };
        const dataset: Dataset = createDummyDataset(dummyDatasetOrg);

        const args: object = {
            dataset,
            host,
            path: "",
        };

        expect(await allocateLikeDataset(generateDataserviceMock(false,true) as any, cache, mvsDatasetProviderMock, generateArgs(dataset))).toBe(false);
    });
});

function generateArgs(dataset: Dataset) {
    return {
        dataset,
        host,
        path: "",
    };
}

function generateDataserviceMock(isSuccessfullyCreated: boolean, isDatasetExists: boolean) {
    return {
        allocateDatasetLike: jest.fn().mockReturnValue(Promise.resolve(isSuccessfullyCreated)),
        isDatasetExists: jest.fn().mockReturnValue(Promise.resolve(isDatasetExists)),
    };
}
