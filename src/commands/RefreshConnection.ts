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

import { DatasetCache } from "../service/DatasetCache";
import { MVSDataProvider } from "../ui/tree/DatasetDataProvider";
import { createHostPath } from "../ui/tree/DatasetTreeModel";

export async function refreshConnection(cache: DatasetCache, mvsDataProvider: MVSDataProvider, hostNode: any) {
    cache.reset(createHostPath(hostNode));
    mvsDataProvider.refresh();
}
