import { loadScore, loadSettings } from "./storage.js";

export const state = {
  settings: loadSettings(),
  score: loadScore(),
  question: null,
  bonusStartTs: 0,
  bonusTimerRAF: null,
  bonusExpired: false
};

export function setSettings(next){
  state.settings = next;
}

export function setScore(next){
  state.score = next;
}

export function setQuestion(next){
  state.question = next;
}

export function setBonusStart(ts){
  state.bonusStartTs = ts;
}

export function setBonusTimer(id){
  state.bonusTimerRAF = id;
}

export function setBonusExpired(expired){
  state.bonusExpired = expired;
}
