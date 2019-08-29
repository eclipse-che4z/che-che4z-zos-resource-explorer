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
import { Connection } from "../model/Connection";
import { Dataset, Filter, Member } from "../model/DSEntities";
import { createFilterPath, createHostPath, ZNode } from "../ui/tree/DatasetTreeModel";

/**
 * Cache path structure
 * host -> DATASET_ROOT_PATH -> filter -> dataset -> member
 */

export const PATH_SEPARATOR = "->";

export class DatasetCache {
    // path string -> ZNode
    private cached: { [key: string]: ZNode } = {};
    // path string -> TreeItemCollapsibleState
    private _treeState: { [key: string]: vscode.TreeItemCollapsibleState } = {};

    public getItemCollapsState(path: string) {
        return this._treeState[path] ? this._treeState[path] : vscode.TreeItemCollapsibleState.Collapsed;
    }

    public setCollapsState(path: string, state: vscode.TreeItemCollapsibleState): void {
        this._treeState[path] = state;
    }

    // TODO: chack if its possible to remove path from arguments
    public cache(path: string, object: ZNode) {
        this.cached[path] = object;
    }

    public resetDataset(host: Connection, dataset: Dataset) {
        for (const path in this.cached) {
            if (
                this.getPathSegment(path, SegmentType.HOST) === createHostPath(host) &&
                this.getPathSegment(path, SegmentType.DATASET) === dataset.name &&
                this.getPathSegment(path, SegmentType.MEMBER)
            ) {
                this.del(path);
            }
        }
    }

    public resetMember(host: Connection, dataset: Dataset, member: Member) {
        for (const path in this.cached) {
            if (
                this.getPathSegment(path, SegmentType.HOST) === createHostPath(host) &&
                this.getPathSegment(path, SegmentType.DATASET) === dataset.name &&
                this.getPathSegment(path, SegmentType.MEMBER) === member.name
            ) {
                this.del(path);
            }
        }
    }

    public resetFilter(host: Connection, filter: Filter) {
        for (const path in this.cached) {
            if (
                this.getPathSegment(path, SegmentType.HOST) === createHostPath(host) &&
                this.getPathSegment(path, SegmentType.FILTER) === filter.value &&
                this.getPathSegment(path, SegmentType.DATASET)
            ) {
                this.del(path);
            }
        }
    }

    public resetHost(host: Connection) {
        for (const path in this.cached) {
            if (this.getPathSegment(path, SegmentType.HOST) === createHostPath(host)) {
                this.del(path);
            }
        }
    }
    public reset(path?: string, exact: boolean = false): void {
        if (path) {
            for (const key in this.cached) {
                if (key.startsWith(path)) {
                    if (exact && key !== path) {
                        continue;
                    }
                    this.del(key);
                    delete this._treeState[key];
                }
            }
        } else {
            this.cached = {};
            this._treeState = {};
        }
    }

    public invalidate(currentHosts: Connection[]): void {
        const newPaths: Set<string> = new Set();
        currentHosts.forEach((h) => {
            if (h.filters) {
                h.filters.forEach((f) => {
                    newPaths.add(createFilterPath(h, f));
                });
            } else {
                newPaths.add(createHostPath(h));
            }
        });
        // tslint:disable-next-line: forin
        for (const key in this.cached) {
            const segments: string[] = key.split(PATH_SEPARATOR);
            const hostSegment: string = segments[0];
            if (newPaths.has(hostSegment)) {
                continue;
            }
            if (segments.length < 3) {
                this.del(key);
                continue;
            }
            // host => DATASET_ROOT_PATH => filter.value
            const hostAndFilterSegment: string = segments.slice(0, 3).join(PATH_SEPARATOR);
            if (!newPaths.has(hostAndFilterSegment)) {
                this.del(key);
            }
        }
        // tslint:disable-next-line: forin
        for (const key in this._treeState) {
            const segments: string[] = key.split(PATH_SEPARATOR);
            const hostSegment: string = segments[0];
            if (newPaths.has(hostSegment)) {
                continue;
            }
            if (segments.length < 3) {
                delete this._treeState[key];
                continue;
            }
            // host => DATASET_ROOT_PATH => filter.value
            const hostAndFilterSegment: string = segments.slice(0, 3).join(PATH_SEPARATOR);
            if (!newPaths.has(hostAndFilterSegment)) {
                delete this._treeState[key];
            }
        }
    }

    public loadFromCache(path: string): ZNode[] | undefined {
        const result: ZNode[] = [];
        for (const key in this.cached) {
            if (
                key.startsWith(path + PATH_SEPARATOR) &&
                this.cached[key] &&
                !key.substring(path.length + PATH_SEPARATOR.length).includes(PATH_SEPARATOR)
            ) {
                result.push(this.cached[key]);
            }
        }
        return result.length === 0 ? undefined : result;
    }

    private getPathSegment(path: string, type: SegmentType): string | undefined {
        // 0.host -> 1.DATASET_ROOT_PATH -> 2.filter -> 3.dataset -> 4.member
        const segments: string[] = path.split(PATH_SEPARATOR);
        if (segments.length < type) {
            return undefined;
        }
        return segments[type];
    }
    private del(path: string) {
        delete this.cached[path];
    }
}

enum SegmentType {
    HOST = 0,
    SYSTEM = 1,
    FILTER = 2,
    DATASET = 3,
    MEMBER = 4,
}
