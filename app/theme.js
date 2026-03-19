import { MD3LightTheme } from "react-native-paper";

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#403557", // dark purple — buttons, headers
    secondary: "#70add9", // light blue — active states
    tertiary: "#e16041", // burnt orange — achievements, CTAs
    background: "#F7F8FC", // screen background
    surface: "#FFFFFF", // cards
    error: "#EF4444",
    onPrimary: "#FFFFFF",
    onSecondary: "#FFFFFF",
    onTertiary: "#FFFFFF",
    onBackground: "#1A1A2E",
    onSurface: "#1A1A2E",
  },
  roundness: 12,
  // custom brand colours not in MD3 spec
  custom: {
    yellow: "#fbe268", // highlights, multiplier badge, warnings
    yellowSoft: "#FEF9DC", // soft yellow backgrounds
    orangeSoft: "#FCEEE9", // soft orange backgrounds
    muted: "#9A9AAF", // secondary text
    navy: "#1A1A2E", // dark text
  },
};
