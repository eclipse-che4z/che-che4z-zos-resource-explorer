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
jest.mock("../service/SettingsFacade");

import * as vscode from "vscode";
import { deleteMember } from "../commands/DeleteMember";
import { SettingsFacade } from "../service/SettingsFacade";
import { createDummyDataset } from "../utils";

let cache: any;
let datasetDataProvider: any;
const args: any = {
    dataset: createDummyDataset(),
    host: { name: "OK" },
    member: { name: "name" },
    type: "member",
};

beforeEach(() => {
    cache = {
        resetMember: jest.fn(),
    };
    datasetDataProvider = {
        refresh: jest.fn(),
    };
});

describe("Delete a member", () => {
    it("Deletes a member", async () => {
        const datasetService: any = {
            deleteMember: jest.fn(),
        };
        const datasetEditManager: any = {
            cleanEdited: jest.fn(),
            unmark: jest.fn(),
        };
        SettingsFacade.listHosts = jest.fn().mockReturnValue([args.host]);
        const showWarningMessageListener = jest.spyOn(
            vscode.window,
            "showWarningMessage",
        );
        const findHostByNameListener = jest.spyOn(
            SettingsFacade,
            "findHostByName",
        );
        await deleteMember(
            datasetService,
            datasetEditManager,
            cache,
            datasetDataProvider,
            args,
        );
        expect(datasetService.deleteMember).toHaveReturned();
        expect(datasetEditManager.cleanEdited).toHaveReturned();
        expect(datasetEditManager.unmark).toHaveReturned();
        expect(cache.resetMember).toHaveReturned();
        expect(datasetDataProvider.refresh).toHaveReturned();
        expect(showWarningMessageListener).toHaveReturnedTimes(1);
        expect(SettingsFacade.listHosts).toHaveReturned();
        expect(findHostByNameListener).toHaveReturned();
    });
    it("Tries to delete a non-member node", async () => {
        const datasetService: any = {
            deleteMember: jest.fn(),
        };
        const datasetEditManager: any = {
            cleanEdited: jest.fn(),
            unmark: jest.fn(),
        };
        await deleteMember(
            datasetService,
            datasetEditManager,
            cache,
            datasetDataProvider,
            { type: "notMember" },
        );
        expect(datasetService.deleteMember).toHaveReturnedTimes(0);
        expect(datasetEditManager.cleanEdited).toHaveReturnedTimes(0);
        expect(datasetEditManager.unmark).toHaveReturnedTimes(0);
    });
    it("Simulates a delete member error", async () => {
        const datasetService: any = {
            deleteMember: jest.fn().mockImplementation(() => {
                throw new Error();
            }),
        };
        const datasetEditManager: any = {
            cleanEdited: jest.fn(),
            unmark: jest.fn(),
        };

        SettingsFacade.listHosts = jest.fn().mockReturnValue([args.host]);
        vscode.window.showErrorMessage = jest
            .fn()
            .mockReturnValue(Promise.resolve(undefined));
        vscode.window.showWarningMessage = jest
            .fn()
            .mockReturnValue(Promise.resolve("OK"));
        await deleteMember(
            datasetService,
            datasetEditManager,
            cache,
            datasetDataProvider,
            args,
        );
        expect(vscode.window.showErrorMessage).toBeCalled();
    });
    it("Simulates target host to be undefined", async () => {
        jest.clearAllMocks();
        const datasetService: any = {
            deleteMember: jest.fn(),
        };
        const datasetEditManager: any = {
            cleanEdited: jest.fn(),
            unmark: jest.fn(),
        };
        const argument: any = {
            dataset: createDummyDataset(),
            host: { name: "notOk" },
            member: { name: "name" },
            type: "member",
        };
        const showWarningMessageListener = jest.spyOn(
            vscode.window,
            "showWarningMessage",
        );
        await deleteMember(
            datasetService,
            datasetEditManager,
            cache,
            datasetDataProvider,
            argument,
        );
        expect(showWarningMessageListener).toHaveReturnedTimes(2);
    });
});
