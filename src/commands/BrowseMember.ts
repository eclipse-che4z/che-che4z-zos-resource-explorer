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
import { DatasetService } from "../service/DatasetService";

export async function browseMember(datasetService: DatasetService, arg: any) {
    let datasetName: string;
    if (arg.member) {
        datasetName = `${arg.dataset.name}(${arg.member.name})`;
    } else {
        datasetName = arg.dataset.name;
    }
    try {
        const content: string = await datasetService.getContent(arg.host, datasetName);
        createVirtualDocument(arg.dataset.name, content);
    } catch (error) {
        vscode.window.showErrorMessage("Browse member error: " + error);
    }
}

// TODO move map to settings
async function createVirtualDocument(datasetName: string, content: string) {
    const aux = datasetName.split(".");
    const docType: string = aux[aux.length - 1];
    // docType is the last portion of the label retreived from the dataset name..
    let languageType: string;
    switch (docType) {
        case "COBOL":
            languageType = "COBOL";
            break;
        case "JCL":
            languageType = "JCL";
            break;
        default:
            languageType = "plain";
    }
    const doc = await vscode.workspace.openTextDocument({ language: languageType, content });
    await vscode.window.showTextDocument(doc, { preview: false });
}
