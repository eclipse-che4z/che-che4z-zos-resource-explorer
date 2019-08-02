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
import { CopyPasteService } from "../service/CopyPasteService";
import { DatasetCache } from "../service/DatasetCache";
import { DatasetService } from "../service/DatasetService";
import { MVSDataProvider } from "../ui/tree/DatasetDataProvider";
import { validateMemberName } from "../utils";

export async function pasteMember(
    datasetService: DatasetService,
    copyPasteService: CopyPasteService,
    cache: DatasetCache,
    mvsDataProvider: MVSDataProvider,
    arg: any,
) {
    if (copyPasteService.canPaste(arg)) {
        let memberName: string | undefined = copyPasteService.getMemberName();
        try {
            while (true) {
                if (await datasetService.isMemberExists(arg.host, arg.dataset.name, memberName)) {
                    vscode.window.showErrorMessage(`Member ${memberName} already exist.`);
                    memberName = await askForMemberName();
                    if (!memberName) {
                        return;
                    }
                    continue;
                }
                break;
            }
            copyPasteService.setMemberName(memberName);
            await copyPasteService.paste(arg.host, arg.dataset.name);
        } catch (error) {
            vscode.window.showErrorMessage("Paste member error: " + error);
            return;
        }
        cache.resetDataset(arg.host, arg.dataset);
        mvsDataProvider.refresh();
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
