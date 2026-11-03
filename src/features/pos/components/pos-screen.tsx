"use client";
import { useState } from "react";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useERP } from "@/lib/store";
import { type RecordData, money, today } from "@/lib/data";
import { paymentTotals, settleSale } from "@/lib/business";

import { Status } from "@/components/ui/status-badge";

import { ReceiptView } from "@/features/payments/components/receipt-view";
import { type Line } from "@/features/pos/types";
import { collectBalance } from "@/features/payments/actions";
export function POS({ notify }: { notify: (s: string) => void }) {
  const { db, save, transact } = useERP();
  const [customer, setCustomer] = useState("c0");
  const [appointment, setAppointment] = useState("");
  const [lines, setLines] = useState<Line[]>([]);
  const [discount, setDiscount] = useState(0);
  const [coupon, setCoupon] = useState("");
  const [tax, setTax] = useState(0);
  const [method, setMethod] = useState("Cash");
  const [paid, setPaid] = useState("");
  const [receipt, setReceipt] = useState<RecordData | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [redeem, setRedeem] = useState(false);
  const [failed, setFailed] = useState(false);
  const [invoice, setInvoice] = useState<RecordData | null>(null);
  const points = Number(
    db.customers.find((c) => c.id === customer)?.points || 0,
  );
  const reward = redeem ? Math.floor(points / 100) * 100 : 0;
  const totals = paymentTotals(
    lines,
    discount +
      (coupon === "MAISON10"
        ? lines.reduce((n, l) => n + l.price * l.quantity, 0) * 0.1
        : 0) +
      reward,
    tax,
  );
  const add = (r: RecordData, type: "service" | "product") =>
    setLines((prev) =>
      prev.some((l) => l.id === r.id)
        ? prev.map((l) =>
            l.id === r.id ? { ...l, quantity: l.quantity + 1 } : l,
          )
        : [
            ...prev,
            {
              id: r.id,
              name: r.name,
              type,
              price: Number(r.price) - Number(r.discount || 0),
              quantity: 1,
            },
          ],
    );
  const makeInvoice = () => {
    if (!lines.length) {
      setError("Add at least one service or product.");
      return null;
    }
    const inv: RecordData = {
      id: invoice?.id || crypto.randomUUID(),
      name: invoice?.name || "INV-" + Date.now(),
      branch: db.appointments.find((a) => a.id === appointment)?.branch || "b0",
      customer,
      appointment,
      date: today(),
      amount: 0,
      total: totals.total,
      subtotal: totals.subtotal,
      discount: totals.discount,
      tax: totals.tax,
      method,
      status: "Unpaid",
      items: JSON.stringify(lines),
      transaction: "",
    };
    save("payments", inv);
    setInvoice(inv);
    return inv;
  };
  const pay = () => {
    setError("");
    if (coupon && coupon !== "MAISON10") {
      setError("Invalid coupon. Use MAISON10 or leave it blank.");
      return;
    }
    if (failed) {
      notify("Simulated gateway declined. No charge or stock change.");
      return;
    }
    if (!lines.length) {
      setError("Add a service or product first.");
      return;
    }
    for (const l of lines.filter((l) => l.type === "product")) {
      if (
        Number(db.products.find((p) => p.id === l.id)?.quantity || 0) <
        l.quantity
      ) {
        setError("Not enough stock for " + l.name);
        return;
      }
    }
    const amount = paid === "" ? totals.total : Number(paid);
    if (amount <= 0 || amount > totals.total) {
      setError("Payment must be positive and no greater than the balance.");
      return;
    }
    if (invoice && Number(invoice.amount) > 0) {
      setError("This invoice has already been processed. Start a new sale.");
      return;
    }
    const inv = makeInvoice();
    if (!inv) return;
    try {
      transact((current) =>
        settleSale(current, inv, lines, amount, method, reward),
      );
      const updated = useERP
        .getState()
        .db.payments.find((p) => p.id === inv.id)!;
      setReceipt(updated);
      setInvoice(updated);
    } catch (err) {
      setError((err as Error).message);
      return;
    }
    notify("Payment recorded. Revenue, stock, loyalty and commission updated.");
  };
  return (
    <>
      <div className="grid-main">
        <section className="card">
          <div className="card-head">
            <h2>Build a beautiful checkout</h2>
            <span className="badge">SIMULATED PAYMENTS</span>
          </div>
          <div className="form-grid">
            <label>
              Customer
              <select
                value={customer}
                onChange={(e) => {
                  setCustomer(e.target.value);
                  setAppointment("");
                  setLines([]);
                  setInvoice(null);
                }}
              >
                {db.customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Appointment
              <select
                value={appointment}
                onChange={(e) => {
                  setAppointment(e.target.value);
                  const a = db.appointments.find(
                    (a) => a.id === e.target.value,
                  );
                  if (a) {
                    const v = db.services.find((s) => s.id === a.service);
                    if (v)
                      setLines([
                        {
                          id: v.id,
                          name: v.name,
                          type: "service",
                          price: Number(v.price),
                          quantity: 1,
                        },
                      ]);
                  }
                  setInvoice(null);
                }}
              >
                <option value="">Walk-in / product sale</option>
                {db.appointments
                  .filter(
                    (a) =>
                      a.customer === customer &&
                      a.payment !== "Paid" &&
                      a.status !== "Cancelled",
                  )
                  .map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} · {a.date} · {a.status}
                    </option>
                  ))}
              </select>
            </label>
          </div>
          <input
            placeholder="Find a service or product…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="pos-catalog">
            {[
              ...db.services.filter((s) => s.status === "Active"),
              ...db.products,
            ]
              .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
              .slice(0, 40)
              .map((p) => (
                <div className="list-row" key={p.id}>
                  <div className="grow">
                    <strong>{p.name}</strong>
                    <p>
                      {p.duration
                        ? `${p.duration} min treatment`
                        : `${p.quantity} in stock`}
                    </p>
                  </div>
                  <span className="item-price" style={{ fontSize: 12 }}>
                    {money(Number(p.price))}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      add(
                        p,
                        p.id.startsWith("s") ||
                          db.services.some((s) => s.id === p.id)
                          ? "service"
                          : "product",
                      )
                    }
                  >
                    Add
                  </Button>
                </div>
              ))}
          </div>
        </section>
        <section className="card">
          <div className="card-head">
            <h2>Current sale</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setLines([]);
                setInvoice(null);
                setPaid("");
                setReceipt(null);
              }}
            >
              New sale
            </Button>
          </div>
          {lines.map((l) => (
            <div className="list-row" key={l.id}>
              <div className="grow">
                <strong>{l.name}</strong>
                <p>{money(l.price)}</p>
              </div>
              <input
                aria-label={`Quantity ${l.name}`}
                type="number"
                min="1"
                value={l.quantity}
                style={{ width: 60 }}
                onChange={(e) =>
                  setLines(
                    lines.map((x) =>
                      x.id === l.id
                        ? {
                            ...x,
                            quantity: Math.max(1, Number(e.target.value)),
                          }
                        : x,
                    ),
                  )
                }
              />
              <Button
                variant="ghost"
                size="sm"
                aria-label={"Remove " + l.name}
                onClick={() => setLines(lines.filter((x) => x.id !== l.id))}
              >
                <X size={13} />
              </Button>
            </div>
          ))}
          {!lines.length && (
            <div className="empty">Select services or products to begin.</div>
          )}
          <div className="form-grid">
            <label>
              Discount (PKR)
              <input
                min="0"
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
            </label>
            <label>
              Tax (%)
              <input
                min="0"
                max="100"
                type="number"
                value={tax}
                onChange={(e) => setTax(Number(e.target.value))}
              />
            </label>
            <label>
              Coupon (MAISON10)
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
              />
            </label>
            <label>
              Reward redemption
              <select
                value={redeem ? "yes" : "no"}
                onChange={(e) => setRedeem(e.target.value === "yes")}
              >
                <option value="no">Keep {points} points</option>
                <option value="yes">
                  Redeem {Math.floor(points / 100) * 100} points
                </option>
              </select>
            </label>
            <label>
              Payment method
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                {[
                  "Cash",
                  "Card",
                  "Bank Transfer",
                  "JazzCash",
                  "Easypaisa",
                  "Wallet",
                ].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </label>
            <label>
              Amount paid (blank = full)
              <input
                min="0"
                max={totals.total}
                type="number"
                value={paid}
                onChange={(e) => setPaid(e.target.value)}
              />
            </label>
          </div>
          <div className="list-row">
            <span className="grow">Subtotal</span>
            {money(totals.subtotal)}
          </div>
          <div className="list-row">
            <span className="grow">Discount</span>−{money(totals.discount)}
          </div>
          <div className="list-row">
            <span className="grow">Tax</span>
            {money(totals.tax)}
          </div>
          <div className="list-row">
            <h2 className="grow">Total</h2>
            <h2>{money(totals.total)}</h2>
          </div>
          <label style={{ margin: "15px 0" }}>
            Gateway demo outcome
            <select
              value={failed ? "failure" : "success"}
              onChange={(e) => setFailed(e.target.value === "failure")}
            >
              <option value="success">Successful payment</option>
              <option value="failure">Declined payment</option>
            </select>
          </label>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <div className="actions">
            <Button
              variant="outline"
              onClick={() => {
                if (makeInvoice()) notify("Invoice generated");
              }}
            >
              Generate invoice
            </Button>
            <Button disabled={!!receipt} onClick={pay}>
              Process simulated payment
            </Button>
          </div>
        </section>
      </div>
      <section className="card">
        <h2>Invoices & outstanding balances</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Customer</th>
                <th>Paid</th>
                <th>Total</th>
                <th>Method</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {db.payments.slice(0, 30).map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{db.customers.find((c) => c.id === p.customer)?.name}</td>
                  <td>{money(Number(p.amount))}</td>
                  <td>{money(Number(p.total))}</td>
                  <td>{p.method}</td>
                  <td>
                    <Status value={p.status} />
                  </td>
                  <td>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setReceipt(p)}
                    >
                      Receipt
                    </Button>
                    {Number(p.amount) < Number(p.total) && (
                      <Button
                        size="sm"
                        onClick={() => {
                          const delta = Number(p.total) - Number(p.amount);
                          transact((current) => collectBalance(current, p.id));
                          notify("Outstanding " + money(delta) + " collected");
                        }}
                      >
                        Collect balance
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {receipt && (
        <ReceiptView receipt={receipt} close={() => setReceipt(null)} />
      )}
    </>
  );
}
