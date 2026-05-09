const sampleReading = {
  name: "Maya",
  birthDate: "1994-02-18",
  focus: "Love",
  mood: "Hopeful",
  zodiac: "",
  question: "What should I understand before I open my heart again?",
};

const deck = [
  {
    name: "The Lantern",
    element: "Fire",
    message: "A truth is ready to be seen without forcing the whole room to change.",
    action: "Name the smallest honest thing first.",
  },
  {
    name: "The Mirror",
    element: "Water",
    message: "The situation is reflecting a pattern you have already outgrown.",
    action: "Notice what repeats, then choose one different response.",
  },
  {
    name: "The Key",
    element: "Air",
    message: "A simple conversation can unlock more than a dramatic gesture.",
    action: "Ask the direct question with a calm tone.",
  },
  {
    name: "The Garden",
    element: "Earth",
    message: "What grows slowly now will be more stable than what arrives loudly.",
    action: "Protect the routine that keeps you clear.",
  },
  {
    name: "The Tide",
    element: "Water",
    message: "Your emotions are moving in waves, not warnings.",
    action: "Wait for the second wave before deciding.",
  },
  {
    name: "The Crown",
    element: "Fire",
    message: "Self-respect is the gatekeeper for the next chapter.",
    action: "Choose the option that does not ask you to shrink.",
  },
  {
    name: "The Compass",
    element: "Air",
    message: "You do not need a perfect map; you need a cleaner direction.",
    action: "Pick the next honest step and let the full path update later.",
  },
  {
    name: "The River",
    element: "Water",
    message: "A softer route may carry you farther than a forceful push.",
    action: "Remove one pressure from the decision.",
  },
  {
    name: "The Ember",
    element: "Fire",
    message: "Small desire is returning before big confidence.",
    action: "Give energy to what still feels warm.",
  },
  {
    name: "The Gate",
    element: "Earth",
    message: "A boundary is not a wall; it is a doorway with standards.",
    action: "Say what access requires.",
  },
  {
    name: "The Starling",
    element: "Air",
    message: "A message, invitation, or coincidence brings useful movement.",
    action: "Answer quickly when the signal feels clean.",
  },
  {
    name: "The Orchard",
    element: "Earth",
    message: "The harvest depends on what you are willing to tend consistently.",
    action: "Invest in the thing you would still want in six months.",
  },
];

const archetypes = [
  {
    name: "The Tide Walker",
    text: "You are crossing an emotional threshold where honesty matters more than perfect timing.",
  },
  {
    name: "The Quiet Flame",
    text: "You are rebuilding confidence from the inside, and the next step should feel warm rather than frantic.",
  },
  {
    name: "The Silver Compass",
    text: "You are being asked to trust a clean direction before all details become visible.",
  },
  {
    name: "The Garden Keeper",
    text: "You are in a season where patience, repetition, and small rituals create the real change.",
  },
  {
    name: "The Open Gate",
    text: "You are close to a new chapter, but the doorway responds to boundaries, not pressure.",
  },
];

const focusMessages = {
  Love: [
    "Choose the connection that brings steadiness after the spark, not the spark that keeps asking you to guess.",
    "A warmer answer appears when you stop auditioning for someone else's uncertainty.",
    "The heart opens best when your standards and softness are allowed to stand together.",
  ],
  Career: [
    "The next opportunity rewards focus more than speed.",
    "A professional door opens when you make your value easier to understand.",
    "Your effort is ready to become more visible, but the message needs cleaner packaging.",
  ],
  Money: [
    "A small leak matters more than a dramatic windfall right now.",
    "The strongest money move is boring, repeatable, and emotionally calm.",
    "Spend from identity, not from urgency.",
  ],
  "Life path": [
    "You are being invited to stop treating clarity as a lightning strike and start treating it as a practice.",
    "A future version of you is asking for fewer distractions and more devotion.",
    "The path gets easier when you let one older version of yourself retire.",
  ],
  "General energy": [
    "The week favors simple choices, honest words, and fewer open loops.",
    "Your energy returns when you stop negotiating with what already feels finished.",
    "A calm decision will create more movement than another round of overthinking.",
  ],
};

