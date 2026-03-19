import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { ACCENT, NAVY, MUTED, DANGER, fontSizes, fontWeights } from "../styles/global";

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
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>

          {user && (
            <View style={styles.loggedInBar}>
              <Text style={styles.loggedInText} numberOfLines={1}>
                Logged in as <Text style={styles.loggedInName}>{user.name}</Text>
              </Text>
              <TouchableOpacity
                style={[styles.logoutBtn, loggingOut && styles.logoutBtnDisabled]}
                onPress={handleLogout}
                disabled={loggingOut}>
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
              onPress={() => switchMode("login")}>
              <Text style={[styles.tabText, mode === "login" && styles.tabTextActive]}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, mode === "register" && styles.tabActive]}
              onPress={() => switchMode("register")}>
              <Text style={[styles.tabText, mode === "register" && styles.tabTextActive]}>
                Register
              </Text>
            </TouchableOpacity>
          </View>

          {error && <Text style={styles.error}>{error}</Text>}

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
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
                      style={[styles.avatarWrapper, avatar === url && styles.avatarSelected]}>
                      <Image source={{ uri: url }} style={styles.avatarImg} />
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            <TouchableOpacity
              onPress={mode === "login" ? handleLogin : handleRegister}
              style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitBtnText}>
                  {mode === "login" ? "Login" : "Create Account"}
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  sheet: {
    width: "85%",
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    position: "relative",
    paddingTop: 55,
  },
  closeBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  closeBtnText: {
    fontSize: 18,
    fontWeight: fontWeights.semibold,
    color: NAVY,
  },
  loggedInBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F0F0F5",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    marginTop: 4,
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
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D0D3E8",
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
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: "#F0F0F5",
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  tabActive: {
    backgroundColor: "#fff",
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
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    fontSize: fontSizes.base,
    color: NAVY,
  },
  inputLast: {
    marginBottom: 16,
  },
  avatarLabel: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: NAVY,
    marginBottom: 10,
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  avatarWrapper: {
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "transparent",
    padding: 2,
  },
  avatarSelected: {
    borderColor: ACCENT,
  },
  avatarImg: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  submitBtn: {
    backgroundColor: ACCENT,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 4,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: "#fff",
    fontWeight: fontWeights.semibold,
    fontSize: fontSizes.base,
  },
});
