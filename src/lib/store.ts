"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CURRICULUM } from "./curriculum";

interface ProgressStore {
  hydrated: boolean;
  setHydrated: (value: boolean) => void;

  completed: Record<string, boolean>;
  toggle: (id: string) => void;
  reset: () => void;

  completedExams: Record<string, boolean>;
  toggleExam: (id: string) => void;
  isExamCompleted: (id: string) => boolean;

  getTopicId: (day: number, code: string) => string;
  isCompleted: (day: number, code: string) => boolean;
  getDayProgress: (day: number) => { done: number; total: number; pct: number };
  getSubjectProgress: (key: string) => {
    done: number;
    total: number;
    pct: number;
  };
  getOverallProgress: () => { done: number; total: number; pct: number };
}

function makeId(day: number, code: string) {
  return `d${day}_${code.replace(/\s+/g, "_")}`;
}

function makeExamId(day: number, exam: string) {
  return `exam_d${day}_${exam.replace(/\s+/g, "_")}`;
}

export { makeExamId };

export const useProgress = create<ProgressStore>()(
  persist(
    (set, get) => ({
      hydrated: false,

      setHydrated(value) {
        set({ hydrated: value });
      },

      completed: {},

      toggle(id) {
        set((s) => ({
          completed: { ...s.completed, [id]: !s.completed[id] },
        }));
      },

      reset() {
        set({ completed: {}, completedExams: {} });
      },

      completedExams: {},

      toggleExam(id) {
        set((s) => ({
          completedExams: { ...s.completedExams, [id]: !s.completedExams[id] },
        }));
      },

      isExamCompleted(id) {
        return !!get().completedExams[id];
      },

      getTopicId(day, code) {
        return makeId(day, code);
      },

      isCompleted(day, code) {
        return !!get().completed[makeId(day, code)];
      },

      getDayProgress(day) {
        const dayData = CURRICULUM.find((d) => d.day === day);
        if (!dayData) return { done: 0, total: 0, pct: 0 };

        let total = 0;
        let done = 0;

        dayData.subjects.forEach((s) =>
          s.topics.forEach((t) => {
            total++;
            if (get().isCompleted(day, t.code)) done++;
          }),
        );

        return {
          done,
          total,
          pct: total ? Math.round((done / total) * 100) : 0,
        };
      },

      getSubjectProgress(key) {
        let total = 0;
        let done = 0;

        CURRICULUM.forEach((d) =>
          d.subjects
            .filter((s) => s.key === key)
            .forEach((s) =>
              s.topics.forEach((t) => {
                total++;
                if (get().isCompleted(d.day, t.code)) done++;
              }),
            ),
        );

        return {
          done,
          total,
          pct: total ? Math.round((done / total) * 100) : 0,
        };
      },

      getOverallProgress() {
        let total = 0;
        let done = 0;

        CURRICULUM.forEach((d) =>
          d.subjects.forEach((s) =>
            s.topics.forEach((t) => {
              total++;
              if (get().isCompleted(d.day, t.code)) done++;
            }),
          ),
        );

        return {
          done,
          total,
          pct: total ? Math.round((done / total) * 100) : 0,
        };
      },
    }),
    {
      name: "lbs-tracker-progress",
      version: 1,
      onRehydrateStorage: () => {
        return (state) => {
          state?.setHydrated(true);
        };
      },
    },
  ),
);
