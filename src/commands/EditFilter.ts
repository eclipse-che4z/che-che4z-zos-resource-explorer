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
import { checkFilterString } from "../utils";

export async function editFilter(arg: any) {
    if (arg.type !== NodeType.DATASETS_FILTER) {
        return;
    }

    const filterNode: ZDatasetFilterNode = arg as ZDatasetFilterNode;

    const inputBoxOptions: vscode.InputBoxOptions = {
        ignoreFocusOut: true,
        placeHolder: "Type your filter string here",
        prompt: "Edit an MVS filter.",
        value: filterNode.filter.value,
        validateInput(value: string) {
            return checkFilterString(arg.host, value);
        },
    };
    const newFilterValue: string | undefined = await vscode.window.showInputBox(inputBoxOptions);
    if (newFilterValue && arg.type === NodeType.DATASETS_FILTER) {
        SettingsFacade.editFilter(filterNode.host, filterNode.filter, newFilterValue);
    }
}
