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

export async function copyMember(copyPasteService: CopyPasteService, arg: any) {
    if (copyPasteService.canCopy(arg)) {
        await vscode.window.withProgress(
            {
                cancellable: false,
                location: vscode.ProgressLocation.Notification,
                title: `Loading ${arg.dataset.name}(${arg.member.name})`,
            },
            async (progress) => {
                try {
                    await copyPasteService.copy(arg.host, arg.dataset.name, arg.member.name);
                } catch (error) {
                    vscode.window.showErrorMessage("Copy member error: " + error);
                } finally {
                    progress.report({ increment: 100, message: "done" });
                }
            },
        );
    }
}
