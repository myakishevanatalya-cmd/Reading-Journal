const books = [
  { id: 1, author: "А. Пушкин", title: "Сказка о мертвой царевне и семи богатырях", station_theme: "Остров Лукоморье" },
  { id: 2, author: "М. Лермонтов", title: "Ашик-Кериб", station_theme: "Восточный экспресс" },
  { id: 3, author: "П. Ершов", title: "Конёк-Горбунок", station_theme: "За горами, за лесами" },
  { id: 4, author: "И. Крылов", title: "Волк и журавль; Квартет", station_theme: "Поляна басен" },
  { id: 5, author: "В. Одоевский", title: "Городок в табакерке", station_theme: "Механический замок" },
  { id: 6, author: "А. Чехов", title: "Мальчики", station_theme: "Таинственная Америка" },
  { id: 7, author: "В. Гаршин", title: "Сказка о жабе и розе", station_theme: "Заброшенный сад" },
  { id: 8, author: "С. Аксаков", title: "Аленький цветочек", station_theme: "Дворец чудовища" },
  { id: 9, author: "Л. Андреев", title: "Кусака", station_theme: "Уютная дача" },
  { id: 10, author: "П. Бажов", title: "Серебряное копытце", station_theme: "Уральские сказы (Часть 1)" },
  { id: 11, author: "Е. Шварц", title: "Сказка о потерянном времени", station_theme: "Город потерянных минут" },
  { id: 12, author: "Н. Носов", title: "Приключения Незнайки и его друзей", station_theme: "Цветочный город" },
  { id: 13, author: "В. Драгунский", title: "Главные реки; Что любит Мишка", station_theme: "Денискин двор" },
  { id: 14, author: "Б. Житков", title: "Как я ловил человечков", station_theme: "Кораблик на полке" },
  { id: 15, author: "К. Паустовский", title: "Корзина с еловыми шишками; Дремучий медведь", station_theme: "Музыкальный лес" },
  { id: 16, author: "М. Зощенко", title: "Ёлка", station_theme: "Праздничная комната" },
  { id: 17, author: "В. Бианки", title: "Оранжевое горлышко", station_theme: "Птичье поле" },
  { id: 18, author: "Мамин-Сибиряк", title: "Приёмыш", station_theme: "Светлое озеро" },
  { id: 19, author: "А. Куприн", title: "Барбос и Жулька", station_theme: "Старый двор" },
  { id: 20, author: "В. Астафьев", title: "Стрижонок Скрип", station_theme: "Глиняный берег" },
  { id: 21, author: "Е. Велтисов", title: "Приключения Электроника", station_theme: "Кибергород" },
  { id: 22, author: "К. Булычёв", title: "Путешествия Алисы", station_theme: "Планета Трех Капитанов" },
  { id: 23, author: "Д. Свифт", title: "Путешествия Гулливера", station_theme: "Лилипутия" },
  { id: 24, author: "Г. Х. Андерсен", title: "Русалочка", station_theme: "Подводное царство" },
  { id: 25, author: "М. Твен", title: "Приключения Тома Сойера", station_theme: "Миссисипи" },
  { id: 26, author: "Ф. Баум", title: "Страна Оз", station_theme: "Изумрудный город" },
  { id: 27, author: "Д. Барри", title: "Питер Пен", station_theme: "Нетландия" },
  { id: 28, author: "А. Линдгрен", title: "Малыш и Карлсон", station_theme: "Стокгольмская крыша" },
  { id: 29, author: "Р. Брэдбери", title: "Все лето в один день", station_theme: "Дождливая Венера" },
  { id: 30, author: "Т. Янссон", title: "Сказки про Муми-тролля", station_theme: "Муми-долен" },
  { id: 31, author: "А. Сент-Экзюпери", title: "Маленький принц", station_theme: "Астероид Б-612" },
  { id: 32, author: "А. Толстой", title: "Золотой ключик, или приключения Буратино", station_theme: "Поле чудес" }
];

