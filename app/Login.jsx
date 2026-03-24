import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import LoadingScreen from "./components/LoadingScreen";
import { useUserContext } from "./context/UserContext";
import {
  ACCENT,
  CARD,
  DANGER,
  MUTED,
  NAVY,
  SURFACE,
  fontSizes,
  fontWeights,
  shadow,
} from "./styles/global";

const BASE_URL = "https://xp75-be.onrender.com";

const AVATARS = [
  { key: "avatar_1.png", source: require("./assets/avatar_1.png") },
  { key: "avatar_2.png", source: require("./assets/avatar_2.png") },
  { key: "avatar_3.png", source: require("./assets/avatar_3.png") },
  { key: "avatar_4.png", source: require("./assets/avatar_4.png") },
];

export default function LoginScreen() {
  const { login } = useUserContext();
  const router = useRouter();

  const [loadingDone, setLoadingDone] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 4700);
    return () => clearTimeout(timer);
  }, []);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setAvatar(null);
    setError(null);
  };

  const switchMode = (next) => {
    resetForm();
    setMode(next);
  };

  const fetchProfile = async (token) => {
    const res = await fetch(`${BASE_URL}/api/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error("Could not load profile");
    return data.user;
  };

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      const profileUser = await fetchProfile(data.accessToken);
      login(profileUser, data.accessToken);
      router.replace("/(tabs)/HomeScreen");
    } catch (err) {
      setError("Could not reach the server");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (avatar === null) {
      setError("Please choose an avatar");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("name", name);
      formData.append("avatar_key", avatar);

      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }
      const profileUser = await fetchProfile(data.accessToken);
      login(profileUser, data.accessToken);
      router.replace("/(tabs)/HomeScreen");
    } catch (err) {
      setError("Could not reach the server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        {!loadingDone && <LoadingScreen onReady={isLoading ? null : () => setLoadingDone(true)} />}
        <StatusBar style="dark" backgroundColor={CARD} />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.inner}>
            <View style={styles.header}>
              <Text style={styles.appName}>75XP</Text>
              <Text style={styles.tagline}>Track your 75 day journey</Text>
            </View>

            <View style={styles.tabs}>
              <TouchableOpacity
                style={[styles.tab, mode === "login" && styles.tabActive]}
                onPress={() => switchMode("login")}
              >
                <Text style={[styles.tabText, mode === "login" && styles.tabTextActive]}>
                  Login
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, mode === "register" && styles.tabActive]}
                onPress={() => switchMode("register")}
              >
                <Text style={[styles.tabText, mode === "register" && styles.tabTextActive]}>
                  Register
                </Text>
              </TouchableOpacity>
            </View>

            {error && <Text style={styles.error}>{error}</Text>}

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.scroll}
            >
              {mode === "register" && (
                <TextInput
                  placeholder="Name"
                  placeholderTextColor={MUTED}
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                />
              )}

              <TextInput
                placeholder="Email"
                placeholderTextColor={MUTED}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
              />

              <TextInput
                placeholder="Password"
                placeholderTextColor={MUTED}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={[styles.input, mode === "login" && styles.inputLast]}
              />

              {mode === "register" && (
                <>
                  <Text style={styles.avatarLabel}>Choose an avatar</Text>
                  <View style={styles.avatarGrid}>
                    {AVATARS.map((item) => (
                      <TouchableOpacity
                        key={item.key}
                        onPress={() => setAvatar(item.key)}
                        style={[styles.avatarWrapper, avatar === item.key && styles.avatarSelected]}
                      >
                        <Image source={item.source} style={styles.avatarImg} />
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              <TouchableOpacity
                onPress={mode === "login" ? handleLogin : handleRegister}
                style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={CARD} />
                ) : (
                  <Text style={styles.submitBtnText}>
                    {mode === "login" ? "Login" : "Create Account"}
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CARD,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 28,
  },
  header: {
    alignItems: "center",
    paddingTop: 64,
    paddingBottom: 40,
  },
  appName: {
    fontSize: 48,
    fontWeight: fontWeights.bold,
    color: NAVY,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: fontSizes.base,
    color: MUTED,
    marginTop: 6,
  },
  tabs: {
    flexDirection: "row",
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: SURFACE,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: CARD,
  },
  tabText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
    color: MUTED,
  },
  tabTextActive: {
    color: NAVY,
    fontWeight: fontWeights.semibold,
  },
  error: {
    fontSize: fontSizes.sm,
    color: DANGER,
    marginBottom: 12,
  },
  scroll: {
    paddingBottom: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: MUTED,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: fontSizes.base,
    color: NAVY,
    backgroundColor: SURFACE,
  },
  inputLast: {
    marginBottom: 20,
  },
  avatarLabel: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: NAVY,
    marginBottom: 12,
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  avatarWrapper: {
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "transparent",
    padding: 2,
  },
  avatarSelected: {
    borderColor: ACCENT,
  },
  avatarImg: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  submitBtn: {
    backgroundColor: ACCENT,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
    ...shadow,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: CARD,
    fontWeight: fontWeights.bold,
    fontSize: fontSizes.md,
  },
});
