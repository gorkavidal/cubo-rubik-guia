import React, { useState } from "react";
import { T, FONT_DISPLAY } from "../lib/theme.js";

export default function Collapsible({ title, children, open: defaultOpen }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div style={{ border: "1px solid " + T.line, borderRadius: 12, background: T.panel, overflow: "hidden", marginBottom: 14 }}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        style={{ width: "100%", textAlign: "left", padding: "12px 16px", background: "transparent", border: "none", color: T.text, cursor: "pointer", fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 13, letterSpacing: 0.5, textTransform: "uppercase", display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <span>{title}</span>
        <span style={{ color: T.muted, fontSize: 18, lineHeight: 1 }}>{open ? "–" : "+"}</span>
      </button>
      {open && <div style={{ padding: "0 16px 16px" }}>{children}</div>}
    </div>
  );
}
