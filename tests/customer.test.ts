import { test } from "node:test";
import assert from "node:assert/strict";
import { seed } from "../src/lib/data";
import { purchaseMembership, completeAppointment } from "../src/lib/business";
test("membership purchase is shared with admin and renews expiry and sessions", () => {
  let d = seed();
  const before = d.payments.length;
  d = purchaseMembership(d, "m2", "c0", "Card");
  assert.equal(d.enrollments[0].customer, "c0");
  assert.equal(d.enrollments[0].remaining, 7);
  assert.equal(d.payments.length, before + 1);
  const old = d.enrollments[0];
  d = purchaseMembership(d, "m2", "c0", "JazzCash", old.id);
  assert.equal(d.enrollments.length, 1);
  assert.equal(d.enrollments[0].remaining, 14);
  assert.ok(String(d.enrollments[0].expires) > String(old.expires));
});
test("completed package service consumes exactly one session and treatment stock", () => {
  let d = purchaseMembership(seed(), "m2", "c0", "Card");
  d.services[0].consumedProduct = "p0";
  d.services[0].consumedQuantity = 1;
  d.appointments = [
    {
      id: "a",
      name: "Test",
      branch: "b0",
      customer: "c0",
      service: "s0",
      staff: "t0",
      date: "2026-11-04",
      status: "In Progress",
      payment: "Unpaid",
      usePackage: "yes",
    },
  ];
  const qty = Number(d.products[0].quantity);
  d = completeAppointment(d, "a");
  assert.equal(d.enrollments[0].remaining, 6);
  assert.equal(d.products[0].quantity, qty - 1);
  assert.equal(d.appointments[0].payment, "Paid");
  d = completeAppointment(d, "a");
  assert.equal(d.enrollments[0].remaining, 6);
});
import { bookAppointment, payAppointment } from "../src/lib/business";
test("online paid booking and reschedule are idempotent for payment", () => {
  let d = seed();
  d.appointments = [];
  const a = {
    id: "new",
    name: "New",
    branch: "b0",
    customer: "c0",
    staff: "t0",
    service: "s0",
    date: "2027-01-04",
    time: "09:00",
    payment: "Unpaid",
    status: "Confirmed",
    paymentMethod: "Card",
  };
  d = bookAppointment(d, a);
  const count = d.payments.length;
  assert.equal(d.appointments[0].payment, "Paid");
  d = bookAppointment(d, { ...d.appointments[0], time: "10:00" });
  assert.equal(d.payments.length, count);
  assert.throws(() => payAppointment(d, "new", "JazzCash"));
});
