import { DRAGON_QUOTES } from "./defaults.js";
import { elDragonSpot, elDragonText } from "./dom.js";
import { state } from "./state.js";
import { pick } from "./utils.js";

let hideTimer = null;

function speak(text){
  if (!state.settings.sound) return;
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "pl-PL";
  utterance.rate = 1;
  utterance.pitch = 1.05;
  window.speechSynthesis.speak(utterance);
}

export function triggerDragonCelebration(){
  if (!elDragonSpot || !elDragonText) return;
  const message = pick(DRAGON_QUOTES);
  elDragonText.textContent = message;
  elDragonSpot.classList.add("show");
  elDragonSpot.setAttribute("aria-hidden", "false");
  speak(message);

  if (hideTimer) clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    elDragonSpot.classList.remove("show");
    elDragonSpot.setAttribute("aria-hidden", "true");
  }, 6000);
}
