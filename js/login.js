const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("studentName").value.trim();
  const id = document.getElementById("studentId").value.trim();

  if (!name || !id) {
    alert("Please enter both your name and student ID.");
    return;
  }

  localStorage.setItem("studentName", name);
  localStorage.setItem("studentId", id);
  localStorage.removeItem("examAnswers");
  localStorage.removeItem("examResult");
  localStorage.removeItem("examEndTime");

  window.location.href = "exam.html";
});