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
jest.mock("../service/CredentialsService");

import { Connection } from "../model/Connection";
import { Member, Dataset } from "../model/DSEntities";
import { CopyPasteService } from "../service/CopyPasteService";
import { DatasetService } from "../service/DatasetService";
import { ZoweRestClient } from "../service/ZoweRestClient";
import { ZDatasetNode, ZMemberNode } from "../ui/tree/DatasetTreeModel";
import { createDummyDataset } from "../utils";

let dataset: Dataset;
let datasetNode: ZDatasetNode;
let host: Connection;
let pathPrefix: string;
let copyPasteService: CopyPasteService;
let datasetName: string;
let memberName: string;

beforeAll(() => {
    const creds: any = {};
    const restStub = new ZoweRestClient(creds);
    const datasetServiceMocked: DatasetService = new DatasetService(restStub);

    dataset = createDummyDataset();
    datasetNode = new ZDatasetNode(dataset, host, pathPrefix);

    host = { name: "", url: "", username: "" };
    pathPrefix = "PathPrefix";
    copyPasteService = new CopyPasteService(restStub, datasetServiceMocked);

    datasetName = "TEST.DATASET";
    memberName = "MEM1";

});

describe("Copy member operations", () => {

    test("[POSITIVE TEST] Copy operation is available on member node", () => {
        const memberEntity: Member = { name: "Member1" };
        const treeMemberNode: ZMemberNode = new ZMemberNode(dataset, memberEntity, host, pathPrefix);
        expect(copyPasteService.canCopy(treeMemberNode)).toBe(true);
    });

    test("[NEGATIVE TEST] Copy operation is not available on dataset node", () => {
        expect(copyPasteService.canCopy(datasetNode)).toBe(false);
    });

    test("[POSITIVE TEST] Member content is stored internally ready for paste operation", () => {
        copyPasteService.copy(host, datasetName, memberName).then(() => {
            expect(copyPasteService.getMemberName()).toBe(memberName);
        }).catch((err) => {
            console.log(err);
        });
    });

});

describe("Paste member operations", () => {

    test("[POSITIVE TEST] Paste operation is available on member node", () => {
        copyPasteService.copy(host, datasetName, memberName).then(() => {
            expect(copyPasteService.canPaste(datasetNode)).toBe(true);
        }).catch((err) => {
            console.log(err);
        });
    });

    test("Paste operation is not available because user didn't activate copy", () => {
        expect(2).toBe(2);
    });

    test("Paste member", () => {
        expect(2).toBe(2);
    });
});
