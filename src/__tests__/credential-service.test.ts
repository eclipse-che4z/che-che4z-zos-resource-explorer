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
jest.mock("../service/SettingsFacade");
import { Connection } from "../model/Connection";
import { DefaultCredentialsService } from "../service/CredentialsService";

describe("Credentials", () => {
    it("Returns a promise with credentials for existing host credentials", async () => {
        const host: Connection = { name: "", url: "", username: "" };
        const service: DefaultCredentialsService = new DefaultCredentialsService();
        const result = await service.requestCredentials(host);
        const expectedResult = {password: "", username: ""};
        expect(result).toEqual(expectedResult);
    });
    it("Resets the credentials", () => {
        const host: Connection = { name: "", url: "", username: "" };
        const service: DefaultCredentialsService = new DefaultCredentialsService();
        const mockListener = jest.spyOn(service, "resetPassword");
        service.resetPassword(host);
        const callback = mockListener.mock.calls[0][0];
        expect(callback).toBe(host);
    });
    it("Check if show error message works properly", () => {
        const service: DefaultCredentialsService = new DefaultCredentialsService();
        const errorMessage = "ErrorMessage";
        const mockListener = jest.spyOn(service, "showErrorMessage");
        service.showErrorMessage(errorMessage);
        const callback = mockListener.mock.calls[0][0];
        expect(callback).toBe(errorMessage);
    });
},
 );
