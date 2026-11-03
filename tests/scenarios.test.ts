import { test } from "node:test";
import assert from "node:assert/strict";
import { seed } from "../src/lib/data";
import { settleSale, commission, validateBooking } from "../src/lib/business";
test("cross-portal booking, staff completion, POS, stock, revenue and commission", () => {
  let d = seed();
  d.appointments = [];
  const a = {
    id: "scenario",
    name: "BK-SCENARIO",
    branch: "b0",
    customer: "c0",
    staff: "t0",
    service: "s0",
    date: "2027-01-04",
    time: "09:00",
    status: "Confirmed",
    payment: "Unpaid",
  };
  validateBooking(d, a);
  d.appointments.push(a);
  assert.equal(d.appointments.filter((a) => a.staff === "t0").length, 1);
  a.status = "Checked In";
  a.status = "In Progress";
  a.status = "Completed";
  assert.equal(commission(d, "t0").length, 0);
  const stock = Number(d.products[0].quantity);
  const revenue = d.payments.reduce((n, p) => n + Number(p.amount), 0);
  d = settleSale(
    d,
    {
      id: "invoice",
      name: "INV-SCENARIO",
      branch: "b0",
      customer: "c0",
      appointment: a.id,
      total: 2700,
    },
    [
      { id: "s0", name: "Haircut", type: "service", price: 1500, quantity: 1 },
      { id: "p0", name: "Shampoo", type: "product", price: 1200, quantity: 1 },
    ],
    2700,
    "JazzCash",
  );
  assert.equal(d.products[0].quantity, stock - 1);
  assert.equal(d.appointments[0].payment, "Paid");
  assert.equal(commission(d, "t0")[0].earned, 300);
  assert.equal(
    d.payments.reduce((n, p) => n + Number(p.amount), 0),
    revenue + 2700,
  );
  assert.throws(() =>
    settleSale(
      d,
      d.payments[0],
      [
        {
          id: "s0",
          name: "Haircut",
          type: "service",
          price: 1500,
          quantity: 1,
        },
      ],
      2700,
      "Cash",
    ),
  );
});
test("insufficient inventory never creates a payment or changes stock", () => {
  const d = seed();
  const before = JSON.stringify(d);
  assert.throws(() =>
    settleSale(
      d,
      { id: "invoice", name: "INV", branch: "b0", customer: "c0", total: 100 },
      [
        {
          id: "p0",
          name: "Shampoo",
          type: "product",
          price: 100,
          quantity: 999,
        },
      ],
      100,
      "Cash",
    ),
  );
  assert.equal(JSON.stringify(d), before);
});
