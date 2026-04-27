"use client";

import { useEffect, useMemo, useState } from "react";
import { Mail, Phone, Users } from "lucide-react";
import styles from "../Dashboard.module.css";

type Appointment = {
  id: number;
  treatment: string;
  clinic: string;
  date: string;
  time: string;
  status: string;
  createdAt: string;
};

type Patient = {
  id: string;
  name: string;
  totalAppointments: number;
  lastTreatment: string;
};

export default function DoctorPatientsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("trustdent_appointments");
    if (!saved) return;
    try {
      setAppointments(JSON.parse(saved));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const patients = useMemo<Patient[]>(() => {
    const map = new Map<string, Patient>();
    for (const a of appointments) {
      const name = "Hasta"; // booking flow currently doesn't store patient name in appointment object
      const existing = map.get(name);
      if (!existing) {
        map.set(name, {
          id: name,
          name,
          totalAppointments: 1,
          lastTreatment: a.treatment,
        });
      } else {
        existing.totalAppointments += 1;
        existing.lastTreatment = a.treatment;
      }
    }
    return Array.from(map.values());
  }, [appointments]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Hastalarım</h1>
      <p className={styles.subtitle}>Hasta listesi ve özetleri. (Demo: randevu verisinden türetilir.)</p>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon} style={{ color: "#BC0A18", background: "rgba(188, 10, 24, 0.1)" }}>
              <Users size={20} />
            </div>
          </div>
          <div className={styles.statValue}>{patients.length}</div>
          <div className={styles.statLabel}>Toplam Hasta</div>
        </div>
      </div>

      <div className={styles.listCard} style={{ marginTop: "1.25rem" }}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Liste</h3>
        </div>
        <div className={styles.list}>
          {patients.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
              Henüz hasta kaydı yok.
            </div>
          ) : (
            patients.map((p) => (
              <div key={p.id} className={styles.listItem}>
                <div className={styles.timeBlock} style={{ width: 62 }}>
                  {p.totalAppointments}
                </div>
                <div className={styles.itemInfo}>
                  <div className={styles.itemName}>{p.name}</div>
                  <div className={styles.itemDesc}>Son işlem: {p.lastTreatment}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-sm btn-ghost" style={{ padding: "0.55rem 0.9rem" }}>
                    <Phone size={16} /> Ara
                  </button>
                  <button className="btn btn-sm btn-ghost" style={{ padding: "0.55rem 0.9rem" }}>
                    <Mail size={16} /> Mesaj
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

