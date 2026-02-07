/**
 * Icon Mapping
 *
 * Maps icon names from the config to Lucide React components.
 * Add new icons here when needed for navigation or UI.
 */

import {
  Home,
  Trophy,
  Shield,
  Gamepad2,
  Target,
  Settings,
  LayoutDashboard,
  Users,
  Calendar,
  BookOpen,
  Award,
  Sparkles,
  Newspaper,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  LogOut,
  LogIn,
  User,
  Bell,
  Search,
  Plus,
  Minus,
  Edit,
  Trash2,
  Check,
  AlertCircle,
  Info,
  type LucideIcon,
} from "lucide-react";
import type { NavIconName } from "@/config/types";

/**
 * Map of icon names to Lucide components
 * Used by navigation and other dynamic icon needs
 */
const iconMap: Record<NavIconName, LucideIcon> = {
  Home,
  Trophy,
  Shield,
  Gamepad2,
  Target,
  Settings,
  LayoutDashboard,
  Users,
  Calendar,
  BookOpen,
  Award,
  Sparkles,
  Newspaper,
};

/**
 * Get a Lucide icon component by name
 * @param name - The icon name from NavIconName type
 * @returns The Lucide icon component
 */
export function getIcon(name: NavIconName): LucideIcon {
  return iconMap[name] || Shield;
}

/**
 * Common UI icons (exported for direct use)
 */
export const icons = {
  // Navigation
  menu: Menu,
  close: X,
  chevronRight: ChevronRight,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,

  // Auth
  logout: LogOut,
  login: LogIn,
  user: User,

  // UI
  bell: Bell,
  search: Search,
  plus: Plus,
  minus: Minus,
  edit: Edit,
  delete: Trash2,
  check: Check,

  // Status
  alert: AlertCircle,
  info: Info,
} as const;

// Re-export for convenience
export type { LucideIcon };
