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
jest.mock("vscode");

import * as vscode from "vscode";
import { ExtensionContext } from "../__mocks__/vscode";
import { Connection } from "../model/Connection";
import { Dataset, DSOrg, Filter, Member } from "../model/DSEntities";
import { SettingsFacade } from "../service/SettingsFacade";
import { DatasetDataProvider } from "../ui/tree/DatasetDataProvider";
import {
    createFilterPath,
    NodeType,
    ZDatasetFilterNode,
    ZDatasetNode,
    ZHostNode,
    ZMemberNode,
    ZSubsystemNode,
    ZUserDatasetNode,
} from "../ui/tree/DatasetTreeModel";
import { createDummyDataset } from "./utils/DatasetUtils";
import { generateDefaultFilter, generateConnection } from "./utils/TestUtils";

// tslint:disable: no-big-function
describe("DatasetDataProvider", () => {
    const context: any = new ExtensionContext();

    describe("Object convertion", () => {
        const cache = {
            getItemCollapsState: jest.fn().mockReturnValue(vscode.TreeItemCollapsibleState.Collapsed),
        };
        const editorManager = {
            isEditedMember: jest.fn().mockReturnValue(false),
        };

        const dsp: DatasetDataProvider = new DatasetDataProvider(
            context,
            editorManager as any,
            cache as any,
            {} as any,
        );
        const connection: Connection = generateConnection("connection");

        it("should map connection node to tree item", () => {
            const item: vscode.TreeItem = dsp.getTreeItem(new ZHostNode(connection));
            expect(item.tooltip).toBe(connection.url);
            expect(item.label).toBe(connection.name);
            expect(item.collapsibleState).toBe(vscode.TreeItemCollapsibleState.Expanded);
            expect(item.contextValue).toBe("host");
        });

        it("should map subsystem node to tree item", () => {
            const item: vscode.TreeItem = dsp.getTreeItem(new ZSubsystemNode(NodeType.DATASETS_ROOT, connection));
            expect(item.label).toBe("Data Sets");
            expect(item.collapsibleState).toBe(vscode.TreeItemCollapsibleState.Expanded);
            expect(item.contextValue).toBe("datasetsRoot");
        });

        it("should map user datasets node to tree item", () => {
            const userFilter: Filter = generateDefaultFilter(connection);
            const item: vscode.TreeItem = dsp.getTreeItem(new ZUserDatasetNode(userFilter, connection));
            expect(item.label).toBe(userFilter.name);
            expect(item.contextValue).toBe("userDatasets");
        });

        it("should map filter node to tree item", () => {
            const filter: Filter = { name: "filter name", value: "FFFF.*" };
            const item: vscode.TreeItem = dsp.getTreeItem(new ZDatasetFilterNode(filter, connection));
            expect(item.label).toBe(filter.name);
            expect(item.contextValue).toBe("datasetsFilter");
        });

        describe("Dataset nodes", () => {
            const dataset: Dataset = createDummyDataset({ name: "UNIT.TEST.COBOL" });
            it("should map dataset PS node to tree item", () => {
                dataset.dataSetOrganization = DSOrg.PS;
                const datasetNode: ZDatasetNode = new ZDatasetNode(dataset, connection, "");
                const item: vscode.TreeItem = dsp.getTreeItem(datasetNode);
                expect(item.contextValue).toBe("dataset_PS");
                expect(item.label).toBe(dataset.name);
                expect(item.collapsibleState).toBe(vscode.TreeItemCollapsibleState.None);
            });
            it("should map dataset PO node to tree item", () => {
                dataset.dataSetOrganization = DSOrg.PO;
                const datasetNode: ZDatasetNode = new ZDatasetNode(dataset, connection, "");
                const item: vscode.TreeItem = dsp.getTreeItem(datasetNode);
                expect(item.contextValue).toBe("dataset_PO");
                expect(item.label).toBe(dataset.name);
                expect(item.collapsibleState).toBe(vscode.TreeItemCollapsibleState.Collapsed);
            });
            it("should map dataset VSAM node to tree item", () => {
                dataset.dataSetOrganization = DSOrg.VS;
                const datasetNode: ZDatasetNode = new ZDatasetNode(dataset, connection, "");
                const item: vscode.TreeItem = dsp.getTreeItem(datasetNode);
                expect(item.contextValue).toBe("dataset_VSAM");
                expect(item.label).toBe(dataset.name);
                expect(item.collapsibleState).toBe(vscode.TreeItemCollapsibleState.None);
            });
            it("should map dataset PO_E node to tree item", () => {
                dataset.dataSetOrganization = DSOrg.PO_E;
                const datasetNode: ZDatasetNode = new ZDatasetNode(dataset, connection, "");
                const item: vscode.TreeItem = dsp.getTreeItem(datasetNode);
                expect(item.contextValue).toBe("dataset_PO_E");
                expect(item.label).toBe(dataset.name);
                expect(item.collapsibleState).toBe(vscode.TreeItemCollapsibleState.Collapsed);
            });
            it("should map dataset (undefine type) node to tree item", () => {
                dataset.dataSetOrganization = undefined;
                const datasetNode: ZDatasetNode = new ZDatasetNode(dataset, connection, "");
                const item: vscode.TreeItem = dsp.getTreeItem(datasetNode);
                expect(item.contextValue).toBe("dataset_undefined");
                expect(item.label).toBe(dataset.name);
                expect(item.collapsibleState).toBe(vscode.TreeItemCollapsibleState.None);
            });
        });
        describe("Dataset member nodes", () => {
            it("should map dataset membernode to tree item", () => {
                const dataset: Dataset = createDummyDataset({ name: "UNIT.TEST.COBOL" });
                const member: Member = { name: "MEMBER1" };
                const memberNode: ZMemberNode = new ZMemberNode(dataset, member, connection, "");
                const item: vscode.TreeItem = dsp.getTreeItem(memberNode);
                expect(item.label).toBe(member.name);
                expect(item.collapsibleState).toBe(vscode.TreeItemCollapsibleState.None);
            });
        });
    });

    describe("Data collection", () => {
        const filter: Filter = { name: "f1", value: "UNITTEST" };
        const connectionWithoutFilter: Connection = generateConnection("host_without_filter");
        const connectionWithFilter: Connection = generateConnection("host_with_filter");
        connectionWithFilter.filters = [filter];

        const userNode: ZUserDatasetNode = new ZUserDatasetNode(
            generateDefaultFilter(connectionWithoutFilter),
            connectionWithoutFilter,
        );

        const userNodeWithFilter: ZUserDatasetNode = new ZUserDatasetNode(
            generateDefaultFilter(connectionWithFilter),
            connectionWithFilter,
        );

        const cache = {
            cache: jest.fn(),
            loadFromCache: jest.fn().mockReturnValue(undefined),
        };

        it("should return list of connections", async () => {
            SettingsFacade.listHosts = jest.fn().mockReturnValue([connectionWithFilter, connectionWithoutFilter]);
            const dsp: DatasetDataProvider = new DatasetDataProvider(context, {} as any, {} as any, {} as any);
            expect(await dsp.getChildren()).toEqual([
                new ZHostNode(connectionWithFilter),
                new ZHostNode(connectionWithoutFilter),
            ]);
        });

        it("should return subsystem node under connection node", async () => {
            const dsp: DatasetDataProvider = new DatasetDataProvider(context, {} as any, {} as any, {} as any);
            expect(await dsp.getChildren(new ZHostNode(connectionWithoutFilter))).toEqual([
                new ZSubsystemNode(NodeType.DATASETS_ROOT, connectionWithoutFilter),
            ]);
        });

        it("should return default filter node under subsystem node", async () => {
            const dsp: DatasetDataProvider = new DatasetDataProvider(context, {} as any, {} as any, {} as any);
            expect(await dsp.getChildren(new ZSubsystemNode(NodeType.DATASETS_ROOT, connectionWithoutFilter))).toEqual([
                userNode,
            ]);
        });

        it("should return filter nodes under subsystem node", async () => {
            const dsp: DatasetDataProvider = new DatasetDataProvider(context, {} as any, {} as any, {} as any);
            expect(await dsp.getChildren(new ZSubsystemNode(NodeType.DATASETS_ROOT, connectionWithFilter))).toEqual([
                new ZDatasetFilterNode(filter, connectionWithFilter),
                userNodeWithFilter,
            ]);
        });

        it("should return datasets under filter node", async () => {
            const dataset: Dataset = createDummyDataset({ name: filter.value + ".DATASET" });
            const datasetService = {
                listDatasets: jest.fn().mockReturnValueOnce(Promise.resolve([dataset])),
            };
            const dsp: DatasetDataProvider = new DatasetDataProvider(
                context,
                {} as any,
                cache as any,
                datasetService as any,
            );
            const filterNode = new ZDatasetFilterNode(filter, connectionWithFilter);
            expect(await dsp.getChildren(filterNode)).toEqual([
                new ZDatasetNode(dataset, connectionWithFilter, filterNode.path),
            ]);
        });

        it("should return datasets under default filter node", async () => {
            const dataset: Dataset = createDummyDataset({ name: connectionWithoutFilter.username + ".DATASET" });
            const datasetService = {
                listDatasets: jest.fn().mockReturnValueOnce(Promise.resolve([dataset])),
            };
            const dsp: DatasetDataProvider = new DatasetDataProvider(
                context,
                {} as any,
                cache as any,
                datasetService as any,
            );
            expect(await dsp.getChildren(userNode)).toEqual([
                new ZDatasetNode(dataset, connectionWithoutFilter, userNode.path),
            ]);
        });

        it("should return members under dataset node", async () => {
            const dataset: Dataset = createDummyDataset({ name: connectionWithoutFilter.username + ".DATASET" });
            const member: Member = { name: "MEMBER" };
            const datasetService = {
                listMembers: jest.fn().mockReturnValue(Promise.resolve([member.name])),
            };
            const dsp: DatasetDataProvider = new DatasetDataProvider(
                context,
                {} as any,
                cache as any,
                datasetService as any,
            );
            const prefix = createFilterPath(connectionWithFilter, filter);
            const datasetNode: ZDatasetNode = new ZDatasetNode(dataset, connectionWithFilter, prefix);
            expect(await dsp.getChildren(datasetNode)).toEqual([
                new ZMemberNode(dataset, member, connectionWithFilter, datasetNode.path),
            ]);
        });
    });
});

