"use strict";

const urlParams = new URLSearchParams(window.location.search);
const childName = urlParams.get("name") || "Катя";
const childId = urlParams.get("child") || "katya";
const isParentMode = urlParams.get("parent") === "1";
const isPreviewMode = isParentMode;
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
  "Сегодня маршрут стал светлее."
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

const DICTIONARY_WORDS = [
  { id: "adres", word: "адрес", category: "school", categoryLabel: "школа и учеба", priority: 1, difficultyLevel: 1, dangerPlace: "буква а в начале слова", hint: "запомни: адрес пишется с буквой а", exampleSentence: "Запиши свой адрес.", isProperName: false, isPhrase: false },
  { id: "biblioteka", word: "библиотека", category: "school", categoryLabel: "школа и учеба", priority: 2, difficultyLevel: 3, dangerPlace: "сочетание библио", hint: "запомни начало слова: библио", exampleSentence: "В школе есть библиотека.", isProperName: false, isPhrase: false },
  { id: "gazeta", word: "газета", category: "school", categoryLabel: "школа и учеба", priority: 2, difficultyLevel: 1, dangerPlace: "буква а", hint: "запомни: газета пишется через а", exampleSentence: "Дедушка читает газету.", isProperName: false, isPhrase: false },
  { id: "kalendar", word: "календарь", category: "school", categoryLabel: "школа и учеба", priority: 2, difficultyLevel: 2, dangerPlace: "буква а, мягкий знак", hint: "запомни: календарь пишется через а", exampleSentence: "На стене висит календарь.", isProperName: false, isPhrase: false },
  { id: "karandash", word: "карандаш", category: "school", categoryLabel: "школа и учеба", priority: 1, difficultyLevel: 2, dangerPlace: "буквы а, а", hint: "запомни две буквы а", exampleSentence: "У меня новый карандаш.", isProperName: false, isPhrase: false },
  { id: "kartina", word: "картина", category: "school", categoryLabel: "школа и учеба", priority: 2, difficultyLevel: 1, dangerPlace: "буква а", hint: "запомни: картина пишется через а", exampleSentence: "На стене висит картина.", isProperName: false, isPhrase: false },
  { id: "klass", word: "класс", category: "school", categoryLabel: "школа и учеба", priority: 1, difficultyLevel: 1, dangerPlace: "двойная с", hint: "запомни: в слове класс две буквы с", exampleSentence: "Наш класс идет на экскурсию.", isProperName: false, isPhrase: false },
  { id: "penal", word: "пенал", category: "school", categoryLabel: "школа и учеба", priority: 2, difficultyLevel: 1, dangerPlace: "буква е", hint: "запомни: пенал пишется через е", exampleSentence: "В пенале лежит ручка.", isProperName: false, isPhrase: false },
  { id: "risunok", word: "рисунок", category: "school", categoryLabel: "школа и учеба", priority: 2, difficultyLevel: 1, dangerPlace: "буква и", hint: "запомни: рисунок пишется через и", exampleSentence: "Мой рисунок получился ярким.", isProperName: false, isPhrase: false },
  { id: "russkiy", word: "русский", category: "school", categoryLabel: "школа и учеба", priority: 4, difficultyLevel: 2, dangerPlace: "двойная с", hint: "запомни: русский пишется с двумя с", exampleSentence: "Мы изучаем русский язык.", isProperName: false, isPhrase: false },
  { id: "tetrad", word: "тетрадь", category: "school", categoryLabel: "школа и учеба", priority: 1, difficultyLevel: 1, dangerPlace: "буква е", hint: "запомни: тетрадь пишется через е", exampleSentence: "Открой тетрадь.", isProperName: false, isPhrase: false },
  { id: "uchenik", word: "ученик", category: "school", categoryLabel: "школа и учеба", priority: 1, difficultyLevel: 1, dangerPlace: "буква е", hint: "запомни: ученик пишется через е", exampleSentence: "Ученик решил задачу.", isProperName: false, isPhrase: false },
  { id: "uchenitsa", word: "ученица", category: "school", categoryLabel: "школа и учеба", priority: 2, difficultyLevel: 1, dangerPlace: "буква е", hint: "запомни: ученица пишется через е", exampleSentence: "Ученица пишет красиво.", isProperName: false, isPhrase: false },
  { id: "familiya", word: "фамилия", category: "school", categoryLabel: "школа и учеба", priority: 2, difficultyLevel: 2, dangerPlace: "буква а", hint: "запомни: фамилия пишется через а", exampleSentence: "Напиши свою фамилию.", isProperName: false, isPhrase: false },
  { id: "yazyk", word: "язык", category: "school", categoryLabel: "школа и учеба", priority: 2, difficultyLevel: 2, dangerPlace: "буква ы", hint: "запомни букву ы", exampleSentence: "Русский язык очень богатый.", isProperName: false, isPhrase: false },
  { id: "kvartira", word: "квартира", category: "home", categoryLabel: "дом, быт и вещи", priority: 2, difficultyLevel: 2, dangerPlace: "буква а", hint: "запомни: квартира пишется через а", exampleSentence: "Наша квартира светлая.", isProperName: false, isPhrase: false },
  { id: "komnata", word: "комната", category: "home", categoryLabel: "дом, быт и вещи", priority: 2, difficultyLevel: 1, dangerPlace: "буква о", hint: "запомни: комната пишется через о", exampleSentence: "В комнате стоит стол.", isProperName: false, isPhrase: false },
  { id: "lopata", word: "лопата", category: "home", categoryLabel: "дом, быт и вещи", priority: 2, difficultyLevel: 1, dangerPlace: "буква о", hint: "запомни: лопата пишется через о", exampleSentence: "Лопата нужна в огороде.", isProperName: false, isPhrase: false },
  { id: "mashina", word: "машина", category: "home", categoryLabel: "дом, быт и вещи", priority: 1, difficultyLevel: 1, dangerPlace: "буква а", hint: "запомни: машина пишется через а", exampleSentence: "Во дворе стоит машина.", isProperName: false, isPhrase: false },
  { id: "odezhda", word: "одежда", category: "home", categoryLabel: "дом, быт и вещи", priority: 2, difficultyLevel: 2, dangerPlace: "буква о", hint: "запомни: одежда пишется через о", exampleSentence: "Зимняя одежда висит в шкафу.", isProperName: false, isPhrase: false },
  { id: "palto", word: "пальто", category: "home", categoryLabel: "дом, быт и вещи", priority: 2, difficultyLevel: 2, dangerPlace: "мягкий знак", hint: "запомни мягкий знак", exampleSentence: "Надень теплое пальто.", isProperName: false, isPhrase: false },
  { id: "platok", word: "платок", category: "home", categoryLabel: "дом, быт и вещи", priority: 2, difficultyLevel: 1, dangerPlace: "буква а", hint: "запомни: платок пишется через а", exampleSentence: "У бабушки красивый платок.", isProperName: false, isPhrase: false },
  { id: "posuda", word: "посуда", category: "home", categoryLabel: "дом, быт и вещи", priority: 2, difficultyLevel: 1, dangerPlace: "буква о", hint: "запомни: посуда пишется через о", exampleSentence: "Чистая посуда стоит на полке.", isProperName: false, isPhrase: false },
  { id: "rabota", word: "работа", category: "home", categoryLabel: "дом, быт и вещи", priority: 2, difficultyLevel: 1, dangerPlace: "буква а", hint: "запомни: работа пишется через а", exampleSentence: "Работа выполнена аккуратно.", isProperName: false, isPhrase: false },
  { id: "sapog", word: "сапог", category: "home", categoryLabel: "дом, быт и вещи", priority: 2, difficultyLevel: 1, dangerPlace: "буква а", hint: "запомни: сапог пишется через а", exampleSentence: "У двери стоит сапог.", isProperName: false, isPhrase: false },
  { id: "stakan", word: "стакан", category: "home", categoryLabel: "дом, быт и вещи", priority: 2, difficultyLevel: 1, dangerPlace: "буква а", hint: "запомни: стакан пишется через а", exampleSentence: "На столе стоит стакан.", isProperName: false, isPhrase: false },
  { id: "topor", word: "топор", category: "home", categoryLabel: "дом, быт и вещи", priority: 4, difficultyLevel: 1, dangerPlace: "буква о", hint: "запомни: топор пишется через о", exampleSentence: "В сарае лежит топор.", isProperName: false, isPhrase: false },
  { id: "kapusta", word: "капуста", category: "food", categoryLabel: "продукты и еда", priority: 2, difficultyLevel: 1, dangerPlace: "буква а", hint: "запомни: капуста пишется через а", exampleSentence: "На грядке растет капуста.", isProperName: false, isPhrase: false },
  { id: "kartofel", word: "картофель", category: "food", categoryLabel: "продукты и еда", priority: 2, difficultyLevel: 2, dangerPlace: "буква а, мягкий знак", hint: "запомни: картофель пишется через а", exampleSentence: "Мы сварили картофель.", isProperName: false, isPhrase: false },
  { id: "moloko", word: "молоко", category: "food", categoryLabel: "продукты и еда", priority: 1, difficultyLevel: 2, dangerPlace: "буквы о, о", hint: "запомни две буквы о", exampleSentence: "Я пью молоко.", isProperName: false, isPhrase: false },
  { id: "morkov", word: "морковь", category: "food", categoryLabel: "продукты и еда", priority: 2, difficultyLevel: 2, dangerPlace: "буква о, мягкий знак", hint: "запомни: морковь пишется через о", exampleSentence: "В суп добавили морковь.", isProperName: false, isPhrase: false },
  { id: "obed", word: "обед", category: "food", categoryLabel: "продукты и еда", priority: 4, difficultyLevel: 1, dangerPlace: "буква о", hint: "запомни: обед пишется через о", exampleSentence: "Скоро будет обед.", isProperName: false, isPhrase: false },
  { id: "pomidor", word: "помидор", category: "food", categoryLabel: "продукты и еда", priority: 2, difficultyLevel: 1, dangerPlace: "буква о", hint: "запомни: помидор пишется через о", exampleSentence: "На тарелке лежит помидор.", isProperName: false, isPhrase: false },
  { id: "sahar", word: "сахар", category: "food", categoryLabel: "продукты и еда", priority: 2, difficultyLevel: 1, dangerPlace: "буква а", hint: "запомни: сахар пишется через а", exampleSentence: "В чай положили сахар.", isProperName: false, isPhrase: false },
  { id: "bereza", word: "берёза", category: "nature", categoryLabel: "природа, животные и растения", priority: 1, difficultyLevel: 1, dangerPlace: "буква е, буква ё", hint: "запомни: берёза пишется через е и ё", exampleSentence: "У дома растет берёза.", isProperName: false, isPhrase: false },
  { id: "veter", word: "ветер", category: "nature", categoryLabel: "природа, животные и растения", priority: 1, difficultyLevel: 1, dangerPlace: "буква е", hint: "запомни первую букву е", exampleSentence: "Дует сильный ветер.", isProperName: false, isPhrase: false },
  { id: "vorobey", word: "воробей", category: "nature", categoryLabel: "природа, животные и растения", priority: 1, difficultyLevel: 2, dangerPlace: "буква о в начале слова", hint: "запомни: воробей пишется через о", exampleSentence: "На ветке сидит воробей.", isProperName: false, isPhrase: false },
  { id: "vorona", word: "ворона", category: "nature", categoryLabel: "природа, животные и растения", priority: 2, difficultyLevel: 1, dangerPlace: "буква о", hint: "запомни: ворона пишется через о", exampleSentence: "На крыше сидит ворона.", isProperName: false, isPhrase: false },
  { id: "zayats", word: "заяц", category: "nature", categoryLabel: "природа, животные и растения", priority: 1, difficultyLevel: 1, dangerPlace: "буква я", hint: "запомни: заяц пишется с буквой я", exampleSentence: "Белый заяц прыгнул в кусты.", isProperName: false, isPhrase: false },
  { id: "zemlyanika", word: "земляника", category: "nature", categoryLabel: "природа, животные и растения", priority: 2, difficultyLevel: 2, dangerPlace: "буква е", hint: "запомни: земляника пишется через е", exampleSentence: "В лесу поспела земляника.", isProperName: false, isPhrase: false },
  { id: "korova", word: "корова", category: "nature", categoryLabel: "природа, животные и растения", priority: 1, difficultyLevel: 1, dangerPlace: "буква о", hint: "запомни: корова пишется через о", exampleSentence: "На лугу пасется корова.", isProperName: false, isPhrase: false },
  { id: "lisitsa", word: "лисица", category: "nature", categoryLabel: "природа, животные и растения", priority: 2, difficultyLevel: 1, dangerPlace: "буква и", hint: "запомни: лисица пишется через и", exampleSentence: "Рыжая лисица бежит по лесу.", isProperName: false, isPhrase: false },
  { id: "medved", word: "медведь", category: "nature", categoryLabel: "природа, животные и растения", priority: 2, difficultyLevel: 1, dangerPlace: "буква е", hint: "запомни: медведь пишется через е", exampleSentence: "Медведь живет в лесу.", isProperName: false, isPhrase: false },
  { id: "moroz", word: "мороз", category: "nature", categoryLabel: "природа, животные и растения", priority: 2, difficultyLevel: 1, dangerPlace: "буква о", hint: "запомни: мороз пишется через о", exampleSentence: "Утром был сильный мороз.", isProperName: false, isPhrase: false },
  { id: "oreh", word: "орех", category: "nature", categoryLabel: "природа, животные и растения", priority: 2, difficultyLevel: 1, dangerPlace: "буква о", hint: "запомни: орех пишется через о", exampleSentence: "Белка нашла орех.", isProperName: false, isPhrase: false },
  { id: "osina", word: "осина", category: "nature", categoryLabel: "природа, животные и растения", priority: 2, difficultyLevel: 1, dangerPlace: "буква о", hint: "запомни: осина пишется через о", exampleSentence: "У дороги растет осина.", isProperName: false, isPhrase: false },
  { id: "pesok", word: "песок", category: "nature", categoryLabel: "природа, животные и растения", priority: 2, difficultyLevel: 1, dangerPlace: "буква е", hint: "запомни: песок пишется через е", exampleSentence: "На берегу лежит песок.", isProperName: false, isPhrase: false },
  { id: "petuh", word: "петух", category: "nature", categoryLabel: "природа, животные и растения", priority: 2, difficultyLevel: 1, dangerPlace: "буква е", hint: "запомни: петух пишется через е", exampleSentence: "Петух громко поет.", isProperName: false, isPhrase: false },
  { id: "sobaka", word: "собака", category: "nature", categoryLabel: "природа, животные и растения", priority: 1, difficultyLevel: 1, dangerPlace: "буква о", hint: "запомни: собака пишется через о", exampleSentence: "Собака сторожит дом.", isProperName: false, isPhrase: false },
  { id: "soroka", word: "сорока", category: "nature", categoryLabel: "природа, животные и растения", priority: 2, difficultyLevel: 1, dangerPlace: "буква о", hint: "запомни: сорока пишется через о", exampleSentence: "Сорока сидит на заборе.", isProperName: false, isPhrase: false },
  { id: "yagoda", word: "ягода", category: "nature", categoryLabel: "природа, животные и растения", priority: 2, difficultyLevel: 1, dangerPlace: "буква я", hint: "запомни: ягода пишется через я", exampleSentence: "На ветке созрела ягода.", isProperName: false, isPhrase: false },
  { id: "aprel", word: "апрель", category: "time", categoryLabel: "время и календарь", priority: 3, difficultyLevel: 1, dangerPlace: "буква а", hint: "запомни: апрель пишется через а", exampleSentence: "В апреле тает снег.", isProperName: false, isPhrase: false },
  { id: "voskresenye", word: "воскресенье", category: "time", categoryLabel: "время и календарь", priority: 3, difficultyLevel: 3, dangerPlace: "буква о, мягкий знак", hint: "запомни: воскресенье пишется через о", exampleSentence: "В воскресенье мы гуляли.", isProperName: false, isPhrase: false },
  { id: "vchera", word: "вчера", category: "time", categoryLabel: "время и календарь", priority: 3, difficultyLevel: 1, dangerPlace: "буква е", hint: "запомни: вчера пишется через е", exampleSentence: "Вчера шел дождь.", isProperName: false, isPhrase: false },
  { id: "zavtra", word: "завтра", category: "time", categoryLabel: "время и календарь", priority: 3, difficultyLevel: 1, dangerPlace: "буква а", hint: "запомни: завтра пишется через а", exampleSentence: "Завтра будет праздник.", isProperName: false, isPhrase: false },
  { id: "mesyats", word: "месяц", category: "time", categoryLabel: "время и календарь", priority: 3, difficultyLevel: 1, dangerPlace: "буква е", hint: "запомни: месяц пишется через е", exampleSentence: "Прошел один месяц.", isProperName: false, isPhrase: false },
  { id: "noyabr", word: "ноябрь", category: "time", categoryLabel: "время и календарь", priority: 3, difficultyLevel: 2, dangerPlace: "буква о, мягкий знак", hint: "запомни: ноябрь пишется через о", exampleSentence: "В ноябре часто холодно.", isProperName: false, isPhrase: false },
  { id: "odnazhdy", word: "однажды", category: "time", categoryLabel: "время и календарь", priority: 3, difficultyLevel: 2, dangerPlace: "буква о", hint: "запомни: однажды пишется через о", exampleSentence: "Однажды мы пошли в лес.", isProperName: false, isPhrase: false },
  { id: "oktyabr", word: "октябрь", category: "time", categoryLabel: "время и календарь", priority: 3, difficultyLevel: 2, dangerPlace: "буква о, мягкий знак", hint: "запомни: октябрь пишется через о", exampleSentence: "Октябрь был дождливым.", isProperName: false, isPhrase: false },
  { id: "prazdnik", word: "праздник", category: "time", categoryLabel: "время и календарь", priority: 3, difficultyLevel: 2, dangerPlace: "буква д", hint: "запомни: в слове праздник есть буква д", exampleSentence: "Скоро будет праздник.", isProperName: false, isPhrase: false },
  { id: "sentyabr", word: "сентябрь", category: "time", categoryLabel: "время и календарь", priority: 3, difficultyLevel: 2, dangerPlace: "буква е, мягкий знак", hint: "запомни: сентябрь пишется через е", exampleSentence: "В сентябре начинается учеба.", isProperName: false, isPhrase: false },
  { id: "subbota", word: "суббота", category: "time", categoryLabel: "время и календарь", priority: 3, difficultyLevel: 2, dangerPlace: "буква у, двойная б", hint: "запомни: суббота пишется с у и двумя б", exampleSentence: "В субботу мы поедем в парк.", isProperName: false, isPhrase: false },
  { id: "fevral", word: "февраль", category: "time", categoryLabel: "время и календарь", priority: 3, difficultyLevel: 1, dangerPlace: "буква е", hint: "запомни: февраль пишется через е", exampleSentence: "Февраль - зимний месяц.", isProperName: false, isPhrase: false },
  { id: "yanvar", word: "январь", category: "time", categoryLabel: "время и календарь", priority: 3, difficultyLevel: 1, dangerPlace: "буква я, мягкий знак", hint: "запомни: январь пишется через я", exampleSentence: "Январь - первый месяц года.", isProperName: false, isPhrase: false },
  { id: "bystro", word: "быстро", category: "communication", categoryLabel: "общение и частотные слова", priority: 3, difficultyLevel: 1, dangerPlace: "буква ы", hint: "запомни: быстро пишется через ы", exampleSentence: "Он быстро решил задачу.", isProperName: false, isPhrase: false },
  { id: "vdrug", word: "вдруг", category: "communication", categoryLabel: "общение и частотные слова", priority: 3, difficultyLevel: 1, dangerPlace: "буква д", hint: "запомни букву д", exampleSentence: "Вдруг начался дождь.", isProperName: false, isPhrase: false },
  { id: "veselo", word: "весело", category: "communication", categoryLabel: "общение и частотные слова", priority: 3, difficultyLevel: 1, dangerPlace: "буква е", hint: "запомни: весело пишется через е", exampleSentence: "Детям было весело.", isProperName: false, isPhrase: false },
  { id: "do_svidaniya", word: "до свидания", category: "communication", categoryLabel: "общение и частотные слова", priority: 3, difficultyLevel: 2, dangerPlace: "раздельное написание", hint: "запомни: до свидания пишется раздельно", exampleSentence: "Мы сказали: до свидания.", isProperName: false, isPhrase: true },
  { id: "zdravstvuy", word: "здравствуй", category: "communication", categoryLabel: "общение и частотные слова", priority: 3, difficultyLevel: 3, dangerPlace: "буква в", hint: "запомни: в слове здравствуй есть буква в", exampleSentence: "Здравствуй, мой друг!", isProperName: false, isPhrase: false },
  { id: "interesnyy", word: "интересный", category: "communication", categoryLabel: "общение и частотные слова", priority: 3, difficultyLevel: 2, dangerPlace: "буква и", hint: "запомни: интересный пишется через и", exampleSentence: "Это интересный рассказ.", isProperName: false, isPhrase: false },
  { id: "narod", word: "народ", category: "communication", categoryLabel: "общение и частотные слова", priority: 3, difficultyLevel: 1, dangerPlace: "буква а", hint: "запомни: народ пишется через а", exampleSentence: "На площади собрался народ.", isProperName: false, isPhrase: false },
  { id: "privet", word: "привет", category: "communication", categoryLabel: "общение и частотные слова", priority: 3, difficultyLevel: 1, dangerPlace: "буква и", hint: "запомни: привет пишется через и", exampleSentence: "Привет, ребята!", isProperName: false, isPhrase: false },
  { id: "rebyata", word: "ребята", category: "communication", categoryLabel: "общение и частотные слова", priority: 3, difficultyLevel: 1, dangerPlace: "буква е", hint: "запомни: ребята пишется через е", exampleSentence: "Ребята играют во дворе.", isProperName: false, isPhrase: false },
  { id: "spasibo", word: "спасибо", category: "communication", categoryLabel: "общение и частотные слова", priority: 3, difficultyLevel: 1, dangerPlace: "буква а", hint: "запомни: спасибо пишется через а", exampleSentence: "Спасибо за помощь.", isProperName: false, isPhrase: false },
  { id: "tovarishch", word: "товарищ", category: "communication", categoryLabel: "общение и частотные слова", priority: 3, difficultyLevel: 2, dangerPlace: "буква о", hint: "запомни: товарищ пишется через о", exampleSentence: "Мой товарищ помог мне.", isProperName: false, isPhrase: false },
  { id: "horosho", word: "хорошо", category: "communication", categoryLabel: "общение и частотные слова", priority: 3, difficultyLevel: 1, dangerPlace: "буквы о, о", hint: "запомни две буквы о", exampleSentence: "Сегодня мне хорошо.", isProperName: false, isPhrase: false },
  { id: "alleya", word: "аллея", category: "places", categoryLabel: "места, город и страна", priority: 4, difficultyLevel: 2, dangerPlace: "двойная л", hint: "запомни: аллея пишется с двумя л", exampleSentence: "В парке есть красивая аллея.", isProperName: false, isPhrase: false },
  { id: "vokzal", word: "вокзал", category: "places", categoryLabel: "места, город и страна", priority: 4, difficultyLevel: 2, dangerPlace: "буква о", hint: "запомни: вокзал пишется через о", exampleSentence: "Мы приехали на вокзал.", isProperName: false, isPhrase: false },
  { id: "vostok", word: "восток", category: "places", categoryLabel: "места, город и страна", priority: 4, difficultyLevel: 1, dangerPlace: "буква о", hint: "запомни: восток пишется через о", exampleSentence: "Солнце встает на востоке.", isProperName: false, isPhrase: false },
  { id: "gorod", word: "город", category: "places", categoryLabel: "места, город и страна", priority: 1, difficultyLevel: 1, dangerPlace: "буква о", hint: "запомни: город пишется через о", exampleSentence: "Это большой город.", isProperName: false, isPhrase: false },
  { id: "derevnya", word: "деревня", category: "places", categoryLabel: "места, город и страна", priority: 4, difficultyLevel: 1, dangerPlace: "буква е", hint: "запомни: деревня пишется через е", exampleSentence: "Летом мы едем в деревню.", isProperName: false, isPhrase: false },
  { id: "doroga", word: "дорога", category: "places", categoryLabel: "места, город и страна", priority: 1, difficultyLevel: 1, dangerPlace: "буква о", hint: "запомни: дорога пишется через о", exampleSentence: "Дорога ведет к лесу.", isProperName: false, isPhrase: false },
  { id: "zavod", word: "завод", category: "places", categoryLabel: "места, город и страна", priority: 4, difficultyLevel: 1, dangerPlace: "буква а", hint: "запомни: завод пишется через а", exampleSentence: "В городе работает завод.", isProperName: false, isPhrase: false },
  { id: "metro", word: "метро", category: "places", categoryLabel: "места, город и страна", priority: 4, difficultyLevel: 1, dangerPlace: "буква е", hint: "запомни: метро пишется через е", exampleSentence: "Мы едем на метро.", isProperName: false, isPhrase: false },
  { id: "moskva", word: "Москва", category: "places", categoryLabel: "места, город и страна", priority: 4, difficultyLevel: 2, dangerPlace: "заглавная буква", hint: "название города пишется с заглавной буквы", exampleSentence: "Москва - столица России.", isProperName: true, isPhrase: false },
  { id: "rodina", word: "Родина", category: "places", categoryLabel: "места, город и страна", priority: 4, difficultyLevel: 2, dangerPlace: "заглавная буква", hint: "если слово означает страну, пишем с заглавной буквы", exampleSentence: "Родина начинается с семьи.", isProperName: true, isPhrase: false },
  { id: "ulitsa", word: "улица", category: "places", categoryLabel: "места, город и страна", priority: 4, difficultyLevel: 1, dangerPlace: "буква и", hint: "запомни: улица пишется через и", exampleSentence: "Наша улица широкая.", isProperName: false, isPhrase: false },
  { id: "zheltyy", word: "жёлтый", category: "features", categoryLabel: "цвета и признаки", priority: 4, difficultyLevel: 1, dangerPlace: "буква ё", hint: "запомни: жёлтый пишется через ё", exampleSentence: "У меня жёлтый карандаш.", isProperName: false, isPhrase: false }
];