const moods = [
  { id: "fun", label: "Весело", icon: "😃" },
  { id: "sad", label: "Грустно", icon: "😢" },
  { id: "scary", label: "Страшно", icon: "😨" },
  { id: "curious", label: "Интересно", icon: "🤔" }
];

const stationIcons = ["🏝️", "🚂", "🐴", "🎻", "⚙️", "🧭", "🌹", "🏰", "🏡", "⛰️", "⏰", "🌼", "🏀", "⛵", "🎵", "🎄", "🐦", "🌊", "🐾", "🪶", "🤖", "🚀", "🔎", "🐚", "🎨", "💚", "🧚", "🏠", "☔", "🌿", "🪐", "🔑"];
const medalTargets = [5, 10, 20];
// Paste your deployed Google Apps Script Web App URL here to sync progress across devices.
// Keep empty to use local browser storage only.
const CLOUD_API_URL = "https://script.google.com/macros/s/AKfycbzbEm6fh42d1PXrph11jkPi0YT5d6cMCHN_R55oy4pHqhDHS05eG_12n7DDZ3csOC9t/exec";
const childId = getChildId();
const childName = getChildName();
const storageKey = `summer-reading-map:${childId}`;

const praiseMessages = [
  "умничка! Ты сделала еще один книжный шаг. Так держать!",
  "здорово справилась! Каждая книга делает твою карту ярче.",
  "молодец! Ты не просто прочитала, ты добавила в маршрут новую победу.",
  "отличная работа! У тебя уже получается настоящий читательский дневник.",
  "супер! Еще одна история теперь живет в твоей коллекции."
];

let state = loadState();
let activeBookId = null;
let activeQuestionBookId = null;
let activeQuestions = [];
let activeQuestionAnswers = [];
let activeQuestionIndex = 0;
let selectedMood = moods[0].id;
let selectedRating = 5;
let shelfFilter = "todo";

const els = {
  progressText: document.querySelector("#progressText"),
  currentHint: document.querySelector("#currentHint"),
  questCard: document.querySelector("#questCard"),
  questTitle: document.querySelector("#questTitle"),
  questMeta: document.querySelector("#questMeta"),
  openRecommendedBtn: document.querySelector("#openRecommendedBtn"),
  progressFill: document.querySelector("#progressFill"),
  medals: document.querySelector("#medals"),
  mapRoute: document.querySelector("#mapRoute"),
  bookGrid: document.querySelector("#bookGrid"),
  heroGrid: document.querySelector("#heroGrid"),
  heroesCount: document.querySelector("#heroesCount"),
  progressDashboard: document.querySelector("#progressDashboard"),
  progressBadge: document.querySelector("#progressBadge"),
  analytics: document.querySelector("#analytics"),
  diaryModal: document.querySelector("#diaryModal"),
  diaryForm: document.querySelector("#diaryForm"),
  modalTheme: document.querySelector("#modalTheme"),
  modalTitle: document.querySelector("#modalTitle"),
  modalAuthor: document.querySelector("#modalAuthor"),
  heroInput: document.querySelector("#heroInput"),
  likedInput: document.querySelector("#likedInput"),
  moodOptions: document.querySelector("#moodOptions"),
  stars: document.querySelector("#stars"),
  openQuestionsBtn: document.querySelector("#openQuestionsBtn"),
  undoDoneBtn: document.querySelector("#undoDoneBtn"),
  celebrationModal: document.querySelector("#celebrationModal"),
  celebrationTitle: document.querySelector("#celebrationTitle"),
  celebrationText: document.querySelector("#celebrationText"),
  questCounter: document.querySelector("#questCounter"),
  questQuestionText: document.querySelector("#questQuestionText"),
  questAnswerInput: document.querySelector("#questAnswerInput"),
  prevQuestionBtn: document.querySelector("#prevQuestionBtn"),
  nextQuestionBtn: document.querySelector("#nextQuestionBtn"),
  resetModal: document.querySelector("#resetModal")
};

init();

