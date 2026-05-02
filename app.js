const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];

const goalCopy = {
  travel: {
    label: "旅行・海外生活",
    focus: "質問力と聞き返し",
    tasks: {
      speaking: ["空港で質問する", "スタッフに「乗り継ぎゲートはどこか」を英語で尋ねてください。"],
      writing: ["ホテルに依頼する", "Late check-in と静かな部屋をお願いする短いメールを書いてください。"],
      reading: ["案内文を読む", "駅の掲示にある delay, platform, transfer の意味を使って要点をまとめてください。"],
      listening: ["アナウンスを予測する", "搭乗案内で聞くべき語句を3つ書いてください。"]
    }
  },
  business: {
    label: "仕事・会議",
    focus: "要件確認と合意形成",
    tasks: {
      speaking: ["会議で確認する", "締切、担当者、次のアクションを確認する発言を作ってください。"],
      writing: ["議事録を送る", "決定事項と未決事項を含むフォローアップメールを書いてください。"],
      reading: ["仕様を読む", "短い仕様変更メモから影響範囲とリスクを英語で抜き出してください。"],
      listening: ["会議音声の準備", "相手の提案に賛成・懸念・質問で返す表現を3つ書いてください。"]
    }
  },
  study: {
    label: "留学・授業",
    focus: "説明理解と意見表明",
    tasks: {
      speaking: ["授業で質問する", "教授に課題の評価基準を確認する質問を作ってください。"],
      writing: ["短い意見文", "オンライン授業の利点と課題を80語以内で書いてください。"],
      reading: ["要約する", "学術的な文章を読んだ想定で thesis, evidence, conclusion を英語で説明してください。"],
      listening: ["講義ノート化", "講義で聞き逃さないためのキーワードを5つ書いてください。"]
    }
  },
  exam: {
    label: "試験・資格",
    focus: "正確性と時間配分",
    tasks: {
      speaking: ["1分スピーチ", "Describe a challenge you overcame. 45秒で話す原稿を作ってください。"],
      writing: ["理由を述べる", "Do you agree that remote work improves productivity? 理由を2つ書いてください。"],
      reading: ["設問先読み", "本文を読む前に確認すべき設問の手がかりを3つ書いてください。"],
      listening: ["選択肢を比較", "似た選択肢を聞き分けるための注意点を英語で3つ書いてください。"]
    }
  },
  daily: {
    label: "日常会話",
    focus: "自然な反応と雑談",
    tasks: {
      speaking: ["週末について話す", "友人に週末の予定を聞き、自分の予定も一文で返してください。"],
      writing: ["チャット返信", "誘いを一度断り、別の日を提案する自然な返信を書いてください。"],
      reading: ["SNS投稿を読む", "短い投稿の感情と予定を読み取った想定で英語でまとめてください。"],
      listening: ["相づち練習", "相手の話を続けるリアクションを5つ書いてください。"]
    }
  }
};

const state = JSON.parse(localStorage.getItem("fluentPathState") || "{}");
const todayKey = new Date().toISOString().slice(0, 10);

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function saveState() {
  localStorage.setItem("fluentPathState", JSON.stringify(state));
}

function getLevel(score) {
  if (score <= 2) return "A1";
  if (score <= 4) return "A2";
  if (score <= 6) return "B1";
  if (score <= 8) return "B2";
  if (score <= 10) return "C1";
  return "C2";
}

function levelIndex() {
  return Math.max(0, levels.indexOf(state.level || "A1"));
}

function xpProgress() {
  return Math.min(99, Math.round(((state.xp || 0) % 500) / 5));
}

function renderProgress() {
  $("#streakCount").textContent = state.streak || 0;
  $("#xpCount").textContent = state.xp || 0;
  $("#levelLabel").textContent = state.level || "未診断";
  $("#heroLevel").textContent = state.level || "未診断";
  $("#ringText").textContent = `${xpProgress()}%`;
  $("#xpRing").style.strokeDashoffset = 314 - 314 * (xpProgress() / 100);

  $("#levelLadder").innerHTML = levels.map((level) => `
    <div class="level-step ${level === state.level ? "is-current" : ""}">
      <strong>${level}</strong>
      <span>${levelDescriptions(level)}</span>
    </div>
  `).join("");

  const doneDays = state.doneDays || [];
  const labels = ["月", "火", "水", "木", "金", "土", "日"];
  $("#weekRow").innerHTML = labels.map((label, index) => {
    const date = new Date();
    const day = date.getDay() || 7;
    date.setDate(date.getDate() - day + index + 1);
    const key = date.toISOString().slice(0, 10);
    return `<div class="day-dot ${doneDays.includes(key) ? "is-done" : ""}">${label}</div>`;
  }).join("");

  $("#habitMessage").textContent = doneDays.includes(todayKey)
    ? "今日は記録済みです。次の学習でXPをさらに積み上げられます。"
    : "今日の学習を記録すると、連続日数とXPが増えます。";
}

