import { type Database, type RecordData, today } from "@/lib/data";
import { type SaleLine } from "./types";
export function paymentTotals(
  lines: { price: number; quantity: number }[],
  discount: number,
  tax: number,
) {
  const subtotal = lines.reduce((n, l) => n + l.price * l.quantity, 0);
  const reduced = Math.max(0, subtotal - Math.min(subtotal, discount));
  return {
    subtotal,
    discount: Math.min(subtotal, discount),
    tax: (reduced * tax) / 100,
    total: Math.round(reduced * (1 + tax / 100)),
  };
}
import { completeAppointment } from "@/features/appointments/actions";
export function settleSale(
  db: Database,
  invoice: RecordData,
  lines: SaleLine[],
  amount: number,
  method: string,
  redeemed = 0,
): Database {
  if (!lines.length) throw Error("Add a service or product.");
  const previous = db.payments.find((p) => p.id === invoice.id);
  if (previous && Number(previous.amount) > 0)
    throw Error("Invoice has already been processed.");
  if (!Number.isFinite(amount) || amount <= 0 || amount > Number(invoice.total))
    throw Error("Invalid payment amount.");
  for (const line of lines) {
    if (line.quantity < 1 || !Number.isInteger(line.quantity))
      throw Error("Quantity must be a positive integer.");
    if (
      line.type === "product" &&
      Number(db.products.find((p) => p.id === line.id)?.quantity || 0) <
        line.quantity
    )
      throw Error("Insufficient stock: " + line.name);
  }
  const booking = db.appointments.find((a) => a.id === invoice.appointment);
  if (booking?.payment === "Paid") throw Error("Appointment is already paid.");
  let next = structuredClone(db);
  const pending = next.appointments.find((a) => a.id === invoice.appointment);
  if (pending && pending.status !== "Completed") {
    pending.status = "In Progress";
    next = completeAppointment(next, pending.id);
  }
  const payment = {
    ...invoice,
    amount,
    method,
    status: amount >= Number(invoice.total) ? "Paid" : "Partial",
    transaction: "DEMO-" + crypto.randomUUID().slice(0, 8),
  };
  next.payments = [
    payment,
    ...next.payments.filter((p) => p.id !== invoice.id),
  ];
  for (const line of lines.filter((l) => l.type === "product")) {
    const p = next.products.find((p) => p.id === line.id)!;
    if (Number(p.quantity) < line.quantity)
      throw Error("Insufficient stock after treatment consumption.");
    p.quantity = Number(p.quantity) - line.quantity;
    next.stock.unshift({
      id: crypto.randomUUID(),
      name: "Product Sale",
      product: p.id,
      quantity: -line.quantity,
      branch: p.branch,
      date: today(),
      invoice: invoice.id,
    });
  }
  const a = next.appointments.find((a) => a.id === invoice.appointment);
  if (a) {
    a.payment = payment.status;
    a.status = "Completed";
  }
  const customer = next.customers.find((c) => c.id === invoice.customer);
  if (customer)
    customer.points =
      Math.max(0, Number(customer.points || 0) - redeemed) +
      Math.floor(amount / 1000) * 10;
  next.loyalty.unshift({
    id: crypto.randomUUID(),
    name: "Payment rewards",
    branch: invoice.branch,
    customer: invoice.customer,
    date: today(),
    points: Math.floor(amount / 1000) * 10 - redeemed,
    invoice: invoice.id,
  });
  return next;
}
