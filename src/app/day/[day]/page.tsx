"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import Nav from "@/components/Nav";
import ProgressRing from "@/components/ProgressRing";
import PracticeModal from "@/components/PracticeModal";
import { useProgress, makeExamId } from "@/lib/store";
import { CURRICULUM, SUBJECT_META } from "@/lib/curriculum";

export default function DayPage({
  params,
}: {
  params: Promise<{ day: string }>;
}) {
  const { day: dayParam } = use(params);
  const dayNum = parseInt(dayParam, 10);
  const dayData = CURRICULUM.find((d) => d.day === dayNum);

  if (!dayData || isNaN(dayNum)) notFound();

  const {
    hydrated,
    toggle,
    getTopicId,
    isCompleted,
    getDayProgress,
    toggleExam,
    isExamCompleted,
  } = useProgress();

  const [practiceOpen, setPracticeOpen] = useState(false);
  const [practiceTopic, setPracticeTopic] = useState({ name: "", subject: "" });

  const prog = hydrated
    ? getDayProgress(dayNum)
    : { done: 0, total: 0, pct: 0 };
  const isDone = prog.done === prog.total && prog.total > 0;

  const prev = dayNum > 1 ? dayNum - 1 : null;
  const next = dayNum < 16 ? dayNum + 1 : null;

  return (
    <>
      <Nav />
      <main
        style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px 96px" }}
      >
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          style={{ marginBottom: 40 }}
        >
          <Link
            href="/"
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.25)",
              textDecoration: "none",
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.05em",
              transition: "color 0.2s",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
            onMouseEnter={(e) =>
              ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.5)")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.25)")
            }
          >
            ← All days
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          style={{
            marginBottom: 48,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div>
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
              Day {String(dayNum).padStart(2, "0")} of 16
            </p>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 300,
                letterSpacing: "-0.02em",
                color: "#fff",
              }}
            >
              Study Plan
            </h1>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexShrink: 0,
            }}
          >
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 300,
                  fontFamily: "var(--font-mono)",
                  color: isDone ? "#4ade80" : "#fff",
                  letterSpacing: "-0.04em",
                }}
              >
                {prog.pct}
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
                  %
                </span>
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,0.25)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {prog.done}/{prog.total}
              </div>
            </div>
            <ProgressRing
              pct={prog.pct}
              size={44}
              stroke={2}
              color={isDone ? "#4ade80" : "rgba(255,255,255,0.75)"}
            />
          </div>
        </motion.div>

        {/* Subject sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {dayData.subjects.map((subject, si) => {
            const meta = SUBJECT_META[subject.key];
            const subjectDone = hydrated
              ? subject.topics.filter((t) => isCompleted(dayNum, t.code)).length
              : 0;

            return (
              <motion.section
                key={subject.key + si}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.1 + si * 0.07,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                {/* Subject header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 16,
                    paddingBottom: 12,
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: meta.color,
                        opacity: 0.7,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 11,
                        fontFamily: "var(--font-mono)",
                        color: "rgba(255,255,255,0.35)",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      {subject.name}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontFamily: "var(--font-mono)",
                      color: "rgba(255,255,255,0.2)",
                    }}
                  >
                    {subjectDone}/{subject.topics.length}
                  </span>
                </div>

                {/* Topics */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {subject.topics.map((topic, ti) => {
                    const id = getTopicId(dayNum, topic.code);
                    const done = hydrated
                      ? isCompleted(dayNum, topic.code)
                      : false;

                    return (
                      <div
                        key={topic.code}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          borderBottom: "1px solid rgba(255,255,255,0.04)",
                        }}
                      >
                        <motion.button
                          onClick={() => toggle(id)}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          whileHover={{ x: 2 }}
                          transition={{
                            delay: 0.15 + si * 0.06 + ti * 0.03,
                            type: "spring",
                            stiffness: 600,
                            damping: 40,
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                            padding: "11px 0",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            textAlign: "left",
                            flex: 1,
                            minWidth: 0,
                            transition: "opacity 0.15s",
                          }}
                        >
                          {/* Check */}
                          <div
                            style={{
                              width: 18,
                              height: 18,
                              borderRadius: 5,
                              border: `1px solid ${done ? "rgba(74,222,128,0.5)" : "rgba(255,255,255,0.12)"}`,
                              background: done
                                ? "rgba(74,222,128,0.1)"
                                : "transparent",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              transition: "all 0.2s",
                            }}
                          >
                            <AnimatePresence>
                              {done && (
                                <motion.svg
                                  key="check"
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0, opacity: 0 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 600,
                                    damping: 30,
                                  }}
                                  width="10"
                                  height="10"
                                  viewBox="0 0 10 10"
                                  fill="none"
                                >
                                  <path
                                    d="M1.5 5L4 7.5L8.5 2.5"
                                    stroke="#4ade80"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </motion.svg>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Content */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <span
                              style={{
                                fontSize: 14,
                                fontWeight: 400,
                                color: done
                                  ? "rgba(74,222,128,0.35)"
                                  : "rgba(255,255,255,0.8)",
                                textDecorationLine: done
                                  ? "line-through"
                                  : "none",
                                textDecorationColor: "rgba(74,222,128,0.2)",
                                transition: "all 0.2s",
                              }}
                            >
                              {topic.name}
                            </span>
                          </div>

                          {/* Code */}
                          <span
                            style={{
                              fontSize: 10,
                              fontFamily: "var(--font-mono)",
                              color: "rgba(255,255,255,0.15)",
                              flexShrink: 0,
                              letterSpacing: "0.04em",
                            }}
                          >
                            {topic.code}
                          </span>
                        </motion.button>

                        {/* Practice button — only shows when topic is done */}
                        <AnimatePresence>
                          {done && (
                            <motion.button
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 30,
                              }}
                              onClick={() => {
                                setPracticeTopic({
                                  name: topic.name,
                                  subject: subject.name,
                                });
                                setPracticeOpen(true);
                              }}
                              style={{
                                marginLeft: 10,
                                flexShrink: 0,
                                fontSize: 11,
                                fontFamily: "var(--font-mono)",
                                padding: "4px 10px",
                                borderRadius: 6,
                                border: "1px solid rgba(167,139,250,0.25)",
                                background: "rgba(167,139,250,0.08)",
                                color: "#a78bfa",
                                cursor: "pointer",
                                letterSpacing: "0.03em",
                                transition: "all 0.15s",
                                whiteSpace: "nowrap",
                              }}
                              onMouseEnter={(e) => {
                                (
                                  e.currentTarget as HTMLElement
                                ).style.background = "rgba(167,139,250,0.15)";
                                (
                                  e.currentTarget as HTMLElement
                                ).style.borderColor = "rgba(167,139,250,0.4)";
                              }}
                              onMouseLeave={(e) => {
                                (
                                  e.currentTarget as HTMLElement
                                ).style.background = "rgba(167,139,250,0.08)";
                                (
                                  e.currentTarget as HTMLElement
                                ).style.borderColor = "rgba(167,139,250,0.25)";
                              }}
                            >
                              Practice →
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.section>
            );
          })}
        </div>

        {/* Exams section */}
        {dayData.exams && dayData.exams.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            style={{
              marginTop: 48,
              paddingTop: 24,
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {/* Exams header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "rgba(251,191,36,0.7)",
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Exams on this day
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {dayData.exams.map((exam, ei) => {
                const examId = makeExamId(dayNum, exam);
                const done = hydrated ? isExamCompleted(examId) : false;

                return (
                  <motion.button
                    key={examId}
                    onClick={() => toggleExam(examId)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ x: 2 }}
                    transition={{
                      delay: 0.45 + ei * 0.05,
                      type: "spring",
                      stiffness: 600,
                      damping: 40,
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "11px 0",
                      background: "none",
                      border: "none",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      cursor: "pointer",
                      textAlign: "left",
                      width: "100%",
                      transition: "opacity 0.15s",
                    }}
                  >
                    {/* Check */}
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 5,
                        border: `1px solid ${done ? "rgba(251,191,36,0.5)" : "rgba(255,255,255,0.12)"}`,
                        background: done
                          ? "rgba(251,191,36,0.1)"
                          : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        transition: "all 0.2s",
                      }}
                    >
                      <AnimatePresence>
                        {done && (
                          <motion.svg
                            key="check"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 600,
                              damping: 30,
                            }}
                            width="10"
                            height="10"
                            viewBox="0 0 10 10"
                            fill="none"
                          >
                            <path
                              d="M1.5 5L4 7.5L8.5 2.5"
                              stroke="rgba(251,191,36,0.9)"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </motion.svg>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Exam name */}
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 400,
                        color: done
                          ? "rgba(251,191,36,0.35)"
                          : "rgba(255,255,255,0.8)",
                        textDecorationLine: done ? "line-through" : "none",
                        textDecorationColor: "rgba(251,191,36,0.2)",
                        transition: "all 0.2s",
                      }}
                    >
                      {exam}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Day navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          style={{
            marginTop: 64,
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {prev ? (
            <Link
              href={`/day/${prev}`}
              style={{
                fontSize: 12,
                fontFamily: "var(--font-mono)",
                color: "rgba(255,255,255,0.3)",
                textDecoration: "none",
                transition: "color 0.2s",
                letterSpacing: "0.04em",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.color =
                  "rgba(255,255,255,0.6)")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.color =
                  "rgba(255,255,255,0.3)")
              }
            >
              ← Day {prev}
            </Link>
          ) : (
            <div />
          )}

          <Link
            href="/"
            style={{
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              color: "rgba(255,255,255,0.2)",
              textDecoration: "none",
              letterSpacing: "0.06em",
            }}
          >
            overview
          </Link>

          {next ? (
            <Link
              href={`/day/${next}`}
              style={{
                fontSize: 12,
                fontFamily: "var(--font-mono)",
                color: "rgba(255,255,255,0.3)",
                textDecoration: "none",
                transition: "color 0.2s",
                letterSpacing: "0.04em",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.color =
                  "rgba(255,255,255,0.6)")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.color =
                  "rgba(255,255,255,0.3)")
              }
            >
              Day {next} →
            </Link>
          ) : (
            <div />
          )}
        </motion.div>
      </main>

      {/* Practice Modal */}
      <PracticeModal
        topic={practiceTopic.name}
        subject={practiceTopic.subject}
        isOpen={practiceOpen}
        onClose={() => setPracticeOpen(false)}
      />
    </>
  );
}
