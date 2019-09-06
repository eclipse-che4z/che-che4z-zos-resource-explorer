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
import { DatasetDataProvider } from "../ui/tree/DatasetDataProvider";

export async function editConnection(datasetDataProvider: DatasetDataProvider, arg: any) {
    const newHostName =  await vscode.window.showInputBox({
        ignoreFocusOut: true,
        placeHolder: "Connection name",
        prompt: "Enter a custom name for the connection.",
        validateInput: (text: string) => (text !== "" ? "" : "Please use only characters A-z and 0-9."),
        value: arg.host.name,
    });

    if (newHostName === undefined) {
        return;
    }

    for (const host of SettingsFacade.listHosts()) {
        if (host.name === newHostName) {
            vscode.window.showErrorMessage(`Host with name ${newHostName} already exists.`);
            return;
        }
    }
    const hosts = SettingsFacade.listHosts();
    const targetHost = SettingsFacade.findHostByName(arg.host.name, hosts);
    if (targetHost) {
        const oldName = targetHost.name;
        targetHost.name = newHostName;
        await SettingsFacade.updateHosts(hosts);
        datasetDataProvider.refresh();
        vscode.window.showInformationMessage(`Connection ${oldName} was renamed to ${newHostName}.`);
    }

}
