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
import { allocateLikeDataset } from "./commands/AllocateLikeDataset";
import { browseMember } from "./commands/BrowseMember";
import { copyMember } from "./commands/CopyMember";
import { createConnection } from "./commands/CreateConnection";
import { createFilter } from "./commands/CreateFilter";
import { createMember } from "./commands/CreateMember";
import { deleteConnection } from "./commands/DeleteConnection";
import { deleteFilter } from "./commands/DeleteFilter";
import { deleteMember } from "./commands/DeleteMember";
import { editConnection } from "./commands/EditConnection";
import { editFilter } from "./commands/EditFilter";
import { pasteMember } from "./commands/PasteMember";
import { refreshConnection } from "./commands/RefreshConnection";
import { CopyPasteService } from "./service/CopyPasteService";
import { DefaultCredentialsService } from "./service/CredentialsService";
import { DatasetCache } from "./service/DatasetCache";
import { DatasetEditManager } from "./service/DatasetEditManager";
import { DatasetService } from "./service/DatasetService";
import { HOST_SETTINGS_KEY, SettingsFacade } from "./service/SettingsFacade";
import { ZoweRestClient } from "./service/ZoweRestClient";
import { MVSDataProvider } from "./ui/tree/DatasetDataProvider";
import { ZNode } from "./ui/tree/DatasetTreeModel";

export function activate(context: vscode.ExtensionContext) {
    const rest: ZoweRestClient = new ZoweRestClient(new DefaultCredentialsService());
    const datasetService: DatasetService = new DatasetService(rest);
    const cache: DatasetCache = new DatasetCache();
    const datasetEditManager: DatasetEditManager = new DatasetEditManager(rest);
    const mvsDataProvider: MVSDataProvider = new MVSDataProvider(context, datasetEditManager, cache, datasetService);
    const copyPasteService: CopyPasteService = new CopyPasteService(rest, datasetService);

    const zosexplorer: vscode.TreeView<ZNode> = vscode.window.createTreeView("zosexplorer", {
        treeDataProvider: mvsDataProvider,
    });
    zosexplorer.onDidCollapseElement((event) => {
        mvsDataProvider.setCollapsState(event.element.path, vscode.TreeItemCollapsibleState.Collapsed);
    });
    zosexplorer.onDidExpandElement((event) => {
        mvsDataProvider.setCollapsState(event.element.path, vscode.TreeItemCollapsibleState.Expanded);
    });
    context.subscriptions.push(zosexplorer);
    datasetEditManager.register(context.subscriptions, mvsDataProvider);

    registerCommands(datasetService, cache, datasetEditManager, mvsDataProvider, copyPasteService, context, rest);

    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration((event: vscode.ConfigurationChangeEvent) => {
            if (event.affectsConfiguration(HOST_SETTINGS_KEY)) {
                mvsDataProvider.reloadSettings();
            }
        }),
    );
}

export function deactivate() {
    // no-op
}

// TOSO remove rest
function registerCommands(
    datasetService: DatasetService,
    cache: DatasetCache,
    datasetEditManager: DatasetEditManager,
    mvsDataProvider: MVSDataProvider,
    copyPasteService: CopyPasteService,
    context: vscode.ExtensionContext,
    rest: ZoweRestClient,
) {
    // Connections
    context.subscriptions.push(
        vscode.commands.registerCommand("zosexplorer.createConnection", async () => {
            await createConnection(context, rest);
        }),
    );

    context.subscriptions.push(
        vscode.commands.registerCommand("zosexplorer.editConnection", async (arg: any) => {
            await editConnection(context, mvsDataProvider, rest, arg);
        }),
    );

    context.subscriptions.push(
        vscode.commands.registerCommand("zosexplorer.deleteConnection", async (arg: any) => {
            await deleteConnection(arg);
        }),
    );

    context.subscriptions.push(
        vscode.commands.registerCommand("zosexplorer.refreshConnection", async (hostNode: any) => {
            await refreshConnection(cache, mvsDataProvider, hostNode);
        }),
    );

    // Filters
    context.subscriptions.push(
        vscode.commands.registerCommand("zosexplorer.deleteFilter", async (arg: any) => {
            await deleteFilter(arg);
        }),
    );

    context.subscriptions.push(
        vscode.commands.registerCommand("zosexplorer.editFilter", async (arg: any) => {
            await editFilter(arg);
        }),
    );

    context.subscriptions.push(
        vscode.commands.registerCommand("zosexplorer.createFilter", async (arg: any) => {
            await createFilter(arg);
        }),
    );

    // Datasets
    context.subscriptions.push(
        vscode.commands.registerCommand("zosexplorer.dataset.allocateLike", async (arg: any) => {
            await allocateLikeDataset(datasetService, cache, mvsDataProvider, arg);
        }),
    );

    // Members
    context.subscriptions.push(
        vscode.commands.registerCommand("zosexplorer.copyMember", async (arg: any) => {
            await copyMember(copyPasteService, arg);
        }),
    );
    context.subscriptions.push(
        vscode.commands.registerCommand("zosexplorer.pasteMember", async (arg: any) => {
            await pasteMember(datasetService, copyPasteService, cache, mvsDataProvider, arg);
        }),
    );
    context.subscriptions.push(
        vscode.commands.registerCommand("zosexplorer.createMember", async (arg: any) => {
            await createMember(datasetService, cache, mvsDataProvider, arg);
        }),
    );
    context.subscriptions.push(
        vscode.commands.registerCommand("zosexplorer.browseMember", async (arg: any) => {
            await browseMember(datasetService, arg);
        }),
    );
    context.subscriptions.push(
        vscode.commands.registerCommand("zosexplorer.deleteMember", async (arg: any) => {
            await deleteMember(datasetService, datasetEditManager, cache, mvsDataProvider, arg);
        }),
    );
}
