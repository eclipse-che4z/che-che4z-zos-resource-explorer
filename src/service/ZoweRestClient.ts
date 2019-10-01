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

import * as request from "request";
import { URL } from "url";
import { Connection } from "../model/Connection";
import { CredentialsService } from "./CredentialsService";

export class ZoweRestClient {
    constructor(private credentialsService: CredentialsService) {
        // no-op
    }
    /**
     * This API returns the caller’s current TSO userid.
     * [GET] /api/v1/datasets/username
     */
    public async getUsername(host: Connection): Promise<string> {
        const url = this.urlPrefix(host) + "username";
        return JSON.parse((await this.request(host, "GET", url)).body!).username;
    }

    /**
     * This API reads content from a sequential data set or member of a partitioned data set.
     * [GET] /api/v1/datasets/{dataSetName}/content
     */
    public async getContent(host: Connection, dataSetName: string): Promise<string> {
        const url = this.urlPrefix(host) + encodeURIComponent(dataSetName) + "/content";
        return JSON.parse((await this.request(host, "GET", url)).body!).records;
    }

    /**
     * This API writes content to a sequential data set or partitioned data set member.
     * [PUT] /api/v1/datasets/{dataSetName}/content
     */
    public async putContent(host: Connection, content: string, dataSetName: string, member?: string): Promise<string> {
        const target: string = member ? `${dataSetName}(${member})` : dataSetName;
        const url = this.urlPrefix(host) + encodeURIComponent(target) + "/content";
        return (await this.request(host, "PUT", url, JSON.stringify({ records: content }))).body!;
    }

    /**
     * @author zacan01
     * @param host - instance of ZOWE server defined in a connection
     * @param filter - the required dataset
     * @returns promise that contains the dataset list with full attributes
     * This API returns the list of data sets matching the filter (with full attributes)
     * [GET] /api/v1/datasets/{filter}
     */
    public async listDatasetsFullAttribute(host: Connection, filter: string): Promise<any> {
        const url = this.urlPrefix(host) + encodeURIComponent(filter);
        const result: RequestResult = await this.request(host, "GET", url);
        const items: any = JSON.parse(result.body!).items;
        items.sort(sortByName);
        return items;
    }
    /**
     * This API returns the list of data sets matching the filter
     * [GET] /api/v1/datasets/{filter}/list
     */
    public async listDatasets(host: Connection, filter: string): Promise<any> {
        const url = this.urlPrefix(host) + encodeURIComponent(filter) + "/list";
        const result: RequestResult = await this.request(host, "GET", url);
        const items: any = JSON.parse(result.body!).items;
        items.sort(sortByName);
        return items;
    }
    /**
     * This API returns a list of members for a given partitioned data set.
     * [GET] /api/v1/datasets/{dataSetName}/members
     */
    public async listMembers(host: Connection, datasetName: string): Promise<any> {
        const url = this.urlPrefix(host) + encodeURIComponent(datasetName) + "/members";
        return JSON.parse((await this.request(host, "GET", url)).body!).items;
    }

    /**
     * This API deletes a given member.
     * [DELETE] /api/v1/datasets/{dataSetName}
     * @param host
     * @param member
     */
    public async deleteMember(host: Connection, datasetName: string, memberName: string): Promise<any> {
        const url = this.urlPrefix(host) + encodeURIComponent(datasetName + "(" + memberName + ")");
        return (await this.request(host, "DELETE", url)).body!;
    }

    /**
     * This API create a new dataset.
     * [POST] /api/v1/datasets/
     * @author zacan01
     * @param host
     * @param dataset
     * @param newDatasetName
     */
    public async createDataset(host: Connection, restOptions: any): Promise<any> {
        return this.request(host, "POST", this.urlPrefix(host), JSON.stringify(restOptions));
    }

    // util method
    private urlPrefix(host: Connection): string {
        return (host.url.endsWith("/") ? host.url : host.url + "/") + "api/v1/datasets/";
    }

    // options parameters definition
    private prepareOptions(method: string, url: string, username?: string, password?: string, body?: string) {
        const header = body ? { "content-length": body.length } : {};
        const result = body ? { body } : {};
        return {
            ...{
                headers: {
                    ...{
                        "Authorization": "Basic " + Buffer.from(username + ":" + password).toString("base64"),
                        "Content-Type": "application/json",
                        "accept": "application/json",
                        "cache-control": "no-cache",
                    },
                    ...header,
                },
                host: new URL(url).hostname,
                method,
                rejectUnauthorized: false,
                url,
            },
            ...result,
        };
    }

    private async request(host: Connection, method: string, url: string, body?: string): Promise<RequestResult> {
        while (true) {
            const creds = await this.credentialsService.requestCredentials(host);
            if (!creds) {
                throw new Error("Canceled");
            }
            const options = this.prepareOptions(method, url, creds.username, creds.password, body);
            const result: RequestResult = await this.doRequest(options);
            if (result.response && result.response.statusCode === 401) {
                this.credentialsService.resetPassword(host);
                this.credentialsService.showErrorMessage("Invalid Credentials Provided");
                continue;
            }
            if (result.error) {
                throw new Error(result.error);
            }
            return result;
        }
    }

    // tslint:disable-next-line: cognitive-complexity
    private async doRequest(options: any): Promise<RequestResult> {
        return new Promise<any>((resolve: (arg: any) => void) => {
            request(options.url, options, (connectionError: any, response: request.Response, body: any) => {
                if (connectionError) {
                    return resolve({ connected: false, error: connectionError.message });
                }
                let error: string | undefined;
                if (!response.statusCode.toString().startsWith("2")) {
                    if (response.body) {
                        try {
                            error = JSON.parse(response.body).message;
                        } catch (ignore) {
                            error = response.body;
                        }
                    } else {
                        error = response.statusMessage;
                    }
                }
                resolve({ body, connected: true, response, error });
            });
        });
    }
}

interface RequestResult {
    canceled: boolean;
    error?: string;
    response?: request.Response;
    body?: string;
}

function sortByName(a: { name: string }, b: { name: string }) {
    if (a.name === b.name) {
        return 0;
    }
    return a.name > b.name ? 1 : -1;
}
