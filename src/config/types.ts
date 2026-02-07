/**
 * White-Label SaaS Configuration Types
 *
 * These interfaces define the structure for customizing the entire platform.
 * Edit src/config/site.ts to change branding, colors, text, and more.
 */

// ============================================
// BRAND COLORS
// ============================================

/**
 * Brand colors in hex format.
 * These will be converted to CSS variables at runtime.
 */
export interface BrandColors {
  /** Primary brand color (e.g., "#3b82f6" for blue) */
  primary: string;
  /** Primary color lighter variant for hover/glow effects */
  primaryGlow: string;
  /** Accent/secondary color (e.g., gold "#fbbf24") */
  accent: string;
  /** Accent color glow variant */
  accentGlow: string;
  /** Main background color */
  background: string;
  /** Foreground/text color */
  foreground: string;
  /** Card/elevated surface color */
  surface: string;
  /** Elevated surface color */
  surfaceElevated: string;
  /** Muted text color */
  muted: string;
  /** Success state color */
  success: string;
  /** Danger/error state color */
  danger: string;
}

// ============================================
// NAVIGATION
// ============================================

/** Available icon names for navigation items */
export type NavIconName =
  | "Home"
  | "Trophy"
  | "Shield"
  | "Gamepad2"
  | "Target"
  | "Settings"
  | "LayoutDashboard"
  | "Users"
  | "Calendar"
  | "BookOpen"
  | "Award"
  | "Sparkles"
  | "Newspaper";

/**
 * Navigation item configuration
 */
export interface NavItem {
  /** URL path (e.g., "/", "/leaderboard") */
  href: string;
  /** Display label */
  label: string;
  /** Lucide icon name */
  icon: NavIconName;
}

/**
 * Legal navigation link
 */
export interface LegalLink {
  /** URL path (e.g., "/privacy") */
  href: string;
  /** Display label */
  label: string;
}

// ============================================
// SOCIAL LINKS
// ============================================

/** Supported social media platforms */
export type SocialPlatform =
  | "instagram"
  | "discord"
  | "twitter"
  | "youtube"
  | "twitch"
  | "tiktok"
  | "facebook";

/**
 * Social media link configuration
 */
export interface SocialLink {
  /** Platform identifier */
  platform: SocialPlatform;
  /** Full URL to social profile */
  url: string;
  /** Display label (short code like "IG", "DC") */
  shortLabel: string;
}

// ============================================
// SEO & METADATA
// ============================================

/**
 * SEO and Open Graph metadata
 */
export interface SEOConfig {
  /** Default page title */
  defaultTitle: string;
  /** Title template (use %s for page title) */
  titleTemplate: string;
  /** Default meta description */
  description: string;
  /** Keywords array */
  keywords: string[];
  /** Open Graph locale (e.g., "tr_TR", "en_US") */
  locale: string;
  /** HTML lang attribute */
  htmlLang: string;
  /** Open Graph type */
  ogType: "website" | "article";
  /** Twitter card type */
  twitterCard: "summary" | "summary_large_image";
}

// ============================================
// BRAND IDENTITY
// ============================================

/**
 * Brand identity configuration
 */
export interface BrandConfig {
  /** Primary brand name (e.g., "RCSF") */
  name: string;
  /** Brand tagline/subtitle (e.g., "Project Nexus") */
  tagline: string;
  /** Full brand name for SEO/display */
  fullName: string;
  /** Brand description for footer */
  description: string;
  /** Copyright holder name */
  copyrightHolder: string;
}

// ============================================
// CONTENT STRINGS
// ============================================

/**
 * Platform-specific text content (for customization)
 */
export interface ContentStrings {
  /** Game name (e.g., "PUBG Mobile") */
  gameName: string;
  /** What scrims are called (e.g., "Scrim", "Match", "Tournament") */
  scrimTerm: string;
  /** Plural form of scrim term */
  scrimTermPlural: string;
  /** Hero section title */
  heroTitle: string;
  /** Hero section subtitle */
  heroSubtitle: string;
  /** System status text */
  systemStatusOnline: string;
  /** Registration open text */
  registrationOpen: string;
  /** Registration closed text (use {time} placeholder) */
  registrationClosed: string;
}

// ============================================
// UI STRINGS (Localization)
// ============================================

/**
 * Full UI strings for localization
 * All user-facing text should be defined here
 */
