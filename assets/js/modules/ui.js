import { state } from "./state.js";
import { elCoins, elStreak, elFeedback } from "./dom.js";

export function setFeedback(text, kind){
  elFeedback.textContent = text || "";
  elFeedback.classList.remove("good","bad");
  if (kind) elFeedback.classList.add(kind);
}

export function updateHUD(){
  elCoins.textContent = String(state.score.coins);
  elStreak.textContent = String(state.score.streak);
}

export function setToggle(el, on){
  el.classList.toggle("on", !!on);
  el.setAttribute("aria-checked", String(!!on));
}

export function toggleFromEl(el){
  const on = !el.classList.contains("on");
  setToggle(el, on);
  return on;
}
