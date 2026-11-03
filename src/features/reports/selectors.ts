import { type Database, type RecordData, today } from "@/lib/data";
import { commission } from "@/features/commissions/selectors";
export const reportNames = [
  "Daily Revenue",
  "Weekly Revenue",
  "Monthly Revenue",
  "Appointments",
  "Cancelled Appointments",
  "No-Show",
  "Customer Growth",
  "Staff Performance",
  "Staff Commission",
  "Service Popularity",
  "Product Sales",
  "Inventory",
  "Expenses",
  "Profit & Loss",
  "Branch Performance",
];
export function reportRows(
  db: Database,
  kind: string,
  branch = "all",
  from = "",
  to = "",
  staff = "",
): RecordData[] {
  const inRange = (r: RecordData) => {
    const date = String(r.date || r.registered || today());
    return (
      (branch === "all" || r.branch === branch || r.branch === "all") &&
      (!from || date >= from) &&
      (!to || date <= to) &&
      (!staff ||
        r.staff === staff ||
        r.id === staff ||
        db.appointments.some(
          (a) => a.id === r.appointment && a.staff === staff,
        ))
    );
  };
  const payments = db.payments.filter(inRange);
  const apps = db.appointments.filter(inRange);
  const expenses = db.expenses.filter(inRange);
  const group = (
    rows: RecordData[],
    key: (r: RecordData) => string,
    amount: string,
  ) =>
    Object.entries(Object.groupBy(rows, key)).map(([name, items]) => ({
      id: name,
      name,
      branch,
      records: items!.length,
      total: items!.reduce((n, p) => n + Number(p[amount] || 0), 0),
    }));
  if (kind.includes("Revenue"))
    return group(
      payments,
      (p) => {
        const d = String(p.date);
        if (kind === "Monthly Revenue") return d.slice(0, 7);
        if (kind === "Weekly Revenue") {
          const dt = new Date(d + "T12:00:00");
          dt.setDate(dt.getDate() - ((dt.getDay() + 6) % 7));
          return dt.toLocaleDateString("en-CA");
        }
        return d;
      },
      "amount",
    ).sort((a, b) => a.name.localeCompare(b.name));
  if (kind === "Appointments") return apps;
  if (kind === "Cancelled Appointments")
    return apps.filter((a) => a.status === "Cancelled");
  if (kind === "No-Show") return apps.filter((a) => a.status === "No Show");
  if (kind === "Customer Growth")
    return group(
      db.customers.filter(inRange),
      (c) => String(c.registered).slice(0, 7),
      "points",
    ).map((r) => ({ ...r, total: r.records }));
  if (kind === "Staff Performance" || kind === "Staff Commission")
    return db.staff
      .filter(
        (s) =>
          (branch === "all" || s.branch === branch) &&
          (!staff || s.id === staff),
      )
      .map((s) => {
        const assigned = apps.filter((a) => a.staff === s.id);
        return {
          id: s.id,
          name: s.name,
          branch: s.branch,
          appointments: assigned.length,
          completed: assigned.filter((a) => a.status === "Completed").length,
          earned: commission(db, s.id)
            .filter(inRange)
            .reduce((n, a) => n + a.earned, 0),
          paid: commission(db, s.id)
            .filter((a) => inRange(a) && a.commissionPaid === "yes")
            .reduce((n, a) => n + a.earned, 0),
        };
      });
  if (kind === "Service Popularity")
    return db.services
      .map((s) => ({
        id: s.id,
        name: s.name,
        branch,
        bookings: apps.filter((a) => a.service === s.id).length,
        revenue:
          apps.filter((a) => a.service === s.id && a.payment === "Paid")
            .length * Number(s.price),
      }))
      .sort((a, b) => b.bookings - a.bookings);
  if (kind === "Product Sales")
    return db.stock
      .filter((r) => r.name === "Product Sale" && inRange(r))
      .map((r) => ({
        ...r,
        name:
          db.products.find((p) => p.id === r.product)?.name ||
          "Deleted product",
        sold: -Number(r.quantity),
        revenue:
          -Number(r.quantity) *
          Number(db.products.find((p) => p.id === r.product)?.price || 0),
      }));
  if (kind === "Inventory")
    return db.products.filter(inRange).map((p) => ({
      id: p.id,
      name: p.name,
      branch: p.branch,
      sku: p.sku,
      quantity: p.quantity,
      minimum: p.minimum,
      value: Number(p.quantity) * Number(p.purchase),
      status:
        Number(p.quantity) < Number(p.minimum) ? "Low Stock" : "Available",
    }));
  if (kind === "Expenses") return expenses;
  if (kind === "Profit & Loss") {
    const revenue = payments.reduce((n, p) => n + Number(p.amount), 0),
      cost = expenses.reduce((n, p) => n + Number(p.amount), 0);
    return [
      { id: "revenue", name: "Collected revenue", branch, total: revenue },
      { id: "expense", name: "Recorded expenses", branch, total: cost },
      {
        id: "profit",
        name: "Profit before other costs",
        branch,
        total: revenue - cost,
      },
    ];
  }
  if (kind === "Branch Performance")
    return db.branches
      .filter((b) => branch === "all" || b.id === branch)
      .map((b) => ({
        id: b.id,
        name: b.name,
        branch: b.id,
        revenue: payments
          .filter((p) => p.branch === b.id)
          .reduce((n, p) => n + Number(p.amount), 0),
        appointments: apps.filter((a) => a.branch === b.id).length,
        customers: db.customers.filter((c) => c.branch === b.id).length,
        expenses: expenses
          .filter((e) => e.branch === b.id)
          .reduce((n, p) => n + Number(p.amount), 0),
      }));
  return payments;
}
