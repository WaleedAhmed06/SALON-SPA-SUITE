import { type RecordData } from "@/types";
import { label } from "./labels";
export type ExportRow = Record<string, string | number>;
const omitted = new Set(["image", "receipt", "items"]);
export function exportColumns(rows: ExportRow[]) {
  return Array.from(new Set(rows.flatMap(Object.keys))).filter(
    (k) => !omitted.has(k),
  );
}
export function buildCsv(rows: ExportRow[]) {
  const keys = exportColumns(rows);
  const data = keys.length
    ? [keys.map(label), ...rows.map((r) => keys.map((k) => r[k] ?? ""))]
    : [["Status"], ["No records match the selected filters."]];
  return (
    "\uFEFF" +
    data
      .map((row) =>
        row.map((v) => '"' + String(v).replaceAll('"', '""') + '"').join(","),
      )
      .join("\r\n") +
    "\r\n"
  );
}
export function downloadBlob(name: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name.replace(/[<>:"/\\|?*]/g, "-");
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60000);
}
export function exportFile(name: string, rows: ExportRow[]) {
  downloadBlob(
    name + ".csv",
    new Blob([buildCsv(rows)], { type: "text/csv;charset=utf-8;" }),
  );
}
export async function buildPdf(
  title: string,
  rows: ExportRow[],
  context: string[] = [],
) {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);
  const keys = exportColumns(rows);
  const doc = new jsPDF({
    orientation: keys.length > 6 ? "landscape" : "portrait",
    unit: "mm",
    format: "a4",
  });
  doc.setProperties({
    title,
    author: "Maison Salon & Spa",
    subject: "Frontend demo export",
  });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(23, 43, 35);
  doc.text("MAISON | Salon & Spa", 14, 17);
  doc.setFontSize(12);
  doc.text(title, 14, 25);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const details = ["Simulated demo data | Currency: PKR", ...context];
  let y = 32;
  for (const line of details) {
    const wrapped = doc.splitTextToSize(
      line,
      doc.internal.pageSize.getWidth() - 28,
    );
    doc.text(wrapped, 14, y);
    y += wrapped.length * 4 + 2;
  }
  autoTable(doc, {
    startY: y + 2,
    head: [
      keys.length > 10
        ? ["Record", "Field", "Value"]
        : keys.length
          ? keys.map(label)
          : ["Status"],
    ],
    body:
      keys.length > 10
        ? rows.flatMap((r, i) =>
            keys.map((k) => [
              String(r.name || i + 1),
              label(k),
              String(r[k] ?? ""),
            ]),
          )
        : keys.length
          ? rows.map((r) => keys.map((k) => String(r[k] ?? "")))
          : [["No records match the selected filters."]],
    margin: { left: 14, right: 14, bottom: 16 },
    styles: {
      font: "helvetica",
      fontSize: 8,
      cellPadding: 2,
      overflow: "linebreak",
      textColor: [23, 43, 35],
    },
    headStyles: { fillColor: [36, 115, 94], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [246, 250, 247] },
    rowPageBreak: "avoid",
  });
  const count = doc.getNumberOfPages();
  for (let page = 1; page <= count; page++) {
    doc.setPage(page);
    doc.setFontSize(8);
    doc.setTextColor(82, 102, 91);
    doc.text(
      `Page ${page} of ${count}`,
      14,
      doc.internal.pageSize.getHeight() - 8,
    );
  }
  return doc.output("arraybuffer");
}
export async function exportPdf(
  title: string,
  rows: ExportRow[],
  context: string[] = [],
) {
  const bytes = await buildPdf(title, rows, context);
  downloadBlob(title + ".pdf", new Blob([bytes], { type: "application/pdf" }));
}
export function receiptRows(
  receipt: RecordData,
  customers: RecordData[],
  branches: RecordData[],
): ExportRow[] {
  const { items, image, receipt: attachment, ...metadata } = receipt;
  void image;
  void attachment;
  const details: ExportRow = {
    ...metadata,
    customer:
      customers.find((c) => c.id === receipt.customer)?.name ||
      receipt.customer,
    branch:
      branches.find((b) => b.id === receipt.branch)?.name || receipt.branch,
    outstanding: Number(receipt.total) - Number(receipt.amount),
  };
  const rows: ExportRow[] = Object.entries(details)
    .filter(([key]) => key !== "id")
    .map(([key, value]) => ({
      section: "Invoice",
      description: label(key),
      value,
      quantity: "",
      unitPrice: "",
      lineTotal: "",
    }));
  if (items) {
    try {
      const parsed = JSON.parse(String(items)) as {
        name: string;
        quantity: number;
        price: number;
      }[];
      for (const line of parsed)
        rows.push({
          section: "Item",
          description: line.name,
          value: "",
          quantity: line.quantity,
          unitPrice: line.price,
          lineTotal: line.price * line.quantity,
        });
    } catch {
      rows.push({
        section: "Item",
        description: "Line item details unavailable",
      });
    }
  }
  return rows;
}
