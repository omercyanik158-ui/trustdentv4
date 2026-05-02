"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import styles from "./Navbar.module.css";
import { AlertCircle, ChevronDown, Eye, EyeOff, Globe, Loader2, Menu, X } from "lucide-react";
import { sanitizeEmail, sanitizeText } from "@/lib/security";
import { trackEvent } from "@/lib/observability";

const LOCALES = [
  { code: "tr", label: "Türkçe" },
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "es", label: "Español" },
];

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; right: number } | null>(null);
  const langBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function openLang() {
    if (langBtnRef.current) {
      const rect = langBtnRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
    setLangOpen(true);
  }

  function changeLocale(newLocale: string) {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
    setLangOpen(false);
  }

  const navLinks = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/clinics`, label: t("clinics") },
    { href: `/${locale}/doctors`, label: t("doctors") },
    { href: `/${locale}/treatments`, label: t("treatments") },
    { href: `/${locale}/about`, label: t("about") },
  ];

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
        <div className={`container ${styles.inner}`}>
          {/* Logo */}
          <Link href={`/${locale}`} className={styles.logo}>
            <Image src="/logo_simple.svg" alt="TrustDent" className={styles.logoImg} width={32} height={32} />
            <div className={styles.logoMark}>
              <span className={styles.logoText}>Trust Dent</span>
              <span className={styles.logoBrand}>Türkiye</span>
            </div>
          </Link>

          {/* Nav Links - Desktop */}
          <ul className={styles.links}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={styles.link}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Actions */}
          <div className={styles.actions}>
            {/* Language Switcher */}
            <div className={styles.langWrapper}>
              <button
                ref={langBtnRef}
                className={styles.langBtn}
                onClick={() => langOpen ? setLangOpen(false) : openLang()}
                aria-label={t("changeLanguage")}
              >
                <Globe size={15} />
                <span className={styles.langCode}>{locale.toUpperCase()}</span>
                <ChevronDown size={14} className={langOpen ? styles.chevronUp : ""} />
              </button>
            </div>
            {langOpen && dropdownPos && typeof window !== "undefined" && createPortal(
              <div
                className={styles.langDropdown}
                style={{ position: "fixed", top: dropdownPos.top, right: dropdownPos.right, zIndex: 9999 }}
              >
                {LOCALES.map((lang) => (
                  <button
                    key={lang.code}
                    className={`${styles.langOption} ${lang.code === locale ? styles.langActive : ""}`}
                    onClick={() => changeLocale(lang.code)}
                  >
                    <span className={styles.langCheck}>{lang.code === locale ? "✓" : ""}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>,
              document.body
            )}

            {/* Auth Buttons */}
            <button
              className="btn btn-ghost btn-sm hide-mobile"
              onClick={() => setAuthOpen(true)}
            >
              {t("login")}
            </button>
            <button
              className="btn btn-primary btn-sm hide-mobile"
              onClick={() => setAuthOpen(true)}
            >
              {t("register")}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className={styles.menuBtn}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? t("closeMenu") : t("toggleMenu")}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className={styles.mobileMenu}>
            <ul className={styles.mobileLinks}>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={styles.mobileLink}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className={styles.mobileCtas}>
              <button className="btn btn-ghost" onClick={() => { setAuthOpen(true); setMobileOpen(false); }}>
                {t("login")}
              </button>
              <button className="btn btn-primary" onClick={() => { setAuthOpen(true); setMobileOpen(false); }}>
                {t("register")}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Auth Modal */}
      {authOpen && (
        <AuthModal onClose={() => setAuthOpen(false)} />
      )}

      {/* Backdrop for dropdowns */}
      {(langOpen) && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 9998 }}
          onClick={() => { setLangOpen(false); }}
        />
      )}
    </>
  );
}

/* ─── Auth Modal ──────────────────────────────────────────── */
type AuthMode = "login" | "register";
type FieldErrors = Partial<Record<"name" | "email" | "password", string>>;

function AuthModal({ onClose }: { onClose: () => void }) {
  const t = useTranslations("auth");
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const [website, setWebsite] = useState("");
  const [lastSubmitAt, setLastSubmitAt] = useState(0);

  // Body scroll lock + ESC to close
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  function switchMode(next: AuthMode) {
    setMode(next);
    setErrors({});
    setInfo(null);
  }

  function validate(input: { name: string; email: string; password: string }): FieldErrors {
    const next: FieldErrors = {};
    if (mode === "register") {
      if (input.name.trim().length < 2) next.name = t("errorNameShort");
    }
    if (!input.email.trim()) next.email = t("errorRequired");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) next.email = t("errorEmailInvalid");
    if (input.password.length < 6) next.password = t("errorPasswordShort");
    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (website.trim()) return; // Honeypot field for naive bots.
    if (Date.now() - lastSubmitAt < 800) return;

    const safeName = sanitizeText(name, 80);
    const safeEmail = sanitizeEmail(email);
    const safePassword = password.trim();
    setName(safeName);
    setEmail(safeEmail);
    setPassword(safePassword);

    setInfo(null);
    const next = validate({ name: safeName, email: safeEmail, password: safePassword });
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // No backend yet — simulate work and show a friendly notice.
    // Once NextAuth is wired, replace this block with `signIn()` / `/api/auth/register`.
    setSubmitting(true);
    setLastSubmitAt(Date.now());
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setInfo(t("comingSoon"));
    trackEvent("auth_submit_demo", { mode });
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className={styles.authModal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <button className={styles.authClose} onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        {/* Logo */}
        <div className={styles.authLogo}>
          <Image
            src="/logo_simple.svg"
            alt="TrustDent"
            className={styles.logoImg}
            width={40}
            height={40}
            style={{ height: 40, width: "auto" }}
          />
          <div className={styles.logoMark}>
            <span className={styles.logoText} style={{ fontSize: "1.25rem" }}>Trust Dent</span>
            <span className={styles.logoBrand}>Türkiye</span>
          </div>
        </div>

        <h2 id="auth-modal-title" className={styles.authTitle}>
          {mode === "login" ? t("loginTitle") : t("registerTitle")}
        </h2>
        <p className={styles.authSubtitle}>
          {mode === "login" ? t("loginSubtitle") : t("registerSubtitle")}
        </p>

        {/* Social Buttons */}
        <div className={styles.socialBtns}>
          <button
            type="button"
            className={styles.socialBtn}
            onClick={() => setInfo(t("comingSoon"))}
            disabled={submitting}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {t("continueWithGoogle")}
          </button>
          <button
            type="button"
            className={styles.socialBtn}
            onClick={() => setInfo(t("comingSoon"))}
            disabled={submitting}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            {t("continueWithApple")}
          </button>
        </div>

        {/* Divider */}
        <div className={styles.authDivider}>
          <span className={styles.authDividerLine} />
          <span className={styles.authDividerText}>{t("orEmail")}</span>
          <span className={styles.authDividerLine} />
        </div>

        {/* Email Form */}
        <form className={styles.authForm} onSubmit={handleSubmit} noValidate>
          <input
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }}
          />
          {mode === "register" && (
            <div className={styles.fieldGroup}>
              <input
                className={`input ${errors.name ? styles.inputError : ""}`}
                type="text"
                placeholder={t("fullName")}
                value={name}
                onChange={(e) => setName(sanitizeText(e.target.value, 80))}
                disabled={submitting}
                autoComplete="name"
              />
              {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
            </div>
          )}

          <div className={styles.fieldGroup}>
            <input
              className={`input ${errors.email ? styles.inputError : ""}`}
              type="email"
              placeholder={t("email")}
              value={email}
              onChange={(e) => setEmail(sanitizeEmail(e.target.value))}
              disabled={submitting}
              autoComplete="email"
              inputMode="email"
            />
            {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.passwordWrap}>
              <input
                className={`input ${errors.password ? styles.inputError : ""}`}
                type={showPassword ? "text" : "password"}
                placeholder={t("password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                disabled={submitting}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
          </div>

          {mode === "login" && (
            <button
              type="button"
              className={styles.authForgot}
              onClick={() => setInfo(t("comingSoon"))}
              disabled={submitting}
            >
              {t("forgotPassword")}
            </button>
          )}

          {info && (
            <div className={styles.authNotice} role="status">
              <AlertCircle size={16} aria-hidden="true" />
              <span>{info}</span>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%" }}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 size={16} className={styles.spinner} aria-hidden="true" />
                {mode === "login" ? t("loggingIn") : t("registering")}
              </>
            ) : mode === "login" ? (
              t("loginTitle")
            ) : (
              t("registerTitle")
            )}
          </button>
        </form>

        {/* Switch Mode */}
        <p className={styles.authSwitch}>
          {mode === "login" ? t("notMember") : t("alreadyMember")}{" "}
          <button
            type="button"
            className={styles.authSwitchBtn}
            onClick={() => switchMode(mode === "login" ? "register" : "login")}
            disabled={submitting}
          >
            {mode === "login" ? t("registerLink") : t("loginLink")}
          </button>
        </p>
      </div>
    </div>
  );
}
