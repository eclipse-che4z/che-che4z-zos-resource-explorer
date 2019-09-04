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
"use strict";

const fs = jest.genMockFromModule("fs");

function readFileSync(path) {
    return "CONTENT";
}

function existsSync(path) {
    return true;
}

// tslint:disable-next-line: no-string-literal
fs["readFileSync"] = readFileSync;

module.exports = fs;
