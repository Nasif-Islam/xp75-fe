import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { UserProvider } from "./context/UserContext";
import { theme } from "./theme";

export default function RootLayout() {
  return (
    <UserProvider>
      <PaperProvider theme={theme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="Login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </PaperProvider>
    </UserProvider>
  );
}
