/*
 * Whitespace-JS / vm.js
 * copyright (c) 2016 Susisu
 */

"use strict";

function end() {
    module.exports = Object.freeze({
        State,
        VM,
        run
    });
}

const co = require("co");

class State {
    constructor(progCount, callStack, stack, heap) {
        this.progCount = progCount; // program counter (index of list)
        this.callStack = callStack; // call stack
        this.stack     = stack;     // value stack
        this.heap      = heap;      // permanent memory
    }

    pushStack(n) {
        this.stack.push(n);
    }

    popStack() {
        if (this.stack.length === 0) {
            throw new Error("empty stack");
        }
        return this.stack.pop();
    }

    referStack(i) {
        if (i < 0 || this.stack.length <= i) {
            throw new Error("index out of range");
        }
        return this.stack[i];
    }

    slideStack(n) {
        let len = this.stack.length;
        if (len === 0) {
            throw new Error("empty stack");
        }
        this.stack.splice(len - 1 - n, n);
    }
}

class VM {
    constructor(prog, input, output, quit) {
        this.prog   = prog;                     // program (list of instructions)
        this.input  = input;                    // input function (returns a Promise)
        this.output = output;                   // output function
        this.quit   = quit;                     // quit function
        this.state  = new State(0, [], [], []); // VM state
    }

    proceed() {
        return this.prog[this.state.progCount++];
    }
}

function run(prog, input, output, quit) {
    let vm  = new VM(prog, input, output, quit);
    let len = vm.prog.length;
    return co(function * () {
        while (vm.state.progCount < len) {
            let inst = vm.proceed();
            let res = inst.do(vm);
            if (res instanceof Promise) {
                yield res;
            }
        }
        vm.quit(0);
    });
}

end();
