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

const lq = require("loquat");

const utils = require("../utils.js");
const inst  = require("../inst.js");

let def = new lq.LanguageDef(
    "",
    "",
    "#",
    false,
    lq.letter,
    lq.alphaNum,
    undefined,
    undefined,
    [],
    [],
    true
);
let tp = lq.makeTokenParser(def);

let integer = tp.integer
    .or(tp.charLiteral.map(c => c.charCodeAt(0)))
    .label("integer");

let label = tp.stringLiteral.label("label");

function noArgs(name, cons) {
    return lq.gen(function * () {
        let pos = yield lq.getPosition;
        yield tp.reserved(name);
        return new cons(pos);
    });
}

function intArg(name, cons) {
    return lq.gen(function * () {
        let pos = yield lq.getPosition;
        yield tp.reserved(name);
        let n = yield integer;
        return new cons(pos, n);
    });
}

function labelArg(name, cons) {
    return lq.gen(function * () {
        let pos = yield lq.getPosition;
        yield tp.reserved(name);
        let l = yield label;
        return new cons(pos, l);
    });
}

let instruction = lq.choice([
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

let program = lq.gen(function * () {
    yield tp.whiteSpace;
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
