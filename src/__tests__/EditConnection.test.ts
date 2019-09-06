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

jest.mock("vscode");
jest.mock("../utils");

import { editConnection } from "../commands/EditConnection";
import { DefaultCredentialsService } from "../service/CredentialsService";
import { ZoweRestClient } from "../service/ZoweRestClient";
import { HostPanel } from "../ui/views/HostPanel";

describe("Edit Connection", () => {
    it("Edits Connection", async () => {
        const creds = new DefaultCredentialsService();
        HostPanel.createHost = jest.fn();
        const datasetEditManager: any = {
            cleanEditedMember: jest.fn(),
            unmarkMember: jest.fn(),
            };
        const args = {host: {}};
        HostPanel.editHost = jest.fn();
        await editConnection({} as any, datasetEditManager, new ZoweRestClient(creds), args);
        expect(HostPanel.editHost).toHaveBeenCalled();
    });
    it("Cannot edit because the host does not exist", async () => {
        const creds = new DefaultCredentialsService();
        HostPanel.createHost = jest.fn();
        const datasetEditManager: any = {
            cleanEditedMember: jest.fn(),
            unmarkMember: jest.fn(),
            };
        const args = {host: undefined};
        HostPanel.createHost = jest.fn();
        await editConnection({} as any, datasetEditManager, new ZoweRestClient(creds), args);
        expect(HostPanel.createHost).toHaveBeenCalled();
    });
});
