import { Connection } from "../../model/Connection";
import { Dataset } from "../../model/DSEntities";

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
export function generateConnection(name: string = "some connection"): Connection {
    return {
        name,
        url: "https://" + name + ":65534/",
        username: "username",
    };
}

export function generateDefaultFilter(connection: Connection) {
    return { name: "My Data Sets", value: connection.username.toLocaleUpperCase() };
}

export function generateDummyFilter() {
    return { name: "Dummy filter", value: "dummy user" };
}

export function generateArgs(dataset: Dataset) {
    const host: Connection = generateConnection("some connection");

    return {
        dataset,
        host,
        path: "",
    };
}

export function generateDataserviceMock(isDatasetExists: boolean) {
    return {
        // forced to be true
        allocateDatasetLike: jest.fn().mockReturnValue(Promise.resolve(true)),
        isDatasetExists: jest.fn().mockReturnValue(Promise.resolve(isDatasetExists)),
    };
}
