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

const utils = require("../utils.js");
const inst  = require("./inst.js");

class FlowControl extends inst.Instruction {
    constructor(pos) {
        super(pos);
    }

    toWhitespace() {
        return utils.LF + this.toSubWhitespace();
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
        return utils.SPACE + utils.SPACE + utils.labelToWhitespace(this.label);
    }

    toUnWhitespace() {
        return "mark " + JSON.stringify(this.label);
    }

    doSub() {
        // do nothing
    }
}

class Call extends FlowControl {
    constructor(pos, label) {
        super(pos);
        this.label = label;
    }

    toSubWhitespace() {
        return utils.SPACE + utils.TAB + utils.labelToWhitespace(this.label);
    }

    toUnWhitespace() {
        return "call " + JSON.stringify(this.label);
    }

    doSub(vm) {
        const index = vm.findLabel(this.label);
        vm.state.call(index);
    }
}

class Call2 extends FlowControl {
    constructor(pos, index, orig) {
        super(pos);
        this.index = index;
        this.orig  = orig;
    }

    toSubWhitespace() {
        throw new Error("cannot convert to Whitespace");
    }

    toUnWhitespace() {
        if (this.orig) {
            return this.orig.toUnWhitespace();
        }
        else {
            return "call2 " + this.index.toString();
        }
    }

    doSub(vm) {
        vm.state.call(this.index);
    }
}

class Jump extends FlowControl {
    constructor(pos, label) {
        super(pos);
        this.label = label;
    }

    toSubWhitespace() {
        return utils.SPACE + utils.LF + utils.labelToWhitespace(this.label);
    }

    toUnWhitespace() {
        return "jump " + JSON.stringify(this.label);
    }

    doSub(vm) {
        const index = vm.findLabel(this.label);
        vm.state.jump(index);
    }
}

class Jump2 extends FlowControl {
    constructor(pos, index, orig) {
        super(pos);
        this.index = index;
        this.orig  = orig;
    }

    toSubWhitespace() {
        throw new Error("cannot convert to Whitespace");
    }

    toUnWhitespace() {
        if (this.orig) {
            return this.orig.toUnWhitespace();
        }
        else {
            return "jump2 " + this.index.toString();
        }
    }

    doSub(vm) {
        vm.state.jump(this.index);
    }
}

class IfZero extends FlowControl {
    constructor(pos, label) {
        super(pos);
        this.label = label;
    }

    toSubWhitespace() {
        return utils.TAB + utils.SPACE + utils.labelToWhitespace(this.label);
    }

    toUnWhitespace() {
        return "ifzero " + JSON.stringify(this.label);
    }

    doSub(vm) {
        const n = vm.state.pop();
        if (n === 0) {
            const index = vm.findLabel(this.label);
            vm.state.jump(index);
        }
    }
}

class IfZero2 extends FlowControl {
    constructor(pos, index, orig) {
        super(pos);
        this.index = index;
        this.orig  = orig;
    }

    toSubWhitespace() {
        throw new Error("cannot convert to Whitespace");
    }

    toUnWhitespace() {
        if (this.orig) {
            return this.orig.toUnWhitespace();
        }
        else {
            return "ifzero2 " + this.index.toString();
        }
    }

    doSub(vm) {
        const n = vm.state.pop();
        if (n === 0) {
            vm.state.jump(this.index);
        }
    }
}

class IfNegative extends FlowControl {
    constructor(pos, label) {
        super(pos);
        this.label = label;
    }

    toSubWhitespace() {
        return utils.TAB + utils.TAB + utils.labelToWhitespace(this.label);
    }

    toUnWhitespace() {
        return "ifnegative " + JSON.stringify(this.label);
    }

    doSub(vm) {
        const n = vm.state.pop();
        if (n < 0) {
            const index = vm.findLabel(this.label);
            vm.state.jump(index);
        }
    }
}

class IfNegative2 extends FlowControl {
    constructor(pos, index, orig) {
        super(pos);
        this.index = index;
        this.orig  = orig;
    }

    toSubWhitespace() {
        throw new Error("cannot convert to Whitespace");
    }

    toUnWhitespace() {
        if (this.orig) {
            return this.orig.toUnWhitespace();
        }
        else {
            return "ifnegative2 " + this.index.toString();
        }
    }

    doSub(vm) {
        const n = vm.state.pop();
        if (n < 0) {
            vm.state.jump(this.index);
        }
    }
}

class Return extends FlowControl {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return utils.TAB + utils.LF;
    }

    toUnWhitespace() {
        return "return";
    }

    doSub(vm) {
        vm.state.return();
    }
}

class End extends FlowControl {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return utils.LF + utils.LF;
    }

    toUnWhitespace() {
        return "end";
    }

    doSub(vm) {
        vm.quit(0);
    }
}

end();
