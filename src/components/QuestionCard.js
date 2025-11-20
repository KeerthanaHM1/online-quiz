import React from "react";

export default function QuestionCard({ question, selected, onSelect }) {
  return (
    <div className="card">
      <h3>{question.question}</h3>

      <ul className="choices">
        {question.choices.map((choice, index) => (
          <li
            key={index}
            className={`choice ${selected === index ? "selected" : ""}`}
            onClick={() => onSelect(index)}
          >
            {String.fromCharCode(65 + index)}. {choice}
          </li>
        ))}
      </ul>
    </div>
  );
}
