"use client";
import { useState } from "react";
import { reportNames, reportRows } from "@/lib/reports";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { Button } from "@/components/ui/button";
import { useERP } from "@/lib/store";
import { money } from "@/lib/data";
import { exportFile, exportPdf } from "@/lib/export";

import { label } from "@/lib/labels";
export function Reports() {
  const { db, branch } = useERP();
  const [kind, setKind] = useState("Daily Revenue");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [person, setPerson] = useState("");
  const reportTypes = reportNames;
  const rows = reportRows(db, kind, branch, from, to, person);
  const summary = reportRows(db, "Profit & Loss", branch, from, to, person);
  const revenue = Number(summary[0]?.total || 0),
    expense = Number(summary[1]?.total || 0);
  return (
    <>
      <div className="toolbar">
        <select
          aria-label="Report type"
          value={kind}
          onChange={(e) => setKind(e.target.value)}
        >
          {reportTypes.map((k) => (
            <option key={k}>{k}</option>
          ))}
        </select>
        <input
          aria-label="Report from"
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          style={{ width: 160 }}
        />
        <input
          aria-label="Report to"
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          style={{ width: 160 }}
        />
        <select
          aria-label="Report staff"
          value={person}
          onChange={(e) => setPerson(e.target.value)}
        >
          <option value="">All staff</option>
          {db.staff.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <Button variant="outline" onClick={() => exportFile(kind, rows)}>
          Export CSV
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            exportPdf(kind, rows, [
              `Branch: ${db.branches.find((b) => b.id === branch)?.name || "All branches"}`,
              `Dates: ${from || "Beginning"} to ${to || "Latest"}`,
              `Staff: ${db.staff.find((s) => s.id === person)?.name || "All staff"}`,
            ])
          }
        >
          Download PDF
        </Button>
      </div>
      <div className="stats">
        {[
          ["Revenue", revenue],
          ["Expenses", expense],
          ["Profit before other costs", revenue - expense],
          [
            "Inventory value",
            db.products.reduce(
              (n, p) => n + Number(p.purchase) * Number(p.quantity),
              0,
            ),
          ],
        ].map(([l, v]) => (
          <div className="stat" key={l}>
            <p className="muted">{l}</p>
            <strong>{money(Number(v))}</strong>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-head">
          <h2>{kind} report</h2>
          <span className="badge">{rows.length} records</span>
        </div>
        <div className="chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows.slice(0, 12)}>
              <XAxis dataKey="name" stroke="var(--muted)" fontSize={9} />
              <YAxis stroke="var(--muted)" fontSize={9} />
              <Tooltip
                contentStyle={{
                  background: "var(--panel)",
                  color: "var(--text)",
                  borderColor: "var(--line)",
                }}
              />
              <Bar
                dataKey={
                  [
                    "total",
                    "revenue",
                    "earned",
                    "value",
                    "amount",
                    "bookings",
                    "completed",
                  ].find((k) => rows.some((r) => r[k] !== undefined)) || "total"
                }
                fill="var(--accent)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {Array.from(new Set(rows.slice(0, 1).flatMap(Object.keys)))
                  .filter(
                    (k) =>
                      ![
                        "image",
                        "items",
                        "salary",
                        "description",
                        "receipt",
                      ].includes(k),
                  )
                  .map((k) => (
                    <th key={k}>{label(k)}</th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  {Object.entries(r)
                    .filter(
                      ([k]) =>
                        ![
                          "image",
                          "items",
                          "salary",
                          "description",
                          "receipt",
                        ].includes(k),
                    )
                    .map(([k, v]) => (
                      <td key={k}>{String(v)}</td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
