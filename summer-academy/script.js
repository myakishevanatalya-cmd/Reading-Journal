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

const WEEKLY_SUBJECT_GOALS = {
  math: 3,
  russian: 3,
  reading: 2
};

const SKILLS = {
  numbers100: { subject: "math", title: "Числа до 100", description: "Сравнение, десятки и единицы" },
  addSub100: { subject: "math", title: "Сложение и вычитание", description: "Устные и письменные вычисления" },
  multiplication50: { subject: "math", title: "Умножение до 50", description: "Табличные случаи и смысл умножения" },
  division50: { subject: "math", title: "Деление", description: "Связь деления и умножения" },
  wordProblems: { subject: "math", title: "Задачи", description: "Задачи в 1-2 действия" },
  geometry: { subject: "math", title: "Геометрия", description: "Фигуры, длина, периметр" },
  measures: { subject: "math", title: "Величины", description: "См, дм, м, минуты и часы" },
  lifeMath: { subject: "math", title: "Математика в жизни", description: "Часы, деньги, линейка, фигуры и закономерности" },
  orderActions: { subject: "math", title: "Порядок действий", description: "Скобки и порядок вычислений" },
  spellingPairs: { subject: "russian", title: "Орфограммы", description: "Жи-ши, ча-ща, чу-щу, чк-чн" },
  unstressedVowels: { subject: "russian", title: "Безударные гласные", description: "Подбор проверочных слов" },
  consonants: { subject: "russian", title: "Парные согласные", description: "Проверка согласной в корне" },
  dictionaryWords: { subject: "russian", title: "Словарные слова", description: "Непроверяемые написания" },
  separators: { subject: "russian", title: "Разделительные знаки", description: "Разделительные ь и ъ" },
  prepositions: { subject: "russian", title: "Предлоги", description: "Раздельное написание предлогов" },
  wordLogic: { subject: "russian", title: "Детектив слов", description: "Лишнее слово, смысл и замена буквы" },
  wordGames: { subject: "russian", title: "Игровой детектив", description: "Записки, улики, потерянные буквы и предложения" },
  wordPuzzles: { subject: "russian", title: "Словесные головоломки", description: "Кроссворды, буквенные круги и поиск слов" },
  proverbs: { subject: "russian", title: "Пословицы", description: "Мудрые фразы, смысл и ситуации" },
  soundLetters: { subject: "russian", title: "Звуки и буквы", description: "Звуки, буквы и хитрые гласные" },
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

const ACADEMY_JOKES = [
  "Учебник математики сказал тетради: «Не переживай, мы все решим».",
  "Запятая мечтала стать точкой, но любила оставлять место для продолжения.",
  "Словарное слово пришло без проверки, зато в красивом костюме.",
  "Пример 7 × 8 долго прятался, но Катя все равно найдет его по следам.",
  "Буква Ё надела две точки и сказала: «Сегодня я при параде».",
  "Карандаш решил стать писателем, но сначала наточил мысль.",
  "Число 100 гордилось собой, пока не встретило задачу в два действия."
];

const TRAINER_MODES = [
  {
    id: "fast10",
    subject: "math",
    icon: "⏱️",
    title: "Быстрый счет до 10",
    description: "Короткий забег на точность и легкость.",
    chips: ["10 примеров", "время", "без спешки"]
  },
  {
    id: "fast100",
    subject: "math",
    icon: "⚡",
    title: "Счет в пределах 100",
    description: "Сложение, вычитание и круглые десятки.",
    chips: ["12 примеров", "автоматизация", "до 100"]
  },
  {
    id: "multiply",
    subject: "math",
    icon: "✖️",
    title: "Таблица умножения",
    description: "Можно тренировать все примеры или сложные случаи.",
    chips: ["на 2-9", "сложные", "быстрота"]
  },
  {
    id: "lifeMath",
    subject: "math",
    icon: "🧭",
    title: "Математика в жизни",
    description: "Часы, деньги, линейка, фигуры, маршруты и закономерности.",
    chips: ["визуально", "8 заданий", "для жизни"]
  },
  {
    id: "dictionary",
    subject: "russian",
    icon: "📝",
    title: "Словарные слова",
    description: "Вставь букву, найди ошибку, запомни красивый образ.",
    chips: ["орфография", "слова Кати", "память"]
  },
  {
    id: "wordDetective",
    subject: "russian",
    icon: "🔎",
    title: "Детектив слов",
    description: "Лишнее слово, замена буквы, звуки и буквы.",
    chips: ["логика", "смысл", "звуки"]
  },
  {
    id: "playroom",
    subject: "russian",
    icon: "🧩",
    title: "Игровая комната",
    description: "Мини-ребусы, собери слово и словесные загадки.",
    chips: ["игра", "ребусы", "кроссвордный дух"]
  },
  {
    id: "russianGames",
    subject: "russian",
    icon: "🕵️",
    title: "Игровой детектив слов",
    description: "Потерянные буквы, записки с ошибками, улики и предложения.",
    chips: ["8 заданий", "правила", "внимание"]
  },
  {
    id: "wordPuzzles",
    subject: "russian",
    icon: "🧠",
    title: "Словесные головоломки",
    description: "Кроссворд-карточки, буквенный круг и поиск слов в клетках.",
    chips: ["головоломки", "словарные", "визуально"]
  },
  {
    id: "proverbs",
    subject: "russian",
    icon: "📜",
    title: "Пословицы и поговорки",
    description: "Закончи фразу, выбери смысл и найди пословицу к ситуации.",
    chips: ["мудрая минутка", "смысл", "речь"]
  },
  {
    id: "readingQuest",
    subject: "reading",
    icon: "📖",
    title: "Читательский сыщик",
    description: "Короткие тексты, главная мысль, порядок событий и точные ответы.",
    chips: ["смысл", "внимание", "без спешки"]
  }
];

const SUBJECT_LAUNCHERS = [
  {
    subject: "math",
    icon: "🧮",
    title: "Математика",
    text: "Разогреть счет, таблицу умножения и задачи до легкости.",
    note: "Сегодня хорошо подойдет 5 минут счета.",
    actions: [
      { label: "Счет до 100", action: "fast100" },
      { label: "Таблица", action: "multiply", variant: "hard" }
    ]
  },
  {
    subject: "russian",
    icon: "🔎",
    title: "Русский",
    text: "Расследовать слова, буквы, звуки и словарные хитрости.",
    note: "Можно начать с детектива слов.",
    actions: [
      { label: "Детектив слов", action: "wordDetective" },
      { label: "Игры", action: "russianGames" },
      { label: "Словарные", action: "dictionary" }
    ]
  },
  {
    subject: "reading",
    icon: "📖",
    title: "Чтение",
    text: "Поймать главную мысль, порядок событий и точные детали.",
    note: "Короткий текст, но внимательные глаза.",
    actions: [
      { label: "Сыщик", action: "readingQuest" },
      { label: "Огонек дня", action: "daily" }
    ]
  }
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
const subjectLaunchGrid = document.querySelector("#subjectLaunchGrid");
const subjectLaunch = document.querySelector(".subject-launch");
const todayGuideCard = document.querySelector("#todayGuideCard");
const trainerGuideCard = document.querySelector("#trainerGuideCard");
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
const exitSessionBtn = document.querySelector("#exitSessionBtn");
const finishTitle = document.querySelector("#finishTitle");
const finishText = document.querySelector("#finishText");
const finishCorrect = document.querySelector("#finishCorrect");
const finishMistakes = document.querySelector("#finishMistakes");
const finishMinutes = document.querySelector("#finishMinutes");
const academyMap = document.querySelector("#academyMap");
const trainerGrid = document.querySelector("#trainerGrid");
const jokeLine = document.querySelector("#jokeLine");
const newJokeBtn = document.querySelector("#newJokeBtn");
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

startSessionBtn.addEventListener("click", () => startSession());
againSessionBtn.addEventListener("click", () => startSession());
nextQuestionBtn.addEventListener("click", nextQuestion);
exitSessionBtn.addEventListener("click", exitSession);
reviewMistakesBtn.addEventListener("click", () => showView("errors"));
newJokeBtn.addEventListener("click", renderJoke);
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
  renderTrainers();
  renderMap();
  renderMistakes();
  renderKidReport();
  renderParentReport();
}

function renderToday() {
  const trainingActive = Boolean(session);
  const finishVisible = !finishPanel.classList.contains("hidden");
  const focusMode = trainingActive || finishVisible;
  startSessionBtn.closest(".today-card").classList.toggle("hidden", focusMode);
  subjectLaunch.classList.toggle("hidden", focusMode);
  todayGuideCard.classList.toggle("hidden", focusMode);
  questPanel.classList.toggle("hidden", !trainingActive);

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
  renderSubjectLaunchers();
  renderGuide(todayGuideCard, "today");
}

function renderSubjectLaunchers() {
  subjectLaunchGrid.innerHTML = "";
  const dayBalance = getSubjectDayBalance(7);
  SUBJECT_LAUNCHERS.forEach((launcher) => {
    const subject = SUBJECTS[launcher.subject];
    const goal = WEEKLY_SUBJECT_GOALS[launcher.subject] || 0;
    const done = dayBalance[launcher.subject] || 0;
    const progress = goal ? Math.min(100, Math.round((done / goal) * 100)) : 0;
    const card = document.createElement("article");
    card.className = "subject-card";
    card.style.setProperty("--subject-color", subject.color);
    card.innerHTML = `
      <div class="subject-card__top">
        <div class="subject-card__icon">${launcher.icon}</div>
        <div>
          <p class="eyebrow">${subject.label}</p>
          <h3>${launcher.title}</h3>
        </div>
      </div>
      <p>${launcher.text}</p>
      <div class="subject-card__meter" aria-label="${subject.label}: ${done} из ${goal} дней"><span style="width:${progress}%"></span></div>
      <div class="subject-card__note">${launcher.note} ${goal ? `Неделя: ${done}/${goal}.` : ""}</div>
      <div class="subject-card__actions">
        ${launcher.actions.map((item, index) => `
          <button class="${index === 0 ? "subject-action" : "subject-action subject-action--soft"}" data-subject-action="${item.action}" data-subject-variant="${item.variant || ""}">
            ${item.label}
          </button>
        `).join("")}
      </div>
    `;
    card.querySelectorAll("[data-subject-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.subjectAction;
        if (action === "daily") {
          startSession();
        } else {
          startTrainer(action, button.dataset.subjectVariant || "");
        }
      });
    });
    subjectLaunchGrid.append(card);
  });
}

