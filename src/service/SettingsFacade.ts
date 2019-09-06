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
import { Filter } from "../model/DSEntities";

export const HOST_SETTINGS_KEY: string = "zos.hosts";

export class SettingsFacade {
    public static listHosts(): Connection[] {
        const zosHostParam = vscode.workspace.getConfiguration().inspect(HOST_SETTINGS_KEY);
        let hostList: Connection[] = [];
        if (zosHostParam && zosHostParam.globalValue) {
            hostList = zosHostParam.globalValue as Connection[];
        }
        hostList.forEach((host) => {
            if (this.passwords[host.name]) {
                host.password = this.passwords[host.name];
            }
        });
        return hostList;
    }

    public static updateHosts(hosts: Connection[]): Thenable<void> {
        const cleanHosts: Connection[] = [];
        hosts.forEach((host) => {
            const cleanHost = Object.assign({}, host);
            delete cleanHost.password;
            cleanHosts.push(cleanHost);
        });
        return vscode.workspace
            .getConfiguration()
            .update(HOST_SETTINGS_KEY, cleanHosts, vscode.ConfigurationTarget.Global);
    }

    public static deleteHostByName(hostName: string): void {
        const hosts: Connection[] = SettingsFacade.listHosts();
        for (let i = 0; i < hosts.length; i++) {
            if (hostName === hosts[i].name) {
                hosts.splice(i, 1);
                SettingsFacade.updateHosts(hosts);
                return;
            }
        }
    }

    public static createFilter(host: Connection, filterValue: string) {
        filterValue = filterValue.toUpperCase();
        const hosts: Connection[] = SettingsFacade.listHosts();
        const targetHost: Connection | undefined = this.findHostByName(host.name, hosts);
        if (targetHost) {
            const newFilter: Filter = {
                name: filterValue,
                value: filterValue,
            };
            if (targetHost.filters) {
                targetHost.filters.push(newFilter);
            } else {
                targetHost.filters = [newFilter];
            }
            SettingsFacade.updateHosts(hosts);
        }
    }

    public static deleteFilter(host: Connection, filter: Filter) {
        const hosts: Connection[] = SettingsFacade.listHosts();
        const targetHost: Connection | undefined = this.findHostByName(host.name, hosts);
        if (targetHost && targetHost.filters) {
            for (let i = 0; i < targetHost.filters.length; i++) {
                if (targetHost.filters[i].value.toUpperCase() === filter.value.toUpperCase()) {
                    targetHost.filters.splice(i, 1);
                }
            }
            if (targetHost.filters) {
                delete targetHost.filters;
            }
            SettingsFacade.updateHosts(hosts);
        }
    }

    public static editFilter(host: Connection, filter: Filter, filterUri: string) {
        filterUri = filterUri.toUpperCase();
        const hosts: Connection[] = SettingsFacade.listHosts();
        const targetHost: Connection | undefined = this.findHostByName(host.name, hosts);
        if (targetHost && targetHost.filters) {
            for (const f of targetHost.filters) {
                if (f.value.toUpperCase() === filter.value.toUpperCase()) {
                    f.value = filterUri;
                    f.name = filterUri;
                }
            }
            SettingsFacade.updateHosts(hosts);
        }
    }

    public static findHostByName(name: string, hosts: Connection[]): Connection | undefined {
        for (const host of hosts) {
            if (host.name === name) {
                return host;
            }
        }
        return undefined;
    }

    public static updatePassword(hostName: string, password: string) {
        this.passwords[hostName] = password;
    }

    public static async requestCredentials(
        host: Connection,
    ): Promise<{ username: string; password: string } | undefined> {
        try {
            if (!this.passwords[host.name] && !host.password) {
                await this.requestUser(host);
                await this.requestPassword(host);
            }
            return {
                password: this.passwords[host.name] || host.password,
                username: host.username,
            };
        } catch (ignore) {
            return undefined;
        }
    }

    public static resetPassword(host: Connection) {
        delete this.passwords[host.name];
        delete host.password;
    }

    private static passwords = {};

    private static async requestUser(host: Connection): Promise<string> {
        const userName = await vscode.window.showInputBox({
            password: false,
            prompt: "Please, confirm the user name",
            value: host.username,
        });
        if (userName) {
            host.username = userName;
            return Promise.resolve(userName);
        } else {
            return Promise.reject();
        }
    }

    private static async requestPassword(host: Connection): Promise<string> {
        const password = await vscode.window.showInputBox({
            password: true,
            prompt: "Please, enter your password for: " + host.name,
        });
        if (password) {
            host.password = password;
            this.passwords[host.name] = password;
            return Promise.resolve(password);
        } else {
            return Promise.reject();
        }
    }
}
