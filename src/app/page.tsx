"use client";

import Link from "next/link";
import { motion } from "motion/react";
import Nav from "@/components/Nav";
import ProgressRing from "@/components/ProgressRing";
import { useProgress } from "@/lib/store";
import { CURRICULUM, SUBJECT_META } from "@/lib/curriculum";

export default function Home() {
  const { hydrated, getDayProgress, getOverallProgress } = useProgress();

  const overall = hydrated
    ? getOverallProgress()
    : { done: 0, total: 0, pct: 0 };

  return (
    <>
      <Nav />
      <main
        style={{ maxWidth: 1080, margin: "0 auto", padding: "48px 24px 96px" }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          style={{ marginBottom: 56 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: 32,
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  color: "#fff",
                  marginBottom: 8,
                }}
              >
                LBS MCA
                <br />
                <span style={{ color: "rgba(255,255,255,0.35)" }}>
                  Preparation
                </span>
              </h1>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 300,
                    fontFamily: "var(--font-mono)",
                    color: "#fff",
                    letterSpacing: "-0.04em",
                  }}
                >
                  {overall.pct}
                  <span
                    style={{ fontSize: 14, color: "rgba(255,255,255,0.3)" }}
                  >
                    %
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.3)",
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {overall.done}/{overall.total} topics
                </div>
              </div>
              <ProgressRing
                pct={overall.pct}
                size={52}
                stroke={2}
                color="rgba(255,255,255,0.85)"
              />
            </div>
          </div>

          {/* Thin progress bar */}
          <div
            style={{
              marginTop: 24,
              height: 2,
              background: "rgba(255,255,255,0.08)",
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overall.pct}%` }}
              transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
              style={{
                height: "100%",
                background: "rgba(255,255,255,0.9)",
                borderRadius: 1,
              }}
            />
          </div>
        </motion.div>

        {/* Days grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 1,
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          {CURRICULUM.map((d, i) => {
            const prog = hydrated
              ? getDayProgress(d.day)
              : { done: 0, total: 0, pct: 0 };
            const isDone = prog.done === prog.total && prog.total > 0;
            const subjectKeys = [...new Set(d.subjects.map((s) => s.key))];

            return (
              <motion.div
                key={d.day}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
              >
                <Link
                  href={`/day/${d.day}`}
                  style={{ textDecoration: "none", display: "block" }}
                >
                  <div
                    style={{
                      padding: "20px 20px 18px",
                      background: isDone
                        ? "rgba(74,222,128,0.08)"
                        : "transparent",
                      borderRight: "1px solid rgba(255,255,255,0.1)",
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                      cursor: "pointer",
                      transition: "background 0.2s",
                      minHeight: 130,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.background =
                        isDone
                          ? "rgba(74,222,128,0.14)"
                          : "rgba(255,255,255,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.background =
                        isDone ? "rgba(74,222,128,0.06)" : "transparent";
                    }}
                  >
                    {/* Top row */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          fontFamily: "var(--font-mono)",
                          color: "rgba(255,255,255,0.3)",
                          letterSpacing: "0.08em",
                        }}
                      >
                        {String(d.day).padStart(2, "0")}
                      </span>
                      <ProgressRing
                        pct={prog.pct}
                        size={28}
                        stroke={2}
                        color={isDone ? "#4ade80" : "rgba(255,255,255,0.5)"}
                      />
                    </div>

                    {/* Bottom */}
                    <div>
                      {/* Subject dots */}
                      <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                        {subjectKeys.map((key) => (
                          <div
                            key={key}
                            title={SUBJECT_META[key].label}
                            style={{
                              width: 5,
                              height: 5,
                              borderRadius: "50%",
                              background: SUBJECT_META[key].color,
                              opacity: 0.8,
                            }}
                          />
                        ))}
                      </div>

                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 400,
                          color: isDone ? "#4ade80" : "rgba(255,255,255)",
                          marginBottom: 2,
                        }}
                      >
                        {prog.total} topic{prog.total !== 1 ? "s" : ""}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "rgba(255,255,255,0.3)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {prog.done} done
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Subject legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          style={{ marginTop: 24, display: "flex", gap: 20, flexWrap: "wrap" }}
        >
          {Object.entries(SUBJECT_META).map(([key, meta]) => (
            <div
              key={key}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <div
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: meta.color,
                  opacity: 0.6,
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {meta.label}
              </span>
            </div>
          ))}
        </motion.div>
      </main>
    </>
  );
}
