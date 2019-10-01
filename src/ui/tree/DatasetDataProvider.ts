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
import { Connection } from "../../model/Connection";
import { Dataset, DSOrg } from "../../model/DSEntities";
import { DatasetCache } from "../../service/DatasetCache";
import { DatasetEditManager } from "../../service/DatasetEditManager";
import { DatasetService } from "../../service/DatasetService";
import { SettingsFacade } from "../../service/SettingsFacade";
import {
    NodeType,
    ZDatasetFilterNode,
    ZDatasetNode,
    ZEmptyDatasetNode,
    ZEmptyNode,
    ZHostNode,
    ZMemberNode,
    ZNode,
    ZSubsystemNode,
    ZUserDatasetNode,
} from "./DatasetTreeModel";

export class DatasetDataProvider implements vscode.TreeDataProvider<ZNode> {
    // tslint:disable-next-line: variable-name
    private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
    // tslint:disable-next-line: member-ordering
    public readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;
    private editMemberIcons: {};
    private editDatasetIcons: {};

    constructor(
        private context: vscode.ExtensionContext,
        private datasetEditorManager: DatasetEditManager,
        private datasetCache: DatasetCache,
        private datasetService: DatasetService,
    ) {
        this.editMemberIcons = {
            dark: this.context.asAbsolutePath(path.join("resources", "dark", "sync.svg")),
            light: this.context.asAbsolutePath(path.join("resources", "light", "sync.svg")),
        };
        this.editDatasetIcons = {
            dark: this.context.asAbsolutePath(path.join("resources", "dark", "Icon-PO,PDS-notSync.svg")),
            light: this.context.asAbsolutePath(path.join("resources", "light", "Icon-Light-PO,PDS-NotSync.svg")),
        };
    }

