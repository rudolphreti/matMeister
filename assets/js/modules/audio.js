import { state } from "./state.js";

let audioCtx = null;

export function ensureAudio(){
  if (!audioCtx){
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended"){
    audioCtx.resume().catch(()=>{});
  }
}

export function playCoin(){
  if (!state.settings.sound) return;
  ensureAudio();
  const now = audioCtx.currentTime;

  const o1 = audioCtx.createOscillator();
  const o2 = audioCtx.createOscillator();
  const g = audioCtx.createGain();

  o1.type = "square";
  o2.type = "triangle";

  o1.frequency.setValueAtTime(880, now);
  o1.frequency.exponentialRampToValueAtTime(1320, now + 0.06);

  o2.frequency.setValueAtTime(660, now);
  o2.frequency.exponentialRampToValueAtTime(990, now + 0.06);

  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.20, now + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

  o1.connect(g);
  o2.connect(g);
  g.connect(audioCtx.destination);

  o1.start(now);
  o2.start(now);
  o1.stop(now + 0.13);
  o2.stop(now + 0.13);
}

export function playWrong(){
  if (!state.settings.sound) return;
  ensureAudio();
  const now = audioCtx.currentTime;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();

  o.type = "sawtooth";
  o.frequency.setValueAtTime(180, now);
  o.frequency.exponentialRampToValueAtTime(120, now + 0.12);

  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.12, now + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

  o.connect(g);
  g.connect(audioCtx.destination);

  o.start(now);
  o.stop(now + 0.17);
}

export function playCoins(count){
  if (count <= 0) return;
  let i = 0;
  const tick = () => {
    playCoin();
    i++;
    if (i < count) setTimeout(tick, 70);
  };
  tick();
}
