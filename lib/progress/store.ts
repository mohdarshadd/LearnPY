"use client";

import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from "zustand/middleware";

type ProgressState = {
  completedLessonIds: string[];
  lastLessonId: string | null;
  lastVisitedAt: string | null;
  markComplete: (lessonId: string) => void;
  markIncomplete: (lessonId: string) => void;
  visitLesson: (lessonId: string) => void;
  resetProgress: () => void;
};

const initialState = {
  completedLessonIds: [] as string[],
  lastLessonId: null,
  lastVisitedAt: null,
};

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      ...initialState,
      markComplete: (lessonId) =>
        set((state) => ({
          completedLessonIds: state.completedLessonIds.includes(lessonId)
            ? state.completedLessonIds
            : [...state.completedLessonIds, lessonId],
        })),
      markIncomplete: (lessonId) =>
        set((state) => ({
          completedLessonIds: state.completedLessonIds.filter(
            (id) => id !== lessonId,
          ),
        })),
      visitLesson: (lessonId) =>
        set({
          lastLessonId: lessonId,
          lastVisitedAt: new Date().toISOString(),
        }),
      resetProgress: () => set({ ...initialState }),
    }),
    {
      name: "learnpy-progress",
      version: 1,
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? noopStorage : window.localStorage,
      ),
      partialize: (state) => ({
        completedLessonIds: state.completedLessonIds,
        lastLessonId: state.lastLessonId,
        lastVisitedAt: state.lastVisitedAt,
      }),
      skipHydration: true,
    },
  ),
);
