export function clampInt(value, min, max){
  const v = Number.isFinite(value) ? Math.round(value) : min;
  return Math.max(min, Math.min(max, v));
}

export function randInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pick(arr){
  return arr[Math.floor(Math.random() * arr.length)];
}

export function opSymbol(op){
  if (op === "*") return "×";
  if (op === "/") return "÷";
  return op;
}
