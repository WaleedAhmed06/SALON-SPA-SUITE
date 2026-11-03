import { test } from "node:test";
import assert from "node:assert/strict";
import { seed } from "../src/lib/data";
import { commission, paymentTotals, slots } from "../src/lib/business";
test("POS discount and tax calculation preserves partial balance", () => {
  const t = paymentTotals(
    [
      { price: 1500, quantity: 2 },
      { price: 1200, quantity: 1 },
    ],
    420,
    16,
  );
  assert.equal(t.subtotal, 4200);
  assert.equal(t.total, 4385);
  assert.equal(t.total - 2000, 2385);
  assert.equal(paymentTotals([{ price: 100, quantity: 1 }], 500, 0).total, 0);
});
test("commission requires both completed service and full payment", () => {
  const d = seed();
  d.appointments = [
    {
      id: "x",
      name: "Booking",
      branch: "b0",
      staff: "t0",
      service: "s0",
      customer: "c0",
      status: "In Progress",
      payment: "Paid",
    },
  ];
  assert.equal(commission(d, "t0").length, 0);
  d.appointments[0].status = "Completed";
  d.appointments[0].payment = "Partial";
  assert.equal(commission(d, "t0").length, 0);
  d.appointments[0].payment = "Paid";
  assert.equal(commission(d, "t0")[0].earned, 300);
  d.services[0].commission = 30;
  assert.equal(commission(d, "t0")[0].earned, 450);
});
test("approved leave blocks availability", () => {
  const d = seed();
  d.appointments = [];
  d.leaves.push({
    id: "leave",
    name: "Leave",
    staff: "t0",
    date: "2027-01-04",
    endDate: "2027-01-05",
    status: "Approved",
    branch: "b0",
  });
  assert.equal(slots(d, "t0", "s0", "2027-01-04").length, 0);
});
import { collectBalance } from "../src/features/payments/actions";
test("collecting a partial balance crosses loyalty thresholds exactly once", () => {
  let d = seed();
  d.payments.unshift({
    id: "partial",
    name: "Partial",
    branch: "b0",
    customer: "c0",
    amount: 600,
    total: 1200,
    status: "Partial",
  });
  const points = Number(d.customers[0].points);
  d = collectBalance(d, "partial");
  assert.equal(d.payments[0].amount, 1200);
  assert.equal(d.customers[0].points, points + 10);
  assert.throws(() => collectBalance(d, "partial"));
});
