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

import * as vscode from "vscode";
import { createFilter } from "../commands/CreateFilter";
import { SettingsFacade } from "../service/SettingsFacade";

describe("Create filter", () => {
    it("Creates a filter", async () => {
        const args: any = {host: {name: "", url: "", username: ""}};
        vscode.window.showInputBox = jest.fn().mockReturnValue(Promise.resolve("NameOfMember"));
        SettingsFacade.createFilter = jest.fn();
        await createFilter(args);
        expect(vscode.window.showInputBox).toHaveBeenCalled();
        expect(SettingsFacade.createFilter).toHaveBeenCalled();
    });
});
