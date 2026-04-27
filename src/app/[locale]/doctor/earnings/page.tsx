"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import styles from "../Dashboard.module.css";

const DATA = [
  { name: "Pzt", gelir: 2400 },
  { name: "Sal", gelir: 3800 },
  { name: "Çar", gelir: 3000 },
  { name: "Per", gelir: 4400 },
  { name: "Cum", gelir: 5600 },
  { name: "Cmt", gelir: 3600 },
  { name: "Paz", gelir: 1600 },
];

export default function DoctorEarningsPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Kazançlar</h1>
      <p className={styles.subtitle}>Haftalık gelir trendi ve performans özeti. (Demo verisi)</p>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon} style={{ color: "#10b981", background: "rgba(16, 185, 129, 0.1)" }}>
              <TrendingUp size={20} />
            </div>
            <span className={styles.statBadge}>+18%</span>
          </div>
          <div className={styles.statValue}>€14,200</div>
          <div className={styles.statLabel}>Bu Hafta</div>
        </div>
      </div>

      <div className={styles.chartCard} style={{ marginTop: "1.25rem" }}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Gelir Grafiği</h3>
          <select className={styles.select}>
            <option>Bu Hafta</option>
            <option>Geçen Hafta</option>
            <option>Bu Ay</option>
          </select>
        </div>
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorEarning" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#BC0A18" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#BC0A18" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `€${val}`} />
              <Tooltip
                contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                itemStyle={{ color: "#BC0A18", fontWeight: 700 }}
              />
              <Area type="monotone" dataKey="gelir" stroke="#BC0A18" strokeWidth={3} fillOpacity={1} fill="url(#colorEarning)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

