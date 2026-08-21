import { useCallback, useEffect, useState } from "react";

export type ToolKey = "email" | "meetings" | "tasks" | "research" | "chat";

export type ActivityItem = {
  id: string;
  tool: ToolKey;
  title: string;
  at: number;
  demo?: boolean;
  excerpt: string;
};

export type Preferences = {
  name: string;
  defaultTone: "Formal" | "Friendly" | "Persuasive";
  outputLength: "Concise" | "Balanced" | "Detailed";
  showDemoData: boolean;
  askClarifying: boolean;
};

export const DEFAULT_PREFERENCES: Preferences = {
  name: "Tulisile Mqikela",
  defaultTone: "Formal",
  outputLength: "Balanced",
  showDemoData: true,
  askClarifying: true,
};

const PREF_KEY = "awpa.preferences";
const ACTIVITY_KEY = "awpa.activity";

export const DEMO_ACTIVITY: ActivityItem[] = [
  {
    id: "demo-1",
    tool: "meetings",
    title: "Q3 Roadmap Sync — summary",
    at: Date.now() - 1000 * 60 * 42,
    demo: true,
    excerpt: "5 decisions captured, 4 action items, 2 open questions.",
  },
  {
    id: "demo-2",
    tool: "email",
    title: "Vendor renewal follow-up",
    at: Date.now() - 1000 * 60 * 60 * 5,
    demo: true,
    excerpt: "Formal tone · 132 words · subject drafted.",
  },
  {
    id: "demo-3",
    tool: "tasks",
    title: "Week plan — product launch",
    at: Date.now() - 1000 * 60 * 60 * 26,
    demo: true,
    excerpt: "9 tasks prioritised across 4 working days.",
  },
];

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? ({ ...fallback, ...JSON.parse(raw) } as T) : fallback;
  } catch {
    return fallback;
  }
}

export function usePreferences() {
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFERENCES);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setPrefs(read(PREF_KEY, DEFAULT_PREFERENCES));
    setHydrated(true);
  }, []);

  const update = useCallback((patch: Partial<Preferences>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      try {
        window.localStorage.setItem(PREF_KEY, JSON.stringify(next));
      } catch {
        /* storage unavailable */
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(PREF_KEY);
      window.localStorage.removeItem(ACTIVITY_KEY);
    } catch {
      /* storage unavailable */
    }
    setPrefs(DEFAULT_PREFERENCES);
    window.dispatchEvent(new Event("awpa:activity"));
  }, []);

  return { prefs, update, reset, hydrated };
}

function readActivity(): ActivityItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ACTIVITY_KEY);
    return raw ? (JSON.parse(raw) as ActivityItem[]) : [];
  } catch {
    return [];
  }
}

export function logActivity(item: Omit<ActivityItem, "id" | "at">) {
  if (typeof window === "undefined") return;
  const next = [{ ...item, id: crypto.randomUUID(), at: Date.now() }, ...readActivity()].slice(0, 12);
  try {
    window.localStorage.setItem(ACTIVITY_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable */
  }
  window.dispatchEvent(new Event("awpa:activity"));
}

export function useActivity() {
  const [items, setItems] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(readActivity());
    sync();
    window.addEventListener("awpa:activity", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("awpa:activity", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const clear = useCallback(() => {
    try {
      window.localStorage.removeItem(ACTIVITY_KEY);
    } catch {
      /* storage unavailable */
    }
    window.dispatchEvent(new Event("awpa:activity"));
  }, []);

  return { items, clear };
}

export function timeAgo(ts: number) {
  const diff = Math.max(1, Math.round((Date.now() - ts) / 60000));
  if (diff < 60) return `${diff} min ago`;
  const hours = Math.round(diff / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.round(hours / 24)} d ago`;
}
