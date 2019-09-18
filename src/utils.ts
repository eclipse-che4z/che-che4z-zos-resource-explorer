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

import fs = require("fs");
import os = require("os");
import * as path from "path";
import * as vscode from "vscode";
import {
    MAX_DSNAME_LENGTH,
    MAX_SEGMENT_LENGTH,
    MAX_SEGMENTS_COUNT,
    MIN_SEGMENT_LENGTH,
    MIN_SEGMENTS_COUNT,
} from "./constants";
import { Connection } from "./model/Connection";
import { Dataset, Member } from "./model/DSEntities";
import { SEPARATOR } from "./service/DatasetEditManager";

export function validateMemberName(inputValue: string): string | undefined {
    if (!inputValue) {
        return "MemberName must not be empty.";
    }
    if (inputValue.length > MAX_SEGMENT_LENGTH) {
        return "MemberName must not be more than 8 characters.";
    }
    const segmentHlqFirstCharRegex = new RegExp("^([@#$a-zA-Z])$");

    if (!segmentHlqFirstCharRegex.test(inputValue.charAt(0))) {
        return "Invalid Name " + inputValue;
    }
    const segmentHlqSegmentRegex = new RegExp("^([@#$a-zA-Z0-9]{1,8})$");

    if (!segmentHlqSegmentRegex.test(inputValue)) {
        return "Invalid Name " + inputValue;
    }
    return undefined;
}

/**Validate the dataset and verify that is not already existed
 * @author zacan01
 * @param inputValue
 */
export function validateDatasetName(inputValue: string): string | undefined {
    const nameSegments = inputValue.split(".");

    const segmentHlqFirstCharRegex = new RegExp("^([@#$A-Za-z])$");

    const segmentHlqSegmentRegex = new RegExp("^([@#$A-Za-z0-9-]{1,8})$");
    for (const segment of nameSegments) {
        if (segment.length === 0) {
            return "Dataset name segment must not be empty.";
        }

        if (segment.length > 8) {
            return "Dataset name segment can't be more than 8 characters.";
        }

        if (!segmentHlqFirstCharRegex.test(segment.charAt(0))) {
            return `Dataset name segment: ${segment} starts with a prohibited character.`;
        }

        if (!segmentHlqSegmentRegex.test(segment)) {
            return `Dataset name segment: ${segment} contains a prohibited character.`;
        }
    }
    return undefined;
}

/**
 * Checks if the provided filter string complies with the dataset/filter naming conventions.
 * @todo Address string externalization at some point.
 * @param host
 * @param input
 * @return A String containing an error message if any violation of naming convetions is detected.
 *  Undefined if no errors were detected.
 */
export function checkFilterString(host: Connection, input: string): string | undefined {
    if (!input) {
        return "Filter string cannot be empty";
    }
    if (input.length > MAX_DSNAME_LENGTH) {
        return "Filter string is too long";
    }
    if (input.startsWith(".")) {
        return "Filter string starts with a '.'";
    }
    if (input.endsWith(".")) {
        return "Filter string ends with a '.'";
    }
    if (input.toLowerCase().includes("..")) {
        return "Filter string includes a '..'";
    }

    const nameSegments: string[] = input.toUpperCase().split(".");

    for (let i = 0; i < nameSegments.length; i++) {
        const errorMessage = checkFilterSegment(nameSegments[i], i);
        if (errorMessage) {
            return errorMessage;
        }
    }

    if (duplicateFilterString(host, input)) {
        return "Duplicate Filter string";
    }
    return undefined;
}

/**
 * Loops through all the filters of the provided host to check for a duplicate filter.
 * @param host
 * @param value
 * @return True or False based on whether a duplicate filter is found.
 */
function duplicateFilterString(host: Connection, value: string): boolean {
    if (!host.filters) {
        return false;
    }
    for (const f of host.filters) {
        if (f.value.toUpperCase() === value.toUpperCase()) {
            return true;
        }
    }
    return false;
}

/**
 * Checks each segment of the provided input for any prohibited characters and returns an error message for it.
 * @param input
 * @param segment
 * @return A String containing an error message if any violation of naming convetions is detected.
 *  Undefined if no errors were detected.
 */
