type EventPayload = Record<string, string | number | boolean | null | undefined>;

export function reportError(error: unknown, context?: string) {
  if (process.env.NODE_ENV !== "production") {
    console.error("[TrustDent][error]", context ?? "unknown", error);
  }
  // Placeholder: send sanitized error metadata to Sentry/Bugsnag in production.
}

export function trackEvent(name: string, payload?: EventPayload) {
  if (process.env.NODE_ENV !== "production") {
    return;
  }
  // Placeholder: send event to GA4/PostHog in production.
  void name;
  void payload;
}
