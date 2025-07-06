export const colors = {
  primary: "#000000", // Black like Ola
  secondary: "#2ECC71", // Green accent
  background: "#FFFFFF",
  card: "#F8F9FA",
  text: "#1A1D1F",
  textSecondary: "#6E7A8A",
  border: "#E8ECF0",
  success: "#34C759",
  error: "#FF3B30",
  warning: "#FFCC00",
  inactive: "#C7C7CC",
  overlay: "rgba(0, 0, 0, 0.5)",
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
  },
};

export default theme;