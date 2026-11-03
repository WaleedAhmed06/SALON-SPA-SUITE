import { type Database, today } from "@/lib/data";
export function purchaseMembership(
  db: Database,
  planId: string,
  customerId: string,
  method: string,
  renewalId?: string,
): Database {
  const plan = db.memberships.find(
    (m) => m.id === planId && m.status === "Active",
  );
  const customer = db.customers.find((c) => c.id === customerId);
  if (!plan || !customer)
    throw Error("Select an active plan and a valid customer.");
  const next = structuredClone(db);
  const old = renewalId
    ? next.enrollments.find(
        (e) => e.id === renewalId && e.customer === customerId,
      )
    : undefined;
  if (renewalId && !old) throw Error("Membership not found.");
  const expires = new Date();
  if (old && String(old.expires) > today())
    expires.setTime(new Date(String(old.expires) + "T12:00:00").getTime());
  expires.setDate(expires.getDate() + Number(plan.validity));
  const enrollment = {
    id: old?.id || crypto.randomUUID(),
    name: plan.name,
    customer: customerId,
    plan: planId,
    branch: customer.branch,
    remaining: Number(old?.remaining || 0) + Number(plan.sessions),
    expires: expires.toLocaleDateString("en-CA"),
    status: "Active",
  };
  next.enrollments = [
    enrollment,
    ...next.enrollments.filter((e) => e.id !== enrollment.id),
  ];
  next.payments.unshift({
    id: crypto.randomUUID(),
    name: "MEM-" + Date.now(),
    branch: customer.branch,
    customer: customerId,
    amount: plan.price,
    total: plan.price,
    date: today(),
    method,
    status: "Paid",
    transaction: "DEMO-" + crypto.randomUUID().slice(0, 8),
  });
  return next;
}
