"use client";
import { useEffect, useRef } from "react";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Modal({
  title,
  close,
  children,
}: {
  title: string;
  close: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const old = document.activeElement as HTMLElement;
    const focusables = () =>
      Array.from(
        ref.current?.querySelectorAll<HTMLElement>(
          "button,input,select,textarea,a[href]",
        ) || [],
      ).filter((e) => !e.hasAttribute("disabled"));
    focusables()[0]?.focus();
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        const list = focusables();
        if (e.shiftKey && document.activeElement === list[0]) {
          e.preventDefault();
          list.at(-1)?.focus();
        } else if (!e.shiftKey && document.activeElement === list.at(-1)) {
          e.preventDefault();
          list[0]?.focus();
        }
      }
    };
    document.addEventListener("keydown", handle);
    return () => {
      document.removeEventListener("keydown", handle);
      old?.focus();
    };
  }, []);
  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <section
        ref={ref}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="card-head">
          <h2>{title}</h2>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close dialog"
            onClick={close}
          >
            <X size={18} />
          </Button>
        </div>
        {children}
      </section>
    </div>
  );
}
