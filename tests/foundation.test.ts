import { test } from "node:test";
import assert from "node:assert/strict";
import { seed, roles } from "../src/lib/data";
test("demo data meets every required minimum", () => {
  const d = seed();
  for (const [c, min] of Object.entries({
    branches: 3,
    staff: 20,
    services: 50,
    customers: 200,
    appointments: 100,
    products: 50,
    memberships: 20,
    payments: 100,
    expenses: 30,
  })) {
    assert.ok(d[c as keyof typeof d].length >= min, c);
  }
});
test("appointments reference shared records and four demo roles exist", () => {
  const d = seed();
  assert.equal(roles.length, 4);
  for (const a of d.appointments) {
    assert.ok(d.customers.some((c) => c.id === a.customer));
    assert.ok(d.services.some((s) => s.id === a.service));
    assert.ok(d.staff.some((s) => s.id === a.staff));
    assert.ok(d.branches.some((s) => s.id === a.branch));
  }
});
import { authenticateDemo } from "../src/features/auth/actions";
import { access } from "../src/features/auth/permissions";
test("all demo credentials resolve their role and invalid credentials fail", () => {
  assert.equal(authenticateDemo("admin@salondemo.com", "123456"), "admin");
  assert.equal(
    authenticateDemo("reception@salondemo.com", "123456"),
    "receptionist",
  );
  assert.equal(authenticateDemo("staff@salondemo.com", "123456"), "staff");
  assert.equal(
    authenticateDemo("customer@salondemo.com", "123456"),
    "customer",
  );
  assert.throws(() => authenticateDemo("admin@salondemo.com", "wrong"));
  assert.ok(!access.customer.includes("Staff"));
  assert.ok(!access.staff.includes("Billing & POS"));
});
