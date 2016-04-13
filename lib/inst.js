/*
 * Whitespace-JS / inst.js
 * copyright (c) 2016 Susisu
 */

"use strict";

function end() {
    module.exports = Object.freeze({
        intToWhitespace: inst.intToWhitespace,
        Instruction    : inst.Instruction,

        StackManipulation: stack.StackManipulation,
        Push             : stack.Push,
        Refer            : stack.Refer,
        Slide            : stack.Slide,
        Duplicate        : stack.Duplicate,
        Swap             : stack.Swap,
        Discard          : stack.Discard,

        Arithmetic: arith.Arithmetic,
        Add       : arith.Add,
        Subtract  : arith.Subtract,
        Multiple  : arith.Multiple,
        Divide    : arith.Divide,
        Modulo    : arith.Modulo,

        HeapAccess: heap.HeapAccess,
        Store     : heap.Store,
        Retrieve  : heap.Retrieve,

        IO     : io.IO,
        PutChar: io.PutChar,
        Print  : io.Print,
        GetChar: io.GetChar,
        Read   : io.Read,

        FlowControl: flow.FlowControl,
        Mark       : flow.Mark,
        Call       : flow.Call,
        Jump       : flow.Jump,
        IfZero     : flow.IfZero,
        IfNegative : flow.IfNegative,
        Return     : flow.Return,
        End        : flow.End,

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
    let labelMap = new Map();
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
            let index = labelMap.get(prog[i].label);
            if (index === undefined) {
                throw new Error("unknown label: " + prog[i].label.toString());
            }
            prog[i] = new flow.Call2(prog[i].pos, index);
        }
        else if (prog[i] instanceof flow.Jump) {
            let index = labelMap.get(prog[i].label);
            if (index === undefined) {
                throw new Error("unknown label: " + prog[i].label.toString());
            }
            prog[i] = new flow.Jump2(prog[i].pos, index);
        }
        else if (prog[i] instanceof flow.IfZero) {
            let index = labelMap.get(prog[i].label);
            if (index === undefined) {
                throw new Error("unknown label: " + prog[i].label.toString());
            }
            prog[i] = new flow.IfZero2(prog[i].pos, index);
        }
        else if (prog[i] instanceof flow.IfNegative) {
            let index = labelMap.get(prog[i].label);
            if (index === undefined) {
                throw new Error("unknown label: " + prog[i].label.toString());
            }
            prog[i] = new flow.IfNegative2(prog[i].pos, index);
        }
    }
    console.log(prog.map(x => x.toString()));
    return prog;
}

compile([new flow.Jump(0, 50), new flow.Mark(0, 100), new io.Read(0), new flow.Jump(0, 100), new flow.Mark(0, 50)]);

end();
