import { type Collection } from "@/types";
import { branchesFields } from "@/features/branches/schema";
import { servicesFields } from "@/features/services/schema";
import { staffFields } from "@/features/staff/schema";
import { customersFields } from "@/features/customers/schema";
import { productsFields } from "@/features/inventory/schema";
import { suppliersFields } from "@/features/suppliers/schema";
import { expensesFields } from "@/features/expenses/schema";
import { membershipsFields } from "@/features/memberships/schema";
export const fields: Partial<Record<Collection, string[]>> = {
  branches: branchesFields,
  services: servicesFields,
  staff: staffFields,
  customers: customersFields,
  products: productsFields,
  suppliers: suppliersFields,
  expenses: expensesFields,
  memberships: membershipsFields,
};
export const numeric = [
  "consumedQuantity",
  "duration",
  "price",
  "discount",
  "commission",
  "salary",
  "start",
  "end",
  "breakStart",
  "breakEnd",
  "off",
  "purchase",
  "quantity",
  "minimum",
  "outstanding",
  "amount",
  "validity",
  "sessions",
];
