"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useERP } from "@/lib/store";
import {
  type Role,
  type Collection,
  type RecordData,
  money,
  today,
} from "@/lib/data";
import { commission, purchaseMembership } from "@/lib/business";

import { Modal } from "@/components/ui/modal";
import { Status } from "@/components/ui/status-badge";
import { label } from "@/lib/labels";
export function RecordDetail({
  record: initial,
  collection: c,
  role,
  close,
  notify,
}: {
  record: RecordData;
  collection: Collection;
  role: Role;
  close: () => void;
  notify: (m: string) => void;
}) {
  const { db, save, transact } = useERP();
  const r = db[c].find((x) => x.id === initial.id) || initial;
  const [quantity, setQuantity] = useState(1);
  const [method, setMethod] = useState("Card");
  const [status, setStatus] = useState("");
  const [stockType, setStockType] = useState("Stock In");
  return (
    <Modal title={r.name} close={close}>
      <div className="form-grid">
        {Object.entries(r)
          .filter(
            ([k]) =>
              !["id", "salary", "commission"].includes(k) || role === "admin",
          )
          .map(([k, v]) => (
            <div key={k}>
              <p className="muted" style={{ fontSize: 10, marginBottom: 6 }}>
                {label(k)}
              </p>
              <p style={{ fontSize: 12, overflowWrap: "anywhere" }}>
                {k === "receipt" && String(v).startsWith("data:") ? (
                  <a
                    href={String(v)}
                    download="expense-receipt"
                    style={{ color: "var(--accent)" }}
                  >
                    Download uploaded receipt
                  </a>
                ) : (
                  String(v)
                )}
              </p>
            </div>
          ))}
      </div>
      {c === "staff" && role === "admin" && (
        <>
          <h3>Leave requests</h3>
          {db.leaves
            .filter((l) => l.staff === r.id)
            .map((l) => (
              <div className="list-row" key={l.id}>
                <div className="grow">
                  <strong>{l.name}</strong>
                  <p>
                    {l.date} – {l.endDate}
                  </p>
                </div>
                <Status value={l.status} />
                {l.status === "Pending" && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => {
                        save("leaves", { ...l, status: "Approved" });
                        notify("Leave approved — staff notified");
                      }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        save("leaves", { ...l, status: "Rejected" });
                        notify("Leave rejected");
                      }}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </div>
            ))}
          <h3 style={{ marginTop: 20 }}>Performance & completed services</h3>
          <p className="muted" style={{ marginTop: 10 }}>
            {
              db.appointments.filter(
                (a) => a.staff === r.id && a.status === "Completed",
              ).length
            }{" "}
            completed · Earned commission{" "}
            {money(commission(db, r.id).reduce((n, a) => n + a.earned, 0))}
          </p>
        </>
      )}
      {c === "branches" && (
        <>
          <h3>Branch overview</h3>
          <div className="form-grid">
            {[
              [
                "Team members",
                db.staff.filter((s) => s.branch === r.id).length,
              ],
              [
                "Appointments",
                db.appointments.filter((a) => a.branch === r.id).length,
              ],
              [
                "Customers",
                db.customers.filter((c) => c.branch === r.id).length,
              ],
              ["Products", db.products.filter((p) => p.branch === r.id).length],
              [
                "Revenue",
                money(
                  db.payments
                    .filter((p) => p.branch === r.id)
                    .reduce((n, p) => n + Number(p.amount), 0),
                ),
              ],
            ].map(([name, value]) => (
              <div key={name}>
                <p className="muted">{name}</p>
                <h2 style={{ marginTop: 8 }}>{value}</h2>
              </div>
            ))}
          </div>
        </>
      )}
      {c === "memberships" && role === "admin" && (
        <>
          <h3>Enrolled customers</h3>
          {db.enrollments
            .filter((e) => e.plan === r.id)
            .map((e) => (
              <div className="list-row" key={e.id}>
                <div className="grow">
                  <strong>
                    {db.customers.find((c) => c.id === e.customer)?.name}
                  </strong>
                  <p>
                    {e.remaining} sessions · expires {e.expires}
                  </p>
                </div>
                <Status value={e.status} />
              </div>
            ))}
        </>
      )}
      {c === "customers" && (
        <>
          <h3>Appointments & payment history</h3>
          {db.appointments
            .filter((a) => a.customer === r.id)
            .map((a) => (
              <div className="list-row" key={a.id}>
                {a.date} · {db.services.find((s) => s.id === a.service)?.name}{" "}
                <Status value={a.status} />
              </div>
            ))}
          <p className="muted" style={{ marginTop: 15 }}>
            Total spending:{" "}
            {money(
              db.payments
                .filter((p) => p.customer === r.id)
                .reduce((n, p) => n + Number(p.amount), 0),
            )}{" "}
            · Loyalty: {r.points}
          </p>
        </>
      )}
      {c === "customers" && (
        <>
          <h3 style={{ marginTop: 20 }}>Payments, memberships & reviews</h3>
          {db.payments
            .filter((p) => p.customer === r.id)
            .slice(0, 10)
            .map((p) => (
              <div className="list-row" key={p.id}>
                <strong className="grow">{p.name}</strong>
                <span>
                  {money(Number(p.amount))} · {p.method}
                </span>
                <Status value={p.status} />
              </div>
            ))}
          {db.enrollments
            .filter((e) => e.customer === r.id)
            .map((e) => (
              <div className="list-row" key={e.id}>
                {e.name} · {e.remaining} sessions · {e.expires}
              </div>
            ))}
          {db.reviews
            .filter((e) => e.customer === r.id)
            .map((e) => (
              <div className="list-row" key={e.id}>
                {"★".repeat(Number(e.rating))} · {e.name}
              </div>
            ))}
        </>
      )}
      {c === "products" && role === "admin" && (
        <>
          <h3>Stock operation</h3>
          <div className="form-grid">
            <label>
              Operation
              <select
                value={stockType}
                onChange={(e) => setStockType(e.target.value)}
              >
                <option>Stock In</option>
                <option>Stock Out</option>
                <option>Adjust Stock</option>
              </select>
            </label>
            <label>
              Quantity
              <input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </label>
          </div>
          <Button
            onClick={() => {
              const current = db.products.find((p) => p.id === r.id)!;
              const next =
                stockType === "Adjust Stock"
                  ? quantity
                  : Number(current.quantity) +
                    (stockType === "Stock In" ? quantity : -quantity);
              if (next < 0) {
                setStatus("Insufficient stock");
                return;
              }
              save("products", { ...current, quantity: next });
              save("stock", {
                id: crypto.randomUUID(),
                name: stockType,
                product: r.id,
                quantity,
                date: today(),
                branch: r.branch,
              });
              notify("Stock updated");
              setStatus(`New quantity: ${next}`);
            }}
          >
            Update stock
          </Button>
          <h3 style={{ marginTop: 20 }}>Stock history</h3>
          {db.stock
            .filter((x) => x.product === r.id)
            .map((x) => (
              <p className="muted" key={x.id}>
                {x.date} · {x.name} · {x.quantity}
              </p>
            ))}
        </>
      )}
      {c === "suppliers" && (
        <p className="muted">
          Purchase history:{" "}
          {
            db.stock.filter(
              (x) =>
                db.products.find((p) => p.id === x.product)?.supplier ===
                  r.id && x.name === "Stock In",
            ).length
          }{" "}
          stock receipts · Outstanding: {money(Number(r.outstanding))}
        </p>
      )}
      {c === "memberships" && role === "customer" && (
        <>
          <label>
            Simulated payment method
            <select value={method} onChange={(e) => setMethod(e.target.value)}>
              {["Card", "JazzCash", "Easypaisa", "Bank Transfer"].map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </label>
          <Button
            style={{ marginTop: 15 }}
            onClick={() => {
              transact((current) =>
                purchaseMembership(current, r.id, "c0", method),
              );
              notify("Membership activated — simulated payment successful");
              setStatus("Your membership is active. View it in My Profile.");
            }}
          >
            Simulate purchase · {money(Number(r.price))}
          </Button>
        </>
      )}
      {status && (
        <p style={{ marginTop: 15, color: "var(--accent)" }} role="status">
          {status}
        </p>
      )}
    </Modal>
  );
}
