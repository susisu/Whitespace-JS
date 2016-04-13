/*
 * Whitespace-JS / parser.js
 * copyright (c) 2016 Susisu
 */

"use strict";

function end() {
    module.exports = Object.freeze({
        ws  : ws.parse,
        unws: unws.parse
    });
}

const ws   = require("./parser/ws.js");
const unws = require("./parser/unws.js");

end();
