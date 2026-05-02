"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { 
  Users, 
  CalendarCheck, 
  TrendingUp, 
  Clock,
  ChevronRight,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import {
  readDemoAppointments,
  seedDemoAppointments,
  writeDemoAppointments,
  type AppointmentStatus,
} from "@/lib/demoAppointments";
import { addDemoNotification } from "@/lib/demoNotifications";
import { getStatusTone, matchesStatusSearch } from "@/lib/demoStatus";
import { getAppointmentLabels, normalizeSearchValue } from "@/lib/appointmentLocalization";
import styles from "./Dashboard.module.css";

const DATA = [
  { name: 'Pzt', hastalar: 12, gelir: 2400 },
  { name: 'Sal', hastalar: 19, gelir: 3800 },
  { name: 'Çar', hastalar: 15, gelir: 3000 },
  { name: 'Per', hastalar: 22, gelir: 4400 },
  { name: 'Cum', hastalar: 28, gelir: 5600 },
  { name: 'Cmt', hastalar: 18, gelir: 3600 },
  { name: 'Paz', hastalar: 8, gelir: 1600 },
];

export default function DoctorDashboard() {
  const locale = useLocale();
  const t = useTranslations("panel.doctor");
  const tTreatments = useTranslations("treatments");
  const searchParams = useSearchParams();
  const searchQuery = normalizeSearchValue(searchParams.get("q") ?? "", locale);

  const [appointments, setAppointments] = useState(() => {
    seedDemoAppointments();
    return readDemoAppointments();
  });

  const statusLabels = useMemo<Record<AppointmentStatus, string>>(
    () => ({
      pending: t("statusPending"),
      inProgress: t("statusInProgress"),
      approved: t("statusApproved"),
      cancelled: t("statusCancelled"),
      completed: t("statusCompleted"),
    }),
    [t]
  );

  const visibleAppointments = useMemo(() => {
    return appointments
      .filter((apt) => {
        if (!searchQuery) {
          return true;
        }
        const labels = getAppointmentLabels(apt, locale, (key) => tTreatments(key), t("clinicUnassigned"));
        const haystack = normalizeSearchValue(
          `${apt.patient} ${labels.treatmentLabel} ${labels.clinicLabel} ${apt.time}`,
          locale
        );
        return haystack.includes(searchQuery) || matchesStatusSearch(apt.status, searchQuery, statusLabels, locale);
      })
      .slice(0, 4);
  }, [appointments, locale, searchQuery, statusLabels, t, tTreatments]);

  const statSummary = useMemo(() => {
    const completed = appointments.filter((item) => item.status === "completed" || item.status === "approved").length;
    const pending = appointments.filter((item) => item.status === "pending").length;
    const uniquePatients = new Set(appointments.map((item) => item.patient)).size;
    return { completed, pending, uniquePatients };
  }, [appointments]);

  const updateStatus = (id: number, status: AppointmentStatus) => {
    const target = appointments.find((apt) => apt.id === id);
    if (!target || target.status === status) {
      return;
    }
    const next = appointments.map((apt) => (apt.id === id ? { ...apt, status } : apt));
    setAppointments(next);
    writeDemoAppointments(next);
    addDemoNotification({
      role: "patient",
      title: t("appointmentStatusChanged"),
      message: `${target.patient} • ${statusLabels[status]}`,
      targetPath: "/patient/appointments",
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("welcomeTitle")}</h1>
      <p className={styles.subtitle}>{t("welcomeSubtitle")}</p>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon} style={{ color: "#BC0A18", background: "rgba(188, 10, 24, 0.1)" }}>
              <Users size={20} />
            </div>
            <span className={styles.statBadge}>+12%</span>
          </div>
          <div className={styles.statValue}>{statSummary.uniquePatients}</div>
          <div className={styles.statLabel}>{t("weeklyPatients")}</div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon} style={{ color: "#10b981", background: "rgba(16, 185, 129, 0.1)" }}>
              <CalendarCheck size={20} />
            </div>
            <span className={styles.statBadge}>+5%</span>
          </div>
          <div className={styles.statValue}>{statSummary.completed}</div>
          <div className={styles.statLabel}>{t("completedAppointments")}</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon} style={{ color: "#f59e0b", background: "rgba(245, 158, 11, 0.1)" }}>
              <TrendingUp size={20} />
            </div>
            <span className={styles.statBadge}>+18%</span>
          </div>
          <div className={styles.statValue}>€14,200</div>
          <div className={styles.statLabel}>{t("weeklyRevenue")}</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon} style={{ color: "#8b5cf6", background: "rgba(139, 92, 246, 0.1)" }}>
              <Clock size={20} />
            </div>
            <span className={styles.statBadge} style={{ background: "rgba(239, 68, 68, 0.15)", color: "#ef4444" }}>
              -2%
            </span>
          </div>
          <div className={styles.statValue}>{statSummary.pending}</div>
          <div className={styles.statLabel}>{t("pendingApprovals")}</div>
        </div>
      </div>

      <div className={styles.bottomGrid}>
        {/* Chart */}
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>{t("weeklyPerformance")}</h3>
            <select className={styles.select}>
              <option>{t("thisWeek")}</option>
              <option>{t("lastWeek")}</option>
              <option>{t("thisMonth")}</option>
            </select>
          </div>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGelir" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#BC0A18" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#BC0A18" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `€${val}`} />
                <Tooltip 
                  contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#BC0A18', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="gelir" stroke="#BC0A18" strokeWidth={3} fillOpacity={1} fill="url(#colorGelir)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Appointments List */}
        <div className={styles.listCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>{t("todaysAppointments")}</h3>
            <Link className={styles.viewAllBtn} href={`/${locale}/doctor/appointments`}>
              {t("viewAll")} <ChevronRight size={14} />
            </Link>
          </div>
          <div className={styles.list}>
            {visibleAppointments.map((apt) => (
              <div key={apt.id} className={styles.listItem}>
                {(() => {
                  const labels = getAppointmentLabels(apt, locale, (key) => tTreatments(key), t("clinicUnassigned"));
                  return (
                    <>
                <div className={styles.timeBlock}>
                  <span>{apt.time}</span>
                </div>
                <div className={styles.itemInfo}>
                  <div className={styles.itemName}>{apt.patient}</div>
                  <div className={styles.itemDesc}>{labels.treatmentLabel}</div>
                  {apt.intakeSummary ? <div className={styles.itemDesc}>{apt.intakeSummary}</div> : null}
                </div>
                <div className={`${styles.statusBadge} ${
                  getStatusTone(apt.status) === "warning"
                    ? styles.statusWarning
                    : getStatusTone(apt.status) === "primary"
                      ? styles.statusPrimary
                      : getStatusTone(apt.status) === "danger"
                        ? styles.statusDanger
                        : styles.statusSuccess
                }`}>
                  {statusLabels[apt.status]}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {(() => {
                    const disableCancel = apt.status === "cancelled" || apt.status === "completed";
                    const disableApprove = apt.status === "approved" || apt.status === "cancelled" || apt.status === "completed";
                    return (
                      <>
                  <button
                    className="btn btn-sm btn-ghost"
                    style={{ padding: "0.55rem 0.9rem" }}
                    onClick={() => updateStatus(apt.id, "cancelled")}
                    disabled={disableCancel}
                  >
                    <XCircle size={16} /> {t("cancel")}
                  </button>
                  <button
                    className="btn btn-sm btn-primary"
                    style={{ padding: "0.55rem 0.9rem" }}
                    onClick={() => updateStatus(apt.id, "approved")}
                    disabled={disableApprove}
                  >
                    <CheckCircle2 size={16} /> {t("approve")}
                  </button>
                      </>
                    );
                  })()}
                </div>
                    </>
                  );
                })()}
              </div>
            ))}
            {visibleAppointments.length === 0 ? (
              <div style={{ textAlign: "center", padding: "1.25rem", color: "var(--text-muted)" }}>
                {t("noAppointmentsYet")}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
