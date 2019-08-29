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

jest.mock("../CredentialsService");

import { Connection } from "../../model/Connection";
import { CredentialsService } from "../CredentialsService";

export class ZoweRestClient {
    constructor(private credentialsService: CredentialsService) {
        // no-op
    }

    public async listMembers(host, datasetName): Promise<any> {
        return ["M1", "M2", "M3"];
    }

    public async putContent(host: Connection, content: string, dataSetName: string, member: string): Promise<string> {
        // const target: string = member ? `${dataSetName}(${member})` : dataSetName;
        // const url = this.urlPrefix(host) + encodeURIComponent(target) + "/content";
        return "SUCCESS!";
    }

    public async getContent(host: Connection, dataSetName: string): Promise<string> {
        // const url = this.urlPrefix(host) + encodeURIComponent(dataSetName) + "/content";
        return JSON.parse("{ records: '' }").body!.records;
    }
}
