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

import * as vscode from "vscode";
import { copyMember } from "../commands/CopyMember";

describe("Copy Member", () => {
    it("Copies a member", async () => {
        const copyPasteService: any = {
            canCopy : jest.fn().mockReturnValue(true),
            copy : jest.fn().mockReturnValue(undefined),
        };
        const withProgressListener = jest.spyOn(vscode.window, "withProgress");
        const canCopyListener = jest.spyOn(copyPasteService, "canCopy");
        const copyListener = jest.spyOn(copyPasteService, "copy");
        await copyMember(copyPasteService, {host: "", dataset: "", member: ""});
        expect(canCopyListener).toHaveReturnedWith(true);
        expect(withProgressListener).toHaveReturned();
        expect(copyListener).toHaveReturned();
    });
    it("Copies a member but fails", async () => {
        const copyPasteService: any = {
            canCopy : jest.fn().mockReturnValue(true),
            copy : jest.fn().mockImplementation(() => {
                throw new Error();
            }),
        };
        const showErrorMessageListener = jest.spyOn(vscode.window, "showErrorMessage");
        await copyMember(copyPasteService, {host: "", dataset: "", member: ""});
        expect(showErrorMessageListener).toBeCalledTimes(1);
    });
    it("Cannot copy", async () => {
        const copyPasteService: any = {
            canCopy : jest.fn().mockReturnValue(false),
            copy : jest.fn().mockReturnValue(undefined),
        };
        const canCopyListener = jest.spyOn(copyPasteService, "canCopy");
        const copyListener = jest.spyOn(copyPasteService, "copy");
        await copyMember(copyPasteService, {host: "", dataset: "", member: ""});
        expect(canCopyListener).toHaveReturnedWith(false);
        expect(copyListener).toBeCalledTimes(0);
    });
 });
