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

describe("Paste member", () => {
    const args: any = {host: "", dataset: "", memberName: ""};
    it("Pastes a member", async () => {
         const copyPasteService: any = {
             canPaste: jest.fn().mockReturnValue(true),
             getMemberName: jest.fn().mockReturnValue("member"),
             paste: jest.fn().mockImplementation(() => {
                return ;
            }),
             setMemberName: jest.fn().mockImplementation(() => {
                 return ;
             }),
         };
         const datasetService: any = {
             isMemberExists: jest.fn().mockReturnValue(false),

        };
         const cache: any = {
            resetDataset: jest.fn().mockImplementation(() => {
                return;
            }),
        };
         const datasetDataProvider: any = {
            refresh: jest.fn().mockImplementation(() => {
                return;
            }),
        };
         const canPasteListener = jest.spyOn(copyPasteService, "canPaste");
         const pasteListener = jest.spyOn(copyPasteService, "paste");
         const isMemberExistsListener = jest.spyOn(datasetService, "isMemberExists");
         const resetDatasetListener = jest.spyOn(cache, "resetDataset");
         const refreshListener = jest.spyOn(datasetDataProvider, "refresh");
         await pasteMember(datasetService, copyPasteService, cache, datasetDataProvider, args);
         expect(canPasteListener).toHaveReturned();
         expect(isMemberExistsListener).toHaveReturned();
         expect(pasteListener).toHaveReturned();
         expect(resetDatasetListener).toHaveReturned();
         expect(refreshListener).toHaveReturned();
     });
    it("Cannot copy", async () => {
        const copyPasteService: any = {
            canPaste: jest.fn().mockReturnValue(false),
            getMemberName: jest.fn().mockReturnValue("member"),
            paste: jest.fn().mockImplementation(() => {
               return ;
           }),
            setMemberName: jest.fn().mockImplementation(() => {
                return ;
            }),
        };
        const datasetService: any = {
            isMemberExists: jest.fn().mockReturnValue(false),
       };
        const cache: any = {
        resetDataset: jest.fn().mockImplementation(() => {
            return;
        }),
    };
        const datasetDataProvider: any = {
        refresh: jest.fn().mockImplementation(() => {
            return;
        }),
    };
        const canPasteListener = jest.spyOn(copyPasteService, "canPaste");
        const pasteListener = jest.spyOn(copyPasteService, "paste");
        const isMemberExistsListener = jest.spyOn(datasetService, "isMemberExists");
        const resetDatasetListener = jest.spyOn(cache, "resetDataset");
        const refreshListener = jest.spyOn(datasetDataProvider, "refresh");
        await pasteMember(datasetService, copyPasteService, cache, datasetDataProvider, args);
        expect(canPasteListener).toHaveReturnedWith(false);
        expect(isMemberExistsListener).toHaveReturnedTimes(0);
        expect(pasteListener).toHaveReturnedTimes(0);
        expect(resetDatasetListener).toHaveReturnedTimes(0);
        expect(refreshListener).toHaveReturnedTimes(0);
     });
    it("Throws error", async () => {
        const copyPasteService: any = {
            canPaste: jest.fn().mockReturnValue(true),
            getMemberName: jest.fn().mockReturnValue("member"),
            paste: jest.fn().mockImplementation(() => {
               return ;
           }),
            setMemberName: jest.fn().mockImplementation(() => {
                return ;
            }),
        };
        const datasetService: any = {
            isMemberExists: jest.fn().mockImplementation(() => {
                throw new Error();
            }),
       };
        const cache: any = {
        resetDataset: jest.fn().mockImplementation(() => {
            return;
        }),
    };
        const datasetDataProvider: any = {
        refresh: jest.fn().mockImplementation(() => {
            return;
        }),
    };
        const canPasteListener = jest.spyOn(copyPasteService, "canPaste");
        const pasteListener = jest.spyOn(copyPasteService, "paste");
        const isMemberExistsListener = jest.spyOn(datasetService, "isMemberExists");
        const showErrorMessageListener = jest.spyOn(vscode.window, "showErrorMessage");
        const resetDatasetListener = jest.spyOn(cache, "resetDataset");
        const refreshListener = jest.spyOn(datasetDataProvider, "refresh");
        await pasteMember(datasetService, copyPasteService, cache, datasetDataProvider, args);
        expect(canPasteListener).toHaveReturnedWith(true);
        expect(isMemberExistsListener).toHaveReturnedTimes(0);
        expect(pasteListener).toHaveReturnedTimes(0);
        expect(showErrorMessageListener).toHaveReturned();
        expect(resetDatasetListener).toHaveReturnedTimes(0);
        expect(refreshListener).toHaveReturnedTimes(0);
     });
    it("Member already exists", async () => {
        const copyPasteService: any = {
            canPaste: jest.fn().mockReturnValue(true),
            getMemberName: jest.fn().mockReturnValue("member"),
            paste: jest.fn().mockImplementation(() => {
               return ;
           }),
            setMemberName: jest.fn().mockImplementation(() => {
                return ;
            }),
        };
        const datasetService: any = {
            isMemberExists: jest.fn()
            .mockReturnValueOnce(true)
            .mockReturnValueOnce(false),
       };
        const cache: any = {
        resetDataset: jest.fn().mockImplementation(() => {
            return;
        }),
    };
        const datasetDataProvider: any = {
        refresh: jest.fn().mockImplementation(() => {
            return;
        }),
    };
        const canPasteListener = jest.spyOn(copyPasteService, "canPaste");
        const pasteListener = jest.spyOn(copyPasteService, "paste");
        const isMemberExistsListener = jest.spyOn(datasetService, "isMemberExists");
        const showInputBoxListener = jest.spyOn(vscode.window, "showInputBox");
        const showErrorMessageListener = jest.spyOn(vscode.window, "showErrorMessage");
        const resetDatasetListener = jest.spyOn(cache, "resetDataset");
        const refreshListener = jest.spyOn(datasetDataProvider, "refresh");
        await pasteMember(datasetService, copyPasteService, cache, datasetDataProvider, args);
        expect(canPasteListener).toHaveReturned();
        expect(isMemberExistsListener).toHaveReturned();
        expect(pasteListener).toHaveReturned();
        expect(showInputBoxListener).toHaveReturned();
        expect(showErrorMessageListener).toHaveReturned();
        expect(resetDatasetListener).toHaveReturned();
        expect(refreshListener).toHaveReturned();
     });
 });
