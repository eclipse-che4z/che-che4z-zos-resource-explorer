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

import * as vscode from "vscode";
import { allocateLikeDataset } from "../commands/AllocateLikeDataset";
import { Dataset } from "../model/DSEntities";
import { createDummyDataset } from "./utils/DatasetUtils";
import { generateArgs, generateDataserviceMock } from "./utils/TestUtils";

const DATASET_NAME: string = "DATASET.TEST";
const TRK_UNIT: string = "TRACK";
const BLK_UNIT: string = "BLK";
const VSM_ORG: string = "VSAM";
const PO_ORG: string = "PO";

let cache: any;
let mvsDatasetProviderMock: any;
let withProgressListener: any;

beforeAll(() => {
    // VS Code mock for showInput and showProgress
    vscode.window.showInputBox = jest.fn().mockReturnValue(Promise.resolve("DATASET.TEST"));
    withProgressListener = jest.spyOn(vscode.window, "withProgress");

    cache = {
        reset: jest.fn().mockReturnValue(""),
    };

    mvsDatasetProviderMock = {
        refresh: jest.fn().mockReturnValue(""),
    };
});

describe("[POSITIVE TESTS] Allocate like command", () => {
    const dummyDatasetOrg: Dataset = { name: DATASET_NAME, dataSetOrganization: PO_ORG, allocationUnit: TRK_UNIT };
    const dataset: Dataset = createDummyDataset(dummyDatasetOrg);

    test("Allocate like a valid kind of dataset", async () => {
        /*
        - DESC: A PO dataset with an valid allocation unit (track) is created.
        - DATASET_SERVICE_MOCK: Dataset didn't already exsist --> generateDataserviceMock(FALSE).
        - EXPECTED RESULT: The unit test will trigger the showInformationMessage(`Dataset created.`).
        */
        await allocateLikeDataset(generateDataserviceMock(false) as any, cache, mvsDatasetProviderMock, generateArgs(dataset));
        expect(withProgressListener).toHaveReturned();
    });

});

describe("[NEGATIVE TESTS] Allocate like command", () => {

    test("Allocate like a VSAM dataset - not allowed", async () => {
        /*
        - DESC: A VSAM dataset with an valid allocation unit (track) is created.
        - DATASET_SERVICE_MOCK: Dataset didn't already exsist --> generateDataserviceMock(FALSE).
        - EXPECTED RESULT: The unit test will return FALSE because dataset type VSAM is not supported.
        */
        const dummyDatasetOrg: Dataset = { name: DATASET_NAME, dataSetOrganization: VSM_ORG, allocationUnit: TRK_UNIT };
        const dataset: Dataset = createDummyDataset(dummyDatasetOrg);

        expect(await allocateLikeDataset(generateDataserviceMock(false) as any, cache, mvsDatasetProviderMock, generateArgs(dataset))).toBe(false);
    });

    test("Allocate like a BLOCKS unit dataset", async () => {
        /*
        - DESC: A PO dataset with an invalid allocation unit (blk) is created.
        - DATASET_SERVICE_MOCK: Dataset didn't already exsist --> generateDataserviceMock(FALSE).
        - EXPECTED RESULT: The unit test will return FALSE because allcation unit BLOCK is not supported.
        */
        const dummyDatasetOrg: Dataset = { name: DATASET_NAME, dataSetOrganization: PO_ORG, allocationUnit: BLK_UNIT };
        const dataset: Dataset = createDummyDataset(dummyDatasetOrg);

        expect(await allocateLikeDataset(generateDataserviceMock(false) as any, cache, mvsDatasetProviderMock, generateArgs(dataset))).toBe(false);

    });

    test("Allocate like an already defined dataset", async () => {
        /*
        - DESC: A PO dataset with a valid allocation unit (track) is created.
        - DATASET_SERVICE_MOCK: The target dataset already exsist --> generateDataserviceMock(TRUE).
        - EXPECTED RESULT: The unit test will return FALSE because another dataset with the same name already exists.
        */
        const dummyDatasetOrg: Dataset = { name: DATASET_NAME, dataSetOrganization: PO_ORG, allocationUnit: TRK_UNIT };
        const dataset: Dataset = createDummyDataset(dummyDatasetOrg);

        expect(await allocateLikeDataset(generateDataserviceMock(true) as any, cache, mvsDatasetProviderMock, generateArgs(dataset))).toBe(false);
    });
});