function renderTrainers() {
  renderGuide(trainerGuideCard, "trainers");
  trainerGrid.innerHTML = "";
  TRAINER_MODES.forEach((mode) => {
    const subject = SUBJECTS[mode.subject];
    const card = document.createElement("article");
    card.className = "trainer-card";
    card.style.setProperty("--trainer-color", subject.color);
    card.innerHTML = `
      <div class="trainer-card__top">
        <div class="trainer-card__icon">${mode.icon}</div>
        <div>
          <h3>${mode.title}</h3>
          <p>${mode.description}</p>
        </div>
      </div>
      <div class="pill-row">
        ${mode.chips.map((chip) => `<span class="pill">${chip}</span>`).join("")}
      </div>
      <div class="trainer-actions">
        ${renderTrainerActions(mode)}
      </div>
    `;
    card.querySelectorAll("[data-trainer]").forEach((button) => {
      button.addEventListener("click", () => startTrainer(button.dataset.trainer, button.dataset.variant || ""));
    });
    trainerGrid.append(card);
  });
}

function renderGuide(container, place) {
  const guide = getGuideSuggestion();
  const placeLine = place === "today"
    ? "Можно выбрать самой, а я тихонько слежу, чтобы все острова Академии получали внимание."
    : "Выбор свободный, но хороший маршрут иногда просит заглянуть не только в любимую комнату.";

  container.innerHTML = `
    <div class="guide-card__avatar" aria-hidden="true">🦉</div>
    <div>
      <p class="eyebrow">Филин Академик</p>
      <h3>${guide.title}</h3>
      <p>${guide.text} ${placeLine}</p>
      <button class="secondary-action" data-guide-action="${guide.action}" data-guide-variant="${guide.variant || ""}">${guide.button}</button>
    </div>
  `;

  container.querySelector("button").addEventListener("click", () => {
    if (guide.action === "daily") {
      startSession();
    } else {
      startTrainer(guide.action, guide.variant || "");
    }
  });
}

function getGuideSuggestion() {
  const balance = getSubjectBalance(7);
  const dayBalance = getSubjectDayBalance(7);
  const weekGap = getWeeklySubjectGap(dayBalance);
  if (weekGap) {
    const absentDays = getDaysSinceSubject(weekGap.subject);
    let absentLine = `${SUBJECTS[weekGap.subject].label} еще ждет первого визита на этой неделе.`;
    if (absentDays === 0) {
      absentLine = `${SUBJECTS[weekGap.subject].label} сегодня уже была, можно добавить еще один короткий подход.`;
    } else if (absentDays !== null) {
      absentLine = `${SUBJECTS[weekGap.subject].label} не появлялась ${absentDays} ${dayWord(absentDays)}.`;
    }
    return {
      title: getSubjectGuideTitle(weekGap.subject),
      text: `${absentLine} Для ровного маршрута хватит короткой тренировки.`,
      action: subjectToTrainerAction(weekGap.subject),
      button: getSubjectGuideButton(weekGap.subject)
    };
  }

  const missing = ["math", "russian", "reading"].find((subject) => balance[subject] === 0);
  if (missing === "math") {
    return {
      title: "Математический остров соскучился",
      text: "Детективы слов прекрасны, но числа тоже любят, когда их навещают.",
      action: "fast100",
      button: "Размять быстрый счет"
    };
  }
  if (missing === "russian") {
    return {
      title: "Слова ждут расследования",
      text: "Сегодня можно устроить маленькое дело о словах, буквах и смыслах.",
      action: "wordDetective",
      button: "Открыть детектив слов"
    };
  }
  if (missing === "reading") {
    return {
      title: "Книжная тропинка зовет",
      text: "Понимание текста помогает ловить главную мысль, порядок событий и точные детали.",
      action: "readingQuest",
      button: "Открыть читательского сыщика"
    };
  }

  if (balance.math < balance.russian - 2) {
    return {
      title: "Числа попросили минутку внимания",
      text: "Русский идет бодро. Для равновесия полезно дать математике короткий забег.",
      action: "fast100",
      button: "5 минут счета"
    };
  }

  if (balance.russian < balance.math - 2) {
    return {
      title: "Слова машут из словаря",
      text: "Математика разогрелась. Теперь можно дать слово словарным словам.",
      action: "dictionary",
      button: "Потренировать слова"
    };
  }

  const weak = topSkills(getWeekAttempts(), false)[0];
  if (weak) {
    return {
      title: "Есть маленькая тропинка для роста",
      text: `Филин заметил: ${formatSkillName(weak)} просит доброго повторения.`,
      action: skillToTrainerAction(weak),
      variant: skillToTrainerVariant(weak),
      button: "Повторить мягко"
    };
  }

  return {
    title: "Маршрут выглядит ровно",
    text: "Можно выбрать любимую комнату: быстрый счет, словарные слова, читательский сыщик или веселые ребусы.",
    action: "playroom",
    button: "На веселую перемену"
  };
}

