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

import { refreshConnection } from "../commands/RefreshConnection";
import { createHostPath } from "../ui/tree/DatasetTreeModel";
import { generateConnection } from "./utils/TestUtils";

describe("RefreshConnection command test", () => {
    it("should call for refresh", async () => {
        const connection = generateConnection();
        const cache: any = { reset: jest.fn() };
        const datasetDataProvider: any = { refresh: jest.fn() };
        await refreshConnection(cache, datasetDataProvider, connection);
        expect(cache.reset).toBeCalledWith(createHostPath(connection));
        expect(datasetDataProvider.refresh).toBeCalledTimes(1);
    });
});
