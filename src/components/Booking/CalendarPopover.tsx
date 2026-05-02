"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  isSameDay,
  isSameMonth,
  isBefore,
  startOfToday,
} from "date-fns";
import { de, enUS, es, tr } from "date-fns/locale";
import { Calendar as CalIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("booking");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const selected = useMemo(() => toDate(value), [value]);
  const today = useMemo(() => startOfToday(), []);
  const [viewMonth, setViewMonth] = useState<Date>(selected ?? today);

  const dfLocale = locale?.startsWith("tr")
    ? tr
    : locale?.startsWith("de")
      ? de
      : locale?.startsWith("es")
        ? es
        : enUS;
  const buttonText = selected ? format(selected, "PPP", { locale: dfLocale }) : label;

  const weekDays = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1, locale: dfLocale });
    return Array.from({ length: 7 }).map((_, i) =>
      format(addDays(start, i), "EEEEEE", { locale: dfLocale })
    );
  }, [dfLocale]);

  const days = useMemo(() => {
    const monthStart = startOfMonth(viewMonth);
    const monthEnd = endOfMonth(viewMonth);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const out: Date[] = [];
    let cursor = gridStart;
    while (cursor <= gridEnd) {
      out.push(cursor);
      cursor = addDays(cursor, 1);
    }
    return out;
  }, [viewMonth]);

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

  const goPrev = () => {
    setViewMonth((m) => addMonths(m, -1));
  };

  const goNext = () => {
    setViewMonth((m) => addMonths(m, 1));
  };

  const handlePick = (d: Date) => {
    onChange(format(d, "yyyy-MM-dd"));
    setOpen(false);
  };

  const monthLabel = format(viewMonth, "LLLL yyyy", { locale: dfLocale });

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

      {open && (
          <div className={styles.calendarPopover} role="dialog" aria-label={label}>
            {/* Header */}
            <div className={styles.calHeader}>
              <button
                type="button"
                className={styles.calNavBtn}
                onClick={goPrev}
                aria-label={t("prevMonth")}
              >
                <ChevronLeft size={16} />
              </button>

              <div className={styles.calMonthLabel}>
                <span>{monthLabel}</span>
              </div>

              <button
                type="button"
                className={styles.calNavBtn}
                onClick={goNext}
                aria-label={t("nextMonth")}
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Weekday labels */}
            <div className={styles.calWeekRow}>
              {weekDays.map((d, i) => (
                <div key={i} className={styles.calWeekCell}>
                  {d}
                </div>
              ))}
            </div>

            {/* Days grid - animated month transition */}
            <div className={styles.calDaysWrapper}>
                <div className={styles.calDaysGrid}>
                  {days.map((day, i) => {
                    const isOutside = !isSameMonth(day, viewMonth);
                    const isToday = isSameDay(day, today);
                    const isSelected = selected ? isSameDay(day, selected) : false;
                    const isPast = isBefore(day, today);
                    const isDisabled = isPast;

                    const cls = [styles.calDay];
                    if (isOutside) cls.push(styles.calDayOutside);
                    if (isToday) cls.push(styles.calDayToday);
                    if (isSelected) cls.push(styles.calDaySelected);
                    if (isDisabled) cls.push(styles.calDayDisabled);

                    return (
                      <button
                        key={i}
                        type="button"
                        className={cls.join(" ")}
                        onClick={() => !isDisabled && handlePick(day)}
                        disabled={isDisabled}
                        tabIndex={isDisabled ? -1 : 0}
                        aria-label={format(day, "PPP", { locale: dfLocale })}
                        data-selected={isSelected ? "true" : "false"}
                      >
                        <span className={styles.calDayNum}>{format(day, "d")}</span>
                      </button>
                    );
                  })}
                </div>
            </div>
          </div>
        )}
    </div>
  );
}
