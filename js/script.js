
  const quizModal = document.getElementById("quizModal");
  const quizContent = document.getElementById("quizContent");

const questions = [
  {
    q: "What kind of product do you sell?",
    options: ["👕 Clothing", "🎨 Art", "🍰 Food", "💍 Accessories"]
  },
  {
    q: "What crowd do you want to reach?",
    options: ["👨‍👩‍👧 Families", "🧑‍🎤 Young Adults", "🏡 Locals", "🧳 Tourists"]
  },
  {
    q: "What size booth do you prefer?",
    options: ["🪑 Small Table", "⛺ 10×10 Tent", "🤝 Shared Space"]
  }
];


  let currentStep = 0;
  let answers = [];

  function openQuiz() {
    quizModal.style.display = "flex";
    showStep();
  }

  function closeQuiz() {
    quizModal.style.display = "none";
    currentStep = 0;
    answers = [];
    quizContent.innerHTML = "";
  }

  function showStep() {
    const step = questions[currentStep];
    quizContent.innerHTML = `
      <div class="quiz-step">
        <h3>${step.q}</h3>
        <div class="quiz-options">
          ${step.options.map(option => 
            `<button onclick="selectAnswer('${option}')">${option}</button>`).join("")}
        </div>
      </div>
    `;
  }

  function selectAnswer(option) {
    answers[currentStep] = option;
    currentStep++;
    if (currentStep < questions.length) {
      showStep();
    } else {
      showResult();
    }
  }

  function showResult() {
    const result = `you seem like a good fit for: <strong>the clarkston summer market</strong>!`;
    quizContent.innerHTML = `
      <div class="quiz-step">
        <h3>all done!</h3>
        <p>${result}</p>
        <button class="next-btn" onclick="closeQuiz()">close</button>
      </div>
    `;
  }