const PROVERBS = [
  [1, 1, "proverb", "Учеба, труд и старание", "Без труда не вытащишь и рыбку из пруда.", "Без труда не вытащишь...", "и рыбку из пруда.", "чтобы получить результат, нужно постараться.", "Петя не хотел тренироваться писать словарные слова. На диктанте он сделал много ошибок."],
  [2, 1, "proverb", "Учеба, труд и старание", "Делу время, потехе час.", "Делу время...", "потехе час.", "сначала нужно сделать важные дела, потом отдыхать.", "Катя сначала сделала домашнее задание, а потом спокойно пошла гулять."],
  [3, 1, "proverb", "Учеба, труд и старание", "Терпение и труд всё перетрут.", "Терпение и труд...", "всё перетрут.", "если стараться и не бросать дело, трудности можно преодолеть.", "Лена каждый день читала понемногу и через месяц стала читать быстрее."],
  [4, 1, "proverb", "Учеба, труд и старание", "Ученье - свет, а неученье - тьма.", "Ученье - свет...", "а неученье - тьма.", "знания помогают человеку понимать мир и принимать решения.", "Саша выучил правило и смог сам объяснить задачу другу."],
  [5, 1, "proverb", "Учеба, труд и старание", "Век живи - век учись.", "Век живи...", "век учись.", "учиться можно всю жизнь.", "Бабушка решила научиться пользоваться новым телефоном и каждый день тренировалась."],
  [6, 1, "proverb", "Учеба, труд и старание", "Повторенье - мать ученья.", "Повторенье...", "мать ученья.", "чтобы хорошо запомнить, нужно повторять.", "Оля несколько раз повторила правило и решила упражнения без ошибок."],
  [7, 1, "proverb", "Учеба, труд и старание", "Кто много читает, тот много знает.", "Кто много читает...", "тот много знает.", "чтение помогает узнавать новое.", "Дима много читал о животных и легко ответил на вопросы учителя."],
  [8, 1, "proverb", "Учеба, труд и старание", "Грамоте учиться - всегда пригодится.", "Грамоте учиться...", "всегда пригодится.", "умение читать, писать и понимать тексты нужно в жизни.", "Маша сама прочитала расписание и поняла, во сколько начинается кружок."],
  [9, 1, "proverb", "Учеба, труд и старание", "Не стыдно не знать, стыдно не учиться.", "Не стыдно не знать...", "стыдно не учиться.", "нормально чего-то не знать, важно хотеть разобраться.", "Аня не поняла новую тему и попросила учителя объяснить еще раз."],
  [10, 1, "proverb", "Учеба, труд и старание", "Маленькое дело лучше большого безделья.", "Маленькое дело лучше...", "большого безделья.", "даже небольшой полезный поступок лучше, чем ничего не делать.", "Ваня не успел убрать всю комнату, но сложил книги и навел порядок на столе."],
  [11, 2, "proverb", "Дружба, доброта и отношения", "Нет друга - ищи, а нашёл - береги.", "Нет друга - ищи...", "а нашёл - береги.", "дружбу нужно ценить и сохранять.", "Коля помирился с другом и понял, что не стоит ссориться из-за мелочей."],
  [12, 2, "proverb", "Дружба, доброта и отношения", "Старый друг лучше новых двух.", "Старый друг лучше...", "новых двух.", "проверенный друг очень ценен.", "Ира поняла, что подруга, с которой она давно дружит, всегда ее поддерживает."],
  [13, 2, "proverb", "Дружба, доброта и отношения", "Друг познаётся в беде.", "Друг познаётся...", "в беде.", "настоящий друг помогает, когда трудно.", "У Максима сломался карандаш, и друг сразу поделился своим."],
  [14, 2, "proverb", "Дружба, доброта и отношения", "Не имей сто рублей, а имей сто друзей.", "Не имей сто рублей...", "а имей сто друзей.", "друзья и поддержка важнее денег.", "Когда Тимур заболел, ребята прислали ему домашнее задание и пожелали выздоровления."],
  [15, 2, "proverb", "Дружба, доброта и отношения", "Один за всех и все за одного.", "Один за всех...", "и все за одного.", "в команде важно помогать друг другу.", "Ребята готовили проект: один рисовал, другой искал информацию, третий рассказывал."],
  [16, 2, "proverb", "Дружба, доброта и отношения", "Доброе слово и кошке приятно.", "Доброе слово...", "и кошке приятно.", "добрые слова важны каждому.", "Настя поддержала новую девочку в классе, и та перестала стесняться."],
  [17, 2, "proverb", "Дружба, доброта и отношения", "Как аукнется, так и откликнется.", "Как аукнется...", "так и откликнется.", "как ты относишься к другим, так часто относятся и к тебе.", "Никита посмеялся над ошибкой одноклассника, а потом сам ошибся у доски."],
  [18, 2, "proverb", "Дружба, доброта и отношения", "Мир не без добрых людей.", "Мир не без...", "добрых людей.", "вокруг есть люди, которые могут помочь.", "Девочка потеряла варежку, а прохожий поднял ее и вернул."],
  [19, 2, "proverb", "Дружба, доброта и отношения", "За добро добром платят.", "За добро...", "добром платят.", "на добрый поступок часто отвечают добром.", "Мальчик помог однокласснику собрать рассыпанные тетради, а потом тот помог ему найти ручку."],
  [20, 2, "proverb", "Дружба, доброта и отношения", "В тесноте, да не в обиде.", "В тесноте...", "да не в обиде.", "даже если места мало, главное - быть дружными.", "В автобусе было мало места, но ребята подвинулись и всем стало удобно."],
  [21, 3, "proverb", "Осторожность, ум и решения", "Семь раз отмерь, один раз отрежь.", "Семь раз отмерь...", "один раз отрежь.", "перед важным делом нужно хорошо подумать.", "Игорь сначала проверил все детали для поделки, а потом начал клеить."],
  [22, 3, "proverb", "Осторожность, ум и решения", "Поспешишь - людей насмешишь.", "Поспешишь...", "людей насмешишь.", "если слишком торопиться, можно ошибиться.", "Миша не дочитал условие задачи и выбрал неправильное действие."],
  [23, 3, "proverb", "Осторожность, ум и решения", "Тише едешь - дальше будешь.", "Тише едешь...", "дальше будешь.", "спокойная и аккуратная работа часто приводит к лучшему результату.", "Лера писала медленнее других, зато сделала работу без ошибок."],
  [24, 3, "proverb", "Осторожность, ум и решения", "Слово не воробей: вылетит - не поймаешь.", "Слово не воробей...", "вылетит - не поймаешь.", "сказанное слово нельзя вернуть, поэтому нужно думать перед тем, как говорить.", "Даша сказала подруге обидное слово, а потом пожалела."],
  [25, 3, "proverb", "Осторожность, ум и решения", "Не зная броду, не суйся в воду.", "Не зная броду...", "не суйся в воду.", "не начинай опасное или незнакомое дело без подготовки.", "Рома хотел включить незнакомую программу, но сначала спросил взрослого."],
  [26, 3, "proverb", "Осторожность, ум и решения", "Где тонко, там и рвётся.", "Где тонко...", "там и рвётся.", "слабое место чаще всего подводит.", "У Вити плохо держался ремешок на рюкзаке, и именно он порвался по дороге."],
  [27, 3, "proverb", "Осторожность, ум и решения", "У страха глаза велики.", "У страха...", "глаза велики.", "когда человек боится, проблема кажется больше, чем она есть.", "Ваня боялся отвечать у доски, но начал говорить и понял, что знает тему."],
  [28, 3, "proverb", "Осторожность, ум и решения", "Шила в мешке не утаишь.", "Шила в мешке...", "не утаишь.", "правду трудно скрыть.", "Ребенок спрятал испорченный дневник, но учитель все равно заметил."],
  [29, 3, "proverb", "Осторожность, ум и решения", "За двумя зайцами погонишься - ни одного не поймаешь.", "За двумя зайцами погонишься...", "ни одного не поймаешь.", "если делать сразу слишком много, можно не успеть ничего.", "Саша хотел одновременно делать поделку, смотреть мультфильм и учить стих."],
  [30, 3, "proverb", "Осторожность, ум и решения", "Лучше один раз увидеть, чем сто раз услышать.", "Лучше один раз увидеть...", "чем сто раз услышать.", "увидеть самому часто полезнее, чем много раз слушать рассказы.", "После экскурсии в музей дети лучше поняли тему о старинных вещах."],
  [31, 4, "proverb", "Ответственность, честность и поступки", "Что посеешь, то и пожнёшь.", "Что посеешь...", "то и пожнёшь.", "поступки имеют последствия.", "Петя часто грубил ребятам, и потом с ним не захотели играть."],
  [32, 4, "proverb", "Ответственность, честность и поступки", "Любишь кататься - люби и саночки возить.", "Любишь кататься...", "люби и саночки возить.", "если хочешь радости или результата, будь готов к усилиям.", "Дети катались с горки, а потом сами отнесли санки домой."],
  [33, 4, "proverb", "Ответственность, честность и поступки", "Сделал дело - гуляй смело.", "Сделал дело...", "гуляй смело.", "сначала выполни обязанность, потом отдыхай спокойно.", "Катя выучила стихотворение и только потом включила игру."],
  [34, 4, "proverb", "Ответственность, честность и поступки", "Дал слово - держи.", "Дал слово...", "держи.", "обещания нужно выполнять.", "Артем обещал принести другу книгу и принес ее на следующий день."],
  [35, 4, "proverb", "Ответственность, честность и поступки", "Правда глаза колет.", "Правда...", "глаза колет.", "правду бывает неприятно слышать.", "Учитель сказал, что работа написана неаккуратно, и ученику стало обидно, но замечание было справедливым."],
  [36, 4, "proverb", "Ответственность, честность и поступки", "Лучше горькая правда, чем сладкая ложь.", "Лучше горькая правда...", "чем сладкая ложь.", "честность лучше приятного обмана.", "Марина честно призналась, что разбила чашку, хотя боялась разговора."],
  [37, 4, "proverb", "Ответственность, честность и поступки", "Тайное всегда становится явным.", "Тайное всегда...", "становится явным.", "скрытые поступки часто раскрываются.", "Ребенок взял чужой ластик и спрятал, но одноклассник узнал свою вещь."],
  [38, 4, "proverb", "Ответственность, честность и поступки", "На ошибках учатся.", "На ошибках...", "учатся.", "ошибка может помочь стать умнее, если сделать вывод.", "Рома сделал ошибку в диктанте, разобрал ее и в следующий раз написал правильно."],
  [39, 4, "proverb", "Ответственность, честность и поступки", "Не ошибается тот, кто ничего не делает.", "Не ошибается тот...", "кто ничего не делает.", "ошибки бывают у тех, кто пробует и действует.", "Лиза боялась рисовать, чтобы не ошибиться, но учитель объяснил, что пробовать важно."],
  [40, 4, "proverb", "Ответственность, честность и поступки", "Сам кашу заварил, сам и расхлёбывай.", "Сам кашу заварил...", "сам и расхлёбывай.", "если сам создал проблему, нужно отвечать за последствия.", "Мальчик разбросал игрушки, а потом сам убирал комнату."],
  [41, 5, "phrase", "Честность и чужие вещи", "Чужое брать - беду накликивать.", "Чужое брать...", "беду накликивать.", "если взять чужую вещь без разрешения, будут неприятные последствия: стыд, потеря доверия, разговор с взрослыми.", "Дима увидел на парте красивую ручку и взял ее себе. Потом хозяин ручки расстроился, а учитель стал выяснять, кто ее взял."],
  [42, 5, "proverb", "Честность и чужие вещи", "Чужого не бери, своего не теряй.", "Чужого не бери...", "своего не теряй.", "нельзя брать чужое, а за своими вещами нужно следить.", "Маша нашла в раздевалке чужую заколку и отнесла ее учителю."],
  [43, 5, "proverb", "Честность и чужие вещи", "На чужой каравай рот не разевай.", "На чужой каравай...", "рот не разевай.", "нельзя хотеть забрать себе то, что принадлежит другому.", "Саша увидел у друга новый набор фломастеров и стал просить отдать их ему навсегда."],
  [44, 5, "proverb", "Честность и чужие вещи", "Чужим добром не разбогатеешь.", "Чужим добром...", "не разбогатеешь.", "взятая чужая вещь не принесет настоящей пользы, а только испортит доверие.", "Коля взял чужой значок и хотел оставить себе, но радости не было: он боялся, что все узнают."],
  [45, 5, "proverb", "Честность и чужие вещи", "Доброе имя дороже богатства.", "Доброе имя...", "дороже богатства.", "честность и доверие важнее вещей.", "Мальчику очень понравился чужой брелок, но он не стал брать его без разрешения."],
  [46, 5, "proverb", "Честность и чужие вещи", "Ворованным добром не похвалишься.", "Ворованным добром...", "не похвалишься.", "чужая вещь не приносит настоящей радости, потому что взята нечестно.", "Ребенок взял чужую игрушку, но не мог спокойно играть, потому что понимал: вещь не его."],
  [47, 5, "proverb", "Честность и чужие вещи", "Не зарься на чужое.", "Не зарься...", "на чужое.", "не нужно завидовать чужим вещам и пытаться их забрать.", "У Паши был красивый пенал, и Витя хотел взять его себе, но понял, что это неправильно."],
  [48, 5, "phrase", "Честность и чужие вещи", "Бери свое, а чужое не тронь.", "Бери свое...", "а чужое не тронь.", "можно пользоваться своими вещами, а чужие брать только с разрешения.", "На парте лежали два карандаша. Миша взял только свой, а чужой оставил на месте."],
  [49, 6, "proverb", "Семья, дом и забота", "В гостях хорошо, а дома лучше.", "В гостях хорошо...", "а дома лучше.", "дома человеку обычно спокойнее и уютнее.", "После поездки Вика радовалась, что вернулась домой к своим игрушкам и кровати."],
  [50, 6, "proverb", "Семья, дом и забота", "При солнышке тепло, при матери добро.", "При солнышке тепло...", "при матери добро.", "рядом с мамой ребенку тепло и спокойно.", "Мама обняла сына после трудного дня, и ему стало легче."],
  [51, 6, "proverb", "Семья, дом и забота", "Вся семья вместе, так и душа на месте.", "Вся семья вместе...", "так и душа на месте.", "когда близкие рядом и дружны, человеку спокойно.", "Вечером вся семья собралась за столом, и дома стало особенно уютно."],
  [52, 6, "proverb", "Семья, дом и забота", "Дома и стены помогают.", "Дома и стены...", "помогают.", "в родном месте человеку легче и спокойнее.", "Перед конкурсом Лера тренировалась дома и чувствовала себя увереннее."],
  [53, 6, "proverb", "Семья, дом и забота", "Каково на дому, таково и самому.", "Каково на дому...", "таково и самому.", "порядок и настроение дома влияют на человека.", "Когда в комнате стало чисто, Ване стало легче делать уроки."],
  [54, 7, "proverb", "Речь, книги и знания", "Книга - лучший друг.", "Книга...", "лучший друг.", "книга учит, помогает думать и узнавать новое.", "Мальчик прочитал книгу о космосе и узнал много нового."],
  [55, 7, "proverb", "Речь, книги и знания", "Книга мала, а ума придала.", "Книга мала...", "а ума придала.", "даже небольшая книга может многому научить.", "Тонкая книжка помогла девочке понять, как ухаживать за растениями."],
  [56, 7, "proverb", "Речь, книги и знания", "Сказанное слово - серебро, а молчание - золото.", "Сказанное слово - серебро...", "а молчание - золото.", "иногда лучше промолчать, чем сказать лишнее.", "Коля хотел перебить друга, но решил дослушать его до конца."],
  [57, 7, "proverb", "Речь, книги и знания", "Красна птица пером, а человек умом.", "Красна птица пером...", "а человек умом.", "человека ценят не только за внешность, а за ум и поступки.", "Девочка выбрала для конкурса не самый яркий костюм, зато хорошо подготовила рассказ."],
  [58, 7, "proverb", "Речь, книги и знания", "Не красна изба углами, а красна пирогами.", "Не красна изба углами...", "а красна пирогами.", "дом хорош не внешним видом, а гостеприимством и добротой.", "В гостях было просто, но хозяева были такими добрыми, что всем понравилось."],
  [59, 8, "proverb", "Природа, наблюдательность и жизнь", "Лес рубят - щепки летят.", "Лес рубят...", "щепки летят.", "большие дела иногда имеют неприятные последствия.", "Во время ремонта в классе стало шумно и пыльно, но потом кабинет стал красивым."],
  [60, 8, "proverb", "Природа, наблюдательность и жизнь", "Цыплят по осени считают.", "Цыплят по осени...", "считают.", "результат оценивают в конце дела, а не заранее.", "Команда радовалась в начале игры, но победителя узнали только после финального счета."],
  [61, 8, "proverb", "Природа, наблюдательность и жизнь", "Весна красна цветами, а осень - плодами.", "Весна красна цветами...", "а осень - плодами.", "у каждого времени есть своя польза и красота.", "Весной дети любовались цветами, а осенью собирали яблоки."],
  [62, 8, "proverb", "Природа, наблюдательность и жизнь", "Мал золотник, да дорог.", "Мал золотник...", "да дорог.", "маленькая вещь или маленькое дело может быть очень ценным.", "Коля думал, что маленькая роль в спектакле неважная, но без нее сцена не получалась."],
  [63, 8, "proverb", "Природа, наблюдательность и жизнь", "Яблоко от яблони недалеко падает.", "Яблоко от яблони...", "недалеко падает.", "дети часто похожи на родителей.", "Мама хорошо рисует, и сын тоже очень любит рисовать."],
  [64, 9, "proverb", "Простые полезные поговорки для жизни", "Лучше поздно, чем никогда.", "Лучше поздно...", "чем никогда.", "лучше сделать дело позже, чем не сделать совсем.", "Ваня поздно начал готовить открытку, но все же успел поздравить бабушку."],
  [65, 9, "proverb", "Простые полезные поговорки для жизни", "Всё хорошо в меру.", "Всё хорошо...", "в меру.", "даже хорошего не должно быть слишком много.", "Маша любила конфеты, но поняла, что много сладкого вредно."],
  [66, 9, "proverb", "Простые полезные поговорки для жизни", "Делай добро и бросай его в воду.", "Делай добро...", "и бросай его в воду.", "делай добрые дела не ради награды.", "Мальчик помог пожилому человеку донести сумку и не ждал похвалы."],
  [67, 9, "proverb", "Простые полезные поговорки для жизни", "Глаза боятся, а руки делают.", "Глаза боятся...", "а руки делают.", "сначала дело кажется трудным, но если начать, получится.", "Лиза боялась большой аппликации, но начала с первого листочка и постепенно сделала всю работу."],
  [68, 9, "proverb", "Простые полезные поговорки для жизни", "Не откладывай на завтра то, что можно сделать сегодня.", "Не откладывай на завтра...", "то, что можно сделать сегодня.", "важные дела лучше не переносить без причины.", "Вика весь вечер откладывала уборку портфеля, а утром не нашла тетрадь."]
].map(([id, level, kind, theme, text, start, ending, meaning, situation]) => ({
  id,
  level,
  kind,
  theme,
  text,
  start,
  ending,
  meaning,
  situation
}));

const FUN_BREAK_ITEMS = [
  { id: 1, type: "anekdot", title: "Анекдот на перемене", text: "Учитель спрашивает: \"Почему ты опоздал?\" Ученик отвечает: \"Я шел медленно, чтобы не устать до урока\".", answer: "", tag: "школа", tone: "funny", showAfter: "any", weight: 4, isActive: true },
  { id: 2, type: "anekdot", title: "Анекдот на перемене", text: "Мама спрашивает: \"Ты сделал уроки?\" Сын отвечает: \"Почти. Я уже открыл тетрадь\".", answer: "", tag: "школа", tone: "funny", showAfter: "any", weight: 4, isActive: true },
  { id: 3, type: "anekdot", title: "Анекдот на перемене", text: "Учитель сказал: \"Откройте учебники\". Петя открыл и прошептал: \"Ну что, учебник, выручай\".", answer: "", tag: "школа", tone: "funny", showAfter: "any", weight: 5, isActive: true },
  { id: 4, type: "anekdot", title: "Анекдот на перемене", text: "Папа спросил: \"Почему ты так долго решаешь задачу?\" Сын ответил: \"Она сама не решается, приходится уговаривать\".", answer: "", tag: "математика", tone: "funny", showAfter: "any", weight: 5, isActive: true },
  { id: 5, type: "anekdot", title: "Анекдот на перемене", text: "Учитель спрашивает: \"Что такое перемена?\" Ученик отвечает: \"Это когда стул отдыхает от ученика\".", answer: "", tag: "школа", tone: "funny", showAfter: "any", weight: 4, isActive: true },
  { id: 6, type: "anekdot", title: "Анекдот на перемене", text: "Бабушка спрашивает: \"Ты прочитал книгу?\" Внук отвечает: \"Да, я уже познакомился с обложкой\".", answer: "", tag: "чтение", tone: "funny", showAfter: "any", weight: 3, isActive: true },
  { id: 7, type: "anekdot", title: "Анекдот на перемене", text: "Мама спрашивает: \"Почему тетрадь такая мятая?\" Сын отвечает: \"Она волновалась перед проверкой\".", answer: "", tag: "школа", tone: "funny", showAfter: "any", weight: 4, isActive: true },
  { id: 8, type: "anekdot", title: "Анекдот на перемене", text: "Учитель спрашивает: \"Кто готов отвечать?\" В классе стало так тихо, что было слышно, как думает карандаш.", answer: "", tag: "школа", tone: "funny", showAfter: "any", weight: 4, isActive: true },
  { id: 9, type: "anekdot", title: "Анекдот на перемене", text: "Мама сказала: \"Пора повторять таблицу умножения\". Сын ответил: \"Она и так повторяется каждый день\".", answer: "", tag: "математика", tone: "funny", showAfter: "any", weight: 4, isActive: true },
  { id: 10, type: "anekdot", title: "Анекдот на перемене", text: "Петя сказал: \"Я сегодня быстро сделал задание\". Мама спросила: \"И как?\" Петя ответил: \"Быстро\".", answer: "", tag: "школа", tone: "funny", showAfter: "any", weight: 3, isActive: true },
  { id: 11, type: "joke", title: "Шутка из Академии", text: "Учебник математики сказал тетради: \"Не переживай, мы все решим\".", answer: "", tag: "математика", tone: "funny", showAfter: "any", weight: 5, isActive: true },
  { id: 12, type: "joke", title: "Шутка из Академии", text: "Ластик сказал карандашу: \"Ошибайся смело, я рядом\".", answer: "", tag: "школа", tone: "kind", showAfter: "after_error", weight: 5, isActive: true },
  { id: 13, type: "joke", title: "Шутка из Академии", text: "Книга сказала закладке: \"Не уходи, без тебя я потеряю место\".", answer: "", tag: "чтение", tone: "funny", showAfter: "any", weight: 5, isActive: true },
  { id: 14, type: "joke", title: "Шутка из Академии", text: "Ноль посмотрел на восьмерку и сказал: \"Красивый ремень!\"", answer: "", tag: "математика", tone: "funny", showAfter: "any", weight: 5, isActive: true },
  { id: 15, type: "joke", title: "Шутка из Академии", text: "Дневник сказал пятерке: \"Заходи почаще!\"", answer: "", tag: "школа", tone: "funny", showAfter: "after_success", weight: 5, isActive: true },
  { id: 16, type: "joke", title: "Шутка из Академии", text: "Линейка всегда говорит прямо.", answer: "", tag: "математика", tone: "funny", showAfter: "any", weight: 4, isActive: true },
  { id: 17, type: "joke", title: "Шутка из Академии", text: "Будильник думает, что командует утром.", answer: "", tag: "время", tone: "funny", showAfter: "any", weight: 4, isActive: true },
  { id: 18, type: "joke", title: "Шутка из Академии", text: "Рюкзак мечтал стать легче, но знания оказались важнее.", answer: "", tag: "школа", tone: "funny", showAfter: "any", weight: 3, isActive: true },
  { id: 19, type: "joke", title: "Шутка из Академии", text: "Часы не бегают, но все равно всегда идут.", answer: "", tag: "время", tone: "funny", showAfter: "any", weight: 4, isActive: true },
  { id: 20, type: "joke", title: "Шутка из Академии", text: "Кот лег на книгу и решил, что теперь он ученый.", answer: "", tag: "животные", tone: "funny", showAfter: "any", weight: 5, isActive: true },
  { id: 21, type: "joke", title: "Шутка из Академии", text: "Собака выучила команду \"сидеть\" и решила, что урок окончен.", answer: "", tag: "животные", tone: "funny", showAfter: "any", weight: 5, isActive: true },
  { id: 22, type: "joke", title: "Шутка из Академии", text: "Черепаха не опаздывает. Она просто идет в своем темпе.", answer: "", tag: "животные", tone: "kind", showAfter: "any", weight: 4, isActive: true },
  { id: 23, type: "joke", title: "Шутка из Академии", text: "Заяц так быстро делал зарядку, что сам себя обогнал.", answer: "", tag: "животные", tone: "funny", showAfter: "any", weight: 4, isActive: true },
  { id: 24, type: "joke", title: "Шутка из Академии", text: "Мороженое хотело погулять, но слишком быстро растаяло от счастья.", answer: "", tag: "лето", tone: "funny", showAfter: "any", weight: 4, isActive: true },
  { id: 25, type: "joke", title: "Шутка из Академии", text: "Дождик стучал по окну, потому что хотел зайти на чай.", answer: "", tag: "природа", tone: "funny", showAfter: "any", weight: 3, isActive: true },
  { id: 26, type: "dialogue", title: "Веселый диалог", text: "\"Почему ручка устала?\" - \"Сегодня у нее был письменный марафон\".", answer: "", tag: "школа", tone: "funny", showAfter: "any", weight: 4, isActive: true },
  { id: 27, type: "dialogue", title: "Веселый диалог", text: "\"Почему книга не скучает?\" - \"Внутри нее всегда кто-то приключается\".", answer: "", tag: "чтение", tone: "funny", showAfter: "any", weight: 4, isActive: true },
  { id: 28, type: "dialogue", title: "Веселый диалог", text: "\"Что делает задача после решения?\" - \"Отдыхает в правильном ответе\".", answer: "", tag: "математика", tone: "funny", showAfter: "after_success", weight: 4, isActive: true },
  { id: 29, type: "dialogue", title: "Веселый диалог", text: "\"Почему кот сел на тетрадь?\" - \"Хотел получить мягкую оценку\".", answer: "", tag: "животные", tone: "funny", showAfter: "any", weight: 4, isActive: true },
  { id: 30, type: "dialogue", title: "Веселый диалог", text: "\"Почему облако не пришло на урок?\" - \"Его унесло ветром\".", answer: "", tag: "природа", tone: "funny", showAfter: "any", weight: 3, isActive: true },
  { id: 31, type: "dialogue", title: "Веселый диалог", text: "\"Почему карандаш такой острый?\" - \"Он готов к новым идеям\".", answer: "", tag: "школа", tone: "funny", showAfter: "any", weight: 3, isActive: true },
  { id: 32, type: "dialogue", title: "Веселый диалог", text: "\"Почему пенал всегда спокойный?\" - \"У него все разложено по местам\".", answer: "", tag: "школа", tone: "funny", showAfter: "any", weight: 4, isActive: true },
  { id: 33, type: "dialogue", title: "Веселый диалог", text: "\"Почему тетрадь любит порядок?\" - \"В клеточку жить удобнее\".", answer: "", tag: "школа", tone: "funny", showAfter: "any", weight: 3, isActive: true },
  { id: 34, type: "dialogue", title: "Веселый диалог", text: "\"Почему воробей не взял портфель?\" - \"У него уроки на ветке\".", answer: "", tag: "животные", tone: "funny", showAfter: "any", weight: 4, isActive: true },
  { id: 35, type: "dialogue", title: "Веселый диалог", text: "\"Почему сова хорошо учится ночью?\" - \"У нее вечерняя Академия\".", answer: "", tag: "животные", tone: "funny", showAfter: "any", weight: 4, isActive: true },
  { id: 36, type: "riddle", title: "Загадка на перемене", text: "Не куст, а с листочками. Не человек, а рассказывает.", answer: "книга", tag: "загадка", tone: "curious", showAfter: "any", weight: 4, isActive: true },
  { id: 37, type: "riddle", title: "Загадка на перемене", text: "В клетку и в линейку, а живет в портфеле.", answer: "тетрадь", tag: "загадка", tone: "curious", showAfter: "any", weight: 4, isActive: true },
  { id: 38, type: "riddle", title: "Загадка на перемене", text: "Идет, но с места не сходит.", answer: "часы", tag: "загадка", tone: "curious", showAfter: "any", weight: 4, isActive: true },
  { id: 39, type: "riddle", title: "Загадка на перемене", text: "Домик для ручек, карандашей и ластика.", answer: "пенал", tag: "загадка", tone: "curious", showAfter: "any", weight: 4, isActive: true },
  { id: 40, type: "riddle", title: "Загадка на перемене", text: "Белое поле, черные следы.", answer: "тетрадь", tag: "загадка", tone: "curious", showAfter: "any", weight: 3, isActive: true },
  { id: 41, type: "riddle", title: "Загадка на перемене", text: "С хвостом, но не мышка. Пишет, но не человек.", answer: "ручка", tag: "загадка", tone: "curious", showAfter: "any", weight: 4, isActive: true },
  { id: 42, type: "riddle", title: "Загадка на перемене", text: "Зимой и летом одним цветом.", answer: "ель", tag: "загадка", tone: "curious", showAfter: "any", weight: 3, isActive: true },
  { id: 43, type: "riddle", title: "Загадка на перемене", text: "Дует, свистит, но его не видно.", answer: "ветер", tag: "загадка", tone: "curious", showAfter: "any", weight: 4, isActive: true },
  { id: 44, type: "riddle", title: "Загадка на перемене", text: "Круглое, румяное, с дерева упало.", answer: "яблоко", tag: "загадка", tone: "curious", showAfter: "any", weight: 4, isActive: true },
  { id: 45, type: "riddle", title: "Загадка на перемене", text: "У него есть шляпка, но нет головы.", answer: "гриб", tag: "загадка", tone: "curious", showAfter: "any", weight: 4, isActive: true },
  { id: 46, type: "riddle", title: "Загадка на перемене", text: "Без рук, без ног, а ворота открывает.", answer: "ветер", tag: "загадка", tone: "curious", showAfter: "any", weight: 3, isActive: true },
  { id: 47, type: "riddle", title: "Загадка на перемене", text: "Кто на себе дом носит?", answer: "улитка", tag: "загадка", tone: "curious", showAfter: "any", weight: 4, isActive: true },
  { id: 48, type: "riddle", title: "Загадка на перемене", text: "Сидит дед, во сто шуб одет. Кто его раздевает, тот слезы проливает.", answer: "лук", tag: "загадка", tone: "curious", showAfter: "any", weight: 3, isActive: true },
  { id: 49, type: "riddle", title: "Загадка на перемене", text: "Что становится больше, если его перевернуть?", answer: "число 6", tag: "загадка", tone: "curious", showAfter: "any", weight: 4, isActive: true },
  { id: 50, type: "riddle", title: "Загадка на перемене", text: "Что можно увидеть с закрытыми глазами?", answer: "сон", tag: "загадка", tone: "curious", showAfter: "any", weight: 4, isActive: true },
  { id: 51, type: "tongue_twister", title: "Скороговорка дня", text: "Шла Саша по шоссе и сосала сушку.", answer: "", tag: "речь", tone: "movement", showAfter: "any", weight: 3, isActive: true },
  { id: 52, type: "tongue_twister", title: "Скороговорка дня", text: "У ежа ежата, у ужа ужата.", answer: "", tag: "речь", tone: "movement", showAfter: "any", weight: 3, isActive: true },
  { id: 53, type: "tongue_twister", title: "Скороговорка дня", text: "На дворе трава, на траве дрова.", answer: "", tag: "речь", tone: "movement", showAfter: "any", weight: 3, isActive: true },
  { id: 54, type: "tongue_twister", title: "Скороговорка дня", text: "От топота копыт пыль по полю летит.", answer: "", tag: "речь", tone: "movement", showAfter: "any", weight: 2, isActive: true },
  { id: 55, type: "tongue_twister", title: "Скороговорка дня", text: "Купила бабуся бусы Марусе.", answer: "", tag: "речь", tone: "movement", showAfter: "any", weight: 3, isActive: true },
  { id: 56, type: "tongue_twister", title: "Скороговорка дня", text: "Три сороки тараторки тараторили на горке.", answer: "", tag: "речь", tone: "movement", showAfter: "any", weight: 3, isActive: true },
  { id: 57, type: "tongue_twister", title: "Скороговорка дня", text: "У четырех черепашек четыре черепашонка.", answer: "", tag: "речь", tone: "movement", showAfter: "any", weight: 2, isActive: true },
  { id: 58, type: "tongue_twister", title: "Скороговорка дня", text: "Ехал Грека через реку, видит Грека в реке рак.", answer: "", tag: "речь", tone: "movement", showAfter: "any", weight: 2, isActive: true },
  { id: 59, type: "tongue_twister", title: "Скороговорка дня", text: "Вез корабль карамель, наскочил корабль на мель.", answer: "", tag: "речь", tone: "movement", showAfter: "any", weight: 2, isActive: true },
  { id: 60, type: "tongue_twister", title: "Скороговорка дня", text: "Рыбу ловит рыболов, весь в реку уплыл улов.", answer: "", tag: "речь", tone: "movement", showAfter: "any", weight: 2, isActive: true },
  { id: 61, type: "fact", title: "Веселый факт", text: "Пингвины - птицы, но летать они не умеют. Зато отлично плавают.", answer: "", tag: "животные", tone: "curious", showAfter: "any", weight: 3, isActive: true },
  { id: 62, type: "fact", title: "Веселый факт", text: "Улитка носит свой домик с собой.", answer: "", tag: "животные", tone: "curious", showAfter: "any", weight: 3, isActive: true },
  { id: 63, type: "fact", title: "Веселый факт", text: "Снежинки бывают разной формы, и найти две совсем одинаковые очень трудно.", answer: "", tag: "природа", tone: "curious", showAfter: "any", weight: 3, isActive: true },
  { id: 64, type: "fact", title: "Веселый факт", text: "На Луне следы могут сохраняться очень долго, потому что там нет ветра и дождя.", answer: "", tag: "космос", tone: "curious", showAfter: "any", weight: 3, isActive: true },
  { id: 65, type: "fact", title: "Веселый факт", text: "Радуга появляется, когда солнечный свет проходит через капли воды.", answer: "", tag: "природа", tone: "curious", showAfter: "any", weight: 3, isActive: true },
  { id: 66, type: "fact", title: "Веселый факт", text: "Деревья дают тень, очищают воздух и делают город красивее.", answer: "", tag: "природа", tone: "curious", showAfter: "any", weight: 2, isActive: true },
  { id: 67, type: "fact", title: "Веселый факт", text: "Сердце работает днем и ночью, даже когда человек спит.", answer: "", tag: "человек", tone: "curious", showAfter: "any", weight: 2, isActive: true },
  { id: 68, type: "fact", title: "Веселый факт", text: "Жираф высокий, но шейных позвонков у него столько же, сколько у человека.", answer: "", tag: "животные", tone: "curious", showAfter: "any", weight: 3, isActive: true },
  { id: 69, type: "fact", title: "Веселый факт", text: "Осьминог умеет менять цвет, чтобы прятаться.", answer: "", tag: "животные", tone: "curious", showAfter: "any", weight: 3, isActive: true },
  { id: 70, type: "fact", title: "Веселый факт", text: "У бабочек вкус помогают чувствовать лапки.", answer: "", tag: "животные", tone: "curious", showAfter: "any", weight: 3, isActive: true },
  { id: 71, type: "support", title: "Минутка поддержки", text: "Ошибка - это не провал, а подсказка, что повторить.", answer: "", tag: "поддержка", tone: "kind", showAfter: "after_error", weight: 5, isActive: true },
  { id: 72, type: "support", title: "Минутка поддержки", text: "Даже маленький шаг вперед - это уже победа.", answer: "", tag: "поддержка", tone: "kind", showAfter: "after_success", weight: 5, isActive: true },
  { id: 73, type: "support", title: "Минутка поддержки", text: "Не обязательно знать сразу. Важно пробовать.", answer: "", tag: "поддержка", tone: "kind", showAfter: "after_error", weight: 5, isActive: true },
  { id: 74, type: "support", title: "Минутка поддержки", text: "Сложное становится легче, когда тренируешься.", answer: "", tag: "поддержка", tone: "kind", showAfter: "after_error", weight: 5, isActive: true },
  { id: 75, type: "support", title: "Минутка поддержки", text: "Ты не обязан спешить. Главное - понимать.", answer: "", tag: "поддержка", tone: "calm", showAfter: "after_error", weight: 5, isActive: true },
  { id: 76, type: "support", title: "Минутка поддержки", text: "У тебя получается лучше каждый раз, когда ты пробуешь.", answer: "", tag: "поддержка", tone: "kind", showAfter: "after_success", weight: 5, isActive: true },
  { id: 77, type: "support", title: "Минутка поддержки", text: "Хорошая работа начинается с одной внимательной попытки.", answer: "", tag: "поддержка", tone: "kind", showAfter: "any", weight: 4, isActive: true },
  { id: 78, type: "support", title: "Минутка поддержки", text: "Отдохни немного, и мозг снова будет готов к приключениям.", answer: "", tag: "поддержка", tone: "calm", showAfter: "any", weight: 4, isActive: true },
  { id: 79, type: "support", title: "Минутка поддержки", text: "Ты уже сделал часть пути. Продолжаем спокойно.", answer: "", tag: "поддержка", tone: "calm", showAfter: "any", weight: 4, isActive: true },
  { id: 80, type: "support", title: "Минутка поддержки", text: "Сегодня твоя внимательность стала сильнее.", answer: "", tag: "поддержка", tone: "kind", showAfter: "after_session", weight: 4, isActive: true },
  { id: 81, type: "support", title: "Минутка поддержки", text: "Ошибки не мешают учиться. Они помогают увидеть, где потренироваться.", answer: "", tag: "поддержка", tone: "kind", showAfter: "after_error", weight: 5, isActive: true },
  { id: 82, type: "support", title: "Минутка поддержки", text: "Не сдавайся после трудного задания. Мозг любит тренировки.", answer: "", tag: "поддержка", tone: "kind", showAfter: "after_error", weight: 4, isActive: true },
  { id: 83, type: "support", title: "Минутка поддержки", text: "Ты молодец, что дошел до этой перемены.", answer: "", tag: "поддержка", tone: "kind", showAfter: "any", weight: 4, isActive: true },
  { id: 84, type: "support", title: "Минутка поддержки", text: "Знания растут не сразу, а по маленьким шагам.", answer: "", tag: "поддержка", tone: "calm", showAfter: "any", weight: 4, isActive: true },
  { id: 85, type: "support", title: "Минутка поддержки", text: "Если было сложно, значит мозг хорошо потренировался.", answer: "", tag: "поддержка", tone: "kind", showAfter: "after_error", weight: 5, isActive: true },
  { id: 86, type: "micro_break", title: "Мини-перемена", text: "Потянись вверх, будто ты высокая береза.", answer: "", tag: "движение", tone: "movement", showAfter: "any", weight: 2, isActive: true },
  { id: 87, type: "micro_break", title: "Мини-перемена", text: "Моргни как сова и улыбнись как кот.", answer: "", tag: "движение", tone: "movement", showAfter: "any", weight: 2, isActive: true },
  { id: 88, type: "micro_break", title: "Мини-перемена", text: "Найди вокруг себя что-то круглое.", answer: "", tag: "внимание", tone: "movement", showAfter: "any", weight: 2, isActive: true },
  { id: 89, type: "micro_break", title: "Мини-перемена", text: "Найди вокруг себя предмет, в названии которого есть буква о.", answer: "", tag: "внимание", tone: "movement", showAfter: "any", weight: 2, isActive: true },
  { id: 90, type: "micro_break", title: "Мини-перемена", text: "Посчитай до пяти очень медленно, как черепаха.", answer: "", tag: "внимание", tone: "calm", showAfter: "any", weight: 2, isActive: true },
  { id: 91, type: "micro_break", title: "Мини-перемена", text: "Сделай три тихих хлопка и один большой вдох.", answer: "", tag: "движение", tone: "movement", showAfter: "any", weight: 2, isActive: true },
  { id: 92, type: "micro_break", title: "Мини-перемена", text: "Посмотри налево, направо и найди предмет синего цвета.", answer: "", tag: "внимание", tone: "movement", showAfter: "any", weight: 2, isActive: true },
  { id: 93, type: "micro_break", title: "Мини-перемена", text: "Сделай глубокий вдох и скажи: \"Продолжаем!\"", answer: "", tag: "движение", tone: "calm", showAfter: "any", weight: 2, isActive: true },
  { id: 94, type: "micro_break", title: "Мини-перемена", text: "Сожми и разожми пальцы 5 раз, будто просыпаются ладошки.", answer: "", tag: "движение", tone: "movement", showAfter: "any", weight: 2, isActive: true },
  { id: 95, type: "micro_break", title: "Мини-перемена", text: "Найди глазами самый светлый предмет рядом.", answer: "", tag: "внимание", tone: "calm", showAfter: "any", weight: 2, isActive: true },
  { id: 96, type: "joke", title: "Шутка из Академии", text: "Пятерка пришла в дневник и сказала: \"Я тут надолго\".", answer: "", tag: "школа", tone: "funny", showAfter: "after_success", weight: 5, isActive: true },
  { id: 97, type: "joke", title: "Шутка из Академии", text: "Задача спряталась в учебнике, но внимательный ученик все равно ее нашел.", answer: "", tag: "математика", tone: "funny", showAfter: "any", weight: 3, isActive: true },
  { id: 98, type: "joke", title: "Шутка из Академии", text: "Буква Ё пришла на праздник с двумя точками-конфетти.", answer: "", tag: "русский язык", tone: "funny", showAfter: "any", weight: 3, isActive: true },
  { id: 99, type: "joke", title: "Шутка из Академии", text: "Запятая сказала: \"Давайте сделаем маленькую паузу\". И все согласились.", answer: "", tag: "русский язык", tone: "funny", showAfter: "any", weight: 3, isActive: true },
  { id: 100, type: "dialogue", title: "Веселый диалог", text: "\"Почему перемена такая короткая?\" - \"Потому что знания уже соскучились\".", answer: "", tag: "школа", tone: "funny", showAfter: "any", weight: 4, isActive: true }
];

