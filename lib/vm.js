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

const inst = require("./inst.js");

class State {
    constructor(progCount, callStack, stack, heap) {
        this.progCount = progCount; // program counter (index of list)
        this.callStack = callStack; // call stack
        this.stack     = stack;     // value stack
        this.heap      = heap;      // permanent memory
    }

    push(n) {
        this.stack.push(n);
    }

    pop() {
        if (this.stack.length === 0) {
            throw new Error("empty stack");
        }
        return this.stack.pop();
    }

    refer(i) {
        const len = this.stack.length;
        if (i < 0 || len <= i) {
            throw new Error("index out of range");
        }
        return this.stack[len - 1 - i];
    }

    slide(n) {
        const len = this.stack.length;
        if (len === 0) {
            throw new Error("empty stack");
        }
        this.stack.splice(len - 1 - n, n);
    }

    store(loc, n) {
        this.heap[loc] = n;
    }

    retrieve(loc) {
        return this.heap[loc] | 0;
    }

    call(index) {
        this.callStack.push(this.progCount);
        this.progCount = index;
    }

    jump(index) {
        this.progCount = index;
    }

    return() {
        if (this.callStack.length === 0) {
            throw new Error("no location to return");
        }
        this.progCount = this.callStack.pop();
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
        const i = this.state.progCount;
        this.state.progCount += 1;
        return this.prog[i];
    }

    findLabel(label) {
        const len = this.prog.length;
        for (let i = 0; i < len; i++) {
            if (this.prog[i] instanceof inst.Mark) {
                if (label === this.prog[i].label) {
                    return i;
                }
            }
        }
        throw new Error("unknown label: " + label.toString());
    }
}

function run(prog, input, output, eoutput, quit, debug, warnings) {
    const vm  = new VM(prog, input, output, quit);
    if (debug) {
        output("\t\t" + stackDump(vm.state.stack) + "\n");
        output("\t\t" + heapDump(vm.state.heap) + "\n");
    }
    const len = vm.prog.length;
    return co(function* () {
        while (vm.state.progCount < len) {
            const inst = vm.proceed();
            if (debug) {
                output("\t" + inst.toUnWhitespace() + "\n");
            }
            const res = inst.do(vm);
            if (res instanceof Promise) {
                yield res;
            }
            if (debug) {
                output("\t\t" + stackDump(vm.state.stack) + "\n");
                output("\t\t" + heapDump(vm.state.heap) + "\n");
            }
        }
        if (warnings) {
            eoutput("Warning: unexpected end of program\n");
        }
        vm.quit(0);
    });
}

function stackDump(stack) {
    return stack.slice().reverse().map(n => n.toString()).concat("[]").join(":");
}

function heapDump(heap) {
    const entries = [];
    const addrs   = Object.keys(heap);
    for (const addr of addrs) {
        entries.push(addr.toString() + ":" + heap[addr].toString());
    }
    return "{" + entries.join(",") + "}";
}

end();
