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
import { Connection } from "../model/Connection";
import { HOST_SETTINGS_KEY, SettingsFacade } from "../service/SettingsFacade";

let connection: Connection;
let cfgMock: any;
beforeEach(() => {
    connection = {
        name: "hostname",
        url: "http://test.ca.com:123",
        username: "unittest",
    };
    cfgMock = {
        inspect: jest.fn().mockReturnValue({ globalValue: [connection] }),
        update: jest.fn(),
    };
    vscode.workspace.getConfiguration = () => cfgMock;
});
describe("SettingsFacade", () => {
    it("should list connections", () => {
        const connections: Connection[] = SettingsFacade.listHosts();
        expect(connections).toEqual([connection]);
    });

    it("should list connections with password", () => {
        const secret: string = "#g$d#@a$a@d#s$";
        SettingsFacade.updatePassword(connection.name, secret);
        const connections: Connection[] = SettingsFacade.listHosts();
        expect(connections).toEqual([{ ...connection, password: secret }]);
        SettingsFacade.resetPassword(connection);
    });

    it("should update connections", () => {
        SettingsFacade.updateHosts([connection]);
        expect(cfgMock.update).toHaveBeenCalledWith(HOST_SETTINGS_KEY, [connection], vscode.ConfigurationTarget.Global);
    });

    it("should delete connections", () => {
        SettingsFacade.deleteHostByName(connection.name);
        expect(cfgMock.update).toHaveBeenCalledWith(HOST_SETTINGS_KEY, [], vscode.ConfigurationTarget.Global);
    });

    it("should create filter", () => {
        const filterValue = "TESTFILTER";
        SettingsFacade.createFilter(connection, filterValue);
        const connectionWithFilters = { ...connection };
        connectionWithFilters.filters = [{ name: filterValue, value: filterValue }];
        expect(cfgMock.update).toHaveBeenCalledWith(
            HOST_SETTINGS_KEY,
            [connectionWithFilters],
            vscode.ConfigurationTarget.Global,
        );
    });
    it("should delete filter", () => {
        const filterValue = "TESTFILTER";
        const filter = { name: filterValue, value: filterValue };
        const connectionWithFilters = { ...connection };
        connectionWithFilters.filters = [filter];
        cfgMock.inspect = jest.fn().mockReturnValue({ globalValue: [connectionWithFilters] });
        SettingsFacade.deleteFilter(connectionWithFilters, filter);
        expect(cfgMock.update).toHaveBeenCalledWith(HOST_SETTINGS_KEY, [connection], vscode.ConfigurationTarget.Global);
    });
    it("should edit filter", () => {
        const filterValue = "TESTFILTER";
        const newFilterValue = "TEST";
        const filter = { name: filterValue, value: filterValue };
        const connectionWithFilters = { ...connection };
        connectionWithFilters.filters = [filter];
        const connectionWithNewFilters = { ...connectionWithFilters };
        connectionWithNewFilters.filters![0].value = newFilterValue;
        connectionWithNewFilters.filters![0].name = newFilterValue;
        cfgMock.inspect = jest.fn().mockReturnValue({ globalValue: [connectionWithFilters] });
        SettingsFacade.editFilter(connectionWithFilters, filter, newFilterValue);
        expect(cfgMock.update).toHaveBeenCalledWith(
            HOST_SETTINGS_KEY,
            [connectionWithNewFilters],
            vscode.ConfigurationTarget.Global,
        );
    });
    it("should find connection by name", () => {
        const result = SettingsFacade.findHostByName(connection.name, [connection]);
        expect(result).toEqual(connection);
    });
});
