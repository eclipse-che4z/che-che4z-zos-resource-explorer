
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
jest.mock("../service/SettingsFacade");
jest.mock("vscode");

import * as vscode from "vscode";
import { editConnection } from "../commands/EditConnection";
import { DefaultCredentialsService } from "../service/CredentialsService";
import { DatasetCache } from "../service/DatasetCache";
import { DatasetEditManager } from "../service/DatasetEditManager";
import { DatasetService } from "../service/DatasetService";
import { SettingsFacade } from "../service/SettingsFacade";
import { ZoweRestClient } from "../service/ZoweRestClient";
import { DatasetDataProvider } from "../ui/tree/DatasetDataProvider";

describe("Edit Connection", () => {
    SettingsFacade.listHosts = jest.fn(() => {
        return [{ name: "Host1", url: "http://url1:1234", username: "" },
               { name: "NewHost", url: "", username: "" },
               { name: "Host2", url: "http://url2:1234", username: "" }];
    });
    const arg = {host: {name: "Host1", url: "http://url1:1234", username: "" }};
    const cache: DatasetCache = new DatasetCache();
    const service: DefaultCredentialsService = new DefaultCredentialsService();
    const client: ZoweRestClient = new ZoweRestClient(service);
    const datasetService: DatasetService = new DatasetService(client);
    const datasetEditManager: DatasetEditManager = new DatasetEditManager(datasetService);
    const provider: DatasetDataProvider = new DatasetDataProvider({} as any ,
        datasetEditManager,
        cache,
        datasetService);

    it("Update Connection test", async () => {
        const showInputBoxListener = jest.spyOn(vscode.window, "showInputBox");
        const showInformationMessageListener = jest.spyOn(vscode.window, "showInformationMessage");
        await editConnection(provider, arg);
        expect(showInputBoxListener).toHaveReturned();
        expect(showInformationMessageListener).toHaveReturned();
        });

    it("Does not edit a connection test", async () => {
        vscode.window.showInputBox = jest.fn(() => {
            return Promise.resolve("Host2");
        });
        const showErrorMessageListener = jest.spyOn(vscode.window, "showErrorMessage");
        await editConnection(provider, arg);
        expect(showErrorMessageListener).toHaveReturned();
    });
    it("Returns. Host name is undefined test", async () => {
        vscode.window.showInputBox = jest.fn(() => {
            return Promise.resolve(undefined);
        });
        expect(await editConnection(provider, arg)).toBeUndefined();
    });

});
