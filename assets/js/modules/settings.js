import {
  overlay,
  opSelect,
  maxResultInput,
  maxXInput,
  bonusSecondsInput,
  maxBonusInput,
  minZeroSelect,
  soundToggle,
  praiseToggle,
  varietyToggle
} from "./dom.js";
import { state, setSettings } from "./state.js";
import { clampInt } from "./utils.js";
import { persistSettings } from "./storage.js";
import { newQuestion } from "./game.js";
import { setToggle } from "./ui.js";
import { DEFAULTS } from "./defaults.js";

export function openSettings(){
  opSelect.value = state.settings.op;
  maxResultInput.value = state.settings.maxResult;
  maxXInput.value = state.settings.maxX;
  bonusSecondsInput.value = state.settings.bonusSeconds;
  maxBonusInput.value = state.settings.maxBonus;
  minZeroSelect.value = String(state.settings.minZero);

  setToggle(soundToggle, state.settings.sound);
  setToggle(praiseToggle, state.settings.praise);
  setToggle(varietyToggle, state.settings.variety);

  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden","false");
}

export function closeSettings(){
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden","true");
}

export function saveSettingsFromForm(){
  const next = { ...state.settings };

  next.op = opSelect.value;
  next.maxResult = clampInt(parseInt(maxResultInput.value,10), 1, 100);
  next.maxX = clampInt(parseInt(maxXInput.value,10), 1, 100);
  next.bonusSeconds = clampInt(parseInt(bonusSecondsInput.value,10), 0, 60);
  next.maxBonus = clampInt(parseInt(maxBonusInput.value,10), 0, 10);
  next.minZero = (minZeroSelect.value === "true");

  next.sound = soundToggle.classList.contains("on");
  next.praise = praiseToggle.classList.contains("on");
  next.variety = varietyToggle.classList.contains("on");

  setSettings(next);
  persistSettings(state.settings);

  closeSettings();
  newQuestion();
}

export function resetToDefaults(){
  setSettings({ ...DEFAULTS });
  persistSettings(state.settings);
  closeSettings();
  newQuestion();
}
