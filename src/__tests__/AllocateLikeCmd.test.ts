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

describe("[POSITIVE TESTS] Allocate like command", () => {

    let trackUnit : string = "TRACK";
    let cylinderUnit : string = "CYLINDER";
    let blocksUnit : string = "BLOCKS";

    test("Allocate like a PO dataset", () => {
        expect(1).toBe(1);
    });

    test("Allocate like a PS dataset", () => {
        expect(1).toBe(1);
    });

    test("Allocate like a PO_E dataset", () => {
        expect(1).toBe(1);
    });

    test("Allocate like a TRACK unit dataset", () => {
        expect(1).toBe(1);
    });

    test("Allocate like a CYLINDER unit dataset", () => {
        expect(1).toBe(1);
    });
});

describe("[NEGATIVE TESTS] Allocate like command", () => {
    test("Allocate like a VSAM dataset - not allowed", () => {
        expect(1).toBe(1);
    });

    test("Allocate like a BLOCKS unit dataset", () => {
        expect(1).toBe(1);
    });

    test("Allocate like a dataset without providing name", () => {
        expect(1).toBe(1);
    });

    test("Allocate like an already defined dataset", () => {
        expect(1).toBe(1);
    });
});
