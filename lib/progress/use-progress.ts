"use client";

import { useEffect, useState } from "react";
import { useProgressStore } from "@/lib/progress/store";

let hydrationPromise: Promise<void> | null = null;

function ensureHydrated() {
  if (!hydrationPromise) {
    hydrationPromise = Promise.resolve(
      useProgressStore.persist.rehydrate(),
    ).then(() => undefined);
  }

  return hydrationPromise;
}

export function useProgressHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;

    void ensureHydrated()
      .catch(() => undefined)
      .then(() => {
        if (active) {
          setHydrated(true);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return hydrated;
}
