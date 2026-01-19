import { DEFAULTS, STORAGE_KEY, SCORE_KEY } from "./defaults.js";

export function loadSettings(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };
    const obj = JSON.parse(raw);
    return { ...DEFAULTS, ...obj };
  } catch {
    return { ...DEFAULTS };
  }
}

export function persistSettings(settings){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); } catch {}
}

export function loadScore(){
  try{
    const raw = localStorage.getItem(SCORE_KEY);
    if (!raw) return { coins: 0, streak: 0 };
    const obj = JSON.parse(raw);
    return {
      coins: Number.isFinite(obj.coins) ? obj.coins : 0,
      streak: Number.isFinite(obj.streak) ? obj.streak : 0
    };
  } catch {
    return { coins: 0, streak: 0 };
  }
}

export function saveScore(score){
  try{ localStorage.setItem(SCORE_KEY, JSON.stringify(score)); } catch {}
}
