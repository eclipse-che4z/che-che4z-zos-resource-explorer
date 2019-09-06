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

import { Connection } from "../model/Connection";
import { Dataset, Filter } from "../model/DSEntities";
import { DatasetCache, PATH_SEPARATOR } from "../service/DatasetCache";
import { createFilterPath, ZDatasetNode, ZNode } from "../ui/tree/DatasetTreeModel";
import { createDummyDataset } from "./utils/DatasetUtils";

describe("DatasetCache", () => {
    describe("Base Logic", () => {
        const path = "element.id";
        const node: ZNode = new ZNode(path);

        it("should return cached objec", () => {
            const cache: DatasetCache = new DatasetCache();
            cache.cache(path + PATH_SEPARATOR, node);
            expect(cache.loadFromCache(path)).toEqual([node]);
        });
        it("should not return cached object after invalidate", () => {
            const cache: DatasetCache = new DatasetCache();
            cache.cache(path + PATH_SEPARATOR, node);
            cache.invalidate([]);
            expect(cache.loadFromCache(path)).toBeUndefined();
        });
        it("should not return cached object after reset cache", () => {
            const cache: DatasetCache = new DatasetCache();
            cache.cache(path + PATH_SEPARATOR, node);
            cache.reset();
            expect(cache.loadFromCache(path)).toBeUndefined();
        });
        it("should not return cached object after reset path", () => {
            const cache: DatasetCache = new DatasetCache();
            cache.cache(path + PATH_SEPARATOR, node);
            cache.reset(path);
            expect(cache.loadFromCache(path)).toBeUndefined();
        });
    });
    describe("Type specific logic", () => {
        const filter: Filter = { name: "filter", value: "value" };
        const connection: Connection = {
            filters: [filter],
            name: "connection",
            url: "http://localhost:123123/",
            username: "userName",
        };
        const prefix: string = createFilterPath(connection, filter);
        const dataset: Dataset = createDummyDataset({ name: "TEST.DS"});
        const datasetNode: ZDatasetNode = new ZDatasetNode(dataset, connection, prefix);

        it("should return cached object after invalidate if connection was not removed", () => {
            const cache: DatasetCache = new DatasetCache();
            cache.cache(datasetNode.path + PATH_SEPARATOR, datasetNode);
            cache.invalidate([connection]);
            expect(cache.loadFromCache(datasetNode.path)).toEqual([datasetNode]);
        });
        it("should not return cached dataset after host reset", () => {
            const cache: DatasetCache = new DatasetCache();
            cache.cache(datasetNode.path + PATH_SEPARATOR, datasetNode);
            cache.resetHost(connection);
            expect(cache.loadFromCache(datasetNode.path)).toBeUndefined();
        });
        it("should not return cached dataset after host reset filter", () => {
            const cache: DatasetCache = new DatasetCache();
            cache.cache(datasetNode.path + PATH_SEPARATOR, datasetNode);
            cache.resetFilter(connection, filter);
            expect(cache.loadFromCache(datasetNode.path)).toBeUndefined();
        });
    });
});
