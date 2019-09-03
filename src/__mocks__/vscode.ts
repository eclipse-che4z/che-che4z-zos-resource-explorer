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

// tslint:disable: max-classes-per-file no-namespace
export enum TreeItemCollapsibleState {
    /**
     * Determines an item can be neither collapsed nor expanded. Implies it has no children.
     */
    None = 0,
    /**
     * Determines an item is collapsed
     */
    Collapsed = 1,
    /**
     * Determines an item is expanded
     */
    Expanded = 2,
}

export namespace commands {
    const commandMap = {};

    export function registerCommand(
        command: string,
        callback: (...args: any[]) => any,
        thisArg?: any,
    ) {
        commandMap[command] = callback;
    }
    export function executeCommand<T>(_command: string, ...rest: any[]) {
        commandMap[_command](rest);
    }
}

export type ProviderResult<T> =
    | T
    | undefined
    | null
    | Thenable<T | undefined | null>;

interface Thenable<T> {
    then<TResult>(
        onfulfilled?: (value: T) => TResult | Thenable<TResult>,
        onrejected?: (reason: any) => TResult | Thenable<TResult>,
    ): Thenable<TResult>;
    then<TResult>(
        onfulfilled?: (value: T) => TResult | Thenable<TResult>,
        onrejected?: (reason: any) => void,
    ): Thenable<TResult>;
}

export type Event<T> = (
    listener: (e: T) => any,
    thisArgs?: any,
    disposables?: Disposable[],
) => Disposable;

export interface CancellationToken {
    isCancellationRequested: boolean;
    onCancellationRequested: Event<any>;
}

export namespace window {
    export function showInformationMessage(
        message: string,
        ...items: string[]
    ): undefined {
        return undefined;
    }

    export function showErrorMessage(
        message: string,
        ...items: string[]
    ): undefined {
        return undefined;
    }
    export interface MessageOptions {
        modal?: boolean;
    }

    export interface MessageItem {
        title: string;
        isCloseAffordance?: boolean;
    }

    export function showInputBox(options?: InputBoxOptions,
        token?: CancellationToken): Thenable<string | undefined>{
        return Promise.resolve("NameOfMember");
    }

    export function withProgress<R>(options: ProgressOptions,
                                    task: (progress?: Progress) => any) {
        return task({report: jest.fn()} as any);
    }
}

export class Disposable {
    constructor() {}
}

export interface QuickPickOptions {
    placeHolder: string;
    ignoreFocusOut: string;
    canPickMany: string;
}

export interface TreeDataProvider<T> {
    onDidChangeTreeData?: Event<T | undefined | null>;

    getTreeItem(element: T): TreeItem | Thenable<TreeItem>;

    getChildren(element?: T): ProviderResult<T[]>;

    getParent?(element: T): ProviderResult<T>;
}

export class TreeItem {
    public label?: string;

    public id?: string;

    public collapsibleState?: TreeItemCollapsibleState;

    public contextValue?: string;

    constructor(label: string, collapsibleState?: TreeItemCollapsibleState) {
        this.label = label;
        this.collapsibleState = collapsibleState;
    }
}

export class EventEmitter<T> {
    public event: undefined;
}

export interface TextDocumentChangeEvent {
    /**
     * The affected document.
     */
    document: undefined;

    /**
     * An array of content changes.
     */
    contentChanges: [];
}

export namespace workspace {
    export let rootPath: string | undefined;

    export interface WorkspaceFolder {
        readonly name: string;
        readonly index: number;
    }

    export function onDidChangeTextDocument(
        callback: (event: Event<TextDocumentChangeEvent>) => any,
    ) {}

    export function onDidCloseTextDocument(
        callback: (event: Event<TextDocumentChangeEvent>) => any,
    ) {}

    export function onWillSaveTextDocument(
        callback: (event: Event<TextDocumentChangeEvent>) => any,
    ) {}

    export interface InputBoxOptions {
        placeholder?: string;
    }

    export interface TextDocument {
        fileName?: string;
    }
}

export class ExtensionContext {
    public asAbsolutePath(relativePath: string): string {
        return "";
    }
}

export enum ProgressLocation {
    SourceControl = 1,
    Window = 10,
    Notification = 15,
}

export interface InputBoxOptions {
    value?: string;
    valueSelection?: [number, number];
    prompt?: string;
    placeHolder?: string;
    password?: boolean;
    ignoreFocusOut?: boolean;
    validateInput?(value: string): string | undefined | null | Thenable<string | undefined | null>;
}

export interface ProgressOptions {
    location: ProgressLocation;
    title?: string;
    cancellable?: boolean;
}

export interface Progress {
    report(value): void;
}

export enum ConfigurationTarget {
    Global = 1,
}
