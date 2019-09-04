
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

jest.mock("../service/CredentialsService");
jest.mock("../service/ZoweRestClient");
jest.mock("../ui/tree/DatasetDataProvider");
jest.mock("../service/DatasetService");
jest.mock("vscode");
jest.mock("../utils");

import * as vscode from "vscode";
import { createMember } from "../commands/CreateMember";
import { DefaultCredentialsService } from "../service/CredentialsService";
import { DatasetCache } from "../service/DatasetCache";
import { DatasetEditManager } from "../service/DatasetEditManager";
import { DatasetService } from "../service/DatasetService";
import { ZoweRestClient } from "../service/ZoweRestClient";
import { DatasetDataProvider } from "../ui/tree/DatasetDataProvider";

describe("Create Member", () => {
    const service: DefaultCredentialsService = new DefaultCredentialsService();
    const cache: DatasetCache = new DatasetCache();
    const client: ZoweRestClient = new ZoweRestClient(service);
    const datasetService: DatasetService = new DatasetService(client);
    const datasetEditManager: DatasetEditManager = new DatasetEditManager(datasetService);
    const provider: DatasetDataProvider = new DatasetDataProvider({} as any ,
        datasetEditManager,
        cache,
        datasetService);

    it("Creates Member test", async () => {
        const showInputBoxListener = jest.spyOn(vscode.window, "showInputBox");
        const withProgressListener = jest.spyOn(vscode.window, "withProgress");
        const dsCreateMemberListener = jest.spyOn(datasetService, "createMember");
        const memberExistsListener = jest.spyOn(datasetService, "isMemberExists");
        await createMember(datasetService, cache, provider, {host: "", dataset: ""});
        expect(showInputBoxListener).toHaveReturned();
        expect(withProgressListener).toHaveReturned();
        expect(dsCreateMemberListener).toHaveReturned();
        expect(memberExistsListener).toHaveReturned();
    });
    it("Should fail while trying to create a member, due to undefined arguments", async () => {
        const showErrorMessageListener = jest.spyOn(vscode.window, "showErrorMessage");
        await createMember(datasetService, cache, provider, undefined);
        expect(showErrorMessageListener).toBeCalledTimes(1);
    });
    it("Should fail while trying to create a member, due to undefined arguments", async () => {
        const showErrorMessageListener = jest.spyOn(vscode.window, "showErrorMessage");
        await createMember(datasetService, cache, provider, {});
        expect(showErrorMessageListener).toBeCalledTimes(2);
    });
});
