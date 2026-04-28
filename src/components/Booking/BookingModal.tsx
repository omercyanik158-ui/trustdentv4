"use client";

import { useState, useEffect } from "react";
import { X, MapPin, CheckCircle2, User, Phone, Clock } from "lucide-react";
import styles from "./BookingModal.module.css";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import CalendarPopover from "./CalendarPopover";
import {
  readDemoAppointments,
  seedDemoAppointments,
  writeDemoAppointments,
  type DemoAppointment,
} from "@/lib/demoAppointments";

type BookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
};

export default function BookingModal({ isOpen, onClose, locale }: BookingModalProps) {
  const router = useRouter();
  const t = useTranslations("booking");
  const tTreatments = useTranslations("treatments");
  const [step, setStep] = useState(1);
  const [treatment, setTreatment] = useState("");
  const [clinic, setClinic] = useState("auto");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  
  // Mock User
  const [name, setName] = useState("Ahmet Yılmaz");
  const [phone, setPhone] = useState("+90 555 123 4567");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      // Reset form on close
      setTimeout(() => {
        setStep(1); setTreatment(""); setClinic("auto"); setDate(""); setTime("");
      }, 300);
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  const treatmentOptions = [
    { id: "implants", label: tTreatments("implants.title") },
    { id: "zirconia", label: tTreatments("zirconia.title") },
    { id: "whitening", label: tTreatments("whitening.title") },
    { id: "root-canal", label: tTreatments("root-canal.title") },
  ];

  const clinicOptions = [
    { id: "auto", label: t("clinicBestMatch") },
    { id: "DentaLux İstanbul", label: "DentaLux İstanbul" },
    { id: "Smile Clinic Antalya", label: "Smile Clinic Antalya" },
    { id: "Istanbul Dental Center", label: "Istanbul Dental Center" },
  ];

  const selectedTreatmentLabel =
    treatmentOptions.find((item) => item.id === treatment)?.label ?? treatment;
  const selectedClinicLabel =
    clinicOptions.find((item) => item.id === clinic)?.label ?? t("clinicBestMatch");

  const handleComplete = () => {
    seedDemoAppointments();
    // Save to localStorage to simulate DB
    const newAppointment: DemoAppointment = {
      id: Date.now(),
      patient: name,
      treatment: selectedTreatmentLabel,
      clinic: selectedClinicLabel,
      date,
      time,
      status: "pending",
      createdAt: new Date().toISOString()
    };
    
    const existing = readDemoAppointments();
    writeDemoAppointments([newAppointment, ...existing]);
    
    setStep(4); // Success step
  };

  const handleGoToDashboard = () => {
    onClose();
    router.push(`/${locale}/patient`);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>

        <div className={styles.header}>
          <h2 className={styles.title}>{t("title")}</h2>
          <div className={styles.progress}>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${(step / 4) * 100}%` }} />
            </div>
            <div className={styles.stepText}>{t("step", { current: step, total: 4 })}</div>
          </div>
        </div>

        <div className={styles.body}>
          {/* STEP 1: Treatment & Clinic */}
          {step === 1 && (
            <div className={styles.stepContainer}>
              <h3 className={styles.stepTitle}>{t("step1Title")}</h3>
              <p className={styles.stepDesc}>{t("step1Desc")}</p>
              
              <div className={styles.formGroup}>
                <label>{t("treatmentLabel")}</label>
                <select className="input" value={treatment} onChange={(e) => setTreatment(e.target.value)}>
                  <option value="">{t("choose")}</option>
                  {treatmentOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>{t("clinicLabel")}</label>
                <select className="input" value={clinic} onChange={(e) => setClinic(e.target.value)}>
                  {clinicOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <button 
                className="btn btn-primary" 
                style={{ width: "100%", marginTop: "1rem" }}
                disabled={!treatment}
                onClick={() => setStep(2)}
              >
                {t("continue")}
              </button>
            </div>
          )}

          {/* STEP 2: Date & Time */}
          {step === 2 && (
            <div className={styles.stepContainer}>
              <h3 className={styles.stepTitle}>{t("step2Title")}</h3>
              <p className={styles.stepDesc}>{t("step2Desc")}</p>
              
              <div className={styles.formGroup}>
                <label>{t("dateLabel")}</label>
                <CalendarPopover locale={locale} value={date} onChange={setDate} label={t("selectDate")} />
              </div>

              <div className={styles.formGroup}>
                <label>{t("timeLabel")}</label>
                <div className={styles.timeGrid}>
                  {["09:00", "10:30", "13:00", "14:30", "16:00"].map((t) => (
                    <button 
                      key={t}
                      className={`${styles.timeSlot} ${time === t ? styles.timeSelected : ""}`}
                      onClick={() => setTime(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.actions}>
                <button className="btn btn-ghost" onClick={() => setStep(1)}>{t("back")}</button>
                <button 
                  className="btn btn-primary" 
                  disabled={!date || !time}
                  onClick={() => setStep(3)}
                >
                  {t("continue")}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Contact Info */}
          {step === 3 && (
            <div className={styles.stepContainer}>
              <h3 className={styles.stepTitle}>{t("step3Title")}</h3>
              <p className={styles.stepDesc}>{t("step3Desc")}</p>
              
              <div className={styles.formGroup}>
                <label><User size={14} style={{ display: "inline", marginRight: 4 }}/>{t("fullNameLabel")}</label>
                <input type="text" className="input" value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className={styles.formGroup}>
                <label><Phone size={14} style={{ display: "inline", marginRight: 4 }}/>{t("phoneLabel")}</label>
                <input type="tel" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>

              <div className={styles.summaryBox}>
                <div className={styles.summaryItem}><MapPin size={14}/> {selectedClinicLabel}</div>
                <div className={styles.summaryItem}><Clock size={14}/> {date} - {time}</div>
                <div className={styles.summaryItem}><strong>{selectedTreatmentLabel}</strong></div>
              </div>

              <div className={styles.actions}>
                <button className="btn btn-ghost" onClick={() => setStep(2)}>{t("back")}</button>
                <button className="btn btn-primary" onClick={handleComplete}>
                  {t("confirmAppointment")}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Success */}
          {step === 4 && (
            <div className={styles.successState}>
              <div className={styles.successIcon}>
                <CheckCircle2 size={48} />
              </div>
              <h3 className={styles.successTitle}>{t("successTitle")}</h3>
              <p className={styles.successDesc}>
                {t("successDesc")}
              </p>
              <button className="btn btn-primary" onClick={handleGoToDashboard} style={{ width: "100%" }}>
                {t("goToPatientPanel")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
