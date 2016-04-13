/*
 * Whitespace-JS / inst/flow.js
 * copyright (c) 2016 Susisu
 */

"use strict";

function end() {
    module.exports = Object.freeze({
        FlowControl,
        Mark,
        Call,
        Call2,
        Jump,
        Jump2,
        IfZero,
        IfZero2,
        IfNegative,
        IfNegative2,
        Return,
        End
    });
}

const inst = require("./inst.js");

class FlowControl extends inst.Instruction {
    constructor(pos) {
        super(pos);
    }

    toWhitespace() {
        return inst.LF + this.toSubWhitespace();
    }

    toSubWhitespace() {
        throw new Error("unknown instruction");
    }
}

class Mark extends FlowControl {
    constructor(pos, label) {
        super(pos);
        this.label = label;
    }

    toSubWhitespace() {
        return inst.SPACE + inst.SPACE + inst.intToWhitespace(this.label);
    }

    toUnWhitespace() {
        return "mark " + this.label.toString();
    }
}

class Call extends FlowControl {
    constructor(pos, label) {
        super(pos);
        this.label = label;
    }

    toSubWhitespace() {
        return inst.SPACE + inst.TAB + inst.intToWhitespace(this.label);
    }

    toUnWhitespace() {
        return "call " + this.label.toString();
    }
}

class Call2 extends FlowControl {
    constructor(pos, index) {
        super(pos);
        this.index = index;
    }

    toSubWhitespace() {
        throw new Error("cannot convert to Whitespace");
    }

    toUnWhitespace() {
        return "call2 " + this.index.toString();
    }
}

class Jump extends FlowControl {
    constructor(pos, label) {
        super(pos);
        this.label = label;
    }

    toSubWhitespace() {
        return inst.SPACE + inst.LF + inst.intToWhitespace(this.label);
    }

    toUnWhitespace() {
        return "jump " + this.label.toString();
    }
}

class Jump2 extends FlowControl {
    constructor(pos, index) {
        super(pos);
        this.index = index;
    }

    toSubWhitespace() {
        throw new Error("cannot convert to Whitespace");
    }

    toUnWhitespace() {
        return "jump2 " + this.index.toString();
    }
}

class IfZero extends FlowControl {
    constructor(pos, label) {
        super(pos);
        this.label = label;
    }

    toSubWhitespace() {
        return inst.TAB + inst.SPACE + inst.intToWhitespace(this.label);
    }

    toUnWhitespace() {
        return "ifzero " + this.label.toString();
    }
}

class IfZero2 extends FlowControl {
    constructor(pos, index) {
        super(pos);
        this.index = index;
    }

    toSubWhitespace() {
        throw new Error("cannot convert to Whitespace");
    }

    toUnWhitespace() {
        return "ifzero2 " + this.index.toString();
    }
}

class IfNegative extends FlowControl {
    constructor(pos, label) {
        super(pos);
        this.label = label;
    }

    toSubWhitespace() {
        return inst.TAB + inst.TAB + inst.intToWhitespace(this.label);
    }

    toUnWhitespace() {
        return "ifnegative " + this.label.toString();
    }
}

class IfNegative2 extends FlowControl {
    constructor(pos, index) {
        super(pos);
        this.index = index;
    }

    toSubWhitespace() {
        throw new Error("cannot convert to Whitespace");
    }

    toUnWhitespace() {
        return "ifnegative2 " + this.index.toString();
    }
}

class Return extends FlowControl {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return inst.TAB + inst.LF;
    }

    toUnWhitespace() {
        return "return";
    }
}

class End extends FlowControl {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return inst.LF + inst.LF;
    }

    toUnWhitespace() {
        return "end";
    }
}

end();
