"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useERP } from "@/lib/store";
import { type Role, money } from "@/lib/data";
import { commission, exportFile } from "@/lib/business";

import { Status } from "@/components/ui/status-badge";

export function Commissions({
  role,
  notify,
}: {
  role: Role;
  notify: (s: string) => void;
}) {
  const { db, save } = useERP();
  const [month, setMonth] = useState("");
  const earned = (id: string) =>
    commission(db, id).filter(
      (a) => !month || String(a.date).startsWith(month),
    );
  const people =
    role === "staff" ? db.staff.filter((s) => s.id === "t0") : db.staff;
  return (
    <>
      <div className="toolbar">
        <label>
          Commission month
          <input
            aria-label="Commission month"
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </label>
        <Button variant="outline" onClick={() => setMonth("")}>
          All months
        </Button>
      </div>
      <div className="stats">
        {["Earned", "Pending", "Paid"].map((k, i) => (
          <div className="stat" key={k}>
            <p className="muted">{k} commissions</p>
            <strong>
              {money(
                people.reduce(
                  (n, s) =>
                    n +
                    earned(s.id)
                      .filter(
                        (a) =>
                          i === 0 || (a.commissionPaid === "yes") === (i === 2),
                      )
                      .reduce((v, a) => v + a.earned, 0),
                  0,
                ),
              )}
            </strong>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-head">
          <h2>Commission ledger</h2>
          <Button
            variant="outline"
            onClick={() =>
              exportFile(
                "commissions",
                people.flatMap((p) => earned(p.id)),
              )
            }
          >
            Export report
          </Button>
        </div>
        {people.map((p) => (
          <div key={p.id}>
            <div className="list-row">
              <div className="grow">
                <strong>{p.name}</strong>
                <p>
                  {p.commission}% default commission · {money(Number(p.salary))}{" "}
                  monthly salary
                </p>
              </div>
              <strong>
                {money(earned(p.id).reduce((n, a) => n + a.earned, 0))}
              </strong>
            </div>
            {earned(p.id).map((a) => (
              <div className="list-row" key={a.id}>
                <span className="grow">
                  {a.name} · {a.date} · {a.rate}%
                </span>
                <span>{money(a.earned)}</span>
                <Status
                  value={a.commissionPaid === "yes" ? "Paid" : "Pending"}
                />
                {role === "admin" && a.commissionPaid !== "yes" && (
                  <Button
                    size="sm"
                    onClick={() => {
                      const original = db.appointments.find(
                        (x) => x.id === a.id,
                      )!;
                      save("appointments", {
                        ...original,
                        commissionPaid: "yes",
                      });
                      notify("Commission paid");
                    }}
                  >
                    Mark paid
                  </Button>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
