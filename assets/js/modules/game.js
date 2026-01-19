import { PRAISE } from "./defaults.js";
import { elEquation, elAnswer } from "./dom.js";
import { playCoins, playWrong, ensureAudio } from "./audio.js";
import { generateQuestion } from "./questions.js";
import { bonusRemaining, startBonusTimer } from "./bonus.js";
import { setFeedback, updateHUD } from "./ui.js";
import { state, setQuestion, setScore } from "./state.js";
import { saveScore } from "./storage.js";
import { pick } from "./utils.js";

export function newQuestion(){
  const nextQuestion = generateQuestion(state.settings);
  setQuestion(nextQuestion);
  elEquation.textContent = nextQuestion.equation;
  elAnswer.value = "";
  elAnswer.focus();
  setFeedback("", null);
  startBonusTimer();
}

export function checkAnswer(){
  ensureAudio();
  if (!state.question) return;

  const raw = elAnswer.value.trim();
  if (raw === ""){
    setFeedback("Wpisz liczbę dla x.", null);
    return;
  }

  const ans = Number(raw);
  if (!Number.isFinite(ans)){
    setFeedback("To nie wygląda jak liczba.", "bad");
    return;
  }

  if (Math.round(ans) !== ans){
    setFeedback("Tylko liczby całkowite.", "bad");
    return;
  }

  if (ans === state.question.answer){
    const msg = awardForCorrect();
    setFeedback(msg, "good");
    setTimeout(newQuestion, 650);
  } else {
    const msg = penalizeForWrong();
    setFeedback(msg, "bad");
  }
}

function awardForCorrect(){
  let gained = 1;

  if (state.settings.bonusSeconds > 0){
    const rem = bonusRemaining();
    if (rem > 0 && state.settings.maxBonus > 0){
      const ratio = rem / state.settings.bonusSeconds;
      const extra = Math.max(0, Math.floor(ratio * state.settings.maxBonus));
      gained += extra;
    }
  }

  const nextScore = {
    ...state.score,
    streak: state.score.streak + 1,
    coins: state.score.coins + gained
  };
  setScore(nextScore);

  saveScore(state.score);
  updateHUD();
  playCoins(gained);

  let msg = state.settings.praise ? pick(PRAISE) : "Dobrze.";
  if (gained > 1) msg += ` +${gained} monet (bonus za szybkość).`;
  else msg += " +1 moneta.";

  if (state.score.streak === 5) msg += " Seria 5!";
  if (state.score.streak === 10) msg += " Seria 10!";

  return msg;
}

function penalizeForWrong(){
  const before = state.score.coins;
  const nextCoins = state.settings.minZero ? Math.max(0, state.score.coins - 1) : state.score.coins - 1;

  const nextScore = {
    ...state.score,
    streak: 0,
    coins: nextCoins
  };
  setScore(nextScore);

  saveScore(state.score);
  updateHUD();

  playWrong();

  if (before === 0 && state.settings.minZero) return "Prawie! Spróbuj jeszcze raz.";
  return "Nie tym razem. −1 moneta.";
}
