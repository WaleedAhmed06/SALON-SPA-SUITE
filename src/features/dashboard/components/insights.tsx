"use client";
import { useState } from "react";
import { useERP } from "@/lib/store";
import { money, today, type Role, type RecordData } from "@/lib/data";
import { reportRows } from "@/lib/reports";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import { chartColors as colors } from "@/lib/theme";

export function Insights({ role }: { role: Role }) {
  const { db, branch } = useERP();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const filter = (r: RecordData) =>
    (branch === "all" || r.branch === branch) &&
    (!from || String(r.date || today()) >= from) &&
    (!to || String(r.date || today()) <= to);
  const apps = db.appointments.filter(
    (a) =>
      filter(a) &&
      (role !== "staff" || a.staff === "t0") &&
      (role !== "customer" || a.customer === "c0"),
  );
  const payments = db.payments.filter(
    (p) => filter(p) && (role !== "customer" || p.customer === "c0"),
  );
  const revenue = (list: RecordData[]) =>
    list.reduce((n, p) => n + Number(p.amount), 0);
  const todayApps = apps.filter((a) => a.date === today());
  const completed = apps.filter((a) => a.status === "Completed");
  const stats =
    role === "admin"
      ? [
          [
            "Today’s revenue",
            money(revenue(payments.filter((p) => p.date === today()))),
          ],
          [
            "Monthly revenue",
            money(
              revenue(
                payments.filter(
                  (p) => String(p.date).slice(0, 7) === today().slice(0, 7),
                ),
              ),
            ),
          ],
          ["Today’s appointments", todayApps.length],
          [
            "Upcoming appointments",
            apps.filter(
              (a) =>
                String(a.date) >= today() &&
                !["Completed", "Cancelled", "No Show"].includes(
                  String(a.status),
                ),
            ).length,
          ],
          ["Completed appointments", completed.length],
          [
            "Cancelled appointments",
            apps.filter((a) => a.status === "Cancelled").length,
          ],
          [
            "New customers",
            db.customers.filter(
              (c) => String(c.registered).slice(0, 7) === today().slice(0, 7),
            ).length,
          ],
          [
            "Active services",
            db.services.filter((s) => s.status === "Active").length,
          ],
        ]
      : role === "receptionist"
        ? [
            ["Today’s appointments", todayApps.length],
            [
              "Upcoming bookings",
              apps.filter((a) => String(a.date) >= today()).length,
            ],
            [
              "Checked-in clients",
              todayApps.filter((a) => a.status === "Checked In").length,
            ],
            [
              "Walk-in clients",
              todayApps.filter((a) => a.walkin === "yes").length,
            ],
            [
              "Pending balances",
              money(
                payments.reduce(
                  (n, p) => n + Number(p.total) - Number(p.amount),
                  0,
                ),
              ),
            ],
            [
              "Completed services",
              todayApps.filter((a) => a.status === "Completed").length,
            ],
            [
              "Available staff",
              db.staff.filter(
                (s) =>
                  s.status === "Active" &&
                  !todayApps.some(
                    (a) => a.staff === s.id && a.status === "In Progress",
                  ),
              ).length,
            ],
            [
              "Daily collection",
              money(revenue(payments.filter((p) => p.date === today()))),
            ],
          ]
        : role === "staff"
          ? [
              [
                "Pending services",
                apps.filter(
                  (a) =>
                    !["Completed", "Cancelled", "No Show"].includes(
                      String(a.status),
                    ),
                ).length,
              ],
              [
                "Next break",
                `${db.staff.find((s) => s.id === "t0")?.breakStart}:00`,
              ],
              [
                "Monthly salary",
                money(Number(db.staff.find((s) => s.id === "t0")?.salary || 0)),
              ],
              [
                "Approved leave",
                db.leaves.filter(
                  (l) => l.staff === "t0" && l.status === "Approved",
                ).length,
              ],
            ]
          : [
              ["Total visits", completed.length],
              [
                "Upcoming visits",
                apps.filter(
                  (a) => String(a.date) >= today() && a.status !== "Cancelled",
                ).length,
              ],
              [
                "Your reward value",
                money(
                  Math.floor(
                    Number(
                      db.customers.find((c) => c.id === "c0")?.points || 0,
                    ) / 100,
                  ) * 100,
                ),
              ],
              ["Special offer", "MAISON10 · 10% off"],
            ];
  const statuses = [
    "Pending",
    "Confirmed",
    "Checked In",
    "In Progress",
    "Completed",
    "Cancelled",
    "No Show",
  ].map((name) => ({
    name,
    value: apps.filter((a) => a.status === name).length,
  }));
  const methods = Array.from(
    new Set(payments.map((p) => String(p.method))),
  ).map((name) => ({
    name,
    value: revenue(payments.filter((p) => p.method === name)),
  }));
  const monthly = reportRows(db, "Monthly Revenue", branch, from, to);
  const popular = db.services
    .map((s) => ({
      name: s.name,
      value: apps.filter((a) => a.service === s.id).length,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
  const staffData = reportRows(db, "Staff Performance", branch, from, to)
    .sort((a, b) => Number(b.completed) - Number(a.completed))
    .slice(0, 5);
  const growth = reportRows(db, "Customer Growth", branch, from, to);
  return (
    <>
      <div className="toolbar">
        <span className="eyebrow" style={{ alignSelf: "center", margin: 0 }}>
          LIVE WORKSPACE INSIGHTS
        </span>
        <input
          type="date"
          aria-label="Dashboard from"
          style={{ width: 160 }}
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <input
          type="date"
          aria-label="Dashboard to"
          style={{ width: 160 }}
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </div>
      <div className="stats">
        {stats.map(([name, value]) => (
          <div className="stat" key={name}>
            <p className="muted" style={{ fontSize: 11 }}>
              {name}
            </p>
            <strong style={{ fontSize: 21 }}>{value}</strong>
          </div>
        ))}
      </div>
      {role === "admin" && (
        <>
          <div className="records" style={{ marginBottom: 22 }}>
            <Chart title="Monthly revenue" data={monthly} field="total" />
            <Chart title="Appointment statistics" data={statuses} pie />
            <Chart title="Service popularity" data={popular} />
            <Chart
              title="Staff performance"
              data={staffData}
              field="completed"
            />
            <Chart title="Customer growth" data={growth} field="records" />
            <Chart title="Payment methods" data={methods} pie />
          </div>
          <div className="records">
            <Widget
              title="Today’s appointment schedule"
              rows={todayApps.slice(0, 5).map((a) => ({
                id: a.id,
                name: `${a.time} · ${db.customers.find((c) => c.id === a.customer)?.name}`,
                detail: `${db.services.find((s) => s.id === a.service)?.name} · ${a.status}`,
              }))}
            />
            <Widget
              title="Upcoming appointments"
              rows={apps
                .filter(
                  (a) =>
                    String(a.date) >= today() &&
                    !["Cancelled", "Completed", "No Show"].includes(
                      String(a.status),
                    ),
                )
                .slice(0, 5)
                .map((a) => ({
                  id: a.id,
                  name:
                    db.customers.find((c) => c.id === a.customer)?.name ||
                    "Client",
                  detail: `${a.date} · ${a.time}`,
                }))}
            />
            <Widget
              title="Recent transactions"
              rows={payments.slice(0, 5).map((p) => ({
                id: p.id,
                name: p.name,
                detail: `${money(Number(p.amount))} · ${p.method}`,
              }))}
            />
            <Widget
              title="Low stock products"
              rows={db.products
                .filter(
                  (p) =>
                    Number(p.quantity) < Number(p.minimum) &&
                    (branch === "all" || p.branch === branch),
                )
                .slice(0, 5)
                .map((p) => ({
                  id: p.id,
                  name: p.name,
                  detail: `${p.quantity} left · minimum ${p.minimum}`,
                }))}
            />
            <Widget
              title="Recent customer registrations"
              rows={db.customers.slice(-5).map((c) => ({
                id: c.id,
                name: c.name,
                detail: String(c.registered),
              }))}
            />
            <Widget
              title="Pending payments"
              rows={payments
                .filter((p) => Number(p.amount) < Number(p.total))
                .slice(0, 5)
                .map((p) => ({
                  id: p.id,
                  name: p.name,
                  detail: `${money(Number(p.total) - Number(p.amount))} outstanding`,
                }))}
            />
            <Widget
              title="Recent activities"
              rows={db.notifications.slice(0, 5).map((n) => ({
                id: n.id,
                name: n.name,
                detail: String(n.date),
              }))}
            />
          </div>
        </>
      )}
    </>
  );
}
function Widget({
  title,
  rows,
}: {
  title: string;
  rows: { id: string; name: string; detail: string }[];
}) {
  return (
    <section className="card">
      <h2>{title}</h2>
      {rows.map((r) => (
        <div className="list-row" key={r.id}>
          <div className="grow">
            <strong>{r.name}</strong>
            <p>{r.detail}</p>
          </div>
        </div>
      ))}
      {!rows.length && (
        <p className="muted" style={{ padding: "25px 0", fontSize: 12 }}>
          All clear. No records in this view.
        </p>
      )}
    </section>
  );
}
function Chart({
  title,
  data,
  field = "value",
  pie = false,
}: {
  title: string;
  data: object[];
  field?: string;
  pie?: boolean;
}) {
  return (
    <section className="card">
      <h2 style={{ marginBottom: 20 }}>{title}</h2>
      <div style={{ height: 205 }}>
        <ResponsiveContainer width="100%" height="100%">
          {pie ? (
            <PieChart>
              <Pie
                data={data}
                dataKey={field}
                nameKey="name"
                innerRadius={48}
                outerRadius={75}
                paddingAngle={3}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={colors[i % colors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--panel)",
                  color: "var(--text)",
                  borderColor: "var(--line)",
                }}
              />
            </PieChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid vertical={false} stroke="var(--line)" />
              <XAxis
                dataKey="name"
                stroke="var(--muted)"
                fontSize={8}
                interval={0}
                tickFormatter={(v) => String(v).slice(0, 12)}
              />
              <YAxis stroke="var(--muted)" fontSize={9} width={40} />
              <Tooltip
                contentStyle={{
                  background: "var(--panel)",
                  color: "var(--text)",
                  borderColor: "var(--line)",
                }}
              />
              <Bar dataKey={field} fill="var(--accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      {pie && (
        <div className="legend" style={{ flexWrap: "wrap" }}>
          {(data as { name: string; value: number }[]).map((d, i) => (
            <span key={d.name}>
              <i
                className="dot"
                style={{ background: colors[i % colors.length] }}
              />
              {d.name}: {d.value.toLocaleString()}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
