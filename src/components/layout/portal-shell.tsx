"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Modules } from "@/components/layout/module-router";
import { Assistant } from "@/features/chatbot/components/assistant";

import {
  Scissors,
  Bell,
  Sun,
  Moon,
  Search,
  Plus,
  ArrowUpRight,
  LogOut,
  Menu,
  Sparkles,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useERP } from "@/lib/store";
import { roles, roleLabels, type Role } from "@/lib/data";

import { Dashboard } from "@/features/dashboard/components/dashboard-screen";
import { navItems } from "./navigation";
import { access } from "@/features/auth/permissions";
import { authenticateDemo } from "@/features/auth/actions";
export default function Home({
  portal,
  section,
}: { portal?: string; section?: string } = {}) {
  const router = useRouter();
  const s = useERP();
  const [ready, setReady] = useState(false);
  const [page, setPage] = useState("Dashboard");
  useEffect(() => {
    const found = navItems.find(
      ([n]) =>
        n.toLowerCase().replaceAll(" & ", "-").replaceAll(" ", "-") === section,
    );
    if (found && s.role && access[s.role].includes(found[0])) setPage(found[0]);
    else setPage("Dashboard");
  }, [section, s.role]);
  const [mobile, setMobile] = useState(false);
  const [toast, setToast] = useState("");
  const [email, setEmail] = useState("admin@salondemo.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  useEffect(() => {
    setReady(true);
    const sync = (e: StorageEvent) => {
      if (e.key === "maison-salon-erp-v1") useERP.persist.rehydrate();
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = s.theme;
    document.documentElement.style.colorScheme = s.theme;
  }, [s.theme]);
  useEffect(() => {
    if (ready && s.role && portal && portal !== s.role)
      router.replace("/" + s.role);
  }, [ready, s.role, portal, router]);
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(""), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);
  const notify = (m: string) => {
    s.notify(m);
    setToast(m);
  };
  if (!ready) return <main className="empty">Preparing your salon…</main>;
  const login = (r: Role) => {
    s.login(r);
    setPage("Dashboard");
    router.push("/" + r);
  };
  if (!s.role)
    return (
      <main data-theme={s.theme} className="login">
        <section className="login-art">
          <Brand />
          <div>
            <div className="eyebrow">THE ART OF RUNNING BEAUTIFULLY</div>
            <h1>
              Exceptional care.
              <br />
              Effortless business.
            </h1>
            <p>
              One connected home for your people, your clients and every
              beautiful moment in between.
            </p>
          </div>
          <p>
            MAISON • SALON & SPA MANAGEMENT
            <br />A frontend demo. All payments are simulated.
          </p>
        </section>
        <section className="login-form">
          <Button
            className="login-theme"
            variant="outline"
            aria-label="Toggle theme"
            onClick={s.toggle}
          >
            {s.theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}{" "}
            {s.theme === "dark" ? "Light mode" : "Dark mode"}
          </Button>
          <div className="eyebrow">WELCOME TO MAISON</div>
          <h2>Your day, beautifully organized.</h2>
          <p className="muted">Sign in to your salon workspace.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              try {
                login(authenticateDemo(email, password));
              } catch (err) {
                setError((err as Error).message);
              }
            }}
          >
            <label>
              Email address
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            <Button type="submit">
              Sign in to workspace <ArrowUpRight size={15} />
            </Button>
          </form>
          <div className="eyebrow">EXPLORE A DEMO PORTAL</div>
          <div className="role-grid">
            {roles.map((r) => (
              <Button key={r} variant="outline" onClick={() => login(r)}>
                {roleLabels[r]} <ChevronRight size={14} />
              </Button>
            ))}
          </div>
          <p className="muted" style={{ fontSize: 11, marginTop: 25 }}>
            Demo password: 123456 · Your changes stay in this browser.
          </p>
        </section>
      </main>
    );
  const role = s.role;
  const go = (p: string) => {
    setMobile(false);
    router.push(
      "/" +
        role +
        "/" +
        p.toLowerCase().replaceAll(" & ", "-").replaceAll(" ", "-"),
    );
  };
  return (
    <div data-theme={s.theme} className="shell">
      <aside className={"sidebar " + (mobile ? "open" : "")}>
        <Brand />
        <div className="navgroup">
          WORKSPACE · {roleLabels[role].toUpperCase()}
        </div>
        <nav className="nav">
          {navItems
            .filter(([n]) => access[role].includes(n))
            .map(([name, Icon]) => (
              <button
                key={name}
                className={page === name ? "active" : ""}
                onClick={() => go(name)}
              >
                <Icon size={17} />
                {name}
                {name === "Appointments" && (
                  <span style={{ marginLeft: "auto", fontSize: 10 }}>
                    {s.db.appointments.length}
                  </span>
                )}
              </button>
            ))}
        </nav>
        <div className="sidebar-foot">
          <Sparkles
            size={16}
            style={{ color: "var(--accent)", marginBottom: 7 }}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (
                window.confirm(
                  "Reset all demo changes and restore sample data?",
                )
              ) {
                s.reset();
                s.setBranch("all");
                notify("Demo data restored");
              }
            }}
          >
            Reset demo data
          </Button>
          <strong>A little more beautiful.</strong>
          <p className="muted">Your entire salon, connected.</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              s.logout();
              setMobile(false);
              router.push("/");
            }}
          >
            <LogOut size={13} /> Sign out
          </Button>
        </div>
      </aside>
      <section className="workspace">
        <header className="topbar">
          <Button
            className="mobile-menu"
            variant="ghost"
            aria-label="Toggle navigation"
            onClick={() => setMobile(!mobile)}
          >
            <Menu size={20} />
          </Button>
          <div className="search">
            <Search size={16} /> Your salon, at a glance{" "}
            <span style={{ marginLeft: 25, fontSize: 10 }}>FRONTEND DEMO</span>
          </div>
          <div className="top-actions">
            <select
              aria-label="Switch demo role"
              value={role}
              onChange={(e) => login(e.target.value as Role)}
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {roleLabels[r]}
                </option>
              ))}
            </select>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={s.toggle}
            >
              {s.theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Notifications"
              onClick={() => go("Notifications")}
            >
              <Bell size={17} />
            </Button>
            <div className="avatar">
              {role === "customer" ? "AK" : role === "staff" ? "AK" : "SA"}
            </div>
            <div className="user-name">
              <strong style={{ fontSize: 11 }}>
                {role === "customer"
                  ? "Ayesha Khan"
                  : role === "staff"
                    ? "Ayesha Khan"
                    : "Sara Ahmed"}
              </strong>
              <p className="muted" style={{ fontSize: 9, marginTop: 4 }}>
                {roleLabels[role]}
              </p>
            </div>
          </div>
        </header>
        <main className="content">
          <div className="heading">
            <div>
              <div className="eyebrow">
                MAISON / {roleLabels[role].toUpperCase()}
              </div>
              <h1>
                {page === "Dashboard"
                  ? role === "customer"
                    ? "Your moments of well-being"
                    : role === "staff"
                      ? "Your day, at a glance"
                      : "Business overview"
                  : page}
              </h1>
              <p>
                {page === "Dashboard"
                  ? "A thoughtful view of everything happening in your salon."
                  : "Manage every detail. Keep everything connected."}
              </p>
            </div>
            <div className="actions">
              {role === "admin" && (
                <select
                  aria-label="Branch filter"
                  style={{ width: 170 }}
                  value={s.branch}
                  onChange={(e) => s.setBranch(e.target.value)}
                >
                  <option value="all">All branches</option>
                  {s.db.branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              )}
              <Button
                onClick={() => {
                  if (role !== "staff") s.startBooking();
                  go("Appointments");
                }}
              >
                <Plus size={15} />
                {role === "staff" ? "My appointments" : "New appointment"}
              </Button>
            </div>
          </div>
          {page === "Dashboard" ? (
            <Dashboard role={role} go={go} />
          ) : (
            <Module page={page} role={role} notify={notify} navigate={go} />
          )}
          <footer
            className="muted"
            style={{
              fontSize: 10,
              marginTop: 30,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>
              © {new Date().getFullYear()} Maison. Made for beautiful
              businesses.
            </span>
            <span>PKR · Demo workspace</span>
          </footer>
        </main>
      </section>
      <Assistant navigate={go} />
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
function Brand() {
  return (
    <div className="brand">
      <div className="brandmark">
        <Scissors size={19} />
      </div>
      <div>
        <strong>maison</strong>
        <small>SALON & SPA SUITE</small>
      </div>
    </div>
  );
}
function Module(props: {
  page: string;
  role: Role;
  notify: (s: string) => void;
  navigate: (page: string) => void;
}) {
  return <Modules {...props} />;
}
