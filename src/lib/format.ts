import { type Role } from "@/types";
export const today = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Karachi" });
export const money = (n: number) =>
  "Rs. " + Math.round(n).toLocaleString("en-PK");
export const roles: Role[] = ["admin", "receptionist", "staff", "customer"];
export const roleLabels: Record<Role, string> = {
  admin: "Salon Owner",
  receptionist: "Front Desk",
  staff: "Therapist",
  customer: "Customer",
};