function init() {
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => showScreen(button.dataset.screen));
  });

  document.querySelector("#parentShortcut").addEventListener("click", () => showScreen("parentScreen"));
  document.querySelector("#backToMapBtn").addEventListener("click", () => showScreen("mapScreen"));
  document.querySelector("#openRecommendedBtn").addEventListener("click", openRecommendedBook);
  document.querySelector("#closeModal").addEventListener("click", () => els.diaryModal.close());
  document.querySelector("#openQuestionsBtn").addEventListener("click", () => openQuestions(activeBookId));
  document.querySelector("#undoDoneBtn").addEventListener("click", undoDone);
  document.querySelector("#exportBtn").addEventListener("click", exportProgress);
  document.querySelector("#importBtn").addEventListener("click", () => document.querySelector("#importInput").click());
  document.querySelector("#importInput").addEventListener("change", importProgress);
  document.querySelector("#resetBtn").addEventListener("click", resetProgress);
  document.querySelector("#cancelResetBtn").addEventListener("click", () => els.resetModal.close());
  document.querySelector("#confirmResetBtn").addEventListener("click", confirmResetProgress);
  document.querySelector("#closeCelebrationBtn").addEventListener("click", () => {
    saveCurrentQuestionAnswer();
    persistQuestionAnswers();
    els.celebrationModal.close();
    showScreen("mapScreen");
  });
  document.querySelector("#heroesCelebrationBtn").addEventListener("click", () => {
    saveCurrentQuestionAnswer();
    persistQuestionAnswers();
    els.celebrationModal.close();
    showScreen("heroesScreen");
  });
  els.celebrationModal.addEventListener("close", () => {
    saveCurrentQuestionAnswer();
    persistQuestionAnswers();
  });
  document.querySelector("#prevQuestionBtn").addEventListener("click", () => changeQuestion(-1));
  document.querySelector("#nextQuestionBtn").addEventListener("click", handleNextQuestion);

  document.querySelectorAll(".segment").forEach((button) => {
    button.addEventListener("click", () => {
      shelfFilter = button.dataset.filter;
      document.querySelectorAll(".segment").forEach((item) => item.classList.toggle("is-active", item === button));
      renderShelf();
    });
  });

  els.diaryForm.addEventListener("submit", saveDiary);
  renderMoodOptions();
  renderStars();
  renderAll();
  syncFromCloud();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
}

function getChildId() {
  const url = new URL(window.location.href);
  const childFromQuery = url.searchParams.get("child");
  const pathToken = url.pathname.split("/").filter(Boolean).at(-1);
  const cleanPathToken = pathToken && !pathToken.includes(".") ? pathToken : "";
  return childFromQuery || cleanPathToken || "demo-child";
}

function getChildName() {
  const url = new URL(window.location.href);
  return url.searchParams.get("name") || "Катя";
}

function loadState() {
  const fallback = { entries: {} };
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    return { entries: saved?.entries || {} };
  } catch {
    return fallback;
  }
}

function persistState() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    window.alert("Не удалось сохранить прогресс в браузере. Проверьте, не включен ли приватный режим.");
  }
  syncToCloud();
}

function isCloudEnabled() {
  return CLOUD_API_URL.trim().length > 0;
}

async function syncFromCloud() {
  if (!isCloudEnabled()) return;

  try {
    const payload = await loadJsonp(buildCloudUrl({
      child: childId
    }));
    if (!payload.ok) throw new Error(payload.error || "Cloud sync failed");

    const cloudEntries = normalizeEntries(payload.entries || {});
    const hasCloudEntries = Object.keys(cloudEntries).length > 0;
    const hasLocalEntries = Object.keys(state.entries || {}).length > 0;

    if (!hasCloudEntries && hasLocalEntries) {
      syncToCloud();
      return;
    }

    state = { entries: cloudEntries };
    localStorage.setItem(storageKey, JSON.stringify(state));
    renderAll();
  } catch (error) {
    console.warn("Cloud load failed", error);
  }
}

function buildCloudUrl(params) {
  const url = new URL(CLOUD_API_URL);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return url.toString();
}