const READING_TEXT_META = {
  "Трудная задача": { id: "hard_task", theme: "школа и учеба", difficulty: 1 },
  "Помощь на перемене": { id: "recess_help", theme: "дружба и помощь", difficulty: 1 },
  "Найденный брелок": { id: "found_keychain", theme: "честность и чужие вещи", difficulty: 1 },
  "Яблочный пирог": { id: "apple_pie", theme: "семья и забота", difficulty: 1 },
  "Утренняя роса": { id: "morning_dew", theme: "природа и наблюдения", difficulty: 1 },
  "Книга о дельфинах": { id: "dolphin_book", theme: "книги и чтение", difficulty: 1 },
  "Огурчики под листьями": { id: "cucumbers_under_leaves", theme: "летние дела", difficulty: 1 },
  "Забытая сменка": { id: "forgotten_indoor_shoes", theme: "ответственность", difficulty: 1 },
  "Трудное слово": { id: "hard_word", theme: "школа и учеба", difficulty: 1 },
  "Башня из песка": { id: "sand_tower", theme: "дружба и помощь", difficulty: 1 },
  "Синий фломастер": { id: "blue_marker", theme: "честность и чужие вещи", difficulty: 1 },
  "Шнурки": { id: "shoelaces", theme: "семья и забота", difficulty: 1 },
  "Муравьиная работа": { id: "ant_work", theme: "природа и наблюдения", difficulty: 1 },
  "Первая интересная книга": { id: "first_interesting_book", theme: "книги и чтение", difficulty: 1 },
  "Безопасное место": { id: "safe_place", theme: "летние дела", difficulty: 1 },
  "Голодный кот": { id: "hungry_cat", theme: "ответственность", difficulty: 1 },
  "Неровная линия": { id: "uneven_line", theme: "школа и учеба", difficulty: 1 },
  "Сломанная молния": { id: "broken_zipper", theme: "дружба и помощь", difficulty: 1 },
  "Небо в луже": { id: "sky_in_puddle", theme: "природа и наблюдения", difficulty: 1 },
  "Список для портфеля": { id: "backpack_list", theme: "ответственность и порядок", difficulty: 1 }
};

const READING_QUESTION_TYPES = ["detail", "reason", "detail", "sequence", "inference"];

const READING_QUESTION_HINTS = {
  detail: "Найди точную деталь в тексте.",
  reason: "Подумай, почему герой так поступил.",
  sequence: "Восстанови порядок событий по тексту.",
  inference: "Сделай вывод по поступкам героя.",
  title: "Подумай, какое название передает главное.",
  main_idea: "Выбери мысль, ради которой написан текст."
};

const READING_TEXTS = [
  {
    title: "Трудная задача",
    text: "Аня готовилась к контрольной по математике. Сначала она хотела просто пролистать тетрадь, но потом решила решить несколько похожих задач. Одна задача долго не получалась, и Аня попросила маму объяснить условие. На следующий день в классе ей попалась похожая задача. Аня спокойно решила ее и проверила ответ.",
    mainIdea: "Подготовка и старание помогают справиться с трудной работой.",
    questions: [
      ["Что сначала хотела сделать Аня?", "просто пролистать тетрадь"],
      ["Почему Аня попросила маму помочь?", "одна задача долго не получалась"],
      ["Что помогло Ане на контрольной?", "она заранее решала похожие задачи"],
      ["Что было сначала?", "Аня готовилась к контрольной"],
      ["Какой вывод можно сделать о Ане?", "она старательная и не бросает трудное дело"]
    ]
  },
  {
    title: "Помощь на перемене",
    text: "На перемене у Лены рассыпались карандаши. Ребята уже побежали играть, но Миша остановился и помог ей собрать их. Лена улыбнулась и поблагодарила Мишу. После уроков Миша долго искал свою линейку. Лена заметила ее под партой и вернула другу.",
    mainIdea: "Добрые поступки помогают дружбе.",
    questions: [
      ["Что случилось у Лены?", "у нее рассыпались карандаши"],
      ["Что сделал Миша?", "помог Лене собрать карандаши"],
      ["Почему Лена помогла Мише после уроков?", "она тоже захотела помочь другу"],
      ["Что было сначала?", "у Лены рассыпались карандаши"],
      ["Какой Миша по характеру?", "добрый и внимательный"]
    ]
  },
  {
    title: "Найденный брелок",
    text: "В раздевалке Кирилл нашел красивый брелок. Он хотел положить его в карман, но подумал, что кто-то сейчас ищет свою вещь. Кирилл отнес брелок учителю. Через несколько минут за ним пришла девочка из соседнего класса. Она очень обрадовалась и поблагодарила Кирилла.",
    mainIdea: "Чужие вещи нельзя брать себе, их нужно вернуть хозяину.",
    questions: [
      ["Что нашел Кирилл?", "красивый брелок"],
      ["Почему Кирилл не оставил брелок себе?", "он понял, что это чужая вещь"],
      ["Кому Кирилл отнес брелок?", "учителю"],
      ["Что было после этого?", "за брелоком пришла девочка из соседнего класса"],
      ["Какой вывод можно сделать о Кирилле?", "он честный и ответственный"]
    ]
  },
  {
    title: "Яблочный пирог",
    text: "Бабушка собиралась печь пирог, но у нее закончилась мука. Маша заметила, что бабушка расстроилась, и предложила сходить в магазин вместе. По дороге Маша несла легкий пакет, а бабушка - хлеб. Дома они испекли яблочный пирог. Вечером вся семья пила чай и хвалила Машу за помощь.",
    mainIdea: "Близким важно помогать даже в небольших делах.",
    questions: [
      ["Почему бабушка расстроилась?", "у нее закончилась мука"],
      ["Что предложила Маша?", "сходить в магазин вместе"],
      ["Что Маша несла из магазина?", "легкий пакет"],
      ["Что было потом дома?", "они испекли яблочный пирог"],
      ["Какой можно назвать Машу?", "заботливой и внимательной"]
    ]
  },
  {
    title: "Утренняя роса",
    text: "Утром Дима вышел во двор и увидел на траве капли росы. Они блестели на солнце, как маленькие бусинки. Дима хотел сразу пробежать по траве, но остановился и стал рассматривать капли. Он заметил, что на листьях они держатся дольше, чем на дорожке. Потом Дима рассказал об этом младшему брату.",
    mainIdea: "Внимательный человек замечает интересное вокруг себя.",
    questions: [
      ["Что увидел Дима утром?", "капли росы на траве"],
      ["На что были похожи капли росы?", "на маленькие бусинки"],
      ["Почему Дима остановился?", "ему стало интересно рассмотреть росу"],
      ["Где капли держались дольше?", "на листьях"],
      ["Какой Дима по характеру?", "наблюдательный и любознательный"]
    ]
  },
  {
    title: "Книга о дельфинах",
    text: "Саша взял в библиотеке книгу о морских животных. Сначала он выбрал ее из-за яркой обложки. Но уже дома мальчик прочитал о дельфинах и узнал, что они умеют помогать друг другу. На следующий день Саша рассказал об этом в классе. Учитель похвалил его за интересный рассказ.",
    mainIdea: "Чтение открывает человеку новые интересные знания.",
    questions: [
      ["Где Саша взял книгу?", "в библиотеке"],
      ["Почему сначала Саша выбрал эту книгу?", "из-за яркой обложки"],
      ["О ком Саша прочитал дома?", "о дельфинах"],
      ["Что Саша сделал на следующий день?", "рассказал в классе о дельфинах"],
      ["Какой вывод можно сделать?", "книги помогают узнавать новое"]
    ]
  },
  {
    title: "Огурчики под листьями",
    text: "Летом Полина приехала к дедушке в деревню. Каждое утро она поливала грядку с огурцами. Сначала ей казалось, что это скучная работа. Но через несколько дней Полина заметила маленькие огурчики под листьями. Девочка обрадовалась и стала поливать грядку еще аккуратнее.",
    mainIdea: "Когда видишь результат труда, работать становится интереснее.",
    questions: [
      ["Куда Полина приехала летом?", "к дедушке в деревню"],
      ["Что Полина делала каждое утро?", "поливала грядку с огурцами"],
      ["Почему сначала Полине было скучно?", "работа казалась ей однообразной"],
      ["Что Полина заметила через несколько дней?", "маленькие огурчики под листьями"],
      ["Как изменилась Полина?", "она стала аккуратнее"]
    ]
  },
  {
    title: "Забытая сменка",
    text: "Утром Вадим торопился в школу и забыл дома сменную обувь. В классе он расстроился, потому что учитель напомнил о правилах. После уроков Вадим сам положил сменку в рюкзак. Вечером он еще раз проверил портфель. На следующий день мальчик ничего не забыл.",
    mainIdea: "Ответственный человек учится на своих ошибках.",
    questions: [
      ["Что Вадим забыл дома?", "сменную обувь"],
      ["Почему Вадим расстроился?", "учитель напомнил о правилах"],
      ["Что Вадим сделал после уроков?", "сам положил сменку в рюкзак"],
      ["Что он сделал вечером?", "проверил портфель"],
      ["Какой вывод сделал Вадим?", "вещи нужно собирать заранее"]
    ]
  },
  {
    title: "Трудное слово",
    text: "На уроке русского языка учительница дала ребятам словарный диктант. Ира очень волновалась, потому что часто путала слово «праздник». Перед диктантом она тихо повторила трудную букву. Когда это слово прозвучало, Ира написала его правильно. После урока она поняла, что повторение ей помогло.",
    mainIdea: "Трудные слова легче запомнить, если их повторять.",
    questions: [
      ["Какой диктант был на уроке?", "словарный диктант"],
      ["Какое слово путала Ира?", "праздник"],
      ["Что Ира сделала перед диктантом?", "тихо повторила трудную букву"],
      ["Что произошло, когда слово прозвучало?", "Ира написала его правильно"],
      ["Что помогло Ире?", "повторение"]
    ]
  },
  {
    title: "Башня из песка",
    text: "Во дворе ребята строили город из песка. У Пети не получалась высокая башня, и он сердито сломал свою постройку. Оля предложила показать, как сделать стенки крепче. Петя сначала молчал, но потом согласился. Вместе они построили башню выше прежней.",
    mainIdea: "Не стоит сердиться, если можно принять помощь.",
    questions: [
      ["Что строили ребята?", "город из песка"],
      ["Почему Петя рассердился?", "у него не получалась высокая башня"],
      ["Что предложила Оля?", "показать, как сделать стенки крепче"],
      ["Что было после того, как Петя согласился?", "они построили башню выше прежней"],
      ["Какой вывод можно сделать?", "помощь друга может улучшить дело"]
    ]
  },
  {
    title: "Синий фломастер",
    text: "После рисования на столе остались красивые фломастеры. Тимур подумал, что один синий фломастер никто не заметит. Но потом он вспомнил, как сам расстроился, когда потерял любимую ручку. Тимур положил фломастер обратно в коробку. На следующем уроке весь класс снова пользовался полным набором.",
    mainIdea: "Чужую вещь нельзя брать, даже если кажется, что никто не заметит.",
    questions: [
      ["Что осталось на столе после рисования?", "красивые фломастеры"],
      ["Что сначала подумал Тимур?", "что один синий фломастер никто не заметит"],
      ["Почему Тимур передумал?", "он вспомнил свою потерянную ручку"],
      ["Что Тимур сделал с фломастером?", "положил его обратно в коробку"],
      ["Какой Тимур по характеру?", "он смог поступить честно"]
    ]
  },
  {
    title: "Шнурки",
    text: "Младший брат Сони учился завязывать шнурки. У него не получалось, и он чуть не заплакал. Соня хотела быстро завязать шнурки сама, но остановилась. Она медленно показала брату каждый шаг. Через несколько попыток брат завязал шнурок сам и радостно засмеялся.",
    mainIdea: "Настоящая помощь иногда учит, а не делает все за другого.",
    questions: [
      ["Чему учился младший брат Сони?", "завязывать шнурки"],
      ["Почему он чуть не заплакал?", "у него не получалось"],
      ["Почему Соня не стала делать все за него?", "она хотела научить его самому"],
      ["Что Соня показала брату?", "каждый шаг"],
      ["Какой вывод можно сделать о Соне?", "она терпеливая и заботливая"]
    ]
  },
  {
    title: "Муравьиная работа",
    text: "Летом Катя заметила, что муравьи несут к муравейнику маленькие веточки. Она присела рядом и стала наблюдать. Один муравей уронил веточку, но другой помог ему поднять ее. Катя не стала трогать муравейник. Дома она нарисовала муравьев в своем альбоме.",
    mainIdea: "За природой можно наблюдать, не причиняя ей вреда.",
    questions: [
      ["Что несли муравьи?", "маленькие веточки"],
      ["Что сделала Катя?", "присела рядом и стала наблюдать"],
      ["Как один муравей помог другому?", "помог поднять веточку"],
      ["Почему Катя не тронула муравейник?", "она не хотела мешать муравьям"],
      ["Какой Катя по характеру?", "внимательная и бережная к природе"]
    ]
  },
  {
    title: "Первая интересная книга",
    text: "Витя не любил читать длинные рассказы. Однажды учитель дал ему тонкую книгу о мальчике-фантазере. Витя решил прочитать только первую страницу, но история оказалась смешной. Он прочитал еще одну главу, потом еще одну. Через два дня Витя сам попросил в библиотеке похожую книгу.",
    mainIdea: "Интересная книга может помочь полюбить чтение.",
    questions: [
      ["Что Витя не любил читать?", "длинные рассказы"],
      ["Какую книгу дал ему учитель?", "тонкую книгу о мальчике-фантазере"],
      ["Почему Витя продолжил читать?", "история оказалась смешной"],
      ["Что Витя сделал через два дня?", "попросил похожую книгу в библиотеке"],
      ["Как изменилось отношение Вити к чтению?", "ему стало интересно читать"]
    ]
  },
  {
    title: "Безопасное место",
    text: "В жаркий день ребята пошли на речку. Леша хотел сразу прыгнуть в воду, но бабушка попросила сначала проверить место. На берегу оказались острые камни. Ребята перешли чуть дальше, где был песчаный спуск. Там они спокойно купались и играли в мяч.",
    mainIdea: "Осторожность помогает избежать неприятностей.",
    questions: [
      ["Куда пошли ребята в жаркий день?", "на речку"],
      ["Что хотел сделать Леша?", "сразу прыгнуть в воду"],
      ["Почему бабушка попросила проверить место?", "чтобы ребята не попали на опасное место"],
      ["Что нашли на берегу?", "острые камни"],
      ["Какой вывод можно сделать?", "перед новым делом нужно быть осторожным"]
    ]
  },
  {
    title: "Голодный кот",
    text: "Мама попросила Егора покормить кота после обеда. Егор заигрался и вспомнил об этом только вечером. Кот сидел у миски и жалобно мяукал. Егору стало стыдно, и он сразу насыпал корм. На следующий день мальчик поставил напоминание, чтобы больше не забыть.",
    mainIdea: "Ответственность нужна не на словах, а в поступках.",
    questions: [
      ["О чем мама попросила Егора?", "покормить кота после обеда"],
      ["Почему Егор забыл просьбу?", "он заигрался"],
      ["Что делал кот вечером?", "сидел у миски и жалобно мяукал"],
      ["Что Егор сделал на следующий день?", "поставил напоминание"],
      ["Какой вывод можно сделать?", "если тебе доверили дело, его нужно выполнить вовремя"]
    ]
  },
  {
    title: "Неровная линия",
    text: "На уроке труда ребята делали открытки. У Максима получилась неровная линия, и он хотел выбросить лист. Учитель предложил превратить линию в дорожку на рисунке. Максим дорисовал деревья и солнце. Открытка получилась необычной, и мальчик понял, что ошибку можно исправить.",
    mainIdea: "Иногда ошибку можно превратить в удачную идею.",
    questions: [
      ["Что делали ребята на уроке труда?", "открытки"],
      ["Что не получилось у Максима?", "неровная линия"],
      ["Что предложил учитель?", "превратить линию в дорожку"],
      ["Что Максим дорисовал?", "деревья и солнце"],
      ["Какой вывод сделал Максим?", "ошибку можно исправить"]
    ]
  },
  {
    title: "Сломанная молния",
    text: "Утром у Дани сломалась молния на куртке. Он опоздал на зарядку и пришел в класс расстроенный. Его сосед по парте заметил это и тихо спросил, что случилось. После урока ребята вместе подошли к учителю и попросили помочь. Учитель нашел булавку, и Даня смог спокойно пойти домой.",
    mainIdea: "Внимательность к чужой беде помогает человеку почувствовать поддержку.",
    questions: [
      ["Что случилось у Дани утром?", "сломалась молния на куртке"],
      ["Почему Даня пришел расстроенный?", "он опоздал и переживал из-за куртки"],
      ["Кто заметил, что Даня расстроен?", "сосед по парте"],
      ["К кому ребята подошли после урока?", "к учителю"],
      ["Какой был сосед по парте?", "внимательный и отзывчивый"]
    ]
  },
  {
    title: "Небо в луже",
    text: "После дождя на дорожке появились лужи. Маша заметила, что в одной луже отражается небо. Она позвала брата и показала ему облака в воде. Брат хотел наступить в лужу, но Маша попросила его сначала посмотреть. Он наклонился и тоже увидел отражение деревьев.",
    mainIdea: "Наблюдательность помогает видеть красоту в простых вещах.",
    questions: [
      ["Что появилось на дорожке после дождя?", "лужи"],
      ["Что Маша увидела в луже?", "отражение неба"],
      ["Кого Маша позвала?", "брата"],
      ["Что хотел сделать брат?", "наступить в лужу"],
      ["Какой вывод можно сделать?", "обычные вещи могут стать интересными"]
    ]
  },
  {
    title: "Список для портфеля",
    text: "Перед сном Лиза собирала портфель. Она положила учебники, пенал и дневник, но забыла спортивную форму. Утром девочка увидела пакет у двери и вспомнила про физкультуру. Лиза быстро положила форму в рюкзак. После школы она решила составить список вещей на каждый день.",
    mainIdea: "Порядок и проверка помогают быть собранным.",
    questions: [
      ["Что Лиза собирала перед сном?", "портфель"],
      ["Что она забыла положить?", "спортивную форму"],
      ["Когда Лиза вспомнила про форму?", "утром"],
      ["Что Лиза решила сделать после школы?", "составить список вещей"],
      ["Какой вывод можно сделать?", "список помогает ничего не забыть"]
    ]
  }
].map((item, index) => normalizeReadingText(item, index));

