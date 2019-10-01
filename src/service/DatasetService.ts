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
import { Dataset } from "../model/DSEntities";
import { ZoweRestClient } from "./ZoweRestClient";

export interface DatasetError {
    severity: number;
    message: string;
}

export class DatasetService {
    constructor(private rest: ZoweRestClient) {}

    public async createMember(connection: Connection, datasetName: string, memberName: string, data?: string) {
        await this.rest.putContent(connection, data ? data : "", datasetName, memberName);
    }

    public async allocateDatasetLike(connection: Connection, source: Dataset, newDatasetName: string) {
        const req = this.prepareBodyForCreateDatasetPostApi(source, newDatasetName);
        await this.rest.createDataset(connection, req);
    }

    // TODO PO support
    public async putContent(connection: Connection, datasetName: string, memberName: string|undefined, data: string) {
        return this.rest.putContent(connection, data, datasetName, memberName);
    }

    public async getContent(connection: Connection, datasetName: string): Promise<string> {
        return this.rest.getContent(connection, datasetName);
    }

    public async listDatasets(connection: Connection, filter: string): Promise<Dataset[]> {
        return this.rest.listDatasetsFullAttribute(connection, filter);
    }

    public async listMembers(connection: Connection, datasetName: string): Promise<string[]> {
        return this.rest.listMembers(connection, datasetName);
    }

    public async isDatasetExists(connection: Connection, datasetName: string): Promise<boolean> {
        const dataset: Set<string> = new Set();
        (await this.listDatasets(connection, datasetName)).forEach((ds: Dataset) => dataset.add(ds.name));
        return dataset.has(datasetName);
    }

    public async isMemberExists(connection: Connection, datasetName: string, memberName: string): Promise<boolean> {
        const members: Set<string> = new Set(await this.listMembers(connection, datasetName));
        return members.has(memberName);
    }

    public async deleteMember(connection: Connection, datasetName: string, memberName: string) {
        return this.rest.deleteMember(connection, datasetName, memberName);
    }

    private prepareBodyForCreateDatasetPostApi(dataset: any, newDatasetName: string): object {
        let result: any;
        let directoryBlocks: any = 5;
        if (dataset.dataSetOrganization === "PS") {
            directoryBlocks = 0;
        }

        result = {
            allocationUnit: dataset.allocationUnit,
            averageBlock: 500,
            name: newDatasetName,
            primary: "10",
            secondary: "5",
            // tslint:disable-next-line: object-literal-sort-keys
            directoryBlocks,
            dataSetOrganization: dataset.dataSetOrganization,
            recordFormat: dataset.recordFormat,
            recordLength: dataset.recordLength ? dataset.recordLength.toString() : "",
            volumeSerial: dataset.volumeSerial,
            deviceType: dataset.deviceType,
            blockSize: dataset.blockSize,
        };
        return result;
    }
}
