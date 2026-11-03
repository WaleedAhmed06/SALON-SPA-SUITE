import { type Database, today } from "@/lib/data";
export function payAppointment(
  db: Database,
  id: string,
  method: string,
): Database {
  const next = structuredClone(db);
  const a = next.appointments.find((a) => a.id === id);
  if (!a || ["Cancelled", "No Show"].includes(String(a.status)))
    throw Error("This booking cannot be paid.");
  if (a.payment === "Paid") throw Error("Appointment is already paid.");
  const invoice = next.payments.find(
    (p) => p.appointment === id && p.status !== "Paid",
  );
  const total = Number(
    invoice?.total || next.services.find((s) => s.id === a.service)?.price || 0,
  );
  const payment = {
    ...invoice,
    id: invoice?.id || crypto.randomUUID(),
    name: invoice?.name || "INV-" + Date.now(),
    branch: a.branch,
    customer: a.customer,
    appointment: id,
    amount: total,
    total,
    date: today(),
    method,
    status: "Paid",
    transaction: "DEMO-" + crypto.randomUUID().slice(0, 8),
  };
  next.payments = [
    payment,
    ...next.payments.filter((p) => p.id !== payment.id),
  ];
  a.payment = "Paid";
  const customer = next.customers.find((c) => c.id === a.customer)!;
  const points =
    (Math.floor(total / 1000) -
      Math.floor(Number(invoice?.amount || 0) / 1000)) *
    10;
  customer.points = Number(customer.points || 0) + points;
  next.loyalty.unshift({
    id: crypto.randomUUID(),
    name: "Payment rewards",
    branch: a.branch,
    customer: a.customer,
    date: today(),
    points,
  });
  return next;
}

export function collectBalance(db: Database, invoiceId: string): Database {
  const next = structuredClone(db);
  const invoice = next.payments.find((p) => p.id === invoiceId);
  if (!invoice) throw Error("Invoice not found.");
  const delta = Number(invoice.total) - Number(invoice.amount);
  if (delta <= 0) throw Error("Invoice is already paid.");
  const points =
    (Math.floor(Number(invoice.total) / 1000) -
      Math.floor(Number(invoice.amount) / 1000)) *
    10;
  invoice.amount = invoice.total;
  invoice.status = "Paid";
  const a = next.appointments.find((a) => a.id === invoice.appointment);
  if (a) a.payment = "Paid";
  const customer = next.customers.find((c) => c.id === invoice.customer);
  if (customer) customer.points = Number(customer.points || 0) + points;
  next.loyalty.unshift({
    id: crypto.randomUUID(),
    name: "Balance payment rewards",
    branch: invoice.branch,
    customer: invoice.customer,
    points,
    date: today(),
    invoice: invoiceId,
  });
  return next;
}