const MATH_STORY_TASKS = [
  ["задача на сложение", "У Кати было 24 наклейки. Мама подарила ей еще 8 наклеек. Сколько наклеек стало у Кати?", 32, "Нужно узнать, сколько стало всего.", "addition", 1, ["addition"], 1, "сложение"],
  ["задача на сложение", "В коробке лежало 35 карандашей. Учитель положил туда еще 12 карандашей. Сколько карандашей стало в коробке?", 47, "Карандашей стало больше, значит нужно сложить.", "addition", 1, ["addition"], 1, "сложение"],
  ["задача на сложение", "На полке стояло 18 книг. Бабушка поставила еще 7 книг. Сколько книг стало на полке?", 25, "Нужно найти общее количество книг.", "addition", 1, ["addition"], 1, "сложение"],
  ["задача на сложение", "Утром Миша решил 16 примеров, а вечером еще 9 примеров. Сколько всего примеров решил Миша?", 25, "Нужно сложить утренние и вечерние примеры.", "addition", 1, ["addition"], 1, "сложение"],
  ["задача на сложение", "В саду росло 27 тюльпанов. Потом расцвели еще 13 тюльпанов. Сколько тюльпанов стало в саду?", 40, "Стало больше, значит нужно прибавить.", "addition", 1, ["addition"], 1, "сложение"],
  ["задача на сложение", "У Сони было 42 рубля. Папа дал ей еще 20 рублей. Сколько рублей стало у Сони?", 62, "Нужно узнать, сколько денег стало всего.", "addition", 1, ["addition"], 1, "сложение"],
  ["задача на сложение", "В автобусе ехали 28 человек. На остановке вошли еще 15 человек. Сколько человек стало в автобусе?", 43, "Людей стало больше.", "addition", 2, ["addition"], 1, "сложение"],
  ["задача на сложение", "Лена прочитала 19 страниц в субботу и 21 страницу в воскресенье. Сколько страниц Лена прочитала за два дня?", 40, "Нужно сложить страницы за оба дня.", "addition", 1, ["addition"], 1, "сложение"],
  ["задача на сложение", "В первой коробке было 36 кубиков, а во второй 14 кубиков. Сколько кубиков было в двух коробках?", 50, "Нужно найти общее количество кубиков.", "addition", 1, ["addition"], 1, "сложение"],
  ["задача на сложение", "На одной грядке выросло 25 морковок, а на другой 17 морковок. Сколько морковок выросло всего?", 42, "Сложи морковки с двух грядок.", "addition", 2, ["addition"], 1, "сложение"],
  ["задача на сложение", "В классе было 23 ученика. Пришли еще 4 ученика из другого класса. Сколько детей стало в классе?", 27, "Детей стало больше.", "addition", 1, ["addition"], 1, "сложение"],
  ["задача на сложение", "В альбоме было 48 фотографий. Мама добавила еще 12 фотографий. Сколько фотографий стало в альбоме?", 60, "Нужно прибавить новые фотографии.", "addition", 1, ["addition"], 1, "сложение"],
  ["задача на сложение", "У Димы было 55 деталей конструктора. Друг дал ему еще 18 деталей. Сколько деталей стало у Димы?", 73, "Нужно сложить детали.", "addition", 2, ["addition"], 1, "сложение"],
  ["задача на сложение", "На дереве сидели 17 воробьев. К ним прилетели еще 6 воробьев. Сколько воробьев стало на дереве?", 23, "Птиц стало больше.", "addition", 1, ["addition"], 1, "сложение"],
  ["задача на сложение", "В библиотеку привезли 34 новые книги утром и 26 книг после обеда. Сколько книг привезли за день?", 60, "Нужно сложить книги, которые привезли утром и после обеда.", "addition", 2, ["addition"], 1, "сложение"],
  ["задача на сложение", "На празднике раздали 45 шариков, потом принесли еще 15 шариков. Сколько шариков было всего?", 60, "Нужно найти общее количество шариков.", "addition", 1, ["addition"], 1, "сложение"],
  ["задача на сложение", "У Пети было 29 марок. Он получил еще 11 марок. Сколько марок стало у Пети?", 40, "Стало больше, значит нужно прибавить.", "addition", 1, ["addition"], 1, "сложение"],
  ["задача на сложение", "На столе лежало 38 тетрадей. Учитель положил еще 9 тетрадей. Сколько тетрадей стало на столе?", 47, "Нужно сложить тетради.", "addition", 2, ["addition"], 1, "сложение"],
  ["задача на сложение", "В корзине было 46 яблок. Дети положили туда еще 27 яблок. Сколько яблок стало в корзине?", 73, "Нужно узнать, сколько яблок стало всего.", "addition", 2, ["addition"], 1, "сложение"],
  ["задача на сложение", "В парке посадили 32 березы и 28 лип. Сколько деревьев посадили в парке?", 60, "Нужно сложить все деревья.", "addition", 2, ["addition"], 1, "сложение"],
  ["задача на вычитание", "У Вики было 30 конфет. Она угостила друзей 8 конфетами. Сколько конфет осталось у Вики?", 22, "Конфет стало меньше, значит нужно вычесть.", "subtraction", 1, ["subtraction"], 1, "вычитание"],
  ["задача на вычитание", "В коробке было 47 карандашей. 12 карандашей раздали детям. Сколько карандашей осталось в коробке?", 35, "Нужно узнать, сколько осталось.", "subtraction", 1, ["subtraction"], 1, "вычитание"],
  ["задача на вычитание", "На полке стояло 26 книг. 9 книг взяли читать. Сколько книг осталось на полке?", 17, "Книги забрали, значит нужно вычесть.", "subtraction", 2, ["subtraction"], 1, "вычитание"],
  ["задача на вычитание", "В автобусе ехали 55 человек. На остановке вышли 18 человек. Сколько человек осталось в автобусе?", 37, "Людей стало меньше.", "subtraction", 2, ["subtraction"], 1, "вычитание"],
  ["задача на вычитание", "У Саши было 40 рублей. Он купил блокнот за 15 рублей. Сколько рублей осталось у Саши?", 25, "Деньги потратили, значит нужно вычесть.", "subtraction", 1, ["subtraction"], 1, "вычитание"],
  ["задача на вычитание", "На дереве было 23 яблока. 7 яблок упало. Сколько яблок осталось на дереве?", 16, "Яблок стало меньше.", "subtraction", 1, ["subtraction"], 1, "вычитание"],
  ["задача на вычитание", "В вазе было 36 цветов. 14 цветов подарили гостям. Сколько цветов осталось в вазе?", 22, "Часть цветов убрали.", "subtraction", 1, ["subtraction"], 1, "вычитание"],
  ["задача на вычитание", "В тетради было 80 страниц. Миша исписал 27 страниц. Сколько чистых страниц осталось?", 53, "Нужно вычесть использованные страницы.", "subtraction", 2, ["subtraction"], 1, "вычитание"],
  ["задача на вычитание", "В пакете было 64 ореха. Белка съела 19 орехов. Сколько орехов осталось?", 45, "Орехов стало меньше.", "subtraction", 2, ["subtraction"], 1, "вычитание"],
  ["задача на вычитание", "В классе было 28 детей. 6 детей ушли на кружок. Сколько детей осталось в классе?", 22, "Часть детей ушла.", "subtraction", 1, ["subtraction"], 1, "вычитание"],
  ["задача на вычитание", "У Оли было 52 наклейки. Она подарила подруге 13 наклеек. Сколько наклеек осталось у Оли?", 39, "Подаренные наклейки нужно вычесть.", "subtraction", 2, ["subtraction"], 1, "вычитание"],
  ["задача на вычитание", "В магазине было 90 булочек. До обеда продали 34 булочки. Сколько булочек осталось?", 56, "Проданные булочки ушли.", "subtraction", 2, ["subtraction"], 1, "вычитание"],
  ["задача на вычитание", "На катке было 45 детей. 17 детей ушли домой. Сколько детей осталось на катке?", 28, "Нужно вычесть тех, кто ушел.", "subtraction", 2, ["subtraction"], 1, "вычитание"],
  ["задача на вычитание", "У дедушки было 70 саженцев. Он посадил 25 саженцев. Сколько саженцев осталось посадить?", 45, "Нужно узнать, сколько еще не посадили.", "subtraction", 2, ["subtraction"], 1, "вычитание"],
  ["задача на вычитание", "В коробке лежало 33 кубика. Дети взяли 8 кубиков. Сколько кубиков осталось?", 25, "Кубиков стало меньше.", "subtraction", 2, ["subtraction"], 1, "вычитание"],
  ["задача на вычитание", "У Коли было 61 рубль. Он потратил 20 рублей на сок. Сколько рублей осталось?", 41, "Потраченные деньги нужно вычесть.", "subtraction", 1, ["subtraction"], 1, "вычитание"],
  ["задача на вычитание", "В саду было 74 груши. Дети собрали 36 груш. Сколько груш осталось на деревьях?", 38, "Собранные груши нужно вычесть.", "subtraction", 2, ["subtraction"], 1, "вычитание"],
  ["задача на вычитание", "В пачке было 50 листов бумаги. Лена использовала 18 листов. Сколько листов осталось?", 32, "Нужно вычесть использованные листы.", "subtraction", 2, ["subtraction"], 1, "вычитание"],
  ["задача на вычитание", "На стоянке было 82 машины. 27 машин уехали. Сколько машин осталось?", 55, "Машин стало меньше.", "subtraction", 2, ["subtraction"], 1, "вычитание"],
  ["задача на вычитание", "В аквариуме было 24 рыбки. 5 рыбок пересадили в другой аквариум. Сколько рыбок осталось?", 19, "Нужно вычесть рыбок, которых пересадили.", "subtraction", 1, ["subtraction"], 1, "вычитание"],
  ["задача на больше на", "У Маши 18 наклеек, а у Кати на 6 наклеек больше. Сколько наклеек у Кати?", 24, "Больше на 6 значит нужно прибавить 6.", "more_by", 1, ["addition"], 1, "больше на"],
  ["задача на меньше на", "У Пети 30 рублей, а у Вани на 8 рублей меньше. Сколько рублей у Вани?", 22, "Меньше на 8 значит нужно вычесть 8.", "less_by", 1, ["subtraction"], 1, "меньше на"],
  ["задача на больше на", "В первом ряду 24 стула, а во втором на 5 стульев больше. Сколько стульев во втором ряду?", 29, "Во втором ряду больше.", "more_by", 1, ["addition"], 1, "больше на"],
  ["задача на меньше на", "Лена прочитала 42 страницы, а Дима на 12 страниц меньше. Сколько страниц прочитал Дима?", 30, "У Димы меньше страниц.", "less_by", 1, ["subtraction"], 1, "меньше на"],
  ["задача на больше на", "У Оли 35 бусин, а у Сони на 15 бусин больше. Сколько бусин у Сони?", 50, "Нужно прибавить 15.", "more_by", 1, ["addition"], 1, "больше на"],
  ["задача на меньше на", "В одной коробке 56 деталей, а в другой на 20 деталей меньше. Сколько деталей во второй коробке?", 36, "Нужно вычесть 20.", "less_by", 1, ["subtraction"], 1, "меньше на"],
  ["задача на больше на", "На первой грядке выросло 27 огурцов, а на второй на 9 огурцов больше. Сколько огурцов выросло на второй грядке?", 36, "На второй грядке больше.", "more_by", 2, ["addition"], 1, "больше на"],
  ["задача на меньше на", "У бабушки 64 клубка ниток, а у мамы на 18 клубков меньше. Сколько клубков у мамы?", 46, "У мамы меньше, значит нужно вычесть.", "less_by", 2, ["subtraction"], 1, "меньше на"],
  ["задача на больше на", "В школьном саду 38 яблонь, а груш на 7 больше. Сколько груш в саду?", 45, "Груш больше на 7.", "more_by", 2, ["addition"], 1, "больше на"],
  ["задача на меньше на", "У Тимура 73 карточки, а у Артема на 25 карточек меньше. Сколько карточек у Артема?", 48, "Нужно уменьшить 73 на 25.", "less_by", 2, ["subtraction"], 1, "меньше на"],
  ["задача на больше на", "Миша решил 19 примеров, а Лена на 11 примеров больше. Сколько примеров решила Лена?", 30, "Лена решила больше.", "more_by", 1, ["addition"], 1, "больше на"],
  ["задача на меньше на", "В большом пакете 85 конфет, а в маленьком на 40 конфет меньше. Сколько конфет в маленьком пакете?", 45, "Нужно вычесть 40.", "less_by", 1, ["subtraction"], 1, "меньше на"],
  ["задача на больше на", "На одной полке 46 книг, а на другой на 14 книг больше. Сколько книг на другой полке?", 60, "Другая полка больше по количеству книг.", "more_by", 1, ["addition"], 1, "больше на"],
  ["задача на меньше на", "У Даши 32 фломастера, а у Иры на 9 фломастеров меньше. Сколько фломастеров у Иры?", 23, "Меньше на 9 значит вычесть 9.", "less_by", 2, ["subtraction"], 1, "меньше на"],
  ["задача на больше на", "В первом альбоме 58 фотографий, а во втором на 17 фотографий больше. Сколько фотографий во втором альбоме?", 75, "Нужно прибавить 17.", "more_by", 2, ["addition"], 1, "больше на"],
  ["задача на умножение", "На каждой тарелке лежит по 3 яблока. Всего 4 тарелки. Сколько яблок на тарелках?", 12, "Одинаковые группы удобно считать умножением.", "multiplication", 1, ["multiplication"], 1, "умножение"],
  ["задача на умножение", "У 5 детей по 2 карандаша. Сколько карандашей у детей всего?", 10, "По 2 карандаша взяли 5 раз.", "multiplication", 1, ["multiplication"], 1, "умножение"],
  ["задача на умножение", "В 6 коробках лежит по 4 кубика. Сколько кубиков во всех коробках?", 24, "Нужно 4 взять 6 раз.", "multiplication", 1, ["multiplication"], 1, "умножение"],
  ["задача на умножение", "На одной странице 5 рисунков. Сколько рисунков на 7 таких страницах?", 35, "На каждой странице одинаковое количество рисунков.", "multiplication", 1, ["multiplication"], 1, "умножение"],
  ["задача на умножение", "В каждом букете по 6 цветов. Сколько цветов в 3 букетах?", 18, "6 цветов повторяются 3 раза.", "multiplication", 1, ["multiplication"], 1, "умножение"],
  ["задача на умножение", "В классе 4 ряда парт. В каждом ряду по 5 парт. Сколько парт в классе?", 20, "Одинаковые ряды считаем умножением.", "multiplication", 1, ["multiplication"], 1, "умножение"],
  ["задача на умножение", "У 8 ребят по 3 наклейки. Сколько наклеек у ребят всего?", 24, "3 наклейки повторяются 8 раз.", "multiplication", 1, ["multiplication"], 1, "умножение"],
  ["задача на умножение", "В одной коробке 9 печений. Сколько печений в 4 таких коробках?", 36, "Нужно умножить количество печений в одной коробке на число коробок.", "multiplication", 2, ["multiplication"], 1, "умножение"],
  ["задача на умножение", "На каждой полке стоит по 7 книг. Полок 5. Сколько книг на всех полках?", 35, "На каждой полке одинаковое количество книг.", "multiplication", 2, ["multiplication"], 1, "умножение"],
  ["задача на умножение", "В одном пакете 8 орехов. Сколько орехов в 6 таких пакетах?", 48, "8 орехов нужно взять 6 раз.", "multiplication", 2, ["multiplication"], 1, "умножение"],
  ["задача на умножение", "У 7 учеников по 4 тетради. Сколько тетрадей у учеников всего?", 28, "Одинаковое количество тетрадей у каждого ученика.", "multiplication", 2, ["multiplication"], 1, "умножение"],
  ["задача на умножение", "В одной корзине 6 груш. Сколько груш в 8 таких корзинах?", 48, "6 груш повторяются 8 раз.", "multiplication", 2, ["multiplication"], 1, "умножение"],
  ["задача на умножение", "На каждом столе по 9 стаканов. Столов 3. Сколько стаканов на столах?", 27, "Одинаковые группы считаем умножением.", "multiplication", 1, ["multiplication"], 1, "умножение"],
  ["задача на умножение", "В каждом конверте по 5 открыток. Сколько открыток в 9 конвертах?", 45, "5 открыток нужно взять 9 раз.", "multiplication", 2, ["multiplication"], 1, "умножение"],
  ["задача на умножение", "В 7 коробках лежит по 8 деталей. Сколько деталей во всех коробках?", 56, "Нужно умножить 8 на 7.", "multiplication", 2, ["multiplication"], 1, "умножение"],
  ["задача на деление", "12 яблок разложили поровну на 3 тарелки. Сколько яблок на каждой тарелке?", 4, "Нужно разделить 12 яблок на 3 равные части.", "division", 1, ["division"], 1, "деление"],
  ["задача на деление", "18 карандашей раздали 6 детям поровну. Сколько карандашей получил каждый ребенок?", 3, "Нужно разделить карандаши поровну.", "division", 1, ["division"], 1, "деление"],
  ["задача на деление", "20 конфет разложили в 4 одинаковых пакета. Сколько конфет в каждом пакете?", 5, "Нужно узнать, сколько в одной равной части.", "division", 1, ["division"], 1, "деление"],
  ["задача на деление", "24 книги поставили поровну на 3 полки. Сколько книг на каждой полке?", 8, "Книги делят на 3 равные группы.", "division", 1, ["division"], 1, "деление"],
  ["задача на деление", "30 тетрадей раздали 5 ученикам поровну. Сколько тетрадей получил каждый ученик?", 6, "Нужно разделить 30 на 5.", "division", 1, ["division"], 1, "деление"],
  ["задача на деление", "36 кубиков разложили в 6 коробок поровну. Сколько кубиков в каждой коробке?", 6, "Нужно найти количество в одной коробке.", "division", 1, ["division"], 1, "деление"],
  ["задача на деление", "40 орехов раздали 8 белкам поровну. Сколько орехов получила каждая белка?", 5, "Орехи делят на 8 равных частей.", "division", 1, ["division"], 1, "деление"],
  ["задача на деление", "45 открыток разложили в 9 конвертов поровну. Сколько открыток в каждом конверте?", 5, "Нужно разделить открытки поровну.", "division", 2, ["division"], 1, "деление"],
  ["задача на деление", "48 деталей разложили в 6 коробок поровну. Сколько деталей в каждой коробке?", 8, "Нужно разделить 48 на 6.", "division", 2, ["division"], 1, "деление"],
  ["задача на деление", "56 наклеек раздали 7 детям поровну. Сколько наклеек получил каждый ребенок?", 8, "Нужно узнать, сколько досталось одному ребенку.", "division", 2, ["division"], 1, "деление"],
  ["задача на деление", "63 ягоды разложили в 9 мисок поровну. Сколько ягод в каждой миске?", 7, "Нужно разделить ягоды на 9 равных групп.", "division", 2, ["division"], 1, "деление"],
  ["задача на деление", "72 страницы нужно прочитать за 8 дней поровну. Сколько страниц нужно читать каждый день?", 9, "Раздели все страницы на количество дней.", "division", 2, ["division"], 1, "деление"],
  ["задача на деление", "32 пирожка разложили по 4 пирожка на тарелку. Сколько тарелок понадобилось?", 8, "Нужно узнать, сколько групп по 4 получится.", "division", 2, ["division"], 1, "деление"],
  ["задача на деление", "27 цветков поставили по 3 цветка в вазу. Сколько ваз понадобилось?", 9, "Нужно узнать, сколько раз по 3 помещается в 27.", "division", 2, ["division"], 1, "деление"],
  ["задача на деление", "64 карандаша разложили по 8 карандашей в коробку. Сколько коробок получилось?", 8, "Нужно разделить 64 на 8.", "division", 2, ["division"], 1, "деление"],
  ["задача в два действия", "У Кати было 24 наклейки. Мама подарила ей 8 наклеек, а потом Катя подарила подруге 5 наклеек. Сколько наклеек осталось у Кати?", 27, "Сначала узнай, сколько стало, потом вычти подаренные наклейки.", "two_steps", 3, ["addition", "subtraction"], 2, "два действия"],
  ["задача в два действия", "В корзине было 30 яблок. Дети положили еще 12 яблок, а потом 18 яблок взяли для пирога. Сколько яблок осталось в корзине?", 24, "Сначала прибавь яблоки, потом вычти те, которые взяли.", "two_steps", 3, ["addition", "subtraction"], 2, "два действия"],
  ["задача в два действия", "В классе было 18 девочек и 14 мальчиков. 5 детей ушли на кружок. Сколько детей осталось в классе?", 27, "Сначала найди, сколько детей было всего, потом вычти 5.", "two_steps", 3, ["addition", "subtraction"], 2, "два действия"],
  ["задача в два действия", "У Саши было 50 рублей. Он купил сок за 18 рублей и булочку за 12 рублей. Сколько рублей осталось у Саши?", 20, "Сначала найди, сколько Саша потратил, потом вычти из 50.", "two_steps", 3, ["addition", "subtraction"], 2, "два действия"],
  ["задача в два действия", "На первой полке стояло 24 книги, на второй 16 книг. 10 книг взяли читать. Сколько книг осталось на двух полках?", 30, "Сначала сложи книги на двух полках, потом вычти 10.", "two_steps", 3, ["addition", "subtraction"], 2, "два действия"],
  ["задача в два действия", "В 4 коробках лежит по 6 карандашей. 5 карандашей раздали детям. Сколько карандашей осталось?", 19, "Сначала узнай, сколько карандашей было в коробках, потом вычти 5.", "two_steps", 3, ["multiplication", "subtraction"], 2, "два действия"],
  ["задача в два действия", "В 5 пакетах лежит по 8 конфет. 12 конфет съели. Сколько конфет осталось?", 28, "Сначала найди, сколько конфет было всего, потом вычти съеденные.", "two_steps", 3, ["multiplication", "subtraction"], 2, "два действия"],
  ["задача в два действия", "36 тетрадей раздали 6 ученикам поровну. Потом каждый ученик получил еще по 2 тетради. Сколько тетрадей стало у каждого ученика?", 8, "Сначала раздели 36 на 6, потом прибавь 2.", "two_steps", 3, ["division", "addition"], 2, "два действия"],
  ["задача в два действия", "У Лены было 20 открыток, а у Оли на 8 открыток больше. Девочки сложили все открытки вместе. Сколько открыток стало у девочек?", 48, "Сначала узнай, сколько открыток у Оли, потом сложи открытки двух девочек.", "two_steps", 3, ["addition", "addition"], 2, "два действия"],
  ["задача в два действия", "В саду росло 3 ряда яблонь, по 7 яблонь в каждом ряду. Потом посадили еще 9 яблонь. Сколько яблонь стало в саду?", 30, "Сначала узнай, сколько яблонь было в рядах, потом прибавь новые.", "two_steps", 3, ["multiplication", "addition"], 2, "два действия"]
].map(([topic, taskText, answer, hint, type, difficulty, operations, stepsCount, originalType], index) => ({
  id: `math_story_${String(index + 1).padStart(3, "0")}`,
  section: "математика",
  block: "текстовые задачи",
  topic,
  taskText,
  task_text: taskText,
  answer: String(answer),
  hint,
  type,
  originalType,
  difficulty,
  operations,
  stepsCount,
  steps_count: stepsCount
}));

const VERIFIED_FAST100_EXAMPLES = [
  "34 + 5", "62 + 7", "80 + 6", "47 + 2", "53 + 4", "71 + 8", "25 + 3", "40 + 9", "16 + 2", "91 + 6",
  "34 - 2", "62 - 1", "80 - 6", "47 - 3", "59 - 4", "76 - 5", "28 - 6", "90 - 7", "65 - 2", "43 - 1",
  "20 + 30", "40 + 50", "10 + 70", "60 + 20", "30 + 30", "50 + 40", "80 + 10", "20 + 60", "70 + 20", "10 + 80",
  "80 - 30", "70 - 20", "90 - 40", "60 - 10", "100 - 50", "50 - 20", "80 - 60", "40 - 10", "100 - 70", "90 - 30",
  "24 + 10", "35 + 20", "48 + 30", "52 + 40", "17 + 50", "63 + 20", "71 + 10", "26 + 30", "39 + 40", "45 + 20",
  "54 - 10", "76 - 20", "89 - 30", "65 - 40", "47 - 20", "93 - 50", "68 - 30", "72 - 10", "59 - 40", "84 - 20",
  "38 + 7", "46 + 8", "27 + 6", "59 + 5", "64 + 9", "75 + 8", "29 + 4", "18 + 7", "53 + 9", "67 + 6",
  "34 - 8", "52 - 7", "41 - 6", "63 - 9", "75 - 8", "90 - 4", "28 - 9", "46 - 7", "81 - 5", "57 - 8",
  "23 + 14", "42 + 35", "51 + 26", "34 + 25", "62 + 17", "71 + 18", "45 + 23", "56 + 32", "24 + 13", "31 + 48",
  "58 - 24", "76 - 35", "94 - 52", "67 - 23", "85 - 41", "49 - 27", "63 - 12", "88 - 34", "57 - 26", "79 - 45",
  "38 + 27", "46 + 35", "57 + 24", "29 + 48", "64 + 18", "75 + 16", "28 + 37", "39 + 26", "47 + 35", "58 + 24",
  "54 - 28", "63 - 37", "72 - 45", "81 - 56", "90 - 34", "46 - 19", "75 - 48", "62 - 27", "83 - 59", "51 - 24",
  "32 + 6", "54 + 5", "23 + 4", "70 + 8", "81 + 7", "45 + 3", "12 + 5", "60 + 4", "73 + 6", "50 + 7",
  "88 - 6", "57 - 4", "39 - 5", "74 - 2", "96 - 3", "50 - 8", "27 - 6", "69 - 7", "85 - 4", "41 - 1",
  "40 + 40", "30 + 50", "60 + 30", "20 + 20", "50 + 10", "70 + 10", "30 + 60", "40 + 20", "10 + 40", "50 + 30",
  "60 - 40", "70 - 50", "50 - 10", "100 - 20", "80 - 40", "90 - 60", "70 - 30", "60 - 20", "40 - 30", "100 - 80",
  "58 + 10", "12 + 60", "33 + 30", "64 + 20", "21 + 40", "75 + 10", "46 + 30", "29 + 50", "18 + 70", "55 + 20",
  "37 - 10", "95 - 60", "63 - 30", "41 - 20", "88 - 50", "56 - 20", "79 - 30", "92 - 40", "67 - 10", "85 - 70",
  "48 + 5", "36 + 8", "72 + 9", "25 + 7", "44 + 8", "58 + 6", "19 + 5", "69 + 4", "87 + 6", "33 + 9",
  "32 - 6", "64 - 7", "73 - 9", "55 - 6", "42 - 8", "61 - 4", "30 - 7", "84 - 6", "95 - 8", "23 - 5",
  "63 + 24", "72 + 15", "36 + 41", "25 + 52", "44 + 33", "81 + 12", "53 + 26", "67 + 21", "28 + 31", "35 + 44",
  "68 - 31", "92 - 61", "46 - 15", "75 - 43", "89 - 56", "54 - 22", "97 - 64", "66 - 25", "78 - 37", "59 - 18",
  "69 + 18", "36 + 45", "27 + 38", "49 + 23", "56 + 29", "18 + 67", "34 + 48", "25 + 59", "43 + 39", "17 + 76",
  "70 - 36", "94 - 58", "61 - 25", "82 - 47", "73 - 38", "60 - 29", "95 - 67", "44 - 18", "86 - 49", "53 - 26"
];

const VERIFIED_COMPARISON_EXAMPLES = [
  "34 __ 43", "56 __ 65", "72 __ 27", "90 __ 89", "41 __ 41", "18 __ 81", "67 __ 76", "55 __ 55", "29 __ 92", "100 __ 99",
  "30 + 5 __ 36", "40 + 8 __ 48", "70 - 6 __ 65", "90 - 10 __ 80", "25 + 4 __ 30", "60 - 7 __ 50", "18 + 2 __ 20", "45 - 5 __ 41",
  "20 + 5 __ 30 - 4", "40 + 8 __ 50 - 2", "70 - 6 __ 60 + 3", "25 + 5 __ 20 + 10", "90 - 8 __ 80 + 1", "34 + 4 __ 40 - 2",
  "2 × 4 __ 7", "3 × 5 __ 15", "4 × 6 __ 25", "5 × 5 __ 20", "6 × 3 __ 18", "7 × 2 __ 15", "8 × 4 __ 32", "9 × 3 __ 28",
  "12 : 2 __ 6", "18 : 3 __ 5", "20 : 4 __ 6", "25 : 5 __ 5", "36 : 6 __ 7", "42 : 7 __ 6", "56 : 8 __ 8", "63 : 9 __ 7",
  "48 __ 84", "36 __ 36", "73 __ 37", "62 __ 26", "15 __ 51", "88 __ 88", "47 __ 74", "91 __ 19", "64 __ 46", "50 __ 49",
  "33 + 6 __ 39", "80 - 9 __ 72", "56 + 3 __ 60", "44 - 4 __ 40", "27 + 8 __ 34", "91 - 1 __ 90", "62 + 5 __ 66", "38 - 8 __ 31", "73 + 7 __ 80", "100 - 5 __ 94",
  "63 - 3 __ 50 + 9", "72 + 8 __ 90 - 10", "47 - 5 __ 40 + 3", "29 + 6 __ 30 + 4", "81 - 1 __ 70 + 10", "55 + 5 __ 100 - 30", "46 + 4 __ 60 - 9", "38 - 8 __ 20 + 9", "67 + 3 __ 80 - 10", "94 - 4 __ 85 + 5",
  "6 × 6 __ 35", "7 × 7 __ 49", "5 × 8 __ 39", "4 × 9 __ 36", "3 × 7 __ 22", "8 × 2 __ 16", "9 × 5 __ 46", "6 × 4 __ 24", "7 × 3 __ 20", "8 × 5 __ 41",
  "16 : 2 __ 9", "27 : 3 __ 9", "32 : 4 __ 7", "45 : 5 __ 8", "54 : 6 __ 9", "49 : 7 __ 6", "64 : 8 __ 8", "72 : 9 __ 9", "30 : 3 __ 11", "40 : 5 __ 8",
  "29 + 1 __ 30", "50 - 2 __ 49",
  "56 - 6 __ 45 + 5", "18 + 7 __ 30 - 4", "22 + 8 __ 40 - 9", "100 - 20 __ 70 + 9",
  "9 × 2 __ 18", "10 × 6 __ 59",
  "48 : 6 __ 7", "81 : 9 __ 9",
  "34 __ 43", "60 + 5 __ 65", "72 - 8 __ 63", "4 × 5 __ 20", "36 : 6 __ 7",
  "28 + 2 __ 30", "90 - 9 __ 80", "7 × 3 __ 22", "48 : 8 __ 6", "55 __ 50 + 5",
  "81 - 1 __ 70 + 9", "6 × 6 __ 35", "42 : 7 __ 6", "29 + 4 __ 34", "100 - 20 __ 80",
  "8 × 4 __ 31", "45 : 5 __ 10", "67 __ 76", "73 + 7 __ 80", "9 × 5 __ 45"
];

const VERIFIED_UNKNOWN_EXAMPLES = [
  "□ + 5 = 12", "8 + □ = 15", "□ + 20 = 60", "34 + □ = 40", "□ + 7 = 16", "25 + □ = 30", "□ + 14 = 50", "9 + □ = 18",
  "□ - 5 = 10", "18 - □ = 9", "□ - 20 = 40", "36 - □ = 30", "□ - 7 = 12", "25 - □ = 20", "□ - 14 = 36", "17 - □ = 8",
  "□ + 30 = 80", "46 + □ = 50", "□ + 6 = 13", "17 + □ = 25", "□ + 22 = 70", "38 + □ = 45", "□ + 40 = 90", "12 + □ = 20", "□ + 9 = 17", "55 + □ = 60", "□ + 18 = 40", "27 + □ = 35",
  "□ - 30 = 50", "46 - □ = 40", "□ - 6 = 15", "28 - □ = 20", "□ - 22 = 48", "39 - □ = 30", "□ - 40 = 50", "24 - □ = 10", "□ - 9 = 18", "55 - □ = 45", "□ - 18 = 42", "37 - □ = 30"
];

const VERIFIED_MULTIPLICATION_EXAMPLES = [
  "2 × 1", "2 × 2", "2 × 3", "2 × 4", "2 × 5", "2 × 6", "2 × 7", "2 × 8", "2 × 9", "2 × 10", "2 × 0",
  "3 × 1", "3 × 2", "3 × 3", "3 × 4", "3 × 5", "3 × 6", "3 × 7", "3 × 8", "3 × 9", "3 × 10", "3 × 0",
  "4 × 1", "4 × 2", "4 × 3", "4 × 4", "4 × 5", "4 × 6", "4 × 7", "4 × 8", "4 × 9", "4 × 10", "4 × 0",
  "5 × 1", "5 × 2", "5 × 3", "5 × 4", "5 × 5", "5 × 6", "5 × 7", "5 × 8", "5 × 9", "5 × 10", "5 × 0",
  "6 × 1", "6 × 2", "6 × 3", "6 × 4", "6 × 5", "6 × 6", "6 × 7", "6 × 8", "6 × 9", "6 × 10", "6 × 0",
  "7 × 1", "7 × 2", "7 × 3", "7 × 4", "7 × 5", "7 × 6", "7 × 7", "7 × 8", "7 × 9", "7 × 10", "7 × 0",
  "8 × 1", "8 × 2", "8 × 3", "8 × 4", "8 × 5", "8 × 6", "8 × 7", "8 × 8", "8 × 9", "8 × 10", "8 × 0",
  "9 × 1", "9 × 2", "9 × 3", "9 × 4", "9 × 5", "9 × 6", "9 × 7", "9 × 8", "9 × 9", "9 × 10", "9 × 0",
  "3 × 4", "5 × 6", "7 × 8", "9 × 4", "6 × 7", "8 × 5", "4 × 7", "6 × 8", "5 × 9",
  "1 × 2", "3 × 2", "4 × 2", "5 × 2", "6 × 2", "7 × 2", "8 × 2", "9 × 2", "10 × 2",
  "1 × 3", "2 × 3", "4 × 3", "5 × 3", "6 × 3", "7 × 3", "8 × 3", "9 × 3", "10 × 3",
  "1 × 4", "2 × 4", "3 × 4", "5 × 4", "6 × 4", "7 × 4", "8 × 4", "9 × 4", "10 × 4",
  "1 × 5", "2 × 5", "3 × 5", "4 × 5", "6 × 5", "7 × 5", "8 × 5", "9 × 5", "10 × 5",
  "1 × 6", "2 × 6", "3 × 6", "4 × 6", "5 × 6", "7 × 6", "8 × 6", "9 × 6", "10 × 6",
  "1 × 7", "2 × 7", "3 × 7", "4 × 7", "5 × 7", "6 × 7", "8 × 7", "9 × 7", "10 × 7",
  "1 × 8", "2 × 8", "3 × 8", "4 × 8", "5 × 8", "6 × 8", "7 × 8", "9 × 8", "10 × 8",
  "1 × 9", "2 × 9", "3 × 9", "4 × 9", "5 × 9", "6 × 9", "7 × 9", "8 × 9", "10 × 9"
];

const VERIFIED_DIVISION_EXAMPLES = [
  "12 : 2", "18 : 3", "20 : 4", "25 : 5", "36 : 6", "42 : 7", "56 : 8", "63 : 9", "16 : 2", "27 : 3",
  "32 : 4", "45 : 5", "54 : 6", "49 : 7", "64 : 8", "72 : 9", "30 : 3", "40 : 5", "48 : 6", "81 : 9",
  "12 : 3", "30 : 5", "56 : 7", "36 : 9", "42 : 6", "40 : 8", "28 : 4", "48 : 6", "45 : 5",
  "20 : 4", "25 : 5", "36 : 6", "42 : 7", "56 : 8", "63 : 9", "16 : 2", "27 : 3", "32 : 4", "45 : 5", "54 : 6", "49 : 7", "64 : 8", "72 : 9"
];

const FAST100_TOPIC_META = [
  { topic: "сложение в пределах 100 без перехода через десяток", operation: "addition", difficulty: 1, requiresTransition: false, level: 1 },
  { topic: "вычитание в пределах 100 без перехода через десяток", operation: "subtraction", difficulty: 1, requiresTransition: false, level: 1 },
  { topic: "сложение круглых десятков", operation: "addition", difficulty: 1, requiresTransition: false, level: 2 },
  { topic: "вычитание круглых десятков", operation: "subtraction", difficulty: 1, requiresTransition: false, level: 2 },
  { topic: "сложение двузначного числа и круглого десятка", operation: "addition", difficulty: 1, requiresTransition: false, level: 2 },
  { topic: "вычитание круглого десятка из двузначного числа", operation: "subtraction", difficulty: 1, requiresTransition: false, level: 2 },
  { topic: "сложение в пределах 100 с переходом через десяток", operation: "addition", difficulty: 2, requiresTransition: true, level: 3 },
  { topic: "вычитание в пределах 100 с переходом через десяток", operation: "subtraction", difficulty: 2, requiresTransition: true, level: 3 },
  { topic: "сложение двух двузначных чисел без перехода через десяток", operation: "addition", difficulty: 2, requiresTransition: false, level: 4 },
  { topic: "вычитание двух двузначных чисел без перехода через десяток", operation: "subtraction", difficulty: 2, requiresTransition: false, level: 4 },
  { topic: "сложение двух двузначных чисел с переходом через десяток", operation: "addition", difficulty: 3, requiresTransition: true, level: 4 },
  { topic: "вычитание двух двузначных чисел с переходом через десяток", operation: "subtraction", difficulty: 3, requiresTransition: true, level: 4 }
];

const COMPARISON_TOPIC_META = [
  { topic: "сравнение чисел в пределах 100", operation: "comparison", difficulty: 1, level: 5, examples: [...VERIFIED_COMPARISON_EXAMPLES.slice(0, 10), ...VERIFIED_COMPARISON_EXAMPLES.slice(40, 50)] },
  { topic: "сравнение числа и выражения", operation: "comparison", difficulty: 2, level: 5, examples: [...VERIFIED_COMPARISON_EXAMPLES.slice(10, 18), ...VERIFIED_COMPARISON_EXAMPLES.slice(50, 60), ...VERIFIED_COMPARISON_EXAMPLES.slice(90, 92)] },
  { topic: "сравнение двух выражений", operation: "comparison", difficulty: 2, level: 5, examples: [...VERIFIED_COMPARISON_EXAMPLES.slice(18, 24), ...VERIFIED_COMPARISON_EXAMPLES.slice(60, 70), ...VERIFIED_COMPARISON_EXAMPLES.slice(92, 96)] },
  { topic: "сравнение с умножением", operation: "comparison", difficulty: 3, level: 8, examples: [...VERIFIED_COMPARISON_EXAMPLES.slice(24, 32), ...VERIFIED_COMPARISON_EXAMPLES.slice(70, 80), ...VERIFIED_COMPARISON_EXAMPLES.slice(96, 98)] },
  { topic: "сравнение с делением", operation: "comparison", difficulty: 3, level: 9, examples: [...VERIFIED_COMPARISON_EXAMPLES.slice(32, 40), ...VERIFIED_COMPARISON_EXAMPLES.slice(80, 90), ...VERIFIED_COMPARISON_EXAMPLES.slice(98, 100)] },
  { topic: "смешанное сравнение", operation: "comparison", difficulty: 3, level: 10, examples: VERIFIED_COMPARISON_EXAMPLES.slice(100, 120) }
];

const MIXED_MULTIPLICATION_DIVISION_EXAMPLES = [
  "3 × 4", "12 : 3", "5 × 6", "30 : 5", "7 × 8", "56 : 7", "9 × 4", "36 : 9", "6 × 7", "42 : 6",
  "8 × 5", "40 : 8", "9 × 9", "81 : 9", "4 × 7", "28 : 4", "6 × 8", "48 : 6", "5 × 9", "45 : 5"
];

const MIXED_100_EXAMPLES = [
  "34 + 8", "56 - 9", "7 × 6", "42 : 7", "48 + 27", "73 - 38", "5 × 9", "45 : 5", "62 + 18", "90 - 46",
  "8 × 4", "32 : 8", "29 + 35", "81 - 27", "6 × 6", "36 : 6", "47 + 26", "64 - 19", "9 × 7", "63 : 9"
];

const MATH_EXAMPLE_TOPICS = buildMathExampleTopics();
const NORMALIZED_MATH_EXAMPLES = MATH_EXAMPLE_TOPICS.flatMap((group, groupIndex) =>
  group.examples.map((example, exampleIndex) => normalizeMathExample(group, example, groupIndex, exampleIndex))
);
const MATH_FAST100_TASKS = NORMALIZED_MATH_EXAMPLES.filter((item) => item.block === "fast100");
const MATH_COMPARISON_TASKS = NORMALIZED_MATH_EXAMPLES.filter((item) => item.hasComparison);
const MATH_UNKNOWN_TASKS = NORMALIZED_MATH_EXAMPLES.filter((item) => item.block === "unknown");
const MATH_MULTIPLICATION_TASKS = NORMALIZED_MATH_EXAMPLES.filter((item) => item.block === "multiplication");
const MATH_DIVISION_TASKS = NORMALIZED_MATH_EXAMPLES.filter((item) => item.block === "division");
const MATH_MIXED_TASKS = NORMALIZED_MATH_EXAMPLES.filter((item) => item.block === "mixed");

