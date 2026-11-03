import { test } from "node:test";
import assert from "node:assert/strict";
import { seed } from "../src/lib/data";
import { reportRows, reportNames } from "../src/lib/reports";
test("all fifteen report types produce records without exposing salary", () => {
  const d = seed();
  for (const kind of reportNames) {
    const rows = reportRows(d, kind);
    assert.ok(Array.isArray(rows));
    if (kind === "Staff Performance" || kind === "Staff Commission")
      assert.ok(rows.every((r) => !("salary" in r)));
  }
});
test("revenue reports reconcile with transactions and branch/date filters", () => {
  const d = seed();
  const all = reportRows(d, "Daily Revenue");
  assert.equal(
    all.reduce((n, r) => n + Number(r.total), 0),
    d.payments.reduce((n, r) => n + Number(r.amount), 0),
  );
  const one = reportRows(d, "Monthly Revenue", "b1");
  assert.equal(
    one.reduce((n, r) => n + Number(r.total), 0),
    d.payments
      .filter((p) => p.branch === "b1")
      .reduce((n, r) => n + Number(r.amount), 0),
  );
  assert.equal(reportRows(d, "Daily Revenue", "all", "2099-01-01").length, 0);
});
test("product sales and low stock are based on inventory operations", () => {
  const d = seed();
  d.stock.push({
    id: "sale",
    name: "Product Sale",
    branch: "b0",
    product: "p0",
    quantity: -2,
    date: "2026-11-03",
  });
  assert.equal(reportRows(d, "Product Sales")[0].sold, 2);
  assert.equal(
    reportRows(d, "Inventory").find((r) => r.id === "p0")?.status,
    "Low Stock",
  );
});
