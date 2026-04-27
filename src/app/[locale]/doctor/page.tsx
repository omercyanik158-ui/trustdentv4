"use client";

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

const APPOINTMENTS = [
  { id: 1, patient: "Ahmet Yılmaz", time: "09:00", treatment: "İmplant Kontrolü", status: "Bekliyor" },
  { id: 2, patient: "Sarah Miller", time: "10:30", treatment: "Zirkonyum Kaplama", status: "İşlemde" },
  { id: 3, patient: "Ali Vefa", time: "13:00", treatment: "Kanal Tedavisi", status: "Bekliyor" },
  { id: 4, patient: "Elena Popova", time: "14:45", treatment: "Beyazlatma", status: "Tamamlandı" },
];

export default function DoctorDashboard() {
  const appointments = APPOINTMENTS;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Hoş Geldiniz, Dr. Ayşe 👋</h1>
      <p className={styles.subtitle}>İşte bugünkü özetiniz ve haftalık performansınız.</p>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon} style={{ color: "#BC0A18", background: "rgba(188, 10, 24, 0.1)" }}>
              <Users size={20} />
            </div>
            <span className={styles.statBadge}>+12%</span>
          </div>
          <div className={styles.statValue}>124</div>
          <div className={styles.statLabel}>Bu Haftaki Hastalar</div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon} style={{ color: "#10b981", background: "rgba(16, 185, 129, 0.1)" }}>
              <CalendarCheck size={20} />
            </div>
            <span className={styles.statBadge}>+5%</span>
          </div>
          <div className={styles.statValue}>38</div>
          <div className={styles.statLabel}>Tamamlanan Randevu</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon} style={{ color: "#f59e0b", background: "rgba(245, 158, 11, 0.1)" }}>
              <TrendingUp size={20} />
            </div>
            <span className={styles.statBadge}>+18%</span>
          </div>
          <div className={styles.statValue}>€14,200</div>
          <div className={styles.statLabel}>Haftalık Gelir</div>
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
          <div className={styles.statValue}>8</div>
          <div className={styles.statLabel}>Bekleyen Onaylar</div>
        </div>
      </div>

      <div className={styles.bottomGrid}>
        {/* Chart */}
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Haftalık Performans</h3>
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
            <h3 className={styles.cardTitle}>Bugünkü Randevular</h3>
            <a className={styles.viewAllBtn} href="./doctor/appointments">
              Tümü <ChevronRight size={14} />
            </a>
          </div>
          <div className={styles.list}>
            {appointments.map((apt) => (
              <div key={apt.id} className={styles.listItem}>
                <div className={styles.timeBlock}>
                  <span>{apt.time}</span>
                </div>
                <div className={styles.itemInfo}>
                  <div className={styles.itemName}>{apt.patient}</div>
                  <div className={styles.itemDesc}>{apt.treatment}</div>
                </div>
                <div className={`${styles.statusBadge} ${
                  apt.status === 'Bekliyor' ? styles.statusWarning : 
                  apt.status === 'İşlemde' ? styles.statusPrimary : 
                  styles.statusSuccess
                }`}>
                  {apt.status}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-sm btn-ghost" style={{ padding: "0.55rem 0.9rem" }}>
                    <XCircle size={16} /> İptal
                  </button>
                  <button className="btn btn-sm btn-primary" style={{ padding: "0.55rem 0.9rem" }}>
                    <CheckCircle2 size={16} /> Onayla
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
