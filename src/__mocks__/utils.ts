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
import { Connection } from "../model/Connection";

export async function createPhysicalDocument(
    datasetName: string,
    memberName: string,
    host: Connection,
    content: string,
) {

}

export function validateMemberName(inputValue: string): string | undefined {
    console.log("here i am");
    return inputValue;
}
