/*
 * Whitespace-JS / inst/stack.js
 * copyright (c) 2016 Susisu
 */

"use strict";

function end() {
    module.exports = Object.freeze({
        StackManipulation,
        Push,
        Refer,
        Slide,
        Duplicate,
        Swap,
        Discard,
    });
}

const inst = require("./inst.js");

class StackManipulation extends inst.Instruction {
    constructor(pos) {
        super(pos);
    }

    toWhitespace() {
        return inst.SPACE + this.toSubWhitespace();
    }

    toSubWhitespace() {
        throw new Error("unknown instruction");
    }
}

class Push extends StackManipulation {
    constructor(pos, n) {
        super(pos);
        this.n = n;
    }

    toSubWhitespace() {
        return inst.SPACE + inst.intToWhitespace(this.n);
    }

    toUnWhitespace() {
        return "push " + this.n.toString();
    }
}

class Refer extends StackManipulation {
    constructor(pos, n) {
        super(pos);
        this.n = n;
    }

    toSubWhitespace() {
        return inst.TAB + inst.SPACE + inst.intToWhitespace(this.n);
    }

    toUnWhitespace() {
        return "refer " + this.n.toString();
    }
}

class Slide extends StackManipulation {
    constructor(pos, n) {
        super(pos);
        this.n = n;
    }

    toSubWhitespace() {
        return inst.TAB + inst.LF + inst.intToWhitespace(this.n);
    }

    toUnWhitespace() {
        return "slide " + this.n.toString();
    }
}

class Duplicate extends StackManipulation {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return inst.LF + inst.SPACE;
    }

    toUnWhitespace() {
        return "duplicate";
    }
}

class Swap extends StackManipulation {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return inst.LF + inst.TAB;
    }

    toUnWhitespace() {
        return "swap";
    }
}

class Discard extends StackManipulation {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return inst.LF + inst.LF;
    }

    toUnWhitespace() {
        return "discard";
    }
}

end();
