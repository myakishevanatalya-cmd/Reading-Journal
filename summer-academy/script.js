"use strict";

const urlParams = new URLSearchParams(window.location.search);
const childName = urlParams.get("name") || "Катя";
const childId = urlParams.get("child") || "katya";
const isParentMode = urlParams.get("parent") === "1";
const STORAGE_KEY = `summer-academy-v1:${childId}`;

const SUBJECTS = {
  math: { label: "Математика", icon: "🧮", color: "#7db9df" },
  russian: { label: "Русский", icon: "✍️", color: "#d9718f" },
  reading: { label: "Чтение", icon: "📚", color: "#84c8a7" },
  world: { label: "Окружающий мир", icon: "🌿", color: "#f6b443" }
};

const SKILLS = {
  numbers100: { subject: "math", title: "Числа до 100", description: "Сравнение, десятки и единицы" },
  addSub100: { subject: "math", title: "Сложение и вычитание", description: "Устные и письменные вычисления" },
  multiplication50: { subject: "math", title: "Умножение до 50", description: "Табличные случаи и смысл умножения" },
  division50: { subject: "math", title: "Деление", description: "Связь деления и умножения" },
  wordProblems: { subject: "math", title: "Задачи", description: "Задачи в 1-2 действия" },
  geometry: { subject: "math", title: "Геометрия", description: "Фигуры, длина, периметр" },
  measures: { subject: "math", title: "Величины", description: "См, дм, м, минуты и часы" },
  orderActions: { subject: "math", title: "Порядок действий", description: "Скобки и порядок вычислений" },
  spellingPairs: { subject: "russian", title: "Орфограммы", description: "Жи-ши, ча-ща, чу-щу, чк-чн" },
  unstressedVowels: { subject: "russian", title: "Безударные гласные", description: "Подбор проверочных слов" },
  consonants: { subject: "russian", title: "Парные согласные", description: "Проверка согласной в корне" },
  dictionaryWords: { subject: "russian", title: "Словарные слова", description: "Непроверяемые написания" },
  separators: { subject: "russian", title: "Разделительные знаки", description: "Разделительные ь и ъ" },
  prepositions: { subject: "russian", title: "Предлоги", description: "Раздельное написание предлогов" },
  sentenceText: { subject: "russian", title: "Предложение и текст", description: "Тема, главная мысль, заголовок" },
  readingMeaning: { subject: "reading", title: "Понимание текста", description: "Главная мысль, герои, события" },
  worldFacts: { subject: "world", title: "Экспедиции", description: "Природа, карта, безопасность" }
};

const POSITIVE_LINES = [
  "Ты сегодня потренировала внимательность, а это настоящая суперсила.",
  "Ошибки не мешают учиться, они показывают, где спрятано следующее сокровище.",
  "Маленький шаг каждый день делает знания крепче.",
  "Ты не просто отвечала, ты училась замечать закономерности.",
  "Сегодня огонек знаний стал ярче."
];

const state = loadState();
let session = null;

const views = document.querySelectorAll(".view");
const navButtons = document.querySelectorAll(".nav-button");
const heroMessage = document.querySelector("#heroMessage");
const streakDays = document.querySelector("#streakDays");
const streakFlame = document.querySelector("#streakFlame");
const todayStatus = document.querySelector("#todayStatus");
const todayFocus = document.querySelector("#todayFocus");
const startSessionBtn = document.querySelector("#startSessionBtn");
const questPanel = document.querySelector("#questPanel");
const finishPanel = document.querySelector("#finishPanel");
const questCounter = document.querySelector("#questCounter");
const questSkill = document.querySelector("#questSkill");
const questProgressBar = document.querySelector("#questProgressBar");
const questPrompt = document.querySelector("#questPrompt");
const answerArea = document.querySelector("#answerArea");
const feedbackBox = document.querySelector("#feedbackBox");
const nextQuestionBtn = document.querySelector("#nextQuestionBtn");
const finishTitle = document.querySelector("#finishTitle");
const finishText = document.querySelector("#finishText");
const finishCorrect = document.querySelector("#finishCorrect");
const finishMistakes = document.querySelector("#finishMistakes");
const finishMinutes = document.querySelector("#finishMinutes");
const academyMap = document.querySelector("#academyMap");
const mistakeList = document.querySelector("#mistakeList");
const kidReport = document.querySelector("#kidReport");
const parentReport = document.querySelector("#parentReport");
const reviewMistakesBtn = document.querySelector("#reviewMistakesBtn");
const againSessionBtn = document.querySelector("#againSessionBtn");
const exportBtn = document.querySelector("#exportBtn");
const importInput = document.querySelector("#importInput");
const resetBtn = document.querySelector("#resetBtn");
const parentNavBtn = document.querySelector("#parentNavBtn");

