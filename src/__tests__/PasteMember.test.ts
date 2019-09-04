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

import * as vscode from "vscode";
import { pasteMember } from "../commands/PasteMember";

let cache: any;
let datasetDataProvider: any;
const args: any = {host: "", dataset: "", memberName: ""};

beforeEach(() => {
        cache = {
            resetDataset: jest.fn(),
        };
        datasetDataProvider = {
            refresh: jest.fn(),
        };
    });

describe("Paste member", () => {
    it("Pastes a member", async () => {
         const copyPasteService: any = {
             canPaste: jest.fn().mockReturnValue(true),
             getMemberName: jest.fn().mockReturnValue("member"),
             paste: jest.fn(),
             setMemberName: jest.fn(),
         };
         const datasetService: any = {
             isMemberExists: jest.fn().mockReturnValue(false),
        };
         await pasteMember(datasetService, copyPasteService, cache, datasetDataProvider, args);
         expect(copyPasteService.canPaste).toHaveReturned();
         expect(datasetService.isMemberExists).toHaveReturned();
         expect(copyPasteService.paste).toHaveReturned();
         expect(cache.resetDataset).toHaveReturned();
         expect(datasetDataProvider.refresh).toHaveReturned();
     });
    it("Cannot copy", async () => {
        const copyPasteService: any = {
            canPaste: jest.fn().mockReturnValue(false),
            getMemberName: jest.fn().mockReturnValue("member"),
            paste: jest.fn(),
            setMemberName: jest.fn(),
        };
        const datasetService: any = {
            isMemberExists: jest.fn().mockReturnValue(false),
       };
        await pasteMember(datasetService, copyPasteService, cache, datasetDataProvider, args);
        expect(copyPasteService.canPaste).toHaveReturnedWith(false);
        expect(datasetService.isMemberExists).toHaveReturnedTimes(0);
        expect(copyPasteService.paste).toHaveReturnedTimes(0);
        expect(cache.resetDataset).toHaveReturnedTimes(0);
        expect(datasetDataProvider.refresh).toHaveReturnedTimes(0);
     });
    it("Throws error", async () => {
        const copyPasteService: any = {
            canPaste: jest.fn().mockReturnValue(true),
            getMemberName: jest.fn().mockReturnValue("member"),
            paste: jest.fn(),
            setMemberName: jest.fn(),
        };
        const datasetService: any = {
            isMemberExists: jest.fn().mockImplementation(() => {
                throw new Error();
            }),
       };
        const showErrorMessageListener = jest.spyOn(vscode.window, "showErrorMessage");
        await pasteMember(datasetService, copyPasteService, cache, datasetDataProvider, args);
        expect(copyPasteService.canPaste).toHaveReturnedWith(true);
        expect(datasetService.isMemberExists).toHaveReturnedTimes(0);
        expect(copyPasteService.paste).toHaveReturnedTimes(0);
        expect(showErrorMessageListener).toHaveReturned();
        expect(cache.resetDataset).toHaveReturnedTimes(0);
        expect(datasetDataProvider.refresh).toHaveReturnedTimes(0);
     });
    it("Member already exists", async () => {
        const copyPasteService: any = {
            canPaste: jest.fn().mockReturnValue(true),
            getMemberName: jest.fn().mockReturnValue("member"),
            paste: jest.fn(),
            setMemberName: jest.fn(),
        };
        const datasetService: any = {
            isMemberExists: jest.fn()
            .mockReturnValueOnce(true)
            .mockReturnValueOnce(false),
       };
        const showInputBoxListener = jest.spyOn(vscode.window, "showInputBox");
        const showErrorMessageListener = jest.spyOn(vscode.window, "showErrorMessage");
        await pasteMember(datasetService, copyPasteService, cache, datasetDataProvider, args);
        expect(copyPasteService.canPaste).toHaveReturned();
        expect(datasetService.isMemberExists).toHaveReturned();
        expect(copyPasteService.paste).toHaveReturned();
        expect(showInputBoxListener).toHaveReturned();
        expect(showErrorMessageListener).toHaveReturned();
        expect(cache.resetDataset).toHaveReturned();
        expect(datasetDataProvider.refresh).toHaveReturned();
     });
 });
