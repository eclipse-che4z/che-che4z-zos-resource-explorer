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
import { DatasetCache, PATH_SEPARATOR } from "../service/DatasetCache";
import { DatasetService } from "../service/DatasetService";
import { ZoweRestClient } from "../service/ZoweRestClient";
import { ZNode } from "../ui/tree/DatasetTreeModel";

describe("DatasetCache", () => {
    it("should return cached objec", () => {
        const cache: DatasetCache = new DatasetCache();
        const path = "element.id";
        const node: ZNode = new ZNode(path);
        cache.cache(path + PATH_SEPARATOR, node);
        expect(cache.loadFromCache(path)).toEqual([node]);
    });
    it("should not return cached object after invalidate", () => {
        const cache: DatasetCache = new DatasetCache();
        const path = "element.id";
        const node: ZNode = new ZNode(path);
        cache.cache(path + PATH_SEPARATOR, node);
        cache.invalidate([]);
        expect(cache.loadFromCache(path)).toBeUndefined();
    });
});

describe("DatasetService", () => {
    const host: Connection = { name: "", url: "", username: "" };
    const filter: string = "";
    const result: string[] = ["M1", "M2", "M3"];

    const creds: any = {};
    const restStub = new ZoweRestClient(creds);

    test("can list dataset members", async () => {
        const datasetService: DatasetService = new DatasetService(restStub);
        expect(await datasetService.listMembers(host, filter)).toEqual(result);
    });
});
