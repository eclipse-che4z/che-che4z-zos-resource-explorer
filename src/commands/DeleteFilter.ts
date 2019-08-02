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
import { SettingsFacade } from "../service/SettingsFacade";
import { NodeType, ZDatasetFilterNode } from "../ui/tree/DatasetTreeModel";

export async function deleteFilter(arg: any) {
    if (arg.type === NodeType.DATASETS_FILTER) {
        const filterNode: ZDatasetFilterNode = arg as ZDatasetFilterNode;
        vscode.window.showWarningMessage("Delete filter: " + filterNode.filter.value + "?", "OK").then((message) => {
            if (message === "OK") {
                SettingsFacade.deleteFilter(filterNode.host, filterNode.filter);
            }
        });
    }
}