    public getTreeItem(element: ZNode): vscode.TreeItem {
        const node: vscode.TreeItem = new vscode.TreeItem(
            "undefined node",
            this.datasetCache.getItemCollapsState(element.path),
        );
        node.contextValue = element.type;

        if (NodeType.HOST === element.type) {
            const varHostNode: ZHostNode = element as ZHostNode;
            node.tooltip = varHostNode.host.url;
            node.label = varHostNode.host.name;
            node.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
        }
        if (NodeType.DATASETS_ROOT === element.type) {
            node.label = "Data Sets";
            node.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
        }
        if (NodeType.USER_DATASETS === element.type) {
            node.label = (element as ZUserDatasetNode).filter.name;
        }
        if (NodeType.DATASETS_FILTER === element.type) {
            node.label = (element as ZDatasetFilterNode).filter.name;
        }
        if (NodeType.DATASET === element.type) {
            const znode: ZDatasetNode = element as ZDatasetNode;
            node.contextValue = "dataset_" + znode.dataset.dataSetOrganization;
            node.label = znode.dataset.name;
            node.iconPath = this.getDatasetIcon(znode);
            if (!this.canExpandDataset(znode)) {
                node.collapsibleState = vscode.TreeItemCollapsibleState.None;
            }
            if (this.datasetEditorManager.isEdited(znode.host.name, znode.dataset.name)) {
                node.tooltip = "Dataset Member in Edit Mode";
            }
        }
        if (NodeType.MEMBER === element.type) {
            const memberNode: ZMemberNode = element as ZMemberNode;
            node.label = memberNode.member.name;
            if (
                this.datasetEditorManager.isEdited(
                    memberNode.host.name,
                    memberNode.dataset.name,
                    memberNode.member.name,
                )
            ) {
                node.tooltip = "Member is in Edit Mode";
                node.iconPath = this.editMemberIcons;
            } else {
                node.iconPath = {
                    dark: this.context.asAbsolutePath(path.join("resources", "dark", "Icon-PS-DS-Member-Default.svg")),
                    light: this.context.asAbsolutePath(path.join("resources", "light", "PS_icon.svg")),
                };
            }
            node.collapsibleState = vscode.TreeItemCollapsibleState.None;
        }
        if (NodeType.CREATE_CONNECTION === element.type) {
            node.label = "New connection";
            node.collapsibleState = vscode.TreeItemCollapsibleState.None;
            node.command = {
                command: "zosexplorer.createConnection",
                title: "New connection",
            };
            // TODO remove if Theis fix naming (theia/packages/plugin-ext/src/main/browser/view/tree-views-main.tsx)
            // handleTreeEvents expect node.command.id with command id, but vscode - node.command.command
            // issue: https://github.com/theia-ide/theia/issues/5744
            // @ts-ignore
            node.command.id = "zosexplorer.createConnection";
        }
        if (NodeType.NONE === element.type) {
            node.tooltip = "This dataset does not exist";
            node.label = "<Invalid Path>";
            node.collapsibleState = vscode.TreeItemCollapsibleState.None;
        }
        if (NodeType.CREATE_CONNECTION === element.type) {
            node.label = "New connection";
            node.collapsibleState = vscode.TreeItemCollapsibleState.None;
            node.command = {
                command: "zosexplorer.createConnection",
                title: "New connection",
            };
            // TODO remove if Theis fix naming (theia/packages/plugin-ext/src/main/browser/view/tree-views-main.tsx)
            // handleTreeEvents expect node.command.id with command id, but vscode - node.command.command
            // issue: https://github.com/theia-ide/theia/issues/5744
            // @ts-ignore
            node.command.id = "zosexplorer.createConnection";
        }
        return { ...node, ...element };
    }
    public async getChildren(element?: ZNode): Promise<ZNode[]> {
        if (!element) {
            return new Promise((resolve) => {
                let hostNodes: ZNode[] = [];
                SettingsFacade.listHosts().forEach((host) => {
                    hostNodes.push(new ZHostNode(host));
                });
                hostNodes.sort((a, b) => {
                    const aVar = (a as ZHostNode).host.name.toLowerCase();
                    const bVar = (b as ZHostNode).host.name.toLowerCase();
                    if (aVar === bVar) {
                        return 0;
                    }
                    return aVar > bVar ? 1 : -1;
                });
                const createConnectionNode = new ZNode(NodeType.CREATE_CONNECTION.toString());
                createConnectionNode.type = NodeType.CREATE_CONNECTION;
                hostNodes = [createConnectionNode, ...hostNodes];
                resolve(hostNodes);
            });
        }
        switch (element.type) {
            case NodeType.HOST:
                const varElement: ZHostNode = element as ZHostNode;
                return [new ZSubsystemNode(NodeType.DATASETS_ROOT, varElement.host)];

            case NodeType.DATASETS_ROOT:
                const host: Connection = (element as ZSubsystemNode).host;
                return [
                    ...this.listFilters(host),
                    new ZUserDatasetNode({ name: "My Data Sets", value: host.username.toUpperCase() }, host),
                ];

            case NodeType.USER_DATASETS:
                const userDatasetNode: ZUserDatasetNode = element as ZUserDatasetNode;
                return this.listDatasets(userDatasetNode.host, userDatasetNode.filter.value, userDatasetNode.path);

            case NodeType.DATASETS_FILTER:
                const filterNode: ZDatasetFilterNode = element as ZDatasetFilterNode;
                return this.listDatasets(filterNode.host, filterNode.filter.value, filterNode.path);

            case NodeType.DATASET:
                const datasetNode: ZDatasetNode = element as ZDatasetNode;
                return this.listDatasetMembers(datasetNode.host, datasetNode.dataset, datasetNode.path);

            default:
                return [];
        }
    }

    public setCollapsState(cachePath: string, state: vscode.TreeItemCollapsibleState): void {
        this.datasetCache.setCollapsState(cachePath, state);
    }

    public refresh() {
        this._onDidChangeTreeData.fire();
    }

    public reloadSettings(): void {
        this.datasetCache.invalidate(SettingsFacade.listHosts());
        this.refresh();
    }

    private listFilters(host: Connection): ZDatasetFilterNode[] {
        if (host.filters) {
            const resultNodes: ZDatasetFilterNode[] = [];
            host.filters.forEach((filter) => {
                resultNodes.push(new ZDatasetFilterNode(filter, host));
            });
            return resultNodes;
        }
        return [];
    }

