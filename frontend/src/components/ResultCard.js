import React from "react";

export default function ResultCard({ result, onRetake }) {
  return (
    <div className="result-box">
      <h2 className="score">
        Your Score: {result.correct} / {result.total} ({result.scorePercent}%)
      </h2>

      <div className="result-list">
        {result.details.map((d, index) => (
          <p key={index}>
            Question {index + 1}
:{" "}
            {d.correct ? (
              <span className="correct">✔ Correct</span>
            ) : (
              <span className="wrong">✘ Wrong</span>
            )}
          </p>
        ))}
      </div>

      <button className="btn" onClick={onRetake}>
        Retry Quiz
      </button>
    </div>
  );
}
