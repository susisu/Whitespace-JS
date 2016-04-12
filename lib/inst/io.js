/*
 * Whitespace-JS / inst/io.js
 * copyright (c) 2016 Susisu
 */

"use strict";

function end() {
    module.exports = Object.freeze({
        IO,
        PutChar,
        Print,
        GetChar,
        Read
    });
}

const inst = require("./inst.js");

class IO extends inst.Instruction {
    constructor(pos) {
        super(pos);
    }

    toWhitespace() {
        return inst.TAB + inst.LF + this.toSubWhitespace();
    }

    toSubWhitespace() {
        throw new Error("unknown instruction");
    }
}

class PutChar extends IO {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return inst.SPACE + inst.SPACE;
    }

    toUnWhitespace() {
        return "putchar";
    }
}

class Print extends IO {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return inst.SPACE + inst.TAB;
    }

    toUnWhitespace() {
        return "print";
    }
}

class GetChar extends IO {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return inst.TAB + inst.SPACE;
    }

    toUnWhitespace() {
        return "getchar";
    }
}

class Read extends IO {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return inst.TAB + inst.TAB;
    }

    toUnWhitespace() {
        return "read";
    }
}

end();
