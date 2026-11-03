import { type Database, type RecordData, today } from "@/lib/data";
import { minutes, timeString } from "@/lib/time";
export function slots(
  db: Database,
  staffId: string,
  serviceId: string,
  date: string,
  exclude = "",
) {
  const staff = db.staff.find((x) => x.id === staffId),
    service = db.services.find((x) => x.id === serviceId);
  if (
    !staff ||
    !service ||
    staff.status !== "Active" ||
    service.status !== "Active"
  )
    return [];
  if (new Date(date + "T12:00:00").getDay() === Number(staff.off)) return [];
  if (
    db.leaves.some(
      (l) =>
        l.staff === staffId &&
        l.status === "Approved" &&
        date >= String(l.date) &&
        date <= String(l.endDate),
    )
  )
    return [];
  const branch = db.branches.find((b) => b.id === staff.branch);
  if (
    !branch ||
    branch.status !== "Active" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date)
  )
    return [];
  const hours = String(branch.hours || "09:00–20:00").match(
    /(\d{1,2}:\d{2})\s*[-–—]\s*(\d{1,2}:\d{2})/,
  );
  const open = hours ? minutes(hours[1]) : 9 * 60,
    close = hours ? minutes(hours[2]) : 20 * 60;
  const result: string[] = [];
  const duration = Number(service.duration);
  if (!Number.isFinite(duration) || duration < 15) return [];
  for (
    let t = Math.max(Number(staff.start) * 60, open);
    t + duration <= Math.min(Number(staff.end) * 60, close);
    t += 15
  ) {
    if (
      t < Number(staff.breakEnd) * 60 &&
      t + duration > Number(staff.breakStart) * 60
    )
      continue;
    if (
      date === today() &&
      t < new Date().getHours() * 60 + new Date().getMinutes()
    )
      continue;
    const conflict = db.appointments.some(
      (a) =>
        a.id !== exclude &&
        a.staff === staffId &&
        a.date === date &&
        !["Cancelled", "No Show"].includes(String(a.status)) &&
        t <
          minutes(String(a.time)) +
            Number(
              db.services.find((s) => s.id === a.service)?.duration || 30,
            ) &&
        t + duration > minutes(String(a.time)),
    );
    if (!conflict) result.push(timeString(t));
  }
  return result;
}
export function validateBooking(db: Database, a: RecordData) {
  if (!db.customers.some((c) => c.id === a.customer))
    throw Error("Select a customer.");
  const st = db.staff.find((s) => s.id === a.staff);
  if (!st || st.branch !== a.branch)
    throw Error("Select a therapist at this branch.");
  const service = db.services.find((s) => s.id === a.service);
  const permits = (v: string | number | undefined, id: string) =>
    !v || v === "all" || String(v).split(",").includes(id);
  if (
    !service ||
    !permits(st.services, String(a.service)) ||
    !permits(service.staff, String(a.staff)) ||
    !permits(service.branches, String(a.branch))
  )
    throw Error(
      "This service is not assigned to the selected staff or branch.",
    );
  if (String(a.date) < today()) throw Error("Select today or a future date.");
  if (
    !slots(
      db,
      String(a.staff),
      String(a.service),
      String(a.date),
      a.id,
    ).includes(String(a.time))
  )
    throw Error("This slot is unavailable. Choose another time.");
}
export function completeAppointment(db: Database, id: string): Database {
  const next = structuredClone(db);
  const a = next.appointments.find((a) => a.id === id);
  if (!a) throw Error("Appointment not found.");
  if (a.status === "Completed") return next;
  if (a.status !== "In Progress")
    throw Error("Start the service before completing it.");
  a.status = "Completed";
  const enrollment = next.enrollments.find(
    (e) =>
      e.customer === a.customer &&
      Number(e.remaining) > 0 &&
      String(e.expires) >= String(a.date) &&
      e.status === "Active",
  );
  if (enrollment && a.usePackage === "yes") {
    enrollment.remaining = Number(enrollment.remaining) - 1;
    a.payment = "Paid";
    a.package = enrollment.id;
  }
  const service = next.services.find((s) => s.id === a.service);
  if (service?.consumedProduct) {
    const product = next.products.find((p) => p.id === service.consumedProduct);
    if (
      !product ||
      Number(product.quantity) < Number(service.consumedQuantity || 1)
    )
      throw Error("Insufficient treatment product stock.");
    product.quantity =
      Number(product.quantity) - Number(service.consumedQuantity || 1);
    next.stock.unshift({
      id: crypto.randomUUID(),
      name: "Service Consumption",
      branch: a.branch,
      product: product.id,
      quantity: -Number(service.consumedQuantity || 1),
      date: today(),
      appointment: a.id,
    });
  }
  return next;
}
export function bookAppointment(
  db: Database,
  input: RecordData,
  newCustomer?: RecordData,
): Database {
  const next = structuredClone(db);
  if (newCustomer) next.customers.unshift(newCustomer);
  const a = { ...input };
  validateBooking(next, a);
  const old = next.appointments.find((x) => x.id === a.id);
  if (old?.payment === "Paid") {
    if (old.service !== a.service)
      throw Error("Manage service changes on a paid booking through checkout.");
    a.payment = "Paid";
    a.paymentMethod = old.paymentMethod || "Pay at Salon";
  } else if (
    a.paymentMethod &&
    a.paymentMethod !== "Pay at Salon" &&
    a.usePackage !== "yes"
  ) {
    const service = next.services.find((s) => s.id === a.service)!;
    const customer = next.customers.find((c) => c.id === a.customer)!;
    const enrollment = next.enrollments.find(
      (e) =>
        e.customer === a.customer &&
        e.status === "Active" &&
        String(e.expires) >= today(),
    );
    const membershipDiscount = Number(
      next.memberships.find((m) => m.id === enrollment?.plan)?.discount || 0,
    );
    const amount = Math.round(
      (Number(service.price) - Number(service.discount || 0)) *
        (1 - membershipDiscount / 100),
    );
    next.payments.unshift({
      id: crypto.randomUUID(),
      name: "INV-" + Date.now(),
      branch: a.branch,
      customer: a.customer,
      appointment: a.id,
      amount,
      total: amount,
      date: today(),
      method: a.paymentMethod,
      status: "Paid",
      transaction: "DEMO-" + crypto.randomUUID().slice(0, 8),
    });
    const points = Math.floor(amount / 1000) * 10;
    customer.points = Number(customer.points || 0) + points;
    next.loyalty.unshift({
      id: crypto.randomUUID(),
      name: "Online booking rewards",
      branch: a.branch,
      customer: a.customer,
      date: today(),
      points,
    });
    a.payment = "Paid";
  }
  next.appointments = [a, ...next.appointments.filter((x) => x.id !== a.id)];
  return next;
}
