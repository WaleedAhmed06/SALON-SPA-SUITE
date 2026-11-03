"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useERP } from "@/lib/store";
import { type RecordData, money, today } from "@/lib/data";
import { purchaseMembership } from "@/lib/business";

import { Status } from "@/components/ui/status-badge";
import { label } from "@/lib/labels";
import { ReceiptView } from "@/features/payments/components/receipt-view";
export function Profile({ notify }: { notify: (s: string) => void }) {
  const { db, save, transact } = useERP();
  const customer = db.customers.find((c) => c.id === "c0")!;
  const [draft, setDraft] = useState({ ...customer });
  const [receipt, setReceipt] = useState<RecordData | null>(null);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [appointment, setAppointment] = useState("");
  return (
    <>
      <div className="grid-main">
        <section className="card">
          <h2>Personal details & preferences</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              save("customers", draft);
              notify("Profile updated");
            }}
          >
            <div className="form-grid">
              {[
                "name",
                "email",
                "phone",
                "dob",
                "gender",
                "address",
                "preferences",
              ].map((k) => (
                <label key={k}>
                  {label(k)}
                  <input
                    required={k === "name"}
                    type={
                      k === "email" ? "email" : k === "dob" ? "date" : "text"
                    }
                    value={draft[k] || ""}
                    onChange={(e) =>
                      setDraft({ ...draft, [k]: e.target.value })
                    }
                  />
                </label>
              ))}
            </div>
            <Button>Save profile</Button>
          </form>
        </section>
        <section className="card">
          <h2>My memberships & rewards</h2>
          <div className="stat" style={{ margin: "20px 0" }}>
            <p className="muted">Loyalty balance</p>
            <strong>{customer.points} points</strong>
            <small>
              Earn 10 points per Rs. 1,000 · redeem 100 for Rs. 100 at checkout
            </small>
          </div>
          {db.enrollments
            .filter((e) => e.customer === "c0")
            .map((e) => (
              <div className="list-row" key={e.id}>
                <div className="grow">
                  <strong>{e.name}</strong>
                  <p>
                    {e.remaining} remaining sessions · expires {e.expires}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    transact((current) =>
                      purchaseMembership(
                        current,
                        String(e.plan),
                        "c0",
                        "Card",
                        e.id,
                      ),
                    );
                    notify("Membership renewed through simulated payment");
                  }}
                >
                  Renew
                </Button>
              </div>
            ))}
        </section>
      </div>
      <section className="card" style={{ marginBottom: 20 }}>
        <h2>Payment history</h2>
        {db.payments
          .filter((p) => p.customer === "c0")
          .map((p) => (
            <div className="list-row" key={p.id}>
              <div className="grow">
                <strong>{p.name}</strong>
                <p>
                  {p.date} · {p.method}
                </p>
              </div>
              {money(Number(p.amount))}
              <Status value={p.status} />
              <Button size="sm" variant="outline" onClick={() => setReceipt(p)}>
                Receipt
              </Button>
            </div>
          ))}
      </section>
      <section className="card" style={{ marginBottom: 20 }}>
        <h2>Loyalty points history</h2>
        {db.loyalty
          .filter((l) => l.customer === "c0")
          .map((l) => (
            <div className="list-row" key={l.id}>
              <strong className="grow">{l.name}</strong>
              <span>
                {l.date} · {l.points} points
              </span>
            </div>
          ))}
        <p className="muted" style={{ marginTop: 15 }}>
          100 points = Rs. 100 discount. Redeem at salon checkout.
        </p>
      </section>
      <section className="card">
        <h2>Share your experience</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!appointment) return;
            const a = db.appointments.find((x) => x.id === appointment)!;
            save("reviews", {
              id: crypto.randomUUID(),
              name: review,
              branch: a.branch,
              customer: "c0",
              appointment,
              staff: a.staff,
              service: a.service,
              rating,
              date: today(),
            });
            notify("Thank you for your review");
            setReview("");
          }}
        >
          <div className="form-grid">
            <label>
              Completed appointment
              <select
                required
                value={appointment}
                onChange={(e) => setAppointment(e.target.value)}
              >
                <option value="">Select appointment</option>
                {db.appointments
                  .filter(
                    (a) => a.customer === "c0" && a.status === "Completed",
                  )
                  .map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
              </select>
            </label>
            <label>
              Service & staff rating
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} stars
                  </option>
                ))}
              </select>
            </label>
            <label className="full">
              Review
              <textarea
                required
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
            </label>
          </div>
          <Button>Submit review</Button>
        </form>
        {db.reviews
          .filter((r) => r.customer === "c0")
          .map((r) => (
            <div className="list-row" key={r.id}>
              {"★".repeat(Number(r.rating))} · {r.name}
            </div>
          ))}
      </section>
      {receipt && (
        <ReceiptView receipt={receipt} close={() => setReceipt(null)} />
      )}
    </>
  );
}
