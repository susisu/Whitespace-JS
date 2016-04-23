/*
 * Whitespace-JS / ws.js
 * copyright (c) 2016 Susisu
 */

"use strict";

function end() {
    module.exports = Object.freeze({
        LANGUAGE_VERSION: "0.0.3",

        utils,
        error,
        inst,
        parser,
        vm
    });
}

const utils  = require("./utils.js");
const error  = require("./error.js");
const inst   = require("./inst.js");
const parser = require("./parser.js");
const vm     = require("./vm.js");

end();
