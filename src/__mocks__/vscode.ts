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

// tslint:disable-next-line: no-namespace
export namespace commands {
    const commandMap = {};

    export function registerCommand(
        commandId: string,
        callback: (...args: any[]) => any,
        thisArg?: any,
    ) {
        commandMap[commandId] = callback;
    }
    export function executeCommand<T>(command: string, ...rest: any[]) {
        commandMap[command](...rest);
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
        onrejected?: (reason: any) => TResult | Thenable<TResult> | void,
    ): Thenable<TResult>;
}

export interface TextDocument {
    readonly uri: Uri;
    readonly fileName: string;
    readonly isUntitled: boolean;
    readonly languageId: string;
    readonly version: number;
    readonly isDirty: boolean;
    readonly isClosed: boolean;
    readonly eol: any;
    readonly lineCount: number;
    save(): any;
    lineAt(line: number | any): any;
    offsetAt(position: any): any;
    positionAt(offset: number): any;
    getText(range?: any): string;
    getWordRangeAtPosition(position: any, regex?: RegExp): any | undefined;
    validateRange(range: any): any;
    validatePosition(position: any): any;
}

export class Uri {
    public readonly scheme: string;
    public readonly authority: string;
    public readonly path: string;
    public readonly query: string;
    public readonly fragment: string;
    public readonly fsPath: string;

    public constructor(
        scheme: string,
        authority: string,
        path: string,
        query: string,
        fragment: string,
        fsPath: string,
    ) {
        this.authority = authority;
        this.scheme = scheme;
        this.path = path;
        this.query = query;
        this.fragment = fragment;
        this.fsPath = fsPath;
    }
    public with(change: {
        scheme?: string;
        authority?: string;
        path?: string;
        query?: string;
        fragment?: string;
    }): any {
        return undefined;
    }
    // tslint:disable-next-line: bool-param-default
    public toString(skipEncoding?: boolean): string {
        return this.path;
    }
    public toJSON(): any {
        return undefined;
    }
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

// tslint:disable-next-line: no-namespace
export namespace window {
    export function showInformationMessage(
        message: string,
        ...items: string[]
    ) {
        return Promise.resolve(message);
    }

    export function showErrorMessage(
        message: string,
        ...items: string[]
    ): undefined {
        return undefined;
    }

    export function showWarningMessage(message: string, ...items: string[]) {
        return Promise.resolve("OK");
    }
    export interface MessageOptions {
        modal?: boolean;
    }

    export interface MessageItem {
        title: string;
        isCloseAffordance?: boolean;
    }

    export interface InputBoxOptions {
        placeholder?: string;
    }

    export function showInputBox(
        options?: InputBoxOptions,
        token?: CancellationToken,
    ) {
        return Promise.resolve("NameOfMember");
    }

    export function withProgress<R>(
        options: ProgressOptions,
        task: (progress?: Progress) => any,
    ) {
        return task({ report: jest.fn() } as any);
    }

    export async function showTextDocument(document, options?) {
        return Promise.resolve("NameOfDocument");
    }
}

// tslint:disable-next-line: max-classes-per-file
export class Disposable {
    // tslint:disable-next-line: no-empty
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

// tslint:disable-next-line: max-classes-per-file
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

// tslint:disable-next-line: max-classes-per-file
// export class EventEmitter {
//     public event: undefined;
// }

// tslint:disable-next-line: max-classes-per-file
export class EventEmitter<T> {
    /**
     * The event listeners can subscribe to.
     */
    public event: undefined;

    /**
     * Notify all subscribers of the [event](#EventEmitter.event). Failure
     * of one or more listener will not fail this function call.
     *
     * @param data The event object.
     */
    // tslint:disable-next-line: no-empty
    public fire(data?: T): void {}

    /**
     * Dispose this object and free resources.
     */
    // tslint:disable-next-line: no-empty
    public dispose(): void {}
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

// tslint:disable-next-line: max-classes-per-file
export interface ConfigurationChangeEvent {
    affectsConfiguration(section: string, resource?): boolean;
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

export enum ProgressLocation {
    SourceControl = 1,
    Window = 10,
    Notification = 15,
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

// tslint:disable-next-line: no-namespace
export namespace workspace {
    export function openTextDocument(fileName: string) {
        const document: any = {};
        return Promise.resolve(document);
    }

    export interface InputBoxOptions {
        placeholder?: string;
    }

    export let rootPath: string | undefined;

    export interface WorkspaceFolder {
        readonly name: string;
        readonly index: number;
    }

    export function onDidChangeTextDocument(
        callback: (event: Event<TextDocumentChangeEvent>) => any,
        // tslint:disable-next-line: no-empty
    ) {}

    export function onDidCloseTextDocument(
        callback: (event: Event<TextDocumentChangeEvent>) => any,
        // tslint:disable-next-line: no-empty
    ) {}

    export function onWillSaveTextDocument(
        callback: (event: Event<TextDocumentChangeEvent>) => any,
        // tslint:disable-next-line: no-empty
    ) {}
    export const onDidChangeConfiguration: Event<
        ConfigurationChangeEvent
    > = jest.fn();
}
// tslint:disable-next-line: max-classes-per-file
export class ExtensionContext {
    public asAbsolutePath(relativePath: string): string {
        return "";
    }
}
