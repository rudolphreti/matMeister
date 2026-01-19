import { pick, randInt, opSymbol } from "./utils.js";

export function generateQuestion(settings){
  const op = settings.op;
  const maxResult = settings.maxResult;
  const maxX = settings.maxX;

  const patternsAll = ["xLeft","xRight","xResult"];
  const patterns = settings.variety ? patternsAll : ["xLeft"];

  for (let attempt = 0; attempt < 400; attempt++){
    const pattern = pick(patterns);
    const x = randInt(0, maxX);

    let a = null;
    let b = null;
    let c = null;

    if (op === "+"){
      if (pattern === "xLeft"){
        b = randInt(0, maxResult);
        c = x + b;
        if (c > maxResult) continue;
        a = "x";
      } else if (pattern === "xRight"){
        a = randInt(0, maxResult);
        c = a + x;
        if (c > maxResult) continue;
        b = "x";
      } else {
        a = randInt(0, maxResult);
        b = randInt(0, maxResult);
        c = "x";
        if (a + b !== x) continue;
        if (a + b > maxResult) continue;
      }
    }

    if (op === "-"){
      if (pattern === "xLeft"){
        b = randInt(0, maxResult);
        c = x - b;
        if (c < 0 || c > maxResult) continue;
        a = "x";
      } else if (pattern === "xRight"){
        a = randInt(0, maxResult);
        c = a - x;
        if (c < 0 || c > maxResult) continue;
        b = "x";
      } else {
        a = randInt(0, maxResult);
        b = randInt(0, maxResult);
        if (a - b !== x) continue;
        if (a - b < 0) continue;
        c = "x";
      }
    }

    if (op === "*"){
      if (pattern === "xLeft"){
        b = randInt(0, maxResult);
        c = x * b;
        if (c > maxResult) continue;
        a = "x";
      } else if (pattern === "xRight"){
        a = randInt(0, maxResult);
        c = a * x;
        if (c > maxResult) continue;
        b = "x";
      } else {
        a = randInt(0, maxResult);
        b = randInt(0, maxResult);
        if (a * b !== x) continue;
        if (a * b > maxResult) continue;
        c = "x";
      }
    }

    if (op === "/"){
      if (pattern === "xLeft"){
        b = randInt(1, Math.max(1, maxResult));
        c = randInt(0, maxResult);
        const xx = b * c;
        if (xx > maxX) continue;
        if (xx > maxResult) continue;
        a = "x";
        return buildQuestion(op, pattern, xx, a, b, c);
      } else if (pattern === "xRight"){
        const xx = randInt(1, Math.max(1, maxX));
        c = randInt(0, maxResult);
        a = xx * c;
        if (a > maxResult) continue;
        b = "x";
        return buildQuestion(op, pattern, xx, a, b, c);
      }

      b = randInt(1, Math.max(1, maxResult));
      const xx = randInt(0, maxX);
      a = b * xx;
      if (a > maxResult) continue;
      c = "x";
      return buildQuestion(op, pattern, xx, a, b, c);
    }

    return buildQuestion(op, pattern, x, a, b, c);
  }

  return buildQuestion("+", "xLeft", 3, "x", 2, 5);
}

export function buildQuestion(op, pattern, x, a, b, c){
  const sym = opSymbol(op);
  const leftA = (a === "x") ? "x" : String(a);
  const leftB = (b === "x") ? "x" : String(b);
  const rightC = (c === "x") ? "x" : String(c);

  const equation = `${leftA} ${sym} ${leftB} = ${rightC}`;
  const countX = [leftA,leftB,rightC].filter(v => v === "x").length;
  if (countX !== 1){
    return { equation: `x ${sym} 1 = ${String(x + 1)}`, answer: x };
  }

  return { equation, answer: x, op, pattern };
}
