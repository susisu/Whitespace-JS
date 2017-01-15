/*
 * Whitespace-JS / parser/unws.js
 * copyright (c) 2016 Susisu
 */

"use strict";

function end() {
    module.exports = Object.freeze({
        parse
    });
}

const lq = require("loquat")();
lq.use(require("loquat-token"));

const inst  = require("../inst.js");

const def = new lq.LanguageDef({
    commentLine  : "#",
    idStart      : lq.letter,
    idLetter     : lq.alphaNum,
    caseSensitive: true
});
const tp = lq.makeTokenParser(def);

const integer = tp.integer
    .or(tp.charLiteral.map(c => c.charCodeAt(0)))
    .label("integer");

const label = tp.stringLiteral.label("label");

function noArgs(name, cons) {
    return lq.do(function* () {
        const pos = yield lq.getPosition;
        yield tp.reserved(name);
        return new cons(pos);
    });
}

function intArg(name, cons) {
    return lq.do(function* () {
        const pos = yield lq.getPosition;
        yield tp.reserved(name);
        const n = yield integer;
        return new cons(pos, n);
    });
}

function labelArg(name, cons) {
    return lq.do(function* () {
        const pos = yield lq.getPosition;
        yield tp.reserved(name);
        const l = yield label;
        return new cons(pos, l);
    });
}

const instruction = lq.choice([
    // stack manipulation
    intArg("push", inst.Push),
    intArg("refer", inst.Refer),
    intArg("slide", inst.Slide),
    noArgs("duplicate", inst.Duplicate),
    noArgs("swap", inst.Swap),
    noArgs("discard", inst.Discard),

    // arithmetic
    noArgs("add", inst.Add),
    noArgs("subtract", inst.Subtract),
    noArgs("multiple", inst.Multiple),
    noArgs("divide", inst.Divide),
    noArgs("modulo", inst.Modulo),

    // heap access
    noArgs("store", inst.Store),
    noArgs("retrieve", inst.Retrieve),

    // io
    noArgs("putchar", inst.PutChar),
    noArgs("print", inst.Print),
    noArgs("getchar", inst.GetChar),
    noArgs("read", inst.Read),

    // flow control
    labelArg("mark", inst.Mark),
    labelArg("call", inst.Call),
    labelArg("jump", inst.Jump),
    labelArg("ifzero", inst.IfZero),
    labelArg("ifnegative", inst.IfNegative),
    noArgs("return", inst.Return),
    noArgs("end", inst.End)
]).label("instruction");

const program = lq.do(function* () {
    yield tp.whiteSpace;
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
