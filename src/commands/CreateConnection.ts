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
import { SettingsFacade } from "../service/SettingsFacade";

export async function createConnection() {
    const pattern = new RegExp("^(https?:\\/\\/)?" + // protocol
                        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+|" + // domain name
                        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
                        "(\\:\\d{1,5})(\\/[-a-z\\d%_.~+]*)*" + // port and path
                        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
                        "(\\#[-a-z\\d_]*)?$", "i"); // fragment locator

    const url = await vscode.window.showInputBox({
        ignoreFocusOut: true,
        placeHolder: "URL",
        prompt: "Enter the URL",
        validateInput: (text: string) => (pattern.test(text) ? "" : "Please enter valid URL."),
    });
    if (url === undefined) {
        return undefined;
    }
    const hosts: Connection[] = SettingsFacade.listHosts();
    hosts.push({
        name: url,
        password: "",
        url,
        username: "",
    });
    SettingsFacade.updateHosts(hosts);
}