function loadJsonp(url) {
  return new Promise((resolve, reject) => {
    const callbackName = `readingMapCallback_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement("script");
    const jsonpUrl = new URL(url);
    jsonpUrl.searchParams.set("callback", callbackName);

    window[callbackName] = (payload) => {
      delete window[callbackName];
      script.remove();
      resolve(payload);
    };

    script.onerror = () => {
      delete window[callbackName];
      script.remove();
      reject(new Error("Cloud JSONP load failed"));
    };

    script.src = jsonpUrl.toString();
    document.head.append(script);
  });
}

function syncToCloud() {
  if (!isCloudEnabled()) return;

  fetch(CLOUD_API_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      action: "save_all",
      childToken: childId,
      entries: state.entries
    })
  }).catch((error) => console.warn("Cloud save failed", error));
}

function syncResetCloud() {
  if (!isCloudEnabled()) return;

  fetch(CLOUD_API_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      action: "reset",
      childToken: childId
    })
  }).catch((error) => console.warn("Cloud reset failed", error));
}

function normalizeEntries(entries) {
  const normalized = {};
  const knownBookIds = new Set(books.map((book) => String(book.id)));

  Object.entries(entries || {}).forEach(([bookId, entry]) => {
    if (!knownBookIds.has(String(bookId)) || !entry || typeof entry !== "object") return;
    normalized[bookId] = {
      done: Boolean(entry.done),
      hero: String(entry.hero || "").slice(0, 60),
      liked: String(entry.liked || "").slice(0, 360),
      mood: moods.some((mood) => mood.id === entry.mood) ? entry.mood : moods[0].id,
      rating: Math.min(5, Math.max(1, Number(entry.rating) || 5)),
      questionAnswers: Array.isArray(entry.questionAnswers) ? entry.questionAnswers.map((answer) => String(answer || "").slice(0, 360)) : [],
      finishedAt: entry.finishedAt || entry.finished_at || new Date().toISOString()
    };
  });

  return normalized;
}

function renderAll() {
  renderProgress();
  renderMedals();
  renderMap();
  renderShelf();
  renderHeroes();
  renderProgressDashboard();
  renderAnalytics();
}

function getDoneCount() {
  return books.filter((book) => state.entries[book.id]?.done).length;
}

function getCurrentIndex() {
  return Math.min(getDoneCount(), books.length - 1);
}

function getBookStatus(book) {
  if (state.entries[book.id]?.done) return "done";
  if (books[getCurrentIndex()]?.id === book.id) return "recommended";
  return "available";
}

function renderProgress() {
  const done = getDoneCount();
  const currentBook = books[getCurrentIndex()];
  els.progressText.textContent = `Прочитано ${done} из ${books.length} книг`;
  els.currentHint.textContent = done === books.length ? "Маршрут завершен" : `Рекомендуем: ${currentBook.title}`;
  els.progressFill.style.width = `${(done / books.length) * 100}%`;
  els.questTitle.textContent = done === books.length ? "Все станции пройдены" : currentBook.title;
  els.questMeta.textContent = done === books.length ? "Можно перечитать любимую книгу или посмотреть итоги" : `${currentBook.author} · ${currentBook.station_theme}`;
  els.openRecommendedBtn.textContent = done === books.length ? "Итоги" : "Открыть";
}

function renderMedals() {
  const done = getDoneCount();
  els.medals.innerHTML = medalTargets.map((target) => {
    const active = done >= target;
    return `<div class="medal ${active ? "is-active" : ""}"><span>${active ? "🏅" : "⚪"}</span><span>${target} книг</span></div>`;
  }).join("");
}

function renderMap() {
  els.mapRoute.innerHTML = books.map((book, index) => {
    const status = getBookStatus(book);
    const entry = state.entries[book.id];
    const badge = status === "done" ? "✓" : status === "recommended" ? "!" : book.id;
    return `
      <button class="station is-${status}" type="button" data-book-id="${book.id}">
        <span class="station-badge">${badge}</span>
        <span class="station-icon" aria-hidden="true">${stationIcons[index]}</span>
        <span>
          <span class="station-title">${escapeHtml(book.title)}</span>
          <span class="station-meta">${escapeHtml(book.author)}</span>
          <span class="station-theme">${escapeHtml(book.station_theme)}${entry?.rating ? ` · ${"★".repeat(entry.rating)}` : ""}</span>
        </span>
      </button>
    `;
  }).join("");

  els.mapRoute.querySelectorAll(".station").forEach((button) => {
    button.addEventListener("click", () => openDiary(Number(button.dataset.bookId)));
  });
}

function bindQuestionButtons(container) {
  container.querySelectorAll("[data-questions-book-id]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      openQuestions(Number(button.dataset.questionsBookId));
    });
  });
}

function renderShelf() {
  const filteredBooks = books.filter((book) => {
    const status = getBookStatus(book);
    if (shelfFilter === "todo") return status === "available" || status === "recommended";
    if (shelfFilter === "reading") return status === "recommended";
    return status === "done";
  });
  if (!filteredBooks.length) {
    els.bookGrid.innerHTML = renderEmptyState("📖", "Здесь пока пусто", "Открой карту и выбери любую книжную станцию.");
    return;
  }

  els.bookGrid.innerHTML = filteredBooks.map((book) => {
    const status = getBookStatus(book);
    const statusText = status === "done" ? "Прочитано" : status === "recommended" ? "Рекомендуется" : "Можно читать";
    const actionText = status === "done" ? "Посмотреть запись" : "Заполнить дневник";
    return `
      <button class="book-card is-${status}" type="button" data-book-id="${book.id}">
        <span class="cover" aria-hidden="true">${stationIcons[book.id - 1]}</span>
        <span>
          <h3>${escapeHtml(book.title)}</h3>
          <p>${escapeHtml(book.author)}</p>
          <p>${escapeHtml(book.station_theme)}</p>
          <span class="status-pill ${status === "recommended" ? "reading" : status === "available" ? "available" : ""}">${statusText}</span>
          <span class="card-action">${actionText}</span>
        </span>
      </button>
    `;
  }).join("");

  els.bookGrid.querySelectorAll(".book-card").forEach((button) => {
    button.addEventListener("click", () => openDiary(Number(button.dataset.bookId)));
  });
  bindQuestionButtons(els.bookGrid);
}

function renderHeroes() {
  const heroes = books
    .map((book) => ({ book, entry: state.entries[book.id] }))
    .filter(({ entry }) => entry?.hero?.trim());

  els.heroesCount.textContent = heroes.length;
  if (!heroes.length) {
    els.heroGrid.innerHTML = renderEmptyState("⭐", "Герои еще в пути", "Открой книгу и напиши имя главного героя.");
    return;
  }

  els.heroGrid.innerHTML = heroes.map(({ book, entry }, index) => `
    <article class="hero-card">
      <span class="hero-avatar" aria-hidden="true">${["🧢", "👑", "🦸", "🧙", "🧒"][index % 5]}</span>
      <div>
        <strong>${escapeHtml(entry.hero)}</strong>
        <p>${escapeHtml(book.title)}</p>
      </div>
    </article>
  `).join("");
}

function renderProgressDashboard() {
  const done = getDoneCount();
  const percent = Math.round((done / books.length) * 100);
  const nextMedal = medalTargets.find((target) => done < target) || books.length;
  const leftToNext = Math.max(0, nextMedal - done);
  const heroes = books
    .map((book) => ({ book, entry: state.entries[book.id] }))
    .filter(({ entry }) => entry?.hero?.trim())
    .slice(-6);

  els.progressBadge.textContent = `${percent}%`;
  els.progressDashboard.innerHTML = `
    <section class="progress-hero-card">
      <div class="progress-ring" style="--progress: ${percent}">
        <span>${percent}%</span>
      </div>
      <div>
        <p class="eyebrow">Книжная команда</p>
        <h3>${childName} прошла ${done} из ${books.length} станций</h3>
        <p>${done ? "Герои уже собираются в альбом приключений." : "Первая станция ждет своего героя."}</p>
      </div>
    </section>

    <section class="story-party" aria-label="Герои прогресса">
      ${renderStoryParty(heroes)}
    </section>

    <section class="next-reward-card">
      <span aria-hidden="true">🏅</span>
      <div>
        <strong>${done >= books.length ? "Маршрут завершен!" : `До следующей награды: ${leftToNext} ${pluralizeBooks(leftToNext)}`}</strong>
        <p>${done >= books.length ? "Можно перечитать любимые книги и дописать ответы." : `Следующая цель: ${nextMedal} прочитанных книг.`}</p>
      </div>
    </section>

    <section class="milestone-path" aria-label="Этапы маршрута">
      ${[5, 10, 20, books.length].map((target) => `
        <div class="milestone ${done >= target ? "is-complete" : ""}">
          <span>${done >= target ? "✓" : target}</span>
          <strong>${target}</strong>
          <small>${target === books.length ? "финиш" : "книг"}</small>
        </div>
      `).join("")}
    </section>
  `;
}

function renderStoryParty(heroes) {
  if (!heroes.length) {
    return `
      <article class="story-party-empty">
        <span aria-hidden="true">🧭</span>
        <strong>Команда пока собирается</strong>
        <p>Когда Катя напишет первого героя, он появится здесь.</p>
      </article>
    `;
  }

  return heroes.map(({ book, entry }, index) => `
    <article class="story-hero-token">
      <span aria-hidden="true">${["🧢", "👑", "🦸", "🧙", "🧒", "✨"][index % 6]}</span>
      <strong>${escapeHtml(entry.hero)}</strong>
      <small>${escapeHtml(book.title)}</small>
    </article>
  `).join("");
}

function pluralizeBooks(count) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return "книга";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "книги";
  return "книг";
}

function renderAnalytics() {
  const doneBooks = books.filter((book) => state.entries[book.id]?.done);
  if (!doneBooks.length) {
    els.analytics.innerHTML = renderEmptyState("📋", "Записей пока нет", "Когда книга будет сохранена, здесь появятся дата, оценка и отзыв.");
    return;
  }

  const ratings = doneBooks.map((book) => state.entries[book.id]?.rating).filter(Boolean);
  const averageRating = ratings.length ? (ratings.reduce((sum, value) => sum + value, 0) / ratings.length).toFixed(1) : "—";
  const lastBook = doneBooks.at(-1);
  const summary = `
    <article class="analytics-summary">
      <span><strong>${doneBooks.length}</strong><small>прочитано</small></span>
      <span><strong>${averageRating}</strong><small>средняя оценка</small></span>
      <span><strong>${escapeHtml(lastBook.title)}</strong><small>последняя книга</small></span>
    </article>
  `;

  els.analytics.innerHTML = summary + doneBooks.map((book) => {
    const entry = state.entries[book.id];
    const mood = moods.find((item) => item.id === entry.mood);
    const questions = getDiscussionQuestions(book, entry);
    const answers = Array.isArray(entry.questionAnswers) ? entry.questionAnswers : [];
    return `
      <article class="analytics-card">
        <h3>${escapeHtml(book.title)}</h3>
        <p>${escapeHtml(book.author)}</p>
        <div class="analytics-meta">
          <span>${formatDate(entry.finishedAt)}</span>
          <span>${mood ? `${mood.icon} ${mood.label}` : "Настроение не выбрано"}</span>
          <span>${"★".repeat(entry.rating || 0) || "Без оценки"}</span>
        </div>
        <p><strong>Герой:</strong> ${escapeHtml(entry.hero || "не указан")}</p>
        <p><strong>Отзыв:</strong> ${escapeHtml(entry.liked || "не заполнен")}</p>
        <div class="quest-discussion">
          <strong>Вопросы для обсуждения</strong>
          <ul>
            ${questions.map((question, index) => `<li>${escapeHtml(question)}${answers[index] ? `<p class="saved-answer">${escapeHtml(answers[index])}</p>` : ""}</li>`).join("")}
          </ul>
          <button class="ghost-button question-repeat-button" type="button" data-questions-book-id="${book.id}">Открыть квест</button>
        </div>
      </article>
    `;
  }).join("");
  bindQuestionButtons(els.analytics);
}

function openDiary(bookId) {
  const book = books.find((item) => item.id === bookId);
  const entry = state.entries[bookId] || {};
  activeBookId = bookId;
  selectedMood = entry.mood || moods[0].id;
  selectedRating = entry.rating || 5;

  els.modalTheme.textContent = book.station_theme;
  els.modalTitle.textContent = book.title;
  els.modalAuthor.textContent = book.author;
  els.heroInput.value = entry.hero || "";
  els.likedInput.value = entry.liked || "";
  renderMoodOptions();
  renderStars();
  updateDiaryActions();
  els.diaryModal.showModal();
}

function updateDiaryActions() {
  const isDone = Boolean(state.entries[activeBookId]?.done);
  els.undoDoneBtn.hidden = !isDone;
  els.openQuestionsBtn.hidden = !activeBookId;
  els.openQuestionsBtn.textContent = isDone ? "Вернуться к вопросам" : "Посмотреть вопросы";
}

function renderMoodOptions() {
  els.moodOptions.innerHTML = moods.map((mood) => `
    <button class="mood-button ${mood.id === selectedMood ? "is-active" : ""}" type="button" data-mood="${mood.id}">
      ${mood.icon} ${mood.label}
    </button>
  `).join("");

  els.moodOptions.querySelectorAll(".mood-button").forEach((button) => {
    button.addEventListener("click", () => {
      selectedMood = button.dataset.mood;
      renderMoodOptions();
    });
  });
}

function renderStars() {
  els.stars.innerHTML = Array.from({ length: 5 }, (_, index) => {
    const value = index + 1;
    return `<button class="star-button ${value <= selectedRating ? "is-active" : ""}" type="button" data-rating="${value}" aria-label="${value} из 5">★</button>`;
  }).join("");

  els.stars.querySelectorAll(".star-button").forEach((button) => {
    button.addEventListener("click", () => {
      selectedRating = Number(button.dataset.rating);
      renderStars();
    });
  });
}

function saveDiary(event) {
  event.preventDefault();
  if (!activeBookId) return;

  const previous = state.entries[activeBookId] || {};
  const wasDone = Boolean(previous.done);
  state.entries[activeBookId] = {
    ...previous,
    done: true,
    hero: els.heroInput.value.trim(),
    liked: els.likedInput.value.trim(),
    mood: selectedMood,
    rating: selectedRating,
    finishedAt: previous.finishedAt || new Date().toISOString()
  };

  persistState();
  els.diaryModal.close();
  renderAll();
  if (!wasDone) {
    showSavedStamp();
    showCelebration(books.find((item) => item.id === activeBookId), state.entries[activeBookId]);
  }
}

function undoDone() {
  if (!activeBookId || !state.entries[activeBookId]?.done) return;

  const book = books.find((item) => item.id === activeBookId);
  const approved = window.confirm(`Снять отметку «прочитано» с книги «${book.title}»? Запись дневника по этой книге будет удалена.`);
  if (!approved) return;

  delete state.entries[activeBookId];
  persistState();
  els.diaryModal.close();
  renderAll();
  showScreen("mapScreen");
}

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.toggle("is-active", screen.id === screenId);
  });
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.screen === screenId);
  });
  document.querySelector("#parentShortcut").classList.toggle("is-active", screenId === "parentScreen");
}

function exportProgress() {
  const blob = new Blob([JSON.stringify({ childId, books, progress: state.entries }, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `reading-progress-${childId}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function importProgress(event) {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const payload = JSON.parse(String(reader.result || "{}"));
      const importedEntries = normalizeEntries(payload.progress || payload.entries || {});
      if (!Object.keys(importedEntries).length) {
        window.alert("В этом файле не найден прогресс чтения.");
        return;
      }

      state = { entries: importedEntries };
      persistState();
      renderAll();
      showScreen("parentScreen");
      window.alert("Прогресс восстановлен.");
    } catch {
      window.alert("Не удалось прочитать JSON-файл.");
    }
  };
  reader.readAsText(file);
}

function resetProgress() {
  els.resetModal.showModal();
}

function confirmResetProgress() {
  state = { entries: {} };
  activeBookId = null;
  localStorage.removeItem(storageKey);
  syncResetCloud();
  if (els.diaryModal.open) els.diaryModal.close();
  els.resetModal.close();
  renderAll();
  showScreen("mapScreen");
}

function openRecommendedBook() {
  if (getDoneCount() === books.length) {
    showScreen("parentScreen");
    return;
  }
  openDiary(books[getCurrentIndex()].id);
}

function showSavedStamp() {
  document.body.classList.add("show-saved-stamp");
  window.setTimeout(() => document.body.classList.remove("show-saved-stamp"), 1300);
}

function showCelebration(book, entry) {
  const done = getDoneCount();
  const message = praiseMessages[(done - 1) % praiseMessages.length];
  els.celebrationTitle.textContent = `${childName} умничка!`;
  els.celebrationText.textContent = message;
  prepareQuestionQuest(book, entry);
  window.setTimeout(() => els.celebrationModal.showModal(), 420);
}

function openQuestions(bookId) {
  const book = books.find((item) => item.id === bookId);
  if (!book) return;

  prepareQuestionQuest(book, state.entries[bookId] || {});
  els.diaryModal.close();
  els.celebrationModal.showModal();
}

function prepareQuestionQuest(book, entry) {
  activeQuestionBookId = book.id;
  activeQuestions = getDiscussionQuestions(book, entry);
  activeQuestionAnswers = Array.isArray(entry.questionAnswers) ? [...entry.questionAnswers] : [];
  activeQuestionIndex = 0;
  renderQuestionStep();
}

function changeQuestion(direction) {
  if (!activeQuestions.length) return;
  saveCurrentQuestionAnswer();
  activeQuestionIndex = Math.min(activeQuestions.length - 1, Math.max(0, activeQuestionIndex + direction));
  renderQuestionStep();
}

function handleNextQuestion() {
  saveCurrentQuestionAnswer();
  if (activeQuestionIndex >= activeQuestions.length - 1) {
    persistQuestionAnswers();
    els.celebrationModal.close();
    showScreen("mapScreen");
    return;
  }

  changeQuestion(1);
}

function renderQuestionStep() {
  const total = activeQuestions.length || 1;
  els.questCounter.textContent = `${activeQuestionIndex + 1} из ${total}`;
  els.questQuestionText.textContent = activeQuestions[activeQuestionIndex] || "";
  els.questAnswerInput.value = activeQuestionAnswers[activeQuestionIndex] || "";
  els.prevQuestionBtn.disabled = activeQuestionIndex === 0;
  els.nextQuestionBtn.textContent = activeQuestionIndex === total - 1 ? "Готово" : "Дальше";
}

function saveCurrentQuestionAnswer() {
  if (!activeQuestions.length) return;
  activeQuestionAnswers[activeQuestionIndex] = els.questAnswerInput.value.trim();
}

function persistQuestionAnswers() {
  if (!activeQuestionBookId) return;
  const previous = state.entries[activeQuestionBookId] || {};
  state.entries[activeQuestionBookId] = {
    ...previous,
    questionAnswers: activeQuestionAnswers
  };
  persistState();
  renderAll();
}

function getDiscussionQuestions(book, entry = {}) {
  const hero = entry.hero?.trim();
  return [
    `Как ты думаешь, какая главная мысль книги «${book.title}»?`,
    hero ? `Что хорошего или важного сделал герой ${hero}?` : "Кто в этой истории поступил смело, добро или честно?",
    "Какой момент тебе хочется обсудить или нарисовать?",
    "Чему эта история может научить в обычной жизни?"
  ];
}

function renderEmptyState(icon, title, text) {
  return `
    <div class="empty-state">
      <span class="empty-icon" aria-hidden="true">${icon}</span>
      <strong>${title}</strong>
      <p>${text}</p>
    </div>
  `;
}

function formatDate(value) {
  if (!value) return "дата не указана";
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