if (isParentMode) {
  parentNavBtn.hidden = false;
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => showView(button.dataset.view));
});

startSessionBtn.addEventListener("click", startSession);
againSessionBtn.addEventListener("click", startSession);
nextQuestionBtn.addEventListener("click", nextQuestion);
reviewMistakesBtn.addEventListener("click", () => showView("errors"));
exportBtn.addEventListener("click", exportProgress);
importInput.addEventListener("change", importProgress);
resetBtn.addEventListener("click", resetProgress);

render();

function loadState() {
  const fallback = {
    childName,
    attempts: [],
    skillStats: {},
    dailySessions: [],
    mistakes: [],
    createdAt: new Date().toISOString()
  };

  try {
    return { ...fallback, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
  } catch {
    return fallback;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function showView(viewName) {
  if (viewName === "parent" && !isParentMode) return;
  views.forEach((view) => view.classList.toggle("active", view.id === `view-${viewName}`));
  navButtons.forEach((button) => button.classList.toggle("active", button.dataset.view === viewName));
  render();
}

function render() {
  const streak = getStreakDays();
  streakDays.textContent = String(streak);
  streakFlame.textContent = streak >= 7 ? "🌟" : streak >= 3 ? "🔥" : "✨";
  heroMessage.textContent = getHeroLine(streak);
  renderToday();
  renderMap();
  renderMistakes();
  renderKidReport();
  renderParentReport();
}

function renderToday() {
  const today = dateKey(new Date());
  const todaysSessions = state.dailySessions.filter((item) => item.date === today);
  if (todaysSessions.length) {
    todayStatus.textContent = "Сегодня огонек уже зажжен.";
    todayFocus.textContent = "Можно отдохнуть или сделать еще одну короткую тренировку.";
    startSessionBtn.textContent = "Еще 10 заданий";
  } else {
    todayStatus.textContent = "Готова к короткой тренировке?";
    todayFocus.textContent = "10 заданий: математика, русский, чтение и повтор ошибок.";
    startSessionBtn.textContent = "Зажечь огонек";
  }
}

function startSession() {
  const tasks = buildDailySession();
  session = {
    id: cryptoRandomId(),
    startedAt: Date.now(),
    questionStartedAt: Date.now(),
    index: 0,
    tasks,
    results: [],
    tryCount: 0,
    usedHint: false,
    locked: false
  };

  startSessionBtn.closest(".today-card").classList.add("hidden");
  finishPanel.classList.add("hidden");
  questPanel.classList.remove("hidden");
  renderQuestion();
}

function buildDailySession() {
  const reviewTasks = state.mistakes.slice(0, 3).map((mistake) => taskFromMistake(mistake));
  const freshFactories = [
    makeNumbersTask,
    makeAddSubTask,
    makeMultiplicationTask,
    makeDivisionTask,
    makeWordProblemTask,
    makeGeometryTask,
    makeMeasuresTask,
    makeOrderTask,
    makeSpellingTask,
    makeUnstressedVowelTask,
    makeConsonantTask,
    makeDictionaryTask,
    makeSeparatorTask,
    makePrepositionTask,
    makeSentenceTask,
    makeReadingTask,
    makeWorldTask
  ];
  const freshNeeded = Math.max(0, 10 - reviewTasks.length);
  const freshTasks = [];
  while (freshTasks.length < freshNeeded) {
    shuffle(freshFactories).forEach((factory) => {
      if (freshTasks.length < freshNeeded) freshTasks.push(factory());
    });
  }
  return shuffle([...reviewTasks, ...freshTasks]);
}

function taskFromMistake(mistake) {
  const task = createTaskBySkill(mistake.skillId);
  task.prompt = mistake.prompt;
  task.answer = mistake.answer;
  task.choices = mistake.choices && mistake.choices.length ? mistake.choices : task.choices;
  task.explanation = `Это задание вернулось для мягкого повторения. ${task.explanation}`;
  task.isReview = true;
  return task;
}

function createTaskBySkill(skillId) {
  const factories = {
    numbers100: makeNumbersTask,
    addSub100: makeAddSubTask,
    multiplication50: makeMultiplicationTask,
    division50: makeDivisionTask,
    wordProblems: makeWordProblemTask,
    geometry: makeGeometryTask,
    measures: makeMeasuresTask,
    orderActions: makeOrderTask,
    spellingPairs: makeSpellingTask,
    unstressedVowels: makeUnstressedVowelTask,
    consonants: makeConsonantTask,
    dictionaryWords: makeDictionaryTask,
    separators: makeSeparatorTask,
    prepositions: makePrepositionTask,
    sentenceText: makeSentenceTask,
    readingMeaning: makeReadingTask,
    worldFacts: makeWorldTask
  };
  return (factories[skillId] || makeAddSubTask)();
}

function renderQuestion() {
  const task = session.tasks[session.index];
  session.locked = false;
  session.tryCount = 0;
  session.usedHint = false;
  session.questionStartedAt = Date.now();
  questCounter.textContent = `Задание ${session.index + 1} из ${session.tasks.length}`;
  questSkill.textContent = `${SUBJECTS[SKILLS[task.skillId].subject].icon} ${SKILLS[task.skillId].title}`;
  questProgressBar.style.width = `${(session.index / session.tasks.length) * 100}%`;
  questPrompt.textContent = task.prompt;
  feedbackBox.classList.add("hidden");
  nextQuestionBtn.classList.add("hidden");
  answerArea.innerHTML = "";

  if (task.type === "input") {
    const input = document.createElement("input");
    input.className = "text-answer";
    input.type = "text";
    input.inputMode = "text";
    input.placeholder = "Напиши ответ";
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") checkAnswer(input.value, input);
    });

    const button = document.createElement("button");
    button.className = "primary-action";
    button.textContent = "Проверить";
    button.addEventListener("click", () => checkAnswer(input.value, input));

    answerArea.append(input, button);
    input.focus();
  } else {
    task.choices.forEach((choice) => {
      const button = document.createElement("button");
      button.className = "choice-button";
      button.textContent = choice;
      button.addEventListener("click", () => checkAnswer(choice, button));
      answerArea.append(button);
    });
  }
}

function checkAnswer(rawAnswer, sourceElement) {
  if (session.locked) return;

  const task = session.tasks[session.index];
  const userAnswer = normalizeAnswer(rawAnswer);
  const correctAnswer = normalizeAnswer(task.answer);
  if (!userAnswer) {
    feedbackBox.classList.remove("hidden");
    feedbackBox.textContent = "Сначала напиши ответ, потом проверим.";
    return;
  }

  session.tryCount += 1;
  const correct = userAnswer === correctAnswer;
  const finalAttempt = correct || session.tryCount >= 2;

  if (task.type !== "input") {
    answerArea.querySelectorAll(".choice-button").forEach((button) => {
      const isAnswer = normalizeAnswer(button.textContent) === correctAnswer;
      button.classList.toggle("correct", finalAttempt && isAnswer);
      button.classList.toggle("wrong", button === sourceElement && !correct);
    });
  }

  feedbackBox.classList.remove("hidden");
  if (!finalAttempt) {
    session.usedHint = true;
    feedbackBox.textContent = `Подсказка: ${task.hint || task.explanation} Попробуй еще раз.`;
    return;
  }

  session.locked = true;
  feedbackBox.textContent = correct
    ? `Верно! ${session.usedHint ? "Ты воспользовалась подсказкой и дошла до ответа." : task.success || "Так держать."}`
    : `Почти получилось. Правильный ответ: ${task.answer}. ${task.explanation}`;
  nextQuestionBtn.classList.remove("hidden");

  const attempt = {
    id: cryptoRandomId(),
    sessionId: session.id,
    date: dateKey(new Date()),
    timestamp: new Date().toISOString(),
    subject: SKILLS[task.skillId].subject,
    skillId: task.skillId,
    prompt: task.prompt,
    answer: task.answer,
    userAnswer: rawAnswer,
    correct,
    isReview: Boolean(task.isReview),
    usedHint: session.usedHint,
    tries: session.tryCount,
    timeSpentSec: Math.round((Date.now() - session.questionStartedAt) / 1000)
  };

  session.results.push(attempt);
  state.attempts.push(attempt);
  updateSkillStats(attempt);
  updateMistakeBank(task, attempt);
  saveState();
}

function nextQuestion() {
  session.index += 1;
  if (session.index >= session.tasks.length) {
    finishSession();
  } else {
    renderQuestion();
  }
}

function finishSession() {
  const correct = session.results.filter((item) => item.correct).length;
  const mistakes = session.results.length - correct;
  const minutes = Math.max(1, Math.round((Date.now() - session.startedAt) / 60000));
  const bestSkill = getBestSkill(session.results);
  state.dailySessions.push({
    id: session.id,
    date: dateKey(new Date()),
    startedAt: new Date(session.startedAt).toISOString(),
    finishedAt: new Date().toISOString(),
    total: session.results.length,
    correct,
    mistakes,
    minutes
  });
  saveState();

  questProgressBar.style.width = "100%";
  questPanel.classList.add("hidden");
  finishPanel.classList.remove("hidden");
  finishTitle.textContent = `${childName}, огонек знаний горит!`;
  finishText.textContent = mistakes
    ? `${POSITIVE_LINES[correct % POSITIVE_LINES.length]} Лучше всего сегодня: ${bestSkill}. ${mistakes} задания вернутся для доброго повторения.`
    : `Все задания получились! ${childName}, сегодня твоя Академия сияет особенно ярко.`;
  finishCorrect.textContent = String(correct);
  finishMistakes.textContent = String(mistakes);
  finishMinutes.textContent = String(minutes);
  session = null;
  render();
}

function updateSkillStats(attempt) {
  const current = state.skillStats[attempt.skillId] || {
    attempts: 0,
    correct: 0,
    streak: 0,
    hints: 0,
    mistakes: 0,
    lastAttempt: ""
  };
  current.attempts += 1;
  current.correct += attempt.correct ? 1 : 0;
  current.streak = attempt.correct ? current.streak + 1 : 0;
  current.hints += attempt.usedHint ? 1 : 0;
  current.mistakes += attempt.correct ? 0 : 1;
  current.lastAttempt = attempt.timestamp;
  state.skillStats[attempt.skillId] = current;
}

function updateMistakeBank(task, attempt) {
  state.mistakes = state.mistakes.filter((item) => item.prompt !== task.prompt);
  if (!attempt.correct) {
    state.mistakes.unshift({
      id: cryptoRandomId(),
      skillId: task.skillId,
      prompt: task.prompt,
      answer: task.answer,
      choices: task.choices || [],
      lastWrongAt: attempt.timestamp,
      repeats: 0
    });
  }
}

function renderMap() {
  academyMap.innerHTML = "";
  Object.entries(SKILLS).forEach(([skillId, skill]) => {
    const subject = SUBJECTS[skill.subject];
    const stats = state.skillStats[skillId] || { attempts: 0, correct: 0, streak: 0, mistakes: 0 };
    const accuracy = stats.attempts ? Math.round((stats.correct / stats.attempts) * 100) : 0;
    const status = getSkillStatus(stats);
    const card = document.createElement("article");
    card.className = "island-card";
    card.style.setProperty("--island-color", subject.color);
    card.innerHTML = `
      <div class="island-icon">${subject.icon}</div>
      <div>
        <h3>${skill.title}</h3>
        <p>${skill.description}</p>
        <div class="skill-meter"><span style="width:${accuracy}%"></span></div>
        <div class="island-meta">
          <span>${subject.label}</span>
          <span>${accuracy}% верно</span>
          <span>${status}</span>
        </div>
      </div>
    `;
    academyMap.append(card);
  });
}

function renderMistakes() {
  mistakeList.innerHTML = "";
  if (!state.mistakes.length) {
    mistakeList.innerHTML = `<div class="empty-state">Сейчас нет заданий на повтор. Когда что-то окажется сложным, оно мягко вернется сюда.</div>`;
    return;
  }

  state.mistakes.slice(0, 12).forEach((mistake) => {
    const skill = SKILLS[mistake.skillId];
    const subject = SUBJECTS[skill.subject];
    const card = document.createElement("article");
    card.className = "mistake-card";
    card.innerHTML = `
      <strong>${subject.icon} ${skill.title}</strong>
      <p>${mistake.prompt}</p>
      <div class="pill-row">
        <span class="pill">Ответ: ${mistake.answer}</span>
        <span class="pill">Вернется в тренировке</span>
      </div>
    `;
    mistakeList.append(card);
  });
}

function renderKidReport() {
  const weekAttempts = getWeekAttempts();
  const weekSessions = getWeekSessions();
  const best = topSkills(weekAttempts, true);
  const review = topSkills(weekAttempts, false);
  const improvement = getImprovementSkill();

  if (!weekAttempts.length) {
    kidReport.innerHTML = `<div class="empty-state">Недельный отчет появится после первой тренировки.</div>`;
    return;
  }

  kidReport.innerHTML = `
    <div class="report-hero">
      <p class="eyebrow">Огонек недели</p>
      <h3>${childName}, ты занималась ${uniqueDays(weekSessions).length} ${dayWord(uniqueDays(weekSessions).length)} на этой неделе.</h3>
      <p>${POSITIVE_LINES[weekAttempts.length % POSITIVE_LINES.length]}</p>
    </div>
    <div class="report-card">
      <strong>Суперсила недели</strong>
      <p>${best.length ? best.map(formatSkillName).join(", ") : "Первые шаги уже сделаны."}</p>
    </div>
    <div class="report-card">
      <strong>Прорыв недели</strong>
      <p>${improvement ? `${formatSkillName(improvement)} стала получаться увереннее.` : "Скоро здесь появится тема, где стало заметно лучше."}</p>
    </div>
    <div class="report-card">
      <strong>Задания, которые хотят подружиться</strong>
      <p>${review.length ? review.map(formatSkillName).join(", ") : "Сложных зон пока немного. Отличный старт."}</p>
    </div>
    <div class="report-card">
      <strong>Медаль недели</strong>
      <p>${getWeeklyMedal(weekAttempts)}</p>
    </div>
  `;
}

function renderParentReport() {
  const weekAttempts = getWeekAttempts();
  const weekSessions = getWeekSessions();
  if (!weekAttempts.length) {
    parentReport.innerHTML = `<div class="empty-state">После первой тренировки здесь появится аналитика по точности, ошибкам и темам.</div>`;
    return;
  }

  const total = weekAttempts.length;
  const correct = weekAttempts.filter((item) => item.correct).length;
  const accuracy = Math.round((correct / total) * 100);
  const days = uniqueDays(weekSessions).length;
  const minutes = weekSessions.reduce((sum, item) => sum + item.minutes, 0);
  const skillRows = Object.entries(groupBySkill(weekAttempts))
    .map(([skillId, items]) => {
      const right = items.filter((item) => item.correct).length;
      const hints = items.filter((item) => item.usedHint).length;
      return { skillId, total: items.length, correct: right, hints, accuracy: Math.round((right / items.length) * 100) };
    })
    .sort((a, b) => a.accuracy - b.accuracy);

  parentReport.innerHTML = `
    <div class="stat-card">
      <strong>Итоги недели</strong>
      <p>Занятий: ${days}. Заданий: ${total}. Верно: ${correct}. Точность: ${accuracy}%. Время: ${minutes} мин.</p>
    </div>
    <div class="stat-card">
      <strong>Лучше всего</strong>
      <p>${topSkills(weekAttempts, true).map(formatSkillName).join(", ") || "Недостаточно данных."}</p>
    </div>
    <div class="stat-card">
      <strong>Где стоит поработать</strong>
      <p>${topSkills(weekAttempts, false).map(formatSkillName).join(", ") || "Явных сложностей пока нет."}</p>
    </div>
    <table class="parent-table">
      <thead>
        <tr><th>Навык</th><th>Заданий</th><th>Верно</th><th>С подсказкой</th><th>Точность</th></tr>
      </thead>
      <tbody>
        ${skillRows.map((row) => `
          <tr>
            <td>${formatSkillName(row.skillId)}</td>
            <td>${row.total}</td>
            <td>${row.correct}</td>
            <td>${row.hints}</td>
            <td>${row.accuracy}%</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
    <div class="stat-card">
      <strong>Рекомендация</strong>
      <p>${buildParentRecommendation(skillRows)}</p>
    </div>
  `;
}

function makeNumbersTask() {
  const a = rand(20, 99);
  const b = rand(20, 99);
  const answer = a > b ? ">" : a < b ? "<" : "=";
  return choiceTask("numbers100", `Какой знак поставить: ${a} ... ${b}?`, answer, [">", "<", "="], "Сравни десятки, потом единицы.");
}

function makeAddSubTask() {
  const plus = Math.random() > 0.45;
  const a = rand(18, 78);
  const b = rand(6, plus ? 19 : Math.min(19, a - 1));
  const answer = plus ? a + b : a - b;
  return inputTask("addSub100", `${a} ${plus ? "+" : "-"} ${b} = ?`, String(answer), plus ? "Складывай десятки и единицы." : "Вычитание можно проверить сложением.");
}

function makeMultiplicationTask() {
  const pairs = [];
  for (let a = 2; a <= 9; a += 1) {
    for (let b = 2; b <= 9; b += 1) {
      if (a * b <= 50) pairs.push([a, b]);
    }
  }
  const [a, b] = sample(pairs);
  const answer = a * b;
  return inputTask("multiplication50", `${a} × ${b} = ?`, String(answer), "Умножение можно представить как несколько одинаковых групп.");
}

function makeDivisionTask() {
  const divisor = rand(2, 9);
  const quotient = rand(2, 9);
  const dividend = divisor * quotient;
  return inputTask("division50", `${dividend} : ${divisor} = ?`, String(quotient), "Деление можно проверить умножением.");
}

function makeWordProblemTask() {
  const templates = [
    () => {
      const a = rand(12, 35);
      const b = rand(5, 18);
      return inputTask("wordProblems", `У Кати было ${a} наклеек, ей подарили еще ${b}. Сколько стало?`, String(a + b), "Найди действие: стало больше, значит складываем.");
    },
    () => {
      const a = rand(24, 60);
      const b = rand(7, 22);
      return inputTask("wordProblems", `На полке было ${a} книг, ${b} взяли читать. Сколько осталось?`, String(a - b), "Осталось меньше, значит вычитаем.");
    },
    () => {
      const a = rand(2, 7);
      const b = rand(3, 7);
      return inputTask("wordProblems", `В ${a} коробках по ${b} карандашей. Сколько карандашей всего?`, String(a * b), "Одинаковые группы удобно считать умножением.");
    }
  ];
  return sample(templates)();
}

function makeGeometryTask() {
  const sideA = rand(3, 9);
  const sideB = rand(2, 8);
  return inputTask("geometry", `Прямоугольник: стороны ${sideA} см и ${sideB} см. Чему равен периметр?`, String((sideA + sideB) * 2), "Периметр - сумма длин всех сторон.");
}

function makeMeasuresTask() {
  const items = [
    () => {
      const dm = rand(2, 9);
      return inputTask("measures", `${dm} дм = сколько сантиметров?`, String(dm * 10), "В одном дециметре 10 сантиметров.");
    },
    () => {
      const hours = rand(1, 3);
      return inputTask("measures", `${hours} ч = сколько минут?`, String(hours * 60), "В одном часе 60 минут.");
    },
    () => {
      const cm = rand(20, 90);
      return choiceTask("measures", `${cm} см - это больше или меньше 1 метра?`, "меньше", ["больше", "меньше", "равно"], "В одном метре 100 сантиметров.");
    }
  ];
  return sample(items)();
}

function makeOrderTask() {
  const a = rand(12, 35);
  const b = rand(3, 12);
  const c = rand(2, 9);
  const withBrackets = Math.random() > 0.5;
  if (withBrackets) {
    return inputTask("orderActions", `(${a} - ${b}) + ${c} = ?`, String(a - b + c), "Сначала выполняем действие в скобках.");
  }
  return inputTask("orderActions", `${a} - ${b} + ${c} = ?`, String(a - b + c), "Сложение и вычитание выполняем по порядку слева направо.");
}

function makeSpellingTask() {
  const items = [
    ["лыжи", ["лыжы", "лыжи", "лыжыь"], "Жи-ши пишем с буквой и."],
    ["чашка", ["чяшка", "чашка", "чашька"], "Ча-ща пишем с буквой а."],
    ["чудо", ["чюдо", "чудо", "чьудо"], "Чу-щу пишем с буквой у."],
    ["точка", ["точка", "точька", "точкаь"], "Чк пишем без мягкого знака."],
    ["солнечный", ["солнечный", "солнечьный", "солнешный"], "Чн пишем без мягкого знака."]
  ];
  const [answer, choices, explanation] = sample(items);
  return choiceTask("spellingPairs", "Выбери правильное написание слова.", answer, shuffle(choices), explanation);
}

function makeUnstressedVowelTask() {
  const items = [
    ["леса", "лес", "Какую букву пишем в слове л_са? Проверочное слово: лес.", "е"],
    ["гора", "горы", "Какую букву пишем в слове г_ра? Проверочное слово: горы.", "о"],
    ["трава", "травы", "Какую букву пишем в слове тр_ва? Проверочное слово: травы.", "а"],
    ["зима", "зимы", "Какую букву пишем в слове з_ма? Проверочное слово: зимы.", "и"]
  ];
  const item = sample(items);
  return choiceTask("unstressedVowels", item[2], item[3], ["а", "о", "е", "и"], `Проверочное слово помогает услышать гласную: ${item[1]}.`);
}

function makeConsonantTask() {
  const items = [
    ["гриб", "грибы", "Какую букву пишем на конце слова гри_?", "б"],
    ["дуб", "дубы", "Какую букву пишем на конце слова ду_?", "б"],
    ["снег", "снега", "Какую букву пишем на конце слова сне_?", "г"],
    ["мороз", "морозы", "Какую букву пишем на конце слова моро_?", "з"]
  ];
  const item = sample(items);
  return choiceTask("consonants", item[2], item[3], ["б", "п", "г", "к", "з", "с"], `Проверяем так, чтобы после согласной была гласная: ${item[1]}.`);
}

function makeDictionaryTask() {
  const items = [
    ["корова", ["карова", "корова", "кароваа"], "Это словарное слово, его нужно запомнить."],
    ["собака", ["сабака", "собака", "собако"], "Это словарное слово, его удобно проговаривать по слогам."],
    ["молоко", ["малако", "молоко", "молако"], "В словарных словах написание проверяем по словарю."],
    ["ворона", ["варона", "ворона", "воронна"], "Это словарное слово."],
    ["ученик", ["ученик", "учиник", "ученек"], "Это словарное слово, запоминаем букву е."]
  ];
  const [answer, choices, explanation] = sample(items);
  return choiceTask("dictionaryWords", "Выбери правильное словарное слово.", answer, choices, explanation);
}

function makeSeparatorTask() {
  const items = [
    ["семья", ["семя", "семья", "семъя"], "В слове семья пишется разделительный мягкий знак."],
    ["вьюга", ["вюга", "вьюга", "въюга"], "Перед ю после согласной здесь нужен разделительный мягкий знак."],
    ["подъезд", ["подезд", "подьезд", "подъезд"], "После приставки перед е пишется разделительный твердый знак."],
    ["объявление", ["обявление", "обьявление", "объявление"], "После приставки перед я пишется разделительный твердый знак."]
  ];
  const [answer, choices, explanation] = sample(items);
  return choiceTask("separators", "Где слово написано правильно?", answer, choices, explanation);
}

function makePrepositionTask() {
  const items = [
    ["Кот сидит на окне.", ["на окне", "наокне"], "Предлог со словом пишется раздельно."],
    ["Дети пошли в школу.", ["в школу", "вшколу"], "Между предлогом и словом можно вставить другое слово."],
    ["Мяч лежит под столом.", ["под столом", "подстолом"], "Предлог пишется отдельно от слова."],
    ["Мы гуляли у реки.", ["у реки", "уреки"], "Короткие предлоги тоже пишутся отдельно."]
  ];
  const [sentence, choices, explanation] = sample(items);
  return choiceTask("prepositions", `Выбери правильное написание из предложения: ${sentence}`, choices[0], choices, explanation);
}

function makeSentenceTask() {
  const items = [
    ["Скоро начнется дождь.", "повествовательное"],
    ["Почему светит солнце?", "вопросительное"],
    ["Закрой, пожалуйста, дверь.", "побудительное"]
  ];
  const [sentence, answer] = sample(items);
  return choiceTask("sentenceText", `Какое это предложение: "${sentence}"`, answer, ["повествовательное", "вопросительное", "побудительное"], "Посмотри, сообщает ли оно, спрашивает или просит действовать.");
}

function makeReadingTask() {
  const texts = [
    {
      text: "Маша посадила у окна фасоль. Каждый день она поливала росток и записывала, как он меняется. Через неделю появился зеленый лист.",
      question: "Что помогло ростку вырасти?",
      answer: "уход Маши",
      choices: ["уход Маши", "сильный ветер", "новая тетрадь"]
    },
    {
      text: "Петя увидел на дорожке маленького жука. Он не стал трогать его руками, а аккуратно обошел стороной.",
      question: "Какой поступок совершил Петя?",
      answer: "бережный",
      choices: ["бережный", "жадный", "невнимательный"]
    },
    {
      text: "Летом ребята устроили библиотеку во дворе. Каждый принес книгу, а потом они обменивались историями и советовали друг другу самое интересное.",
      question: "Какая главная мысль текста?",
      answer: "книгами интересно делиться",
      choices: ["книгами интересно делиться", "летом нельзя читать", "книги нужно прятать"]
    }
  ];
  const item = sample(texts);
  return choiceTask("readingMeaning", `${item.text} ${item.question}`, item.answer, item.choices, "Найди ответ в смысле текста, а не только в одном слове.");
}

function makeWorldTask() {
  const items = [
    ["Что показывает глобус?", "модель Земли", ["модель Земли", "расписание уроков", "только город Москву"], "Глобус помогает представить форму Земли."],
    ["К какой группе относится береза?", "дерево", ["дерево", "кустарник", "трава"], "У дерева один главный ствол."],
    ["Что помогает определить стороны горизонта?", "компас", ["компас", "линейка", "термометр"], "Компас показывает направление на север."],
    ["Что относится к безопасному поведению в интернете?", "не сообщать личные данные", ["не сообщать личные данные", "писать адрес всем", "открывать любые ссылки"], "Личные данные нужно беречь."]
  ];
  const [prompt, answer, choices, explanation] = sample(items);
  return choiceTask("worldFacts", prompt, answer, choices, explanation);
}

function choiceTask(skillId, prompt, answer, choices, explanation) {
  return { type: "choice", skillId, prompt, answer, choices: shuffle([...new Set(choices)]), explanation };
}

function inputTask(skillId, prompt, answer, explanation) {
  return { type: "input", skillId, prompt, answer, explanation };
}

function getHeroLine(streak) {
  if (streak >= 7) return `${childName}, твой огонек знаний горит уже неделю. Очень сильный ритм.`;
  if (streak >= 3) return `${childName}, огонек разгорается. Сегодня хватит маленького шага.`;
  return `${childName}, сегодня можно зажечь огонек знаний.`;
}

function getStreakDays() {
  const days = [...new Set(state.dailySessions.map((item) => item.date))].sort().reverse();
  let streak = 0;
  const cursor = new Date();
  for (let i = 0; i < 60; i += 1) {
    const key = dateKey(cursor);
    if (days.includes(key)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else if (i === 0) {
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

function getWeekStart(date) {
  const copy = new Date(date);
  const day = copy.getDay() || 7;
  copy.setHours(0, 0, 0, 0);
  copy.setDate(copy.getDate() - day + 1);
  return copy;
}

function getWeekAttempts() {
  const start = getWeekStart(new Date());
  return state.attempts.filter((attempt) => new Date(attempt.timestamp) >= start);
}

function getWeekSessions() {
  const start = getWeekStart(new Date());
  return state.dailySessions.filter((sessionItem) => new Date(sessionItem.finishedAt) >= start);
}

function uniqueDays(sessions) {
  return [...new Set(sessions.map((item) => item.date))];
}

function topSkills(attempts, best) {
  return Object.entries(groupBySkill(attempts))
    .map(([skillId, items]) => {
      const correct = items.filter((item) => item.correct).length;
      return { skillId, total: items.length, accuracy: correct / items.length };
    })
    .filter((item) => item.total >= 2 && (best || item.accuracy < 0.8))
    .sort((a, b) => best ? b.accuracy - a.accuracy : a.accuracy - b.accuracy)
    .slice(0, 3)
    .map((item) => item.skillId);
}

function groupBySkill(attempts) {
  return attempts.reduce((groups, attempt) => {
    groups[attempt.skillId] = groups[attempt.skillId] || [];
    groups[attempt.skillId].push(attempt);
    return groups;
  }, {});
}

function getBestSkill(results) {
  const best = topSkills(results, true)[0];
  return best ? formatSkillName(best) : "старательность";
}

function getImprovementSkill() {
  const skillsWithStreak = Object.entries(state.skillStats)
    .filter(([, stats]) => stats.streak >= 2)
    .sort((a, b) => b[1].streak - a[1].streak);
  return skillsWithStreak[0]?.[0] || "";
}

function formatSkillName(skillId) {
  return SKILLS[skillId]?.title || skillId;
}

function getWeeklyMedal(attempts) {
  const subjectCounts = attempts.reduce((counts, attempt) => {
    counts[attempt.subject] = (counts[attempt.subject] || 0) + 1;
    return counts;
  }, {});
  const subject = Object.entries(subjectCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const medals = {
    math: "Хранительница числового города",
    russian: "Детектив орфограмм",
    reading: "Исследовательница смыслов",
    world: "Юная экспедиционерка"
  };
  return medals[subject] || "Первый огонек Академии";
}

function getSkillStatus(stats) {
  if (!stats.attempts) return "новое";
  if (stats.streak >= 3) return "уверенно";
  if (stats.mistakes > stats.correct) return "нужно повторить";
  return "тренируем";
}

function buildParentRecommendation(rows) {
  const weak = rows.filter((row) => row.total >= 2 && row.accuracy < 75).slice(0, 3);
  if (!weak.length) return "Сохранить короткий ежедневный формат: 10-12 минут, смешанные задания и немного повторения.";
  return `На следующей неделе добавить мягкое повторение: ${weak.map((row) => formatSkillName(row.skillId)).join(", ")}. Оптимально 2-3 задания по каждой теме в день.`;
}

function exportProgress() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `summer-academy-${childId}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function importProgress(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(String(reader.result));
      Object.assign(state, imported);
      saveState();
      render();
      alert("Прогресс импортирован.");
    } catch {
      alert("Не получилось прочитать файл.");
    }
  };
  reader.readAsText(file);
}

function resetProgress() {
  const ok = confirm("Сбросить весь прогресс Летней Академии? Читательский дневник это не затронет.");
  if (!ok) return;
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}

function normalizeAnswer(value) {
  return String(value).trim().toLowerCase().replaceAll("ё", "е");
}

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sample(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle(items) {
  return items
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

function dayWord(count) {
  if (count === 1) return "день";
  if (count > 1 && count < 5) return "дня";
  return "дней";
}

function cryptoRandomId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