const luckyColors = [
  "sea green",
  "soft gold",
  "rose clay",
  "midnight blue",
  "pearl white",
  "copper",
  "moss green",
  "warm ivory",
];

const luckyTimes = [
  "early morning",
  "late afternoon",
  "after sunset",
  "the first quiet hour",
  "midweek",
  "Friday evening",
  "the next clear morning",
];

const rituals = [
  "Write the question once, write the feared answer once, then write the kindest honest answer once.",
  "Place one hand on your chest, breathe for ten counts, and choose the answer that lets your body soften.",
  "Before replying, draft the direct version and the gentle version. Send the version that respects both people.",
  "Clear one small surface, light a candle if you use one, and remove one decision that is only noise.",
  "Write three things you know, two things you feel, and one thing you are willing to do next.",
];

const toast = document.querySelector("#toast");
const form = document.querySelector("#oracleForm");
const sampleButton = document.querySelector("#sampleButton");
const copyReadingButton = document.querySelector("#copyReadingButton");
const saveReadingButton = document.querySelector("#saveReadingButton");
const canvas = document.querySelector("#cosmicCanvas");
const context = canvas ? canvas.getContext("2d") : null;

let latestReadingText = "";
let stars = [];
let pointerX = 0.5;
let pointerY = 0.5;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

