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
import { DatasetCache } from "../service/DatasetCache";
import { DatasetService } from "../service/DatasetService";
import { DatasetDataProvider } from "../ui/tree/DatasetDataProvider";
import { createPhysicalDocument, validateMemberName } from "../utils";

export async function createMember(
    datasetService: DatasetService,
    cache: DatasetCache,
    datasetDataProvider: DatasetDataProvider,
    arg: any,
) {
    let memberName: string | undefined;
    while (true) {
        memberName = await askForMemberName();
        if (!memberName) {
            return;
        }
        memberName = memberName.toUpperCase();
        try {
            if (await datasetService.isMemberExists(arg.host, arg.dataset.name, memberName)) {
                vscode.window.showErrorMessage(`Member ${memberName} already exist.`);
                continue;
            }
            break;
        } catch (error) {
            vscode.window.showErrorMessage("Create member Error: " + error);
            return;
        }
    }
    await vscode.window.withProgress(
        {
            cancellable: false,
            location: vscode.ProgressLocation.Notification,
            title: `Creating member ${memberName}`,
        },
        () => doCreate(datasetService, arg.host, arg.dataset.name, memberName!),
    );
    cache.resetDataset(arg.host, arg.dataset);
    datasetDataProvider.refresh();
}

async function doCreate(
    datasetService: DatasetService,
    connection: Connection,
    datasetName: string,
    memberName: string,
) {
    try {
        await datasetService.createMember(connection, datasetName, memberName);
        await createPhysicalDocument(datasetName, memberName, connection, "");
    } catch (error) {
        vscode.window.showErrorMessage("Create member error: " + error);
    }
}

async function askForMemberName() {
    return await vscode.window.showInputBox({
        ignoreFocusOut: true,
        prompt: "Enter the Member name",
        validateInput(value: string) {
            return validateMemberName(value);
        },
    });
}