const VERIFIED_LIFE_MATH_TASKS = [
  { skillId: "measures", kind: "input", prompt: "Лента длиной 1 метр. От нее отрезали 30 сантиметров. Сколько сантиметров ленты осталось?", answer: "70", explanation: "1 метр - это 100 сантиметров. Вычти 30 из 100.", visual: { type: "ruler", startCm: 0, endCm: 100, markerCm: 70, label: "1 м = 100 см" } },
  { skillId: "measures", kind: "input", prompt: "Карандаш длиной 14 см, а ручка длиной 12 см. На сколько сантиметров карандаш длиннее ручки?", answer: "2", explanation: "Чтобы узнать, на сколько больше, нужно вычесть.", visual: { type: "ruler", segmentA: 14, segmentB: 12 } },
  { skillId: "measures", kind: "input", prompt: "У Маши есть полоска длиной 3 дм. Сколько это сантиметров?", answer: "30", explanation: "1 дм - это 10 см.", visual: { type: "ruler", startCm: 0, endCm: 30, label: "3 дм" } },
  { skillId: "measures", kind: "input", prompt: "Дорожка состоит из двух частей: 25 м и 30 м. Какова длина всей дорожки?", answer: "55", explanation: "Нужно сложить длины двух частей." },
  { skillId: "measures", kind: "input", prompt: "В пакете 2 кг яблок, а в корзине 5 кг яблок. Сколько килограммов яблок всего?", answer: "7", explanation: "Нужно сложить массу яблок." },
  { skillId: "measures", kind: "input", prompt: "Мешок картофеля весил 10 кг. Из него взяли 3 кг. Сколько килограммов картофеля осталось?", answer: "7", explanation: "Картофеля стало меньше, значит нужно вычесть." },
  { skillId: "measures", kind: "input", prompt: "В кувшине было 2 л воды. Мама долила еще 3 л. Сколько литров воды стало?", answer: "5", explanation: "Нужно сложить литры." },
  { skillId: "measures", kind: "input", prompt: "В ведре было 9 л воды. Для полива взяли 4 л. Сколько литров воды осталось?", answer: "5", explanation: "Нужно вычесть использованную воду." },
  { skillId: "measures", kind: "choice", prompt: "Что больше: 1 м или 90 см?", answer: "1 м", choices: ["1 м", "90 см", "равно"], explanation: "1 м - это 100 см, а 100 см больше 90 см.", visual: { type: "ruler", startCm: 0, endCm: 100, markerCm: 90, label: "1 м и 90 см" } },
  { skillId: "measures", kind: "choice", prompt: "Что меньше: 4 дм или 50 см?", answer: "4 дм", choices: ["4 дм", "50 см", "равно"], explanation: "4 дм - это 40 см. 40 см меньше 50 см.", visual: { type: "ruler", startCm: 0, endCm: 50, markerCm: 40, label: "4 дм = 40 см" } },

  { skillId: "lifeMath", kind: "input", prompt: "На часах 8 часов утра. Через 2 часа начнется кружок. Во сколько начнется кружок?", answer: "10 часов", acceptedAnswers: ["10", "10:00"], explanation: "Прибавь 2 часа к 8 часам.", visual: { type: "clock", hour: 8, minute: 0 } },
  { skillId: "lifeMath", kind: "input", prompt: "Урок начался в 9 часов и длился 1 час. Во сколько закончился урок?", answer: "10 часов", acceptedAnswers: ["10", "10:00"], explanation: "Прибавь 1 час к 9 часам.", visual: { type: "clock", hour: 9, minute: 0 } },
  { skillId: "lifeMath", kind: "input", prompt: "Перемена началась в 10:20 и закончилась в 10:30. Сколько минут длилась перемена?", answer: "10", acceptedAnswers: ["10 минут"], explanation: "Посчитай минуты от 20 до 30.", visual: { type: "clock", time: "10:20" } },
  { skillId: "lifeMath", kind: "input", prompt: "Маша читала с 15:00 до 15:25. Сколько минут она читала?", answer: "25", acceptedAnswers: ["25 минут"], explanation: "От 15:00 до 15:25 прошло 25 минут.", visual: { type: "clock", time: "15:00" } },
  { skillId: "lifeMath", kind: "choice", prompt: "Петя пришел в школу в 8:10, а Ваня в 8:20. Кто пришел раньше?", answer: "Петя", choices: ["Петя", "Ваня", "пришли одновременно"], explanation: "8:10 раньше, чем 8:20." },
  { skillId: "lifeMath", kind: "choice", prompt: "Мультфильм начался в 18:30, а фильм в 19:00. Что началось позже?", answer: "фильм", choices: ["мультфильм", "фильм", "оба вместе"], explanation: "19:00 позже, чем 18:30." },
  { skillId: "lifeMath", kind: "choice", prompt: "Завтрак в 8:00, прогулка в 10:00, обед в 13:00. Что будет раньше: прогулка или обед?", answer: "прогулка", choices: ["прогулка", "обед", "одновременно"], explanation: "10:00 раньше, чем 13:00." },
  { skillId: "lifeMath", kind: "input", prompt: "Урок музыки начинается в 12:00. Сейчас 11:30. Через сколько минут начнется урок?", answer: "30", acceptedAnswers: ["30 минут"], explanation: "От 11:30 до 12:00 пройдет 30 минут.", visual: { type: "clock", time: "11:30" } },
  { skillId: "lifeMath", kind: "input", prompt: "Поездка длилась 40 минут. Она началась в 14:00. Во сколько закончилась поездка?", answer: "14:40", explanation: "Прибавь 40 минут к 14:00.", visual: { type: "clock", time: "14:00" } },
  { skillId: "lifeMath", kind: "input", prompt: "Тренировка началась в 16:15 и закончилась в 16:45. Сколько минут длилась тренировка?", answer: "30", acceptedAnswers: ["30 минут"], explanation: "От 15 минут до 45 минут прошло 30 минут.", visual: { type: "clock", time: "16:15" } },

  { skillId: "lifeMath", kind: "input", prompt: "У Кати было 50 рублей. Она купила тетрадь за 18 рублей и карандаш за 12 рублей. Сколько рублей осталось?", answer: "20", explanation: "Сначала узнай, сколько Катя потратила, потом вычти из 50.", visual: { type: "coins", money: 50, prices: [18, 12] } },
  { skillId: "lifeMath", kind: "input", prompt: "У Миши было 40 рублей. Он купил сок за 25 рублей. Сколько рублей осталось?", answer: "15", explanation: "Деньги потратили, значит нужно вычесть.", visual: { type: "coins", money: 40, prices: [25] } },
  { skillId: "lifeMath", kind: "input", prompt: "Булочка стоит 18 рублей, а сок 22 рубля. Сколько стоят булочка и сок вместе?", answer: "40", explanation: "Нужно сложить две стоимости.", visual: { type: "coins", prices: [18, 22] } },
  { skillId: "lifeMath", kind: "choice", prompt: "У Лены 30 рублей. Хватит ли ей на мороженое за 28 рублей?", answer: "да", choices: ["да", "нет"], explanation: "30 рублей больше, чем 28 рублей.", visual: { type: "coins", money: 30, prices: [28] } },
  { skillId: "lifeMath", kind: "choice", prompt: "У Вани 20 рублей. Карандаш стоит 12 рублей, а ластик 9 рублей. Хватит ли денег на обе покупки?", answer: "нет", choices: ["да", "нет"], explanation: "12 + 9 = 21, а 21 больше 20.", visual: { type: "coins", money: 20, prices: [12, 9] } },
  { skillId: "lifeMath", kind: "input", prompt: "У Сони было 100 рублей. Она купила книгу за 65 рублей. Сколько рублей сдачи она получила?", answer: "35", explanation: "Вычти стоимость книги из 100.", visual: { type: "coins", money: 100, prices: [65] } },
  { skillId: "lifeMath", kind: "input", prompt: "Яблоко стоит 15 рублей, груша стоит 20 рублей. На сколько рублей груша дороже яблока?", answer: "5", explanation: "Чтобы узнать, на сколько дороже, нужно вычесть.", visual: { type: "coins", prices: [15, 20] } },
  { skillId: "lifeMath", kind: "input", prompt: "У Димы 70 рублей. Он хочет купить ручку за 25 рублей и блокнот за 35 рублей. Сколько рублей останется?", answer: "10", explanation: "Сначала сложи стоимость покупок, потом вычти из 70.", visual: { type: "coins", money: 70, prices: [25, 35] } },
  { skillId: "lifeMath", kind: "input", prompt: "У Оли 45 рублей. Она купила наклейки за 30 рублей. Сколько рублей ей нужно добавить, чтобы купить еще открытку за 20 рублей?", answer: "5", explanation: "После покупки осталось 15 рублей, до 20 не хватает 5.", visual: { type: "coins", money: 45, prices: [30, 20] } },
  { skillId: "lifeMath", kind: "input", prompt: "У Пети 3 монеты по 10 рублей и 2 монеты по 5 рублей. Сколько рублей у Пети?", answer: "40", explanation: "Сначала посчитай 3 десятки, потом 2 пятерки.", visual: { type: "coins", coins: [10, 10, 10, 5, 5] } },

  { skillId: "geometry", kind: "input", prompt: "У отрезка длина 8 см. Его увеличили на 4 см. Какой длины стал отрезок?", answer: "12", acceptedAnswers: ["12 см"], explanation: "Нужно прибавить 4 см.", visual: { type: "ruler", startCm: 0, endCm: 12 } },
  { skillId: "geometry", kind: "input", prompt: "Одна сторона треугольника 5 см, вторая 6 см, третья 7 см. Найди периметр треугольника.", answer: "18", acceptedAnswers: ["18 см"], explanation: "Периметр - это сумма длин всех сторон.", visual: { type: "shape", shape: "triangle" } },
  { skillId: "geometry", kind: "input", prompt: "У квадрата сторона 4 см. Найди периметр квадрата.", answer: "16", acceptedAnswers: ["16 см"], explanation: "У квадрата 4 равные стороны: 4 + 4 + 4 + 4.", visual: { type: "shape", shape: "square", sideA: 4, sideB: 4 } },
  { skillId: "geometry", kind: "input", prompt: "У прямоугольника стороны 6 см и 4 см. Найди периметр.", answer: "20", acceptedAnswers: ["20 см"], explanation: "Сложи все стороны: 6 + 4 + 6 + 4.", visual: { type: "shape", shape: "rectangle", sideA: 6, sideB: 4 } },
  { skillId: "geometry", kind: "input", prompt: "Ломаная состоит из трех звеньев: 3 см, 5 см и 4 см. Найди длину ломаной.", answer: "12", acceptedAnswers: ["12 см"], explanation: "Сложи длины всех звеньев.", visual: { type: "grid", segments: [3, 5, 4] } },
  { skillId: "geometry", kind: "choice", prompt: "У какой фигуры 3 стороны и 3 угла?", answer: "треугольник", choices: ["треугольник", "квадрат", "круг"], explanation: "Треугольник имеет три стороны.", visual: { type: "shape", shape: "triangle" } },
  { skillId: "geometry", kind: "choice", prompt: "У какой фигуры все стороны равны и 4 угла?", answer: "квадрат", choices: ["квадрат", "прямоугольник", "треугольник"], explanation: "У квадрата 4 равные стороны.", visual: { type: "shape", shape: "square" } },
  { skillId: "geometry", kind: "input", prompt: "Начертили отрезок 9 см. Потом стерли 3 см. Какая длина осталась?", answer: "6", acceptedAnswers: ["6 см"], explanation: "Нужно вычесть 3 см.", visual: { type: "ruler", startCm: 0, endCm: 9, markerCm: 6 } },
  { skillId: "geometry", kind: "input", prompt: "Путь по клеткам идет так: 4 клетки вправо, 3 клетки вверх, 2 клетки вправо. Сколько всего клеток прошел путь?", answer: "9", explanation: "Сложи все части пути: 4 + 3 + 2.", visual: { type: "grid", moves: ["right 4", "up 3", "right 2"] } },
  { skillId: "geometry", kind: "input", prompt: "Прямоугольник имеет стороны 8 см и 3 см. Найди периметр.", answer: "22", acceptedAnswers: ["22 см"], explanation: "Сложи 8 + 3 + 8 + 3.", visual: { type: "shape", shape: "rectangle", sideA: 8, sideB: 3 } },

  { skillId: "lifeMath", kind: "input", prompt: "Продолжи ряд: 2, 4, 6, 8, ...", answer: "10", explanation: "Каждое следующее число больше на 2.", visual: { type: "pattern", items: ["2", "4", "6", "8"], missing: "?" } },
  { skillId: "lifeMath", kind: "input", prompt: "Продолжи ряд: 5, 10, 15, 20, ...", answer: "25", explanation: "Каждое следующее число больше на 5.", visual: { type: "pattern", items: ["5", "10", "15", "20"], missing: "?" } },
  { skillId: "lifeMath", kind: "input", prompt: "Продолжи ряд: 30, 27, 24, 21, ...", answer: "18", explanation: "Каждое следующее число меньше на 3.", visual: { type: "pattern", items: ["30", "27", "24", "21"], missing: "?" } },
  { skillId: "lifeMath", kind: "input", prompt: "Продолжи ряд: 1, 2, 4, 8, ...", answer: "16", explanation: "Каждое следующее число увеличивается в 2 раза.", visual: { type: "pattern", items: ["1", "2", "4", "8"], missing: "?" } },
  { skillId: "lifeMath", kind: "input", prompt: "Какой шаг в ряду: 12, 22, 32, 42?", answer: "+10", acceptedAnswers: ["10"], explanation: "Сравни соседние числа.", visual: { type: "pattern", items: ["12", "22", "32", "42"] } },
  { skillId: "lifeMath", kind: "choice", prompt: "Найди лишнее число: 10, 20, 30, 35, 40.", answer: "35", choices: ["10", "20", "35", "40"], explanation: "Остальные числа круглые десятки.", visual: { type: "pattern", items: ["10", "20", "30", "35", "40"] } },
  { skillId: "lifeMath", kind: "choice", prompt: "Найди лишнюю фигуру: квадрат, прямоугольник, треугольник, круг.", answer: "круг", choices: ["квадрат", "прямоугольник", "треугольник", "круг"], explanation: "У круга нет углов, а у остальных фигур есть углы.", visual: { type: "shapeSet", shapes: ["square", "rectangle", "triangle", "circle"] } },
  { skillId: "lifeMath", kind: "choice", prompt: "Продолжи ряд: круг, квадрат, круг, квадрат, ...", answer: "круг", choices: ["круг", "квадрат", "треугольник"], explanation: "Фигуры чередуются.", visual: { type: "pattern", items: ["круг", "квадрат", "круг", "квадрат"], missing: "?" } },
  { skillId: "lifeMath", kind: "input", prompt: "В таблице числа идут так: 3, 6, 9, 12. Какое число будет следующим?", answer: "15", explanation: "Каждый раз прибавляют 3.", visual: { type: "pattern", items: ["3", "6", "9", "12"], missing: "?" } },
  { skillId: "lifeMath", kind: "input", prompt: "У Маши 2 карандаша, у Лены 4 карандаша, у Оли 6 карандашей. Если правило сохранится, сколько карандашей у следующей девочки?", answer: "8", explanation: "Каждый раз карандашей становится на 2 больше.", visual: { type: "pattern", items: ["2", "4", "6"], missing: "?" } },
  { skillId: "lifeMath", kind: "input", prompt: "Посмотри на часы. Минутная стрелка на 12, часовая на 7. Который час?", answer: "7:00", acceptedAnswers: ["7 часов", "7"], explanation: "Если минутная стрелка на 12, значит ровный час.", visual: { type: "clock", hour: 7, minute: 0 } },
  { skillId: "lifeMath", kind: "input", prompt: "Посмотри на часы. Минутная стрелка на 6, часовая между 3 и 4. Который час?", answer: "3:30", acceptedAnswers: ["3 часа 30 минут", "3.30"], explanation: "Если минутная стрелка на 6, прошло 30 минут.", visual: { type: "clock", hour: 3, minute: 30 } },
  { skillId: "lifeMath", kind: "input", prompt: "На часах 10:15. Через 30 минут начнется прогулка. Во сколько начнется прогулка?", answer: "10:45", explanation: "Прибавь 30 минут к 10:15.", visual: { type: "clock", time: "10:15" } },
  { skillId: "lifeMath", kind: "input", prompt: "Урок начался в 9:20 и закончился в 9:50. Сколько минут длился урок?", answer: "30", acceptedAnswers: ["30 минут"], explanation: "От 20 минут до 50 минут прошло 30 минут.", visual: { type: "clock", time: "9:20" } },
  { skillId: "measures", kind: "input", prompt: "На линейке отрезок начинается на 0 см и заканчивается на 8 см. Какова длина отрезка?", answer: "8", acceptedAnswers: ["8 см"], explanation: "Длина отрезка от 0 до 8 равна 8 см.", visual: { type: "ruler", startCm: 0, endCm: 8 } },
  { skillId: "measures", kind: "input", prompt: "На линейке отрезок начинается на 2 см и заканчивается на 9 см. Какова длина отрезка?", answer: "7", acceptedAnswers: ["7 см"], explanation: "Нужно вычесть начало из конца: 9 - 2.", visual: { type: "ruler", startCm: 2, endCm: 9 } },
  { skillId: "measures", kind: "input", prompt: "Один отрезок длиной 6 см, другой 4 см. На сколько сантиметров первый отрезок длиннее?", answer: "2", acceptedAnswers: ["2 см"], explanation: "Вычти 4 из 6.", visual: { type: "ruler", segmentA: 6, segmentB: 4 } },
  { skillId: "lifeMath", kind: "input", prompt: "На экране 2 монеты по 10 рублей и 1 монета 5 рублей. Сколько рублей всего?", answer: "25", explanation: "10 + 10 + 5 = 25.", visual: { type: "coins", coins: [10, 10, 5] } },
  { skillId: "lifeMath", kind: "input", prompt: "На экране купюра 50 рублей. Покупка стоит 32 рубля. Сколько сдачи?", answer: "18", explanation: "Вычти 32 из 50.", visual: { type: "coins", money: 50, prices: [32] } },
  { skillId: "lifeMath", kind: "choice", prompt: "У ребенка 40 рублей. Тетрадь стоит 18 рублей, карандаш 15 рублей. Хватит ли денег?", answer: "да", choices: ["да", "нет"], explanation: "18 + 15 = 33, а 40 больше 33.", visual: { type: "coins", money: 40, prices: [18, 15] } },
  { skillId: "geometry", kind: "choice", prompt: "На экране фигура с 4 равными сторонами. Как она называется?", answer: "квадрат", choices: ["квадрат", "прямоугольник", "треугольник"], explanation: "У квадрата все стороны равны.", visual: { type: "shape", shape: "square" } },
  { skillId: "geometry", kind: "input", prompt: "На экране прямоугольник со сторонами 5 см и 3 см. Найди периметр.", answer: "16", acceptedAnswers: ["16 см"], explanation: "5 + 3 + 5 + 3 = 16.", visual: { type: "shape", shape: "rectangle", sideA: 5, sideB: 3 } },
  { skillId: "geometry", kind: "input", prompt: "Путь идет 3 клетки вправо, 2 клетки вверх, 4 клетки вправо. Сколько клеток всего?", answer: "9", explanation: "3 + 2 + 4 = 9.", visual: { type: "grid", moves: ["right 3", "up 2", "right 4"] } },
  { skillId: "geometry", kind: "input", prompt: "Ломаная на клетках состоит из звеньев 2 клетки, 3 клетки и 5 клеток. Найди длину ломаной.", answer: "10", acceptedAnswers: ["10 клеток"], explanation: "Сложи длины всех звеньев.", visual: { type: "grid", segments: [2, 3, 5] } },
  { skillId: "lifeMath", kind: "choice", prompt: "Продолжи ряд: треугольник, треугольник, квадрат, треугольник, треугольник, квадрат, ...", answer: "треугольник", choices: ["треугольник", "квадрат", "круг"], explanation: "Повторяется группа: треугольник, треугольник, квадрат.", visual: { type: "pattern", items: ["треугольник", "треугольник", "квадрат", "треугольник", "треугольник", "квадрат"], missing: "?" } }
];

const RUSSIAN_DETECTIVE_TASKS = [
  {
    skillId: "spellingPairs",
    type: "choice",
    prompt: "Слово потеряло букву: маш_на. Какое слово получится?",
    answer: "машина",
    choices: ["машина", "машына", "машена"],
    explanation: "Ши пишется с буквой и."
  },
  {
    skillId: "spellingPairs",
    type: "choice",
    prompt: "Выбери правильное написание.",
    answer: "шишка",
    choices: ["шишка", "шышка", "шешка"],
    explanation: "Жи-ши пишем с буквой и."
  },
  {
    skillId: "spellingPairs",
    type: "choice",
    prompt: "Найди правильное слово.",
    answer: "чашка",
    choices: ["чашка", "чяшка", "чешка"],
    explanation: "Ча-ща пишем с буквой а."
  },
  {
    skillId: "spellingPairs",
    type: "choice",
    prompt: "Слово потеряло букву: щ_ка. Какое слово получится?",
    answer: "щука",
    choices: ["щука", "щюка", "щека"],
    explanation: "Чу-щу пишем с буквой у."
  },
  {
    skillId: "unstressedVowels",
    type: "choice",
    prompt: "Какую букву пишем в слове л_са? Проверочное слово: лес.",
    answer: "е",
    choices: ["е", "и", "я"],
    explanation: "Безударную гласную проверяем ударением: лес."
  },
  {
    skillId: "unstressedVowels",
    type: "choice",
    prompt: "Выбери проверочное слово для слова тр_ва.",
    answer: "травы",
    choices: ["трава", "травы", "травка"],
    explanation: "В слове травы буква а слышится под ударением."
  },
  {
    skillId: "unstressedVowels",
    type: "choice",
    prompt: "Найди правильное написание.",
    answer: "звезда",
    choices: ["звезда", "звизда", "звазда"],
    explanation: "Проверочное слово: звезды."
  },
  {
    skillId: "consonants",
    type: "choice",
    prompt: "Какую букву пишем на конце слова гри_?",
    answer: "б",
    choices: ["б", "п"],
    explanation: "Проверочное слово: грибы. После б стоит гласная."
  },
  {
    skillId: "consonants",
    type: "choice",
    prompt: "Выбери проверочное слово для слова зу_.",
    answer: "зубы",
    choices: ["зуб", "зубы", "зубной"],
    explanation: "В слове зубы ясно слышится б."
  },
  {
    skillId: "consonants",
    type: "choice",
    prompt: "Найди правильное написание.",
    answer: "снег",
    choices: ["снег", "снек", "снех"],
    explanation: "Проверочное слово: снега."
  },
  {
    skillId: "separators",
    type: "choice",
    prompt: "Выбери правильное написание.",
    answer: "семья",
    choices: ["семя", "семья", "семъя"],
    explanation: "В слове семья нужен разделительный мягкий знак."
  },
  {
    skillId: "separators",
    type: "choice",
    prompt: "Какой мягкий знак в слове семья?",
    answer: "разделительный мягкий знак",
    choices: ["разделительный мягкий знак", "мягкий знак для мягкости"],
    explanation: "Мягкий знак стоит перед я и разделяет звуки."
  },
  {
    skillId: "separators",
    type: "choice",
    prompt: "Какой мягкий знак в слове конь?",
    answer: "мягкий знак для мягкости",
    choices: ["разделительный мягкий знак", "мягкий знак для мягкости"],
    explanation: "Мягкий знак стоит в конце слова и смягчает н."
  },
  {
    skillId: "prepositions",
    type: "choice",
    prompt: "Выбери правильное написание.",
    answer: "на столе",
    choices: ["на столе", "настоле"],
    explanation: "Предлог на пишется отдельно."
  },
  {
    skillId: "prepositions",
    type: "choice",
    prompt: "Найди предлог в предложении: Книга лежит на парте.",
    answer: "на",
    choices: ["книга", "лежит", "на", "парте"],
    explanation: "Предлог - отдельное маленькое слово перед существительным."
  },
  {
    skillId: "wordLogic",
    type: "choice",
    prompt: "Определи часть речи: кот.",
    answer: "существительное",
    choices: ["существительное", "прилагательное", "глагол"],
    explanation: "Слово кот отвечает на вопрос кто?"
  },
  {
    skillId: "wordLogic",
    type: "choice",
    prompt: "Определи часть речи: зеленый.",
    answer: "прилагательное",
    choices: ["существительное", "прилагательное", "глагол"],
    explanation: "Слово зеленый отвечает на вопрос какой?"
  },
  {
    skillId: "wordLogic",
    type: "choice",
    prompt: "Выбери глагол.",
    answer: "светит",
    choices: ["солнце", "яркий", "светит"],
    explanation: "Глагол обозначает действие."
  },
  {
    skillId: "wordLogic",
    type: "choice",
    prompt: "Найди лишнее слово: книга, стол, веселый, окно.",
    answer: "веселый",
    choices: ["книга", "стол", "веселый", "окно"],
    explanation: "Веселый - признак предмета, остальные слова называют предметы."
  },
  {
    skillId: "sentenceText",
    type: "choice",
    prompt: "Собери предложение из слов: читает, книгу, Маша.",
    answer: "Маша читает книгу.",
    choices: ["Маша читает книгу.", "Книгу читает.", "Читает Маша книгу?"],
    explanation: "Предложение должно звучать понятно: кто? что делает? что?"
  },
  {
    skillId: "sentenceText",
    type: "choice",
    prompt: "Какой знак нужен в конце: Как тебя зовут_",
    answer: "?",
    choices: [".", "?", "!"],
    explanation: "Если спрашивают, ставится вопросительный знак."
  },
  {
    skillId: "sentenceText",
    type: "choice",
    prompt: "Выбери главные слова в предложении: Птицы поют утром.",
    answer: "птицы поют",
    choices: ["птицы поют", "поют утром", "птицы утром"],
    explanation: "Кто? птицы. Что делают? поют."
  },
  {
    skillId: "sentenceText",
    type: "choice",
    prompt: "Исправь предложение.",
    answer: "Утром дети пошли в школу.",
    choices: ["Утром дети пошли в школу.", "утром дети пошли в школу", "Утром дети пошли в школу"],
    explanation: "Предложение начинается с большой буквы и заканчивается точкой."
  },
  {
    skillId: "wordLogic",
    type: "choice",
    prompt: "Выбери правильный перенос слова тетрадь.",
    answer: "те-традь",
    choices: ["те-традь", "тетрад-ь", "т-етрадь"],
    explanation: "Мягкий знак не переносится отдельно."
  },
  {
    skillId: "wordLogic",
    type: "choice",
    prompt: "Поставь слова по алфавиту: дом, арбуз, кот.",
    answer: "арбуз, дом, кот",
    choices: ["арбуз, дом, кот", "дом, арбуз, кот", "кот, дом, арбуз"],
    explanation: "Смотри на первые буквы слов: а, д, к."
  },
  {
    skillId: "spellingPairs",
    type: "choice",
    prompt: "Найди ошибку: У Машы новая книга.",
    answer: "Маши",
    choices: ["Маши", "Машы", "Маше"],
    explanation: "Ши пишется с буквой и."
  },
  {
    skillId: "spellingPairs",
    type: "choice",
    prompt: "Выбери правильное слово.",
    answer: "жизнь",
    choices: ["жизнь", "жызнь", "жезнь"],
    explanation: "Жи пишется с буквой и."
  },
  {
    skillId: "spellingPairs",
    type: "choice",
    prompt: "Найди правильное написание.",
    answer: "задача",
    choices: ["задача", "задачя", "задеча"],
    explanation: "Ча пишется с буквой а."
  },
  {
    skillId: "spellingPairs",
    type: "choice",
    prompt: "Найди ошибку: Я чювствую запах цветов.",
    answer: "чувствую",
    choices: ["чувствую", "чювствую", "чевствую"],
    explanation: "Чу пишется с буквой у."
  },
  {
    skillId: "unstressedVowels",
    type: "choice",
    prompt: "Найди ошибку: На паляне росли цветы.",
    answer: "поляне",
    choices: ["поляне", "паляне", "пилине"],
    explanation: "Проверочное слово: поле."
  },
  {
    skillId: "consonants",
    type: "choice",
    prompt: "Найди ошибку: На столе лежит хлеп.",
    answer: "хлеб",
    choices: ["хлеб", "хлеп", "хлет"],
    explanation: "Проверочное слово: хлеба."
  },
  {
    skillId: "separators",
    type: "choice",
    prompt: "Найди слово с разделительным мягким знаком: конь, семья, день.",
    answer: "семья",
    choices: ["конь", "семья", "день"],
    explanation: "Разделительный мягкий знак стоит перед я, е, ё, ю, и и разделяет звуки."
  },
  {
    skillId: "separators",
    type: "choice",
    prompt: "Выбери правильное написание.",
    answer: "письмо",
    choices: ["письмо", "писмо", "писььмо"],
    explanation: "Мягкий знак показывает мягкость согласного с."
  },
  {
    skillId: "wordLogic",
    type: "choice",
    prompt: "Выбери правильное написание названия города.",
    answer: "Москва",
    choices: ["Москва", "москва"],
    explanation: "Название города пишется с большой буквы."
  },
  {
    skillId: "wordLogic",
    type: "choice",
    prompt: "Исправь предложение: У пети есть собака Шарик.",
    answer: "У Пети есть собака Шарик.",
    choices: ["У Пети есть собака Шарик.", "У пети есть собака Шарик.", "У Пети есть собака шарик."],
    explanation: "Имя человека и кличка животного пишутся с большой буквы."
  },
  {
    skillId: "prepositions",
    type: "choice",
    prompt: "Исправь ошибку: Мяч лежит подстулом.",
    answer: "Мяч лежит под стулом.",
    choices: ["Мяч лежит под стулом.", "Мяч лежит подстулом.", "Мяч лежит под-стулом."],
    explanation: "Предлог под пишется отдельно."
  },
  {
    skillId: "sentenceText",
    type: "choice",
    prompt: "Выбери действие в предложении: Собака бежит по двору.",
    answer: "бежит",
    choices: ["собака", "бежит", "двор"],
    explanation: "Спроси: что делает собака?"
  },
  {
    skillId: "sentenceText",
    type: "choice",
    prompt: "Выбери главные слова в предложении: Девочка читает сказку.",
    answer: "девочка читает",
    choices: ["девочка читает", "читает сказку", "девочка сказку"],
    explanation: "Кто? девочка. Что делает? читает."
  },
  {
    skillId: "wordLogic",
    type: "choice",
    prompt: "Выбери правильный перенос слова корова.",
    answer: "ко-рова",
    choices: ["ко-рова", "кор-ова", "к-орова"],
    explanation: "Одну букву нельзя оставлять на строке."
  },
  {
    skillId: "wordLogic",
    type: "choice",
    prompt: "Поставь слова по алфавиту: кот, кит, кран.",
    answer: "кит, кот, кран",
    choices: ["кит, кот, кран", "кот, кит, кран", "кран, кот, кит"],
    explanation: "Первые буквы одинаковые, смотри на вторую букву."
  },
  {
    skillId: "wordLogic",
    type: "choice",
    prompt: "Поставь слова по алфавиту: река, рыба, робот.",
    answer: "река, робот, рыба",
    choices: ["река, робот, рыба", "робот, река, рыба", "рыба, робот, река"],
    explanation: "Смотри на вторую букву: е, о, ы."
  }
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
    id: "mixedMath",
    subject: "math",
    icon: "🔀",
    title: "Смешанный счет",
    description: "Сложение, вычитание, умножение, деление и итоговое сравнение.",
    chips: ["итоговый блок", "12 примеров", "после базы"]
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
    id: "mathStories",
    subject: "math",
    icon: "📘",
    title: "Математические истории",
    description: "Текстовые задачи: выбрать действие, понять смысл и записать ответ.",
    chips: ["8 задач", "смысл", "1-2 действия"]
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
  },
  {
    id: "worldQuest",
    subject: "world",
    icon: "🌿",
    title: "Лесная экспедиция",
    description: "Короткие вопросы про природу, наблюдения, космос и человека.",
    chips: ["5 вопросов", "факты", "наблюдательность"]
  }
];

