const sampleReading = {
  name: "Maya",
  birthDate: "",
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
  "Personal Growth": [
    "You are being invited to stop treating clarity as a lightning strike and start treating it as a practice.",
    "A future version of you is asking for fewer distractions and more devotion.",
    "The path gets easier when you let one older version of yourself retire.",
  ],
  "Daily Clarity": [
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
const downloadImageButton = document.querySelector("#downloadImageButton");
const downloadPdfButton = document.querySelector("#downloadPdfButton");
const readingLoader = document.querySelector("#readingLoader");
const loaderTitle = document.querySelector("#loaderTitle");
const loaderText = document.querySelector("#loaderText");
const canvas = document.querySelector("#cosmicCanvas");
const context = canvas ? canvas.getContext("2d") : null;

let latestReadingText = "";
let latestReading = null;
let stars = [];
let pointerX = 0.5;
let pointerY = 0.5;
let revealTimer = 0;

const loaderStages = [
  {
    title: "Shuffling your cards",
    text: "The oracle is drawing a pattern from your question.",
  },
  {
    title: "Tracing your sky",
    text: "Zodiac timing and numerology are being woven into the spread.",
  },
  {
    title: "Opening the veil",
    text: "Your cards are turning over now.",
  },
];

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

function setLoadingStage(stageIndex) {
  const stage = loaderStages[stageIndex] || loaderStages[0];
  if (loaderTitle) loaderTitle.textContent = stage.title;
  if (loaderText) loaderText.textContent = stage.text;
  document.querySelectorAll("[data-loader-step]").forEach((step) => {
    step.classList.toggle("is-active", Number(step.dataset.loaderStep) <= stageIndex);
  });
}

function revealCards() {
  const results = document.querySelector("#results");
  if (!results) return;
  results.classList.remove("is-revealing");
  window.requestAnimationFrame(() => {
    results.classList.add("is-revealing");
  });
}

function openReadingWithCeremony(reading) {
  window.clearTimeout(revealTimer);
  setLoadingStage(0);
  if (readingLoader) {
    readingLoader.classList.add("is-visible");
    readingLoader.setAttribute("aria-hidden", "false");
  }
  if (form) form.classList.add("is-busy");

  window.setTimeout(() => setLoadingStage(1), 850);
  window.setTimeout(() => setLoadingStage(2), 1700);

  revealTimer = window.setTimeout(() => {
    renderReading(reading);
    window.location.hash = "results";
    revealCards();
    if (readingLoader) {
      readingLoader.classList.remove("is-visible");
      readingLoader.setAttribute("aria-hidden", "true");
    }
    if (form) form.classList.remove("is-busy");
    showToast("Reading revealed");
  }, 2600);
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
    birthDate: String(data.get("birthDate") || ""),
    focus: String(data.get("focus") || "Daily Clarity"),
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
  const zodiac = input.zodiac || (input.birthDate ? zodiacFromDate(input.birthDate) : "Intuitive");
  const lifePath = input.birthDate ? digitSum(input.birthDate) : digitSum(seed);
  const resonance = 72 + Math.floor(random() * 23);
  const archetype = pick(archetypes, random);
  const mainMessage = pick(focusMessages[input.focus] || focusMessages["Daily Clarity"], random);
  const weekMessage = `${cards[2].action} Keep the next step small enough to do today.`;
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
  const labels = ["Card 1", "Card 2", "Card 3"];
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
  latestReading = reading;
  setText("#readingTitle", `${reading.name}'s ${reading.focus.toLowerCase()} reading`);
  setText("#readingSubtitle", `Your question: ${reading.question}`);
  setText("#zodiacSignal", `Timing: ${reading.zodiac}`);
  setText("#lifePathSignal", `Number: ${reading.lifePath}`);
  setText("#resonanceSignal", `Resonance: ${reading.resonance}`);
  setText("#archetypeName", reading.archetype.name);
  setText("#archetypeText", `${reading.archetype.text} ${reading.cards[0].message} ${reading.cards[1].message}`);
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
    `Timing: ${reading.zodiac}`,
    `Number: ${reading.lifePath}`,
    `Resonance: ${reading.resonance}`,
    `Archetype: ${reading.archetype.name} - ${reading.archetype.text}`,
    `Card 1: ${reading.cards[0].name} - ${reading.cards[0].message}`,
    `Card 2: ${reading.cards[1].name} - ${reading.cards[1].message}`,
    `Card 3: ${reading.cards[2].name} - ${reading.cards[2].message}`,
    `Short interpretation: ${reading.mainMessage}`,
    `Actionable insight: ${reading.weekMessage}`,
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

function getActiveReading() {
  if (!latestReading && form) {
    latestReading = buildReading(collectFormData());
  }
  return latestReading;
}

function slugify(value) {
  const slug = String(value || "reading")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "reading";
}

function roundRectPath(drawingContext, x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  drawingContext.beginPath();
  drawingContext.moveTo(x + safeRadius, y);
  drawingContext.lineTo(x + width - safeRadius, y);
  drawingContext.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  drawingContext.lineTo(x + width, y + height - safeRadius);
  drawingContext.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
  drawingContext.lineTo(x + safeRadius, y + height);
  drawingContext.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  drawingContext.lineTo(x, y + safeRadius);
  drawingContext.quadraticCurveTo(x, y, x + safeRadius, y);
  drawingContext.closePath();
}

function fillRoundedRect(drawingContext, x, y, width, height, radius, fillStyle) {
  roundRectPath(drawingContext, x, y, width, height, radius);
  drawingContext.fillStyle = fillStyle;
  drawingContext.fill();
}

function strokeRoundedRect(drawingContext, x, y, width, height, radius, strokeStyle, lineWidth = 3) {
  roundRectPath(drawingContext, x, y, width, height, radius);
  drawingContext.strokeStyle = strokeStyle;
  drawingContext.lineWidth = lineWidth;
  drawingContext.stroke();
}

function drawLine(drawingContext, x1, y1, x2, y2, color, lineWidth = 2) {
  drawingContext.beginPath();
  drawingContext.strokeStyle = color;
  drawingContext.lineWidth = lineWidth;
  drawingContext.moveTo(x1, y1);
  drawingContext.lineTo(x2, y2);
  drawingContext.stroke();
}

function wrapText(drawingContext, text, x, y, maxWidth, lineHeight, maxLines = 8) {
  const words = String(text || "").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  const lines = [];
  let line = "";

  words.forEach((word) => {
    const testLine = line ? `${line} ${word}` : word;
    if (drawingContext.measureText(testLine).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = testLine;
    }
  });

  if (line) lines.push(line);

  if (lines.length > maxLines) {
    lines.length = maxLines;
    let finalLine = `${lines[maxLines - 1]}...`;
    while (drawingContext.measureText(finalLine).width > maxWidth && finalLine.length > 4) {
      finalLine = `${finalLine.slice(0, -4).trim()}...`;
    }
    lines[maxLines - 1] = finalLine;
  }

  lines.forEach((currentLine, index) => {
    drawingContext.fillText(currentLine, x, y + index * lineHeight);
  });

  return y + Math.max(lines.length, 1) * lineHeight;
}

function drawReportBackground(drawingContext, width, height, random) {
  const background = drawingContext.createLinearGradient(0, 0, width, height);
  background.addColorStop(0, "#03111f");
  background.addColorStop(0.45, "#071d31");
  background.addColorStop(1, "#020914");
  drawingContext.fillStyle = background;
  drawingContext.fillRect(0, 0, width, height);

  const glow = drawingContext.createRadialGradient(width * 0.15, height * 0.2, 20, width * 0.15, height * 0.2, 620);
  glow.addColorStop(0, "rgba(204, 164, 92, 0.18)");
  glow.addColorStop(1, "rgba(204, 164, 92, 0)");
  drawingContext.fillStyle = glow;
  drawingContext.fillRect(0, 0, width, height);

  for (let index = 0; index < 260; index += 1) {
    const x = 40 + random() * (width - 80);
    const y = 40 + random() * (height - 100);
    const size = 0.9 + random() * 2.4;
    drawingContext.globalAlpha = 0.35 + random() * 0.55;
    drawingContext.fillStyle = index % 9 === 0 ? "#f4d48a" : "#f8f1da";
    drawingContext.fillRect(x, y, size, size);
  }
  drawingContext.globalAlpha = 1;
}

function drawReportBorder(drawingContext, width, height, colors) {
  strokeRoundedRect(drawingContext, 28, 28, width - 56, height - 56, 24, colors.gold, 4);
  strokeRoundedRect(drawingContext, 44, 44, width - 88, height - 88, 16, "rgba(238, 201, 132, 0.54)", 1.5);
  strokeRoundedRect(drawingContext, 62, 62, width - 124, height - 124, 10, "rgba(238, 201, 132, 0.22)", 1);

  const corner = 110;
  [
    [44, 44, 1, 1],
    [width - 44, 44, -1, 1],
    [44, height - 44, 1, -1],
    [width - 44, height - 44, -1, -1],
  ].forEach(([x, y, sx, sy]) => {
    drawingContext.strokeStyle = colors.gold;
    drawingContext.lineWidth = 2;
    drawingContext.beginPath();
    drawingContext.moveTo(x, y + sy * 16);
    drawingContext.quadraticCurveTo(x + sx * 42, y + sy * 22, x + sx * 48, y + sy * 64);
    drawingContext.quadraticCurveTo(x + sx * 54, y + sy * 100, x + sx * corner, y + sy * corner);
    drawingContext.stroke();
  });
}

function drawReportPanel(drawingContext, x, y, width, height, title, colors) {
  fillRoundedRect(drawingContext, x, y, width, height, 18, "rgba(4, 21, 36, 0.82)");
  strokeRoundedRect(drawingContext, x, y, width, height, 18, "rgba(238, 201, 132, 0.78)", 2);
  strokeRoundedRect(drawingContext, x + 8, y + 8, width - 16, height - 16, 13, "rgba(238, 201, 132, 0.25)", 1);

  drawingContext.fillStyle = colors.gold;
  drawingContext.font = "700 26px Georgia, serif";
  drawingContext.textAlign = "center";
  drawingContext.fillText(title, x + width / 2, y + 42);
  drawLine(drawingContext, x + 34, y + 58, x + width - 34, y + 58, "rgba(238, 201, 132, 0.42)", 1);
  drawingContext.textAlign = "left";
}

function drawMoon(drawingContext, x, y, radius, colors) {
  drawingContext.fillStyle = colors.gold;
  drawingContext.beginPath();
  drawingContext.arc(x, y, radius, 0, Math.PI * 2);
  drawingContext.fill();
  drawingContext.fillStyle = "#03111f";
  drawingContext.beginPath();
  drawingContext.arc(x + radius * 0.38, y - radius * 0.04, radius * 0.92, 0, Math.PI * 2);
  drawingContext.fill();
}

function drawZodiacWheel(drawingContext, x, y, radius, colors) {
  drawingContext.strokeStyle = colors.gold;
  drawingContext.lineWidth = 3;
  drawingContext.beginPath();
  drawingContext.arc(x, y, radius, 0, Math.PI * 2);
  drawingContext.stroke();
  drawingContext.beginPath();
  drawingContext.arc(x, y, radius * 0.72, 0, Math.PI * 2);
  drawingContext.stroke();
  drawingContext.beginPath();
  drawingContext.arc(x, y, radius * 0.28, 0, Math.PI * 2);
  drawingContext.stroke();

  for (let index = 0; index < 12; index += 1) {
    const angle = (Math.PI * 2 * index) / 12 - Math.PI / 2;
    const outerX = x + Math.cos(angle) * radius;
    const outerY = y + Math.sin(angle) * radius;
    const innerX = x + Math.cos(angle) * radius * 0.28;
    const innerY = y + Math.sin(angle) * radius * 0.28;
    drawLine(drawingContext, innerX, innerY, outerX, outerY, "rgba(238, 201, 132, 0.45)", 1);
  }

  drawingContext.fillStyle = colors.gold;
  drawingContext.font = "700 40px Georgia, serif";
  drawingContext.textAlign = "center";
  drawingContext.fillText("*", x, y + 15);
  drawingContext.textAlign = "left";
}

function drawMiniCards(drawingContext, cards, x, y, width, height, colors) {
  const gap = 14;
  const cardWidth = (width - gap * 2) / 3;
  cards.forEach((card, index) => {
    const cardX = x + index * (cardWidth + gap);
    fillRoundedRect(drawingContext, cardX, y, cardWidth, height, 14, "rgba(255, 250, 240, 0.05)");
    strokeRoundedRect(drawingContext, cardX, y, cardWidth, height, 14, "rgba(238, 201, 132, 0.74)", 2);
    drawingContext.fillStyle = colors.gold;
    drawingContext.font = "700 20px Georgia, serif";
    drawingContext.textAlign = "center";
    drawingContext.fillText(String(index + 1), cardX + cardWidth / 2, y + 32);
    drawingContext.fillStyle = colors.cream;
    drawingContext.font = "700 18px Georgia, serif";
    drawingContext.textAlign = "left";
    wrapText(drawingContext, card.name, cardX + 14, y + 66, cardWidth - 28, 22, 2);
  });
}

function drawCompactField(drawingContext, label, value, x, y, maxWidth, colors, maxLines = 1) {
  drawingContext.fillStyle = colors.gold;
  drawingContext.font = "700 18px Arial, sans-serif";
  drawingContext.fillText(label.toUpperCase(), x, y);
  drawingContext.fillStyle = colors.cream;
  drawingContext.font = "20px Georgia, serif";
  return wrapText(drawingContext, value, x, y + 28, maxWidth, 25, maxLines) + 4;
}

function drawField(drawingContext, label, value, x, y, maxWidth, colors, maxLines = 2) {
  drawingContext.fillStyle = colors.gold;
  drawingContext.font = "700 20px Arial, sans-serif";
  drawingContext.fillText(label.toUpperCase(), x, y);
  drawingContext.fillStyle = colors.cream;
  drawingContext.font = "22px Georgia, serif";
  return wrapText(drawingContext, value, x, y + 32, maxWidth, 28, maxLines) + 8;
}

function drawBulletList(drawingContext, items, x, y, maxWidth, colors, maxLines = 2) {
  let cursorY = y;
  drawingContext.font = "22px Georgia, serif";
  items.forEach((item) => {
    drawingContext.fillStyle = colors.gold;
    drawingContext.fillText("-", x, cursorY);
    drawingContext.fillStyle = colors.cream;
    cursorY = wrapText(drawingContext, item, x + 28, cursorY, maxWidth - 28, 30, maxLines) + 10;
  });
  return cursorY;
}

function makeReadingReportCanvas(reading) {
  const width = 1440;
  const height = 1920;
  const reportCanvas = document.createElement("canvas");
  const drawingContext = reportCanvas.getContext("2d");
  const colors = {
    gold: "#e8c47c",
    cream: "#fff4df",
    muted: "rgba(255, 244, 223, 0.76)",
    rose: "#c99aa4",
  };
  const random = seededRandom(hashString(latestReadingText || `${reading.name}|${reading.question}`));

  reportCanvas.width = width;
  reportCanvas.height = height;

  drawReportBackground(drawingContext, width, height, random);
  drawReportBorder(drawingContext, width, height, colors);

  drawMoon(drawingContext, 142, 130, 54, colors);
  drawingContext.fillStyle = colors.gold;
  drawingContext.font = "700 54px Georgia, serif";
  drawingContext.textAlign = "center";
  drawingContext.fillText("MOONVEIL ORACLE", width / 2, 112);
  drawingContext.font = "700 28px Arial, sans-serif";
  drawingContext.fillText("AI TAROT & ASTROLOGY READING", width / 2, 158);
  drawingContext.fillStyle = colors.muted;
  drawingContext.font = "24px Georgia, serif";
  drawingContext.fillText("A reflective report for love, clarity, and self-reflection", width / 2, 198);
  drawingContext.textAlign = "left";
  fillRoundedRect(drawingContext, width - 182, 74, 104, 64, 18, "rgba(4, 21, 36, 0.9)");
  strokeRoundedRect(drawingContext, width - 182, 74, 104, 64, 18, colors.gold, 2);
  drawingContext.fillStyle = colors.gold;
  drawingContext.font = "700 27px Georgia, serif";
  drawingContext.textAlign = "center";
  drawingContext.fillText("1/1", width - 130, 116);
  drawingContext.textAlign = "left";

  drawReportPanel(drawingContext, 72, 244, 390, 330, "Reading Details", colors);
  let cursorY = 326;
  cursorY = drawCompactField(drawingContext, "Name", reading.name, 106, cursorY, 320, colors, 1);
  cursorY = drawCompactField(drawingContext, "Focus", reading.focus, 106, cursorY, 320, colors, 1);
  cursorY = drawCompactField(drawingContext, "Mood", reading.mood, 106, cursorY, 320, colors, 1);
  drawCompactField(drawingContext, "Timing", reading.zodiac, 106, cursorY, 320, colors, 1);

  drawReportPanel(drawingContext, 492, 244, 456, 330, "Oracle Map", colors);
  drawZodiacWheel(drawingContext, 720, 420, 118, colors);

  drawReportPanel(drawingContext, 978, 244, 390, 330, "Essence", colors);
  drawingContext.fillStyle = colors.cream;
  drawingContext.font = "700 32px Georgia, serif";
  wrapText(drawingContext, reading.archetype.name, 1016, 330, 318, 36, 2);
  drawingContext.fillStyle = colors.muted;
  drawingContext.font = "22px Georgia, serif";
  wrapText(drawingContext, reading.mainMessage, 1016, 420, 318, 30, 4);
  drawingContext.fillStyle = colors.gold;
  drawingContext.font = "700 18px Arial, sans-serif";
  wrapText(drawingContext, `Lucky: ${reading.color} / ${reading.number} / ${reading.timing}`, 1016, 532, 318, 24, 2);

  drawReportPanel(drawingContext, 72, 610, 1296, 156, "Question", colors);
  drawingContext.fillStyle = colors.cream;
  drawingContext.font = "26px Georgia, serif";
  wrapText(drawingContext, reading.question, 112, 696, 1216, 34, 2);

  const cardY = 810;
  const cardGap = 22;
  const cardWidth = (width - 144 - cardGap * 2) / 3;
  reading.cards.forEach((card, index) => {
    const x = 72 + index * (cardWidth + cardGap);
    drawReportPanel(drawingContext, x, cardY, cardWidth, 306, `Card ${index + 1}`, colors);
    drawingContext.fillStyle = colors.gold;
    drawingContext.font = "700 21px Arial, sans-serif";
    drawingContext.fillText(card.element.toUpperCase(), x + 34, cardY + 96);
    drawingContext.fillStyle = colors.cream;
    drawingContext.font = "700 32px Georgia, serif";
    wrapText(drawingContext, card.name, x + 34, cardY + 140, cardWidth - 68, 36, 2);
    drawingContext.fillStyle = colors.muted;
    drawingContext.font = "20px Georgia, serif";
    wrapText(drawingContext, card.message, x + 34, cardY + 212, cardWidth - 68, 28, 3);
  });

  drawReportPanel(drawingContext, 72, 1138, 626, 234, "Actionable Insight", colors);
  drawingContext.fillStyle = colors.cream;
  drawingContext.font = "24px Georgia, serif";
  wrapText(drawingContext, reading.weekMessage, 112, 1220, 546, 32, 3);
  drawingContext.fillStyle = colors.gold;
  drawingContext.font = "700 20px Arial, sans-serif";
  drawingContext.fillText("Try this today", 112, 1320);

  drawReportPanel(drawingContext, 742, 1138, 626, 234, "Deeper Reflection", colors);
  drawingContext.fillStyle = colors.muted;
  drawingContext.font = "22px Georgia, serif";
  wrapText(drawingContext, `${reading.archetype.text} ${reading.cards[0].message} ${reading.cards[1].message}`, 782, 1220, 546, 30, 5);

  drawReportPanel(drawingContext, 72, 1410, 1296, 218, "Daily Ritual", colors);
  drawBulletList(drawingContext, [
    reading.ritual,
    "Save this report, then return to the question when your body feels calmer.",
    "Use this as reflection, not certainty.",
  ], 118, 1490, 1188, colors, 2);

  drawReportPanel(drawingContext, 72, 1660, 1296, 142, "Gentle Boundary", colors);
  drawingContext.fillStyle = colors.muted;
  drawingContext.font = "21px Georgia, serif";
  wrapText(
    drawingContext,
    "Moonveil Oracle is for entertainment, journaling, and self-reflection. It does not promise love, money, healing, legal outcomes, investment returns, safety decisions, pregnancy, or contact from a specific person.",
    118,
    1736,
    1188,
    29,
    2
  );

  drawingContext.textAlign = "center";
  drawingContext.fillStyle = colors.gold;
  drawingContext.font = "700 24px Georgia, serif";
  drawingContext.fillText("Generated by Moonveil Oracle", width / 2, 1846);
  drawingContext.fillStyle = "rgba(255, 244, 223, 0.62)";
  drawingContext.font = "18px Arial, sans-serif";
  drawingContext.fillText("https://kjs-digital.github.io/moonveil-oracle.github.io/", width / 2, 1874);
  drawingContext.textAlign = "left";

  return reportCanvas;
}

function downloadReadingImage() {
  const reading = getActiveReading();
  if (!reading) return;
  const reportCanvas = makeReadingReportCanvas(reading);
  const link = document.createElement("a");
  link.href = reportCanvas.toDataURL("image/png");
  link.download = `moonveil-oracle-${slugify(reading.name)}.png`;
  document.body.append(link);
  link.click();
  link.remove();
  showToast("Reading image downloaded");
}

function saveReadingAsPdf() {
  const reading = getActiveReading();
  if (!reading) return;
  const reportCanvas = makeReadingReportCanvas(reading);
  const imageUrl = reportCanvas.toDataURL("image/png");
  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    showToast("Allow pop-ups to save PDF");
    return;
  }

  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>Moonveil Oracle - ${slugify(reading.name)}</title>
        <style>
          @page { margin: 0; size: auto; }
          html, body { margin: 0; min-height: 100%; background: #03111f; }
          body { display: grid; place-items: center; }
          img { display: block; max-width: 100%; width: 100%; height: auto; }
          @media print { img { width: 100%; } }
        </style>
      </head>
      <body>
        <img src="${imageUrl}" alt="Moonveil Oracle reading report" />
        <script>
          const image = document.querySelector("img");
          image.addEventListener("load", () => {
            window.focus();
            window.print();
          });
        <\/script>
      </body>
    </html>
  `);
  printWindow.document.close();
  showToast("PDF print view opened");
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
    openReadingWithCeremony(reading);
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

if (downloadImageButton) {
  downloadImageButton.addEventListener("click", downloadReadingImage);
}

if (downloadPdfButton) {
  downloadPdfButton.addEventListener("click", saveReadingAsPdf);
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
