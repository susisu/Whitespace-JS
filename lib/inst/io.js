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

const co = require("co");

const utils = require("../utils.js");
const inst  = require("./inst.js");

class IO extends inst.Instruction {
    constructor(pos) {
        super(pos);
    }

    toWhitespace() {
        return utils.TAB + utils.LF + this.toSubWhitespace();
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
        return utils.SPACE + utils.SPACE;
    }

    toUnWhitespace() {
        return "putchar";
    }

    doSub(vm) {
        const c = vm.state.pop(this.pos);
        vm.output(String.fromCharCode(c));
    }
}

class Print extends IO {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return utils.SPACE + utils.TAB;
    }

    toUnWhitespace() {
        return "print";
    }

    doSub(vm) {
        const n = vm.state.pop(this.pos);
        vm.output(n.toString());
    }
}

class GetChar extends IO {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return utils.TAB + utils.SPACE;
    }

    toUnWhitespace() {
        return "getchar";
    }

    doSub(vm) {
        const loc = vm.state.pop();
        return vm.input().then(c => {
            vm.state.store(loc, c.charCodeAt(0));
        });
    }
}

class Read extends IO {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return utils.TAB + utils.TAB;
    }

    toUnWhitespace() {
        return "read";
    }

    doSub(vm) {
        const loc = vm.state.pop();
        return co(function* () {
            let str = "";
            while (true) {
                const c = yield vm.input();
                if (c === "\n") {
                    break;
                }
                str += c;
            }
            vm.state.store(loc, parseInt(str) | 0);
        });
    }
}

end();
