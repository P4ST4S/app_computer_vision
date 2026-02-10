"use client";

type DiagnosticLevel = "info" | "warn" | "error";

interface DiagnosticPayload {
  event: string;
  level?: DiagnosticLevel;
  details?: Record<string, unknown>;
}

const DIAGNOSTIC_ENDPOINT = "/api/diagnostics";

export function logDiagnostic({
  event,
  level = "info",
  details = {},
}: DiagnosticPayload): void {
  const payload = {
    ts: new Date().toISOString(),
    event,
    level,
    path: typeof window !== "undefined" ? window.location.pathname : "unknown",
    href: typeof window !== "undefined" ? window.location.href : "unknown",
    ua: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
    details,
  };

  const prefix = `[Diag][${event}]`;
  if (level === "error") {
    console.error(prefix, payload);
  } else if (level === "warn") {
    console.warn(prefix, payload);
  } else {
    console.log(prefix, payload);
  }

  try {
    const body = JSON.stringify(payload);
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon(DIAGNOSTIC_ENDPOINT, blob);
      return;
    }

    fetch(DIAGNOSTIC_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {
      // Best effort logging only.
    });
  } catch {
    // Best effort logging only.
  }
}

