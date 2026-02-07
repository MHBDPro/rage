/**
 * Site Configuration
 *
 * This is the SINGLE SOURCE OF TRUTH for all branding, colors, text, and settings.
 * Edit this file to customize the platform for different clients.
 */

import type { SiteConfig } from "./types";
import { getPreset } from "./presets";

const preset = getPreset("rage-federation")!;

export const siteConfig: SiteConfig = {
  // ============================================
  // BRAND IDENTITY
  // ============================================
  brand: {
    name: "Rage Federasyonu",
    tagline: "RAGE FEDERASYONU",
    fullName: "Rage Federasyonu",
    description:
      "Türkiye'nin premium eFootball rekabet sahnesi. Hızlı turnuvalara katılın, liglerde yükselin ve prestij kazanın.",
    copyrightHolder: "Rage Federasyonu",
  },

  // ============================================
  // THEME COLORS
  // ============================================
  colors: preset.colors,

  // ============================================
  // SEO CONFIGURATION
  // ============================================
  seo: {
    defaultTitle: "Rage Federasyonu | eFootball Turnuva Platformu",
    titleTemplate: "%s | Rage Federasyonu",
    description:
      "Rage Federasyonu eFootball turnuva platformu. UCL, UEL ve UKL liglerinde yarışın, Fast Cup ile anında mücadeleye girin.",
    keywords: [
      "Rage Federasyonu",
      "eFootball Türkiye",
      "PES turnuva",
      "eFootball lig",
      "UCL eFootball",
      "UEL eFootball",
      "UKL eFootball",
      "Fast Cup",
      "1v1 turnuva",
      "espor futbol",
    ],
    locale: "tr_TR",
    htmlLang: "tr",
    ogType: "website",
    twitterCard: "summary_large_image",
  },

  // ============================================
  // CONTENT STRINGS
  // ============================================
  content: {
    gameName: "eFootball",
    scrimTerm: "Turnuva",
    scrimTermPlural: "Turnuvalar",
    heroTitle: "Rage Federasyonu",
    heroSubtitle:
      "Şampiyonlar Ligi atmosferinde, hızlı ve prestijli 1v1 eFootball turnuvaları.",
    systemStatusOnline: "Sistem Aktif",
    registrationOpen: "Kayıt Açık",
    registrationClosed: "Kayıt {time} saatinde açılıyor",
  },

  // ============================================
  // UI STRINGS
  // ============================================
  ui: {
    nav: {
      home: "Ana Sayfa",
      leaderboard: "Ligler",
      rules: "Kurallar",
      adminPanel: "Yönetim",
    },

    slots: {
      available: "MÜSAİT",
      filled: "DOLU",
      total: "Toplam Kontenjan",
      open: "AÇIK KONTENJAN",
      locked: "KİLİTLİ",
      offline: "ÇEVRİMDIŞI",
      online: "ÇEVRİMİÇİ",
      restricted: "SINIRLI",
      clickToJoin: "KAYIT OL",
      registered: "KAYITLI",
      slotRegistration: "Kontenjan Kaydı",
      selectSlot: "Müsait bir kontenjan seçin",
      slotsNowOpen: "Kayıtlar şimdi açık",
      registrationOpensAt: "Kayıt {time} saatinde açılıyor.",
      registrationOpen: "Kayıt Açık",
      maintenanceTitle: "Bakım Modu",
      maintenanceDescription:
        "Kayıt geçici olarak kapatıldı. Lütfen biraz sonra tekrar deneyin.",
      percentFull: "{percent}% DOLU",
    },

    forms: {
      teamName: "Oyuncu Adı",
      teamNamePlaceholder: "Oyuncu adını girin",
      playerName: "Oyuncu Adı",
      playerNamePlaceholder: "Maçta görünecek oyuncu adınız",
      psnId: "PSN / Konami ID",
      psnIdPlaceholder: "Örn: rage_player",
      teamSelection: "Seçilen Takım",
      teamSelectionPlaceholder: "Örn: Real Madrid",
      player1: "Oyuncu 1",
      player2: "Oyuncu 2",
      player3: "Oyuncu 3",
      player4: "Oyuncu 4",
      playerPlaceholder: "Oyuncu adını girin",
      instagram: "Instagram",
      instagramPlaceholder: "@kullaniciadi",
      submit: "Kaydı Tamamla",
      cancel: "İptal",
      submitting: "Kaydediliyor...",
      success: "Kayıt Tamamlandı",
      successMessage: "Kontenjan #{slot} için kaydınız başarıyla alındı.",
      registerTitle: "Turnuva Kaydı",
      registerDescription:
        "PSN/Konami ID ve takım seçiminizi girerek 1v1 turnuvaya kaydolun.",
    },

    countdown: {
      title: "Kayıt Açılışına Kalan Süre",
      subtitle: "Günün turnuvaları {time} saatinde başlıyor",
      hours: "Saat",
      minutes: "Dakika",
      seconds: "Saniye",
    },

    landing: {
      heroEyebrow: "RAGE FEDERASYONU",
      heroTitle: "Rage Federasyonu",
      heroSubtitle:
        "UCL, UEL ve UKL sahnesinde rekabet et. Gecenin atmosferinde prestij için oyna.",
      championLabel: "Son Lider",
      championFallbackTitle: "Henüz Lider Yok",
      championFallbackSubtitle: "İlk zafer için yaklaşan turnuvalardan birine katıl.",
      viewScrims: "Turnuvaları Gör",
      activeScrimsTitle: "Yaklaşan Turnuvalar",
      activeScrimsSubtitle:
        "Başlangıç saati yaklaşan veya canlı olan tüm turnuvaları keşfedin.",
      adLabel: "Sponsorlu",
      sessionStartsAt: "Başlangıç",
      sessionModeLabel: "Format",
      sessionMapLabel: "Lig",
      fastCupTitle: "Fast Cup",
      fastCupSubtitle:
        "Anında eşleşmeli kısa turnuvalara tek adımda katılın.",
      fastCupAction: "Fast Cup'a Git",
      statusActive: "CANLI",
      statusClosed: "YAKLAŞAN",
      statusCompleted: "BİTTİ",
    },

    footer: {
      quickLinks: "Hızlı Linkler",
      connect: "Bağlan",
      systemStatus: "Sistem Durumu",
      allRightsReserved: "Tüm hakları saklıdır",
      developedBy: "Geliştirici",
      allSystemsOperational: "Tüm Sistemler Çalışıyor",
    },

    admin: {
      controlPanel: "Yönetim Paneli",
      dashboard: "Yönetim Paneli",
      slotManager: "Kontenjan Yöneticisi",
      settings: "Ayarlar",
      logout: "Çıkış Yap",
      login: "Giriş Yap",
      loginSubtitle: "Yönetim Erişimi",
      username: "Kullanıcı Adı",
      password: "Şifre",
    },

    leaderboard: {
      title: "Liderlik Tablosu",
      indexTitle: "Resmi Ligler",
      indexSubtitle: "UCL, UEL ve UKL liglerini takip edin.",
      adminTitle: "Lig Yönetim Merkezi",
      adminSubtitle: "Ligleri oluşturun, ana ligi belirleyin ve oyuncu skorlarını yönetin.",
      createLabel: "Yeni Lig",
      manageEntriesLabel: "Oyuncuları Yönet",
      setMainLabel: "Ana Lig Yap",
      statusLabel: "Durum",
      slugLabel: "Slug",
      slugPlaceholder: "ucl",
      goldLabel: "ALTIN",
      silverLabel: "GÜMÜŞ",
      bronzeLabel: "BRONZ",
      activeLabel: "Aktif",
      archivedLabel: "Arşiv",
      viewDetails: "Detayları Gör",
      entriesLabel: "Oyuncu",
      topTeamLabel: "Lider Oyuncu",
      mainLabel: "Ana Lig",
      emptyBoards: "Henüz lig bulunmuyor",
      emptyEntries: "Henüz oyuncu eklenmedi",
      addTeamLabel: "Oyuncu Ekle",
      editTeamLabel: "Oyuncuyu Düzenle",
      rank: "Sıra",
      team: "Oyuncu",
      points: "Puan",
      wins: "Galibiyet",
      kills: "Gol",
      matches: "Maç",
      noData: "Henüz veri yok",
    },

    rules: {
      title: "Kurallar",
      warning:
        "Kural ihlalleri turnuvalardan geçici veya kalıcı uzaklaştırma ile sonuçlanabilir.",
    },

    sponsors: {
      title: "Sponsorlarımız",
      viewAll: "Tümünü Gör",
      pageTitle: "Sponsorlar",
    },

    news: {
      title: "Duyuru Merkezi",
      subtitle: "Resmi açıklamalar, turnuva haberleri ve strateji yazıları.",
      empty: "Henüz yayınlanmış içerik yok.",
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
    totalSlots: 32,
    schemaEventType: "SportsEvent",
    schemaSport: "Football Esports",
  },

  // ============================================
  // NAVIGATION
  // ============================================
  navigation: {
    public: [
      { href: "/", label: "Ana Sayfa", icon: "Home" },
      { href: "/scrims", label: "Turnuvalar", icon: "Calendar" },
      { href: "/fast-cup", label: "Fast Cup", icon: "Target" },
      { href: "/leaderboard", label: "Ligler", icon: "Trophy" },
      { href: "/news", label: "Duyurular", icon: "Newspaper" },
      { href: "/rules", label: "Kurallar", icon: "Shield" },
    ],
    admin: [
      { href: "/admin", label: "Yönetim Paneli", icon: "LayoutDashboard" },
      { href: "/admin/scrims", label: "Turnuva Oturumları", icon: "Calendar" },
      { href: "/admin/scrims/templates", label: "Hızlı Şablonlar", icon: "BookOpen" },
      { href: "/admin/leaderboard", label: "Ligler", icon: "Trophy" },
      { href: "/admin/news", label: "Duyurular", icon: "Newspaper" },
      { href: "/admin/sponsors", label: "Sponsorlar", icon: "Sparkles" },
      { href: "/admin/settings", label: "Ayarlar", icon: "Settings" },
      { href: "/admin/rules", label: "Kurallar", icon: "Shield" },
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
        url: "https://instagram.com/ragefederasyonu",
        shortLabel: "IG",
      },
      { platform: "discord", url: "https://discord.gg/ragefederasyonu", shortLabel: "DC" },
      { platform: "twitter", url: "https://twitter.com/ragefederasyon", shortLabel: "TW" },
    ],
  },

  // ============================================
  // CONTACT
  // ============================================
  contact: {
    email: "contact@ragefederasyonu.com",
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
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || "https://ragefederasyonu.com/",
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
