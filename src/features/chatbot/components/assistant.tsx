"use client";
import { useState } from "react";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useERP } from "@/lib/store";
import { money, today } from "@/lib/data";
export function Assistant({ navigate }: { navigate: (page: string) => void }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      user: false,
      text: "Welcome to Maison. I’m a local demo assistant. Ask about booking, services, memberships, your schedule or salon performance.",
    },
  ]);
  const { db, role } = useERP();
  const answer = (q: string) => {
    const text = q.toLowerCase();
    const ownApps = db.appointments.filter(
      (a) =>
        (role !== "customer" || a.customer === "c0") &&
        (role !== "staff" || a.staff === "t0"),
    );
    if (/revenue|sales|income/.test(text))
      return role === "admin" || role === "receptionist"
        ? `Recorded collections total ${money(db.payments.reduce((n, p) => n + Number(p.amount), 0))}. Open Reports to filter by branch or date.`
        : "Your financial information is available in your profile or earnings page. Business revenue is available to the owner.";
    if (/stock|product/.test(text))
      return role === "admin"
        ? `${db.products.filter((p) => Number(p.quantity) < Number(p.minimum)).length} products are below minimum stock. Open Inventory to record stock receipts or adjustments.`
        : "Your receptionist can help with product availability and checkout.";
    if (/membership|package/.test(text))
      return "Gold Beauty Package includes 3 facials, 2 hair treatments and 2 manicures, with 15% off additional services. Browse Memberships, open Details and simulate a purchase.";
    if (/appointment|schedule|today/.test(text))
      return `You have ${ownApps.filter((a) => a.date === today()).length} appointments today in this demo. Open Appointments to view details, available slots or progress through check-in and service completion.`;
    if (/book|slot/.test(text))
      return "Open Appointments → Book appointment. Select branch, service, therapist, date and an available slot. Availability accounts for working hours, breaks, leave and existing bookings.";
    if (/hair|facial|massage|service|price/.test(text)) {
      const found = db.services
        .filter(
          (s) =>
            text.includes(s.name.toLowerCase()) ||
            s.name
              .toLowerCase()
              .includes(text.split(" ").find((x) => x.length > 4) || "hair"),
        )
        .slice(0, 3);
      return (found.length ? found : db.services.slice(0, 3))
        .map(
          (s) => `${s.name}: ${money(Number(s.price))}, ${s.duration} minutes.`,
        )
        .join(" ");
    }
    if (/payment|jazz|easy|card/.test(text))
      return "Payments are simulated. Card, JazzCash, Easypaisa and bank transfer are available; POS also supports cash and wallet, partial payments, coupons and receipts. No real money is moved.";
    if (/loyal|point/.test(text))
      return "Earn 10 loyalty points per Rs. 1,000 paid. Every 100 points can be redeemed for Rs. 100 in POS. See My Profile for your balance.";
    return "I can help with services and prices, booking steps, schedules, memberships, loyalty, payments and authorized business totals. This demo uses local rules and your shared mock data; it does not call an external AI service.";
  };
  const send = (q: string) => {
    if (!q.trim()) return;
    setMessages((m) => [
      ...m,
      { user: true, text: q },
      { user: false, text: answer(q) },
    ]);
    setInput("");
  };
  return (
    <div className="chat">
      {open && (
        <section className="chat-panel">
          <div className="card-head">
            <h2>
              <Sparkles
                size={15}
                style={{ display: "inline", color: "var(--accent)" }}
              />{" "}
              Maison assistant
            </h2>
            <Button
              variant="ghost"
              size="sm"
              aria-label="Close assistant"
              onClick={() => setOpen(false)}
            >
              <X size={14} />
            </Button>
          </div>
          <p className="muted" style={{ fontSize: 10 }}>
            LOCAL DEMO · NO EXTERNAL AI CONNECTION
          </p>
          <div className="actions" style={{ marginTop: 12 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("Appointments")}
            >
              Open appointments
            </Button>
            {role === "customer" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("Memberships")}
              >
                Open memberships
              </Button>
            )}
            {role === "admin" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("Reports")}
              >
                Open reports
              </Button>
            )}
          </div>
          <div className="messages" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={"message " + (m.user ? "user" : "")}>
                {m.text}
              </div>
            ))}
          </div>
          <div className="actions" style={{ marginBottom: 12 }}>
            {["How do I book?", "Memberships", "Payment options"].map((q) => (
              <Button
                key={q}
                variant="outline"
                size="sm"
                onClick={() => send(q)}
              >
                {q}
              </Button>
            ))}
          </div>
          <form
            style={{ display: "flex", gap: 8 }}
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              aria-label="Message assistant"
              placeholder="Ask Maison…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button type="submit" aria-label="Send message">
              <Send size={15} />
            </Button>
          </form>
        </section>
      )}
      <Button onClick={() => setOpen(!open)}>
        <MessageCircle size={17} />
        Maison assistant
      </Button>
    </div>
  );
}
