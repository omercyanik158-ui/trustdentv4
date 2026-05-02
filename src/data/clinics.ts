import type { Clinic } from "./types";

/**
 * Mock clinic catalog used by vitrine pages.
 *
 * Replace this with a Prisma query (`prisma.clinic.findMany()`) once the DB
 * is wired up — the rest of the UI consumes the same `Clinic` shape.
 */
export const CLINICS: Clinic[] = [
  {
    id: 1,
    slug: "dentalux-istanbul",
    name: "DentaLux İstanbul",
    city: "İstanbul",
    district: "Şişli",
    location: "Şişli, İstanbul",
    rating: 4.9,
    reviews: 847,
    specialties: ["implants", "zirconia", "veneers"],
    blurb:
      "İmplant ve zirkonya alanında uzman ekip, şeffaf planlama ve hızlı randevu. Süreç boyunca birebir takip ve yüksek hasta memnuniyeti.",
    verified: true,
    badgeKey: "badgeMostPreferred",
    badgeColor: "#BC0A18",
    lat: 41.0602,
    lng: 28.9877,
  },
  {
    id: 2,
    slug: "smile-clinic-antalya",
    name: "Smile Clinic Antalya",
    city: "Antalya",
    district: "Lara",
    location: "Lara, Antalya",
    rating: 4.8,
    reviews: 562,
    specialties: ["whitening", "orthodontics", "implants"],
    blurb:
      "Tatil planına uyumlu randevu saatleri, dijital ölçüm ve konfor odaklı uygulamalar. Beyazlatma ve ortodontide güçlü sonuçlar.",
    verified: true,
    badgeKey: "badgeJci",
    badgeColor: "#D4AF37",
    lat: 36.8841,
    lng: 30.7056,
  },
  {
    id: 3,
    slug: "pearldent-ankara",
    name: "PearlDent Ankara",
    city: "Ankara",
    district: "Çankaya",
    location: "Çankaya, Ankara",
    rating: 4.7,
    reviews: 389,
    specialties: ["root-canal", "veneers", "implants"],
    blurb:
      "Kanal tedavisi ve estetik gülüş tasarımında detaycı yaklaşım. Tedavi planı net, iletişim hızlı ve sonrası destek güçlü.",
    verified: true,
    badgeKey: "badgeNewlyOpened",
    badgeColor: "#BC0A18",
    lat: 39.9334,
    lng: 32.8597,
  },
  {
    id: 4,
    slug: "istanbul-dental-center",
    name: "Istanbul Dental Center",
    city: "İstanbul",
    district: "Beşiktaş",
    location: "Beşiktaş, İstanbul",
    rating: 4.8,
    reviews: 1204,
    specialties: ["full-mouth", "zirconia", "whitening"],
    blurb:
      "Tam ağız rehabilitasyon süreçlerinde deneyimli ekip. Gülüş estetiği odaklı planlama, premium malzeme seçenekleri ve düzenli kontrol.",
    verified: true,
    badgeKey: "badgePremium",
    badgeColor: "#D4AF37",
    lat: 41.0422,
    lng: 29.0089,
  },
  {
    id: 5,
    slug: "meddent-izmir",
    name: "MedDent İzmir",
    city: "İzmir",
    district: "Alsancak",
    location: "Alsancak, İzmir",
    rating: 4.6,
    reviews: 298,
    specialties: ["orthodontics", "whitening", "veneers"],
    blurb:
      "Bütçe dostu seçenekler ve net bilgilendirme. Plak/ortodonti planlaması, beyazlatma ve lamine süreçlerinde düzenli takip.",
    verified: false,
    badgeKey: null,
    badgeColor: null,
    lat: 38.4237,
    lng: 27.1428,
  },
  {
    id: 6,
    slug: "goldensmile-bursa",
    name: "GoldenSmile Bursa",
    city: "Bursa",
    district: "Nilüfer",
    location: "Nilüfer, Bursa",
    rating: 4.7,
    reviews: 412,
    specialties: ["implants", "root-canal"],
    blurb:
      "Güven veren klinik deneyimi: steril çalışma, açıklayıcı hekim iletişimi ve hızlı dönüş. İmplant ve kanal tedavisinde istikrarlı sonuçlar.",
    verified: true,
    badgeKey: null,
    badgeColor: null,
    lat: 40.2189,
    lng: 28.8597,
  },
];

/** Subset projection used by the homepage map (only what Leaflet needs). */
export const CLINICS_MAP = CLINICS.map(({ id, name, location, lat, lng, rating }) => ({
  id,
  name,
  location,
  lat,
  lng,
  rating,
}));

export function getClinicById(id: number): Clinic | undefined {
  return CLINICS.find((c) => c.id === id);
}

export function getClinicBySlug(slug: string): Clinic | undefined {
  return CLINICS.find((c) => c.slug === slug);
}
