import { useColorScheme } from "react-native";

export const Colors = {
  light: {
    background: "#FAFAF9",
    foreground: "#18181B",
    card: "#FFFFFF",
    muted: "#F4F4F5",
    mutedForeground: "#71717A",
    border: "#E4E4E7",
    input: "#E4E4E7",
    primary: "#15803D",
    primaryForeground: "#FFFFFF",
    primarySubtle: "rgba(21, 128, 61, 0.08)",
    ai: "#6D28D9",
    aiForeground: "#FFFFFF",
    aiSubtle: "rgba(109, 40, 217, 0.08)",
    calories: "#EA580C",
    caloriesSubtle: "rgba(234, 88, 12, 0.08)",
    destructive: "#DC2626",
    destructiveSubtle: "rgba(220, 38, 38, 0.08)",
    warning: "#D97706",
  },
  dark: {
    background: "#09090B",
    foreground: "#F4F4F5",
    card: "#111113",
    muted: "#18181B",
    mutedForeground: "#A1A1AA",
    border: "#27272A",
    input: "#27272A",
    primary: "#22C55E",
    primaryForeground: "#050505",
    primarySubtle: "rgba(34, 197, 94, 0.12)",
    ai: "#8B5CF6",
    aiForeground: "#FFFFFF",
    aiSubtle: "rgba(139, 92, 246, 0.12)",
    calories: "#F97316",
    caloriesSubtle: "rgba(249, 115, 22, 0.12)",
    destructive: "#EF4444",
    destructiveSubtle: "rgba(239, 68, 68, 0.12)",
    warning: "#F59E0B",
  },
};

export type ThemeColors = typeof Colors.dark;

/**
 * Hook to retrieve active theme tokens based on device system settings.
 * Defaults to 'dark' if system scheme is unspecified.
 */
export function useThemeColors(): ThemeColors {
  const scheme = useColorScheme();
  return scheme === "light" ? Colors.light : Colors.dark;
}
