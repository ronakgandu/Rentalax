export const colors = {
  primary: "#14B8A6", // Teal-500
  secondary: "#0EA5E9", // Sky Blue-500
  accent: "#06B6D4", // Cyan-500
  background: "#FFFFFF",
  backgroundSecondary: "#F8FAFC", // Slate-50
  card: "#FFFFFF",
  cardSecondary: "#F1F5F9", // Slate-100
  text: "#0F172A", // Slate-900
  textSecondary: "#64748B", // Slate-500
  textMuted: "#94A3B8", // Slate-400
  border: "#E2E8F0", // Slate-200
  borderLight: "#F1F5F9", // Slate-100
  success: "#10B981", // Emerald-500
  error: "#EF4444", // Red-500
  warning: "#F59E0B", // Amber-500
  inactive: "#CBD5E1", // Slate-300
  overlay: "rgba(15, 23, 42, 0.6)", // Slate-900 with opacity
  glass: "rgba(255, 255, 255, 0.8)",
  teal: {
    50: "#F0FDFA",
    100: "#CCFBF1",
    200: "#99F6E4",
    300: "#5EEAD4",
    400: "#2DD4BF",
    500: "#14B8A6",
    600: "#0D9488",
    700: "#0F766E",
    800: "#115E59",
    900: "#134E4A",
  },
  sky: {
    50: "#F0F9FF",
    100: "#E0F2FE",
    200: "#BAE6FD",
    300: "#7DD3FC",
    400: "#38BDF8",
    500: "#0EA5E9",
    600: "#0284C7",
    700: "#0369A1",
    800: "#075985",
    900: "#0C4A6E",
  },
};

export const theme = {
  light: {
    text: colors.text,
    background: colors.background,
    tint: colors.primary,
    tabIconDefault: colors.inactive,
    tabIconSelected: colors.primary,
    card: colors.card,
    border: colors.border,
    primary: colors.primary,
    secondary: colors.secondary,
  },
  dark: {
    text: "#F8FAFC",
    background: "#0F172A",
    tint: colors.teal[400],
    tabIconDefault: colors.inactive,
    tabIconSelected: colors.teal[400],
    card: "#1E293B",
    border: "#334155",
    primary: colors.teal[400],
    secondary: colors.sky[400],
  },
};

export default theme;