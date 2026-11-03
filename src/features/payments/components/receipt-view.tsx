"use client";

import { Button } from "@/components/ui/button";
import { useERP } from "@/lib/store";
import { type RecordData, money } from "@/lib/data";
import { exportFile, exportPdf, receiptRows } from "@/lib/export";

import { Modal } from "@/components/ui/modal";

import { label } from "@/lib/labels";
import { type Line } from "@/features/pos/types";
export function ReceiptView({
  receipt: r,
  close,
}: {
  receipt: RecordData;
  close: () => void;
}) {
  const { db } = useERP();
  const rows = receiptRows(r, db.customers, db.branches);
  return (
    <Modal title="Payment receipt" close={close}>
      <div className="eyebrow">MAISON · SIMULATED TRANSACTION</div>
      <h2>{r.name}</h2>
      <div className="form-grid">
        {Object.entries(r)
          .filter(([k]) => !["id", "items"].includes(k))
          .map(([k, v]) => (
            <div key={k}>
              <p className="muted" style={{ fontSize: 10, marginBottom: 6 }}>
                {label(k)}
              </p>
              <p style={{ fontSize: 12 }}>
                {k === "customer"
                  ? db.customers.find((c) => c.id === v)?.name
                  : String(v)}
              </p>
            </div>
          ))}
      </div>
      {r.items && (
        <div>
          {(JSON.parse(String(r.items)) as Line[]).map((l) => (
            <div className="list-row" key={l.id}>
              {l.name} × {l.quantity}
              <span style={{ marginLeft: "auto" }}>
                {money(l.price * l.quantity)}
              </span>
            </div>
          ))}
        </div>
      )}
      <p style={{ marginBottom: 20 }}>
        Outstanding: {money(Number(r.total) - Number(r.amount))}
      </p>
      <div className="actions">
        <Button
          onClick={() =>
            exportPdf(r.name, rows, [
              "Payment receipt",
              `Customer: ${db.customers.find((c) => c.id === r.customer)?.name || r.customer}`,
              `Amount collected: ${money(Number(r.amount))}`,
              `Outstanding: ${money(Number(r.total) - Number(r.amount))}`,
            ])
          }
        >
          Download receipt PDF
        </Button>
        <Button variant="outline" onClick={() => window.print()}>
          Print receipt
        </Button>
        <Button variant="outline" onClick={() => exportFile(r.name, rows)}>
          Download receipt CSV
        </Button>
      </div>
    </Modal>
  );
}
