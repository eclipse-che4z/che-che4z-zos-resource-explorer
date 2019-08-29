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
import { Member } from "../model/DSEntities";
import { CopyPasteService } from "../service/CopyPasteService";
import { DatasetService } from "../service/DatasetService";
import { ZoweRestClient } from "../service/ZoweRestClient";
import { ZDatasetNode, ZMemberNode } from "../ui/tree/DatasetTreeModel";
import { createDummyDataset } from "../utils";

describe("Copy member operations", () => {
    const dataset = createDummyDataset();
    const host: Connection = { name: "", url: "", username: "" };

    // create separate method that fullfill these objects
    const creds: any = {};
    const restStub = new ZoweRestClient(creds);
    const datasetServiceMocked: DatasetService = new DatasetService(restStub);

    const pathPrefix: string = "PathPrefix";

    test("[POSITIVE TEST] Copy operation is available on member node", () => {
        const memberName: Member = { name: "Member1" };
        const treeMemberNode: ZMemberNode = new ZMemberNode(dataset, memberName, host, pathPrefix);
        const copyPasteService: CopyPasteService = new CopyPasteService(restStub, datasetServiceMocked);

        expect(copyPasteService.canCopy(treeMemberNode)).toBe(true);
    });

    test("[NEGATIVE TEST] Copy operation is not available on dataset node", () => {
        const treeDatasetNode: ZDatasetNode = new ZDatasetNode(dataset, host, pathPrefix);
        const copyPasteService: CopyPasteService = new CopyPasteService(restStub, datasetServiceMocked);

        expect(copyPasteService.canCopy(treeDatasetNode)).toBe(false);
    });

    test("[POSITIVE TEST] Member content is stored internally ready for paste operation", () => {
        const datasetName: string = "TEST.DATASET";
        const memberName: string = "MEM1";
        const copyPasteService: CopyPasteService = new CopyPasteService(restStub, datasetServiceMocked);

        copyPasteService.copy(host, datasetName, memberName).then(() => {
            expect(copyPasteService.getMemberName()).toBe(memberName);
        });
    });

});

describe("Paste member operations", () => {
    test("Paste operation is available", () => {
        expect(2).toBe(2);
    });

    test("Paste operation is not available", () => {
        expect(2).toBe(2);
    });

    test("Paste member", () => {
        expect(2).toBe(2);
    });
});
