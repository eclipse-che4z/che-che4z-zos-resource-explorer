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
import { copyMember } from "../commands/CopyMember";

describe("Copy Member", () => {
    const emptyNode = { host: "", dataset: "", member: "" };
    it("Copies a member", async () => {
        const copyPasteService: any = {
            canCopy: jest.fn().mockReturnValue(true),
            copy: jest.fn().mockReturnValue(undefined),
        };
        const withProgressListener = jest.spyOn(vscode.window, "withProgress");
        await copyMember(copyPasteService, emptyNode);
        expect(copyPasteService.canCopy).toBeCalled();
        expect(withProgressListener).toHaveReturned();
        expect(copyPasteService.copy).toBeCalled();
    });
    it("Copies a member but fails", async () => {
        const copyPasteService: any = {
            canCopy: jest.fn().mockReturnValue(true),
            copy: jest.fn().mockImplementation(() => {
                throw new Error();
            }),
        };
        vscode.window.showErrorMessage = jest.fn();
        await copyMember(copyPasteService, emptyNode);
        expect(vscode.window.showErrorMessage).toBeCalledTimes(1);
    });
    it("Cannot copy", async () => {
        const copyPasteService: any = {
            canCopy: jest.fn().mockReturnValue(false),
            copy: jest.fn().mockReturnValue(undefined),
        };
        await copyMember(copyPasteService, emptyNode);
        expect(copyPasteService.canCopy).toHaveReturnedWith(false);
        expect(copyPasteService.copy).toBeCalledTimes(0);
    });
});
