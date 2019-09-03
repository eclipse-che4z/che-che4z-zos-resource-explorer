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
        placeHolder: "Host Name",
        prompt: "Enter the Host Name ",
        validateInput: (text: string) => (text !== "" ? "" : "Host Name must not be empty"),
        value: arg.host.name,
    });

    if (newHostName === undefined) {
        return undefined;
    }

    const isExistingHostName = (name: string): boolean => {
        for (const host of SettingsFacade.listHosts()) {
            if (host.name === name) {
                return true;
            }
        }
        return false;
    };

    if (isExistingHostName(newHostName)) {
        vscode.window.showErrorMessage(`Host with name ${newHostName} already exists.`);
        return;
    }
    const hosts: Connection[] = SettingsFacade.listHosts();
    const targetHost: Connection | undefined = SettingsFacade.findHostByName(arg.host.name, hosts);
    if (targetHost) {
        targetHost.name = newHostName;
        await SettingsFacade.updateHosts(hosts);
        datasetDataProvider.refresh();
    }
}
