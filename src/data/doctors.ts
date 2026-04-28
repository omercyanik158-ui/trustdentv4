import type { Doctor } from "./types";

/**
 * Mock doctor roster.
 *
 * `clinicId` ties each doctor to an entry in `CLINICS` so the relation is
 * explicit and we don't rely on string equality of clinic names.
 */
export const DOCTORS: Doctor[] = [
  {
    id: 1,
    name: "Dr. Ayşe Demir",
    initials: "AD",
    title: "İmplantoloji Uzmanı",
    clinicId: 1,
    clinicName: "DentaLux İstanbul",
    rating: 4.9,
    reviews: 428,
    review:
      "Süreç baştan sona çok şeffaftı. Doktorum her adımı detaylıca anlattı ve sonuç beklediğimden bile daha doğal oldu. Kendisine ve ekibine güleryüzlü yaklaşımları için çok teşekkür ederim.",
  },
  {
    id: 2,
    name: "Dr. Caner Yılmaz",
    initials: "CY",
    title: "Estetik Diş Hekimi",
    clinicId: 2,
    clinicName: "Smile Clinic Antalya",
    rating: 4.8,
    reviews: 312,
    review:
      "İletişim mükemmeldi ve tüm ekip süreç boyunca çok ilgiliydi. Tedavi planı son derece netti ve randevular tam zamanında gerçekleşti. Modern teknolojileri sayesinde kendimi çok güvende hissettim.",
  },
  {
    id: 3,
    name: "Dr. Selin Kaya",
    initials: "SK",
    title: "Ortodontist",
    clinicId: 3,
    clinicName: "PearlDent Ankara",
    rating: 5.0,
    reviews: 186,
    review:
      "Şeffaf plak sürecinde her aşamada detaylıca bilgilendirildim. Kontroller son derece düzenliydi ve çok kısa sürede gülüşümde ciddi farklar gördüm. Kesinlikle profesyonel bir yaklaşım.",
  },
  {
    id: 4,
    name: "Dr. Mehmet Arslan",
    initials: "MA",
    title: "Protetik Diş Tedavisi",
    clinicId: 4,
    clinicName: "Istanbul Dental Center",
    rating: 4.9,
    reviews: 245,
    review:
      "Detaycı yaklaşımı ve sunduğu premium malzeme seçenekleriyle harika bir deneyimdi. Sonuçlar estetik açıdan mükemmel ve kullanım konforu çok yüksek. Herkese gönül rahatlığıyla tavsiye ederim.",
  },
  {
    id: 5,
    name: "Dr. Elif Şahin",
    initials: "EŞ",
    title: "Endodonti",
    clinicId: 5,
    clinicName: "MedDent İzmir",
    rating: 4.7,
    reviews: 156,
    review:
      "Ağrısız ve oldukça konforlu bir tedavi süreci geçirdim. Her kontrol sonrasında neyin neden yapıldığını net şekilde öğrendim ve kendimi emin ellerde hissettim. Başarılı bir ekip.",
  },
  {
    id: 6,
    name: "Dr. Deniz Acar",
    initials: "DA",
    title: "Estetik Uygulamalar",
    clinicId: 6,
    clinicName: "GoldenSmile Bursa",
    rating: 4.8,
    reviews: 214,
    review:
      "Beyazlatma sonrası elde edilen sonuç çok doğal ve parlak kaldı. Küçük dokunuşlarla gülüşümde ciddi bir iyileşme sağlandı. Profesyonel bakış açısı ve ilgi alaka için teşekkürler.",
  },
];

export function getDoctorById(id: number): Doctor | undefined {
  return DOCTORS.find((d) => d.id === id);
}

export function getDoctorsByClinic(clinicId: number): Doctor[] {
  return DOCTORS.filter((d) => d.clinicId === clinicId);
}
