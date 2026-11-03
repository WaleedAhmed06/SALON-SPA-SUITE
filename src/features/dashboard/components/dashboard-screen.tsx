"use client";

import { Insights } from "@/features/dashboard/components/insights";
import {
  CalendarDays,
  Users,
  Scissors,
  Wallet,
  Package,
  ArrowUpRight,
  Check,
  Clock,
  Star,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Button } from "@/components/ui/button";
import { useERP } from "@/lib/store";
import { money, today, type Role, type RecordData } from "@/lib/data";

import { commission } from "@/features/commissions/selectors";
function Badge({ value }: { value: string | number }) {
  return (
    <span
      className={"badge " + String(value).toLowerCase().replaceAll(" ", "-")}
    >
      {value}
    </span>
  );
}
export function Dashboard({
  role,
  go,
}: {
  role: Role;
  go: (p: string) => void;
}) {
  const { db, branch } = useERP();
  const apps = db.appointments.filter(
    (a) =>
      (branch === "all" || a.branch === branch) &&
      (role !== "staff" || a.staff === "t0") &&
      (role !== "customer" || a.customer === "c0"),
  );
  const payments = db.payments.filter(
    (p) =>
      (branch === "all" || p.branch === branch) &&
      (role !== "customer" || p.customer === "c0") &&
      (role !== "staff" ||
        db.appointments.some(
          (a) => a.id === p.appointment && a.staff === "t0",
        )),
  );
  const revenue = payments.reduce((n, p) => n + Number(p.amount), 0);
  const metrics =
    role === "customer"
      ? [
          ["Total spending", money(revenue), Wallet],
          ["Your appointments", apps.length, CalendarDays],
          [
            "Loyalty points",
            db.customers.find((c) => c.id === "c0")?.points || 0,
            Star,
          ],
          [
            "Memberships",
            db.enrollments.filter((e) => e.customer === "c0").length,
            Package,
          ],
        ]
      : role === "staff"
        ? [
            [
              "Today’s appointments",
              apps.filter((a) => a.date === today()).length,
              CalendarDays,
            ],
            [
              "Completed services",
              apps.filter((a) => a.status === "Completed").length,
              Check,
            ],
            [
              "Commission earned",
              money(commission(db, "t0").reduce((n, a) => n + a.earned, 0)),

              Wallet,
            ],
            [
              "Working hours",
              `${db.staff.find((s) => s.id === "t0")?.start}:00 – ${db.staff.find((s) => s.id === "t0")?.end}:00`,
              Clock,
            ],
          ]
        : [
            ["Total revenue", money(revenue), Wallet],
            ["Appointments", apps.length, CalendarDays],
            ["Total customers", db.customers.length, Users],
            [
              "Active team",
              db.staff.filter((x) => x.status === "Active").length,
              Scissors,
            ],
          ];
  const chart = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 6 + i);
    const date = d.toLocaleDateString("en-CA");
    return {
      name: d.toLocaleDateString("en-PK", { weekday: "short" }),
      revenue: payments
        .filter((p) => p.date === date)
        .reduce((n, p) => n + Number(p.amount), 0),
    };
  });
  return (
    <>
      <section className="welcome">
        <div>
          <div className="eyebrow">
            {new Date().toLocaleDateString("en-PK", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </div>
          <h2>
            {role === "customer"
              ? "A little time, just for you."
              : "Good things are growing here."}
          </h2>
          <p>
            {role === "customer"
              ? "Discover your next treatment and make space for feeling good."
              : `You have ${apps.filter((a) => a.date === today()).length} appointments today. Let’s make every visit exceptional.`}
          </p>
        </div>
        <div className="welcome-art">✳</div>
      </section>
      <section className="stats">
        {metrics.map(([label, value, Icon]) => {
          const I = Icon as typeof Wallet;
          return (
            <div className="stat" key={String(label)}>
              <div className="stat-top">
                {String(label)}
                <I size={17} />
              </div>
              <strong>{String(value)}</strong>
              <small>↗ Live from your shared workspace</small>
            </div>
          );
        })}
      </section>
      <div className="grid-main">
        <section className="card">
          <div className="card-head">
            <div>
              <h2>
                {role === "customer"
                  ? "Your spending overview"
                  : "Revenue overview"}
              </h2>
              <p>A clear picture of your business performance</p>
            </div>
            <span className="badge">This week</span>
          </div>
          <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chart}>
                <defs>
                  <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--accent)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--accent)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  stroke="var(--line)"
                  strokeDasharray="3 5"
                />
                <XAxis
                  dataKey="name"
                  stroke="var(--muted)"
                  fontSize={10}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="var(--muted)"
                  fontSize={10}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--panel)",
                    color: "var(--text)",
                    border: "1px solid var(--line)",
                    borderRadius: 9,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--accent)"
                  strokeWidth={2.5}
                  fill="url(#gold)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="card">
          <div className="card-head">
            <div>
              <h2>Most loved services</h2>
              <p>The treatments clients come back for</p>
            </div>
            <Scissors size={18} className="muted" />
          </div>
          {db.services.slice(0, 4).map((v, i) => (
            <div className="list-row" key={v.id}>
              <div className="avatar">0{i + 1}</div>
              <div className="grow">
                <strong>{v.name}</strong>
                <div className="progress">
                  <i style={{ width: `${90 - i * 16}%` }} />
                </div>
              </div>
              <span style={{ fontSize: 11 }}>{money(Number(v.price))}</span>
            </div>
          ))}
        </section>
      </div>
      <div className="grid-main">
        <section className="card">
          <div className="card-head">
            <div>
              <h2>
                {role === "customer"
                  ? "Your appointments"
                  : "Appointment schedule"}
              </h2>
              <p>Every visit, thoughtfully planned</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => go("Appointments")}
            >
              View all <ArrowUpRight size={13} />
            </Button>
          </div>
          <AppointmentTable apps={apps.slice(0, 6)} />
        </section>
        <section className="card">
          <div className="card-head">
            <div>
              <h2>
                {role === "customer"
                  ? "Your membership benefits"
                  : "Your exceptional team"}
              </h2>
              <p>
                {role === "customer"
                  ? "Discover care that goes a little further"
                  : "People behind the beautiful experiences"}
              </p>
            </div>
          </div>
          {role === "customer" ? (
            <>
              <h2>Gold Beauty Package</h2>
              <p
                className="muted"
                style={{ margin: "18px 0", lineHeight: 1.8 }}
              >
                3 facials, 2 hair treatments and 2 manicures. A little luxury,
                every month.
              </p>
              <Button onClick={() => go("Memberships")}>
                Explore memberships
              </Button>
            </>
          ) : (
            db.staff.slice(0, 4).map((v, i) => (
              <div className="list-row" key={v.id}>
                <div className="avatar">
                  {v.name
                    .split(" ")
                    .map((x) => x[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div className="grow">
                  <strong>{v.name}</strong>
                  <p>{v.designation}</p>
                </div>
                <span style={{ color: "var(--accent)", fontSize: 11 }}>
                  ★ {(4.9 - i * 0.1).toFixed(1)}
                </span>
              </div>
            ))
          )}
        </section>
      </div>
      <Insights role={role} />
    </>
  );
}
function AppointmentTable({
  apps,
  action,
}: {
  apps: RecordData[];
  action?: (a: RecordData) => void;
}) {
  const { db } = useERP();
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Client / service</th>
            <th>Therapist</th>
            <th>Date & time</th>
            <th>Status</th>
            {action && <th>Manage</th>}
          </tr>
        </thead>
        <tbody>
          {apps.map((a) => (
            <tr key={a.id}>
              <td>
                {db.customers.find((c) => c.id === a.customer)?.name ||
                  "Walk-in"}
                <small>
                  {db.services.find((c) => c.id === a.service)?.name}
                </small>
              </td>
              <td>{db.staff.find((c) => c.id === a.staff)?.name}</td>
              <td>
                {a.date}
                <small>{a.time}</small>
              </td>
              <td>
                <Badge value={a.status} />
              </td>
              {action && (
                <td>
                  <Button variant="outline" size="sm" onClick={() => action(a)}>
                    Open
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {!apps.length && (
        <div className="empty">
          No appointments found. Your next beautiful experience starts here.
        </div>
      )}
    </div>
  );
}
