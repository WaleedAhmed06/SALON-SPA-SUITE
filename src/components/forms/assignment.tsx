"use client";

import { type RecordData } from "@/lib/data";

export function Assignment({
  value,
  records,
  onChange,
}: {
  value: string;
  records: RecordData[];
  onChange: (s: string) => void;
}) {
  return (
    <div>
      <select
        value={value === "all" ? "all" : "selected"}
        onChange={(e) => onChange(e.target.value === "all" ? "all" : "")}
      >
        <option value="all">All available</option>
        <option value="selected">Selected records</option>
      </select>
      {value !== "all" && (
        <div style={{ maxHeight: 130, overflow: "auto", marginTop: 10 }}>
          {records.map((r) => (
            <label
              style={{ display: "flex", alignItems: "center", margin: "6px 0" }}
              key={r.id}
            >
              <input
                type="checkbox"
                style={{ width: 15 }}
                checked={value.split(",").includes(r.id)}
                onChange={(e) =>
                  onChange(
                    (e.target.checked
                      ? [...value.split(",").filter(Boolean), r.id]
                      : value.split(",").filter((x) => x !== r.id)
                    ).join(","),
                  )
                }
              />
              {r.name}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
