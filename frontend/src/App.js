import React, { useEffect, useState } from "react";
import QuestionCard from "./components/QuestionCard";
import ResultCard from "./components/ResultCard";

import "./Quiz.css";

const API_BASE = process.env.REACT_APP_API;

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [answerMap, setAnswerMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/questions`)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.questions);
        setAnswerMap(data.answerMap);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const selectChoice = (qid, choice) => {
    setAnswers((prev) => ({ ...prev, [qid]: choice }));
  };

  const submitQuiz = async () => {
    const payload = {
      answers: Object.entries(answers).map(([id, choice]) => ({
        id,
        choice,
      })),
      answerMap,
    };

    const res = await fetch(`${API_BASE}/api/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setResult(data);
  };

  if (loading) return <h2 className="container">Loading Quiz…</h2>;

  return (
    <div className="container">
      <h1 className="title">Online Quiz</h1>

      {result ? (
        <ResultCard result={result} onRetake={() => window.location.reload()} />
      ) : (
        <>
          <div className="quiz">
            {questions.map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                selected={answers[q.id]}
                onSelect={(choice) => selectChoice(q.id, choice)}
              />
            ))}
          </div>

          <button className="btn" onClick={submitQuiz}>
            Submit Quiz
          </button>
        </>
      )}
    </div>
  );
}
