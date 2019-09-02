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

export interface Filter {
    name: string;
    value: string;
}

export interface Dataset {
    allocatedSize: number;
    allocationUnit: string;
    averageBlock: number;
    blockSize: number;
    catalogName: string;
    creationDate: string;
    dataSetOrganization?: string;
    deviceType: string;
    directoryBlocks: number;
    expirationDate: string;
    migrated: boolean;
    name: string;
    primary: number;
    recordFormat: string;
    recordLength: number;
    secondary: number;
    used: number;
    volumeSerial: string;
}

export interface Member {
    name: string;
}

export enum DSOrg {
    PS = "PS",
    PO = "PO",
    VS = "VSAM",
    PO_E = "PO_E",
}
