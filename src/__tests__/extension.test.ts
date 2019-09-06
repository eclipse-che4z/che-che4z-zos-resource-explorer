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
import { activate } from "../extension";

describe("Extension entry point test", () => {
    it("should initialize zosexplorer", async () => {
        const context: any = {
            asAbsolutePath: jest.fn(),
            subscriptions: {
                push: jest.fn(),
            },
        };
        const zosexplorer: any = {
            onDidCollapseElement: jest.fn(),
            onDidExpandElement: jest.fn(),
        };

        vscode.window.createTreeView = jest.fn().mockReturnValue(zosexplorer);

        activate(context);

        expect(vscode.window.createTreeView).toBeCalled();
        expect(zosexplorer.onDidCollapseElement).toBeCalled();
        expect(zosexplorer.onDidExpandElement).toBeCalled();
        expect(context.subscriptions.push).toBeCalledWith(zosexplorer);
    });
});
