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

    doSub(vm) {
        let c = vm.state.pop(this.pos);
        vm.output(String.fromCharCode(c));
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

    doSub(vm) {
        let n = vm.state.pop(this.pos);
        vm.output(n.toString());
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

    doSub(vm) {
        return vm.input().then(c => {
            vm.state.push(c.charCodeAt(0));
        });
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

    doSub(vm) {
        return co(function * () {
            let str = "";
            while (true) {
                let c = yield vm.input();
                if (c === "\n") {
                    break;
                }
                str += c;
            }
            vm.state.push(parseInt(str) | 0);
        });
    }
}

end();