export interface UIStrings {
  // Navigation
  nav: {
    home: string;
    leaderboard: string;
    rules: string;
    adminPanel: string;
  };
  // Slot/Registration
  slots: {
    available: string;
    filled: string;
    total: string;
    open: string;
    locked: string;
    offline: string;
    online: string;
    restricted: string;
    clickToJoin: string;
    registered: string;
    slotRegistration: string;
    selectSlot: string;
    slotsNowOpen: string;
    registrationOpensAt: string;
    registrationOpen: string;
    maintenanceTitle: string;
    maintenanceDescription: string;
    percentFull: string;
  };
  // Forms
  forms: {
    teamName: string;
    teamNamePlaceholder: string;
    player1: string;
    player2: string;
    player3: string;
    player4: string;
    playerPlaceholder: string;
    instagram: string;
    instagramPlaceholder: string;
    submit: string;
    cancel: string;
    submitting: string;
    success: string;
    successMessage: string;
    registerTitle: string;
    registerDescription: string;
  };
  // Countdown
  countdown: {
    title: string;
    subtitle: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
  // Landing / Scrims
  landing: {
    heroEyebrow: string;
    heroTitle: string;
    heroSubtitle: string;
    championLabel: string;
    championFallbackTitle: string;
    championFallbackSubtitle: string;
    viewScrims: string;
    activeScrimsTitle: string;
    activeScrimsSubtitle: string;
    adLabel: string;
    sessionStartsAt: string;
    sessionModeLabel: string;
    sessionMapLabel: string;
    statusActive: string;
    statusClosed: string;
    statusCompleted: string;
  };
  // Footer
  footer: {
    quickLinks: string;
    connect: string;
    systemStatus: string;
    allRightsReserved: string;
    developedBy: string;
    allSystemsOperational: string;
  };
  // Admin
  admin: {
    controlPanel: string;
    dashboard: string;
    slotManager: string;
    settings: string;
    logout: string;
    login: string;
    loginSubtitle: string;
    username: string;
    password: string;
  };
  // Leaderboard
  leaderboard: {
    title: string;
    indexTitle: string;
    indexSubtitle: string;
    adminTitle: string;
    adminSubtitle: string;
    createLabel: string;
    manageEntriesLabel: string;
    setMainLabel: string;
    statusLabel: string;
    slugLabel: string;
    slugPlaceholder: string;
    goldLabel: string;
    silverLabel: string;
    bronzeLabel: string;
    activeLabel: string;
    archivedLabel: string;
    viewDetails: string;
    entriesLabel: string;
    topTeamLabel: string;
    mainLabel: string;
    emptyBoards: string;
    emptyEntries: string;
    addTeamLabel: string;
    editTeamLabel: string;
    rank: string;
    team: string;
    points: string;
    wins: string;
    kills: string;
    matches: string;
    noData: string;
  };
  // Rules
  rules: {
    title: string;
    warning: string;
  };
  // Sponsors
  sponsors?: {
    title: string;
    viewAll: string;
    pageTitle: string;
  };
  // News / Blog
  news: {
    title: string;
    subtitle: string;
    empty: string;
    readMore: string;
    statusPublished: string;
    statusDraft: string;
    authorLabel: string;
  };
  // Legal
  legal: {
    privacyTitle: string;
    termsTitle: string;
    contactTitle: string;
    lastUpdated: string;
  };
  // Common
  common: {
    loading: string;
    error: string;
    retry: string;
    close: string;
    back: string;
    save: string;
    delete: string;
    edit: string;
    confirm: string;
  };
}

// ============================================
// THEME PRESETS
// ============================================

/**
 * Theme preset definition
 */
export interface ThemePreset {
  /** Unique preset identifier */
  id: string;
  /** Display name */
  name: string;
  /** Color palette */
  colors: BrandColors;
}

// ============================================
// PLATFORM CONFIG
// ============================================

/**
 * Platform configuration (game-specific settings)
 */
export interface PlatformConfig {
  /** Total number of slots per scrim */
  totalSlots: number;
  /** Schema.org event type */
  schemaEventType: string;
  /** Sport category for schema */
  schemaSport: string;
}

// ============================================
// DEVELOPER CREDITS
// ============================================

/**
 * Developer/creator credits configuration
 */
export interface DeveloperCredits {
  /** Developer/agency name */
  name: string;
  /** Portfolio/website URL */
  url: string;
  /** Whether to show credits in footer */
  showInFooter: boolean;
}

// ============================================
// CONTACT
// ============================================

export interface ContactConfig {
  /** Primary contact email */
  email: string;
  /** Optional phone */
  phone?: string;
  /** Optional address */
  address?: string;
}

// ============================================
// MAIN SITE CONFIG
// ============================================

/**
 * Complete site configuration
 * This is the main interface for the entire white-label system
 */
export interface SiteConfig {
  /** Brand identity (name, tagline, etc.) */
  brand: BrandConfig;
  /** Theme colors */
  colors: BrandColors;
  /** SEO and metadata */
  seo: SEOConfig;
  /** Content strings (game-specific) */
  content: ContentStrings;
  /** UI strings (all user-facing text) */
  ui: UIStrings;
  /** Platform settings */
  platform: PlatformConfig;
  /** Navigation configuration */
  navigation: {
    public: NavItem[];
    admin: NavItem[];
    legal: LegalLink[];
  };
  /** Footer configuration */
  footer: {
    socialLinks: SocialLink[];
  };
  /** Contact info */
  contact: ContactConfig;
  /** Developer credits */
  developer: DeveloperCredits;
  /** Base URL for the site */
  baseUrl: string;
}
