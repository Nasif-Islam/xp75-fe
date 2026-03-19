import { StyleSheet } from "react-native";

export const PRIMARY = "#403557";
export const PRIMARY_SOFT = "#EEE9F5";

export const ACCENT = "#70add9";
export const ACCENT_SOFT = "#EEF6FC";

export const ORANGE = "#e16041";
export const ORANGE_SOFT = "#FCEEE9";
export const YELLOW = "#fbe268";

export const NAVY = "#1A1A2E";
export const TEXT = "#1A1A2E";
export const MUTED = "#9A9AAF";
export const BG = "#F7F8FC";
export const CARD = "#FFFFFF";
export const SURFACE = "#F0F0F5";

export const SUCCESS = "#22C55E";
export const SUCCESS_SOFT = "#DCFCE7";
export const SUCCESS_DARK = "#16A34A";
export const DANGER = "#EF4444";
export const DANGER_SOFT = "#FEE2E2";

export const shadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.08,
  shadowRadius: 10,
  elevation: 3,
};

export const shadowStrong = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 12,
  elevation: 5,
};

export const fontSizes = {
  xs: 11,
  sm: 12,
  base: 14,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
};

export const fontWeights = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
};

export const baseCard = StyleSheet.create({
  card: {
    backgroundColor: CARD,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    ...shadow,
  },
});

// ── Close Button ───────────────────────────────────────────────
export const closeBtnStyles = StyleSheet.create({
  btn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: SURFACE,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: fontWeights.semibold,
    color: NAVY,
  },
});

// ── Pill Button ────────────────────────────────────────────────
export const pillBtn = StyleSheet.create({
  btn: {
    backgroundColor: ACCENT_SOFT,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 7,
  },
  btnDone: {
    backgroundColor: SUCCESS_SOFT,
  },
  text: {
    color: ACCENT,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
  },
  textDone: {
    color: SUCCESS_DARK,
  },
});

export const primaryBtn = StyleSheet.create({
  btn: {
    backgroundColor: PRIMARY,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#FFF",
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    letterSpacing: 0.3,
  },
});

export const layout = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  centred: {
    alignItems: "center",
    justifyContent: "center",
  },
  screenPadding: {
    paddingHorizontal: 20,
  },
  screen: {
    flex: 1,
    backgroundColor: BG,
  },
});
