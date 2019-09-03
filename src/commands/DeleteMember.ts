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
import { DatasetEditManager } from "../service/DatasetEditManager";
import { DatasetService } from "../service/DatasetService";
import { SettingsFacade } from "../service/SettingsFacade";
import { DatasetDataProvider } from "../ui/tree/DatasetDataProvider";
import { NodeType, ZMemberNode } from "../ui/tree/DatasetTreeModel";

export async function deleteMember(
    datasetService: DatasetService,
    datasetEditManager: DatasetEditManager,
    cache: DatasetCache,
    datasetDataProvider: DatasetDataProvider,
    arg: any,
) {
    if (arg.type !== NodeType.MEMBER) {
        return;
    }
    const memberNode: ZMemberNode = arg as ZMemberNode;
    const message = await vscode.window.showWarningMessage(
        "Delete member: " + memberNode.member.name + " from dataset: " + memberNode.dataset.name + "?",
        "OK",
    );
    if (message !== "OK") {
        return;
    }
    const hosts: Connection[] = SettingsFacade.listHosts();
    const targetHost: Connection | undefined = SettingsFacade.findHostByName(arg.host.name, hosts);
    if (!targetHost) {
        vscode.window.showWarningMessage(`${arg.host.name} is missing in settings`);
        return;
    }
    try {
        await datasetService.deleteMember(arg.host, memberNode.dataset.name, memberNode.member.name);
        datasetEditManager.cleanEditedMember(arg.host, arg.dataset, arg.member);
        datasetEditManager.unmarkMember(arg.host.name, memberNode.dataset.name, memberNode.member.name);
    } catch (error) {
        vscode.window.showErrorMessage("Delete member error: " + error);
    }
    cache.resetMember(arg.host, arg.dataset, memberNode.member);
    datasetDataProvider.refresh();
}
