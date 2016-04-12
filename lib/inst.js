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
        End        : flow.End
    });
}

const inst  = require("./inst/inst.js");
const stack = require("./inst/stack.js");
const arith = require("./inst/arith.js");
const heap  = require("./inst/heap.js");
const io    = require("./inst/io.js");
const flow  = require("./inst/flow.js");

end();
