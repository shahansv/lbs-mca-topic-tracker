"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Question {
  id: number;
  type: "mcq";
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface PracticeModalProps {
  topic: string;
  subject: string;
  isOpen: boolean;
  onClose: () => void;
}

type QuestionState = {
  selected: string | null;
  revealed: boolean;
};

const COUNT_OPTIONS = [10, 20, 30];

export default function PracticeModal({
  topic,
  subject,
  isOpen,
  onClose,
}: PracticeModalProps) {
  type Step = "context" | "loading" | "questions" | "results";
  const [step, setStep] = useState<Step>("context");
  const [context, setContext] = useState("");
  const [count, setCount] = useState(10);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [states, setStates] = useState<Record<number, QuestionState>>({});
  const [error, setError] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (!isOpen) {
      timer = setTimeout(() => {
        setStep("context");
        setContext("");
        setCount(10);
        setQuestions([]);
        setStates({});
        setError("");
      }, 300);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOpen]);

  const handleGenerate = async () => {
    setStep("loading");
    setError("");
    try {
      const res = await fetch("/api/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, subject, context, count }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setQuestions(data.questions);
      const init: Record<number, QuestionState> = {};
      data.questions.forEach((q: Question) => {
        init[q.id] = { selected: null, revealed: false };
      });
      setStates(init);
      setStep("questions");
    } catch {
      setError("Couldn't generate questions. Please try again.");
      setStep("context");
    }
  };

  const selectOption = (qId: number, opt: string) => {
    if (states[qId]?.revealed) return;
    setStates((p) => ({ ...p, [qId]: { ...p[qId], selected: opt } }));
  };

  const reveal = (qId: number) => {
    setStates((p) => ({ ...p, [qId]: { ...p[qId], revealed: true } }));
  };

  const checkCorrect = (q: Question, s: QuestionState): boolean =>
    s.selected === q.answer;

  const score = questions.filter((q) => {
    const s = states[q.id];
    return s?.revealed && checkCorrect(q, s);
  }).length;

  const allRevealed =
    questions.length > 0 && questions.every((q) => states[q.id]?.revealed);

  const pct =
    questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  const scoreColor = pct >= 70 ? "#4ade80" : pct >= 50 ? "#fbbf24" : "#f87171";
  const scoreBg =
    pct >= 70
      ? "rgba(74,222,128,0.07)"
      : pct >= 50
        ? "rgba(251,191,36,0.07)"
        : "rgba(239,68,68,0.07)";
  const scoreBorder =
    pct >= 70
      ? "rgba(74,222,128,0.2)"
      : pct >= 50
        ? "rgba(251,191,36,0.2)"
        : "rgba(239,68,68,0.2)";

  const reset = () => {
    setStep("context");
    setQuestions([]);
    setStates({});
    setContext("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(4px)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === overlayRef.current && onClose()}
        >
          <motion.div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
            style={{
              background: "#0f0f13",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 380 }}
          >
            {/* Header */}
            <div
              className="flex items-start justify-between p-6 pb-4"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div>
                <p
                  className="text-xs font-mono uppercase tracking-widest mb-1"
                  style={{ color: "#a78bfa" }}
                >
                  {step === "results" ? "Results" : "Practice Mode"}
                </p>
                <h2
                  className="text-lg font-semibold"
                  style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif" }}
                >
                  {topic}
                </h2>
                <p
                  className="text-sm mt-0.5"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  {subject}
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2"
                style={{ color: "rgba(255,255,255,0.4)" }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.06)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* ── CONTEXT STEP ── */}
              {step === "context" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p
                    className="text-sm mb-5"
                    style={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}
                  >
                    Subject notes and PYQs are pre-loaded. Optionally add extra
                    context below for more targeted questions.
                  </p>

                  {/* Count selector */}
                  <div className="mb-5">
                    <label
                      className="block text-xs font-mono uppercase tracking-wider mb-3"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                    >
                      Number of questions
                    </label>
                    <div className="flex gap-2">
                      {COUNT_OPTIONS.map((n) => (
                        <button
                          key={n}
                          onClick={() => setCount(n)}
                          className="flex-1 py-2 rounded-lg text-sm font-mono transition-all"
                          style={{
                            background:
                              count === n
                                ? "rgba(167,139,250,0.18)"
                                : "rgba(255,255,255,0.04)",
                            border: `1px solid ${count === n ? "rgba(167,139,250,0.5)" : "rgba(255,255,255,0.08)"}`,
                            color:
                              count === n
                                ? "#a78bfa"
                                : "rgba(255,255,255,0.35)",
                          }}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Extra context */}
                  <label
                    className="block text-xs font-mono uppercase tracking-wider mb-2"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    Extra context (optional)
                  </label>
                  <textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="Paste extra notes or specific PYQs..."
                    rows={4}
                    className="w-full rounded-xl p-4 text-sm resize-none outline-none"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.85)",
                      fontFamily: "'DM Mono', monospace",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "rgba(167,139,250,0.4)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "rgba(255,255,255,0.08)")
                    }
                  />

                  {error && (
                    <p
                      className="text-sm mt-3 rounded-lg p-3"
                      style={{
                        background: "rgba(239,68,68,0.12)",
                        color: "#f87171",
                      }}
                    >
                      {error}
                    </p>
                  )}

                  <button
                    onClick={handleGenerate}
                    className="mt-4 w-full py-3 rounded-xl font-medium text-sm transition-all active:scale-[0.98]"
                    style={{ background: "#a78bfa", color: "#0f0f13" }}
                    onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
                    onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    Generate {count} Questions →
                  </button>
                </motion.div>
              )}

              {/* ── LOADING STEP ── */}
              {step === "loading" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center py-12 gap-4"
                >
                  <div className="relative w-12 h-12">
                    <div
                      className="absolute inset-0 rounded-full animate-spin"
                      style={{
                        border: "2px solid rgba(167,139,250,0.15)",
                        borderTopColor: "#a78bfa",
                      }}
                    />
                  </div>
                  <p
                    className="text-sm"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    Generating{" "}
                    <span style={{ color: "#a78bfa" }}>{count} questions</span>{" "}
                    for <span style={{ color: "#a78bfa" }}>{topic}</span>...
                  </p>
                </motion.div>
              )}

              {/* ── QUESTIONS STEP ── */}
              {step === "questions" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-5"
                >
                  {/* Progress bar */}
                  <div
                    className="rounded-full overflow-hidden"
                    style={{ height: 3, background: "rgba(255,255,255,0.06)" }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "#a78bfa" }}
                      animate={{
                        width: `${(questions.filter((q) => states[q.id]?.revealed).length / questions.length) * 100}%`,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 30,
                      }}
                    />
                  </div>
                  <p
                    className="text-xs font-mono text-right"
                    style={{ color: "rgba(255,255,255,0.25)" }}
                  >
                    {questions.filter((q) => states[q.id]?.revealed).length} /{" "}
                    {questions.length} answered
                  </p>

                  {questions.map((q, i) => {
                    const s = states[q.id] ?? {
                      selected: null,
                      revealed: false,
                    };
                    const correct = s.revealed ? checkCorrect(q, s) : null;

                    return (
                      <motion.div
                        key={q.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="rounded-xl p-5"
                        style={{
                          background: s.revealed
                            ? correct
                              ? "rgba(74,222,128,0.04)"
                              : "rgba(239,68,68,0.04)"
                            : "rgba(255,255,255,0.03)",
                          border: `1px solid ${
                            s.revealed
                              ? correct
                                ? "rgba(74,222,128,0.18)"
                                : "rgba(239,68,68,0.18)"
                              : "rgba(255,255,255,0.06)"
                          }`,
                          transition: "background 0.3s, border-color 0.3s",
                        }}
                      >
                        <div className="flex gap-3 mb-4">
                          <span
                            className="text-xs font-mono px-2 py-0.5 rounded-md shrink-0 mt-0.5"
                            style={{
                              background: s.revealed
                                ? correct
                                  ? "rgba(74,222,128,0.15)"
                                  : "rgba(239,68,68,0.15)"
                                : "rgba(167,139,250,0.15)",
                              color: s.revealed
                                ? correct
                                  ? "#4ade80"
                                  : "#f87171"
                                : "#a78bfa",
                            }}
                          >
                            {s.revealed ? (correct ? "✓" : "✗") : `Q${i + 1}`}
                          </span>
                          <p
                            className="text-sm leading-relaxed"
                            style={{ color: "rgba(255,255,255,0.85)" }}
                          >
                            {q.question}
                          </p>
                        </div>

                        <div className="space-y-2">
                          {q.options.map((opt) => {
                            const isSelected = s.selected === opt;
                            const isAnswer = opt === q.answer;
                            let bg = "rgba(255,255,255,0.03)";
                            let border = "rgba(255,255,255,0.07)";
                            let color = "rgba(255,255,255,0.65)";
                            if (s.revealed) {
                              if (isAnswer) {
                                bg = "rgba(74,222,128,0.1)";
                                border = "rgba(74,222,128,0.35)";
                                color = "#4ade80";
                              } else if (isSelected) {
                                bg = "rgba(239,68,68,0.1)";
                                border = "rgba(239,68,68,0.35)";
                                color = "#f87171";
                              }
                            } else if (isSelected) {
                              bg = "rgba(167,139,250,0.1)";
                              border = "rgba(167,139,250,0.35)";
                              color = "#c4b5fd";
                            }
                            return (
                              <button
                                key={opt}
                                onClick={() => selectOption(q.id, opt)}
                                disabled={s.revealed}
                                className="w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all flex items-center gap-3"
                                style={{
                                  background: bg,
                                  border: `1px solid ${border}`,
                                  color,
                                  cursor: s.revealed ? "default" : "pointer",
                                }}
                              >
                                {s.revealed && isAnswer && (
                                  <span
                                    className="text-xs shrink-0"
                                    style={{ color: "#4ade80" }}
                                  >
                                    ✓
                                  </span>
                                )}
                                {s.revealed && isSelected && !isAnswer && (
                                  <span
                                    className="text-xs shrink-0"
                                    style={{ color: "#f87171" }}
                                  >
                                    ✗
                                  </span>
                                )}
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {!s.revealed && (
                          <button
                            onClick={() => reveal(q.id)}
                            disabled={!s.selected}
                            className="mt-3 text-xs px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-30"
                            style={{
                              background: "rgba(167,139,250,0.15)",
                              color: "#a78bfa",
                            }}
                          >
                            Reveal Answer
                          </button>
                        )}

                        <AnimatePresence>
                          {s.revealed && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 overflow-hidden"
                            >
                              <div
                                className="rounded-lg p-3"
                                style={{
                                  background: "rgba(255,255,255,0.03)",
                                  borderLeft: `2px solid ${correct ? "rgba(74,222,128,0.5)" : "rgba(239,68,68,0.5)"}`,
                                }}
                              >
                                <p
                                  className="text-xs leading-relaxed"
                                  style={{ color: "rgba(255,255,255,0.45)" }}
                                >
                                  {q.explanation}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}

                  <AnimatePresence>
                    {allRevealed && (
                      <motion.button
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => setStep("results")}
                        className="w-full py-3 rounded-xl font-medium text-sm"
                        style={{ background: "#a78bfa", color: "#0f0f13" }}
                      >
                        See Results →
                      </motion.button>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* ── RESULTS STEP ── */}
              {step === "results" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-5"
                >
                  <div
                    className="rounded-xl p-6 text-center"
                    style={{
                      background: scoreBg,
                      border: `1px solid ${scoreBorder}`,
                    }}
                  >
                    <p
                      className="font-light font-mono mb-1"
                      style={{
                        fontSize: 52,
                        color: scoreColor,
                        letterSpacing: "-0.04em",
                        lineHeight: 1,
                      }}
                    >
                      {score}
                      <span
                        style={{ fontSize: 24, color: "rgba(255,255,255,0.2)" }}
                      >
                        /{questions.length}
                      </span>
                    </p>
                    <p
                      className="text-sm font-mono mt-2"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                    >
                      {pct}% ·{" "}
                      {pct >= 80
                        ? "Excellent"
                        : pct >= 60
                          ? "Good"
                          : pct >= 40
                            ? "Keep practicing"
                            : "Needs revision"}
                    </p>
                  </div>

                  <div
                    className="rounded-xl overflow-hidden"
                    style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <p
                      className="px-4 py-2.5 text-xs font-mono uppercase tracking-wider"
                      style={{
                        color: "rgba(255,255,255,0.25)",
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      Question breakdown
                    </p>
                    {questions.map((q, i) => {
                      const s = states[q.id];
                      const correct = s ? checkCorrect(q, s) : false;
                      return (
                        <div
                          key={q.id}
                          style={{
                            padding: "12px 16px",
                            borderBottom:
                              i < questions.length - 1
                                ? "1px solid rgba(255,255,255,0.04)"
                                : "none",
                            background: correct
                              ? "rgba(74,222,128,0.02)"
                              : "rgba(239,68,68,0.02)",
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <span
                              className="text-xs font-mono px-1.5 py-0.5 rounded shrink-0"
                              style={{
                                marginTop: 1,
                                background: correct
                                  ? "rgba(74,222,128,0.12)"
                                  : "rgba(239,68,68,0.12)",
                                color: correct ? "#4ade80" : "#f87171",
                              }}
                            >
                              {correct ? "✓" : "✗"}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p
                                className="text-xs leading-relaxed mb-1.5"
                                style={{ color: "rgba(255,255,255,0.6)" }}
                              >
                                Q{i + 1}: {q.question}
                              </p>
                              {!correct && (
                                <div className="space-y-1">
                                  {s?.selected && (
                                    <p
                                      className="text-xs font-mono"
                                      style={{ color: "rgba(239,68,68,0.65)" }}
                                    >
                                      Your answer:{" "}
                                      <span style={{ color: "#f87171" }}>
                                        {s.selected}
                                      </span>
                                    </p>
                                  )}
                                  <p
                                    className="text-xs font-mono"
                                    style={{ color: "rgba(74,222,128,0.75)" }}
                                  >
                                    Correct:{" "}
                                    <span style={{ color: "#4ade80" }}>
                                      {q.answer}
                                    </span>
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={reset}
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                      style={{
                        background: "rgba(167,139,250,0.15)",
                        color: "#a78bfa",
                        border: "1px solid rgba(167,139,250,0.25)",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(167,139,250,0.22)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(167,139,250,0.15)")
                      }
                    >
                      Try Again
                    </button>
                    <button
                      onClick={() => setStep("questions")}
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        color: "rgba(255,255,255,0.45)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(255,255,255,0.08)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(255,255,255,0.05)")
                      }
                    >
                      Review Answers
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
