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
import { Dataset } from "../model/DSEntities";
import { DatasetService } from "../service/DatasetService";
import { createDummyDataset } from "./utils/DatasetUtils";
import { generateConnection } from "./utils/TestUtils";

const rest: any = {
    createDataset: jest.fn(),
    deleteMember: jest.fn(),
    getContent: jest.fn(),
    listDatasetsFullAttribute: jest.fn(),
    listMembers: jest.fn(),
    putContent: jest.fn(),
};

beforeEach(() => {
    for (const key of Object.keys(rest)) {
        rest[key].mockReset();
    }
});

describe("DatasetService", () => {
    const data = "Hello, World";
    const connection: Connection = generateConnection();
    const ds: DatasetService = new DatasetService(rest);
    const datasetName = "UNIT.TEST";
    const dataset: Dataset = createDummyDataset({ name: datasetName });
    const memberName = "MEMBER1";

    it("can create member", async () => {
        await ds.createMember(connection, datasetName, memberName);
        expect(rest.putContent).toBeCalledWith(connection, "", datasetName, memberName);
    });

    it("can allocate dataset like", async () => {
        await ds.allocateDatasetLike(connection, dataset, datasetName);
        const req = {
            allocationUnit: dataset.allocationUnit,
            averageBlock: 500,
            blockSize: dataset.blockSize,
            dataSetOrganization: dataset.dataSetOrganization,
            deviceType: dataset.deviceType,
            directoryBlocks: dataset.dataSetOrganization === "PS" ? 0 : 5,
            name: datasetName,
            primary: "10",
            recordFormat: dataset.recordFormat,
            recordLength: dataset.recordLength ? dataset.recordLength.toString() : "",
            secondary: "5",
            volumeSerial: dataset.volumeSerial,
        };
        expect(rest.createDataset).toBeCalledWith(connection, req);
    });

    it("can put content", async () => {
        await ds.putContent(connection, datasetName, memberName, data);
        expect(rest.putContent).toBeCalledWith(connection, data, datasetName, memberName);
    });

    it("can get content", async () => {
        rest.getContent.mockReturnValue(Promise.resolve(data));
        const result = await ds.getContent(connection, datasetName);
        expect(rest.getContent).toBeCalledWith(connection, datasetName);
        expect(result).toEqual(data);
    });

    it("can list datasets", async () => {
        rest.listDatasetsFullAttribute.mockReturnValue(Promise.resolve([dataset]));
        const filter = "FILTER";
        const result: Dataset[] = await ds.listDatasets(connection, filter);
        expect(rest.listDatasetsFullAttribute).toBeCalledWith(connection, filter);
        expect(result).toEqual([dataset]);
    });

    it("can list members", async () => {
        rest.listMembers.mockReturnValue(Promise.resolve([memberName]));
        const result = await ds.listMembers(connection, datasetName);
        expect(rest.listMembers).toBeCalledWith(connection, datasetName);
        expect(result).toEqual([memberName]);
    });

    it("can check if dataset exists", async () => {
        rest.listDatasetsFullAttribute.mockReturnValue(Promise.resolve([dataset]));
        const result = await ds.isDatasetExists(connection, datasetName);
        expect(rest.listDatasetsFullAttribute).toBeCalledWith(connection, datasetName);
        expect(result).toBe(true);
    });

    it("can check if member exists", async () => {
        rest.listMembers.mockReturnValue(Promise.resolve([memberName]));
        const result = await ds.isMemberExists(connection, datasetName, memberName);
        expect(rest.listMembers).toBeCalledWith(connection, datasetName);
        expect(result).toBe(true);
    });

    it("can delete member", async () => {
        await ds.deleteMember(connection, datasetName, memberName);
        expect(rest.deleteMember).toBeCalledWith(connection, datasetName, memberName);
    });
});
