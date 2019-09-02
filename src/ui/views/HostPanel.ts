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

import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { Connection } from "../../model/Connection";
import { SettingsFacade } from "../../service/SettingsFacade";
import { ZoweRestClient } from "../../service/ZoweRestClient";
import { DatasetDataProvider } from "../tree/DatasetDataProvider";

export class HostPanel {
    public static readonly viewType = "zosHostPanel";

    public static editHost(
        context: vscode.ExtensionContext,
        host: Connection,
        dataProvider: DatasetDataProvider,
        rest: ZoweRestClient,
    ) {
        const panel = vscode.window.createWebviewPanel(
            HostPanel.viewType,
            host ? host.name : "Edit zOS Host",
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
            },
        );
        panel.webview.html = HostPanel.renderPage(context.extensionPath, host);
        panel.webview.onDidReceiveMessage(
            async (message) => {
                switch (message.command) {
                    case "update":
                        const data = JSON.parse(message.data);
                        if (await this.shouldSaveHost(data, rest)) {
                            await this.updateHost(data);
                            panel.dispose();
                            dataProvider.refresh();
                        }
                        return;
                    case "alert":
                        vscode.window.showErrorMessage(message.text ? message.text : message);
                        return;
                }
            },
            undefined,
            context.subscriptions,
        );
    }
    public static createHost(context: vscode.ExtensionContext, rest: ZoweRestClient) {
        const panel = vscode.window.createWebviewPanel(HostPanel.viewType, "New zOS Host", vscode.ViewColumn.One, {
            enableScripts: true,
            retainContextWhenHidden: true,
        });
        panel.webview.html = HostPanel.renderPage(context.extensionPath);
        panel.webview.onDidReceiveMessage(
            async (message) => {
                switch (message.command) {
                    case "update":
                        const data = JSON.parse(message.data);
                        const name = data.name;
                        if (HostPanel.isExistingHostName(name)) {
                            vscode.window.showErrorMessage(`Host with name ${name} already exists.`);
                            return;
                        }
                        if (await this.shouldSaveHost(data, rest)) {
                            this.createNewHost(data);
                            panel.dispose();
                        }
                        return;
                    case "alert":
                        if (message.text) {
                            vscode.window.showErrorMessage(message.text);
                        } else {
                            vscode.window.showErrorMessage(message);
                        }
                        return;
                }
            },
            undefined,
            context.subscriptions,
        );
    }

    private static async shouldSaveHost(data: any, rest: ZoweRestClient): Promise<boolean> {
        // check the endpoint and verify that it works
        const hc = await HostPanel.performHcRequest(data, rest);
        if (hc && hc.toUpperCase() === data.username.toUpperCase()) {
            return true;
        }
        let messageText: string = `Something is wrong with host ${
            data.name
        }. (error: ${hc.trim()}). Do you want to save it?`;
        if (hc === "unauthorized") {
            messageText = `Wrong credentials for ${data.name}. Do you want to save it?`;
        }
        if (hc === "error") {
            messageText = `The host ${data.name} is not available, save credentials for it?`;
        }
        const result = await vscode.window.showWarningMessage(messageText, "OK", "CANCEL");
        if (result === "OK") {
            return true;
        }
        return false;
    }
    private static renderPage(extensionPath: string, host?: Connection): string {
        const filePath: string = vscode.Uri.file(path.join(extensionPath, "resources", "hostpanel.html")).fsPath;
        const fileJSPath: string = HostPanel.createJSPath(extensionPath);
        const pageData = {
            ...host,
            fileJSPath,
            nonce: HostPanel.getNonce(),
            originalName: host ? host.name : "",
        };
        return HostPanel.substituteValues(fs.readFileSync(filePath, "utf8"), pageData, {
            name: "New host",
            password: "",
            url: "",
            urlTooltip: host ? host.url : "Zowe Endpoint",
            username: "",
        });
    }

    private static getNonce() {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    private static isExistingHostName(hostName: string): boolean {
        for (const host of SettingsFacade.listHosts()) {
            if (host.name === hostName) {
                return true;
            }
        }
        return false;
    }

    private static async performHcRequest(data: any, rest: ZoweRestClient): Promise<string> {
        try {
            return await rest.getUsername({
                name: data.name,
                password: data.password,
                url: data.url,
                username: data.username,
            });
        } catch (error) {
            if (error.name === "Unauthorized") {
                return "unauthorized";
            }
            if (error.body) {
                return error.body;
            }
            return "error";
        }
    }

    private static createNewHost(data: any) {
        const hosts: Connection[] = SettingsFacade.listHosts();
        hosts.push({
            name: data.name,
            password: data.password,
            url: data.url,
            username: data.username,
        });
        SettingsFacade.updateHosts(hosts);
        SettingsFacade.updatePassword(data.name, data.password);
    }

    private static async updateHost(data: any): Promise<boolean> {
        const hosts: Connection[] = SettingsFacade.listHosts();
        const targetHost: Connection | undefined = SettingsFacade.findHostByName(data.originalName, hosts);
        if (targetHost) {
            SettingsFacade.resetPassword(targetHost);
            targetHost.name = data.name;
            targetHost.url = data.url;
            targetHost.username = data.username;
            targetHost.password = data.password;
            SettingsFacade.updatePassword(targetHost.name, data.password);
            await SettingsFacade.updateHosts(hosts);
        } else {
            vscode.window.showErrorMessage(`${data.originalName} host is missing in settings.`);
            return false;
        }
        return true;
    }

    private static substituteValues(text: string, data: {}, defaults?: {}): string {
        let result = text;
        if (defaults) {
            data = { ...defaults, ...data };
        }
        // tslint:disable-next-line: forin
        for (const key in data) {
            result = result.split("${" + key + "}").join(data[key]);
        }
        return result;
    }

    private static createJSPath(extensionPath: string) {
        return vscode.Uri.file(path.join(extensionPath, "resources", "assets", "js", "utils.js"))
            .with({
                scheme: "vscode-resource",
            })
            .toString();
    }
}
