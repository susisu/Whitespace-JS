/*
 * Whitespace-JS / parser/ws.js
 * copyright (c) 2016 Susisu
 */

"use strict";

function end() {
    module.exports = Object.freeze({
        parse
    });
}

const lq = require("loquat");

const inst = require("../inst.js");

const SPACE = " ";
const TAB   = "\t";
const LF    = "\n";

let comment = lq.noneOf(SPACE + TAB + LF).skipMany().label("");
function lexeme(p) {
    return p.left(comment);
}

let space = lexeme(lq.char(SPACE)).label("space");
let tab   = lexeme(lq.char(TAB)).label("tab");
let lf    = lexeme(lq.char(LF)).label("line feed");
let token = lq.choice([space, tab, lf]);

let stack = space.void();
let arith = tab.then(space).void();
let heap  = tab.then(tab).void();
let io    = tab.then(lf).void();
let flow  = lf.void();

let integer = lq.gen(function * () {
    let sign = yield space.then(lq.pure(1)).or(tab.then(lq.pure(-1)));
    let n = 0;
    while (true) {
        let tok = yield token;
        switch (tok) {
            case SPACE:
                n = n << 1;
                break;
            case TAB:
                n = (n << 1) | 1;
                break;
            case LF:
                return (sign * n) | 0;
        }
    }
}).label("integer");

function noArgs(imp, command, cons) {
    return lq.gen(function * () {
        let pos = yield lq.getPosition;
        yield imp;
        yield command;
        return new cons(pos);
    }).try();
}

function intArg(imp, command, cons) {
    return lq.gen(function * () {
        let pos = yield lq.getPosition;
        yield imp;
        yield command;
        let n = yield integer;
        return new cons(pos, n);
    }).try();
}

let instruction = lq.choice([
    // stack manipulation
    intArg(stack, space, inst.Push),
    intArg(stack, tab.then(space), inst.Refer),
    intArg(stack, tab.then(lf), inst.Slide),
    noArgs(stack, lf.then(space), inst.Duplicate),
    noArgs(stack, lf.then(tab), inst.Swap),
    noArgs(stack, lf.then(lf), inst.Discard),

    // arithmetic
    noArgs(arith, space.then(space), inst.Add),
    noArgs(arith, space.then(tab), inst.Subtract),
    noArgs(arith, space.then(lf), inst.Multiple),
    noArgs(arith, tab.then(space), inst.Divide),
    noArgs(arith, tab.then(tab), inst.Modulo),

    // heap access
    noArgs(heap, space, inst.Store),
    noArgs(heap, tab, inst.Retrieve),

    // io
    noArgs(io, space.then(space), inst.PutChar),
    noArgs(io, space.then(tab), inst.Print),
    noArgs(io, tab.then(space), inst.GetChar),
    noArgs(io, tab.then(tab), inst.Read),

    // flow control
    intArg(flow, space.then(space), inst.Mark),
    intArg(flow, space.then(tab), inst.Call),
    intArg(flow, space.then(lf), inst.Jump),
    intArg(flow, tab.then(space), inst.IfZero),
    intArg(flow, tab.then(tab), inst.IfNegative),
    noArgs(flow, tab.then(lf), inst.Return),
    noArgs(flow, lf.then(lf), inst.End)
]).label("instruction");

let program = lq.gen(function * () {
    yield comment;
    let prog = yield instruction.many();
    yield lq.eof;
    return prog;
});

function parse(name, src) {
    let res = lq.parse(program, name, src, 8);
    if (res.succeeded) {
        return res.value;
    }
    else {
        throw res.error;
    }
}

end();
