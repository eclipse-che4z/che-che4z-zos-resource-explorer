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

import * as vscode from "vscode";
import { browseMember } from "../commands/BrowseMember";
import { Connection } from "../model/Connection";
import { Member } from "../model/DSEntities";
import { createDummyDataset } from "./utils/DatasetUtils";
import { generateConnection } from "./utils/TestUtils";

describe("BrowseMember Command", () => {
    const content = "Hello, World!";
    const datasetService = {
        getContent: jest.fn().mockReturnValue(content),
    };
    const doc = {};
    vscode.workspace.openTextDocument = jest.fn().mockReturnValue(Promise.resolve(doc));
    const connection: Connection = generateConnection();

    it("should browse dataset", async () => {
        const dataset = createDummyDataset();
        const arg = { host: connection, dataset };
        try {
            await browseMember(datasetService as any, arg);
        } catch (error) {
            fail(error);
        }
        expect(datasetService.getContent).toBeCalledWith(connection, dataset.name);
        expect(vscode.workspace.openTextDocument).toBeCalledWith({ language: "plain", content });
    });

    it("should browse member", async () => {
        const dataset = createDummyDataset();
        const member: Member = { name: "MEMBER1" };
        const arg = { host: connection, dataset, member };
        try {
            await browseMember(datasetService as any, arg);
        } catch (error) {
            fail(error);
        }
        expect(datasetService.getContent).toBeCalledWith(connection, `${dataset.name}(${member.name})`);
        expect(vscode.workspace.openTextDocument).toBeCalledWith({ language: "plain", content });
    });

    it("should change language id (COBOL) based on dataset name on browse member", async () => {
        const dataset = createDummyDataset({name: "UNIT.TEST.COBOL"});
        const member: Member = { name: "MEMBER1" };
        const arg = { host: connection, dataset, member };
        try {
            await browseMember(datasetService as any, arg);
        } catch (error) {
            fail(error);
        }
        expect(vscode.workspace.openTextDocument).toBeCalledWith({ language: "COBOL", content });
    });
    // tslint:disable-next-line: no-identical-functions
    it("should change language id (JCL) based on dataset name on browse member", async () => {
        const dataset = createDummyDataset({name: "UNIT.TEST.JCL"});
        const member: Member = { name: "COBOL" };
        const arg = { host: connection, dataset, member };
        try {
            await browseMember(datasetService as any, arg);
        } catch (error) {
            fail(error);
        }
        expect(vscode.workspace.openTextDocument).toBeCalledWith({ language: "JCL", content });
    });

    it("should show error message on error", async () => {
        const error = "Test error";
        const badDatasetService = {
            getContent: jest.fn().mockRejectedValue(error),
        };
        try {
            vscode.window.showErrorMessage = jest.fn();
            const dataset = createDummyDataset();
            const arg = { host: connection, dataset };
            await browseMember(badDatasetService as any, arg);
            expect(vscode.window.showErrorMessage).toBeCalledWith("Browse member error: " + error);
        } catch (error) {
            fail(error);
        }
    });
});
