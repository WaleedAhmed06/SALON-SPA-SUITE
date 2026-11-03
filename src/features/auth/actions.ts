import { type Role } from "@/types";
export const demoAccounts: Record<string, Role> = {
  "admin@salondemo.com": "admin",
  "reception@salondemo.com": "receptionist",
  "staff@salondemo.com": "staff",
  "customer@salondemo.com": "customer",
};
export function authenticateDemo(email: string, password: string): Role {
  const role = demoAccounts[email.trim().toLowerCase()];
  if (!role || password !== "123456")
    throw Error("Use one of the demo accounts and password 123456.");
  return role;
}
