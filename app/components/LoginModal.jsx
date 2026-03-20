import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ACCENT,
  CARD,
  DANGER,
  MUTED,
  NAVY,
  SURFACE,
  closeBtnStyles,
  fontSizes,
  fontWeights,
  shadow,
} from "../styles/global";

const BASE_URL = "https://xp75-be.onrender.com";

const AVATARS = [
  "https://i.pravatar.cc/150?u=user1.jpg",
  "https://i.pravatar.cc/150?u=user2.jpg",
  "https://i.pravatar.cc/150?u=user3.jpg",
  "https://i.pravatar.cc/150?u=user4.jpg",
  "https://i.pravatar.cc/150?u=user5.jpg",
  "https://i.pravatar.cc/150?u=user6.jpg",
  "https://i.pravatar.cc/150?u=user7.jpg",
  "https://i.pravatar.cc/150?u=user8.jpg",
  "https://i.pravatar.cc/150?u=user9.jpg",
  "https://i.pravatar.cc/150?u=user10.jpg",
  "https://i.pravatar.cc/150?u=user11.jpg",
  "https://i.pravatar.cc/150?u=user13.jpg",
  "https://i.pravatar.cc/150?u=user14.jpg",
  "https://i.pravatar.cc/150?u=user15.jpg",
  "https://i.pravatar.cc/150?u=user16.jpg",
  "https://i.pravatar.cc/150?u=user17.jpg",
  "https://i.pravatar.cc/150?u=user18.jpg",
  "https://i.pravatar.cc/150?u=user19.jpg",
];

export default function LoginModal({
  visible,
  onClose,
  onLoginSuccess,
  user,
  accessToken,
  onLogout,
}) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

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
      onLoginSuccess(profileUser, data.accessToken);
      onClose();
    } catch (err) {
      setError("Could not reach the server");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!avatar) {
      setError("Please choose an avatar");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, avatar_url: avatar }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }
      const profileUser = await fetchProfile(data.accessToken);
      onLoginSuccess(profileUser, data.accessToken);
      onClose();
    } catch (err) {
      setError("Could not reach the server");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch(`${BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } catch (err) {
      console.warn("Logout request failed:", err);
    } finally {
      setLoggingOut(false);
      onLogout();
      onClose();
    }
  };

  return (
    <Modal transparent={false} visible={visible} animationType="fade">
      <StatusBar style="dark" backgroundColor={CARD} />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.inner}>
            <View style={styles.closeBtnRow}>
              <TouchableOpacity onPress={onClose} style={closeBtnStyles.btn}>
                <Text style={closeBtnStyles.text}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.header}>
              <Text style={styles.appName}>75XP</Text>
              <Text style={styles.tagline}>Track your 75 day journey</Text>
            </View>

            {user && (
              <View style={styles.loggedInBar}>
                <Text style={styles.loggedInText} numberOfLines={1}>
                  Logged in as <Text style={styles.loggedInName}>{user.name}</Text>
                </Text>
                <TouchableOpacity
                  style={[styles.logoutBtn, loggingOut && styles.logoutBtnDisabled]}
                  onPress={handleLogout}
                  disabled={loggingOut}
                >
                  {loggingOut ? (
                    <ActivityIndicator size="small" color={NAVY} />
                  ) : (
                    <Text style={styles.logoutBtnText}>Logout</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

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
                    {AVATARS.map((url) => (
                      <TouchableOpacity
                        key={url}
                        onPress={() => setAvatar(url)}
                        style={[styles.avatarWrapper, avatar === url && styles.avatarSelected]}
                      >
                        <Image source={{ uri: url }} style={styles.avatarImg} />
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
    </Modal>
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
  closeBtnRow: {
    alignItems: "flex-end",
    marginTop: 30,
  },
  header: {
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 32,
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
  loggedInBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: SURFACE,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  loggedInText: {
    flex: 1,
    fontSize: fontSizes.sm,
    color: MUTED,
    marginRight: 8,
  },
  loggedInName: {
    fontWeight: fontWeights.semibold,
    color: NAVY,
  },
  logoutBtn: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: MUTED,
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 12,
    minWidth: 60,
    alignItems: "center",
  },
  logoutBtnDisabled: {
    opacity: 0.6,
  },
  logoutBtnText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: NAVY,
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
