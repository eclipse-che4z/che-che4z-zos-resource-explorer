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

function reportError(msg) {
    vscode.postMessage({
        command: 'alert',
        text: msg
    });
}

function isValidUrl() {
    var url = document.getElementById("url").value;
    if (url == "") {
        document.getElementById("url").focus();
        reportError(URLERRORMSG);
        return false;
    }
    var res = url.match(/(?:https?):\/\/(\w+:{0,1}\w*)?(\S+)(:[\d]+)/);
    if (res == null) {
        document.getElementById("url").focus();
        reportError(URLVALIDERRORMSG);
        return false;
    }
    return true;
}

function checkForm() {
    var userName = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var form = document.getElementById("hostCfg");
    var failed = false;

    if (userName == "") {
        reportError(USERERRORMSG);
        document.getElementById("username").focus();
        failed = true;
    }
    if (password == "") {
        reportError(PASSERRORMSG);
        document.getElementById("password").focus();
        failed = true;
    }
    if (failed) {
        return false;
    }
    return isValidUrl();
}

const USERERRORMSG = "User Name is not present";
const PASSERRORMSG = "Password is not present";
const URLERRORMSG = "URL is not present";
const HOSTERRORMSG = "Host Name is not present";
const URLVALIDERRORMSG = "URL is not valid";
