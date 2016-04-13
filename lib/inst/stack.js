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

    doSub(vm) {
        vm.state.pushStack(this.n);
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

    doSub(vm) {
        vm.state.pushStack(vm.state.referStack(this.n));
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

    doSub(vm) {
        vm.state.slideStack(this.n);
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

    doSub(vm) {
        let n = vm.state.popStack();
        vm.state.pushStack(n);
        vm.state.pushStack(n);
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

    doSub(vm) {
        let a = vm.state.popStack();
        let b = vm.state.popStack();
        vm.state.pushStack(a);
        vm.state.pushStack(b);
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

    doSub(vm) {
        vm.state.popStack();
    }
}

end();
