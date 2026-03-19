import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useState } from "react";
import { useColorScheme } from "react-native";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState(systemScheme || "light");

  const toggleTheme = async () => {
    const next = mode === "light" ? "dark" : "light";
    setMode(next);
    await AsyncStorage.setItem("theme_mode", next);
  };

  const isDark = mode === "dark";

  return (
    <ThemeContext.Provider value={{ mode, isDark, toggleTheme }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
