"use client";

import { useState, useEffect } from "react";
import { X, MapPin, CheckCircle2, User, Phone, Clock } from "lucide-react";
import styles from "./BookingModal.module.css";
import { useRouter } from "next/navigation";
import CalendarPopover from "./CalendarPopover";

type BookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
};

export default function BookingModal({ isOpen, onClose, locale }: BookingModalProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [treatment, setTreatment] = useState("");
  const [clinic, setClinic] = useState("");
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
        setStep(1); setTreatment(""); setClinic(""); setDate(""); setTime("");
      }, 300);
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleComplete = () => {
    // Save to localStorage to simulate DB
    const newAppointment = {
      id: Date.now(),
      treatment,
      clinic,
      date,
      time,
      status: "Onay Bekliyor",
      createdAt: new Date().toISOString()
    };
    
    const existing = JSON.parse(localStorage.getItem("trustdent_appointments") || "[]");
    localStorage.setItem("trustdent_appointments", JSON.stringify([newAppointment, ...existing]));
    
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
          <h2 className={styles.title}>Randevu Oluştur</h2>
          <div className={styles.progress}>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${(step / 4) * 100}%` }} />
            </div>
            <div className={styles.stepText}>Adım {step} / 4</div>
          </div>
        </div>

        <div className={styles.body}>
          {/* STEP 1: Treatment & Clinic */}
          {step === 1 && (
            <div className={styles.stepContainer}>
              <h3 className={styles.stepTitle}>Tedavi ve Klinik Seçimi</h3>
              <p className={styles.stepDesc}>Hangi tedavi için randevu almak istiyorsunuz?</p>
              
              <div className={styles.formGroup}>
                <label>Tedavi Türü</label>
                <select className="input" value={treatment} onChange={(e) => setTreatment(e.target.value)}>
                  <option value="">Seçiniz...</option>
                  <option value="İmplant">İmplant</option>
                  <option value="Zirkonyum Kaplama">Zirkonyum Kaplama</option>
                  <option value="Diş Beyazlatma">Diş Beyazlatma</option>
                  <option value="Kanal Tedavisi">Kanal Tedavisi</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Klinik (Opsiyonel)</label>
                <select className="input" value={clinic} onChange={(e) => setClinic(e.target.value)}>
                  <option value="Farketmez">En uygun kliniği benim için bul</option>
                  <option value="DentaLux İstanbul">DentaLux İstanbul</option>
                  <option value="Smile Clinic Antalya">Smile Clinic Antalya</option>
                  <option value="Istanbul Dental Center">Istanbul Dental Center</option>
                </select>
              </div>

              <button 
                className="btn btn-primary" 
                style={{ width: "100%", marginTop: "1rem" }}
                disabled={!treatment}
                onClick={() => setStep(2)}
              >
                Devam Et
              </button>
            </div>
          )}

          {/* STEP 2: Date & Time */}
          {step === 2 && (
            <div className={styles.stepContainer}>
              <h3 className={styles.stepTitle}>Tarih ve Saat</h3>
              <p className={styles.stepDesc}>Size uygun olan zaman dilimini seçin.</p>
              
              <div className={styles.formGroup}>
                <label>Tarih</label>
                <CalendarPopover locale={locale} value={date} onChange={setDate} label="Tarih Seçin" />
              </div>

              <div className={styles.formGroup}>
                <label>Saat Seçimi</label>
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
                <button className="btn btn-ghost" onClick={() => setStep(1)}>Geri</button>
                <button 
                  className="btn btn-primary" 
                  disabled={!date || !time}
                  onClick={() => setStep(3)}
                >
                  Devam Et
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Contact Info */}
          {step === 3 && (
            <div className={styles.stepContainer}>
              <h3 className={styles.stepTitle}>Kişisel Bilgiler</h3>
              <p className={styles.stepDesc}>Kayıtlı bilgileriniz otomatik olarak dolduruldu.</p>
              
              <div className={styles.formGroup}>
                <label><User size={14} style={{ display: "inline", marginRight: 4 }}/> Ad Soyad</label>
                <input type="text" className="input" value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className={styles.formGroup}>
                <label><Phone size={14} style={{ display: "inline", marginRight: 4 }}/> Telefon Numarası</label>
                <input type="tel" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>

              <div className={styles.summaryBox}>
                <div className={styles.summaryItem}><MapPin size={14}/> {clinic || "Farketmez"}</div>
                <div className={styles.summaryItem}><Clock size={14}/> {date} - {time}</div>
                <div className={styles.summaryItem}><strong>{treatment}</strong></div>
              </div>

              <div className={styles.actions}>
                <button className="btn btn-ghost" onClick={() => setStep(2)}>Geri</button>
                <button className="btn btn-primary" onClick={handleComplete}>
                  Randevuyu Onayla
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
              <h3 className={styles.successTitle}>Talebiniz Alındı!</h3>
              <p className={styles.successDesc}>
                Randevu talebiniz kliniğe iletildi. En kısa sürede sizinle iletişime geçeceğiz.
              </p>
              <button className="btn btn-primary" onClick={handleGoToDashboard} style={{ width: "100%" }}>
                Hasta Paneline Git
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
