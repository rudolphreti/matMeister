import {
  elAnswer,
  overlay,
  closeSettingsBtn,
  saveBtn,
  resetBtn,
  helpOverlay,
  closeHelpBtn,
  soundToggle,
  praiseToggle,
  varietyToggle
} from "./modules/dom.js";
import { ensureAudio } from "./modules/audio.js";
import { checkAnswer, newQuestion } from "./modules/game.js";
import { openSettings, closeSettings, saveSettingsFromForm, resetToDefaults } from "./modules/settings.js";
import { setToggle, toggleFromEl, updateHUD } from "./modules/ui.js";
import { state } from "./modules/state.js";

function openHelp(){
  helpOverlay.classList.add("open");
  helpOverlay.setAttribute("aria-hidden","false");
}

function closeHelp(){
  helpOverlay.classList.remove("open");
  helpOverlay.setAttribute("aria-hidden","true");
}

elAnswer.addEventListener("keydown", (e) => {
  if (e.key === "Enter") checkAnswer();
});

closeSettingsBtn.addEventListener("click", closeSettings);
overlay.addEventListener("click", (e) => { if (e.target === overlay) closeSettings(); });

saveBtn.addEventListener("click", saveSettingsFromForm);
resetBtn.addEventListener("click", resetToDefaults);

closeHelpBtn.addEventListener("click", closeHelp);
helpOverlay.addEventListener("click", (e) => { if (e.target === helpOverlay) closeHelp(); });

soundToggle.addEventListener("click", () => setToggle(soundToggle, toggleFromEl(soundToggle)));
praiseToggle.addEventListener("click", () => setToggle(praiseToggle, toggleFromEl(praiseToggle)));
varietyToggle.addEventListener("click", () => setToggle(varietyToggle, toggleFromEl(varietyToggle)));

[soundToggle, praiseToggle, varietyToggle].forEach(el => {
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " "){
      e.preventDefault();
      setToggle(el, toggleFromEl(el));
    }
  });
});

window.addEventListener("keydown", (e) => {
  if (e.altKey && e.key.toLowerCase() === "s"){
    e.preventDefault();
    openSettings();
  }
  if (e.altKey && e.key.toLowerCase() === "h"){
    e.preventDefault();
    openHelp();
  }
  if (e.key === "Escape"){
    closeSettings();
    closeHelp();
  }
});

window.addEventListener("pointerdown", ensureAudio, { once:true });

updateHUD();
setToggle(soundToggle, state.settings.sound);
setToggle(praiseToggle, state.settings.praise);
setToggle(varietyToggle, state.settings.variety);
newQuestion();
