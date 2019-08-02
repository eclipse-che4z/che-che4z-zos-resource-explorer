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

import * as assert from "assert";
import * as sinon from "sinon";
import { Connection } from "../model/Connection";
import { DatasetService } from "../service/DatasetService";
import { ZoweRestClient } from "../service/ZoweRestClient";

// tslint:disable: only-arrow-functions
suite("Extension Tests", function() {
    const host: Connection = { name: "", url: "", username: "" };
    const filter: string = "";
    const result: string[] = ["M1", "M2", "M3"];

    const restMock = sinon.createStubInstance(ZoweRestClient, {
        listMembers: sinon
            .stub()
            .withArgs(host, filter)
            .returns(result),
    });

    test("Datasets Service: list dataset members", function() {
        const datasetService: DatasetService = new DatasetService(restMock);
        assert.notEqual(datasetService.listMembers(host, filter), result);
    });
});
