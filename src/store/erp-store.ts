import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  seed,
  type Database,
  type Collection,
  type RecordData,
  type Role,
  today,
} from "@/lib/data";
type Store = {
  db: Database;
  bookingService: string | null;
  startBooking: (service?: string) => void;
  clearBooking: () => void;
  transact: (fn: (db: Database) => Database) => void;
  role: Role | null;
  theme: "dark" | "light";
  branch: string;
  login: (r: Role) => void;
  logout: () => void;
  toggle: () => void;
  setBranch: (b: string) => void;
  save: (c: Collection, r: RecordData) => void;
  remove: (c: Collection, id: string) => void;
  notify: (message: string) => void;
  reset: () => void;
};
export const useERP = create<Store>()(
  persist(
    (set) => ({
      db: seed(),
      bookingService: null,
      startBooking: (service = "s0") => set({ bookingService: service }),
      clearBooking: () => set({ bookingService: null }),
      transact: (fn) => set((s) => ({ db: fn(s.db) })),
      role: null,
      theme: "dark",
      branch: "all",
      login: (role) => set({ role, branch: "all", bookingService: null }),
      logout: () => set({ role: null }),
      toggle: () =>
        set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
      setBranch: (branch) => set({ branch }),
      save: (c, r) =>
        set((s) => ({
          db: {
            ...s.db,
            [c]: s.db[c].some((x) => x.id === r.id)
              ? s.db[c].map((x) => (x.id === r.id ? r : x))
              : [r, ...s.db[c]],
          },
        })),
      remove: (c, id) =>
        set((s) => ({
          db: { ...s.db, [c]: s.db[c].filter((x) => x.id !== id) },
        })),
      notify: (name) =>
        set((s) => ({
          db: {
            ...s.db,
            notifications: [
              {
                id: crypto.randomUUID(),
                name,
                branch: "all",
                date: today(),
                read: "no",
              },
              ...s.db.notifications,
            ],
          },
        })),
      reset: () => set({ db: seed() }),
    }),
    {
      name: "maison-salon-erp-v1",
      partialize: ({ db, role, theme, branch }) => ({
        db,
        role,
        theme,
        branch,
      }),
      merge: (stored, current) => {
        const old = stored as Partial<Store>;
        return { ...current, ...old, db: { ...current.db, ...old.db } };
      },
    },
  ),
);
