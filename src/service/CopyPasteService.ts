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
import { NodeType, ZNode } from "../ui/tree/DatasetTreeModel";
import { DatasetService } from "./DatasetService";
import { ZoweRestClient } from "./ZoweRestClient";

export class CopyPasteService {
    private content?: string;
    private memberName: string = "";

    // TODO replace rest with datasetService
    constructor(private rest: ZoweRestClient, private datasetService: DatasetService) {
        // no-op
    }

    public async copy(connection: Connection, datasetName: string, member: string) {
        this.content = await this.rest.getContent(connection, `${datasetName}(${member})`);
        this.memberName = member;
    }

    public canCopy(arg: ZNode): boolean {
        if (arg.type !== NodeType.MEMBER) {
            return false;
        }
        return true;
    }

    public async paste(connection: Connection, datasetName: string) {
        return this.rest.putContent(connection, this.content!, datasetName, this.memberName);
    }

    public canPaste(arg: ZNode) {
        if (this.content === undefined) {
            vscode.window.showErrorMessage("Nothing to paste");
            return false;
        }
        if (!this.memberName) {
            return false;
        }
        if (arg.type !== NodeType.DATASET) {
            return false;
        }
        return true;
    }

    public getMemberName(): string {
        return this.memberName;
    }

    public setMemberName(memberName: string) {
        this.memberName = memberName;
    }
}
