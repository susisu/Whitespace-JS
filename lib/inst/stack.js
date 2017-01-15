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
        Discard
    });
}

const utils = require("../utils.js");
const inst  = require("./inst.js");

class StackManipulation extends inst.Instruction {
    constructor(pos) {
        super(pos);
    }

    toWhitespace() {
        return utils.SPACE + this.toSubWhitespace();
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
        return utils.SPACE + utils.intToWhitespace(this.n);
    }

    toUnWhitespace() {
        return "push " + this.n.toString();
    }

    doSub(vm) {
        vm.state.push(this.n);
    }
}

class Refer extends StackManipulation {
    constructor(pos, n) {
        super(pos);
        this.n = n;
    }

    toSubWhitespace() {
        return utils.TAB + utils.SPACE + utils.intToWhitespace(this.n);
    }

    toUnWhitespace() {
        return "refer " + this.n.toString();
    }

    doSub(vm) {
        vm.state.push(vm.state.refer(this.n));
    }
}

class Slide extends StackManipulation {
    constructor(pos, n) {
        super(pos);
        this.n = n;
    }

    toSubWhitespace() {
        return utils.TAB + utils.LF + utils.intToWhitespace(this.n);
    }

    toUnWhitespace() {
        return "slide " + this.n.toString();
    }

    doSub(vm) {
        vm.state.slide(this.n);
    }
}

class Duplicate extends StackManipulation {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return utils.LF + utils.SPACE;
    }

    toUnWhitespace() {
        return "duplicate";
    }

    doSub(vm) {
        const n = vm.state.pop();
        vm.state.push(n);
        vm.state.push(n);
    }
}

class Swap extends StackManipulation {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return utils.LF + utils.TAB;
    }

    toUnWhitespace() {
        return "swap";
    }

    doSub(vm) {
        const a = vm.state.pop();
        const b = vm.state.pop();
        vm.state.push(a);
        vm.state.push(b);
    }
}

class Discard extends StackManipulation {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return utils.LF + utils.LF;
    }

    toUnWhitespace() {
        return "discard";
    }

    doSub(vm) {
        vm.state.pop();
    }
}

end();
