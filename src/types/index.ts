export type Role = "admin" | "receptionist" | "staff" | "customer";
export type RecordData = {
  id: string;
  name: string;
  branch: string;
  [key: string]: string | number;
};

import type { seed } from "@/data/seed";
export type Database = ReturnType<typeof seed>;
export type Collection = keyof Database;