    private canExpandDataset(dsNode: ZDatasetNode): boolean {
        return !(
            dsNode.dataset.dataSetOrganization === DSOrg.VS ||
            dsNode.dataset.dataSetOrganization === DSOrg.PS ||
            dsNode.dataset.dataSetOrganization === undefined
        );
    }

    private getDatasetIcon(dsNode: ZDatasetNode): {} {
        if (this.datasetEditorManager.isEdited(dsNode.host.name, dsNode.dataset.name)) {
            return this.editDatasetIcons;
        } else {
            let dsOrg = dsNode.dataset.dataSetOrganization ? dsNode.dataset.dataSetOrganization : "dataset";
            // Use same icon as PO
            if (dsOrg === DSOrg.PO_E) {
                dsOrg = DSOrg.PO;
            }
            const icon = dsNode.dataset.migrated ? dsOrg.concat("_archive") : dsOrg;
            return {
                dark: this.context.asAbsolutePath(path.join("resources", "dark", icon.concat("_icon.svg"))),
                light: this.context.asAbsolutePath(path.join("resources", "light", icon.concat("_icon.svg"))),
            };
        }
    }

    private async listDatasets(host: Connection, filterValue: string, pathPrefix: string): Promise<any> {
        await SettingsFacade.requestCredentials(host);
        if (this.updateHostUsername(host)) {
            return;
        }
        let result: ZNode[] | undefined = this.datasetCache.loadFromCache(pathPrefix);
        if (result) {
            return result;
        } else {
            result = [];
        }

        try {
            const datasets: Dataset[] = await this.datasetService.listDatasets(host, filterValue);
            for (const ds of datasets) {
                const newNode: ZDatasetNode = new ZDatasetNode(ds, host, pathPrefix);
                result.push(newNode);
                this.datasetCache.cache(newNode.path, newNode);
            }
            if (result.length === 0) {
                vscode.window.showWarningMessage("No dataset found.");
                result.push(new ZEmptyDatasetNode());
            }
            return result;
        } catch (error) {
            let message = error.body;
            if (error.message && error.message ===
                "ServletDispatcher failed - received TSO Prompt when expecting TsoServletResponse") {
                // tslint:disable-next-line: max-line-length
                message = "Cannot list datasets based on current filter. Amend filter to exclude datasets archived by CA Disk.";
            }
            return this.processZoweError(message, host);
        }
    }

    private async listDatasetMembers(host: Connection, dataset: Dataset, pathPrefix: string): Promise<any> {
        await SettingsFacade.requestCredentials(host);
        const isUsernameUpdated = this.updateHostUsername(host);
        if (isUsernameUpdated) {
            return;
        }
        const result: ZNode[] | undefined = this.datasetCache.loadFromCache(pathPrefix);
        if (result !== undefined) {
            return result;
        }
        try {
            const members = await this.datasetService.listMembers(host, dataset.name);
            const resultNodes: ZMemberNode[] = [];
            for (const member of members) {
                const newNode: ZMemberNode = new ZMemberNode(dataset, { name: member }, host, pathPrefix);
                resultNodes.push(newNode);
                this.datasetCache.cache(newNode.path, newNode);
            }
            if (resultNodes.length === 0) {
                vscode.window.showInformationMessage("No member found.");
                return [new ZEmptyNode(dataset, { name: "<Empty>" }, host)];
            }
            return resultNodes;
        } catch (error) {
            this.processZoweError(JSON.parse(error.body), host);
        }
    }
    private processZoweError(error, host) {
        vscode.window.showErrorMessage(host.name + ": " + error);
    }

    private updateHostUsername(host: Connection): boolean {
        const hosts: Connection[] = SettingsFacade.listHosts();
        for (const h of hosts) {
            if (host.name === h.name && h.username !== host.username) {
                h.username = host.username;
                SettingsFacade.updateHosts(hosts);
                return true;
            }
        }
        return false;
    }
}