function getSubjectBalance(daysBack) {
  const since = new Date();
  since.setDate(since.getDate() - daysBack + 1);
  since.setHours(0, 0, 0, 0);
  const balance = { math: 0, russian: 0, reading: 0, world: 0 };
  state.attempts.forEach((attempt) => {
    if (new Date(attempt.timestamp) >= since && balance[attempt.subject] !== undefined) {
      balance[attempt.subject] += 1;
    }
  });
  return balance;
}

function getSubjectDayBalance(daysBack) {
  const since = new Date();
  since.setDate(since.getDate() - daysBack + 1);
  since.setHours(0, 0, 0, 0);
  const days = { math: new Set(), russian: new Set(), reading: new Set(), world: new Set() };
  state.attempts.forEach((attempt) => {
    if (new Date(attempt.timestamp) >= since && days[attempt.subject]) {
      days[attempt.subject].add(attempt.date || dateKey(new Date(attempt.timestamp)));
    }
  });
  return Object.fromEntries(Object.entries(days).map(([subject, values]) => [subject, values.size]));
}

function getWeeklySubjectGap(dayBalance) {
  return Object.entries(WEEKLY_SUBJECT_GOALS)
    .map(([subject, goal]) => ({ subject, goal, days: dayBalance[subject] || 0, gap: goal - (dayBalance[subject] || 0) }))
    .filter((item) => item.gap > 0)
    .sort((a, b) => b.gap - a.gap || b.goal - a.goal)[0] || null;
}

function getDaysSinceSubject(subject) {
  const attempts = state.attempts
    .filter((attempt) => attempt.subject === subject)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  if (!attempts.length) return null;
  const last = new Date(attempts[0].timestamp);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  last.setHours(0, 0, 0, 0);
  return Math.round((today - last) / 86400000);
}

function subjectToTrainerAction(subject) {
  if (subject === "math") return "fast100";
  if (subject === "russian") return "wordDetective";
  if (subject === "reading") return "readingQuest";
  return "daily";
}

function getSubjectGuideTitle(subject) {
  const titles = {
    math: "Числовой маяк просит внимания",
    russian: "Слова зовут на расследование",
    reading: "Книжная тропинка ждет сыщика"
  };
  return titles[subject] || "Маршрут просит маленький шаг";
}

function getSubjectGuideButton(subject) {
  const buttons = {
    math: "5 минут счета",
    russian: "Открыть детектив слов",
    reading: "Потренировать чтение"
  };
  return buttons[subject] || "Зажечь огонек";
}

function skillToTrainerAction(skillId) {
  if (["addSub100", "numbers100", "orderActions"].includes(skillId)) return "fast100";
  if (["measures", "geometry", "lifeMath"].includes(skillId)) return "lifeMath";
  if (skillId === "multiplication50") return "multiply";
  if (skillId === "dictionaryWords") return "dictionary";
  if (skillId === "readingMeaning") return "readingQuest";
  if (["wordLogic", "soundLetters", "spellingPairs", "unstressedVowels", "consonants", "separators", "prepositions"].includes(skillId)) return "wordDetective";
  return "daily";
}

function skillToTrainerVariant(skillId) {
  if (skillId === "multiplication50") return "hard";
  return "";
}

function renderTrainerActions(mode) {
  if (mode.id === "multiply") {
    const numbers = ["all", "2", "3", "4", "5", "6", "7", "8", "9", "hard"];
    return numbers.map((value) => {
      const label = value === "all" ? "Все" : value === "hard" ? "Сложные" : `На ${value}`;
      return `<button class="trainer-chip" data-trainer="${mode.id}" data-variant="${value}">${label}</button>`;
    }).join("");
  }
  return `<button class="primary-action" data-trainer="${mode.id}">Начать</button>`;
}

function renderJoke() {
  jokeLine.textContent = sample(ACADEMY_JOKES);
}

function startTrainer(modeId, variant) {
  const mode = TRAINER_MODES.find((item) => item.id === modeId);
  const tasks = buildTrainerTasks(modeId, variant);
  startSession({
    mode: "trainer",
    title: mode ? mode.title : "Тренажер",
    tasks
  });
}

