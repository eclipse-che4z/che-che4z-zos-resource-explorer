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

import { Dataset } from "../../model/DSEntities";

/**
 * Create a dummy dataset.
 * @return A dummy dataset.
 */
export function createDummyDataset(name: string = "ICFCAT.MV3B.CATALOGA"): Dataset {
    return {
        allocatedSize: 15,
        allocationUnit: "BLOCK",
        averageBlock: 0,
        blockSize: 6160,
        catalogName: name,
        creationDate: "2017/07/25",
        dataSetOrganization: "PO",
        deviceType: "3390",
        directoryBlocks: 10,
        expirationDate: "2020/07/25",
        migrated: false,
        name: "TEST.DATASET",
        primary: 10,
        recordFormat: "FB",
        recordLength: 80,
        secondary: 5,
        used: 0,
        volumeSerial: "3BP001",
    };
}
