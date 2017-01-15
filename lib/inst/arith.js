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

const utils = require("../utils.js");
const inst  = require("./inst.js");

class Arithmetic extends inst.Instruction {
    constructor(pos) {
        super(pos);
    }

    toWhitespace() {
        return utils.TAB + utils.SPACE + this.toSubWhitespace();
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
        return utils.SPACE + utils.SPACE;
    }

    toUnWhitespace() {
        return "add";
    }

    doSub(vm) {
        const b = vm.state.pop();
        const a = vm.state.pop();
        vm.state.push((a + b) | 0);
    }
}

class Subtract extends Arithmetic {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return utils.SPACE + utils.TAB;
    }

    toUnWhitespace() {
        return "subtract";
    }

    doSub(vm) {
        const b = vm.state.pop();
        const a = vm.state.pop();
        vm.state.push((a - b) | 0);
    }
}

class Multiple extends Arithmetic {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return utils.SPACE + utils.LF;
    }

    toUnWhitespace() {
        return "multiple";
    }

    doSub(vm) {
        const b = vm.state.pop();
        const a = vm.state.pop();
        vm.state.push((a * b) | 0);
    }
}

class Divide extends Arithmetic {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return utils.TAB + utils.SPACE;
    }

    toUnWhitespace() {
        return "divide";
    }

    doSub(vm) {
        const b = vm.state.pop();
        const a = vm.state.pop();
        vm.state.push((a / b) | 0);
    }
}

class Modulo extends Arithmetic {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return utils.TAB + utils.TAB;
    }

    toUnWhitespace() {
        return "modulo";
    }

    doSub(vm) {
        const b = vm.state.pop();
        const a = vm.state.pop();
        vm.state.push((a % b) | 0);
    }
}

end();
