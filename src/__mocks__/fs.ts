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

type PathLike = any | undefined;

function readFileSync(path) {
    return "CONTENT";
}

function existsSync(path: PathLike): boolean {
    return true;
}

function unlinkSync(path: PathLike): void {
    return undefined;
}

// tslint:disable-next-line: no-string-literal
fs["readFileSync"] = readFileSync;
// tslint:disable-next-line: no-string-literal
fs["existsSync"] = existsSync;

module.exports = fs;
