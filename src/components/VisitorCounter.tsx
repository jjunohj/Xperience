"use client";

import { useEffect, useState } from "react";

type Counts = { total: number; today: number };

const SESSION_KEY = "xp_visit_counted";

export default function VisitorCounter() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const alreadyCounted = sessionStorage.getItem(SESSION_KEY) === "1";

    if (!alreadyCounted) sessionStorage.setItem(SESSION_KEY, "1");

    const controller = new AbortController();

    fetch("/api/visit", { method: alreadyCounted ? "GET" : "POST", signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error("visit api failed");
        return r.json() as Promise<Counts>;
      })
      .then(setCounts)
      .catch((err) => {
        if (err.name === "AbortError") return;
        setFailed(true);
        if (!alreadyCounted) sessionStorage.removeItem(SESSION_KEY);
      });

    return () => controller.abort();
  }, []);

  if (failed) return null;

  const today = counts?.today.toLocaleString() ?? "—";
  const total = counts?.total.toLocaleString() ?? "—";

  return (
    <p className="text-xs text-neutral-500 dark:text-neutral-500">
      <span>Today {today}</span>
      <span className="mx-2">·</span>
      <span>Total {total}</span>
    </p>
  );
}
