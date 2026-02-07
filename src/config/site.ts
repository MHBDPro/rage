/**
 * Site Configuration
 *
 * This is the SINGLE SOURCE OF TRUTH for all branding, colors, text, and settings.
 * Edit this file to customize the platform for different clients.
 *
 * Quick Start:
 * 1. Change brand.name and brand.tagline for new organization
 * 2. Update colors (or use a preset from presets.ts)
 * 3. Update ui strings for translations
 * 4. Run `pnpm build` to apply changes
 */

import type { SiteConfig } from "./types";
import { getPreset } from "./presets";

// Get the emerald-cyber preset to match logo's green gradient
const preset = getPreset("emerald-cyber")!;

export const siteConfig: SiteConfig = {
  // ============================================
  // BRAND IDENTITY
  // ============================================
  brand: {
    name: "RCSF",
    tagline: "ORGANİZASYON",
    fullName: "RCSF ORGANİZASYON",
    description:
      "Türkiye'nin önde gelen PUBG Mobile esports organizasyonu. Günlük maçlarda yarışın ve liderlik tablosunda yerinizi alın.",
    copyrightHolder: "RCSF ORGANİZASYON",
  },

  // ============================================
  // THEME COLORS
  // Use preset.colors or define custom colors
  // ============================================
  colors: preset.colors,

  // ============================================
  // SEO CONFIGURATION
  // ============================================
  seo: {
    defaultTitle: "RCSF ORGANİZASYON | PUBG Mobile Esports Platformu",
    titleTemplate: "%s | RCSF ORGANİZASYON",
    description:
      "RCSF organizasyonu - Türkiye'nin premier PUBG Mobile esports maç platformu. Takımınızı kaydedin, liderlik tablolarını takip edin ve günlük maçlarda yarışın.",
    keywords: [
      "RCSF organizasyonu",
      "RCSF organization",
      "RCSF ORGANİZASYON",
      "PUBG Mobile",
      "PUBG Mobile Türkiye",
      "Esports Maç",
      "Maç Organizasyonu",
      "Esports Turnuva",
      "RCSF",
      "PUBG Mobile Esports",
      "Battle Royale",
      "Gaming Organization",
    ],
    locale: "tr_TR",
    htmlLang: "tr",
    ogType: "website",
    twitterCard: "summary_large_image",
  },

  // ============================================
  // CONTENT STRINGS (Game-specific)
  // ============================================
  content: {
    gameName: "PUBG Mobile",
    scrimTerm: "Maç",
    scrimTermPlural: "Maçlar",
    heroTitle: "Scrim Arenası",
    heroSubtitle:
      "Dinamik oturumlar, yeni haritalar ve sezonun en iyi takımları.",
    systemStatusOnline: "Tüm Sistemler Çalışıyor",
    registrationOpen: "Kayıt Açık",
    registrationClosed: "Kayıt {time} saatinde açılıyor",
  },

  // ============================================
  // UI STRINGS (All user-facing text)
  // Translate this section for different languages
  // ============================================
  ui: {
    // Navigation
    nav: {
      home: "Ana Sayfa",
      leaderboard: "Liderlik Tablosu",
      rules: "Kurallar",
      adminPanel: "Kontrol Paneli",
    },

    // Slot/Registration
    slots: {
      available: "MÜSAİT",
      filled: "DOLU",
      total: "Toplam Slot",
      open: "AÇIK SLOT",
      locked: "KİLİTLİ",
      offline: "ÇEVRİMDIŞI",
      online: "ÇEVRİMİÇİ",
      restricted: "SINIRLI",
      clickToJoin: "KATILMAK İÇİN TIKLA",
      registered: "KAYITLI",
      // Additional slot UI strings
      slotRegistration: "Slot Kaydı",
      selectSlot: "Müsait bir slot seçin",
      slotsNowOpen: "Slotlar şimdi açık!",
      registrationOpensAt: "Kayıt {time} saatinde açılıyor.",
      registrationOpen: "Kayıt Açık",
      maintenanceTitle: "Bakım Modu",
      maintenanceDescription: "Kayıt geçici olarak devre dışı bırakıldı. Lütfen daha sonra tekrar kontrol edin.",
      percentFull: "{percent}% DOLU",
    },

    // Forms
    forms: {
      teamName: "Takım Adı",
      teamNamePlaceholder: "Takım adınızı girin",
      player1: "Oyuncu 1",
      player2: "Oyuncu 2",
      player3: "Oyuncu 3",
      player4: "Oyuncu 4",
      playerPlaceholder: "Oyuncu adını girin",
      instagram: "Instagram Kullanıcı Adı",
      instagramPlaceholder: "@kullaniciadi",
      submit: "Takımı Kaydet",
      cancel: "İptal",
      submitting: "Kaydediliyor...",
      success: "Kayıt Tamamlandı!",
      successMessage: "Slot #{slot} için başarıyla kayıt oldunuz.",
      // Modal strings
      registerTitle: "Kayıt",
      registerDescription: "Bugünkü maçta yerinizi güvence altına almak için takım bilgilerinizi girin.",
    },

    // Countdown
    countdown: {
      title: "Kayıt Açılışına Kalan Süre",
      subtitle: "Günlük maçlar {time} saatinde başlıyor",
      hours: "Saat",
      minutes: "Dakika",
      seconds: "Saniye",
    },
    landing: {
      heroEyebrow: "RCSF MULTI-SESSION",
      heroTitle: "Neon Scrim League",
      heroSubtitle: "Her gün yeni oturumlar, sıralama savaşları ve şampiyonluklar.",
      championLabel: "Son Şampiyon",
      championFallbackTitle: "Henüz Şampiyon Yok",
      championFallbackSubtitle: "İlk zafer için aktif oturumlardan birine katılın.",
      viewScrims: "Aktif Oturumları Gör",
      activeScrimsTitle: "Aktif ve Yaklaşan Scrimler",
      activeScrimsSubtitle: "Kayıtlar açık olan veya başlamak üzere olan oturumlar.",
      adLabel: "Sponsorlu",
      sessionStartsAt: "Başlangıç",
      sessionModeLabel: "Mod",
      sessionMapLabel: "Harita",
      statusActive: "AKTIF",
      statusClosed: "YAKINDA",
      statusCompleted: "TAMAMLANDI",
    },

    // Footer
    footer: {
      quickLinks: "Hızlı Linkler",
      connect: "Bağlan",
      systemStatus: "Sistem Durumu",
      allRightsReserved: "Tüm hakları saklıdır",
      developedBy: "Geliştirici",
      allSystemsOperational: "Tüm Sistemler Çalışıyor",
    },

    // Admin
    admin: {
      controlPanel: "Kontrol Paneli",
      dashboard: "Yönetici Paneli",
      slotManager: "Slot Yöneticisi",
      settings: "Ayarlar",
      logout: "Çıkış Yap",
      login: "Giriş Yap",
      loginSubtitle: "Yönetici Kontrol Paneli",
      username: "Kullanıcı Adı",
      password: "Şifre",
    },

    // Leaderboard
    leaderboard: {
      title: "Liderlik Tablosu",
      indexTitle: "Liderlik Tabloları",
      indexSubtitle: "Aktif ve arşivlenmiş ligleri keşfedin.",
      adminTitle: "Liderlik Komuta Merkezi",
      adminSubtitle: "Ligleri oluşturun, ana ligi belirleyin ve takımları yönetin.",
      createLabel: "Yeni Liderlik Tablosu",
      manageEntriesLabel: "Takımları Yönet",
      setMainLabel: "Ana Lig Yap",
      statusLabel: "Durum",
      slugLabel: "Slug",
      slugPlaceholder: "main-leaderboard",
      goldLabel: "ALTIN",
      silverLabel: "GÜMÜŞ",
      bronzeLabel: "BRONZ",
      activeLabel: "Aktif",
      archivedLabel: "Arşiv",
      viewDetails: "Detayları Gör",
      entriesLabel: "Takım",
      topTeamLabel: "Lider Takım",
      mainLabel: "Ana Lig",
      emptyBoards: "Henüz liderlik tablosu yok",
      emptyEntries: "Henüz takım eklenmedi",
      addTeamLabel: "Takım Ekle",
      editTeamLabel: "Takımı Düzenle",
      rank: "Sıra",
      team: "Takım",
      points: "Puan",
      wins: "Galibiyet",
      kills: "Kill",
      matches: "Maç",
      noData: "Henüz veri yok",
    },

    // Rules
    rules: {
      title: "Kurallar",
      warning:
        "Kuralların ihlali, tüm maçlardan geçici veya kalıcı yasaklanma ile sonuçlanabilir.",
    },

    // Sponsors
    sponsors: {
      title: "Sponsorlarımız",
      viewAll: "Tümünü Gör",
      pageTitle: "Sponsorlar",
    },
    news: {
      title: "Blog Merkezi",
      subtitle: "Resmi duyurular, analizler ve taktik notları.",
      empty: "Henüz yayınlanmış blog yok.",
      readMore: "Devamını Oku",
      statusPublished: "YAYINDA",
      statusDraft: "TASLAK",
      authorLabel: "Yazar",
    },
    legal: {
      privacyTitle: "Gizlilik Politikası",
      termsTitle: "Kullanım Şartları",
      contactTitle: "İletişim",
      lastUpdated: "Son Güncelleme",
    },

    // Common
    common: {
      loading: "Yükleniyor...",
      error: "Bir hata oluştu",
      retry: "Tekrar Dene",
      close: "Kapat",
      back: "Geri",
      save: "Kaydet",
      delete: "Sil",
      edit: "Düzenle",
      confirm: "Onayla",
    },
  },

  // ============================================
  // PLATFORM SETTINGS
  // ============================================
  platform: {
    totalSlots: 25,
    schemaEventType: "SportsEvent",
    schemaSport: "Esports",
  },

  // ============================================
  // NAVIGATION
  // ============================================
  navigation: {
    public: [
      { href: "/", label: "Ana Sayfa", icon: "Home" },
      { href: "/scrims", label: "Scrimler", icon: "Calendar" },
      { href: "/news", label: "Blog", icon: "Newspaper" },
      { href: "/leaderboard", label: "Liderlik Tablosu", icon: "Trophy" },
      { href: "/sponsors", label: "Sponsorlar", icon: "Award" },
      { href: "/rules", label: "Kurallar", icon: "Shield" },
    ],
    admin: [
      { href: "/admin", label: "Yönetici Paneli", icon: "LayoutDashboard" },
      { href: "/admin/scrims", label: "Scrim Oturumları", icon: "Calendar" },
      { href: "/admin/scrims/templates", label: "Günlük Şablonlar", icon: "BookOpen" },
      { href: "/admin/news", label: "Blog", icon: "Newspaper" },
      { href: "/admin/sponsors", label: "Sponsorlar", icon: "Sparkles" },
      { href: "/admin/settings", label: "Ayarlar", icon: "Settings" },
      { href: "/admin/rules", label: "Kurallar", icon: "Shield" },
      { href: "/admin/leaderboard", label: "Liderlik Tablosu", icon: "Trophy" },
    ],
    legal: [
      { href: "/privacy", label: "Gizlilik" },
      { href: "/terms", label: "Şartlar" },
      { href: "/contact", label: "İletişim" },
    ],
  },

  // ============================================
  // FOOTER
  // ============================================
  footer: {
    socialLinks: [
      {
        platform: "instagram",
        url: "https://instagram.com/rcsf.official",
        shortLabel: "IG",
      },
      { platform: "discord", url: "https://discord.gg/rcsf", shortLabel: "DC" },
      { platform: "twitter", url: "https://twitter.com/rcsf", shortLabel: "TW" },
    ],
  },

  // ============================================
  // CONTACT
  // ============================================
  contact: {
    email: "contact@rcsf.tr",
  },

  // ============================================
  // DEVELOPER CREDITS
  // ============================================
  developer: {
    name: "MHBD",
    url: "https://mhbd.dev/",
    showInFooter: true,
  },

  // ============================================
  // BASE URL
  // ============================================
  baseUrl:
    process.env.NEXT_PUBLIC_APP_URL || "https://rcsf.tr/",
};

// Re-export types for convenience
export type {
  SiteConfig,
  BrandColors,
  NavItem,
  LegalLink,
  SocialLink,
  UIStrings,
  ThemePreset,
  ContactConfig,
} from "./types";