const ACADEMY_ISLANDS = [
  {
    id: "math",
    subject: "math",
    icon: "🧮",
    title: "Остров математики",
    text: "Здесь числа помогают строить мосты, измерять дороги, считать покупки и решать истории.",
    landmark: "Маяк счета",
    position: { x: 22, y: 28 },
    primary: { label: "Продолжить путь", action: "fast100" },
    routes: [
      {
        id: "counting-shore",
        title: "Счетный берег",
        description: "Разминаем числа до 100: сложение, вычитание, сравнение и пропущенные числа.",
        skillIds: ["numbers100", "addSub100", "orderActions"],
        actions: [
          { label: "Разогрев", action: "fast10" },
          { label: "Счет до 100", action: "fast100" },
          { label: "Смешанный счет", action: "mixedMath" }
        ],
        stops: [
          { id: "warmup", label: "Разогрев", action: "fast10", skillIds: ["numbers100"] },
          { id: "fast100", label: "Счет до 100", action: "fast100", skillIds: ["numbers100", "addSub100"] },
          { id: "mixed", label: "Смешанный счет", action: "mixedMath", skillIds: ["addSub100", "orderActions"] }
        ]
      },
      {
        id: "times-mountain",
        title: "Гора таблицы",
        description: "Поднимаемся по ступеням умножения и деления. Чем выше, тем увереннее ответы.",
        skillIds: ["multiplication50", "division50"],
        actions: [
          { label: "Таблица", action: "multiply" },
          { label: "Сложные случаи", action: "multiply", variant: "hard" }
        ],
        stops: [
          { id: "multiply", label: "Таблица", action: "multiply", skillIds: ["multiplication50"] },
          { id: "hard-table", label: "Сложные случаи", action: "multiply", variant: "hard", skillIds: ["multiplication50", "division50"] }
        ]
      },
      {
        id: "story-workshop",
        title: "Мастерская задач",
        description: "Разбираем истории: что было, что изменилось и что нужно найти.",
        skillIds: ["wordProblems"],
        actions: [
          { label: "Решать задачи", action: "mathStories" }
        ],
        stops: [
          { id: "math-stories", label: "Открыть задачу", action: "mathStories", skillIds: ["wordProblems"] }
        ]
      },
      {
        id: "measure-city",
        title: "Город измерений",
        description: "Часы, деньги, линейка, фигуры, маршруты и закономерности.",
        skillIds: ["measures", "geometry", "lifeMath"],
        actions: [
          { label: "Математика в жизни", action: "lifeMath" }
        ],
        stops: [
          { id: "life-math", label: "Исследовать город", action: "lifeMath", skillIds: ["measures", "geometry", "lifeMath"] }
        ]
      }
    ]
  },
  {
    id: "russian",
    subject: "russian",
    icon: "✍️",
    title: "Остров русского языка",
    text: "Здесь слова прячут буквы, правила оставляют следы, а смысл помогает найти верный ответ.",
    landmark: "Башня букв",
    position: { x: 70, y: 26 },
    primary: { label: "Продолжить путь", action: "wordDetective" },
    routes: [
      {
        id: "dictionary-meadow",
        title: "Словарная поляна",
        description: "Трудные слова растут здесь как редкие растения. Их нужно узнавать и запоминать.",
        skillIds: ["dictionaryWords"],
        actions: [
          { label: "Словарные слова", action: "dictionary" }
        ],
        stops: [
          { id: "dictionary", label: "Потренировать слова", action: "dictionary", skillIds: ["dictionaryWords"] }
        ]
      },
      {
        id: "letter-lab",
        title: "Лаборатория букв",
        description: "Жи-ши, ча-ща, безударные гласные, парные согласные и мягкий знак.",
        skillIds: ["spellingPairs", "unstressedVowels", "consonants", "separators", "prepositions", "soundLetters", "sentenceText", "wordLogic"],
        actions: [
          { label: "Детектив слов", action: "wordDetective" }
        ],
        stops: [
          { id: "word-detective", label: "Открыть лабораторию", action: "wordDetective", skillIds: ["spellingPairs", "unstressedVowels", "consonants", "separators", "prepositions", "soundLetters", "sentenceText", "wordLogic"] }
        ]
      },
      {
        id: "word-agency",
        title: "Детективное бюро слов",
        description: "Ищем потерянные буквы, исправляем записки, выбираем улики и собираем предложения.",
        skillIds: ["wordGames"],
        actions: [
          { label: "Игровой детектив", action: "russianGames" }
        ],
        stops: [
          { id: "russian-games", label: "Начать расследование", action: "russianGames", skillIds: ["wordGames"] }
        ]
      },
      {
        id: "puzzle-tower",
        title: "Башня головоломок",
        description: "Кроссворды, буквенный круг, поиск слов и другие словесные тайники.",
        skillIds: ["wordPuzzles"],
        actions: [
          { label: "Головоломки", action: "wordPuzzles" }
        ],
        stops: [
          { id: "word-puzzles", label: "Открыть головоломку", action: "wordPuzzles", skillIds: ["wordPuzzles"] }
        ]
      },
      {
        id: "wise-square",
        title: "Площадь мудрых фраз",
        description: "Пословицы, поговорки и ситуации, где важно понять смысл, а не просто угадать конец.",
        skillIds: ["proverbs"],
        actions: [
          { label: "Пословицы", action: "proverbs" }
        ],
        stops: [
          { id: "proverbs", label: "Разобрать фразу", action: "proverbs", skillIds: ["proverbs"] }
        ]
      }
    ]
  },
  {
    id: "reading",
    subject: "reading",
    icon: "📚",
    title: "Остров чтения",
    text: "Здесь тексты становятся картами: в них есть детали, поступки, порядок событий и главная мысль.",
    landmark: "Мост главной мысли",
    position: { x: 35, y: 70 },
    primary: { label: "Продолжить чтение", action: "readingQuest" },
    routes: [
      {
        id: "short-text-trail",
        title: "Тропа коротких текстов",
        description: "Читаем небольшой текст и ищем ответы прямо в нем.",
        skillIds: ["readingMeaning"],
        actions: [
          { label: "Читательский сыщик", action: "readingQuest" }
        ],
        stops: [
          { id: "read-text", label: "Прочитать текст", action: "readingQuest", skillIds: ["readingMeaning"] },
          { id: "main-idea", label: "Найти главную мысль", action: "readingQuest", skillIds: ["readingMeaning"] },
          { id: "hero-traces", label: "Понять героя", action: "readingQuest", skillIds: ["readingMeaning"] }
        ]
      }
    ]
  },
  {
    id: "world",
    subject: "world",
    icon: "🌿",
    title: "Остров окружающего мира",
    text: "Лесной остров с тропами наблюдений, короткими фактами, загадками природы и мягкими переменами.",
    landmark: "Лесная обсерватория",
    position: { x: 78, y: 72 },
    primary: { label: "В экспедицию", action: "worldQuest" },
    routes: [
      {
        id: "forest-expedition",
        title: "Лесная экспедиция",
        description: "Наблюдаем природу, отвечаем на короткие вопросы и иногда делаем добрую паузу.",
        skillIds: ["worldFacts"],
        actions: [
          { label: "Факты природы", action: "worldQuest" },
          { label: "Огонек дня", action: "daily" }
        ],
        stops: [
          { id: "world-facts", label: "Дом наблюдений", action: "worldQuest", skillIds: ["worldFacts"] },
          { id: "riddle-house", label: "Загадать", action: "funBreak", skillIds: ["worldFacts"] },
          { id: "movement-meadow", label: "Мини-перемена", action: "funBreak", skillIds: ["worldFacts"] }
        ]
      }
    ]
  }
];

const DAILY_HOUSE_TASK_COUNT = 5;
const DAILY_HOUSE_PASS_COUNT = 4;
const DAILY_HOUSE_MAX = 4;
const DAILY_HOUSE_MIN = 3;
const SUMMER_FINISH_MONTH = 7;
const SUMMER_FINISH_DAY = 31;

const SUBJECT_LAUNCHERS = [
  {
    subject: "math",
    icon: "🧮",
    title: "Математика",
    text: "Разогреть счет, таблицу умножения и задачи до легкости.",
    note: "Сегодня хорошо подойдет 5 минут счета.",
    actions: [
      { label: "Счет до 100", action: "fast100" },
      { label: "Задачи", action: "mathStories" },
      { label: "Смешанный", action: "mixedMath" },
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
      { label: "Головоломки", action: "wordPuzzles" },
      { label: "Пословицы", action: "proverbs" },
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
let selectedIslandId = ACADEMY_ISLANDS[0]?.id || "math";
let todayRouteAction = { action: "daily", variant: "", houseId: "" };

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
const todayFunBreak = document.querySelector("#todayFunBreak");
const todayFunBreakTitle = document.querySelector("#todayFunBreakTitle");
const todayFunBreakText = document.querySelector("#todayFunBreakText");
const todayFunBreakAnswer = document.querySelector("#todayFunBreakAnswer");
const revealTodayBreakAnswerBtn = document.querySelector("#revealTodayBreakAnswerBtn");
const newTodayBreakBtn = document.querySelector("#newTodayBreakBtn");
const funBreakTitle = document.querySelector("#funBreakTitle");
const jokeLine = document.querySelector("#jokeLine");
const newJokeBtn = document.querySelector("#newJokeBtn");
const funBreakAnswer = document.querySelector("#funBreakAnswer");
const revealBreakAnswerBtn = document.querySelector("#revealBreakAnswerBtn");
const sessionBreak = document.querySelector("#sessionBreak");
const sessionBreakTitle = document.querySelector("#sessionBreakTitle");
const sessionBreakText = document.querySelector("#sessionBreakText");
const sessionBreakAnswer = document.querySelector("#sessionBreakAnswer");
const revealSessionBreakAnswerBtn = document.querySelector("#revealSessionBreakAnswerBtn");
const nextBreakBtn = document.querySelector("#nextBreakBtn");
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
  document.body.classList.add("preview-mode");
  importInput.disabled = true;
  resetBtn.disabled = true;
  importInput.closest(".file-import")?.classList.add("file-import--disabled");
  resetBtn.title = "В режиме родителя прогресс ребенка не меняется.";
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => showView(button.dataset.view));
});

startSessionBtn.addEventListener("click", handleTodayRouteAction);
againSessionBtn.addEventListener("click", () => startSession());
nextQuestionBtn.addEventListener("click", nextQuestion);
exitSessionBtn.addEventListener("click", exitSession);
reviewMistakesBtn.addEventListener("click", () => showView("errors"));
newTodayBreakBtn.addEventListener("click", () => renderFunBreak("any", "today", true));
revealTodayBreakAnswerBtn.addEventListener("click", () => revealFunBreakAnswer("today"));
newJokeBtn.addEventListener("click", () => renderFunBreak("any", "main", true));
revealBreakAnswerBtn.addEventListener("click", () => revealFunBreakAnswer("main"));
revealSessionBreakAnswerBtn.addEventListener("click", () => revealFunBreakAnswer("session"));
nextBreakBtn.addEventListener("click", () => renderSessionBreak(session?.lastBreakContext || "any", true));
exportBtn.addEventListener("click", exportProgress);
importInput.addEventListener("change", importProgress);
resetBtn.addEventListener("click", resetProgress);

render();
renderFunBreak("any", "today");
renderFunBreak("any", "main");

