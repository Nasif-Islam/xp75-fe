import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const RANK_COLORS = {
  1: "#FFD700",
  2: "#C0C0C0",
  3: "#CD7F32",
};

export default function Leaderboard({ user, rank }) {
  const rankColor = RANK_COLORS[rank] || "#9A9AAF";
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <View
      style={[
        styles.row,
        rank <= 3 && { borderWidth: 2, borderColor: rankColor },
        user.isMe && styles.myRow,
      ]}
    >
      <Text style={[styles.rank, { color: rankColor }]}>{rank}</Text>

      {user.avatar_url ? (
        <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatarFallback, { backgroundColor: rankColor }]}>
          <Text style={styles.initials}>{initials}</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={[styles.name, user.isMe && styles.myName]}>{user.name}</Text>
        <Text style={styles.days}>{user.days_completed} days completed</Text>
      </View>

      <Text style={styles.points}>{user.points} pts</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    gap: 12,
  },
  myRow: {
    backgroundColor: "#EEF1FE",
    borderWidth: 2,
    borderColor: "#4F6EF7",
  },
  rank: {
    fontSize: 16,
    fontWeight: "700",
    width: 24,
    textAlign: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A2E",
  },
  myName: {
    color: "#4F6EF7",
  },
  days: {
    fontSize: 12,
    color: "#9A9AAF",
    marginTop: 2,
  },
  points: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1A1A2E",
  },
});
