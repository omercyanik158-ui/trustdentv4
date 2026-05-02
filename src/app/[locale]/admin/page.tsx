"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Users, Activity, MousePointerClick, Globe } from "lucide-react";
import styles from "../doctor/Dashboard.module.css"; // Reuse the doctor styles for layout
import adminStyles from "./AdminPage.module.css";

type AdminSection = "dashboard" | "users" | "activity" | "settings";
type Decision = "approved" | "rejected";
type AdminEntity = "appointment" | "clinic" | "doctor";
const ADMIN_DECISIONS_KEY = "trustdent_admin_decisions";

type AdminItem = {
  id: number;
  entity: AdminEntity;
  action: string;
  user: string;
  time: string;
  type: "primary" | "warning" | "success";
  details: Array<{ label: string; value: string }>;
};

export default function AdminDashboard() {
  const t = useTranslations("panel.admin");
  const tc = useTranslations("common");
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = (searchParams.get("q") ?? "").trim().toLowerCase();
  const section = (searchParams.get("section") ?? "dashboard") as AdminSection;
  const [settingState, setSettingState] = useState<Record<number, boolean>>({});
  const [openDetailId, setOpenDetailId] = useState<number | null>(null);
  const [decisions, setDecisions] = useState<Record<number, Decision>>(() => {
    if (typeof window === "undefined") return {};
    const raw = window.localStorage.getItem(ADMIN_DECISIONS_KEY);
    if (!raw) return {};
    try {
      return JSON.parse(raw) as Record<number, Decision>;
    } catch {
      return {};
    }
  });

  const sectionButtons = [
    { id: "dashboard", label: t("dashboard") },
    { id: "users", label: t("usersAndClinics") },
    { id: "activity", label: t("activity") },
    { id: "settings", label: t("settings") },
  ] as const;

  const activityItems = useMemo<AdminItem[]>(
    () => [
      {
        id: 1,
        entity: "appointment",
        action: t("newAppointmentRequest"),
        user: "John Doe (UK)",
        time: t("minutesAgo", { count: 5 }),
        type: "primary",
        details: [
          { label: t("fieldPatient"), value: "John Doe" },
          { label: t("fieldTreatment"), value: "Dental Implants" },
          { label: t("fieldPreferredDate"), value: "2026-05-02" },
          { label: t("fieldPreferredTime"), value: "10:30" },
          { label: t("fieldClinic"), value: "DentaLux Istanbul" },
          { label: t("fieldNote"), value: "Airport transfer requested" },
        ],
      },
      {
        id: 2,
        entity: "clinic",
        action: t("clinicApprovalPending"),
        user: "Smile Center",
        time: t("hoursAgo", { count: 1 }),
        type: "warning",
        details: [
          { label: t("fieldClinicName"), value: "Smile Center Antalya" },
          { label: t("fieldCity"), value: "Antalya" },
          { label: t("fieldLicense"), value: "TR-CL-4471" },
          { label: t("fieldSpecialties"), value: "Zirconia, Whitening" },
          { label: t("fieldContact"), value: "+90 242 000 00 00" },
        ],
      },
      {
        id: 3,
        entity: "doctor",
        action: t("newDoctorSignup"),
        user: "Dr. Caner",
        time: t("hoursAgo", { count: 3 }),
        type: "success",
        details: [
          { label: t("fieldDoctorName"), value: "Dr. Caner Demir" },
          { label: t("fieldTreatment"), value: "Implantology" },
          { label: t("fieldExperience"), value: "9 years" },
          { label: t("fieldLanguages"), value: "TR, EN" },
          { label: t("fieldClinic"), value: "Istanbul Dental Center" },
        ],
      },
    ],
    [t]
  );

  const userItems = useMemo<AdminItem[]>(
    () => [
      {
        id: 11,
        entity: "doctor",
        action: t("newDoctorSignup"),
        user: "Dr. Elif Yalcin",
        time: t("hoursAgo", { count: 2 }),
        type: "primary",
        details: [
          { label: t("fieldDoctorName"), value: "Dr. Elif Yalcin" },
          { label: t("fieldTreatment"), value: "Orthodontics" },
          { label: t("fieldExperience"), value: "6 years" },
          { label: t("fieldLanguages"), value: "TR, EN, DE" },
          { label: t("fieldClinic"), value: "Dent Group Istanbul" },
        ],
      },
      {
        id: 12,
        entity: "clinic",
        action: t("clinicApprovalPending"),
        user: "Dent Group Istanbul",
        time: t("hoursAgo", { count: 4 }),
        type: "warning",
        details: [
          { label: t("fieldClinicName"), value: "Dent Group Istanbul" },
          { label: t("fieldCity"), value: "Istanbul" },
          { label: t("fieldLicense"), value: "TR-CL-5920" },
          { label: t("fieldSpecialties"), value: "Implants, Full Mouth Restoration" },
          { label: t("fieldContact"), value: "info@dentgroup.com" },
        ],
      },
      {
        id: 13,
        entity: "appointment",
        action: t("newAppointmentRequest"),
        user: "Maria G. (ES)",
        time: t("minutesAgo", { count: 45 }),
        type: "success",
        details: [
          { label: t("fieldPatient"), value: "Maria Gonzalez" },
          { label: t("fieldTreatment"), value: "Porcelain Veneers" },
          { label: t("fieldPreferredDate"), value: "2026-05-05" },
          { label: t("fieldPreferredTime"), value: "14:00" },
          { label: t("fieldClinic"), value: "Smile Clinic Antalya" },
          { label: t("fieldNote"), value: "Wants translator support" },
        ],
      },
    ],
    [t]
  );

  const settingsItems = useMemo(
    () =>
      [
        { id: 21, name: t("settings"), desc: t("adminMode") },
        { id: 22, name: t("activity"), desc: t("recentActivities") },
        { id: 23, name: t("usersAndClinics"), desc: t("title") },
      ].filter((item) => {
        if (!searchQuery) {
          return true;
        }
        return `${item.name} ${item.desc}`.toLowerCase().includes(searchQuery);
      }),
    [searchQuery, t]
  );

  const filteredActivity = useMemo(
    () =>
      activityItems.filter((item) => {
        if (!searchQuery) {
          return true;
        }
        return `${item.action} ${item.user} ${item.time} ${item.details.map((d) => d.value).join(" ")}`
          .toLowerCase()
          .includes(searchQuery);
      }),
    [activityItems, searchQuery]
  );

  const filteredUsers = useMemo(
    () =>
      userItems.filter((item) => {
        if (!searchQuery) {
          return true;
        }
        return `${item.action} ${item.user} ${item.time} ${item.details.map((d) => d.value).join(" ")}`
          .toLowerCase()
          .includes(searchQuery);
      }),
    [searchQuery, userItems]
  );

  const dashboardItems = useMemo(() => filteredActivity.slice(0, 2), [filteredActivity]);
  const rows =
    section === "dashboard"
      ? dashboardItems
      : section === "users"
        ? filteredUsers
        : section === "settings"
          ? settingsItems
          : filteredActivity;

  const buildSectionHref = (nextSection: AdminSection) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("section", nextSection);
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  const handleSectionChange = (nextSection: AdminSection) => {
    router.push(buildSectionHref(nextSection));
  };

  const handleDecision = (id: number, decision: Decision) => {
    setDecisions((prev) => {
      const next = { ...prev, [id]: decision };
      if (typeof window !== "undefined") {
        window.localStorage.setItem(ADMIN_DECISIONS_KEY, JSON.stringify(next));
      }
      return next;
    });
  };

  const getDetailTitle = (entity: AdminEntity) => {
    if (entity === "appointment") return t("detailsTitleAppointment");
    if (entity === "clinic") return t("detailsTitleClinic");
    return t("detailsTitleDoctor");
  };

  const toggleSetting = (id: number) => {
    setSettingState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("title")}</h1>
      <p className={styles.subtitle}>{t("subtitle")}</p>

      {/* Admin Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon} style={{ color: "#3b82f6", background: "rgba(59, 130, 246, 0.1)" }}>
              <Users size={20} />
            </div>
            <span className={styles.statBadge}>+24%</span>
          </div>
          <div className={styles.statValue}>1,204</div>
          <div className={styles.statLabel}>{t("totalRegisteredPatients")}</div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon} style={{ color: "#10b981", background: "rgba(16, 185, 129, 0.1)" }}>
              <Activity size={20} />
            </div>
            <span className={styles.statBadge}>+12%</span>
          </div>
          <div className={styles.statValue}>85</div>
          <div className={styles.statLabel}>{t("activeDoctors")}</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon} style={{ color: "#f59e0b", background: "rgba(245, 158, 11, 0.1)" }}>
              <MousePointerClick size={20} />
            </div>
            <span className={styles.statBadge}>+5%</span>
          </div>
          <div className={styles.statValue}>45.2K</div>
          <div className={styles.statLabel}>{t("monthlyVisits")}</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon} style={{ color: "#ec4899", background: "rgba(236, 72, 153, 0.1)" }}>
              <Globe size={20} />
            </div>
          </div>
          <div className={styles.statValue}>12</div>
          <div className={styles.statLabel}>{t("internationalLeads")}</div>
        </div>
      </div>

      <div className={styles.bottomGrid}>
        {/* Recent Activity */}
        <div className={styles.listCard} style={{ gridColumn: "1 / -1" }}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>
              {section === "dashboard"
                ? t("dashboard")
                : section === "users"
                ? t("usersAndClinics")
                : section === "settings"
                  ? t("settings")
                  : t("recentActivities")}
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {sectionButtons.map((button) => (
                <button
                  key={button.id}
                  className={`btn btn-sm ${adminStyles.tabBtn} ${
                    section === button.id ? "btn-primary" : adminStyles.tabBtnInactive
                  }`}
                  onClick={() => handleSectionChange(button.id)}
                >
                  {button.label}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.list}>
            {rows.map((item) => (
              <div key={item.id} className={styles.listItem}>
                <div className={styles.timeBlock}>
                  {"time" in item ? item.time : t("review")}
                </div>
                <div className={styles.itemInfo}>
                  <div className={styles.itemName}>{"action" in item ? item.action : item.name}</div>
                  <div className={styles.itemDesc}>{"user" in item ? item.user : item.desc}</div>
                </div>
                {section === "settings" ? (
                  <button
                    className={`btn btn-sm ${settingState[item.id] ? "btn-primary" : "btn-ghost"}`}
                    onClick={() => toggleSetting(item.id)}
                  >
                    {settingState[item.id] ? `${tc("save")} ✓` : tc("save")}
                  </button>
                ) : (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button
                      className={`btn btn-sm btn-primary ${adminStyles.reviewBtn}`}
                      onClick={() => {
                        setOpenDetailId((prev) => (prev === item.id ? null : item.id));
                      }}
                    >
                      {openDetailId === item.id ? t("hideDetails") : t("review")}
                    </button>
                  </div>
                )}
              </div>
            ))}
            {rows.length === 0 ? (
              <div style={{ textAlign: "center", padding: "1.25rem", color: "var(--text-muted)" }}>
                {t("noResults")}
              </div>
            ) : null}
            {section !== "settings" && openDetailId !== null
              ? rows
                  .filter((row): row is AdminItem => "entity" in row)
                  .filter((row) => row.id === openDetailId)
                  .map((row) => (
                    <div key={`detail-${row.id}`} className={adminStyles.detailPanel}>
                      <div className={adminStyles.detailTitle}>{getDetailTitle(row.entity)}</div>
                      <div className={adminStyles.detailGrid}>
                        {row.details.map((detail: { label: string; value: string }) => (
                          <div key={`${row.id}-${detail.label}`} className={adminStyles.detailItem}>
                            <span className={adminStyles.detailLabel}>{detail.label}</span>
                            <span className={adminStyles.detailValue}>{detail.value}</span>
                          </div>
                        ))}
                      </div>
                      {decisions[row.id] ? (
                        <div
                          className={`${adminStyles.decisionBadge} ${
                            decisions[row.id] === "approved"
                              ? adminStyles.decisionApproved
                              : adminStyles.decisionRejected
                          }`}
                        >
                          {decisions[row.id] === "approved" ? t("approved") : t("rejected")}
                        </div>
                      ) : (
                        <div className={adminStyles.detailActions}>
                          <button className="btn btn-sm btn-primary" onClick={() => handleDecision(row.id, "approved")}>
                            {t("approveRequest")}
                          </button>
                          <button className="btn btn-sm btn-ghost" onClick={() => handleDecision(row.id, "rejected")}>
                            {t("rejectRequest")}
                          </button>
                        </div>
                      )}
                    </div>
                  ))
              : null}
          </div>
        </div>
      </div>
    </div>
  );
}
