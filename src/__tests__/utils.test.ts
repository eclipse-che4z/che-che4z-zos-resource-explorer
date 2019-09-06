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
import * as path from "path";
import * as vscode from "vscode";
import { Connection } from "../model/Connection";
import { Member } from "../model/DSEntities";
import { checkFilterString, createDummyDataset, createPhysicalDocument, generateTempFileName,
   validateDatasetName, validateMemberName } from "../utils";

describe("Validate the member name", () => {
    it("Returns a warning about an empty name", () => {
      const expectedReturnedValue = "MemberName must not be empty.";
      const input = "";
      const returnedValue = validateMemberName(input);
      expect(expectedReturnedValue).toEqual(returnedValue);
    });
    it("Returns a warning about a big name", () => {
      const input = "abcdefgji";
      const expectedReturnedValue = "MemberName must not be more than 8 characters.";
      const returnedValue = validateMemberName(input);
      expect(expectedReturnedValue).toEqual(returnedValue);
    });
    it("Returns a warning about a wrong first character in the name", () => {
      const input = "3abfd";
      const expectedReturnedValue = "Invalid Name " + input;
      const returnedValue = validateMemberName(input);
      expect(expectedReturnedValue).toEqual(returnedValue);
    });
    it("Returns a warning about a wrong segment", () => {
      const input2 = "tab(fd)";
      const expectedReturnedValue = "Invalid Name " + input2;
      const returnedValue = validateMemberName(input2);
      expect(expectedReturnedValue).toEqual(returnedValue);
    });
    it("Returns undefined", () => {
      const input = "t3@y$C#";
      const expectedReturnedValue = undefined;
      const returnedValue = validateMemberName(input);
      expect(expectedReturnedValue).toEqual(returnedValue);
    });
  },
);
describe("Validate the dataset name", () => {
  it("Returns a warning about an empty dataset name", () => {
    const expectedReturnedValue = "Dataset name segment must not be empty.";
    const input = "";
    const returnedValue = validateDatasetName(input);
    expect(expectedReturnedValue).toEqual(returnedValue);
  });
  it("Returns a warning about a big dataset name", () => {
    const input = "gsdfgtb.abcdefgji";
    const expectedReturnedValue = "Dataset name segment can't be more than 8 characters.";
    const returnedValue = validateDatasetName(input);
    expect(expectedReturnedValue).toEqual(returnedValue);
  });
  it("Returns a warning about a wrong first character in the dataset name", () => {
    const input = "gsdfgtb.eruhf4.3abfd.asdg";
    const segment = "3abfd";
    const expectedReturnedValue = "Dataset name segment: " + segment + " starts with a prohibited character.";
    const returnedValue = validateDatasetName(input);
    expect(expectedReturnedValue).toEqual(returnedValue);
  });
  it("Returns a warning about a wrong dataset segment", () => {
    const input2 = "gsdfgtb.tab(fd).yngft";
    const segment2 = "tab(fd)";
    const expectedReturnedValue = "Dataset name segment: " + segment2 + " contains a prohibited character.";
    const returnedValue = validateDatasetName(input2);
    expect(expectedReturnedValue).toEqual(returnedValue);
  });
  it("Returns undefined", () => {
    const input = "t3@y$C#.dftbdft";
    const expectedReturnedValue = undefined;
    const returnedValue = validateDatasetName(input);
    expect(expectedReturnedValue).toEqual(returnedValue);
  });
},
);
describe("Validate the filter string", () => {
  const filterName = "eruhf4.arsrs.q#$@1Hd";
  const filterInput = {name: filterName, value: filterName};
  const host: Connection = { name: "", url: "", username: ""};
  const host2: Connection = { name: "", url: "", username: "", filters: [filterInput] };
  it("Returns a warning about an empty filter", () => {
    const expectedReturnedValue = "Filter string cannot be empty";
    const input = "";
    const returnedValue = checkFilterString(host, input);
    expect(expectedReturnedValue).toEqual(returnedValue);
  });
  it("Returns a warning about a big filter", () => {
    const input = "abcdefgj.abcdefgj.abcdefgj.abcdefgj.abcdefgj.abcdefgj";
    const expectedReturnedValue = "Filter string is too long";
    const returnedValue = checkFilterString(host, input);
    expect(expectedReturnedValue).toEqual(returnedValue);
  });
  it("Returns a warning about a leading '.' in the filter", () => {
    const input2 = ".eruhf4.dfht";
    const expectedReturnedValue = "Filter string starts with a '.'";
    const returnedValue = checkFilterString(host, input2);
    expect(expectedReturnedValue).toEqual(returnedValue);
  });
  it("Returns a warning about a finishing '.' in the filter", () => {
    const input3 = "eruhf4.gsdfgtb.";
    const expectedReturnedValue = "Filter string ends with a '.'";
    const returnedValue = checkFilterString(host, input3);
    expect(expectedReturnedValue).toEqual(returnedValue);
  });
  it("Returns a warning about a leading '.' in the filter", () => {
    const input4 = "eruhf4..arsrs";
    const expectedReturnedValue = "Filter string includes a '..'";
    const returnedValue = checkFilterString(host, input4);
    expect(expectedReturnedValue).toEqual(returnedValue);
  });
  it("Returns a warning about a duplicate filter", () => {
    const input5 = filterName;
    const expectedReturnedValue = "Duplicate Filter string";
    const returnedValue = checkFilterString(host2, input5);
    expect(expectedReturnedValue).toEqual(returnedValue);
  });
  it("Returns undefined", () => {
    const input6 = filterName;
    const expectedReturnedValue = undefined;
    const returnedValue = checkFilterString(host, input6);
    expect(expectedReturnedValue).toEqual(returnedValue);
  });
},
);
describe("Check that the extension in tempFileName is created correctly", () => {
  const filterInput = {name: "eruhf4.arsrs.q#$@1Hd", value: "eruhf4.arsrs.q#$@1Hd"};
  const dataset = createDummyDataset();
  const member: Member =  {name: "eruhf4.arsrs.q#$@1Hd"};
  const host: Connection = { name: "", url: "", username: "", filters: [filterInput] };
  const tmpPrefix = "dfg";
  it("Returns txt extension", () => {
    const expectedReturnedValue = tmpPrefix + path.sep + dataset.name + "_" + member.name + ".txt";
    const returnedValue4 = generateTempFileName(host, dataset, member, "dfg");
    expect(expectedReturnedValue).toEqual(returnedValue4);
  });
  it("Returns cbl extension", () => {
    dataset.name = "TEST.COBOL";
    const expectedReturnedValue = tmpPrefix + path.sep + dataset.name + "_" + member.name + ".cbl";
    const returnedValue = generateTempFileName(host, dataset, member, "dfg");
    expect(expectedReturnedValue).toEqual(returnedValue);
  });
  it("Returns jcl extension", () => {
    dataset.name = "TEST.JCL";
    const expectedReturnedValue = tmpPrefix + path.sep + dataset.name + "_" + member.name + ".jcl";
    const returnedValue2 = generateTempFileName(host, dataset, member, "dfg");
    expect(expectedReturnedValue).toEqual(returnedValue2);
  });
  it("Returns cbl extension", () => {
    dataset.name = "TEST.CBL";
    const expectedReturnedValue = tmpPrefix + path.sep + dataset.name + "_" + member.name + ".cbl";
    const returnedValue3 = generateTempFileName(host, dataset, member, "dfg");
    expect(expectedReturnedValue).toEqual(returnedValue3);
  });
},
);
describe("Check the creation of a PhysicalDocument", () => {
  const dataset = createDummyDataset();
  const member: Member =  {name: "eruhf4.arsrs.q#$@1Hd"};
  const host: Connection = { name: "", url: "", username: ""};
  const content = "just nothing";
  it("Checks if it reached the end of the function", async () => {
    const showTextDocument = jest.spyOn(vscode.window, "showTextDocument");
    await createPhysicalDocument(dataset.name, member.name, host, content);
    expect(showTextDocument).toBeCalledTimes(1);
  });
},
);
