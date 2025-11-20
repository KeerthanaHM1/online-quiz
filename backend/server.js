const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Load questions
const questionsPath = path.join(__dirname, 'data', 'questions.json');
let questions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

// Shuffle helper
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// ------------------------------
// GET QUESTIONS (Correct logic)
// ------------------------------
app.get('/api/questions', (req, res) => {
  let shuffledQuestions = questions.map(q => {
    const choices = [...q.choices];

    // Shuffle options
    const shuffledChoices = shuffle(choices);

    // Correct answer is TEXT in JSON → find its index after shuffle
    const newCorrectIndex = shuffledChoices.findIndex(
      choice => choice === q.answer
    );

    return {
      id: q.id,
      question: q.question,
      choices: shuffledChoices,
      correctIndex: newCorrectIndex
    };
  });

  // Shuffle question order
  shuffledQuestions = shuffle(shuffledQuestions);

  // Prepare frontend response
  res.json({
    questions: shuffledQuestions.map(q => ({
      id: q.id,
      question: q.question,
      choices: q.choices
    })),
    answerMap: shuffledQuestions.reduce((acc, q) => {
      acc[q.id] = q.correctIndex;
      return acc;
    }, {})
  });
});

// ------------------------------
// SUBMIT QUIZ (Correct logic)
// ------------------------------
app.post('/api/submit', (req, res) => {
  const { answers, answerMap } = req.body;

  let total = Object.keys(answerMap).length;
  let correct = 0;
  let details = [];

  answers.forEach(ans => {
    let correctIndex = answerMap[ans.id];
    let isCorrect = ans.choice === correctIndex;

    if (isCorrect) correct++;

    details.push({
      id: ans.id,
      correct: isCorrect,
      correctChoice: correctIndex
    });
  });

  res.json({
    total,
    correct,
    scorePercent: Math.round((correct / total) * 100),
    details
  });
});

// ------------------------------
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Quiz API running on port ${port}`));