function loadState() {
  const fallback = {
    childName,
    attempts: [],
    skillStats: {},
    taskProgress: {},
    wordProgress: {},
    dailySessions: [],
    mistakes: [],
    createdAt: new Date().toISOString()
  };

  try {
    const loaded = { ...fallback, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
    loaded.attempts = Array.isArray(loaded.attempts) ? loaded.attempts : [];
    loaded.dailySessions = Array.isArray(loaded.dailySessions) ? loaded.dailySessions : [];
    loaded.mistakes = Array.isArray(loaded.mistakes) ? loaded.mistakes : [];
    loaded.skillStats = loaded.skillStats && typeof loaded.skillStats === "object" ? loaded.skillStats : {};
    loaded.taskProgress = loaded.taskProgress && typeof loaded.taskProgress === "object" ? loaded.taskProgress : {};
    loaded.wordProgress = loaded.wordProgress && typeof loaded.wordProgress === "object" ? loaded.wordProgress : {};
    return loaded;
  } catch {
    return fallback;
  }
}

function saveState() {
  if (isPreviewMode) return;
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
  todayFunBreak.classList.toggle("hidden", trainingActive);
  questPanel.classList.toggle("hidden", !trainingActive);

  const today = dateKey(new Date());
  const todaysSessions = state.dailySessions.filter((item) => item.date === today);
  const dailyPlan = getTodayHousePlan();
  const pendingHouse = dailyPlan.find((house) => !house.todayStats.lit);
  todayRouteAction = pendingHouse
    ? { action: pendingHouse.stop.action, variant: pendingHouse.stop.variant || "", houseId: pendingHouse.houseId }
    : { action: "daily", variant: "", houseId: "" };
  const litCount = dailyPlan.filter((house) => house.todayStats.lit).length;
  const remaining = dailyPlan.length - litCount;
  if (!remaining && dailyPlan.length) {
    todayStatus.textContent = "Все домики дня горят.";
    todayFocus.textContent = `Сегодня зажжено ${litCount} из ${dailyPlan.length}. Острова стали ярче, до 31 августа осталось ${getDaysUntilSummerFinish()} дн.`;
    startSessionBtn.textContent = "Свободная тренировка";
  } else if (todaysSessions.length || litCount) {
    todayStatus.textContent = "Маршрут уже начат.";
    todayFocus.textContent = `Горит ${litCount} из ${dailyPlan.length}. Осталось зажечь: ${remaining}. Если домик не загорелся, добери огоньки в тренажере.`;
    startSessionBtn.textContent = pendingHouse?.planType === "catchup" ? "Догнать домик" : "Зажечь домик";
  } else {
    todayStatus.textContent = "Сегодня нужно зажечь домики.";
    todayFocus.textContent = `${dailyPlan.length} домика на разных островах. Домик загорится, когда получится 4 верных огонька из 5.`;
    startSessionBtn.textContent = "Начать с домика";
  }
  renderSubjectLaunchers();
  renderGuide(todayGuideCard, "today");
}

function renderSubjectLaunchers() {
  renderDailyIslandMap();
  return;
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

function renderDailyIslandMap() {
  const launchHeading = document.querySelector(".subject-launch__heading");
  if (launchHeading) {
    launchHeading.innerHTML = `
      <p class="eyebrow">Карта дня</p>
      <h3>Зажги домики на островах</h3>
    `;
  }
  const dailyPlan = getTodayHousePlan();
  const planIds = new Set(dailyPlan.map((house) => house.houseId));
  const todayKey = dateKey(new Date());
  const houses = getScoredAcademyHouses().map((house) => {
    const planned = dailyPlan.find((item) => item.houseId === house.houseId);
    return {
      ...house,
      planType: planned?.planType || "",
      todayStats: getHouseDayStats(house, todayKey)
    };
  });
  const housesByIsland = houses.reduce((acc, house) => {
    acc[house.island.id] = acc[house.island.id] || [];
    acc[house.island.id].push(house);
    return acc;
  }, {});
  const litToday = dailyPlan.filter((house) => house.todayStats.lit).length;
  const catchUpCount = dailyPlan.filter((house) => house.planType === "catchup" && !house.todayStats.lit).length;

  subjectLaunchGrid.classList.add("daily-island-grid");
  subjectLaunchGrid.innerHTML = `
    <section class="daily-route-panel">
      <div>
        <p class="eyebrow">План дня</p>
        <h3>${litToday}/${dailyPlan.length} домика горят</h3>
        <p>${catchUpCount ? `Есть ${catchUpCount} домик для догоняния. ` : ""}Домик загорается, когда набрано ${DAILY_HOUSE_PASS_COUNT} верных огонька из ${DAILY_HOUSE_TASK_COUNT}.</p>
      </div>
      <div class="daily-route-panel__date">до 31 августа: ${getDaysUntilSummerFinish()} дн.</div>
    </section>
    ${ACADEMY_ISLANDS.map((island) => {
      const subject = SUBJECTS[island.subject];
      const islandHouses = housesByIsland[island.id] || [];
      const light = getIslandLightPercent(island);
      return `
        <article class="daily-island daily-island--${island.id}" style="--island-color:${subject.color}; --island-light:${light}%; --island-dim:${Math.max(0.05, 0.32 - light * 0.0028)}">
          <div class="daily-island__sky" aria-hidden="true"></div>
          <div class="daily-island__land" aria-hidden="true">
            <span class="daily-island__mountain"></span>
            <span class="daily-island__forest"></span>
            <span class="daily-island__shore"></span>
          </div>
          <div class="daily-island__header">
            <span>${island.icon}</span>
            <div>
              <p class="eyebrow">${getIslandTerrain(island.id)}</p>
              <h3>${getIslandDisplayTitle(island)}</h3>
              <small>яркость острова ${light}%</small>
            </div>
          </div>
          <div class="daily-house-list">
            ${islandHouses.map((house) => {
              const stateClass = getHouseStateClass(house, planIds);
              const status = house.todayStats.lit
                ? "горит сегодня"
                : planIds.has(house.houseId)
                  ? `${house.todayStats.correct}/${DAILY_HOUSE_PASS_COUNT} огонька`
                  : "тренажер";
              return `
                <button class="daily-house ${stateClass}" type="button" data-academy-action="${house.stop.action}" data-academy-variant="${house.stop.variant || ""}" data-academy-house="${house.houseId}" ${house.todayStats.lit ? 'aria-pressed="true"' : ""}>
                  <span class="daily-house__icon">${house.todayStats.lit ? "🔥" : house.icon}</span>
                  <span>
                    <strong>${house.label}</strong>
                    <small>${house.planType === "catchup" && !house.todayStats.lit ? "догнать: " : ""}${status}</small>
                  </span>
                </button>
              `;
            }).join("")}
          </div>
        </article>
      `;
    }).join("")}
  `;
  attachAcademyActionHandlers(subjectLaunchGrid);
}

function renderTrainers() {
  renderGuide(trainerGuideCard, "trainers");
  trainerGrid.innerHTML = "";
  ACADEMY_ISLANDS.forEach((island) => {
    const subject = SUBJECTS[island.subject];
    const islandStats = getAcademyGroupStats(getIslandSkillIds(island));
    const card = document.createElement("article");
    card.className = "trainer-island";
    card.style.setProperty("--island-color", subject.color);
    card.innerHTML = `
      <div class="trainer-island__top">
        <div class="trainer-island__icon">${island.icon}</div>
        <div>
          <p class="eyebrow">${subject.label}</p>
          <h3>${getIslandDisplayTitle(island)}</h3>
          <p>${island.text}</p>
        </div>
      </div>
      <div class="island-progress">
        <span style="width:${islandStats.accuracy}%"></span>
      </div>
      <div class="island-summary">
        <span>${islandStats.doneLabel}</span>
        <span>${islandStats.status}</span>
      </div>
      <div class="mini-route-line" aria-label="Маршруты острова">
        ${island.routes.map((route) => {
          const routeStats = getAcademyGroupStats(getRouteSkillIds(route));
          return `<span>${route.title}<small>${routeStats.status}</small></span>`;
        }).join("")}
      </div>
      <div class="trainer-island__actions">
        ${renderAcademyActionButtons([island.primary], true)}
        ${renderAcademyActionButtons([{ label: "Открыть карту", action: "openIsland", variant: island.id }])}
      </div>
    `;
    attachAcademyActionHandlers(card);
    trainerGrid.append(card);
  });
}

function renderAcademyActionButtons(actions, primary = false) {
  return actions.map((item) => {
    const buttonClass = primary ? "route-action route-action--primary" : "route-action";
    return `
      <button class="${buttonClass}" data-academy-action="${item.action}" data-academy-variant="${item.variant || ""}" data-academy-house="${item.houseId || ""}">
        ${item.label}
      </button>
    `;
  }).join("");
}

function attachAcademyActionHandlers(container) {
  container.querySelectorAll("[data-academy-action]").forEach((button) => {
    button.addEventListener("click", () => handleAcademyAction(button.dataset.academyAction, button.dataset.academyVariant || "", button.dataset.academyHouse || ""));
  });
}

function handleAcademyAction(action, variant = "", houseId = "") {
  if (action === "daily") {
    startSession();
    return;
  }
  if (action === "openIsland") {
    selectedIslandId = variant || selectedIslandId;
    showView("map");
    return;
  }
  if (action === "funBreak") {
    showView("trainers");
    renderFunBreak("any", "main", true);
    document.querySelector("#funBreak")?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  startTrainer(action, variant, houseId);
}

function handleTodayRouteAction() {
  handleAcademyAction(todayRouteAction.action || "daily", todayRouteAction.variant || "", todayRouteAction.houseId || "");
}

function getScoredAcademyHouses() {
  const houses = [];
  ACADEMY_ISLANDS.forEach((island) => {
    island.routes.forEach((route) => {
      (route.stops || []).forEach((stop) => {
        if (stop.optional || stop.action === "funBreak") return;
        houses.push(createAcademyHouse(island, route, stop));
      });
    });
    if (island.id === "world" && !houses.some((house) => house.island.id === "world")) {
      houses.push(createAcademyHouse(island, island.routes[0], {
        id: "world-facts",
        label: "Дом наблюдений",
        action: "worldQuest",
        skillIds: ["worldFacts"]
      }));
    }
  });
  return houses;
}

function createAcademyHouse(island, route, stop) {
  return {
    houseId: `${island.id}:${stop.id}`,
    island,
    route,
    stop,
    label: getHouseLabel(stop),
    icon: getHouseIcon(stop.action),
    terrain: getIslandTerrain(island.id)
  };
}

function getHouseLabel(stop) {
  const labels = {
    warmup: "Дом разминки",
    fast100: "Дом счета",
    mixed: "Дом смешанного счета",
    multiply: "Дом таблицы",
    "hard-table": "Дом трудных случаев",
    "math-stories": "Дом задач",
    "life-math": "Город измерений",
    dictionary: "Дом словарных слов",
    "word-detective": "Лаборатория букв",
    "russian-games": "Бюро слов",
    "word-puzzles": "Башня головоломок",
    proverbs: "Дом пословиц",
    "read-text": "Дом текста",
    "main-idea": "Мост главной мысли",
    "hero-traces": "Дом героев",
    "world-facts": "Дом наблюдений"
  };
  return labels[stop.id] || stop.label;
}

function getHouseIcon(action) {
  return {
    fast10: "⚡",
    fast100: "🏠",
    mixedMath: "🔢",
    multiply: "✖",
    mathStories: "📘",
    lifeMath: "🧭",
    dictionary: "✍",
    wordDetective: "🔎",
    russianGames: "🕵",
    wordPuzzles: "🧩",
    proverbs: "📜",
    readingQuest: "📖",
    worldQuest: "🌿"
  }[action] || "🏠";
}

function getIslandTerrain(islandId) {
  return {
    math: "Горы счета",
    russian: "Сады букв",
    reading: "Книжная бухта",
    world: "Лес наблюдений"
  }[islandId] || "Остров";
}

function getIslandDisplayTitle(island) {
  return island.id === "world" ? "Остров окружающего мира" : island.title;
}

function getTodayHousePlan() {
  const today = new Date();
  const todayKey = dateKey(today);
  const planned = getPlannedHousesForDate(today).map((house) => ({ ...house, planType: "today" }));
  const catchUp = [];
  for (let daysBack = 1; daysBack <= 7 && catchUp.length < 1; daysBack += 1) {
    const missedDate = new Date(today);
    missedDate.setDate(missedDate.getDate() - daysBack);
    const missedKey = dateKey(missedDate);
    const missedHouse = getPlannedHousesForDate(missedDate)
      .find((house) => !getHouseDayStats(house, missedKey).lit && !planned.some((item) => item.houseId === house.houseId));
    if (missedHouse) catchUp.push({ ...missedHouse, planType: "catchup" });
  }
  const merged = [...catchUp, ...planned];
  const unique = [];
  merged.forEach((house) => {
    if (!unique.some((item) => item.houseId === house.houseId)) unique.push(house);
  });
  return unique.slice(0, DAILY_HOUSE_MAX).map((house) => ({
    ...house,
    todayStats: getHouseDayStats(house, todayKey)
  }));
}

function getPlannedHousesForDate(date) {
  const houses = getScoredAcademyHouses();
  const bySubject = houses.reduce((acc, house) => {
    const subject = house.island.subject;
    acc[subject] = acc[subject] || [];
    acc[subject].push(house);
    return acc;
  }, {});
  const dayIndex = getSummerDayIndex(date);
  const pick = (subject, offset = 0) => {
    const list = bySubject[subject] || [];
    if (!list.length) return null;
    return list[(dayIndex + offset) % list.length];
  };
  const plan = [
    pick("math", 0),
    pick("russian", 1),
    pick("reading", 2)
  ].filter(Boolean);
  if (dayIndex % 2 === 0 || plan.length < DAILY_HOUSE_MIN) {
    const world = pick("world", 3);
    if (world) plan.push(world);
  }
  return plan.slice(0, dayIndex % 2 === 0 ? DAILY_HOUSE_MAX : DAILY_HOUSE_MIN);
}

function getHouseDayStats(house, dayKey) {
  const attempts = state.attempts.filter((attempt) => attempt.date === dayKey && attempt.houseId === house.houseId);
  const houseSessions = state.dailySessions.filter((item) => item.date === dayKey && item.houseId === house.houseId);
  const bestSession = houseSessions.reduce((best, item) => {
    if (!best) return item;
    return (item.correct || 0) > (best.correct || 0) ? item : best;
  }, null);
  const correct = bestSession ? bestSession.correct : attempts.filter((attempt) => attempt.correct).length;
  const total = bestSession ? bestSession.total : attempts.length;
  return {
    total,
    correct,
    needed: Math.max(0, DAILY_HOUSE_PASS_COUNT - correct),
    lit: correct >= DAILY_HOUSE_PASS_COUNT && total >= DAILY_HOUSE_TASK_COUNT,
    accuracy: total ? Math.round((correct / total) * 100) : 0
  };
}

function getSummerDayIndex(date) {
  const start = new Date(date.getFullYear(), 5, 1);
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return Math.max(0, Math.floor((normalized - start) / 86400000));
}

function getSummerFinishDate() {
  return new Date(new Date().getFullYear(), SUMMER_FINISH_MONTH, SUMMER_FINISH_DAY);
}

function getDaysUntilSummerFinish() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const finish = getSummerFinishDate();
  finish.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((finish - today) / 86400000));
}

function getIslandLightPercent(island) {
  const houses = getScoredAcademyHouses().filter((house) => house.island.id === island.id);
  const houseIds = new Set(houses.map((house) => house.houseId));
  const completedHouseDays = new Set();
  state.attempts.forEach((attempt) => {
    if (!attempt.houseId || !houseIds.has(attempt.houseId)) return;
    const house = houses.find((item) => item.houseId === attempt.houseId);
    if (house && getHouseDayStats(house, attempt.date).lit) {
      completedHouseDays.add(`${attempt.date}:${attempt.houseId}`);
    }
  });
  return Math.min(100, completedHouseDays.size * 4);
}

function getHouseStateClass(house, planIds) {
  if (house.todayStats?.lit) return "daily-house--lit";
  if (house.planType === "catchup") return "daily-house--catchup";
  if (planIds.has(house.houseId)) return "daily-house--today";
  return "daily-house--quiet";
}

function getAllAcademyStops() {
  return ACADEMY_ISLANDS.flatMap((island) => island.routes.flatMap((route) => {
    const stops = route.stops?.length ? route.stops : route.actions.map((action, index) => ({
      id: `${route.id || normalizeAnswer(route.title)}-${index}`,
      label: action.label,
      action: action.action,
      variant: action.variant || "",
      skillIds: route.skillIds || []
    }));
    return stops.map((stop) => ({ island, route, stop }));
  }));
}

function getRouteSkillIds(route) {
  return route.stops?.length
    ? [...new Set(route.stops.flatMap((stop) => stop.skillIds || route.skillIds || []))]
    : route.skillIds || [];
}

function getIslandSkillIds(island) {
  return [...new Set(island.routes.flatMap(getRouteSkillIds))];
}

function getStopStats(stop) {
  return getAcademyGroupStats(stop.skillIds || []);
}

function getAcademyStopState(stop) {
  const stats = getStopStats(stop);
  if (stats.hasProblem || (stats.attempts >= 3 && stats.accuracy < 70)) return "review";
  if (stats.attempts >= 3 && stats.accuracy >= 85) return "mastered";
  if (stats.attempts > 0) return "active";
  return "new";
}

function getAcademyStateLabel(stateName) {
  return {
    new: "новая тропинка",
    active: "идем по тропе",
    review: "тропа просит фонарик",
    mastered: "маяк горит ровно"
  }[stateName] || "новая тропинка";
}

function getNextStop() {
  const stops = getAllAcademyStops();
  const dueMistake = state.mistakes.find((mistake) => !mistake.nextReviewAt || new Date(mistake.nextReviewAt).getTime() <= Date.now());
  if (dueMistake) {
    const action = skillToTrainerAction(dueMistake.skillId);
    const matched = stops.find(({ stop }) => stop.action === action || stop.skillIds?.includes(dueMistake.skillId));
    if (matched) {
      return {
        ...matched,
        title: "Тропа просит фонарик",
        text: `Филин Арчи сохранил место на карте: ${SKILLS[dueMistake.skillId]?.title || "повторение"}. Вернемся спокойно.`,
        button: "Повторить трудное"
      };
    }
  }

  const dayBalance = getSubjectDayBalance(7);
  const weekGap = getWeeklySubjectGap(dayBalance);
  if (weekGap) {
    const island = ACADEMY_ISLANDS.find((item) => item.subject === weekGap.subject);
    const route = island?.routes[0];
    const stop = route?.stops?.[0];
    if (island && route && stop) {
      return {
        island,
        route,
        stop,
        title: `Следующая остановка: ${route.title}`,
        text: `${SUBJECTS[island.subject].label} ждет короткого визита. Один спокойный маршрут поддержит баланс недели.`,
        button: "В путь"
      };
    }
  }

  const weakSkillId = Object.entries(state.skillStats)
    .map(([skillId, stats]) => ({ skillId, stats, accuracy: stats.attempts ? stats.correct / stats.attempts : 1 }))
    .filter((item) => item.stats.attempts >= 2 && item.accuracy < 0.7)
    .sort((a, b) => a.accuracy - b.accuracy)[0]?.skillId;
  if (weakSkillId) {
    const matched = stops.find(({ stop }) => stop.skillIds?.includes(weakSkillId));
    if (matched) {
      return {
        ...matched,
        title: "Здесь еще немного туманно",
        text: `${SKILLS[weakSkillId]?.title || "Маршрут"} лучше пройти еще раз без спешки.`,
        button: "Поставить фонарик"
      };
    }
  }

  const newStop = stops.find(({ stop, island }) => island.id !== "break" && getAcademyStopState(stop) === "new");
  if (newStop) {
    return {
      ...newStop,
      title: `Новая тропинка: ${newStop.route.title}`,
      text: `${newStop.stop.label} откроет еще один кусочек Архипелага Академии.`,
      button: "Открыть тропинку"
    };
  }

  const fallback = stops.find(({ island }) => island.id !== "break") || stops[0];
  return {
    ...fallback,
    title: "Сегодняшний маршрут",
    text: "Филин Арчи предлагает короткий путь: один остров, несколько заданий и маленькая перемена.",
    button: "Продолжить маршрут"
  };
}

function renderGuide(container, place) {
  const guide = getGuideSuggestion();
  const placeLine = place === "today"
    ? "Можно выбрать самой, а я тихонько слежу, чтобы все острова Академии получали внимание."
    : "Выбор свободный, но хороший маршрут иногда просит заглянуть не только в любимую комнату.";

  container.innerHTML = `
    <div class="guide-card__avatar" aria-hidden="true">🦉</div>
    <div>
      <p class="eyebrow">Филин Арчи</p>
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
  if (skillId === "division50") return "multiply";
  if (skillId === "wordProblems") return "mathStories";
  if (skillId === "dictionaryWords") return "dictionary";
  if (skillId === "readingMeaning") return "readingQuest";
  if (["wordLogic", "soundLetters", "spellingPairs", "unstressedVowels", "consonants", "separators", "prepositions", "sentenceText"].includes(skillId)) return "wordDetective";
  if (skillId === "wordGames") return "russianGames";
  if (skillId === "wordPuzzles") return "wordPuzzles";
  if (skillId === "proverbs") return "proverbs";
  if (skillId === "worldFacts") return "worldQuest";
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
  renderFunBreak("any", "main");
}

function renderFunBreak(showAfter = "any", target = "main", forceNew = false) {
  const elements = getFunBreakElements(target);
  if (!elements) return;
  const currentId = forceNew ? Number(elements.text.dataset.itemId || 0) : 0;
  const item = pickFunBreakItem(showAfter, target, forceNew, currentId);
  if (!item) return;

  elements.title.textContent = item.title;
  elements.text.textContent = item.text;
  elements.text.dataset.itemId = String(item.id);
  elements.answer.textContent = item.answer ? `Отгадка: ${item.answer}` : "";
  elements.answer.classList.add("hidden");
  elements.revealButton.classList.toggle("hidden", item.type !== "riddle" || !item.answer);
  elements.revealButton.dataset.answer = item.answer || "";

  if (target === "session") {
    sessionBreak.classList.remove("hidden");
    session.lastFunBreakId = item.id;
    session.shownFunBreakIds = session.shownFunBreakIds || [];
    if (!session.shownFunBreakIds.includes(item.id)) session.shownFunBreakIds.push(item.id);
    if (item.type === "micro_break") session.microBreakShown = true;
  }
}

function renderSessionBreak(showAfter = "any", forceNew = false) {
  if (!session) return;
  session.lastBreakContext = showAfter;
  renderFunBreak(showAfter, "session", forceNew);
}

function revealFunBreakAnswer(target = "main") {
  const elements = getFunBreakElements(target);
  if (!elements?.revealButton.dataset.answer) return;
  elements.answer.classList.remove("hidden");
  elements.revealButton.classList.add("hidden");
}

function getFunBreakElements(target) {
  if (target === "session") {
    return {
      title: sessionBreakTitle,
      text: sessionBreakText,
      answer: sessionBreakAnswer,
      revealButton: revealSessionBreakAnswerBtn
    };
  }
  if (target === "today") {
    return {
      title: todayFunBreakTitle,
      text: todayFunBreakText,
      answer: todayFunBreakAnswer,
      revealButton: revealTodayBreakAnswerBtn
    };
  }
  return {
    title: funBreakTitle,
    text: jokeLine,
    answer: funBreakAnswer,
    revealButton: revealBreakAnswerBtn
  };
}

function pickFunBreakItem(showAfter = "any", target = "main", forceNew = false, currentId = 0) {
  const usedIds = target === "session" && session ? session.shownFunBreakIds || [] : [];
  const candidates = FUN_BREAK_ITEMS.filter((item) => {
    if (!item.isActive) return false;
    if (forceNew && item.id === currentId) return false;
    if (target === "session" && usedIds.includes(item.id)) return false;
    if (target === "session" && session?.microBreakShown && item.type === "micro_break") return false;
    if (showAfter === "after_error") return ["after_error", "any"].includes(item.showAfter) && (item.type === "support" || item.tone === "calm");
    if (showAfter === "after_success") return ["after_success", "any"].includes(item.showAfter);
    if (showAfter === "after_session") return ["after_session", "any"].includes(item.showAfter) && ["support", "fact", "joke", "dialogue", "anekdot"].includes(item.type);
    return item.showAfter === "any";
  });
  const pool = candidates.length ? candidates : FUN_BREAK_ITEMS.filter((item) => item.isActive && item.showAfter === "any");
  return weightedSample(pool);
}

function weightedSample(items) {
  const total = items.reduce((sum, item) => sum + (item.weight || 1), 0);
  let cursor = Math.random() * total;
  for (const item of items) {
    cursor -= item.weight || 1;
    if (cursor <= 0) return item;
  }
  return items[items.length - 1];
}

function getFunBreakLine(showAfter = "any") {
  return pickFunBreakItem(showAfter, "main")?.text || sample(ACADEMY_JOKES);
}

function startTrainer(modeId, variant, houseId = "") {
  const mode = TRAINER_MODES.find((item) => item.id === modeId);
  const tasks = buildTrainerTasks(modeId, variant, houseId ? DAILY_HOUSE_TASK_COUNT : 0);
  startSession({
    mode: "trainer",
    title: mode ? mode.title : (modeId === "worldQuest" ? "Лесная экспедиция" : "Тренажер"),
    tasks,
    houseId
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
    houseId: options.houseId || "",
    plannedLength: tasks.length,
    results: [],
    shownFunBreakIds: [],
    microBreakShown: false,
    lastBreakContext: "any",
    tryCount: 0,
    usedHint: false,
    locked: false
  };

  showView("today");
  startSessionBtn.closest(".today-card").classList.add("hidden");
  subjectLaunch.classList.add("hidden");
  todayGuideCard.classList.add("hidden");
  todayFunBreak.classList.add("hidden");
  finishPanel.classList.add("hidden");
  questPanel.classList.remove("hidden");
  renderQuestion();
}

function buildDailySession() {
  const freshFactories = [
    makeNumbersTask,
    makeAddSubTask,
    makeMultiplicationTask,
    makeDivisionTask,
    makeWordProblemTask,
    makeGeometryTask,
    makeMeasuresTask,
    makeDictionaryTask,
    makeDictionaryMissingTask,
    makeDictionaryWriteTask,
    makeWordDetectiveTask,
    makeReadingTask,
    makeRussianGameTask,
    makeWordPuzzleTask,
    makeProverbTask,
    makeWorldFactTask
  ];
  return buildAdaptiveTasks(10, freshFactories, "daily", { maxReviews: 3 });
}

function buildTrainerTasks(modeId, variant, countOverride = 0) {
  const builders = {
    fast10: () => buildAdaptiveTasks(countOverride || 10, [() => makeFastArithmeticTask("within10")], "fast10", { maxReviews: 2 }),
    fast100: () => buildAdaptiveTasks(countOverride || 12, [
      () => makeFastArithmeticTask("within20"),
      () => makeFastArithmeticTask("within100"),
      () => makeFastArithmeticTask("roundTens"),
      () => makeFastArithmeticTask("compare"),
      () => makeFastArithmeticTask("unknown")
    ], "fast100", { maxReviews: 3 }),
    multiply: () => buildAdaptiveTasks(countOverride || 12, [() => makeMultiplicationTask(variant)], "multiply", { maxReviews: 3 }),
    mixedMath: () => buildAdaptiveTasks(countOverride || 12, [makeMixedMathTask], "mixedMath", { maxReviews: 3 }),
    lifeMath: () => buildAdaptiveTasks(countOverride || 8, [makeLifeMathTask], "lifeMath", { maxReviews: 2 }),
    mathStories: () => buildAdaptiveTasks(countOverride || 8, [makeMathStoryTask], "mathStories", { maxReviews: 2 }),
    dictionary: () => buildAdaptiveTasks(countOverride || 12, [makeDictionaryTask, makeDictionaryMissingTask, makeDictionaryWriteTask], "dictionary", { maxReviews: 3 }),
    wordDetective: () => buildAdaptiveTasks(countOverride || 10, [makeWordDetectiveTask], "wordDetective", { maxReviews: 3 }),
    playroom: () => buildAdaptiveTasks(countOverride || 8, [makeRussianGameTask, makeWordPuzzleTask], "playroom", { maxReviews: 2 }),
    russianGames: () => buildAdaptiveTasks(countOverride || 8, [makeRussianGameTask], "russianGames", { maxReviews: 2 }),
    wordPuzzles: () => buildAdaptiveTasks(countOverride || 6, [makeWordPuzzleTask], "wordPuzzles", { maxReviews: 1 }),
    proverbs: () => buildAdaptiveTasks(countOverride || 8, [makeProverbTask], "proverbs", { maxReviews: 2 }),
    readingQuest: () => buildAdaptiveTasks(countOverride || 8, [makeReadingTask], "readingQuest", { maxReviews: 2 }),
    worldQuest: () => buildAdaptiveTasks(countOverride || DAILY_HOUSE_TASK_COUNT, [makeWorldFactTask], "worldQuest", { maxReviews: 1 })
  };
  return (builders[modeId] || builders.fast100)();
}

function buildAdaptiveTasks(count, factories, modeId, options = {}) {
  const maxReviews = options.maxReviews ?? 2;
  const tasks = getDueReviewTasks(modeId, maxReviews);
  const usedPrompts = new Set(tasks.map((task) => task.prompt));
  const maxAttempts = count * 16;

  for (let attempt = 0; tasks.length < count && attempt < maxAttempts; attempt += 1) {
    const candidates = Array.from({ length: Math.min(6, Math.max(3, factories.length * 2)) }, () => {
      const factory = sample(factories);
      const task = ensureTaskMeta(factory());
      return { task, score: scoreTaskForAdaptiveSession(task, tasks, usedPrompts) };
    }).sort((a, b) => b.score - a.score);

    const picked = candidates.find((candidate) => !usedPrompts.has(candidate.task.prompt)) || candidates[0];
    if (!picked) break;
    tasks.push(picked.task);
    usedPrompts.add(picked.task.prompt);
  }

  while (tasks.length < count) {
    const task = ensureTaskMeta(sample(factories)());
    tasks.push(task);
  }

  return spaceReviewTasks(tasks).slice(0, count);
}

function getDueReviewTasks(modeId, limit) {
  const now = Date.now();
  const mistakeTasks = state.mistakes
    .filter((mistake) => isMistakeRelevantForMode(mistake, modeId))
    .filter((mistake) => !mistake.nextReviewAt || new Date(mistake.nextReviewAt).getTime() <= now)
    .slice(0, limit)
    .map((mistake) => taskFromMistake(mistake));
  const usedPrompts = new Set(mistakeTasks.map((task) => task.prompt));
  const progressTasks = Object.values(state.taskProgress || {})
    .filter((progress) => ["review", "mastered"].includes(progress.status))
    .filter((progress) => isProgressRelevantForMode(progress, modeId))
    .filter((progress) => isTaskDueForReview(progress))
    .filter((progress) => !usedPrompts.has(progress.prompt))
    .slice(0, Math.max(0, limit - mistakeTasks.length))
    .map(progressToReviewTask);
  return [...mistakeTasks, ...progressTasks];
}

function isMistakeRelevantForMode(mistake, modeId) {
  if (modeId === "daily") return true;
  return skillToTrainerAction(mistake.skillId) === modeId || (
    modeId === "playroom" && ["russianGames", "wordPuzzles"].includes(skillToTrainerAction(mistake.skillId))
  );
}

function isProgressRelevantForMode(progress, modeId) {
  if (modeId === "daily") return true;
  return skillToTrainerAction(progress.skillId) === modeId || (
    modeId === "playroom" && ["russianGames", "wordPuzzles"].includes(skillToTrainerAction(progress.skillId))
  );
}

function progressToReviewTask(progress) {
  const task = {
    type: progress.type || "input",
    skillId: progress.skillId,
    prompt: progress.prompt,
    answer: progress.answer,
    choices: progress.choices || [],
    acceptedAnswers: progress.acceptedAnswers || [],
    explanation: `Это дальнее повторение, чтобы знание не потерялось. ${progress.explanation || ""}`,
    dictionaryWord: progress.dictionaryWord || "",
    dictionaryWordId: progress.dictionaryWordId || "",
    dictionaryTheme: progress.dictionaryTheme || "",
    strictAnswer: Boolean(progress.strictAnswer),
    isReview: true,
    taskKey: progress.taskKey
  };
  if (task.type !== "input" && !task.choices.length) task.type = "input";
  return task;
}

function scoreTaskForAdaptiveSession(task, currentTasks, usedPrompts) {
  const progress = getTaskProgress(task);
  const skillStats = state.skillStats[task.skillId] || { attempts: 0, correct: 0, mistakes: 0, streak: 0 };
  const skillAccuracy = skillStats.attempts ? skillStats.correct / skillStats.attempts : 1;
  const previousTask = currentTasks[currentTasks.length - 1];
  let score = Math.random();

  if (!progress.shownCount) score += 1.5;
  if (progress.status === "review") score += 3;
  if (progress.status === "learning") score += 2;
  if (progress.status === "problem") score += 4;
  if (progress.status === "mastered") score -= 2;
  if (isTaskDueForReview(progress)) score += 2.5;
  if (skillStats.attempts >= 2 && skillAccuracy < 0.85) score += 2.5;
  if (skillStats.mistakes >= 2 && skillStats.mistakes >= skillStats.correct) score += 1.5;
  if (previousTask?.skillId === task.skillId) score -= 3;
  if (usedPrompts.has(task.prompt)) score -= 8;

  return score;
}

function spaceReviewTasks(tasks) {
  const spaced = [];
  const deferred = [];
  tasks.forEach((task) => {
    const previous = spaced[spaced.length - 1];
    if (task.isReview && previous?.isReview) {
      deferred.push(task);
    } else {
      spaced.push(task);
    }
  });

  deferred.forEach((task) => {
    const index = Math.min(spaced.length, 3);
    spaced.splice(index, 0, task);
  });

  return spaced;
}

function taskFromMistake(mistake) {
  const task = createTaskBySkill(mistake.skillId);
  task.prompt = mistake.prompt;
  task.answer = mistake.answer;
  if (mistake.choices && mistake.choices.length) {
    task.choices = mistake.choices;
  } else {
    task.type = "input";
    task.choices = [];
  }
  task.acceptedAnswers = mistake.acceptedAnswers || task.acceptedAnswers || [];
  task.dictionaryWord = mistake.dictionaryWord || task.dictionaryWord || "";
  task.dictionaryWordId = mistake.dictionaryWordId || task.dictionaryWordId || "";
  task.dictionaryTheme = mistake.dictionaryTheme || task.dictionaryTheme || "";
  task.strictAnswer = Boolean(mistake.strictAnswer || task.strictAnswer);
  task.explanation = `Это задание вернулось для мягкого повторения. ${mistake.explanation || task.explanation}`;
  task.isReview = true;
  task.taskKey = mistake.taskKey || makeTaskKey(task);
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
    orderActions: makeAddSubTask,
    spellingPairs: makeWordDetectiveTask,
    unstressedVowels: makeWordDetectiveTask,
    consonants: makeWordDetectiveTask,
    dictionaryWords: makeDictionaryTask,
    separators: makeWordDetectiveTask,
    prepositions: makeWordDetectiveTask,
    wordLogic: makeWordDetectiveTask,
    wordGames: makeRussianGameTask,
    wordPuzzles: makeWordPuzzleTask,
    proverbs: makeProverbTask,
    soundLetters: makeWordDetectiveTask,
    sentenceText: makeWordDetectiveTask,
    readingMeaning: makeReadingTask,
    worldFacts: makeWorldFactTask
  };
  return (factories[skillId] || makeAddSubTask)();
}

function renderQuestion() {
  const task = ensureTaskMeta(session.tasks[session.index]);
  session.tasks[session.index] = task;
  session.locked = false;
  session.tryCount = 0;
  session.usedHint = false;
  session.questionStartedAt = Date.now();
  markTaskShown(task);
  questCounter.textContent = `Задание ${session.index + 1} из ${session.tasks.length}`;
  questSkill.textContent = `${SUBJECTS[SKILLS[task.skillId].subject].icon} ${SKILLS[task.skillId].title}`;
  questProgressBar.style.width = `${(session.index / session.tasks.length) * 100}%`;
  questPrompt.textContent = task.prompt;
  feedbackBox.classList.add("hidden");
  nextQuestionBtn.classList.add("hidden");
  sessionBreak.classList.add("hidden");
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
  if (!String(rawAnswer).trim()) {
    feedbackBox.classList.remove("hidden");
    feedbackBox.textContent = "Сначала напиши ответ, потом проверим.";
    return;
  }

  session.tryCount += 1;
  const correct = isAnswerAccepted(rawAnswer, task);
  const finalAttempt = correct || session.tryCount >= 2;

  if (task.type !== "input") {
    answerArea.querySelectorAll(".choice-button").forEach((button) => {
      const isAnswer = answersMatch(button.textContent, task.answer, task.strictAnswer);
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
    ? `Есть. Тропа стала чуть светлее. ${session.usedHint ? "Подсказка помогла дойти до ответа." : task.success || ""}`
    : `Здесь еще туманное место. Правильный ответ: ${task.answer}. ${task.explanation}`;
  renderSessionBreak(correct ? "after_success" : "after_error");
  nextQuestionBtn.classList.remove("hidden");
  const timeSpentSec = Math.round((Date.now() - session.questionStartedAt) / 1000);
  const speedStatus = getSpeedStatus(task, timeSpentSec, correct);

  const attempt = {
    id: cryptoRandomId(),
    sessionId: session.id,
    houseId: session.houseId || "",
    date: dateKey(new Date()),
    timestamp: new Date().toISOString(),
    subject: SKILLS[task.skillId].subject,
    skillId: task.skillId,
    taskKey: task.taskKey,
    prompt: task.prompt,
    answer: task.answer,
    dictionaryWord: task.dictionaryWord || "",
    dictionaryWordId: task.dictionaryWordId || "",
    dictionaryTheme: task.dictionaryTheme || "",
    userAnswer: rawAnswer,
    correct,
    isReview: Boolean(task.isReview),
    usedHint: session.usedHint,
    tries: session.tryCount,
    speedStatus,
    timeSpentSec
  };

  session.results.push(attempt);
  if (!isPreviewMode) {
    state.attempts.push(attempt);
    updateSkillStats(attempt);
    updateTaskProgress(task, attempt);
    updateMistakeBank(task, attempt);
  }
  scheduleInSessionReview(task, attempt);
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
  if (!isPreviewMode) {
    state.dailySessions.push({
      id: session.id,
      mode: session.mode,
      houseId: session.houseId || "",
      title: session.title,
      date: dateKey(new Date()),
      startedAt: new Date(session.startedAt).toISOString(),
      finishedAt: new Date().toISOString(),
      total: session.results.length,
      correct,
      mistakes,
      minutes
    });
  }
  saveState();

  questProgressBar.style.width = "100%";
  questPanel.classList.add("hidden");
  finishPanel.classList.remove("hidden");
  finishTitle.textContent = `${childName}, маршрут завершен!`;
  const slowCount = session.results.filter((item) => item.speedStatus === "slow").length;
  const fastCount = session.results.filter((item) => item.speedStatus === "fast").length;
  const speedLine = fastCount
    ? ` Ответов, которые уже идут легко: ${fastCount}.`
    : slowCount
      ? " Несколько верных ответов уже получились, теперь будем делать их легче."
      : "";
  finishText.textContent = mistakes
    ? `${POSITIVE_LINES[correct % POSITIVE_LINES.length]} Лучше всего сегодня: ${bestSkill}. ${mistakes} задания Филин Арчи сохранит на карте для спокойного повторения.${speedLine} ${getFunBreakLine("after_session")}`
    : `Все задания получились! В Архипелаге зажегся еще один огонек маршрута.${speedLine} ${getFunBreakLine("after_session")}`;
  finishCorrect.textContent = String(correct);
  finishMistakes.textContent = String(mistakes);
  finishMinutes.textContent = String(minutes);
  session = null;
  renderFunBreak("after_session", "today");
  renderFunBreak("after_session", "main");
  render();
}

function ensureTaskMeta(task) {
  if (!task.taskKey) task.taskKey = makeTaskKey(task);
  return task;
}

function makeTaskKey(task) {
  return `${task.skillId}|${normalizeAnswer(task.prompt)}|${normalizeAnswer(task.answer)}`;
}

function getTaskProgress(task) {
  const taskKey = task.taskKey || makeTaskKey(task);
  return state.taskProgress[taskKey] || {
    taskKey,
    skillId: task.skillId,
    type: task.type,
    prompt: task.prompt,
    answer: task.answer,
    choices: task.choices || [],
    acceptedAnswers: task.acceptedAnswers || [],
    explanation: task.explanation || "",
    dictionaryWord: task.dictionaryWord || "",
    dictionaryWordId: task.dictionaryWordId || "",
    dictionaryTheme: task.dictionaryTheme || "",
    strictAnswer: Boolean(task.strictAnswer),
    shownCount: 0,
    correctCount: 0,
    wrongCount: 0,
    streak: 0,
    status: "new",
    lastShownAt: "",
    lastAnsweredAt: "",
    lastWrongAt: "",
    nextReviewAt: ""
  };
}

function markTaskShown(task) {
  if (task.markedShown) return;
  if (isPreviewMode) {
    task.markedShown = true;
    return;
  }
  const progress = getTaskProgress(task);
  progress.type = task.type;
  progress.choices = task.choices || [];
  progress.acceptedAnswers = task.acceptedAnswers || [];
  progress.explanation = task.explanation || "";
  progress.dictionaryWord = task.dictionaryWord || progress.dictionaryWord || "";
  progress.dictionaryWordId = task.dictionaryWordId || progress.dictionaryWordId || "";
  progress.dictionaryTheme = task.dictionaryTheme || progress.dictionaryTheme || "";
  progress.strictAnswer = Boolean(task.strictAnswer || progress.strictAnswer);
  progress.shownCount += 1;
  progress.lastShownAt = new Date().toISOString();
  if (progress.status === "new" && progress.shownCount > 0) progress.status = "active";
  state.taskProgress[progress.taskKey] = progress;
  if (task.dictionaryWord) markDictionaryWordShown(task);
  task.markedShown = true;
}

function updateTaskProgress(task, attempt) {
  const progress = getTaskProgress(task);
  progress.skillId = task.skillId;
  progress.prompt = task.prompt;
  progress.answer = task.answer;
  progress.type = task.type;
  progress.choices = task.choices || [];
  progress.acceptedAnswers = task.acceptedAnswers || [];
  progress.explanation = task.explanation || "";
  progress.dictionaryWord = task.dictionaryWord || progress.dictionaryWord || "";
  progress.dictionaryWordId = task.dictionaryWordId || progress.dictionaryWordId || "";
  progress.dictionaryTheme = task.dictionaryTheme || progress.dictionaryTheme || "";
  progress.strictAnswer = Boolean(task.strictAnswer || progress.strictAnswer);
  progress.lastAnsweredAt = attempt.timestamp;

  if (attempt.correct) {
    progress.correctCount += 1;
    progress.streak += 1;
    if (progress.streak >= 3 && !attempt.usedHint) {
      progress.status = "mastered";
      progress.nextReviewAt = addDaysIso(14);
    } else if (progress.streak >= 2) {
      progress.status = "review";
      progress.nextReviewAt = addDaysIso(7);
    } else {
      progress.status = "learning";
      progress.nextReviewAt = addDaysIso(2);
    }
  } else {
    progress.wrongCount += 1;
    progress.streak = 0;
    progress.lastWrongAt = attempt.timestamp;
    progress.status = progress.wrongCount >= 2 ? "problem" : "learning";
    progress.nextReviewAt = addDaysIso(2);
  }

  state.taskProgress[progress.taskKey] = progress;
  if (task.dictionaryWord) updateDictionaryWordProgress(task, attempt);
}

function getDictionaryWordProgress(itemOrWord) {
  const word = typeof itemOrWord === "string" ? itemOrWord : itemOrWord.word;
  const wordId = typeof itemOrWord === "string" ? normalizeAnswer(itemOrWord) : itemOrWord.id;
  return state.wordProgress[wordId] || {
    wordId,
    word,
    shownCount: 0,
    correctCount: 0,
    wrongCount: 0,
    streak: 0,
    status: "new",
    lastShownAt: "",
    lastAnsweredAt: "",
    lastWrongAt: "",
    nextReviewAt: ""
  };
}

function markDictionaryWordShown(task) {
  const wordId = task.dictionaryWordId || normalizeAnswer(task.dictionaryWord);
  const progress = getDictionaryWordProgress({ id: wordId, word: task.dictionaryWord });
  progress.shownCount += 1;
  progress.lastShownAt = new Date().toISOString();
  if (progress.status === "new") progress.status = "active";
  state.wordProgress[wordId] = progress;
}

function updateDictionaryWordProgress(task, attempt) {
  const wordId = task.dictionaryWordId || normalizeAnswer(task.dictionaryWord);
  const progress = getDictionaryWordProgress({ id: wordId, word: task.dictionaryWord });
  progress.lastAnsweredAt = attempt.timestamp;

  if (attempt.correct) {
    progress.correctCount += 1;
    progress.streak += 1;
    if (progress.streak >= 3 && !attempt.usedHint) {
      progress.status = "mastered";
      progress.nextReviewAt = addDaysIso(14);
    } else if (progress.streak >= 2) {
      progress.status = "review";
      progress.nextReviewAt = addDaysIso(7);
    } else {
      progress.status = "learning";
      progress.nextReviewAt = addDaysIso(2);
    }
  } else {
    progress.wrongCount += 1;
    progress.streak = 0;
    progress.lastWrongAt = attempt.timestamp;
    progress.status = progress.wrongCount >= 2 ? "problem" : "learning";
    progress.nextReviewAt = addDaysIso(2);
  }

  state.wordProgress[wordId] = progress;
}

function isWordDueForReview(progress) {
  if (!progress.nextReviewAt) return false;
  return new Date(progress.nextReviewAt).getTime() <= Date.now();
}

function isTaskDueForReview(progress) {
  if (!progress.nextReviewAt) return false;
  return new Date(progress.nextReviewAt).getTime() <= Date.now();
}

function addDaysIso(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function scheduleInSessionReview(task, attempt) {
  if (attempt.correct || task.isReview || !session) return;
  if (session.tasks.length >= session.plannedLength + 3) return;
  if (session.tasks.some((item, index) => index > session.index && item.prompt === task.prompt)) return;

  const reviewTask = {
    ...task,
    isReview: true,
    markedShown: false,
    explanation: `Это задание вернулось через несколько шагов. ${task.explanation}`
  };
  const insertAt = Math.min(session.tasks.length, session.index + 3);
  session.tasks.splice(insertAt, 0, reviewTask);
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
  const existingMistake = state.mistakes.find((item) => item.prompt === task.prompt);
  state.mistakes = state.mistakes.filter((item) => item.prompt !== task.prompt);
  if (!attempt.correct) {
    const previousRepeats = existingMistake?.repeats || 0;
    state.mistakes.unshift({
      id: cryptoRandomId(),
      skillId: task.skillId,
      taskKey: task.taskKey,
      prompt: task.prompt,
      answer: task.answer,
      dictionaryWord: task.dictionaryWord || "",
      dictionaryWordId: task.dictionaryWordId || "",
      dictionaryTheme: task.dictionaryTheme || "",
      strictAnswer: Boolean(task.strictAnswer),
      choices: task.choices || [],
      acceptedAnswers: task.acceptedAnswers || [],
      explanation: task.explanation || "",
      lastWrongAt: attempt.timestamp,
      nextReviewAt: addDaysIso(2),
      repeats: task.isReview ? previousRepeats + 1 : previousRepeats
    });
  }
}

function renderMap() {
  const nextStop = getNextStop();
  const selectedIsland = ACADEMY_ISLANDS.find((island) => island.id === selectedIslandId) || ACADEMY_ISLANDS[0];
  academyMap.innerHTML = "";
  academyMap.innerHTML = `
    <section class="next-stop-card">
      <div>
        <p class="eyebrow">Следующая остановка</p>
        <h3>${nextStop.title}</h3>
        <p>${nextStop.text}</p>
      </div>
      <button class="primary-action" data-academy-action="${nextStop.stop?.action || "daily"}" data-academy-variant="${nextStop.stop?.variant || ""}">
        ${nextStop.button || "В путь"}
      </button>
    </section>
    <section class="academy-world" aria-label="Архипелаг Академии">
      <div class="world-map">
        ${ACADEMY_ISLANDS.map((island) => {
          const subject = SUBJECTS[island.subject];
          const stats = getAcademyGroupStats(getIslandSkillIds(island));
          const isActive = island.id === selectedIsland.id;
          return `
            <button class="world-island ${isActive ? "world-island--active" : ""}" type="button" data-island-id="${island.id}" aria-pressed="${isActive}" style="--island-color:${subject.color}; --island-x:${island.position?.x || 50}%; --island-y:${island.position?.y || 50}%">
              <span class="world-island__marker">${island.icon}</span>
              <span class="world-island__label">${getIslandDisplayTitle(island)}</span>
              <small>${stats.status}</small>
            </button>
          `;
        }).join("")}
      </div>
      ${renderIslandDrawer(selectedIsland, nextStop.stop?.id || "")}
    </section>
  `;
  attachAcademyActionHandlers(academyMap);
  attachWorldMapHandlers(academyMap);
}

function renderIslandDrawer(island, nextStopId = "") {
  const subject = SUBJECTS[island.subject];
  const islandStats = getAcademyGroupStats(getIslandSkillIds(island));
  return `
    <article class="island-drawer" style="--island-color:${subject.color}">
      <div class="island-card__header">
        <div class="island-icon">${island.icon}</div>
        <div>
          <p class="eyebrow">${island.landmark}</p>
          <h3>${getIslandDisplayTitle(island)}</h3>
          <p>${island.text}</p>
        </div>
      </div>
      <div class="skill-meter" aria-label="${getIslandDisplayTitle(island)}: ${islandStats.doneLabel}"><span style="width:${islandStats.accuracy}%"></span></div>
      <div class="island-meta">
        <span>${islandStats.doneLabel}</span>
        <span>${islandStats.status}</span>
      </div>
      <div class="route-map">
        ${island.routes.map((route) => renderRoutePath(route, nextStopId, island)).join("")}
      </div>
    </article>
  `;
}

function renderRoutePath(route, nextStopId = "", island = null) {
  const routeStats = getAcademyGroupStats(getRouteSkillIds(route));
  return `
    <section class="island-route">
      <div class="island-route__heading">
        <div>
          <h4>${route.title}</h4>
          <p>${route.description}</p>
        </div>
        <span>${routeStats.status}</span>
      </div>
      <div class="island-path">
        ${(route.stops || []).map((stop, index) => {
          const stateName = getAcademyStopState(stop);
          const isNext = nextStopId === stop.id;
          return `
            <button class="path-node path-node--${stateName} ${isNext ? "path-node--next" : ""}" type="button" data-academy-action="${stop.action}" data-academy-variant="${stop.variant || ""}" data-academy-house="${getHouseIdForStop(island, stop)}" ${isNext ? 'aria-current="step"' : ""}>
              <span class="path-node__dot">${getPathNodeIcon(stateName, index)}</span>
              <span>
                <strong>${stop.label}</strong>
                <small>${getAcademyStateLabel(stateName)}</small>
              </span>
            </button>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function attachWorldMapHandlers(container) {
  container.querySelectorAll("[data-island-id]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedIslandId = button.dataset.islandId;
      renderMap();
    });
  });
}

function getPathNodeIcon(stateName, index) {
  if (stateName === "mastered") return "✓";
  if (stateName === "review") return "!";
  if (stateName === "active") return String(index + 1);
  return "•";
}

function getHouseIdForStop(island, stop) {
  if (!island || !stop || stop.action === "funBreak") return "";
  return `${island.id}:${stop.id}`;
}

function getAcademyGroupStats(skillIds) {
  const totals = skillIds.reduce((acc, skillId) => {
    const stats = state.skillStats[skillId] || { attempts: 0, correct: 0, mistakes: 0, streak: 0 };
    acc.attempts += stats.attempts || 0;
    acc.correct += stats.correct || 0;
    acc.mistakes += stats.mistakes || 0;
    acc.hasProblem = acc.hasProblem || (stats.mistakes || 0) > (stats.correct || 0) && (stats.attempts || 0) >= 2;
    acc.hasMastered = acc.hasMastered || (stats.attempts || 0) >= 3 && (stats.correct || 0) / Math.max(1, stats.attempts || 0) >= 0.85;
    return acc;
  }, { attempts: 0, correct: 0, mistakes: 0, hasProblem: false, hasMastered: false });

  const accuracy = totals.attempts ? Math.round((totals.correct / totals.attempts) * 100) : 0;
  let status = "карта свернута";
  if (totals.hasProblem || (totals.attempts >= 3 && accuracy < 70)) {
    status = "тропа просит фонарик";
  } else if (totals.hasMastered || accuracy >= 85) {
    status = "маяк горит ровно";
  } else if (totals.attempts > 0) {
    status = "идем по тропе";
  }

  return {
    ...totals,
    accuracy,
    status,
    doneLabel: totals.attempts ? `${totals.correct}/${totals.attempts} верно` : "еще не открыто"
  };
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
    const dueLabel = getReviewDueLabel(mistake.nextReviewAt);
    const card = document.createElement("article");
    card.className = "mistake-card";
    card.innerHTML = `
      <strong>${subject.icon} ${skill.title}</strong>
      <p>${mistake.prompt}</p>
      <div class="pill-row">
        <span class="pill">Ответ: ${mistake.answer}</span>
        <span class="pill">${dueLabel}</span>
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
  return makeVerifiedComparisonTask();
}

function makeAddSubTask() {
  const item = sample(MATH_FAST100_TASKS);
  const task = inputTask("addSub100", `${item.example} = ?`, String(item.answer), `Тема: ${item.topic}.`);
  task.math = makeMathTaskMeta(item);
  task.speedTargetSec = 7;
  return task;
}

function makeVerifiedComparisonTask() {
  const item = sample(MATH_COMPARISON_TASKS);
  const task = choiceTask("numbers100", `Поставь знак: ${item.example.replace("__", "...")}`, item.answer, [">", "<", "="], `Тема: ${item.topic}.`);
  task.math = makeMathTaskMeta(item);
  task.speedTargetSec = 8;
  return task;
}

function makeFastArithmeticTask(level) {
  if (level === "within10") {
    const task = makeAddSubTask();
    task.speedTargetSec = 3;
    return task;
  }

  if (level === "verified") {
    return makeAddSubTask();
  }

  if (level === "within20") {
    return makeAddSubTask();
  }

  if (level === "roundTens") {
    return makeAddSubTask();
  }

  if (level === "compare") {
    return makeVerifiedComparisonTask();
  }

  if (level === "unknown") {
    const item = sample(MATH_UNKNOWN_TASKS);
    const task = inputTask("addSub100", `${item.example}. Найди □.`, String(item.answer), `Тема: ${item.topic}.`);
    task.math = makeMathTaskMeta(item);
    task.speedTargetSec = 10;
    return task;
  }

  return makeAddSubTask();
}

function makeMultiplicationTask(variant = "all") {
  const examples = MATH_MULTIPLICATION_TASKS.filter((item) => {
    const [left, , right] = item.example.split(" ");
    const hasVariant = variant === "all" || String(left) === String(variant) || String(right) === String(variant);
    const hard = [6, 7, 8, 9].includes(Number(left)) || [6, 7, 8, 9].includes(Number(right));
    return variant === "hard" ? hard : hasVariant;
  });
  const item = sample(examples.length ? examples : MATH_MULTIPLICATION_TASKS);
  const task = inputTask("multiplication50", `${item.example} = ?`, String(item.answer), `Тема: ${item.topic}.`);
  task.math = makeMathTaskMeta(item);
  task.speedTargetSec = 5;
  return task;
}

function makeDivisionTask() {
  const item = sample(MATH_DIVISION_TASKS);
  const task = inputTask("division50", `${item.example} = ?`, String(item.answer), `Тема: ${item.topic}.`);
  task.math = makeMathTaskMeta(item);
  task.speedTargetSec = 6;
  return task;
}

function makeMixedMathTask() {
  const item = sample([...MATH_MIXED_TASKS, ...MATH_COMPARISON_TASKS.filter((task) => task.topic === "смешанное сравнение")]);
  const task = item.hasComparison
    ? choiceTask("addSub100", `Поставь знак: ${item.example.replace("__", "...")}`, item.answer, [">", "<", "="], `Тема: ${item.topic}.`)
    : inputTask("addSub100", `${item.example} = ?`, String(item.answer), `Тема: ${item.topic}.`);
  task.math = makeMathTaskMeta(item);
  task.speedTargetSec = item.hasComparison ? 8 : 7;
  return task;
}

function makeWordProblemTask() {
  return makeMathStoryTask();
}

function makeMathStoryTask() {
  const storyTask = sample(MATH_STORY_TASKS);
  const task = inputTask("wordProblems", storyTask.taskText, storyTask.answer, `${storyTask.hint} Тип задачи: ${storyTask.originalType}.`);
  task.mathStory = {
    id: storyTask.id,
    topic: storyTask.topic,
    type: storyTask.type,
    difficulty: storyTask.difficulty,
    operations: storyTask.operations,
    stepsCount: storyTask.stepsCount
  };
  task.speedTargetSec = storyTask.stepsCount > 1 ? 25 : 18;
  return task;
}

function buildMathExampleTopics() {
  const topics = [];

  FAST100_TOPIC_META.forEach((meta, index) => {
    topics.push({
      ...meta,
      block: "fast100",
      hasComparison: false,
      examples: [
        ...VERIFIED_FAST100_EXAMPLES.slice(index * 10, index * 10 + 10),
        ...VERIFIED_FAST100_EXAMPLES.slice(120 + index * 10, 120 + index * 10 + 10)
      ]
    });
  });

  COMPARISON_TOPIC_META.slice(0, 3).forEach((meta) => {
    topics.push({ ...meta, block: "comparison", hasComparison: true, requiresTransition: false });
  });

  topics.push({
    topic: "нахождение неизвестного слагаемого",
    operation: "unknown_addend",
    difficulty: 2,
    requiresTransition: false,
    hasComparison: false,
    block: "unknown",
    level: 6,
    examples: [...VERIFIED_UNKNOWN_EXAMPLES.slice(0, 8), ...VERIFIED_UNKNOWN_EXAMPLES.slice(16, 28)]
  });
  topics.push({
    topic: "нахождение неизвестного уменьшаемого или вычитаемого",
    operation: "unknown_subtraction",
    difficulty: 2,
    requiresTransition: false,
    hasComparison: false,
    block: "unknown",
    level: 6,
    examples: [...VERIFIED_UNKNOWN_EXAMPLES.slice(8, 16), ...VERIFIED_UNKNOWN_EXAMPLES.slice(28, 40)]
  });

  [2, 3, 4, 5, 6, 7, 8, 9].forEach((factor) => {
    topics.push({
      topic: `таблица умножения на ${factor}`,
      operation: "multiplication",
      difficulty: factor <= 5 ? 2 : 3,
      requiresTransition: false,
      hasComparison: false,
      block: "multiplication",
      level: factor <= 5 ? 7 : 8,
      examples: buildMultiplicationTableExamples(factor)
    });
  });

  topics.push({
    topic: "деление по таблице умножения",
    operation: "division",
    difficulty: 3,
    requiresTransition: false,
    hasComparison: false,
    block: "division",
    level: 9,
    examples: VERIFIED_DIVISION_EXAMPLES.slice(0, 20)
  });
  topics.push({
    topic: "смешанные примеры на умножение и деление",
    operation: "mixed_multiplication_division",
    difficulty: 3,
    requiresTransition: false,
    hasComparison: false,
    block: "mixed",
    level: 10,
    examples: MIXED_MULTIPLICATION_DIVISION_EXAMPLES
  });

  COMPARISON_TOPIC_META.slice(3, 5).forEach((meta) => {
    topics.push({ ...meta, block: "comparison", hasComparison: true, requiresTransition: false });
  });

  topics.push({
    topic: "смешанный счет в пределах 100",
    operation: "mixed",
    difficulty: 3,
    requiresTransition: true,
    hasComparison: false,
    block: "mixed",
    level: 10,
    examples: MIXED_100_EXAMPLES
  });
  topics.push({ ...COMPARISON_TOPIC_META[5], block: "comparison", hasComparison: true, requiresTransition: false });

  return topics;
}

function buildMultiplicationTableExamples(factor) {
  return [
    ...Array.from({ length: 10 }, (_, index) => `${factor} × ${index + 1}`),
    ...Array.from({ length: 10 }, (_, index) => index + 1)
      .filter((value) => value !== factor)
      .map((value) => `${value} × ${factor}`),
    `${factor} × 0`
  ];
}

function normalizeMathExample(group, example, groupIndex, exampleIndex) {
  const answer = group.hasComparison ? solveComparisonExpression(example) : solveMathExampleAnswer(example);
  return {
    id: `math_${String(groupIndex + 1).padStart(2, "0")}_${String(exampleIndex + 1).padStart(2, "0")}`,
    section: "математика",
    block: group.block,
    topic: group.topic,
    example,
    answer: String(answer),
    operation: group.operation || inferMathOperation(example),
    difficulty: group.difficulty,
    requiresTransition: Boolean(group.requiresTransition),
    hasComparison: Boolean(group.hasComparison),
    level: group.level
  };
}

function solveMathExampleAnswer(example) {
  if (example.includes("□")) return solveUnknownExpression(example);
  return solveSimpleExpression(example);
}

function solveComparisonExpression(example) {
  const [leftRaw, rightRaw] = example.split("__").map((part) => part.trim());
  return compareSign(solveSimpleExpression(leftRaw), solveSimpleExpression(rightRaw));
}

function inferMathOperation(example) {
  if (example.includes("__")) return "comparison";
  if (example.includes("□")) return "unknown";
  if (example.includes("×") && example.includes(":")) return "mixed";
  if (example.includes("×")) return "multiplication";
  if (example.includes(":")) return "division";
  if (example.includes("+") && example.includes("-")) return "mixed";
  if (example.includes("+")) return "addition";
  if (example.includes("-")) return "subtraction";
  return "arithmetic";
}

function makeMathTaskMeta(item) {
  return {
    id: item.id,
    topic: item.topic,
    operation: item.operation,
    difficulty: item.difficulty,
    requiresTransition: item.requiresTransition,
    hasComparison: item.hasComparison,
    level: item.level
  };
}

function makeGeometryTask() {
  return makeVerifiedLifeMathTask("geometry");
}

function makeMeasuresTask() {
  return makeVerifiedLifeMathTask("measures");
}

function makeLifeMathTask() {
  const task = makeVerifiedLifeMathTask();
  task.speedTargetSec = 14;
  return task;
}

function makeVerifiedLifeMathTask(skillId) {
  const pool = skillId
    ? VERIFIED_LIFE_MATH_TASKS.filter((item) => item.skillId === skillId)
    : VERIFIED_LIFE_MATH_TASKS;
  const item = sample(pool.length ? pool : VERIFIED_LIFE_MATH_TASKS);
  const task = item.kind === "choice"
    ? choiceTask(item.skillId, item.prompt, item.answer, item.choices, item.explanation)
    : inputTask(item.skillId, item.prompt, item.answer, item.explanation);
  if (item.acceptedAnswers) task.acceptedAnswers = item.acceptedAnswers;
  if (item.visual) task.visual = item.visual;
  return task;
}

function makeWordDetectiveTask() {
  const item = sample(RUSSIAN_DETECTIVE_TASKS);
  const task = item.type === "input"
    ? inputTask(item.skillId, item.prompt, item.answer, item.explanation)
    : choiceTask(item.skillId, item.prompt, item.answer, item.choices, item.explanation);
  if (item.acceptedAnswers) task.acceptedAnswers = item.acceptedAnswers;
  return task;
}

function pickDictionaryWord(options = {}) {
  const pool = getActiveDictionaryWords(options);
  const scored = pool.map((item) => ({ item, score: scoreDictionaryWord(item) }));
  const total = scored.reduce((sum, entry) => sum + entry.score, 0);
  let cursor = Math.random() * total;
  for (const entry of scored) {
    cursor -= entry.score;
    if (cursor <= 0) return entry.item;
  }
  return scored[scored.length - 1]?.item || DICTIONARY_WORDS[0];
}

function getActiveDictionaryWords(options = {}) {
  const source = DICTIONARY_WORDS;
  const active = source.filter((item) => {
    const progress = getDictionaryWordProgress(item);
    return ["active", "learning", "review", "problem"].includes(progress.status);
  });
  const newWords = source.filter((item) => getDictionaryWordProgress(item).status === "new");
  const masteredDue = source.filter((item) => {
    const progress = getDictionaryWordProgress(item);
    return progress.status === "mastered" && isWordDueForReview(progress);
  });
  const pool = [...active, ...masteredDue];

  if (pool.length < 12) {
    pool.push(...newWords.slice(0, Math.max(0, 16 - pool.length)));
  }

  return pool.length ? pool.slice(0, 16) : source.slice(0, 16);
}

function scoreDictionaryWord(item) {
  const progress = getDictionaryWordProgress(item);
  let score = 1;
  if (progress.status === "new") score += 1.5;
  if (progress.status === "active") score += 1;
  if (progress.status === "learning") score += 2;
  if (progress.status === "review") score += 3;
  if (progress.status === "problem") score += 5;
  if (progress.status === "mastered") score -= 0.5;
  if (isWordDueForReview(progress)) score += 2;
  return Math.max(0.5, score);
}

function makeDictionaryTask() {
  const item = pickDictionaryWord();
  return attachDictionaryMeta(
    choiceTask("dictionaryWords", `Выбери правильное словарное слово. Тема: ${item.categoryLabel}.`, item.word, buildDictionaryChoices(item), item.hint),
    item
  );
}

function makeDictionaryMissingTask() {
  const item = pickDictionaryWord();
  const letterTask = buildDictionaryLetterTask(item);
  const task = choiceTask("dictionaryWords", letterTask.prompt, letterTask.answer, letterTask.choices, item.hint);
  return attachDictionaryMeta(task, item);
}

function makeDictionaryWriteTask() {
  const item = pickDictionaryWord();
  return attachDictionaryMeta(
    inputTask("dictionaryWords", `Напиши слово полностью. Подсказка: ${getDictionaryWritePrompt(item)}`, item.word, item.hint),
    item
  );
}

function attachDictionaryMeta(task, item) {
  task.dictionaryWord = item.word;
  task.dictionaryWordId = item.id;
  task.dictionaryTheme = item.category;
  task.strictAnswer = needsStrictDictionaryAnswer(item);
  task.success = "Верно! Ты запомнил трудное место.";
  return task;
}

function buildDictionaryChoices(item) {
  if (item.isPhrase) {
    return [item.word, item.word.replaceAll(" ", ""), item.word.replace(" ", "  ")];
  }
  if (item.isProperName) {
    return [item.word, item.word.toLowerCase(), replaceFirstVowel(item.word, "а")];
  }

  const choices = [item.word];
  if (item.word.includes("ё")) choices.push(item.word.replaceAll("ё", "е"));
  if (item.dangerPlace.includes("двойная")) choices.push(removeFirstDoubleLetter(item.word));
  if (item.dangerPlace.includes("мягкий знак")) choices.push(item.word.replaceAll("ь", ""));
  choices.push(replaceDangerLetter(item));
  choices.push(replaceFirstVowel(item.word, item.word.includes("а") ? "о" : "а"));

  return fillDictionaryChoices(item.word, choices);
}

function buildDictionaryLetterTask(item) {
  if (item.isPhrase) {
    return {
      prompt: "Выбери правильное написание.",
      answer: item.word,
      choices: [item.word, item.word.replaceAll(" ", "")]
    };
  }
  if (item.isProperName) {
    return {
      prompt: `Выбери первую букву: _${item.word.slice(1)}`,
      answer: item.word[0],
      choices: [item.word[0], item.word[0].toLowerCase()]
    };
  }

  const target = getDangerLetter(item);
  const index = target ? item.word.indexOf(target) : -1;
  if (index >= 0) {
    return {
      prompt: `Вставь букву: ${item.word.slice(0, index)}_${item.word.slice(index + 1)}`,
      answer: target,
      choices: getLetterChoices(target)
    };
  }

  return {
    prompt: "Выбери правильное написание.",
    answer: item.word,
    choices: buildDictionaryChoices(item)
  };
}

function getDictionaryWritePrompt(item) {
  const lower = item.exampleSentence.toLowerCase();
  if (item.word === "карандаш") return "предмет, которым пишут или рисуют";
  if (item.word === "молоко") return "белый напиток, который дают коровы";
  if (item.word === "собака") return "домашнее животное, которое лает";
  if (item.word === "тетрадь") return "в ней пишут на уроке";
  if (item.word === "Москва") return "столица России";
  if (item.word === "Родина") return "страна, где человек родился и живет";
  if (item.word === "до свидания") return "вежливые слова при прощании";
  return `${item.dangerPlace}. Пример: ${lower}`;
}

function needsStrictDictionaryAnswer(item) {
  return item.isProperName || item.isPhrase || item.word.includes("ё");
}

function fillDictionaryChoices(answer, choices) {
  const fallback = DICTIONARY_WORDS
    .map((item) => item.word)
    .filter((word) => normalizeAnswer(word) !== normalizeAnswer(answer));
  const unique = [];
  [...choices, ...shuffle(fallback)].forEach((choice) => {
    if (choice && !unique.includes(choice)) unique.push(choice);
  });
  return unique.slice(0, 3);
}

function getDangerLetter(item) {
  const match = item.dangerPlace.match(/букв[аы]? ([а-яё])/i);
  if (match) return match[1].toLowerCase();
  if (item.dangerPlace.includes("двойная")) {
    const doubleMatch = item.word.match(/([а-яё])\1/i);
    return doubleMatch ? doubleMatch[1].toLowerCase() : "";
  }
  if (item.dangerPlace.includes("мягкий знак")) return "ь";
  return "";
}

function getLetterChoices(answer) {
  if (answer === "ь") return ["ь", "ъ", "-"];
  if (answer === "ё") return ["ё", "е", "о"];
  if (answer === "д") return ["д", "т", "-"];
  if (answer === "в") return ["в", "ф", "-"];
  if (answer === "б") return ["б", "п", "в"];
  if (answer === "ы") return ["ы", "и", "е"];
  return [...new Set([answer, "а", "о", "е", "и"])].slice(0, 4);
}

function replaceDangerLetter(item) {
  const letter = getDangerLetter(item);
  const replacements = { а: "о", о: "а", е: "и", и: "е", я: "е", ы: "и", у: "о", д: "", в: "", ё: "е", ь: "" };
  if (!letter || !(letter in replacements)) return "";
  return item.word.replace(letter, replacements[letter]);
}

function replaceFirstVowel(word, replacement) {
  return word.replace(/[аоиеёуяыэю]/i, replacement);
}

function removeFirstDoubleLetter(word) {
  return word.replace(/([а-яё])\1/i, "$1");
}

function makeRussianGameTask() {
  return sample([
    makeLostLetterTask,
    makeFixNoteTask,
    makeChooseRuleTask,
    makeBuildSentenceGameTask,
    makeOddRuleWordTask,
    makeBuildWordGameTask,
    makeWordRiddleTask,
    makeWordSortTask,
    makeMatchPairsTask
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

function makeWordRiddleTask() {
  const items = [
    ["Им пишут или рисуют. В слове две буквы а.", "карандаш", "Карандаш - словарное слово."],
    ["Дерево с белым стволом. В слове есть буква ё.", "берёза", "Береза - словарное слово."],
    ["Место, где можно взять книгу почитать.", "библиотека", "Библиотека - длинное словарное слово."],
    ["Вежливое слово, которое говорят за помощь.", "спасибо", "Спасибо - вежливое словарное слово."],
    ["Ее надевают зимой поверх одежды.", "пальто", "Пальто пишется с мягким знаком."]
  ];
  const [clue, answer, explanation] = sample(items);
  return inputTask("wordGames", `Отгадай слово: ${clue}`, answer, explanation);
}

function makeWordSortTask() {
  const items = [
    {
      prompt: "Какие слова относятся к предметам: кот, бежит, дом, пишет, книга, летит?",
      answer: "кот, дом, книга",
      accepted: ["кот дом книга", "кот,дом,книга"],
      explanation: "Предмет отвечает на вопросы кто? что?"
    },
    {
      prompt: "Какие слова относятся к действиям: кот, бежит, дом, пишет, книга, летит?",
      answer: "бежит, пишет, летит",
      accepted: ["бежит пишет летит", "бежит,пишет,летит"],
      explanation: "Действие отвечает на вопрос что делает?"
    },
    {
      prompt: "Выбери слова с правилом жи-ши: машина, чашка, щука, жираф, задача, чудо.",
      answer: "машина, жираф",
      accepted: ["машина жираф", "машина,жираф"],
      explanation: "В словах машина и жираф есть сочетания ши/жи."
    },
    {
      prompt: "Выбери слова с правилом ча-ща: машина, чашка, щука, жираф, задача, чудо.",
      answer: "чашка, задача",
      accepted: ["чашка задача", "чашка,задача"],
      explanation: "В словах чашка и задача есть сочетание ча."
    },
    {
      prompt: "Выбери слова с правилом чу-щу: машина, чашка, щука, жираф, задача, чудо.",
      answer: "щука, чудо",
      accepted: ["щука чудо", "щука,чудо"],
      explanation: "В словах щука и чудо есть сочетания щу/чу."
    }
  ];
  const item = sample(items);
  const task = inputTask("wordGames", item.prompt, item.answer, item.explanation);
  task.acceptedAnswers = item.accepted;
  return task;
}

function makeMatchPairsTask() {
  const items = [
    ["Соедини слово с проверочным словом: леса", "лес", ["лес", "горы", "травы", "звезды"], "Леса проверяем словом лес."],
    ["Соедини слово с проверочным словом: гора", "горы", ["лес", "горы", "травы", "звезды"], "Гора проверяется словом горы."],
    ["Соедини слово с проверочным словом: гриб", "грибы", ["грибы", "зубы", "дубы", "снега"], "Гриб проверяем словом грибы."],
    ["Соедини слово с частью речи: кот", "существительное", ["существительное", "прилагательное", "глагол"], "Кот отвечает на вопрос кто?"],
    ["Соедини слово с частью речи: зеленый", "прилагательное", ["существительное", "прилагательное", "глагол"], "Зеленый отвечает на вопрос какой?"],
    ["Соедини слово с частью речи: бежит", "глагол", ["существительное", "прилагательное", "глагол"], "Бежит обозначает действие."]
  ];
  const [prompt, answer, choices, explanation] = sample(items);
  return choiceTask("wordGames", prompt, answer, choices, explanation);
}

function makeWordPuzzleTask() {
  return sample([makeMiniCrosswordTask, makeMiniScanwordTask, makeLetterCircleTask, makeWordsFromLettersTask, makeWordSearchTask, makeWordChainTask])();
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

function makeMiniScanwordTask() {
  const items = [
    ["еда и быт", "белый напиток", "молоко", 6],
    ["еда и быт", "сладкий продукт для чая", "сахар", 5],
    ["еда и быт", "овощ для супа, оранжевый", "морковь", 7],
    ["еда и быт", "посуда для воды", "стакан", 6],
    ["еда и быт", "верхняя одежда", "пальто", 6],
    ["город", "место, куда приходят поезда", "вокзал", 6],
    ["город", "подземный транспорт", "метро", 5],
    ["город", "место, где живет много людей", "город", 5],
    ["город", "дорожка в парке с деревьями", "аллея", 5],
    ["город", "столица России", "Москва", 6]
  ];
  const [topic, clue, answer, length] = sample(items);
  const task = inputTask("wordPuzzles", `Мини-сканворд (${topic}). Подсказка: ${clue}. Слово из ${length} букв.`, answer, "Вспомни слово по короткой подсказке.");
  task.visual = { type: "pattern", items: Array.from({ length }, () => "□"), missing: "" };
  return task;
}

function makeLetterCircleTask() {
  const items = [
    [["с", "о", "б", "а", "к", "а"], ["сок", "бак", "бок", "коса", "бока", "собака"], "собака"],
    [["м", "о", "л", "о", "к", "о"], ["лом", "кол", "мол", "молоко"], "молоко"],
    [["п", "е", "н", "а", "л"], ["пена", "пенал"], "пенал"],
    [["к", "о", "т", "р", "а"], ["кот", "рот", "ток", "крот", "кора"], "крот"],
    [["в", "е", "т", "е", "р"], ["рев", "ветер"], "ветер"]
  ];
  const [letters, answers, mainAnswer] = sample(items);
  const task = inputTask("wordPuzzles", `Буквенный круг. Составь любое подходящее слово из букв: ${letters.join(", ")}`, mainAnswer, `Можно составить: ${answers.join(", ")}.`);
  task.acceptedAnswers = answers;
  task.visual = { type: "letterCircle", letters };
  return task;
}

function makeWordsFromLettersTask() {
  const items = [
    ["карандаш", ["дар", "шар", "рак", "рана", "карандаш"]],
    ["сорока", ["сок", "рок", "коса", "сорока"]],
    ["собака", ["сок", "бак", "бок", "коса", "собака"]],
    ["морковь", ["мор", "ров", "морковь"]],
    ["картина", ["кит", "ран", "тина", "картина"]]
  ];
  const [source, answers] = sample(items);
  const task = inputTask("wordPuzzles", `Составь короткое слово из букв слова "${source}".`, answers[0], `Можно составить: ${answers.join(", ")}.`);
  task.acceptedAnswers = answers;
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

function makeWordChainTask() {
  const items = [
    ["кот - тетрадь - ...", "дорога", ["дом", "дорога", "апельсин"], "Слово тетрадь заканчивается на д, следующее слово начинается на д."],
    ["собака - аллея - ...", "ягода", ["ягода", "метро", "пенал"], "Слово аллея заканчивается на я, следующее слово начинается на я."],
    ["пенал - лопата - ...", "апельсин", ["апельсин", "собака", "тетрадь"], "Слово лопата заканчивается на а, следующее слово начинается на а."]
  ];
  const [chain, answer, choices, explanation] = sample(items);
  return choiceTask("wordPuzzles", `Продолжи цепочку слов: ${chain}`, answer, choices, explanation);
}

function makeProverbTask() {
  const item = sample(PROVERBS);
  const format = sample(["finish", "meaning", "situation", "connect"]);
  const decoys = shuffle(PROVERBS.filter((proverb) => proverb.text !== item.text));
  if (format === "finish") {
    const choices = shuffle([item.ending, ...decoys.slice(0, 2).map((proverb) => proverb.ending)]);
    return choiceTask("proverbs", `Закончи пословицу: ${item.start}`, item.ending, choices, `Полностью: ${item.text}`);
  }
  if (format === "connect") {
    const choices = shuffle([item.ending, ...decoys.slice(0, 2).map((proverb) => proverb.ending)]);
    return choiceTask("proverbs", `Соедини начало и конец: ${item.start}`, item.ending, choices, `Смысл: ${item.meaning}`);
  }
  if (format === "meaning") {
    const choices = shuffle([item.meaning, ...decoys.slice(0, 2).map((proverb) => proverb.meaning)]);
    return choiceTask("proverbs", `Что значит пословица: "${item.text}"?`, item.meaning, choices, "Пословица говорит не только о словах, а о жизненной ситуации.");
  }
  const choices = shuffle([item.text, ...decoys.slice(0, 2).map((proverb) => proverb.text)]);
  return choiceTask("proverbs", `Какая пословица подходит к ситуации? ${item.situation}`, item.text, choices, `Подходит: ${item.text}`);
}

function normalizeReadingText(item, index) {
  const meta = READING_TEXT_META[item.title] || {};
  const id = meta.id || `reading_text_${index + 1}`;
  return {
    id,
    theme: meta.theme || "понимание текста",
    difficulty: meta.difficulty || 1,
    title: item.title,
    text: item.text,
    mainIdea: item.mainIdea,
    questions: item.questions.map(([question, answer], questionIndex) => {
      const type = inferReadingQuestionType(question, questionIndex);
      return {
        id: `${id}_q${questionIndex + 1}`,
        question,
        answer,
        type,
        hint: READING_QUESTION_HINTS[type] || "Вернись к тексту и найди подтверждение."
      };
    })
  };
}

function inferReadingQuestionType(question, index) {
  const normalized = question.toLowerCase();
  if (normalized.includes("заголов")) return "title";
  if (normalized.includes("главн")) return "main_idea";
  if (normalized.includes("почему")) return "reason";
  if (normalized.includes("что было") || normalized.includes("когда") || normalized.includes("после того")) return "sequence";
  if (normalized.includes("вывод") || normalized.includes("характер") || normalized.includes("какой можно") || normalized.includes("как измени")) return "inference";
  return READING_QUESTION_TYPES[index] || "detail";
}

const WORLD_FACT_TASKS = [
  {
    prompt: "Какие птицы не умеют летать, но отлично плавают?",
    answer: "пингвины",
    choices: ["пингвины", "воробьи", "ласточки", "синицы"],
    explanation: "Пингвины - птицы, но вместо полета они отлично плавают."
  },
  {
    prompt: "Почему на Луне следы могут сохраняться очень долго?",
    answer: "там нет ветра и дождя",
    choices: ["там нет ветра и дождя", "там всегда снег", "там много травы", "там идут реки"],
    explanation: "На Луне нет ветра и дождя, поэтому следы не стираются так быстро."
  },
  {
    prompt: "Когда чаще всего появляется радуга?",
    answer: "когда солнечный свет проходит через капли воды",
    choices: ["когда солнечный свет проходит через капли воды", "когда идет снег", "когда темно", "когда нет облаков и воды"],
    explanation: "Радуга появляется, когда свет проходит через капли воды."
  },
  {
    prompt: "Что деревья дают городу?",
    answer: "тень и чистый воздух",
    choices: ["тень и чистый воздух", "сахар и соль", "камни и песок", "книги и тетради"],
    explanation: "Деревья дают тень, очищают воздух и делают город красивее."
  },
  {
    prompt: "Как улитка защищает свое мягкое тело?",
    answer: "носит домик с собой",
    choices: ["носит домик с собой", "летает высоко", "рычит", "строит забор"],
    explanation: "Улитка носит раковину-домик с собой."
  },
  {
    prompt: "Что помогает осьминогу прятаться?",
    answer: "он меняет цвет",
    choices: ["он меняет цвет", "он поет", "он строит гнездо", "он светит фонарем"],
    explanation: "Осьминог умеет менять цвет и сливаться с местом вокруг."
  },
  {
    prompt: "Что работает у человека днем и ночью, даже во сне?",
    answer: "сердце",
    choices: ["сердце", "портфель", "карандаш", "звонок"],
    explanation: "Сердце работает постоянно, даже когда человек спит."
  },
  {
    prompt: "Чем бабочки могут чувствовать вкус?",
    answer: "лапками",
    choices: ["лапками", "крыльями", "усами", "хвостом"],
    explanation: "У бабочек вкус помогают чувствовать лапки."
  }
];

function makeWorldFactTask() {
  const item = sample(WORLD_FACT_TASKS);
  return choiceTask("worldFacts", item.prompt, item.answer, item.choices, item.explanation);
}

function makeReadingTask() {
  const item = sample(READING_TEXTS);
  const questionItem = sample(item.questions);
  const { question, answer } = questionItem;
  const choices = buildReadingChoices(answer, item);
  const task = choiceTask("readingMeaning", question, answer, choices, `${questionItem.hint} Главная мысль: ${item.mainIdea}`);
  task.reading = { textId: item.id, theme: item.theme, questionType: questionItem.type };
  task.visual = { type: "readingText", title: item.title, text: item.text };
  return task;
}

function buildReadingChoices(answer, item) {
  const localPool = item.questions.map((question) => question.answer).filter((value) => value !== answer);
  const globalPool = READING_TEXTS
    .flatMap((text) => text.questions.map((question) => question.answer))
    .filter((value) => value !== answer && !localPool.includes(value));
  return shuffle([answer, ...shuffle(localPool).slice(0, 1), ...shuffle(globalPool).slice(0, 2)]).slice(0, 4);
}

function choiceTask(skillId, prompt, answer, choices, explanation) {
  return ensureTaskMeta({ type: "choice", skillId, prompt, answer, choices: shuffle([...new Set(choices)]), explanation });
}

function inputTask(skillId, prompt, answer, explanation) {
  return ensureTaskMeta({ type: "input", skillId, prompt, answer, explanation });
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

  if (visual.type === "readingText") {
    container.innerHTML = `
      <article class="reading-card">
        <strong>${visual.title}</strong>
        <p>${visual.text}</p>
      </article>
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
  if (streak >= 7) return `${childName}, в Архипелаге уже неделю горят огоньки маршрутов. Очень ровный ритм.`;
  if (streak >= 3) return `${childName}, карта становится светлее. Сегодня хватит одного спокойного шага.`;
  return `${childName}, сегодня можно пройти короткий маршрут и вовремя отдохнуть.`;
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

function getReviewDueLabel(nextReviewAt) {
  if (!nextReviewAt) return "Вернется в тренировке";
  const diffMs = new Date(nextReviewAt).getTime() - Date.now();
  if (diffMs <= 0) return "Готово к повтору";
  const days = Math.max(1, Math.ceil(diffMs / 86400000));
  return `Повтор через ${days} ${dayWord(days)}`;
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
  if (isPreviewMode) {
    event.target.value = "";
    alert("Режим родителя работает как просмотр: импорт прогресса здесь не сохраняется.");
    return;
  }
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
  if (isPreviewMode) {
    alert("Режим родителя работает как просмотр: прогресс ребенка не сбрасывается.");
    return;
  }
  const ok = confirm("Сбросить весь прогресс Летней Академии? Читательский дневник это не затронет.");
  if (!ok) return;
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}

function normalizeAnswer(value) {
  return String(value).trim().toLowerCase().replaceAll("ё", "е");
}

function isAnswerAccepted(rawAnswer, task) {
  return [task.answer, ...(task.acceptedAnswers || [])].some((answer) => answersMatch(rawAnswer, answer, task.strictAnswer));
}

function answersMatch(rawAnswer, expectedAnswer, strict = false) {
  if (strict) return String(rawAnswer).trim() === String(expectedAnswer).trim();
  return normalizeAnswer(rawAnswer) === normalizeAnswer(expectedAnswer);
}

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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

function compareSign(left, right) {
  if (left > right) return ">";
  if (left < right) return "<";
  return "=";
}

function solveSimpleExpression(expression) {
  const parts = String(expression).trim().split(/\s+/);
  if (parts.length === 1) return Number(parts[0]);
  const left = Number(parts[0]);
  const operation = parts[1];
  const right = Number(parts[2]);
  if (operation === "+") return left + right;
  if (operation === "-") return left - right;
  if (operation === "×") return left * right;
  if (operation === ":") return left / right;
  return 0;
}

function solveUnknownExpression(expression) {
  const [leftRaw, resultRaw] = expression.split("=").map((part) => part.trim());
  const result = Number(resultRaw);
  const [firstRaw, operation, secondRaw] = leftRaw.split(/\s+/);
  const firstUnknown = firstRaw === "□";
  const first = firstUnknown ? null : Number(firstRaw);
  const second = secondRaw === "□" ? null : Number(secondRaw);
  if (operation === "+") return firstUnknown ? result - second : result - first;
  if (operation === "-") return firstUnknown ? result + second : first - result;
  return 0;
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
