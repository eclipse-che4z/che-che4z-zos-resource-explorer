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

jest.mock("../service/SettingsFacade");
import * as vscode from "vscode";
import { createConnection } from "../commands/CreateConnection";
import { SettingsFacade } from "../service/SettingsFacade";

describe("Create Connection", () => {
    SettingsFacade.listHosts = jest.fn(() => {
        return [{ name: "Host1", url: "http://url1:1234", username: "" },
               { name: "NewHost", url: "", username: "" },
               { name: "Host2", url: "http://url2:1234", username: "" }];
    });

    it("Creates Connection test", async () => {
        const showInputBoxListener = jest.spyOn(vscode.window, "showInputBox");
        const showInformationMessageListener = jest.spyOn(vscode.window, "showInformationMessage");
        await createConnection();
        expect(showInputBoxListener).toHaveReturned();
        expect(showInformationMessageListener).toHaveReturned();
    });

    it("Does not create a connection test", async () => {
        vscode.window.showInputBox = jest.fn(() => {
            return Promise.resolve("Host1");
        });
        const showErrorMessageListener = jest.spyOn(vscode.window, "showErrorMessage");
        await createConnection();
        expect(showErrorMessageListener).toHaveReturned();
    });

    it("Returns. Host name is undefined test", async () => {
        vscode.window.showInputBox = jest.fn(() => {
            return Promise.resolve(undefined);
        });
        expect(await createConnection()).toBeUndefined();
    });
});
