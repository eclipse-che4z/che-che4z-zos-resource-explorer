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

import { Connection } from "../model/Connection";
import { Dataset, Member } from "../model/DSEntities";
import { CopyPasteService } from "../service/CopyPasteService";
import { DatasetService } from "../service/DatasetService";
import { ZoweRestClient } from "../service/ZoweRestClient";
import { ZDatasetNode, ZMemberNode } from "../ui/tree/DatasetTreeModel";
import { createDummyDataset } from "./utils/DatasetUtils";
import { generateConnection } from "./utils/TestUtils";

let dataset: Dataset;
let datasetNode: ZDatasetNode;
let memberNode: ZMemberNode;

let datasetName: string;
let memberName: string;
let host: Connection;
let pathPrefix: string;

let memberEntity: Member;

let copyPasteService: CopyPasteService;
let freshCopyPasteService: CopyPasteService;

beforeAll(() => {
    const creds: any = {};
    const restStub = new ZoweRestClient(creds);
    const datasetServiceMocked: DatasetService = new DatasetService(restStub);

    dataset = createDummyDataset();
    datasetNode = new ZDatasetNode(dataset, host, pathPrefix);

    host = generateConnection();
    pathPrefix = "PathPrefix";
    copyPasteService = new CopyPasteService(restStub, datasetServiceMocked);
    freshCopyPasteService = new CopyPasteService(restStub, datasetServiceMocked);

    memberEntity = { name: "Member1" };
    memberNode = new ZMemberNode(dataset, memberEntity, host, pathPrefix);

    datasetName = "TEST.DATASET";
    memberName = "MEMBER1";
});

describe("Copy member operations", () => {

    test("[POSITIVE TEST] Copy operation is available on member node", () => {
        expect(copyPasteService.canCopy(memberNode)).toBe(true);
    });

    test("[NEGATIVE TEST] Copy operation is not available on dataset node", () => {
        expect(copyPasteService.canCopy(datasetNode)).toBe(false);
    });

    test("[POSITIVE TEST] Member content is stored internally ready for paste operation", async () => {
        await copyPasteService.copy(host, datasetName, memberName);
        expect(copyPasteService.getMemberName()).toBe(memberName);
    });

});

describe("Paste member operations", () => {

    test("[POSITIVE TEST] Paste operation is available on member node", async () => {
        await copyPasteService.copy(host, datasetName, memberName);
        expect(copyPasteService.canPaste(datasetNode)).toBe(true);
    });

    test("[NEGATIVE TEST] Paste operation is not available because user didn't activate copy", () => {
        // run paste without having copied member before
        expect(freshCopyPasteService.canPaste(datasetNode)).toBe(false);
    });

    test("[NEGATIVE TEST] Paste target node is not a dataset", () => {
        expect(copyPasteService.canPaste(memberNode)).toBe(false);
    });

    test("[POSITIVE TEST] Paste the member from one dataset to another", async () => {
        const arg: string = await copyPasteService.paste(host, datasetName);
        expect(arg).toBe("SUCCESS!");
    });
});
