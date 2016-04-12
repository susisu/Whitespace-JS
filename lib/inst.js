/*
 * Whitespace-JS / inst.js
 * copyright (c) 2016 Susisu
 */

"use strict";

function end() {
    module.exports = Object.freeze({
        intToWhitespace,

        Instruction,
            StackManipulation,
                Push,
                Refer,
                Slide,
                Duplicate,
                Swap,
                Discard,
            Arithmetic,
                Add,
                Subtract,
                Multiple,
                Divide,
                Modulo,
            HeapAccess,
                Store,
                Retrieve,
            IO,
                PutChar,
                Print,
                GetChar,
                Read,
            FlowControl,
                Mark,
                Call,
                Jump,
                IfZero,
                IfNegative,
                Return,
                End
    });
}

const SPACE = " ";
const TAB   = "\t";
const LF    = "\n";

function intToWhitespace(n) {
    n = n | 0;
    let sign;
    if (n >= 0) {
        sign = SPACE;
    }
    else {
        sign = TAB;
        n    = -n;
    }
    let bits = "";
    while (n > 0) {
        bits = ((n & 1) === 0 ? SPACE : TAB) + bits;
        n    = n >> 1;
    }
    return sign + bits + LF;
}


class Instruction {
    constructor(pos) {
        this.pos = pos;
    }

    toWhitespace() {
        throw new Error("unknown instruction");
    }

    toUnWhitespace() {
        throw new Error("unknown instruction");
    }
}


class StackManipulation extends Instruction {
    constructor(pos) {
        super(pos);
    }

    toWhitespace() {
        return SPACE + this.toSubWhitespace();
    }

    toSubWhitespace() {
        throw new Error("unknown instruction");
    }
}

class Push extends StackManipulation {
    constructor(pos, n) {
        super(pos);
        this.n = n;
    }

    toSubWhitespace() {
        return SPACE + intToWhitespace(this.n);
    }

    toUnWhitespace() {
        return "push " + this.n.toString();
    }
}

class Refer extends StackManipulation {
    constructor(pos, n) {
        super(pos);
        this.n = n;
    }

    toSubWhitespace() {
        return TAB + SPACE + intToWhitespace(this.n);
    }

    toUnWhitespace() {
        return "refer " + this.n.toString();
    }
}

class Slide extends StackManipulation {
    constructor(pos, n) {
        super(pos);
        this.n = n;
    }

    toSubWhitespace() {
        return TAB + LF + intToWhitespace(this.n);
    }

    toUnWhitespace() {
        return "slide " + this.n.toString();
    }
}

class Duplicate extends StackManipulation {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return LF + SPACE;
    }

    toUnWhitespace() {
        return "duplicate";
    }
}

class Swap extends StackManipulation {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return LF + TAB;
    }

    toUnWhitespace() {
        return "swap";
    }
}

class Discard extends StackManipulation {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return LF + LF;
    }

    toUnWhitespace() {
        return "discard";
    }
}


class Arithmetic extends Instruction {
    constructor(pos) {
        super(pos);
    }

    toWhitespace() {
        return TAB + SPACE + this.toSubWhitespace();
    }

    toSubWhitespace() {
        throw new Error("unknown instruction");
    }
}

class Add extends Arithmetic {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return SPACE + SPACE;
    }

    toUnWhitespace() {
        return "add";
    }
}

class Subtract extends Arithmetic {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return SPACE + TAB;
    }

    toUnWhitespace() {
        return "subtract";
    }
}

class Multiple extends Arithmetic {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return SPACE + LF;
    }

    toUnWhitespace() {
        return "multiple";
    }
}

class Divide extends Arithmetic {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return TAB + SPACE;
    }

    toUnWhitespace() {
        return "divide";
    }
}

class Modulo extends Arithmetic {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return TAB + TAB;
    }

    toUnWhitespace() {
        return "modulo";
    }
}


class HeapAccess extends Instruction {
    constructor(pos) {
        super(pos);
    }

    toWhitespace() {
        return TAB + TAB + this.toSubWhitespace();
    }

    toSubWhitespace() {
        throw new Error("unknown instruction");
    }
}

class Store extends HeapAccess {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return SPACE;
    }

    toUnWhitespace() {
        return "store";
    }
}

class Retrieve extends HeapAccess {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return TAB;
    }

    toUnWhitespace() {
        return "retrieve";
    }
}


class IO extends Instruction {
    constructor(pos) {
        super(pos);
    }

    toWhitespace() {
        return TAB + LF + this.toSubWhitespace();
    }

    toSubWhitespace() {
        throw new Error("unknown instruction");
    }
}

class PutChar extends IO {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return SPACE + SPACE;
    }

    toUnWhitespace() {
        return "putchar";
    }
}

class Print extends IO {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return SPACE + TAB;
    }

    toUnWhitespace() {
        return "print";
    }
}

class GetChar extends IO {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return TAB + SPACE;
    }

    toUnWhitespace() {
        return "getchar";
    }
}

class Read extends IO {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return TAB + TAB;
    }

    toUnWhitespace() {
        return "read";
    }
}


class FlowControl extends Instruction {
    constructor(pos) {
        super(pos);
    }

    toWhitespace() {
        return LF + this.toSubWhitespace();
    }

    toSubWhitespace() {
        throw new Error("unknown instruction");
    }
}

class Mark extends FlowControl {
    constructor(pos, label) {
        super(pos);
        this.label = label;
    }

    toSubWhitespace() {
        return SPACE + SPACE;
    }

    toUnWhitespace() {
        return "mark " + this.label.toString();
    }
}

class Call extends FlowControl {
    constructor(pos, label) {
        super(pos);
        this.label = label;
    }

    toSubWhitespace() {
        return SPACE + TAB;
    }

    toUnWhitespace() {
        return "call " + this.label.toString();
    }
}

class Jump extends FlowControl {
    constructor(pos, label) {
        super(pos);
        this.label = label;
    }

    toSubWhitespace() {
        return SPACE + LF;
    }

    toUnWhitespace() {
        return "jump " + this.label.toString();
    }
}

class IfZero extends FlowControl {
    constructor(pos, label) {
        super(pos);
        this.label = label;
    }

    toSubWhitespace() {
        return TAB + SPACE;
    }

    toUnWhitespace() {
        return "ifzero " + this.label.toString();
    }
}

class IfNegative extends FlowControl {
    constructor(pos, label) {
        super(pos);
        this.label = label;
    }

    toSubWhitespace() {
        return TAB + TAB;
    }

    toUnWhitespace() {
        return "ifnegative " + this.label.toString();
    }
}

class Return extends FlowControl {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return TAB + LF;
    }

    toUnWhitespace() {
        return "return";
    }
}

class End extends FlowControl {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return LF + LF;
    }

    toUnWhitespace() {
        return "end";
    }
}

end();
