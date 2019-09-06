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
import { Dataset } from "../model/DSEntities";
import { DatasetCache } from "../service/DatasetCache";
import { DatasetService } from "../service/DatasetService";
import { DatasetDataProvider } from "../ui/tree/DatasetDataProvider";
import { validateDatasetName } from "../utils";
/**
 * Start the routine to create a new dataset. This function will:
 * - ask user to choose a name with a prompt inputbox
 * - check parameter required to create a new dataset with allocate like
 * - throw an error if something goes wrong
 * @author zacan01
 * @param host
 * @param dataset
 */
export async function allocateLikeDataset(
    datasetService: DatasetService,
    cache: DatasetCache,
    datasetDataProvider: DatasetDataProvider,
    arg: any,
) {
    if (!isDatasetTypeSupported(arg.dataset.dataSetOrganization)) {
        vscode.window.showErrorMessage(
            `Dataset Creation Failed: "Allocate Like" option is not supported for ${
                arg.dataset.dataSetOrganization
            } dataset type`,
        );
        return false;
    }
    if (!isDatasetAllocationUnitSupported(arg.dataset.allocationUnit)) {
        vscode.window.showErrorMessage(
            `Dataset Creation Failed: "Allocate Like" option is not supported for ${
                arg.dataset.allocationUnit
            } dataset allocation unit. z/OS MF connector only supports allocation unit type of track and cylinder`,
        );
        return false;
    }

    const datasetName: string | undefined = await askForDatasetName();
    if (!datasetName) {
        return false;
    }
    try {
        if (await datasetService.isDatasetExists(arg.host, datasetName)) {
            vscode.window.showErrorMessage(`Dataset ${datasetName.toUpperCase()} already exist.`);
            return false;
        }
    } catch (error) {
        vscode.window.showErrorMessage("Allocation error: " + error);
        return;
    }
    await vscode.window.withProgress(
        {
            cancellable: false,
            location: vscode.ProgressLocation.Notification,
            title: `Creating dataset...: ${datasetName.toUpperCase()}`,
        },
        () => doAllocate(datasetService, arg.host, arg.dataset, datasetName),
    );
    const lastIndex = arg.path.lastIndexOf("->");
    const refreshPath = arg.path.substr(0, lastIndex + 2);
    cache.reset(refreshPath);
    datasetDataProvider.refresh();
}

async function doAllocate(
    datasetService: DatasetService,
    connection: Connection,
    dataset: Dataset,
    datasetName: string,
) {
    try {
        await datasetService.allocateDatasetLike(connection, dataset, datasetName);
        vscode.window.showInformationMessage(`Dataset created.`);
    } catch (error) {
        vscode.window.showErrorMessage("Allocate dataset error: " + error);
    }
}

function isDatasetTypeSupported(organizationType: string): boolean {
    return ["PO", "PS", "PO_E"].includes(organizationType);
}

function isDatasetAllocationUnitSupported(allocationUnit: string) {
    return ["TRACK", "CYLINDER"].includes(allocationUnit);
}

/**
 * Show input box and apply validation on the input.
 * @author zacan01
 */
async function askForDatasetName() {
    return vscode.window.showInputBox({
        ignoreFocusOut: true,
        prompt: "Enter the Dataset name",
        validateInput(value: string) {
            return validateDatasetName(value);
        },
    });
}
