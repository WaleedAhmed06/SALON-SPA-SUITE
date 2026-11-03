import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildCsv,
  buildPdf,
  receiptRows,
  exportColumns,
} from "../src/lib/export";
import { seed } from "../src/lib/data";
import { reportNames, reportRows } from "../src/features/reports/selectors";
test("CSV includes headers, all records, escaped quotes and Excel-compatible encoding", () => {
  const csv = buildCsv([
    { name: 'Haircut, "Premium"', amount: 1500 },
    { name: "Facial", amount: 3000 },
  ]);
  assert.ok(csv.startsWith("\uFEFF"));
  assert.ok(csv.includes('"Name","Amount"'));
  assert.ok(csv.includes('"Haircut, ""Premium""","1500"'));
  assert.ok(csv.includes('"Facial","3000"'));
  assert.ok(csv.includes("\r\n"));
});
test("empty filters produce an explanation instead of a zero-byte file", async () => {
  assert.ok(buildCsv([]).includes("No records match"));
  const pdf = Buffer.from(await buildPdf("Empty filter test", []));
  assert.ok(pdf.toString("latin1").includes("No records match"));
  assert.ok(pdf.length > 3000);
});
test("all fifteen report types generate non-empty CSV and valid PDFs with report data", async () => {
  const d = seed();
  for (const kind of reportNames) {
    const rows = reportRows(d, kind);
    const csv = buildCsv(rows);
    assert.ok(csv.length > 40, kind);
    const pdf = Buffer.from(await buildPdf(kind, rows, ["All branches"]));
    const text = pdf.toString("latin1");
    assert.ok(text.startsWith("%PDF-"), kind);
    assert.ok(text.includes(kind), kind);
    assert.ok(pdf.length > 3000, kind);
    if (rows.length) assert.ok(text.includes(String(rows[0].name)), kind);
  }
});
test("receipt exports include customer, item names, totals and outstanding balance", async () => {
  const d = seed();
  const invoice = {
    id: "test",
    name: "INV-EXPORT",
    branch: "b0",
    customer: "c0",
    amount: 500,
    total: 1500,
    method: "JazzCash",
    status: "Partial",
    items: JSON.stringify([{ name: "Haircut", quantity: 1, price: 1500 }]),
  };
  const rows = receiptRows(invoice, d.customers, d.branches);
  const csv = buildCsv(rows);
  for (const value of ["Ayesha Khan", "Haircut", "1500", "1000", "JazzCash"])
    assert.ok(csv.includes(value));
  assert.ok(!exportColumns(rows).includes("items"));
  const pdf = Buffer.from(await buildPdf(invoice.name, rows));
  for (const value of ["Haircut", "1000", "JazzCash"])
    assert.ok(pdf.toString("latin1").includes(value));
});
