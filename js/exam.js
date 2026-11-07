const questions = [
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    answer: 1
  },
  {
    question: "What is the capital city of India?",
    options: ["Mumbai", "Chennai", "New Delhi", "Kolkata"],
    answer: 2
  },
  {
    question: "Which language is used to structure web pages?",
    options: ["HTML", "Python", "C", "Java"],
    answer: 0
  },
  {
    question: "How many sides does a hexagon have?",
    options: ["Five", "Six", "Seven", "Eight"],
    answer: 1
  },
  {
    question: "Which is the largest ocean in the world?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    answer: 3
  },
  {
    question: "What does CPU stand for?",
    options: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Control Processing User"],
    answer: 0
  },
  {
    question: "Which gas do plants absorb from the atmosphere?",
    options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
    answer: 2
  },
  {
    question: "What is 12 × 8?",
    options: ["84", "96", "108", " aks"],
    answer: 1
  },
  {
    question: "Which of these is a JavaScript data type?",
    options: ["Boolean", "Markup", "Stylesheet", "Document"],
    answer: 0
  },
  {
    question: "Which device is commonly used to input text into a computer?",
    options: ["Monitor", "Speaker", "Keyboard", "Printer"],
    answer: 2
  }
];

// Fix the displayed option for question 8.
questions[7].options[3] = "112";

const studentName = localStorage.getItem("studentName");
if (!studentName) {
  window.location.replace("index.html");
}

const answers = JSON.parse(localStorage.getItem("examAnswers") || "{}");
let currentQuestion = 0;
let examSubmitted = false;

const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("options");
const timerElement = document.getElementById("timer");
const progressText = document.getElementById("progressText");
const answeredText = document.getElementById("answeredText");
const progressBar = document.getElementById("progressBar");
const palette = document.getElementById("questionPalette");
const modal = document.getElementById("confirmModal");

document.getElementById("studentDisplay").textContent =
  `${studentName} · ${localStorage.getItem("studentId") || ""}`;

function saveAnswers() {
  localStorage.setItem("examAnswers", JSON.stringify(answers));
}

function renderPalette() {
  palette.innerHTML = "";
  questions.forEach((_, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "palette-button";
    button.textContent = index + 1;
    if (index === currentQuestion) button.classList.add("current");
    if (answers[index] !== undefined) button.classList.add("answered");
    button.addEventListener("click", () => {
      currentQuestion = index;
      renderQuestion();
    });
    palette.appendChild(button);
  });
}

function renderQuestion() {
  const item = questions[currentQuestion];
  questionText.textContent = item.question;
  document.getElementById("questionTag").textContent =
    `QUESTION ${String(currentQuestion + 1).padStart(2, "0")}`;

  optionsContainer.innerHTML = "";
  item.options.forEach((option, index) => {
    const label = document.createElement("label");
    label.className = "option-choice";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "answer";
    input.value = index;
    input.checked = Number(answers[currentQuestion]) === index;
    input.addEventListener("change", () => {
      answers[currentQuestion] = index;
      saveAnswers();
      updateProgress();
      renderPalette();
    });

    const letter = document.createElement("span");
    letter.className = "option-letter";
    letter.textContent = String.fromCharCode(65 + index);

    const text = document.createElement("span");
    text.className = "option-text";
    text.textContent = option;

    label.append(input, letter, text);
    if (input.checked) label.classList.add("selected");
    input.addEventListener("change", () => {
      optionsContainer.querySelectorAll(".option-choice").forEach(el => el.classList.remove("selected"));
      label.classList.add("selected");
    });
    optionsContainer.appendChild(label);
  });

  document.getElementById("prevBtn").disabled = currentQuestion === 0;
  document.getElementById("nextBtn").textContent =
    currentQuestion === questions.length - 1 ? "Review answers ↓" : "Next question →";

  updateProgress();
  renderPalette();
}

function updateProgress() {
  const count = Object.keys(answers).length;
  progressText.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
  answeredText.textContent = `${count} of ${questions.length} answered`;
  progressBar.style.width = `${(count / questions.length) * 100}%`;
}

document.getElementById("prevBtn").addEventListener("click", () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    renderQuestion();
  }
});

document.getElementById("nextBtn").addEventListener("click", () => {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    renderQuestion();
  } else {
    showSubmitModal();
  }
});

function showSubmitModal() {
  const unanswered = questions.length - Object.keys(answers).length;
  document.getElementById("modalMessage").textContent = unanswered
    ? `You have ${unanswered} unanswered question(s). Are you sure you want to submit?`
    : "You have answered all questions. Ready to submit your exam?";
  modal.classList.remove("hidden");
}

function submitExam() {
  if (examSubmitted) return;
  examSubmitted = true;

  let correct = 0;
  questions.forEach((question, index) => {
    if (Number(answers[index]) === question.answer) correct++;
  });

  const result = {
    name: studentName,
    id: localStorage.getItem("studentId") || "",
    total: questions.length,
    correct,
    wrong: Object.keys(answers).length - correct,
    unanswered: questions.length - Object.keys(answers).length,
    percentage: Math.round((correct / questions.length) * 100),
    submittedAt: new Date().toLocaleString()
  };

  localStorage.setItem("examResult", JSON.stringify(result));
  localStorage.removeItem("examEndTime");
  window.location.href = "result.html";
}

document.getElementById("submitTop").addEventListener("click", showSubmitModal);
document.getElementById("cancelSubmit").addEventListener("click", () => modal.classList.add("hidden"));
document.getElementById("confirmSubmit").addEventListener("click", submitExam);

const duration = 10 * 60;
let endTime = Number(localStorage.getItem("examEndTime"));
if (!endTime || endTime < Date.now()) {
  endTime = Date.now() + duration * 1000;
  localStorage.setItem("examEndTime", String(endTime));
}

function updateTimer() {
  const secondsLeft = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  timerElement.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  if (secondsLeft <= 60) timerElement.classList.add("timer-warning");
  if (secondsLeft === 0) submitExam();
}

renderQuestion();
updateTimer();
setInterval(updateTimer, 1000);