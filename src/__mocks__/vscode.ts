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

// tslint:disable: no-namespace bool-param-default max-classes-per-file no-empty
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

    public fire(data?: T): void {}

    public dispose(): void {}
}

export interface TextDocumentChangeEvent {
    document: undefined;
    contentChanges: [];
}

export interface ConfigurationChangeEvent {
    affectsConfiguration(section: string, resource?): boolean;
}

export interface TextDocumentChangeEvent {
    document: undefined;
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
    ) {}

    export function onDidCloseTextDocument(
        callback: (event: Event<TextDocumentChangeEvent>) => any,
    ) {}

    export function onWillSaveTextDocument(
        callback: (event: Event<TextDocumentChangeEvent>) => any,
    ) {}
    export const onDidChangeConfiguration: Event<
        ConfigurationChangeEvent
    > = jest.fn();
}

export class ExtensionContext {
    public asAbsolutePath(relativePath: string): string {
        return "";
    }
}

export enum ViewColumn {
    One,
}
