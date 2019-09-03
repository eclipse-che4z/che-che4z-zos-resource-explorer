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

// tslint:disable: max-classes-per-file
import { Connection } from "../../model/Connection";
import { Dataset, Filter, Member } from "../../model/DSEntities";
import { PATH_SEPARATOR } from "../../service/DatasetCache";

const DATASET_ROOT_PATH = "DATASETS";

export enum NodeType {
    HOST = "host",
    DATASETS_ROOT = "datasetsRoot",
    DATASETS_FILTER = "datasetsFilter",
    USER_DATASETS = "userDatasets",
    DATASET = "dataset",
    MEMBER = "member",
    NONE = "none",
}

export class ZNode {
    public type?: NodeType;
    constructor(public path: string) {}
}

export class ZHostNode extends ZNode {
    constructor(public host: Connection) {
        super(host.name);
        this.type = NodeType.HOST;
    }
}
export class ZSubsystemNode extends ZNode {
    constructor(type: NodeType, public host: Connection) {
        super(createHostPath(host) + PATH_SEPARATOR + DATASET_ROOT_PATH);
        this.type = type;
    }
}
export class ZDatasetFilterNode extends ZNode {
    constructor(public filter: Filter, public host: Connection) {
        super(createFilterPath(host, filter));
        this.type = NodeType.DATASETS_FILTER;
    }
}

export class ZUserDatasetNode extends ZNode {
    constructor(public filter: Filter, public host: Connection) {
        super(host.url + host.username + PATH_SEPARATOR + DATASET_ROOT_PATH + PATH_SEPARATOR + filter.value);
    }

    get type(): NodeType {
        return NodeType.USER_DATASETS;
    }
}

export class ZDatasetNode extends ZNode {
    constructor(public dataset: Dataset, public host: Connection, pathPrefix: string) {
        super(pathPrefix + PATH_SEPARATOR + dataset.name);
        this.type = NodeType.DATASET;
    }
}

export class ZEmptyDatasetNode extends ZNode {
    constructor() {
        super("<Invalid Path>");
        this.type = NodeType.NONE;
    }
}

export class ZMemberNode extends ZNode {
    constructor(public dataset: Dataset, public member: Member, public host: Connection, pathPrefix: string) {
        super(pathPrefix + PATH_SEPARATOR + member.name);
        this.type = NodeType.MEMBER;
    }
}

export class ZEmptyNode extends ZNode {
    constructor(public dataset: Dataset, public member: Member, public host: Connection) {
        super(member.name);
        this.type = NodeType.MEMBER;
    }
}

export function createHostPath(host: Connection): string {
    return host.url + host.username;
}

export function createFilterPath(host: Connection, filter: Filter): string {
    return createHostPath(host) + PATH_SEPARATOR + DATASET_ROOT_PATH + PATH_SEPARATOR + filter.value;
}
