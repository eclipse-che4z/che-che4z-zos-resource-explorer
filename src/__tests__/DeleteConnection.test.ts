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
import { deleteConnection } from "../commands/DeleteConnection";
import { SettingsFacade } from "../service/SettingsFacade";
import { generateConnection } from "./utils/TestUtils";

describe("DeleteConnection command test", () => {
    it("should call for delete", async () => {
        const oldImpl = SettingsFacade.deleteHostByName;
        SettingsFacade.deleteHostByName = jest.fn();
        vscode.window.showWarningMessage = jest.fn().mockReturnValue(Promise.resolve("OK"));
        try {
            const connection = generateConnection();
            await deleteConnection({ host: connection });
            expect(SettingsFacade.deleteHostByName).toHaveBeenCalledWith(connection.name);
        } finally {
            SettingsFacade.deleteHostByName = oldImpl;
        }
    });
});
