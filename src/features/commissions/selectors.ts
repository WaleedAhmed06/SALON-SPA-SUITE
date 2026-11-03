import { type Database, type RecordData } from "@/lib/data";
import { type SaleLine } from "@/features/pos/types";
export function commission(
  db: Database,
  staffId: string,
): (RecordData & { earned: number; rate: number })[] {
  return db.appointments
    .filter(
      (a) =>
        a.staff === staffId && a.status === "Completed" && a.payment === "Paid",
    )
    .map((a) => {
      const service = db.services.find((s) => s.id === a.service);
      const person = db.staff.find((s) => s.id === staffId);
      const rate = Number(service?.commission ?? person?.commission ?? 20);
      const invoice = db.payments.find(
        (p) => p.appointment === a.id && p.status === "Paid" && p.items,
      );
      const lines: SaleLine[] = invoice
        ? JSON.parse(String(invoice.items))
        : [];
      const earned = lines.length
        ? lines
            .filter((l) => l.type === "service")
            .reduce(
              (n, l) =>
                n +
                (l.price *
                  l.quantity *
                  Number(
                    db.services.find((s) => s.id === l.id)?.commission ??
                      person?.commission ??
                      20,
                  )) /
                  100,
              0,
            )
        : (Number(service?.price || 0) * rate) / 100;
      return { ...a, earned, rate };
    });
}