function hashString(input) {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seed) {
  let value = seed >>> 0;
  return function random() {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(items, random) {
  return items[Math.floor(random() * items.length) % items.length];
}

function drawUnique(items, count, random) {
  const pool = [...items];
  const chosen = [];
  while (chosen.length < count && pool.length > 0) {
    const index = Math.floor(random() * pool.length);
    chosen.push(pool.splice(index, 1)[0]);
  }
  return chosen;
}

function digitSum(value) {
  const digits = String(value).replace(/\D/g, "").split("").map(Number);
  let sum = digits.reduce((total, digit) => total + digit, 0);
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = String(sum).split("").map(Number).reduce((total, digit) => total + digit, 0);
  }
  return sum || 1;
}

function zodiacFromDate(dateText) {
  const date = new Date(`${dateText}T12:00:00`);
  if (Number.isNaN(date.getTime())) return "Scorpio";
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const edge = month * 100 + day;
  if (edge >= 321 && edge <= 419) return "Aries";
  if (edge >= 420 && edge <= 520) return "Taurus";
  if (edge >= 521 && edge <= 620) return "Gemini";
  if (edge >= 621 && edge <= 722) return "Cancer";
  if (edge >= 723 && edge <= 822) return "Leo";
  if (edge >= 823 && edge <= 922) return "Virgo";
  if (edge >= 923 && edge <= 1022) return "Libra";
  if (edge >= 1023 && edge <= 1121) return "Scorpio";
  if (edge >= 1122 && edge <= 1221) return "Sagittarius";
  if (edge >= 1222 || edge <= 119) return "Capricorn";
  if (edge >= 120 && edge <= 218) return "Aquarius";
  return "Pisces";
}

function collectFormData() {
  const data = new FormData(form);
  return {
    name: String(data.get("name") || "Seeker").trim() || "Seeker",
    birthDate: String(data.get("birthDate") || "1996-10-24"),
    focus: String(data.get("focus") || "General energy"),
    mood: String(data.get("mood") || "Hopeful"),
    zodiac: String(data.get("zodiac") || ""),
    question: String(data.get("question") || "").trim(),
  };
}

function buildReading(input) {
  const todayKey = new Date().toISOString().slice(0, 10);
  const seed = hashString(`${input.name}|${input.birthDate}|${input.focus}|${input.mood}|${input.question}|${todayKey}`);
  const random = seededRandom(seed);
  const cards = drawUnique(deck, 3, random);
  const zodiac = input.zodiac || zodiacFromDate(input.birthDate);
  const lifePath = digitSum(input.birthDate);
  const resonance = 72 + Math.floor(random() * 23);
  const archetype = pick(archetypes, random);
  const mainMessage = pick(focusMessages[input.focus] || focusMessages["General energy"], random);
  const weekMessage = `${cards[2].action} This becomes easier when you treat the next seven days as a test of alignment, not a final verdict.`;
  const ritual = pick(rituals, random);
  const color = pick(luckyColors, random);
  const number = digitSum(seed);
  const timing = pick(luckyTimes, random);
  const moonPhase = random() > 0.5 ? "Waxing insight" : "Quiet renewal";
  const phase = 42 + Math.floor(random() * 48);

  return {
    name: input.name,
    focus: input.focus,
    mood: input.mood,
    question: input.question,
    cards,
    zodiac,
    lifePath,
    resonance,
    archetype,
    mainMessage,
    weekMessage,
    ritual,
    color,
    number,
    timing,
    moonPhase,
    phase,
  };
}

function setText(selector, text) {
  const element = document.querySelector(selector);
  if (element) element.textContent = text;
}

function renderCards(cards) {
  const spread = document.querySelector("#cardSpread");
  if (!spread) return;
  const labels = ["Past", "Present", "Next step"];
  spread.innerHTML = cards.map((card, index) => `
    <article class="oracle-card">
      <span>${labels[index]} - ${card.element}</span>
      <h3>${card.name}</h3>
      <p>${card.message}</p>
    </article>
  `).join("");
}

function renderLuckySigns(reading) {
  const list = document.querySelector("#luckySigns");
  if (!list) return;
  list.innerHTML = `
    <li>Color: ${reading.color}</li>
    <li>Number: ${reading.number}</li>
    <li>Timing: ${reading.timing}</li>
  `;
}

function renderReading(reading) {
  setText("#readingTitle", `${reading.name}'s ${reading.focus.toLowerCase()} spread`);
  setText("#readingSubtitle", `Mood: ${reading.mood}. Question: ${reading.question}`);
  setText("#zodiacSignal", `Zodiac: ${reading.zodiac}`);
  setText("#lifePathSignal", `Life path: ${reading.lifePath}`);
  setText("#resonanceSignal", `Resonance: ${reading.resonance}`);
  setText("#archetypeName", reading.archetype.name);
  setText("#archetypeText", reading.archetype.text);
  setText("#moonPhase", reading.moonPhase);
  setText("#mainMessage", reading.mainMessage);
  setText("#weekMessage", reading.weekMessage);
  setText("#ritualMessage", reading.ritual);

  const meter = document.querySelector(".moon-meter");
  if (meter) meter.style.setProperty("--phase", reading.phase);

  renderCards(reading.cards);
  renderLuckySigns(reading);

  latestReadingText = [
    `Moonveil Oracle reading for ${reading.name}`,
    `Focus: ${reading.focus}`,
    `Question: ${reading.question}`,
    `Zodiac: ${reading.zodiac}`,
    `Life path: ${reading.lifePath}`,
    `Resonance: ${reading.resonance}`,
    `Archetype: ${reading.archetype.name} - ${reading.archetype.text}`,
    `Past: ${reading.cards[0].name} - ${reading.cards[0].message}`,
    `Present: ${reading.cards[1].name} - ${reading.cards[1].message}`,
    `Next step: ${reading.cards[2].name} - ${reading.cards[2].message}`,
    `Main message: ${reading.mainMessage}`,
    `Next 7 days: ${reading.weekMessage}`,
    `Lucky signs: ${reading.color}, ${reading.number}, ${reading.timing}`,
    `Mini ritual: ${reading.ritual}`,
    "Entertainment and reflection only. No guaranteed outcomes.",
  ].join("\n");
}

function updateCounters() {
  document.querySelectorAll("[data-counter-for]").forEach((counter) => {
    const field = document.querySelector(`[name="${counter.dataset.counterFor}"]`);
    if (!field) return;
    const max = Number(field.getAttribute("maxlength") || 0);
    counter.textContent = max ? `${field.value.length}/${max} characters` : `${field.value.length} characters`;
  });
}

function fallbackCopy(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  document.body.append(textArea);
  textArea.select();
  const copied = document.execCommand("copy");
  textArea.remove();
  if (!copied) throw new Error("copy failed");
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
  } else {
    fallbackCopy(text);
  }
}

