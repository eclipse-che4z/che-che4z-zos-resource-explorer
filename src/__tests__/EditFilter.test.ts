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

jest.mock("vscode");
jest.mock("../utils");
jest.mock("../service/SettingsFacade");

import * as vscode from "vscode";
import { editFilter } from "../commands/EditFilter";
import { SettingsFacade } from "../service/SettingsFacade";

describe("Edit a Filter", () => {
    it("Edits a Filter", async () => {
        const args: any = {filter: {name: "", value: ""},
        host: {name: "", url: "", username: ""}, type: "datasetsFilter"};
        vscode.window.showInputBox = jest.fn().mockReturnValue(Promise.resolve("NameOfMember"));
        SettingsFacade.editFilter = jest.fn();
        await editFilter(args);
        expect(vscode.window.showInputBox).toHaveBeenCalled();
        expect(SettingsFacade.editFilter).toHaveBeenCalled();
    });
    it("Tries to edit a non Filter node so it returns", async () => {
        jest.clearAllMocks();
        const args: any = {filter: {name: "", value: ""},
        host: {name: "", url: "", username: ""}, type: ""};
        vscode.window.showInputBox = jest.fn().mockReturnValue(Promise.resolve("NameOfMember"));
        SettingsFacade.editFilter = jest.fn();
        await editFilter(args);
        expect(vscode.window.showInputBox).toHaveBeenCalledTimes(0);
        expect(SettingsFacade.editFilter).toHaveBeenCalledTimes(0);
    });
    it("Does not edit the filter", async () => {
        jest.clearAllMocks();
        const args: any = {filter: {name: "", value: ""},
        host: {name: "", url: "", username: ""},type: "datasetsFilter"};
        vscode.window.showInputBox = jest.fn().mockReturnValue(Promise.resolve(undefined));
        SettingsFacade.editFilter = jest.fn();
        await editFilter(args);
        expect(vscode.window.showInputBox).toHaveBeenCalledTimes(1);
        expect(SettingsFacade.editFilter).toHaveBeenCalledTimes(0);
    });
});
