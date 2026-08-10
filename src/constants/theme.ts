// Design tokens — source: design_handoff_osteologie_guide/README.md
// Keep this the single source of truth; screens should never hardcode hex values.

export const colors = {
  primary: "#0B4A6F",
  primaryTint8: "rgba(11,74,111,0.08)",
  ink: "#12222E",
  muted: "#6B7F8C",
  mutedLight: "#93A5B1",
  disabled: "#A9B8C2",
  bg: "#F4F7FA",
  surface: "#FFFFFF",
  border: "#DCE4EA",
  borderSoft: "#E4EBF0",
  fillSoft: "#EAF0F4",
  fillSoftAlt: "#EEF3F7",
  inputBg: "#F8FAFB",
  stageWarmTop: "#FBF9F5",
  stageWarmBottom: "#F2F0EA",
  stageWarmBottomAlt: "#F1EFE9", // screens 3 & 5
  stageBorder: "#E7E2D8",
} as const;

// Functional accents — submodule identity only, never UI chrome.
export const accents = {
  red: {
    // Squelette du Membre Supérieur
    color: "#C33C2E",
    tintBg: "#FDF6F5",
    chipBg: "#F5EAE8",
    borderActive: "#E7C4BE",
    glow: "0 8px 20px rgba(195,60,46,0.12)",
  },
  dark: {
    // Squelette Axial
    color: "#2B3138",
    tintBg: "#F6F7F8",
    chipBg: "#ECEEF0",
    borderActive: "#C8CDD2",
    glow: "0 8px 20px rgba(43,49,56,0.12)",
  },
  green: {
    // Squelette du Membre Inférieur
    color: "#1B8A5A",
    tintBg: "#F3FAF6",
    chipBg: "#E8F2ED",
    borderActive: "#B9DCCB",
    glow: "0 8px 20px rgba(27,138,90,0.12)",
  },
} as const;

export type AccentKey = keyof typeof accents;

// Typography — family bundled via @expo-google-fonts/ibm-plex-sans (no runtime fetch).
export const fonts = {
  regular: "IBMPlexSans_400Regular",
  medium: "IBMPlexSans_500Medium",
  semibold: "IBMPlexSans_600SemiBold",
  bold: "IBMPlexSans_700Bold",
} as const;

export const typography = {
  display: {
    fontSize: 30,
    lineHeight: 30 * 1.15,
    fontFamily: fonts.bold,
    letterSpacing: -0.03 * 30,
    color: colors.ink,
  },
  screenTitle: {
    fontSize: 27,
    fontFamily: fonts.bold,
    letterSpacing: -0.025 * 27,
    color: colors.ink,
  },
  screenTitleHome: {
    fontSize: 25,
    fontFamily: fonts.bold,
    letterSpacing: -0.025 * 25,
    color: colors.ink,
  },
  cardTitle: {
    fontSize: 21,
    fontFamily: fonts.bold,
    letterSpacing: -0.02 * 21,
    color: colors.ink,
  },
  headerTitle: {
    fontSize: 19,
    fontFamily: fonts.bold,
    letterSpacing: -0.02 * 19,
    color: colors.ink,
  },
  sheetTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    letterSpacing: -0.02 * 18,
    color: colors.ink,
  },
  ctaLabelLg: { fontSize: 16.5, fontFamily: fonts.semibold },
  buttonLabel: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.surface,
  },
  rowTitle: { fontSize: 15.5, fontFamily: fonts.semibold, color: colors.ink },
  body: {
    fontSize: 14.5,
    lineHeight: 14.5 * 1.5,
    fontFamily: fonts.regular,
    color: colors.muted,
  },
  caption: { fontSize: 12.5, fontFamily: fonts.regular, color: colors.muted },
  eyebrow: {
    fontSize: 12,
    fontFamily: fonts.semibold,
    letterSpacing: 0.05 * 12,
    color: colors.muted,
    textTransform: "uppercase" as const,
  },
};

export const radii = {
  phoneFrame: 44,
  stageCard: 27,
  sheet: 26,
  ctaRow: 18,
  button: 15,
  input: 14,
  iconTile: 12,
  pill: 999,
};

export const spacing = {
  screenX: 24,
  screenXAuth: 28,
  xs: 6,
  sm: 10,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
};

// React Native shadows are (elevation + shadow*) props, not CSS strings.
// These map the README's box-shadow values to RN equivalents (iOS shadow* / Android elevation).
export const shadows = {
  card: {
    shadowColor: "#102A3C",
    shadowOpacity: 0.07,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
  primaryButton: {
    shadowColor: "#0B4A6F",
    shadowOpacity: 0.24,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
  redButton: {
    shadowColor: "#C33C2E",
    shadowOpacity: 0.24,
    shadowRadius: 11,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  bottomSheet: {
    shadowColor: "#102A3C",
    shadowOpacity: 0.07,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: -10 },
    elevation: 8,
  },
};
