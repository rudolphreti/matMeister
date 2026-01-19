import { state, setBonusExpired, setBonusStart, setBonusTimer } from "./state.js";
import { elBonusText } from "./dom.js";

export function startBonusTimer(){
  cancelAnimationFrame(state.bonusTimerRAF);
  setBonusStart(performance.now());
  setBonusExpired(state.settings.bonusSeconds <= 0);
  updateBonusUI();

  const tick = () => {
    updateBonusUI();
    setBonusTimer(requestAnimationFrame(tick));
  };
  setBonusTimer(requestAnimationFrame(tick));
}

export function bonusRemaining(){
  if (state.settings.bonusSeconds <= 0) return 0;
  const elapsed = (performance.now() - state.bonusStartTs) / 1000;
  return Math.max(0, state.settings.bonusSeconds - elapsed);
}

export function updateBonusUI(){
  const rem = bonusRemaining();
  if (rem <= 0){
    elBonusText.textContent = "wygasł";
    setBonusExpired(true);
  } else {
    elBonusText.textContent = `aktywny (${rem.toFixed(1)}s)`;
    setBonusExpired(false);
  }
}
