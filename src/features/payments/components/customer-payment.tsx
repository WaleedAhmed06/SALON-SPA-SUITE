"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useERP } from "@/lib/store";
import { type RecordData } from "@/lib/data";
import { payAppointment } from "@/lib/business";

export function CustomerPay({
  appointment: a,
  notify,
  done,
}: {
  appointment: RecordData;
  notify: (s: string) => void;
  done: (a: RecordData) => void;
}) {
  const [method, setMethod] = useState("Pay at Salon");
  return (
    <div style={{ marginTop: 20 }}>
      <label>
        Payment option
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          {[
            "Pay at Salon",
            "Card",
            "JazzCash",
            "Easypaisa",
            "Bank Transfer",
          ].map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </label>
      <Button
        style={{ marginTop: 12 }}
        onClick={() => {
          if (method === "Pay at Salon") {
            notify("Payment due at salon");
            return;
          }
          try {
            useERP
              .getState()
              .transact((current) => payAppointment(current, a.id, method));
            done(useERP.getState().db.appointments.find((x) => x.id === a.id)!);
          } catch (err) {
            notify((err as Error).message);
            return;
          }
          notify(
            "Simulated payment successful. Receipt available in payment history.",
          );
        }}
      >
        Simulate payment
      </Button>
    </div>
  );
}
