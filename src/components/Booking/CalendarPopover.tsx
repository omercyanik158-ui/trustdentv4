"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { format, parseISO } from "date-fns";
import { enUS, tr } from "date-fns/locale";
import { Calendar as CalIcon, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./BookingModal.module.css";

type Props = {
  locale: string;
  value: string; // yyyy-MM-dd
  onChange: (next: string) => void;
  label: string;
};

function toDate(value: string): Date | undefined {
  if (!value) return undefined;
  try {
    return parseISO(value);
  } catch {
    return undefined;
  }
}

export default function CalendarPopover({ locale, value, onChange, label }: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const selected = useMemo(() => toDate(value), [value]);

  const dfLocale = locale?.startsWith("tr") ? tr : enUS;
  const buttonText = selected ? format(selected, "PPP", { locale: dfLocale }) : label;

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      const el = wrapRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className={styles.dateField}>
      <button
        type="button"
        className={`${styles.dateButton} input`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.dateButtonIcon} aria-hidden="true">
          <CalIcon size={16} />
        </span>
        <span className={styles.dateButtonText}>{buttonText}</span>
      </button>

      {open ? (
        <div className={styles.calendarPopover} role="dialog" aria-label={label}>
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(d) => {
              if (!d) return;
              onChange(format(d, "yyyy-MM-dd"));
              setOpen(false);
            }}
            weekStartsOn={1}
            showOutsideDays
            fromDate={new Date()}
            locale={dfLocale}
            className={styles.calendarRoot}
            classNames={{
              months: styles.calMonths,
              month: styles.calMonth,
              caption: styles.calCaption,
              caption_label: styles.calCaptionLabel,
              nav: styles.calNav,
              nav_button: styles.calNavButton,
              table: styles.calTable,
              head_row: styles.calHeadRow,
              head_cell: styles.calHeadCell,
              row: styles.calRow,
              cell: styles.calCell,
              day: styles.calDay,
              day_today: styles.calDayToday,
              day_selected: styles.calDaySelected,
              day_outside: styles.calDayOutside,
              day_disabled: styles.calDayDisabled,
            }}
            components={{
              Chevron: ({ orientation }) =>
                orientation === "left" ? <ChevronLeft size={16} /> : <ChevronRight size={16} />,
            }}
          />
        </div>
      ) : null}
    </div>
  );
}

