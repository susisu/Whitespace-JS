/*
 * Whitespace-JS / inst/arith.js
 * copyright (c) 2016 Susisu
 */

"use strict";

function end() {
    module.exports = Object.freeze({
        Arithmetic,
        Add,
        Subtract,
        Multiple,
        Divide,
        Modulo
    });
}

const inst = require("./inst.js");

class Arithmetic extends inst.Instruction {
    constructor(pos) {
        super(pos);
    }

    toWhitespace() {
        return inst.TAB + inst.SPACE + this.toSubWhitespace();
    }

    toSubWhitespace() {
        throw new Error("unknown instruction");
    }
}

class Add extends Arithmetic {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return inst.SPACE + inst.SPACE;
    }

    toUnWhitespace() {
        return "add";
    }
}

class Subtract extends Arithmetic {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return inst.SPACE + inst.TAB;
    }

    toUnWhitespace() {
        return "subtract";
    }
}

class Multiple extends Arithmetic {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return inst.SPACE + inst.LF;
    }

    toUnWhitespace() {
        return "multiple";
    }
}

class Divide extends Arithmetic {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return inst.TAB + inst.SPACE;
    }

    toUnWhitespace() {
        return "divide";
    }
}

class Modulo extends Arithmetic {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return inst.TAB + inst.TAB;
    }

    toUnWhitespace() {
        return "modulo";
    }
}

end();
