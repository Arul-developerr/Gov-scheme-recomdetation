import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { blankProfile, demoProfile, schemes, type Profile } from "./data";
export type Notice = {
  id: string;
  title: string;
  description: string;
  path: string;
  kind: "Profile" | "Saved" | "Guidance" | "System";
  read: boolean;
  date: string;
};
export type Ticket = {
  id: string;
  subject: string;
  message: string;
  created: string;
};
type Store = {
  profile: Profile;
  session: boolean;
  verified: boolean;
  completed: number[];
  saved: string[];
  compare: string[];
  documents: Record<string, string[]>;
  notifications: Notice[];
  settings: Record<string, boolean>;
  tickets: Ticket[];
};
const STORAGE_KEY = "saharasetu:prototype:v1";
const initial: Store = {
  profile: { ...blankProfile },
  session: false,
  verified: false,
  completed: [],
  saved: [],
  compare: [],
  documents: {},
  notifications: [
    {
      id: "welcome",
      title: "Welcome to the SaharaSetu prototype",
      description:
        "Explore the experience with fictional schemes. No government application has been submitted.",
      path: "/dashboard",
      kind: "System",
      read: false,
      date: "Prototype welcome",
    },
    {
      id: "profile",
      title: "Make your profile work for you",
      description:
        "Add your details to explore how profile-based matching works.",
      path: "/onboarding/personal",
      kind: "Profile",
      read: false,
      date: "Getting started",
    },
  ],
  settings: {
    newSchemes: true,
    guidance: true,
    recommendations: true,
    marketing: false,
  },
  tickets: [],
};
function load(): Store {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!raw || typeof raw !== "object") return initial;
    const profile = { ...blankProfile };
    for (const key of Object.keys(profile) as (keyof Profile)[]) {
      const v = raw.profile?.[key];
      if (Array.isArray(profile[key]) && Array.isArray(v))
        Object.assign(profile, {
          [key]: v.filter((x: unknown) => typeof x === "string"),
        });
      else if (typeof v === typeof profile[key])
        Object.assign(profile, { [key]: v });
    }
    const ids = new Set(schemes.map((s) => s.id));
    const arr = (v: unknown) =>
      Array.isArray(v)
        ? v.filter(
            (x: unknown): x is string => typeof x === "string" && ids.has(x),
          )
        : [];
    return {
      ...initial,
      profile,
      session: raw.session === true,
      verified: raw.verified === true,
      completed: Array.isArray(raw.completed)
        ? raw.completed.filter(
            (n: unknown) => typeof n === "number" && n >= 0 && n <= 6,
          )
        : [],
      saved: arr(raw.saved),
      compare: arr(raw.compare).slice(0, 3),
      documents:
        raw.documents && typeof raw.documents === "object"
          ? Object.fromEntries(
              Object.entries(raw.documents)
                .filter(([id]) => ids.has(id))
                .map(([id, docs]) => [
                  id,
                  Array.isArray(docs)
                    ? docs.filter((d) => typeof d === "string")
                    : [],
                ]),
            )
          : {},
      notifications: Array.isArray(raw.notifications)
        ? raw.notifications.filter(
            (n: Notice) =>
              n &&
              typeof n.id === "string" &&
              typeof n.title === "string" &&
              typeof n.path === "string" &&
              n.path.startsWith("/"),
          )
        : initial.notifications,
      settings: {
        ...initial.settings,
        ...(Object.fromEntries(
          Object.entries(raw.settings || {}).filter(
            ([, v]) => typeof v === "boolean",
          ),
        ) as Record<string, boolean>),
      },
      tickets: Array.isArray(raw.tickets)
        ? raw.tickets.filter(
            (t: Ticket) =>
              t &&
              typeof t.subject === "string" &&
              typeof t.message === "string",
          )
        : [],
    };
  } catch {
    return initial;
  }
}
type ContextValue = {
  store: Store;
  update: (fn: (s: Store) => Store) => void;
  updateProfile: (p: Partial<Profile>) => void;
  toggleSaved: (id: string) => void;
  toggleCompare: (id: string) => void;
  notify: (message: string) => void;
  loadDemo: () => void;
  clear: () => void;
};
const Context = createContext<ContextValue | null>(null);
export function PrototypeProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<Store>(load);
  const [toast, setToast] = useState("");
  const [storageWarning, setStorageWarning] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
      setStorageWarning(false);
    } catch {
      setStorageWarning(true);
    }
  }, [store]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 4200);
    return () => clearTimeout(timer);
  }, [toast]);
  const notify = (m: string) => setToast(m);
  const update = (fn: (s: Store) => Store) => setStore((s) => fn(s));
  const updateProfile = (p: Partial<Profile>) =>
    update((s) => ({ ...s, profile: { ...s.profile, ...p } }));
  const toggleSaved = (id: string) => {
    if (!schemes.some((s) => s.id === id)) return;
    const exists = store.saved.includes(id);
    update((s) => ({
      ...s,
      saved: exists ? s.saved.filter((x) => x !== id) : [...s.saved, id],
    }));
    notify(
      exists
        ? "Scheme removed from saved items."
        : "Demonstration scheme saved in this browser.",
    );
  };
  const toggleCompare = (id: string) => {
    if (store.compare.includes(id)) {
      update((s) => ({ ...s, compare: s.compare.filter((x) => x !== id) }));
      return;
    }
    if (store.compare.length >= 3) {
      notify("You can compare up to three schemes. Remove one to add another.");
      return;
    }
    update((s) => ({ ...s, compare: [...s.compare, id] }));
    notify("Added to comparison.");
  };
  return (
    <Context.Provider
      value={{
        store,
        update,
        updateProfile,
        toggleSaved,
        toggleCompare,
        notify,
        loadDemo: () => {
          setStore({
            ...initial,
            profile: { ...demoProfile },
            session: true,
            verified: true,
            completed: [0, 1, 2, 3, 4, 5, 6],
          });
          notify("Sample profile loaded. All information is fictional.");
        },
        clear: () => {
          setStore({ ...initial, profile: { ...blankProfile } });
          notify("Prototype data cleared from this browser.");
        },
      }}
    >
      {children}
      <div
        className="ss-toast"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {toast}
      </div>
      {storageWarning && (
        <div className="ss-storage-warning" role="alert">
          Browser storage is unavailable. Changes are kept only for this
          session.
        </div>
      )}
    </Context.Provider>
  );
}
export function usePrototype() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("PrototypeProvider is required");
  return ctx;
}
