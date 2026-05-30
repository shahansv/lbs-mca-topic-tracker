"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Nav from "@/components/Nav";
import { useProgress, makeExamId } from "@/lib/store";
import { CURRICULUM, SUBJECT_META, SubjectKey } from "@/lib/curriculum";

const MAIN_SUBJECTS: SubjectKey[] = ["cs", "math", "quant", "eng"];

function SubjectDetail({ subjectKey }: { subjectKey: SubjectKey }) {
  const [open, setOpen] = useState(false);
  const { getSubjectProgress, isCompleted, toggle, getTopicId } = useProgress();
  const meta = SUBJECT_META[subjectKey];
  const prog = getSubjectProgress(subjectKey);

  const allTopics: {
    day: number;
    code: string;
    name: string;
    done: boolean;
  }[] = [];
  CURRICULUM.forEach((d) =>
    d.subjects
      .filter((s) => s.key === subjectKey)
      .forEach((s) =>
        s.topics.forEach((t) =>
          allTopics.push({
            day: d.day,
            code: t.code,
            name: t.name,
            done: isCompleted(d.day, t.code),
          }),
        ),
      ),
  );

  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          padding: "20px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          gap: 16,
          textAlign: "left",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flex: 1,
            minWidth: 0,
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: meta.color,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 14,
              fontWeight: 400,
              color: "rgba(255,255,255,0.75)",
            }}
          >
            {meta.label}
          </span>
        </div>

        <div style={{ flex: 1, maxWidth: 180 }}>
          <div
            style={{
              height: 1,
              background: "rgba(255,255,255,0.07)",
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${prog.pct}%` }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
              style={{ height: "100%", background: meta.color, opacity: 0.6 }}
            />
          </div>
        </div>

        <span
          style={{
            fontSize: 13,
            fontFamily: "var(--font-mono)",
            color: "rgba(255,255,255,0.4)",
            minWidth: 64,
            textAlign: "right",
          }}
        >
          {prog.pct}%{" "}
          <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 11 }}>
            ({prog.done}/{prog.total})
          </span>
        </span>

        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{
            fontSize: 10,
            color: "rgba(255,255,255,0.2)",
            flexShrink: 0,
          }}
        >
          ▼
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ paddingBottom: 16, paddingLeft: 17 }}>
              {allTopics.map((t, i) => (
                <motion.button
                  key={`${t.day}-${t.code}`}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => toggle(getTopicId(t.day, t.code))}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "8px 0",
                    width: "100%",
                    background: "none",
                    border: "none",
                    borderBottom: "1px solid rgba(255,255,255,0.03)",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 4,
                      border: `1px solid ${t.done ? "rgba(74,222,128,0.5)" : "rgba(255,255,255,0.1)"}`,
                      background: t.done
                        ? "rgba(74,222,128,0.1)"
                        : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "all 0.2s",
                    }}
                  >
                    {t.done && (
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path
                          d="M1 4L3 6L7 2"
                          stroke="#4ade80"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: 13,
                      color: t.done
                        ? "rgba(74,222,128,0.35)"
                        : "rgba(255,255,255,0.55)",
                      textDecorationLine: t.done ? "line-through" : "none",
                      textDecorationColor: "rgba(74,222,128,0.2)",
                      flex: 1,
                      transition: "all 0.2s",
                    }}
                  >
                    {t.name}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: "var(--font-mono)",
                      color: "rgba(255,255,255,0.12)",
                      flexShrink: 0,
                    }}
                  >
                    D{t.day}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function OverviewPage() {
  const { getOverallProgress, isExamCompleted, reset } = useProgress();
  const overall = getOverallProgress();
  const [mounted, setMounted] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Collect all exams across days in order
  const allExams = CURRICULUM.flatMap((d) =>
    (d.exams ?? []).map((exam) => ({
      day: d.day,
      exam,
      id: makeExamId(d.day, exam),
    })),
  );

  const completedDays = CURRICULUM.filter((d) => {
    const p = useProgress.getState().getDayProgress(d.day);
    return p.done === p.total && p.total > 0;
  }).length;
  if (!mounted) return null;
  return (
    <>
      <Nav />
      <main
        style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px 96px" }}
      >
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: 56 }}
        >
          <p
            style={{
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              color: "rgba(255,255,255,0.2)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Progress Overview
          </p>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              color: "#fff",
            }}
          >
            Subject breakdown
          </h1>
        </motion.div>

        {/* Overall stats row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1,
            marginBottom: 64,
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          {[
            {
              label: "Overall",
              val: `${overall.pct}%`,
              sub: `${overall.done} of ${overall.total}`,
            },
            {
              label: "Completed",
              val: `${completedDays}`,
              sub: "of 16 days",
            },
            {
              label: "Remaining",
              val: `${overall.total - overall.done}`,
              sub: "topics left",
            },
          ].map(({ label, val, sub }, i) => (
            <div
              key={label}
              style={{
                padding: "20px 20px",
                background: "transparent",
                borderRight:
                  i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.2)",
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.08em",
                  marginBottom: 8,
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 300,
                  fontFamily: "var(--font-mono)",
                  color: "#fff",
                  letterSpacing: "-0.04em",
                  marginBottom: 2,
                }}
              >
                {val}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.2)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {sub}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Subject rows */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ marginBottom: 64 }}
        >
          <p
            style={{
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              color: "rgba(255,255,255,0.2)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            By subject
          </p>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {MAIN_SUBJECTS.map((key) => (
              <SubjectDetail key={key} subjectKey={key} />
            ))}
          </div>
        </motion.div>

        {/* Exams */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          style={{ marginBottom: 64 }}
        >
          <p
            style={{
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              color: "rgba(255,255,255,0.2)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            Exams
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {allExams.map(({ day, exam, id }, i) => {
              const done = isExamCompleted(id);
              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.04 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "12px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: done
                        ? "rgba(251,191,36,0.7)"
                        : "rgba(255,255,255,0.1)",
                      flexShrink: 0,
                      transition: "background 0.3s",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 13,
                      color: done
                        ? "rgba(251,191,36,0.4)"
                        : "rgba(255,255,255,0.5)",
                      flex: 1,
                      textDecorationLine: done ? "line-through" : "none",
                      textDecorationColor: "rgba(251,191,36,0.2)",
                      transition: "all 0.2s",
                    }}
                  >
                    {exam}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: "var(--font-mono)",
                      color: done
                        ? "rgba(251,191,36,0.4)"
                        : "rgba(255,255,255,0.1)",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {done ? "done" : `Day ${day}`}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Reset */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <button
            onClick={() => {
              setShowResetDialog(true);
            }}
            style={{
              background: "none",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8,
              padding: "8px 16px",
              fontSize: 12,
              fontFamily: "var(--font-mono)",
              color: "rgba(255,255,255,0.2)",
              cursor: "pointer",
              letterSpacing: "0.04em",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = "rgba(255,80,80,0.3)";
              el.style.color = "rgba(255,80,80,0.6)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = "rgba(255,255,255,0.08)";
              el.style.color = "rgba(255,255,255,0.2)";
            }}
          >
            Reset progress
          </button>
        </motion.div>
        {showResetDialog && (
          <div
            onClick={() => setShowResetDialog(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: 360,
                padding: "22px 22px 18px",
                borderRadius: 14,
                background: "rgba(10,10,10,0.92)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
              }}
            >
              {/* Title */}
              <div
                style={{
                  fontSize: 12,
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.35)",
                  marginBottom: 10,
                }}
              >
                Confirmation
              </div>

              <div
                style={{
                  fontSize: 18,
                  fontWeight: 300,
                  color: "#fff",
                  marginBottom: 8,
                  letterSpacing: "-0.02em",
                }}
              >
                Reset all progress?
              </div>

              <div
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.45)",
                  lineHeight: 1.4,
                  marginBottom: 18,
                }}
              >
                This will permanently clear all completed topics and exam
                progress. This action cannot be undone.
              </div>

              {/* Divider */}
              <div
                style={{
                  height: 1,
                  background: "rgba(255,255,255,0.06)",
                  marginBottom: 16,
                }}
              />

              {/* Buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                }}
              >
                <button
                  onClick={() => setShowResetDialog(false)}
                  style={{
                    padding: "8px 12px",
                    fontSize: 12,
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.06em",
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.10)",
                    borderRadius: 8,
                    color: "rgba(255,255,255,0.6)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.25)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.85)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.10)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    reset();
                    setShowResetDialog(false);
                  }}
                  style={{
                    padding: "8px 12px",
                    fontSize: 12,
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.06em",
                    background: "rgba(255,80,80,0.08)",
                    border: "1px solid rgba(255,80,80,0.25)",
                    borderRadius: 8,
                    color: "rgba(255,120,120,0.9)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,80,80,0.12)";
                    e.currentTarget.style.borderColor = "rgba(255,80,80,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,80,80,0.08)";
                    e.currentTarget.style.borderColor = "rgba(255,80,80,0.25)";
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
