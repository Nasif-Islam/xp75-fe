import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  CARD,
  MUTED,
  NAVY,
  SURFACE,
  closeBtnStyles,
  fontSizes,
  fontWeights,
} from "../styles/global";

const BASE_URL = "https://xp75-be.onrender.com";

export default function LoginModal({ visible, onClose, user, accessToken, onLogout }) {
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

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
      router.replace("Login");
    }
  };

  return (
    <Modal transparent={false} visible={visible} animationType="fade">
      <StatusBar style="dark" backgroundColor={CARD} />
      <SafeAreaView style={styles.container}>
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

          <View style={styles.loggedInBar}>
            <Text style={styles.loggedInText} numberOfLines={1}>
              Logged in as <Text style={styles.loggedInName}>{user?.name}</Text>
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
        </View>
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
});
