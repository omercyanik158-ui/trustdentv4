"use client";

import { useLayoutEffect } from "react";

/** Syncs `<html lang>` after navigation — root layout keeps a single `<html>` shell. */
export function DocumentLang({ locale }: { locale: string }) {
  useLayoutEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
