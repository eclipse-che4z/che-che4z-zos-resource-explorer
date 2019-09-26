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

import { URL } from "url";
import * as vscode from "vscode";
import { Connection } from "../model/Connection";
import { SettingsFacade } from "../service/SettingsFacade";

export async function createConnection() {
    const validateUrl = (newUrl: string) => {
        let url: URL;
        try {
            url = new URL(newUrl);
        } catch (error) {
            return false;
        }
        return url.port ? true : false;
    };

    const url = await vscode.window.showInputBox({
        ignoreFocusOut: true,
        placeHolder: "URL",
        prompt: "Enter a z/OS URL in the format 'http(s)://url:port'. the URL",
        validateInput: (text: string) => (validateUrl(text) ? "" : "Please enter a valid URL."),
    });
    if (url === undefined) {
        return;
    }

    for (const host of SettingsFacade.listHosts()) {
        if (host.name === url) {
            vscode.window.showErrorMessage(`Host with name ${url} already exists.`);
            return;
        }
    }
    const hosts: Connection[] = SettingsFacade.listHosts();
    hosts.push({
        name: url,
        password: "",
        url,
        username: "",
    });
    SettingsFacade.updateHosts(hosts);
    vscode.window.showInformationMessage("Connection " + url + " was created.");
}
