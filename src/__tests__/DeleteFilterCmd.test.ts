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
import { deleteFilter } from "../commands/DeleteFilter";
import { SettingsFacade } from "../service/SettingsFacade";
import { NodeType } from "../ui/tree/DatasetTreeModel";
import { generateDummyFilter } from "./utils/TestUtils";

let showWarningMessage: any;
let dummyFilter: any;

beforeAll(() => {
    showWarningMessage = jest.spyOn(vscode.window, "showWarningMessage");

    dummyFilter = generateDummyFilter();
});

describe("Delete Filter functionality", () => {
    test("[POSITIVE TESTS] Delete an already defined filter", async () => {
        SettingsFacade.deleteFilter = jest.fn();

        const datasetFilterNode: any = {
            filter: dummyFilter,
            type: NodeType.DATASETS_FILTER,
        };

        await deleteFilter(datasetFilterNode);
        expect(SettingsFacade.deleteFilter).toHaveBeenCalledTimes(1);
    });

    test("[NEGATIVE TESTS] Invoke delete filter on a wrong tree node that is not a filter", async () => {
        showWarningMessage = jest.spyOn(vscode.window, "showWarningMessage");
        SettingsFacade.deleteFilter = jest.fn();

        await deleteFilter(NodeType.DATASET);
        expect(SettingsFacade.deleteFilter).toHaveBeenCalledTimes(0);
    });

});
