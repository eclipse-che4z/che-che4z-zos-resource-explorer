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
import { DatasetCache } from "../../../service/DatasetCache";
import { DatasetEditManager } from "../../../service/DatasetEditManager";
import { DatasetService } from "../../../service/DatasetService";
import { ZNode } from "../DatasetTreeModel";

export class DatasetDataProvider implements vscode.TreeDataProvider<ZNode> {
    public onDidChangeTreeData?:
        | vscode.Event<ZNode | null | undefined>
        // tslint:disable-next-line: prefer-optional
        | undefined;
    constructor(
        private context: vscode.ExtensionContext,
        private datasetEditorManager: DatasetEditManager,
        private datasetCache: DatasetCache,
        private datasetService: DatasetService,
    ) {}
    public getTreeItem(
        element: ZNode,
    ): vscode.TreeItem | Thenable<vscode.TreeItem> {
        throw new Error("Method not implemented.");
    }
    public getChildren(
        element?: ZNode | undefined,
    ): vscode.ProviderResult<ZNode[]> {
        throw new Error("Method not implemented.");
    }

    // tslint:disable-next-line: no-empty
    public refresh() {}
}