function resizeCanvas() {
  if (!canvas || !context) return;
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  stars = Array.from({ length: Math.min(130, Math.floor(window.innerWidth / 9)) }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    radius: 0.6 + Math.random() * 1.8,
    speed: 0.08 + Math.random() * 0.28,
    glow: 0.3 + Math.random() * 0.7,
  }));
}

function drawCanvas() {
  if (!canvas || !context) return;
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  const gradient = context.createLinearGradient(0, 0, window.innerWidth, window.innerHeight);
  gradient.addColorStop(0, "rgba(255, 247, 232, 0.72)");
  gradient.addColorStop(0.52, "rgba(229, 248, 241, 0.55)");
  gradient.addColorStop(1, "rgba(37, 33, 64, 0.2)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, window.innerWidth, window.innerHeight);

  stars.forEach((star, index) => {
    star.y += star.speed;
    star.x += (pointerX - 0.5) * 0.08;
    if (star.y > window.innerHeight + 10) star.y = -10;
    if (star.x > window.innerWidth + 10) star.x = -10;
    if (star.x < -10) star.x = window.innerWidth + 10;

    context.beginPath();
    context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    context.fillStyle = index % 3 === 0
      ? `rgba(181, 82, 91, ${star.glow})`
      : `rgba(24, 106, 100, ${star.glow})`;
    context.fill();
  });

  context.beginPath();
  context.arc(window.innerWidth * (0.16 + pointerX * 0.05), window.innerHeight * 0.22, 68, 0, Math.PI * 2);
  context.fillStyle = "rgba(202, 155, 60, 0.18)";
  context.fill();

  context.beginPath();
  context.arc(window.innerWidth * 0.78, window.innerHeight * (0.72 + pointerY * 0.04), 104, 0, Math.PI * 2);
  context.strokeStyle = "rgba(24, 106, 100, 0.18)";
  context.lineWidth = 2;
  context.stroke();

  requestAnimationFrame(drawCanvas);
}

document.querySelectorAll("[data-copy-target]").forEach((button) => {
  button.addEventListener("click", async () => {
    const target = document.getElementById(button.dataset.copyTarget);
    if (!target) return;
    try {
      await copyText(target.innerText.trim());
      showToast("Copied");
    } catch {
      showToast("Copy failed");
    }
  });
});

document.querySelectorAll("[data-count-source]").forEach((field) => {
  field.addEventListener("input", updateCounters);
});

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const reading = buildReading(collectFormData());
    renderReading(reading);
    window.location.hash = "results";
    showToast("Reading revealed");
  });
}

if (sampleButton) {
  sampleButton.addEventListener("click", () => {
    Object.entries(sampleReading).forEach(([name, value]) => {
      const field = document.querySelector(`[name="${name}"]`);
      if (field) field.value = value;
    });
    updateCounters();
    showToast("Sample filled");
  });
}

if (copyReadingButton) {
  copyReadingButton.addEventListener("click", async () => {
    try {
      await copyText(latestReadingText);
      showToast("Full reading copied");
    } catch {
      showToast("Copy failed");
    }
  });
}

if (saveReadingButton) {
  saveReadingButton.addEventListener("click", () => {
    localStorage.setItem("moonveil:lastReading", latestReadingText);
    showToast("Saved in this browser");
  });
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("pointermove", (event) => {
  pointerX = event.clientX / Math.max(1, window.innerWidth);
  pointerY = event.clientY / Math.max(1, window.innerHeight);
});

updateCounters();
renderReading(buildReading(collectFormData()));
resizeCanvas();
drawCanvas();
