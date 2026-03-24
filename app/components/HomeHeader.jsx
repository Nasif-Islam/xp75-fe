import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ACCENT, CARD, fontSizes, fontWeights } from "../styles/global";

export default function HomeHeader({ user, onPressLogin }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onPressLogin} style={styles.loginBtn}>
        {user ? (
          <>
            <Image source={{ uri: user.avatar_url }} style={styles.avatarThumb} />
            <Text style={styles.loginBtnText}>{user.name}</Text>
          </>
        ) : (
          <Text style={styles.loginBtnText}>Login</Text>
        )}
      </TouchableOpacity>
      <Image source={require("../assets/logo.jpg")} style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  loginBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: ACCENT,
  },
  avatarThumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: CARD,
  },
  loginBtnText: {
    color: CARD,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    letterSpacing: 0.4,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