function startSession(options = {}) {
  const tasks = options.tasks || buildDailySession();
  session = {
    id: cryptoRandomId(),
    mode: options.mode || "daily",
    title: options.title || "Огонек дня",
    startedAt: Date.now(),
    questionStartedAt: Date.now(),
    index: 0,
    tasks,
    results: [],
    tryCount: 0,
    usedHint: false,
    locked: false
  };

  showView("today");
  startSessionBtn.closest(".today-card").classList.add("hidden");
  subjectLaunch.classList.add("hidden");
  todayGuideCard.classList.add("hidden");
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
    makeOddWordTask,
    makeSoundLettersTask,
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

function buildTrainerTasks(modeId, variant) {
  const builders = {
    fast10: () => Array.from({ length: 10 }, () => makeFastArithmeticTask("within10")),
    fast100: () => Array.from({ length: 12 }, () => makeFastArithmeticTask(sample(["within20", "within100", "roundTens"]))),
    multiply: () => Array.from({ length: 12 }, () => makeMultiplicationTask(variant)),
    lifeMath: () => Array.from({ length: 8 }, () => makeLifeMathTask()),
    dictionary: () => Array.from({ length: 10 }, () => sample([makeDictionaryTask, makeDictionaryMissingTask])()),
    wordDetective: () => Array.from({ length: 10 }, () => sample([makeOddWordTask, makeLetterSwapTask, makeSoundLettersTask, makeStressTask])()),
    playroom: () => Array.from({ length: 8 }, () => sample([makeMiniRebusTask, makeBuildWordTask, makeOddWordTask, makeDictionaryMissingTask])()),
    russianGames: () => Array.from({ length: 8 }, () => makeRussianGameTask()),
    wordPuzzles: () => Array.from({ length: 6 }, () => makeWordPuzzleTask()),
    proverbs: () => Array.from({ length: 8 }, () => makeProverbTask()),
    readingQuest: () => Array.from({ length: 8 }, () => makeReadingTask())
  };
  return (builders[modeId] || builders.fast100)();
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
    lifeMath: makeLifeMathTask,
    orderActions: makeOrderTask,
    spellingPairs: makeSpellingTask,
    unstressedVowels: makeUnstressedVowelTask,
    consonants: makeConsonantTask,
    dictionaryWords: makeDictionaryTask,
    separators: makeSeparatorTask,
    prepositions: makePrepositionTask,
    wordLogic: makeOddWordTask,
    wordGames: makeRussianGameTask,
    wordPuzzles: makeWordPuzzleTask,
    proverbs: makeProverbTask,
    soundLetters: makeSoundLettersTask,
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

  if (task.visual) {
    answerArea.append(renderTaskVisual(task.visual));
  }

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
  const acceptedAnswers = [task.answer, ...(task.acceptedAnswers || [])].map(normalizeAnswer);
  if (!userAnswer) {
    feedbackBox.classList.remove("hidden");
    feedbackBox.textContent = "Сначала напиши ответ, потом проверим.";
    return;
  }

  session.tryCount += 1;
  const correct = acceptedAnswers.includes(userAnswer);
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
  const timeSpentSec = Math.round((Date.now() - session.questionStartedAt) / 1000);
  const speedStatus = getSpeedStatus(task, timeSpentSec, correct);

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
    speedStatus,
    timeSpentSec
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

function exitSession() {
  if (!session) {
    showView("today");
    return;
  }
  const ok = confirm("Вернуться на главную? Уже отвеченные задания сохранятся в прогрессе, а эту тренировку можно будет начать заново.");
  if (!ok) return;
  session = null;
  questPanel.classList.add("hidden");
  finishPanel.classList.add("hidden");
  showView("today");
}

function finishSession() {
  const correct = session.results.filter((item) => item.correct).length;
  const mistakes = session.results.length - correct;
  const minutes = Math.max(1, Math.round((Date.now() - session.startedAt) / 60000));
  const bestSkill = getBestSkill(session.results);
  state.dailySessions.push({
    id: session.id,
    mode: session.mode,
    title: session.title,
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
  const slowCount = session.results.filter((item) => item.speedStatus === "slow").length;
  const fastCount = session.results.filter((item) => item.speedStatus === "fast").length;
  const speedLine = fastCount
    ? ` Ответов, которые уже идут легко: ${fastCount}.`
    : slowCount
      ? " Несколько верных ответов уже получились, теперь будем делать их легче."
      : "";
  finishText.textContent = mistakes
    ? `${POSITIVE_LINES[correct % POSITIVE_LINES.length]} Лучше всего сегодня: ${bestSkill}. ${mistakes} задания вернутся для доброго повторения.${speedLine} ${sample(ACADEMY_JOKES)}`
    : `Все задания получились! ${childName}, сегодня твоя Академия сияет особенно ярко.${speedLine} ${sample(ACADEMY_JOKES)}`;
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
    fast: 0,
    slow: 0,
    totalTime: 0,
    mistakes: 0,
    lastAttempt: ""
  };
  current.attempts += 1;
  current.correct += attempt.correct ? 1 : 0;
  current.streak = attempt.correct ? current.streak + 1 : 0;
  current.hints += attempt.usedHint ? 1 : 0;
  current.fast += attempt.speedStatus === "fast" ? 1 : 0;
  current.slow += attempt.speedStatus === "slow" ? 1 : 0;
  current.totalTime += attempt.timeSpentSec || 0;
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
  const subjectPlan = getWeeklySubjectPlan();

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
      <strong>Маршрут на неделю</strong>
      <p>${formatKidSubjectPlan(subjectPlan)}</p>
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
  const subjectPlan = getWeeklySubjectPlan();
  const skillRows = Object.entries(groupBySkill(weekAttempts))
    .map(([skillId, items]) => {
      const right = items.filter((item) => item.correct).length;
      const hints = items.filter((item) => item.usedHint).length;
      const timed = items.filter((item) => typeof item.timeSpentSec === "number");
      const avgTime = timed.length ? Math.round((timed.reduce((sum, item) => sum + item.timeSpentSec, 0) / timed.length) * 10) / 10 : 0;
      const fast = items.filter((item) => item.speedStatus === "fast").length;
      const slow = items.filter((item) => item.speedStatus === "slow").length;
      return { skillId, total: items.length, correct: right, hints, fast, slow, avgTime, accuracy: Math.round((right / items.length) * 100) };
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
    <div class="stat-card">
      <strong>Баланс недели</strong>
      <p>${formatParentSubjectPlan(subjectPlan)}</p>
    </div>
    <table class="parent-table">
      <thead>
        <tr><th>Навык</th><th>Заданий</th><th>Верно</th><th>С подсказкой</th><th>Легко</th><th>Нужна легкость</th><th>Среднее время</th><th>Точность</th></tr>
      </thead>
      <tbody>
        ${skillRows.map((row) => `
          <tr>
            <td>${formatSkillName(row.skillId)}</td>
            <td>${row.total}</td>
            <td>${row.correct}</td>
            <td>${row.hints}</td>
            <td>${row.fast}</td>
            <td>${row.slow}</td>
            <td>${row.avgTime} сек</td>
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
  const task = inputTask("addSub100", `${a} ${plus ? "+" : "-"} ${b} = ?`, String(answer), plus ? "Складывай десятки и единицы." : "Вычитание можно проверить сложением.");
  task.speedTargetSec = 7;
  return task;
}

function makeFastArithmeticTask(level) {
  if (level === "within10") {
    const plus = Math.random() > 0.45;
    const a = rand(0, 9);
    const b = plus ? rand(0, 10 - a) : rand(0, a);
    const task = inputTask("addSub100", `${a} ${plus ? "+" : "-"} ${b} = ?`, String(plus ? a + b : a - b), "Сначала точно, потом быстрее.");
    task.speedTargetSec = 3;
    return task;
  }

  if (level === "within20") {
    const plus = Math.random() > 0.5;
    const a = rand(4, 19);
    const b = plus ? rand(1, Math.max(1, 20 - a)) : rand(1, a);
    const task = inputTask("addSub100", `${a} ${plus ? "+" : "-"} ${b} = ?`, String(plus ? a + b : a - b), "Держи в голове десяток и единицы.");
    task.speedTargetSec = 4;
    return task;
  }

  if (level === "roundTens") {
    const a = sample([20, 30, 40, 50, 60, 70, 80, 90]);
    const b = rand(1, 9);
    const task = inputTask("addSub100", `${a} - ${b} = ?`, String(a - b), "Разбей десяток: например, 60 - 2 = 58.");
    task.speedTargetSec = 6;
    return task;
  }

  const plus = Math.random() > 0.5;
  const a = rand(20, 89);
  const b = plus ? rand(2, Math.min(10, 99 - a)) : rand(2, Math.min(10, a));
  const task = inputTask("addSub100", `${a} ${plus ? "+" : "-"} ${b} = ?`, String(plus ? a + b : a - b), "Считай спокойно: десятки отдельно, единицы отдельно.");
  task.speedTargetSec = 6;
  return task;
}

function makeMultiplicationTask(variant = "all") {
  const pairs = [];
  for (let a = 2; a <= 9; a += 1) {
    for (let b = 2; b <= 9; b += 1) {
      const fitsProgram = a * b <= 50;
      const fitsVariant = variant === "all" || variant === "hard" || String(a) === String(variant) || String(b) === String(variant);
      const hard = [6, 7, 8, 9].includes(a) || [6, 7, 8, 9].includes(b);
      if (fitsProgram && fitsVariant && (variant !== "hard" || hard)) pairs.push([a, b]);
    }
  }
  const [a, b] = sample(pairs);
  const answer = a * b;
  const task = inputTask("multiplication50", `${a} × ${b} = ?`, String(answer), "Умножение можно представить как несколько одинаковых групп.");
  task.speedTargetSec = 5;
  return task;
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

function makeLifeMathTask() {
  const templates = [
    () => {
      const cut = sample([20, 30, 40]);
      const answer = 100 - cut;
      const task = inputTask(
        "lifeMath",
        `Лента длиной 1 метр. От нее отрезали ${cut} сантиметров. Сколько сантиметров ленты осталось?`,
        String(answer),
        "1 метр - это 100 сантиметров. Вычти отрезанную часть из 100."
      );
      task.visual = { type: "ruler", startCm: 0, endCm: 100, markerCm: answer, label: "1 м = 100 см" };
      return task;
    },
    () => {
      const hour = rand(6, 10);
      const add = rand(1, 3);
      const task = inputTask(
        "lifeMath",
        `На часах ${hour}:00. Через ${add} ${hourWord(add)} начнется кружок. Во сколько начнется кружок?`,
        `${hour + add}:00`,
        `Прибавь ${add} ${hourWord(add)} к ${hour}:00.`
      );
      task.visual = { type: "clock", hour, minute: 0 };
      task.acceptedAnswers = [`${hour + add} часов`, `${hour + add}`];
      return task;
    },
    () => {
      const start = sample(["10:20", "11:30", "15:15", "16:20"]);
      const minutes = sample([10, 15, 25, 30]);
      const answer = addMinutes(start, minutes);
      const task = inputTask(
        "lifeMath",
        `Занятие началось в ${start} и длилось ${minutes} минут. Во сколько оно закончилось?`,
        answer,
        `Прибавь ${minutes} минут к времени начала.`
      );
      task.visual = { type: "clock", time: start };
      task.acceptedAnswers = [answer.replace(":00", " часов")];
      return task;
    },
    () => {
      const money = sample([40, 50, 70, 100]);
      const priceA = sample([12, 18, 25, 32]);
      const priceB = sample([9, 15, 20, 35]);
      const total = priceA + priceB;
      if (total <= money) {
        const task = inputTask(
          "lifeMath",
          `У Кати ${money} рублей. Покупка стоит ${priceA} рублей и ${priceB} рублей. Сколько рублей останется?`,
          String(money - total),
          `Сначала сложи покупки: ${priceA} + ${priceB}, потом вычти из ${money}.`
        );
        task.visual = { type: "coins", money, prices: [priceA, priceB] };
        return task;
      }
      const task = choiceTask(
        "lifeMath",
        `У Кати ${money} рублей. Тетрадь стоит ${priceA} рублей, карандаш ${priceB} рублей. Хватит ли денег на обе покупки?`,
        "нет",
        ["да", "нет"],
        `Покупки вместе стоят ${total} рублей, а это больше ${money}.`
      );
      task.visual = { type: "coins", money, prices: [priceA, priceB] };
      return task;
    },
    () => {
      const sideA = rand(4, 8);
      const sideB = rand(3, 6);
      const task = inputTask(
        "lifeMath",
        `У прямоугольника стороны ${sideA} см и ${sideB} см. Найди периметр.`,
        String((sideA + sideB) * 2),
        `Периметр - это сумма всех сторон: ${sideA} + ${sideB} + ${sideA} + ${sideB}.`
      );
      task.visual = { type: "shape", shape: "rectangle", sideA, sideB };
      return task;
    },
    () => {
      const segments = [rand(2, 5), rand(2, 5), rand(2, 5)];
      const task = inputTask(
        "lifeMath",
        `Ломаная состоит из звеньев ${segments.join(", ")} см. Найди длину ломаной.`,
        String(segments.reduce((sum, item) => sum + item, 0)),
        "Сложи длины всех звеньев ломаной."
      );
      task.visual = { type: "grid", segments };
      return task;
    },
    () => {
      const step = sample([2, 3, 5, 10]);
      const start = sample([1, 2, 5, 10, 12]);
      const row = [start, start + step, start + step * 2, start + step * 3];
      const task = inputTask(
        "lifeMath",
        `Продолжи ряд: ${row.join(", ")}, ...`,
        String(start + step * 4),
        `Каждое следующее число больше на ${step}.`
      );
      task.visual = { type: "pattern", items: row.map(String), missing: "?" };
      return task;
    },
    () => {
      const task = choiceTask(
        "lifeMath",
        "Какая фигура лишняя: круг, квадрат, треугольник, прямоугольник?",
        "круг",
        ["круг", "квадрат", "треугольник", "прямоугольник"],
        "У круга нет углов, а у остальных фигур есть углы."
      );
      task.visual = { type: "shapeSet", shapes: ["circle", "square", "triangle", "rectangle"] };
      return task;
    }
  ];
  const task = sample(templates)();
  task.speedTargetSec = 14;
  return task;
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

function makeDictionaryMissingTask() {
  const items = [
    ["к...рова", "о", ["а", "о", "е", "и"], "Корова - словарное слово, запоминаем букву о."],
    ["с...бака", "о", ["а", "о", "е", "и"], "Собака - словарное слово."],
    ["м...локо", "о", ["а", "о", "е", "и"], "Молоко пишется с буквой о."],
    ["т...традь", "е", ["а", "о", "е", "и"], "Тетрадь - словарное слово, первая гласная е."],
    ["б...реза", "е", ["а", "о", "е", "и"], "Береза - словарное слово, запоминаем е."],
    ["р...бота", "а", ["а", "о", "е", "и"], "Работа пишется с буквой а."],
    ["м...газин", "а", ["а", "о", "е", "и"], "Магазин - словарное слово."]
  ];
  const [word, answer, choices, explanation] = sample(items);
  return choiceTask("dictionaryWords", `Вставь букву: ${word}`, answer, choices, explanation);
}

function makeOddWordTask() {
  const items = [
    ["Кто лишний по смыслу?", "кузнечик", ["сорока", "воробей", "дятел", "кузнечик"], "Кузнечик - насекомое, остальные птицы."],
    ["Кто лишний по смыслу?", "покупатель", ["писатель", "строитель", "водитель", "покупатель"], "Покупатель не профессия в этом ряду."],
    ["Какое слово лишнее?", "молоко", ["карандаш", "тетрадь", "молоко", "пенал"], "Молоко не школьная принадлежность."],
    ["Какое слово лишнее?", "зима", ["утро", "день", "вечер", "зима"], "Зима - время года, остальные части суток."]
  ];
  const [prompt, answer, choices, explanation] = sample(items);
  return choiceTask("wordLogic", prompt, answer, choices, explanation);
}

function makeLetterSwapTask() {
  const items = [
    ["Если в слове мак заменить м на р, какое слово получится?", "рак", ["лак", "рак", "бак"], "Меняем только первую букву."],
    ["Если в слове дом заменить д на с, какое слово получится?", "сом", ["сом", "сон", "сок"], "Получается новое слово: сом."],
    ["Если в слове кот заменить к на р, какое слово получится?", "рот", ["рот", "род", "лот"], "Меняем только первую букву."],
    ["Если в слове лук заменить л на ж, какое слово получится?", "жук", ["жук", "сук", "звук"], "Получается жук."]
  ];
  const [prompt, answer, choices, explanation] = sample(items);
  return choiceTask("wordLogic", prompt, answer, choices, explanation);
}

function makeSoundLettersTask() {
  const items = [
    ["В каком слове звуков больше, чем букв?", "яма", ["кот", "сад", "яма"], "В начале слова я обозначает два звука."],
    ["В каком слове букв больше, чем звуков?", "ель", ["ель", "юла", "моя"], "Мягкий знак звука не обозначает."],
    ["Из чего состоят слова в устной речи?", "из звуков", ["из букв", "из звуков"], "Устную речь мы слышим и произносим."],
    ["Из чего состоят слова в письменной речи?", "из букв", ["из букв", "из звуков"], "Письменную речь мы видим и пишем."]
  ];
  const [prompt, answer, choices, explanation] = sample(items);
  return choiceTask("soundLetters", prompt, answer, choices, explanation);
}

function makeStressTask() {
  const items = [
    ["В каком слове ударение падает на второй слог?", "магазин", ["документ", "алфавит", "дремота", "магазин"], "Ма-га-зин: ударный второй слог."],
    ["Где ударение на последнем слоге?", "алфавит", ["алфавит", "дремота", "яблоко"], "Алфавит - ударение на последний слог."],
    ["Где ударение на первом слоге?", "яблоко", ["магазин", "яблоко", "документ"], "Яблоко - ударение на первый слог."]
  ];
  const [prompt, answer, choices, explanation] = sample(items);
  return choiceTask("soundLetters", prompt, answer, choices, explanation);
}

function makeMiniRebusTask() {
  const items = [
    ["Мини-ребус: теле + фон. Какое слово спряталось?", "телефон", ["телефон", "телеграф", "фонарь"], "Соедини части слова: теле + фон."],
    ["Мини-ребус: само + лет. Какое слово получилось?", "самолет", ["самолет", "самокат", "летчик"], "Две части вместе дают слово самолет."],
    ["Мини-ребус: пар + ход. Какое слово получилось?", "пароход", ["пароход", "паровоз", "поход"], "Пар + ход превращаются в пароход."]
  ];
  const [prompt, answer, choices, explanation] = sample(items);
  return choiceTask("wordLogic", prompt, answer, choices, explanation);
}

function makeBuildWordTask() {
  const items = [
    ["Собери слово из букв: О, С, Н", "сон", ["нос", "сон", "сено"], "Из этих букв можно собрать слово сон."],
    ["Собери слово из букв: К, О, Т", "кот", ["кит", "кот", "ток"], "Кот - предметное слово из данных букв."],
    ["Собери слово из букв: Л, Е, С", "лес", ["лес", "сел", "слон"], "Лес - слово из трех данных букв."],
    ["Собери слово из букв: Р, А, К", "рак", ["рак", "рука", "карта"], "Берем только данные буквы."]
  ];
  const [prompt, answer, choices, explanation] = sample(items);
  return choiceTask("wordLogic", prompt, answer, choices, explanation);
}

function makeRussianGameTask() {
  return sample([
    makeLostLetterTask,
    makeFixNoteTask,
    makeChooseRuleTask,
    makeBuildSentenceGameTask,
    makeOddRuleWordTask,
    makeBuildWordGameTask
  ])();
}

function makeLostLetterTask() {
  const items = [
    ["словарные слова", "к_рандаш", "а", ["а", "о", "е"], "карандаш", "В слове карандаш две буквы а."],
    ["жи-ши", "маш_на", "и", ["и", "ы", "е"], "машина", "Жи-ши пиши с буквой и."],
    ["парная согласная", "гри_", "б", ["б", "п"], "гриб", "Проверь словом грибы."],
    ["разделительный мягкий знак", "сем_я", "ь", ["ь", "ъ", "-"], "семья", "Здесь нужен разделительный мягкий знак."],
    ["ча-ща", "ч_шка", "а", ["а", "я", "е"], "чашка", "Ча-ща пиши с буквой а."],
    ["чу-щу", "щ_ка", "у", ["у", "ю", "а"], "щука", "Чу-щу пиши с буквой у."]
  ];
  const [topic, word, answer, choices, fullWord, hint] = sample(items);
  return choiceTask("wordGames", `Слово потеряло букву. Верни ее на место: ${word}`, answer, choices, `${hint} Получится слово: ${fullWord}.`);
}

function makeFixNoteTask() {
  const items = [
    ["маша идет в школу.", "Маша идет в школу.", "Имя и начало предложения пишутся с большой буквы."],
    ["Книга лежит настоле.", "Книга лежит на столе.", "Предлог на пишется отдельно."],
    ["У Машы новая тетрадь.", "У Маши новая тетрадь.", "Ши пишется с и."],
    ["Я пью малако.", "Я пью молоко.", "Молоко - словарное слово, запомни две буквы о."],
    ["утром светит солнце", "Утром светит солнце.", "Предложение начинается с большой буквы и заканчивается точкой."]
  ];
  const [note, answer, explanation] = sample(items);
  const task = choiceTask("wordGames", `Исправь записку: ${note}`, answer, shuffle([answer, note, answer.replace(".", "!")]), explanation);
  task.acceptedAnswers = [answer.replace(".", "")];
  return task;
}

function makeChooseRuleTask() {
  const items = [
    ["машина", "жи-ши", ["жи-ши", "ча-ща", "чу-щу"], "В слове есть сочетание ши."],
    ["чашка", "ча-ща", ["жи-ши", "ча-ща", "разделительный мягкий знак"], "В слове есть сочетание ча."],
    ["семья", "разделительный мягкий знак", ["разделительный мягкий знак", "парная согласная", "безударная гласная"], "Мягкий знак стоит перед я и разделяет звуки."],
    ["гриб", "парная согласная", ["парная согласная", "ча-ща", "предлог"], "На конце слышится п, но пишется б. Проверка: грибы."],
    ["на столе", "предлог", ["предлог", "словарное слово", "жи-ши"], "На - отдельное маленькое слово."]
  ];
  const [word, answer, choices, explanation] = sample(items);
  return choiceTask("wordGames", `Выбери улику. Какое правило спряталось в записи: ${word}?`, answer, choices, explanation);
}

function makeBuildSentenceGameTask() {
  const items = [
    ["Маша, книгу, читает", "Маша читает книгу.", ["Маша читает книгу.", "Книгу Маша читает?", "Читает Маша книгу"], "Сначала кто?, потом что делает?"],
    ["светит, ярко, солнце", "Солнце светит ярко.", ["Солнце светит ярко.", "Ярко солнце.", "Светит солнце ярко?"], "Найди, о чем говорится в предложении."],
    ["в, дети, играют, парке", "Дети играют в парке.", ["Дети играют в парке.", "В дети играют парке.", "Парке дети в играют."], "Предлог в пишется отдельно."],
    ["где, твой, пенал", "Где твой пенал?", ["Где твой пенал?", "Твой где пенал.", "Где твой пенал!"], "Это вопрос, в конце нужен вопросительный знак."]
  ];
  const [words, answer, choices, explanation] = sample(items);
  return choiceTask("wordGames", `Собери предложение из слов: ${words}`, answer, choices, explanation);
}

function makeOddRuleWordTask() {
  const items = [
    ["кот, стол, веселый, дом", "веселый", "Веселый - признак предмета, остальные слова называют предметы."],
    ["машина, шишка, жираф, чашка", "чашка", "В слове чашка правило ча-ща, а в остальных жи-ши."],
    ["молоко, сахар, собака, морковь", "собака", "Собака - животное, остальные слова связаны с едой."],
    ["бежит, пишет, зеленый, читает", "зеленый", "Зеленый отвечает на вопрос какой?, остальные слова обозначают действия."],
    ["Москва, Маша, Волга, карандаш", "карандаш", "Карандаш не имя собственное, пишется с маленькой буквы."]
  ];
  const [words, answer, explanation] = sample(items);
  return choiceTask("wordGames", `Найди лишнее слово: ${words}`, answer, words.split(", "), explanation);
}

function makeBuildWordGameTask() {
  const items = [
    [["о", "б", "а", "к", "а", "с"], "собака", "Это домашнее животное."],
    [["о", "л", "о", "м", "к", "о"], "молоко", "Белый напиток, словарное слово."],
    [["т", "е", "т", "р", "а", "д", "ь"], "тетрадь", "В ней пишут на уроке."],
    [["б", "е", "р", "ё", "з", "а"], "берёза", "Дерево с белым стволом."],
    [["с", "п", "а", "с", "и", "б", "о"], "спасибо", "Вежливое слово."]
  ];
  const [letters, answer, explanation] = sample(items);
  const task = inputTask("wordGames", `Собери слово из букв: ${letters.join(", ")}`, answer, explanation);
  task.visual = { type: "letterCircle", letters };
  return task;
}

function makeWordPuzzleTask() {
  return sample([makeMiniCrosswordTask, makeLetterCircleTask, makeWordSearchTask])();
}

function makeMiniCrosswordTask() {
  const items = [
    ["школа", "в нем лежат ручки и карандаши", "пенал", 5],
    ["школа", "комната, где проходят уроки", "класс", 5],
    ["школа", "в ней пишут на уроке", "тетрадь", 7],
    ["школа", "ребенок, который учится в школе", "ученик", 6],
    ["школа", "им пишут или рисуют", "карандаш", 8],
    ["природа", "дерево с белым стволом", "берёза", 6],
    ["природа", "он дует на улице", "ветер", 5],
    ["еда и быт", "белый напиток", "молоко", 6],
    ["еда и быт", "овощ для супа, оранжевый", "морковь", 7],
    ["город", "место, куда приходят поезда", "вокзал", 6]
  ];
  const [topic, clue, answer, length] = sample(items);
  const task = inputTask("wordPuzzles", `Кроссворд-карточка (${topic}). Подсказка: ${clue}. Слово из ${length} букв.`, answer, "Вспомни слово по смыслу и проверь количество букв.");
  task.visual = { type: "pattern", items: Array.from({ length }, () => "□"), missing: "" };
  return task;
}

function makeLetterCircleTask() {
  const items = [
    [["с", "о", "б", "а", "к", "а"], ["сок", "бак", "бок", "коса", "бока", "собака"], "собака"],
    [["м", "о", "л", "о", "к", "о"], ["лом", "кол", "мол", "молоко"], "молоко"],
    [["п", "е", "н", "а", "л"], ["пена", "пенал"], "пенал"],
    [["к", "о", "т", "р", "а"], ["кот", "рот", "ток", "крот", "кора"], "крот"]
  ];
  const [letters, answers, mainAnswer] = sample(items);
  const task = inputTask("wordPuzzles", `Буквенный круг. Составь любое подходящее слово из букв: ${letters.join(", ")}`, mainAnswer, `Можно составить: ${answers.join(", ")}.`);
  task.acceptedAnswers = answers;
  task.visual = { type: "letterCircle", letters };
  return task;
}

function makeWordSearchTask() {
  const puzzles = [
    {
      topic: "школа",
      words: ["пенал", "класс", "урок"],
      grid: ["пенал", "класс", "урока", "машат", "домик"]
    },
    {
      topic: "природа",
      words: ["заяц", "лес", "роза", "ветер"],
      grid: ["заяцк", "лесом", "розап", "ветер", "котик"]
    }
  ];
  const puzzle = sample(puzzles);
  const answer = sample(puzzle.words);
  const task = inputTask("wordPuzzles", `Найди в клетках слово из темы "${puzzle.topic}" и напиши его.`, answer, `В этом поле спрятаны слова: ${puzzle.words.join(", ")}.`);
  task.acceptedAnswers = puzzle.words;
  task.visual = { type: "wordGrid", grid: puzzle.grid };
  return task;
}

function makeProverbTask() {
  const proverbs = [
    {
      text: "Без труда не вытащишь и рыбку из пруда.",
      start: "Без труда не вытащишь...",
      ending: "и рыбку из пруда",
      meaning: "чтобы получить результат, нужно постараться",
      situation: "Петя не хотел тренироваться писать словарные слова и сделал много ошибок."
    },
    {
      text: "Делу время, потехе час.",
      start: "Делу время...",
      ending: "потехе час",
      meaning: "сначала важные дела, потом отдых",
      situation: "Катя сначала сделала задания, а потом спокойно пошла гулять."
    },
    {
      text: "Повторенье - мать ученья.",
      start: "Повторенье...",
      ending: "мать ученья",
      meaning: "чтобы хорошо запомнить, нужно повторять",
      situation: "Оля несколько раз повторила правило и решила упражнения без ошибок."
    },
    {
      text: "Друг познаётся в беде.",
      start: "Друг познаётся...",
      ending: "в беде",
      meaning: "настоящий друг помогает, когда трудно",
      situation: "У Максима сломался карандаш, и друг сразу поделился своим."
    },
    {
      text: "Семь раз отмерь, один раз отрежь.",
      start: "Семь раз отмерь...",
      ending: "один раз отрежь",
      meaning: "перед важным делом нужно хорошо подумать",
      situation: "Игорь сначала проверил детали для поделки, а потом начал клеить."
    },
    {
      text: "Чужого не бери, своего не теряй.",
      start: "Чужого не бери...",
      ending: "своего не теряй",
      meaning: "нельзя брать чужое, а за своими вещами нужно следить",
      situation: "Маша нашла чужую заколку и отнесла ее учителю."
    }
  ];
  const item = sample(proverbs);
  const format = sample(["finish", "meaning", "situation"]);
  if (format === "finish") {
    const choices = shuffle([item.ending, "а дома лучше", "один раз отрежь"]);
    return choiceTask("proverbs", `Закончи пословицу: ${item.start}`, item.ending, choices, `Полностью: ${item.text}`);
  }
  if (format === "meaning") {
    const choices = shuffle([item.meaning, "нужно делать все очень быстро", "красивая вещь всегда важнее поступка"]);
    return choiceTask("proverbs", `Что значит пословица: "${item.text}"?`, item.meaning, choices, "Пословица говорит не только о словах, а о жизненной ситуации.");
  }
  const choices = shuffle([item.text, "В гостях хорошо, а дома лучше.", "Лучше поздно, чем никогда."]);
  return choiceTask("proverbs", `Какая пословица подходит к ситуации? ${item.situation}`, item.text, choices, `Подходит: ${item.text}`);
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
      tasks: [
        ["Что помогло ростку вырасти?", "уход Маши", ["уход Маши", "сильный ветер", "новая тетрадь"]],
        ["Что произошло сначала?", "Маша посадила фасоль", ["появился лист", "Маша посадила фасоль", "она забыла про росток"]],
        ["Какой заголовок подойдет?", "Фасоль у окна", ["Фасоль у окна", "Потерянная тетрадь", "Ветер в классе"]]
      ]
    },
    {
      text: "Петя увидел на дорожке маленького жука. Он не стал трогать его руками, а аккуратно обошел стороной.",
      tasks: [
        ["Какой поступок совершил Петя?", "бережный", ["бережный", "жадный", "невнимательный"]],
        ["Почему Петя обошел жука стороной?", "чтобы не навредить", ["чтобы не навредить", "чтобы быстрее добежать", "чтобы спрятать жука"]],
        ["Какая главная мысль?", "маленьких существ нужно беречь", ["маленьких существ нужно беречь", "жуков нужно ловить", "дорожки бывают длинными"]]
      ]
    },
    {
      text: "Летом ребята устроили библиотеку во дворе. Каждый принес книгу, а потом они обменивались историями и советовали друг другу самое интересное.",
      tasks: [
        ["Какая главная мысль текста?", "книгами интересно делиться", ["книгами интересно делиться", "летом нельзя читать", "книги нужно прятать"]],
        ["Что сделали ребята сначала?", "устроили библиотеку", ["устроили библиотеку", "потеряли книги", "закрыли двор"]],
        ["Что помогло ребятам выбрать новые истории?", "советы друг друга", ["советы друг друга", "дождь", "спор"]]
      ]
    },
    {
      text: "Утром Катя нашла на столе записку: «Полей цветы, пожалуйста». Она налила воду в маленькую лейку и заметила, что фиалка подняла листочки.",
      tasks: [
        ["Что попросили сделать в записке?", "полить цветы", ["полить цветы", "убрать книги", "нарисовать фиалку"]],
        ["Какой предмет помог Кате?", "лейка", ["линейка", "лейка", "фонарик"]],
        ["Как можно назвать этот текст?", "Забота о цветах", ["Забота о цветах", "Ночная прогулка", "Секретный звонок"]]
      ]
    },
    {
      text: "На перемене Дима хотел первым взять мяч, но увидел, что Лена грустит у скамейки. Он позвал ее играть вместе, и команда стала веселее.",
      tasks: [
        ["Почему команда стала веселее?", "Дима позвал Лену играть", ["Дима позвал Лену играть", "мяч укатился", "перемена закончилась"]],
        ["Какой Дима в этом тексте?", "внимательный", ["внимательный", "равнодушный", "сердитый"]],
        ["Какая главная мысль?", "важно замечать чувства других", ["важно замечать чувства других", "мяч всегда главный", "на перемене нельзя играть"]]
      ]
    }
  ];
  const item = sample(texts);
  const [question, answer, choices] = sample(item.tasks);
  return choiceTask("readingMeaning", `${item.text} ${question}`, answer, choices, "Найди ответ в смысле текста, а не только в одном слове.");
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

function renderTaskVisual(visual) {
  const container = document.createElement("div");
  container.className = `task-visual task-visual--${visual.type}`;

  if (visual.type === "clock") {
    const time = visual.time || `${visual.hour}:00`;
    const [hourRaw, minuteRaw = "0"] = String(time).split(":");
    const hour = Number(visual.hour ?? hourRaw);
    const minute = Number(visual.minute ?? minuteRaw);
    const hourAngle = ((hour % 12) + minute / 60) * 30;
    const minuteAngle = minute * 6;
    container.innerHTML = `
      <div class="clock-face" aria-label="Часы показывают ${formatTime(hour, minute)}">
        ${Array.from({ length: 12 }, (_, index) => `<span style="--i:${index + 1}">${index + 1}</span>`).join("")}
        <i class="clock-hand clock-hand--hour" style="transform:rotate(${hourAngle}deg)"></i>
        <i class="clock-hand clock-hand--minute" style="transform:rotate(${minuteAngle}deg)"></i>
        <b></b>
      </div>
      <strong>${formatTime(hour, minute)}</strong>
    `;
    return container;
  }

  if (visual.type === "ruler") {
    const max = visual.endCm > 20 ? 10 : Math.max(10, visual.endCm || 10);
    container.innerHTML = `
      <div class="ruler-visual" aria-label="Линейка">
        ${Array.from({ length: max + 1 }, (_, index) => `<span class="${index % 5 === 0 ? "major" : ""}"><b>${index}</b></span>`).join("")}
      </div>
      <strong>${visual.label || "Сантиметры на линейке"}</strong>
    `;
    return container;
  }

  if (visual.type === "coins") {
    const coins = visual.coins || makeCoinSet(visual.money || 0);
    const priceLine = visual.prices ? `Покупки: ${visual.prices.join(" + ")} руб.` : visual.price ? `Цена: ${visual.price} руб.` : "";
    container.innerHTML = `
      <div class="coin-row">
        ${coins.map((coin) => `<span class="coin">${coin}₽</span>`).join("")}
      </div>
      <strong>${visual.money ? `Всего: ${visual.money} руб.` : ""} ${priceLine}</strong>
    `;
    return container;
  }

  if (visual.type === "shape") {
    container.innerHTML = renderShapeSvg(visual.shape || "rectangle", visual);
    return container;
  }

  if (visual.type === "shapeSet") {
    container.innerHTML = `<div class="shape-set">${visual.shapes.map((shape) => renderShapeSvg(shape, { compact: true })).join("")}</div>`;
    return container;
  }

  if (visual.type === "grid") {
    const labels = visual.segments || [];
    container.innerHTML = `
      <div class="grid-visual" aria-label="Клетчатое поле">
        ${Array.from({ length: 25 }, (_, index) => `<span>${labels[index] || ""}</span>`).join("")}
      </div>
      <strong>${labels.length ? `Звенья: ${labels.join(" + ")}` : "Маршрут по клеткам"}</strong>
    `;
    return container;
  }

  if (visual.type === "pattern") {
    container.innerHTML = `
      <div class="pattern-row">
        ${visual.items.map((item) => `<span>${item}</span>`).join("")}
        <span>${visual.missing || "?"}</span>
      </div>
    `;
    return container;
  }

  if (visual.type === "letterCircle") {
    container.innerHTML = `
      <div class="letter-circle" aria-label="Буквенный круг">
        ${visual.letters.map((letter, index) => `<span style="--i:${index}; --n:${visual.letters.length}">${letter}</span>`).join("")}
      </div>
    `;
    return container;
  }

  if (visual.type === "wordGrid") {
    const cells = visual.grid.join("").split("");
    container.innerHTML = `
      <div class="word-grid" aria-label="Поле букв">
        ${cells.map((letter) => `<span>${letter}</span>`).join("")}
      </div>
    `;
    return container;
  }

  return container;
}

function renderShapeSvg(shape, data = {}) {
  const caption = data.sideA && data.sideB ? `${data.sideA} см × ${data.sideB} см` : "";
  const sizeClass = data.compact ? "shape-svg shape-svg--compact" : "shape-svg";
  const shapes = {
    rectangle: `<rect x="22" y="34" width="116" height="70" rx="4"></rect>`,
    square: `<rect x="40" y="26" width="88" height="88" rx="4"></rect>`,
    triangle: `<polygon points="80,22 136,116 24,116"></polygon>`,
    circle: `<circle cx="80" cy="72" r="48"></circle>`
  };
  return `
    <div>
      <svg class="${sizeClass}" viewBox="0 0 160 140" role="img" aria-label="${shape}">
        ${shapes[shape] || shapes.rectangle}
      </svg>
      ${caption ? `<strong>${caption}</strong>` : ""}
    </div>
  `;
}

function makeCoinSet(amount) {
  const coins = [];
  let rest = amount;
  [50, 10, 5, 1].forEach((coin) => {
    while (rest >= coin && coins.length < 8) {
      coins.push(coin);
      rest -= coin;
    }
  });
  return coins;
}

function formatTime(hour, minute) {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function addMinutes(time, minutes) {
  const [hours, mins] = time.split(":").map(Number);
  const total = hours * 60 + mins + minutes;
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

function hourWord(value) {
  if (value === 1) return "час";
  if (value >= 2 && value <= 4) return "часа";
  return "часов";
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

function getWeeklySubjectPlan() {
  const dayBalance = getSubjectDayBalance(7);
  return Object.entries(WEEKLY_SUBJECT_GOALS).map(([subject, goal]) => ({
    subject,
    goal,
    days: dayBalance[subject] || 0,
    left: Math.max(0, goal - (dayBalance[subject] || 0))
  }));
}

function formatKidSubjectPlan(plan) {
  const ready = plan.filter((item) => item.left === 0).map((item) => SUBJECTS[item.subject].label);
  const next = plan.filter((item) => item.left > 0).sort((a, b) => b.left - a.left)[0];
  if (!next) return "Все главные острова недели уже получили внимание. Можно выбрать любимый тренажер.";
  const readyLine = ready.length ? `Уже бодро: ${ready.join(", ")}. ` : "";
  return `${readyLine}Следующий маленький шаг: ${SUBJECTS[next.subject].label}, еще ${next.left} ${dayWord(next.left)} внимания на этой неделе.`;
}

function formatParentSubjectPlan(plan) {
  return plan
    .map((item) => {
      const subject = SUBJECTS[item.subject].label;
      if (item.left === 0) return `${subject}: план закрыт (${item.days}/${item.goal} дней)`;
      return `${subject}: желательно еще ${item.left} ${dayWord(item.left)} (${item.days}/${item.goal})`;
    })
    .join(". ");
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
  const slow = rows.filter((row) => row.total >= 2 && row.slow > 0).sort((a, b) => b.slow - a.slow).slice(0, 2);
  if (weak.length) {
    return `На следующей неделе добавить мягкое повторение: ${weak.map((row) => formatSkillName(row.skillId)).join(", ")}. Оптимально 2-3 задания по каждой теме в день.`;
  }
  if (slow.length) {
    return `Точность хорошая. Для автоматизации стоит спокойно повторить до легкости: ${slow.map((row) => formatSkillName(row.skillId)).join(", ")}.`;
  }
  return "Сохранить короткий ежедневный формат: 10-12 минут, смешанные задания, немного повторения и игровые задания.";
}

function getSpeedStatus(task, seconds, correct) {
  if (!correct) return "mistake";
  const target = task.speedTargetSec || getDefaultSpeedTarget(task.skillId);
  if (!target) return "steady";
  if (seconds <= target) return "fast";
  if (seconds <= target * 1.7) return "steady";
  return "slow";
}

function getDefaultSpeedTarget(skillId) {
  const targets = {
    addSub100: 7,
    multiplication50: 5,
    division50: 6,
    numbers100: 5,
    measures: 8,
    lifeMath: 14,
    orderActions: 8
  };
  return targets[skillId] || 0;
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
