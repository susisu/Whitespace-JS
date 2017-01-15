/*
 * Whitespace-JS / inst.js
 * copyright (c) 2016 Susisu
 */

"use strict";

function end() {
    module.exports = Object.freeze({
        Instruction: inst.Instruction,

        StackManipulation: stack.StackManipulation,
        Push             : stack.Push,      // push <n>
        Refer            : stack.Refer,     // refer <n>
        Slide            : stack.Slide,     // slide <n>
        Duplicate        : stack.Duplicate, // duplicate
        Swap             : stack.Swap,      // swap
        Discard          : stack.Discard,   // discard

        Arithmetic: arith.Arithmetic,
        Add       : arith.Add,      // add
        Subtract  : arith.Subtract, // subtract
        Multiple  : arith.Multiple, // multiple
        Divide    : arith.Divide,   // divide
        Modulo    : arith.Modulo,   // modulo

        HeapAccess: heap.HeapAccess,
        Store     : heap.Store,     // store
        Retrieve  : heap.Retrieve,  // retrieve

        IO     : io.IO,
        PutChar: io.PutChar,    // putchar
        Print  : io.Print,      // print
        GetChar: io.GetChar,    // getchar
        Read   : io.Read,       // read

        FlowControl: flow.FlowControl,
        Mark       : flow.Mark,         // mark <label>
        Call       : flow.Call,         // call <label>
        Jump       : flow.Jump,         // jump <label>
        IfZero     : flow.IfZero,       // ifzero <label>
        IfNegative : flow.IfNegative,   // ifnegative <label>
        Return     : flow.Return,       // return
        End        : flow.End,          // end

        compile
    });
}

const inst  = require("./inst/inst.js");
const stack = require("./inst/stack.js");
const arith = require("./inst/arith.js");
const heap  = require("./inst/heap.js");
const io    = require("./inst/io.js");
const flow  = require("./inst/flow.js");

function compile(prog) {
    prog = prog.slice();
    let len = prog.length;
    const labelMap = new Map();
    for (let i = 0; i < len; i++) {
        if (prog[i] instanceof flow.Mark) {
            labelMap.set(prog[i].label, i);
            prog.splice(i, 1);
            i   -= 1;
            len -= 1;
        }
    }
    for (let i = 0; i < len; i++) {
        if (prog[i] instanceof flow.Call) {
            const index = labelMap.get(prog[i].label);
            if (index === undefined) {
                throw new Error(prog[i].pos.toString() + ":\nunknown label " + prog[i].label.toString());
            }
            prog[i] = new flow.Call2(prog[i].pos, index, prog[i]);
        }
        else if (prog[i] instanceof flow.Jump) {
            const index = labelMap.get(prog[i].label);
            if (index === undefined) {
                throw new Error(prog[i].pos.toString() + ":\nunknown label " + prog[i].label.toString());
            }
            prog[i] = new flow.Jump2(prog[i].pos, index, prog[i]);
        }
        else if (prog[i] instanceof flow.IfZero) {
            const index = labelMap.get(prog[i].label);
            if (index === undefined) {
                throw new Error(prog[i].pos.toString() + ":\nunknown label " + prog[i].label.toString());
            }
            prog[i] = new flow.IfZero2(prog[i].pos, index, prog[i]);
        }
        else if (prog[i] instanceof flow.IfNegative) {
            const index = labelMap.get(prog[i].label);
            if (index === undefined) {
                throw new Error(prog[i].pos.toString() + ":\nunknown label " + prog[i].label.toString());
            }
            prog[i] = new flow.IfNegative2(prog[i].pos, index, prog[i]);
        }
    }
    return prog;
}

end();
