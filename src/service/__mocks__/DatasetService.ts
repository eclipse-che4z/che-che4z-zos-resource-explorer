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
jest.mock("../ZoweRestClient");

import { Connection } from "../../model/Connection";
import { ZoweRestClient } from "../ZoweRestClient";

export class DatasetService {
    constructor(private rest: ZoweRestClient) {}

    public async putContent(
        connection: Connection,
        datasetName: string,
        memberName: string,
        data: string,
    ) {
        return this.rest.putContent(connection, data, datasetName, memberName);
    }

    public async getContent(
        connection: Connection,
        datasetName: string,
    ): Promise<string> {
        return this.rest.getContent(connection, datasetName);
    }
}
