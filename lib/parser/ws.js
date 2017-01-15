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

const utils = require("../utils.js");
const inst  = require("../inst.js");

const SPACE = utils.SPACE;
const TAB   = utils.TAB;
const LF    = utils.LF;

const comment = lq.noneOf(SPACE + TAB + LF).skipMany().label("");
function lexeme(p) {
    return p.left(comment);
}

const space = lexeme(lq.char(SPACE)).label("space");
const tab   = lexeme(lq.char(TAB)).label("tab");
const lf    = lexeme(lq.char(LF)).label("line feed");
const token = lq.choice([space, tab, lf]);

const stack = space.void();
const arith = tab.then(space).void();
const heap  = tab.then(tab).void();
const io    = tab.then(lf).void();
const flow  = lf.void();

const integer = lq.gen(function* () {
    const sign = yield space.then(lq.pure(1)).or(tab.then(lq.pure(-1)));
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

const label = space.or(tab).manyChar().left(lf).label("label");

function noArgs(imp, command, cons) {
    return lq.gen(function* () {
        const pos = yield lq.getPosition;
        yield imp;
        yield command;
        return new cons(pos);
    }).try();
}

function intArg(imp, command, cons) {
    return lq.gen(function* () {
        const pos = yield lq.getPosition;
        yield imp;
        yield command;
        const n = yield integer;
        return new cons(pos, n);
    }).try();
}

function labelArg(imp, command, cons) {
    return lq.gen(function* () {
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
    labelArg(flow, space.then(space), inst.Mark),
    labelArg(flow, space.then(tab), inst.Call),
    labelArg(flow, space.then(lf), inst.Jump),
    labelArg(flow, tab.then(space), inst.IfZero),
    labelArg(flow, tab.then(tab), inst.IfNegative),
    noArgs(flow, tab.then(lf), inst.Return),
    noArgs(flow, lf.then(lf), inst.End)
]).label("instruction");

const program = lq.gen(function* () {
    yield comment;
    const prog = yield instruction.many();
    yield lq.eof;
    return prog;
});

function parse(name, src) {
    const res = lq.parse(program, name, src, 8);
    if (res.succeeded) {
        return res.value;
    }
    else {
        throw res.error;
    }
}

end();
