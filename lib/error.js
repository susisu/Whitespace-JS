/*
 * Whitespace-JS / error.js
 * copyright (c) 2016 Susisu
 */

"use strict";

function end() {
    module.exports = Object.freeze({
        RuntimeError
    });
}

class RuntimeError extends Error {
    constructor(pos, message) {
        super(message);
        this.pos = pos;
    }

    toString() {
        return this.pos.toString() + ":\n" + this.message;
    }
}

end();
