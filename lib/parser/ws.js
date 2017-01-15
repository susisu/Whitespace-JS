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

const lq = require("loquat")();

const utils = require("../utils.js");
const inst  = require("../inst.js");

const SPACE = utils.SPACE;
const TAB   = utils.TAB;
const LF    = utils.LF;

const comment = lq.noneOf(SPACE + TAB + LF).skipMany().hidden();
function lexeme(p) {
    return p.skip(comment);
}

const space = lexeme(lq.char(SPACE)).label("space");
const tab   = lexeme(lq.char(TAB)).label("tab");
const lf    = lexeme(lq.char(LF)).label("line feed");
const token = lq.choice([space, tab, lf]);

const stack = space.void();
const arith = tab.and(space).void();
const heap  = tab.and(tab).void();
const io    = tab.and(lf).void();
const flow  = lf.void();

const integer = lq.do(function* () {
    const sign = yield space.return(1).or(tab.return(-1));
    let n = 0;
    while (true) {
        const tok = yield token;
        switch (tok) {
        case SPACE:
            n = n << 1;
            break;
        case TAB:
            n = (n << 1) | 1;
            break;
        case LF:
            return (sign * n) | 0;
        default:
            // ignore
        }
    }
}).label("integer");

const label = space.or(tab).manyChars().left(lf).label("label");

function noArgs(imp, command, cons) {
    return lq.do(function* () {
        const pos = yield lq.getPosition;
        yield imp;
        yield command;
        return new cons(pos);
    }).try();
}

function intArg(imp, command, cons) {
    return lq.do(function* () {
        const pos = yield lq.getPosition;
        yield imp;
        yield command;
        const n = yield integer;
        return new cons(pos, n);
    }).try();
}

function labelArg(imp, command, cons) {
    return lq.do(function* () {
        const pos = yield lq.getPosition;
        yield imp;
        yield command;
        const l = yield label;
        return new cons(pos, l);
    }).try();
}

const instruction = lq.choice([
    // stack manipulation
    intArg(stack, space, inst.Push),
    intArg(stack, tab.and(space), inst.Refer),
    intArg(stack, tab.and(lf), inst.Slide),
    noArgs(stack, lf.and(space), inst.Duplicate),
    noArgs(stack, lf.and(tab), inst.Swap),
    noArgs(stack, lf.and(lf), inst.Discard),

    // arithmetic
    noArgs(arith, space.and(space), inst.Add),
    noArgs(arith, space.and(tab), inst.Subtract),
    noArgs(arith, space.and(lf), inst.Multiple),
    noArgs(arith, tab.and(space), inst.Divide),
    noArgs(arith, tab.and(tab), inst.Modulo),

    // heap access
    noArgs(heap, space, inst.Store),
    noArgs(heap, tab, inst.Retrieve),

    // io
    noArgs(io, space.and(space), inst.PutChar),
    noArgs(io, space.and(tab), inst.Print),
    noArgs(io, tab.and(space), inst.GetChar),
    noArgs(io, tab.and(tab), inst.Read),

    // flow control
    labelArg(flow, space.and(space), inst.Mark),
    labelArg(flow, space.and(tab), inst.Call),
    labelArg(flow, space.and(lf), inst.Jump),
    labelArg(flow, tab.and(space), inst.IfZero),
    labelArg(flow, tab.and(tab), inst.IfNegative),
    noArgs(flow, tab.and(lf), inst.Return),
    noArgs(flow, lf.and(lf), inst.End)
]).label("instruction");

const program = lq.do(function* () {
    yield comment;
    const prog = yield instruction.many();
    yield lq.eof;
    return prog;
});

function parse(name, src) {
    const res = lq.parse(program, name, src, undefined, { tabWidth: 8 });
    if (res.success) {
        return res.value;
    }
    else {
        throw res.error;
    }
}

end();
