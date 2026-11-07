const result = JSON.parse(localStorage.getItem("examResult") || "null");

if (!result) {
  window.location.replace("index.html");
} else {
  document.getElementById("resultGreeting").textContent = `Well done, ${result.name}!`;
  document.getElementById("score").textContent = result.correct;
  document.getElementById("correctCount").textContent = result.correct;
  document.getElementById("wrongCount").textContent = result.wrong;
  document.getElementById("unansweredCount").textContent = result.unanswered;
  document.getElementById("percentage").textContent = `${result.percentage}% score`;

  const scoreBar = document.getElementById("scoreBar");
  scoreBar.style.width = `${result.percentage}%`;

  const status = document.getElementById("resultStatus");
  if (result.percentage >= 40) {
    status.textContent = "PASS";
    status.classList.add("status-pass");
    document.getElementById("feedback").textContent =
      "Good effort! Keep practising and continue building your knowledge.";
  } else {
    status.textContent = "KEEP PRACTISING";
    status.classList.add("status-fail");
    document.getElementById("feedback").textContent =
      "Every attempt is a learning opportunity. Review the topics and try again.";
  }
}

document.getElementById("retakeBtn").addEventListener("click", () => {
  localStorage.removeItem("examAnswers");
  localStorage.removeItem("examResult");
  localStorage.removeItem("examEndTime");
  window.location.href = "exam.html";
});

document.getElementById("homeBtn").addEventListener("click", () => {
  localStorage.removeItem("examAnswers");
  localStorage.removeItem("examResult");
  localStorage.removeItem("examEndTime");
  window.location.href = "index.html";
});