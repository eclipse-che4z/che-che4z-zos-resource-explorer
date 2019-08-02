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
import { SettingsFacade } from "./SettingsFacade";

export interface CredentialsService {
    requestCredentials(connection: Connection): Promise<{ username: string; password: string } | undefined>;
    resetPassword(connection: Connection): void;
    showErrorMessage(message: string): Promise<void>;
}

export class DefaultCredentialsService implements CredentialsService {
    public async requestCredentials(
        connection: Connection,
    ): Promise<{ username: string; password: string } | undefined> {
        return await SettingsFacade.requestCredentials(connection);
    }

    public resetPassword(connection: Connection): void {
        SettingsFacade.resetPassword(connection);
    }
    public async showErrorMessage(message: string): Promise<void> {
        vscode.window.showErrorMessage(message);
    }
}