function checkFilterSegment(segment: string, index: number): string | undefined {
    if (segment.length < MIN_SEGMENT_LENGTH) {
        return "Node: " + segment + " is too short";
    }
    if (segment.length > MAX_SEGMENT_LENGTH) {
        return "Node: " + segment + " is too long";
    }
    // first letter should be A-Z or @#$.
    if (segment.length >= MIN_SEGMENT_LENGTH) {
        const firstChar = segment.charAt(0);
        if (index === 0) {
            // is HLQ?
            const segmentHlqFirstCharRegex = new RegExp("^([@#$A-Z])$");
            const segmentHlqSegmentRegex = new RegExp("^([-@#$A-Z0-9]{1,8})$");
            if (!segmentHlqFirstCharRegex.test(firstChar)) {
                return "Filter segment:" + segment + " starts with a prohibited character: " + firstChar;
            }
            if (!segmentHlqSegmentRegex.test(segment)) {
                return "Filter node: " + segment + " contains a prohibited character";
            }
        }
        const segmentFirstCharRegex = new RegExp("^([@#$*A-Z])$");
        const segmentRegex = new RegExp("^([-@#$*A-Z0-9]{1,8}|[*]{1,2})$");
        if (!segmentFirstCharRegex.test(firstChar)) {
            return "Filter segment:" + segment + " starts with a prohibited character: " + firstChar;
        }
        if (!segmentRegex.test(segment)) {
            return "Filter node: " + segment + " contains a prohibited character";
        }
        // todo improve this logic
        if (segment.toLowerCase().includes("**") && segment.length > 2) {
            return "Filter string includes invalid consecutive '*'";
        }
    }
    return undefined;
}
export function ensureDirectoryExistence(filePath: string) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

export function generateTempFileName(
    host: Connection,
    dataset: Dataset,
    member: Member,
    tmpPrefix: string = path.join(os.tmpdir(), "zosExplorer"),
) {
    const dirPath = path.join(tmpPrefix, Buffer.from(host.name).toString("base64"));
    const dsnameSegments = dataset.name.split(".");
    const ext: string = mapToExtension(dsnameSegments[dsnameSegments.length - 1]);
    return path.join(dirPath, dataset.name + SEPARATOR + member.name + "." + ext);
}

function mapToExtension(ext: string) {
    switch (ext) {
        case "COBOL":
            return "cbl";
        case "JCL":
            return "jcl";
        case "CBL":
            return "cbl";
        default:
            return "txt";
    }
}

export async function createPhysicalDocument(
    datasetName: string,
    memberName: string,
    host: Connection,
    content: string,
) {
    const filePath = generateTempFileName(host, {name: datasetName}, {name: memberName});

    ensureDirectoryExistence(filePath);
    if (fs.existsSync(filePath)) {
        await vscode.window
            .showInformationMessage("Do you want to Open the Already Existing File ?", "OK")
            .then(async (message) => {
                if (message !== "OK") {
                    fs.writeFileSync(filePath, content, "utf8");
                }
            });
    } else {
        fs.writeFileSync(filePath, content, "utf8");
    }
    const document: vscode.TextDocument = await vscode.workspace.openTextDocument(filePath);
    await vscode.window.showTextDocument(document, { preview: false });
}

/**
 * Create a dummy dataset.
 * @return A dummy dataset.
 */
export function createDummyDataset(): Dataset {
    return {
        allocatedSize: 15,
        allocationUnit: "BLOCK",
        averageBlock: 0,
        blockSize: 6160,
        catalogName: "ICFCAT.MV3B.CATALOGA",
        creationDate: "2017/07/25",
        dataSetOrganization: "PO",
        deviceType: "3390",
        directoryBlocks: 10,
        expirationDate: "2020/07/25",
        migrated: false,
        name: "TEST.DATASET",
        primary: 10,
        recordFormat: "FB",
        recordLength: 80,
        secondary: 5,
        used: 0,
        volumeSerial: "3BP001",
    };
}
