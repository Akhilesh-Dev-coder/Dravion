"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, RotateCcw, HelpCircle, Award } from "lucide-react";

export interface MCQItem {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  difficulty?: "easy" | "medium" | "hard";
}

interface MCQQuizProps {
  mcqs: MCQItem[];
  title?: string;
}

export default function MCQQuiz({ mcqs, title = "Practice MCQs" }: MCQQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!mcqs || mcqs.length === 0) {
    return (
      <div className="p-8 text-center bg-white/5 border border-white/10 rounded-xl text-gray-400 text-sm">
        No practice MCQs available for this topic yet.
      </div>
    );
  }

  const currentMCQ = mcqs[currentIndex];
  const selectedOption = selectedAnswers[currentIndex];

  const handleSelect = (optionIndex: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: optionIndex }));
  };

  const calculateScore = () => {
    let score = 0;
    mcqs.forEach((mcq, idx) => {
      if (selectedAnswers[idx] === mcq.correctAnswer) {
        score += 1;
      }
    });
    return score;
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setCurrentIndex(0);
  };

  const score = calculateScore();

  return (
    <div className="bg-[#141720] border border-white/10 rounded-2xl p-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Award className="w-5 h-5 text-blue-400" />
            <span>{title}</span>
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Question {currentIndex + 1} of {mcqs.length}
          </p>
        </div>

        {submitted ? (
          <div className="flex items-center space-x-3">
            <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg text-xs font-bold">
              Score: {score} / {mcqs.length} ({Math.round((score / mcqs.length) * 100)}%)
            </div>
            <button
              onClick={handleReset}
              className="flex items-center space-x-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-gray-300 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-1">
            {mcqs.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentIndex === idx
                    ? "bg-blue-600 text-white"
                    : selectedAnswers[idx] !== undefined
                    ? "bg-white/20 text-gray-200"
                    : "bg-white/5 text-gray-500 hover:bg-white/10"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Question */}
      <div className="mb-6">
        <div className="flex items-start space-x-3">
          <span className="shrink-0 px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded text-xs font-bold">
            Q{currentIndex + 1}
          </span>
          <h4 className="text-base font-semibold text-white leading-relaxed">
            {currentMCQ.question}
          </h4>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {currentMCQ.options.map((option, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrect = idx === currentMCQ.correctAnswer;

          let optionStyle =
            "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20";

          if (submitted) {
            if (isCorrect) {
              optionStyle = "bg-emerald-500/15 border-emerald-500/50 text-emerald-300 font-semibold";
            } else if (isSelected && !isCorrect) {
              optionStyle = "bg-rose-500/15 border-rose-500/50 text-rose-300";
            } else {
              optionStyle = "bg-white/5 border-white/10 text-gray-500 opacity-60";
            }
          } else if (isSelected) {
            optionStyle = "bg-blue-600/20 border-blue-500/60 text-white font-medium shadow-md shadow-blue-500/10";
          }

          return (
            <button
              key={idx}
              disabled={submitted}
              onClick={() => handleSelect(idx)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border text-left text-sm transition-all cursor-pointer ${optionStyle}`}
            >
              <div className="flex items-center space-x-3">
                <span className="w-6 h-6 rounded-full border border-current/30 flex items-center justify-center text-xs shrink-0 font-mono">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{option}</span>
              </div>
              {submitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
              {submitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Explanation if submitted */}
      {submitted && currentMCQ.explanation && (
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl mb-6 text-xs text-blue-200 leading-relaxed flex items-start space-x-3">
          <HelpCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-blue-300 font-semibold mb-1">Explanation:</strong>
            {currentMCQ.explanation}
          </div>
        </div>
      )}

      {/* Bottom Nav / Submit */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-lg text-xs font-medium disabled:opacity-30 cursor-pointer"
        >
          Previous
        </button>

        {currentIndex < mcqs.length - 1 ? (
          <button
            onClick={() => setCurrentIndex((prev) => Math.min(mcqs.length - 1, prev + 1))}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-blue-500/20 cursor-pointer"
          >
            Next Question
          </button>
        ) : !submitted ? (
          <button
            onClick={() => setSubmitted(true)}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold cursor-pointer"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