function levelDescriptions(level) {
  return {
    A1: "定型文で反応",
    A2: "身近な話題",
    B1: "要点を説明",
    B2: "議論に参加",
    C1: "精密に表現",
    C2: "自在に運用"
  }[level];
}

function renderPlan() {
  const goal = goalCopy[state.goal || "travel"];
  $("#goalLabel").textContent = goal.label;
  $("#recommendedLevel").textContent = state.level ? `${state.level}から開始` : "診断待ち";
  $("#focusLabel").textContent = goal.focus;

  const minutes = state.level && levelIndex() > 2 ? [12, 15, 18, 10] : [6, 8, 10, 6];
  const skillNames = ["Speaking", "Writing", "Reading", "Listening"];
  $("#dailyPlan").innerHTML = Object.entries(goal.tasks).map(([skill, task], index) => `
    <article class="daily-task">
      <span class="tag">${skillNames[index]} ${minutes[index]}分</span>
      <strong>${task[0]}</strong>
      <p>${task[1]}</p>
    </article>
  `).join("");
}

function setSkill(skill) {
  const goal = goalCopy[state.goal || "travel"];
  const task = goal.tasks[skill];
  $("#skillMode").textContent = skill[0].toUpperCase() + skill.slice(1);
  $("#skillTitle").textContent = task[0];
  $("#skillPrompt").textContent = task[1];
  $("#skillAnswer").value = "";
  $("#feedbackText").textContent = "回答を書いたらチェックできます。具体性、目的との一致、自然さを見ます。";
  $$(".tab").forEach((tab) => tab.classList.toggle("is-active", tab.dataset.skill === skill));
}

function checkAnswer() {
  const answer = $("#skillAnswer").value.trim();
  if (!answer) {
    $("#feedbackText").textContent = "まず1文だけでも入力してください。短くても、目的が伝わる文なら評価できます。";
    return;
  }

  const wordCount = answer.split(/\s+/).filter(Boolean).length;
  const hasPolite = /\b(could|would|please|thank|appreciate)\b/i.test(answer);
  const hasConnector = /\b(because|so|however|also|first|then)\b/i.test(answer);
  const advice = [];

  if (wordCount < 8) advice.push("もう1つ情報を足すと、実際の場面で伝わりやすくなります。");
  if (!hasPolite) advice.push("依頼や質問では could / would / please を入れると自然です。");
  if (levelIndex() >= 2 && !hasConnector) advice.push("because や however などで理由や対比を足すとB1以上らしくなります。");

  if (advice.length === 0) {
    $("#feedbackText").textContent = `良い回答です。${state.level || "A1"}の目標に対して、情報量と自然さのバランスが取れています。`;
    state.xp = (state.xp || 0) + 20;
    saveState();
    renderProgress();
    return;
  }

  $("#feedbackText").textContent = advice.join(" ");
}

function completeDay() {
  const doneDays = state.doneDays || [];
  if (!doneDays.includes(todayKey)) {
    doneDays.push(todayKey);
    state.doneDays = doneDays;
    state.streak = calculateStreak(doneDays);
    state.xp = (state.xp || 0) + 60;
  } else {
    state.xp = (state.xp || 0) + 10;
  }

  if ((state.xp || 0) >= (levelIndex() + 1) * 500 && levelIndex() < levels.length - 1) {
    state.level = levels[levelIndex() + 1];
  }

  saveState();
  renderProgress();
}

function calculateStreak(days) {
  const set = new Set(days);
  let streak = 0;
  const date = new Date();
  while (set.has(date.toISOString().slice(0, 10))) {
    streak += 1;
    date.setDate(date.getDate() - 1);
  }
  return streak;
}

$("#diagnosticForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const writing = String(form.get("writing") || "");
  const writingScore = Math.min(4, Math.floor(writing.split(/\s+/).filter(Boolean).length / 6));
  const score = Number(form.get("confidence")) * 2 + Number(form.get("vocab")) + Number(form.get("grammar")) + writingScore;

  state.goal = String(form.get("goal"));
  state.level = getLevel(score);
  state.xp = Math.max(state.xp || 0, 80 + levels.indexOf(state.level) * 40);
  saveState();
  renderPlan();
  renderProgress();
  setSkill("speaking");
  document.querySelector(".plan-panel").scrollIntoView({ behavior: "smooth", block: "start" });
});

$$(".tab").forEach((tab) => {
  tab.addEventListener("click", () => setSkill(tab.dataset.skill));
});

$("#checkAnswerButton").addEventListener("click", checkAnswer);
$("#completeDayButton").addEventListener("click", completeDay);

$("#speakButton").addEventListener("click", () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    $("#feedbackText").textContent = "このブラウザでは音声入力が使えません。英文を入力してチェックしてください。";
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.onresult = (event) => {
    $("#skillAnswer").value = event.results[0][0].transcript;
    checkAnswer();
  };
  recognition.start();
});

renderPlan();
renderProgress();
setSkill("speaking");
