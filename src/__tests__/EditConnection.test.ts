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

import { editConnection } from "../commands/EditConnection";
import { DefaultCredentialsService } from "../service/CredentialsService";
import { ZoweRestClient } from "../service/ZoweRestClient";
import { HostPanel } from "../ui/views/HostPanel";

describe("Edit Connection", () => {
    const datasetEditManager: any = {
        cleanEditedMember: jest.fn(),
        unmarkMember: jest.fn(),
    };

    HostPanel.editHost = jest.fn();
    HostPanel.createHost = jest.fn();

    it("Edits Connection", async () => {
        jest.resetAllMocks();
        const creds = new DefaultCredentialsService();
        const args = {host: {}};
        await editConnection({} as any, datasetEditManager, new ZoweRestClient(creds), args);
        expect(HostPanel.editHost).toBeCalled();
        expect(HostPanel.createHost).not.toBeCalled();
    });

    it("Cannot edit because the host does not exist", async () => {
        jest.resetAllMocks();
        const creds = new DefaultCredentialsService();
        const args = {host: undefined};
        await editConnection({} as any, datasetEditManager, new ZoweRestClient(creds), args);
        expect(HostPanel.editHost).not.toBeCalled();
        expect(HostPanel.createHost).toBeCalled();
    });
});
