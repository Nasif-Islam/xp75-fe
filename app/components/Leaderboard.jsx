import { Image, StyleSheet, Text, View } from "react-native";

const RANK_COLORS = {
  1: "#FFD700",
  2: "#C0C0C0",
  3: "#CD7F32",
};

export default function Leaderboard({ user, rank, isMe }) {
  const rankColor = RANK_COLORS[rank] || "#9A9AAF";

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  return (
    <View
      style={[
        styles.row,
        rank <= 3 && { borderWidth: 1.5, borderColor: rankColor },
        isMe && styles.myRow,
      ]}
    >
      <Text style={[styles.rank, { color: rankColor }]}>{rank}</Text>

      {user.avatar_url ? (
        <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatarFallback, { backgroundColor: isMe ? "#4F6EF7" : rankColor }]}>
          <Text style={styles.initials}>{initials}</Text>
        </View>
      )}

      <View style={styles.info}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text style={[styles.name, isMe && styles.myName]}>{user.name}</Text>
          {isMe && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>YOU</Text>
            </View>
          )}
        </View>
        <Text style={styles.days}>Day {user.day_number || 0} of 75</Text>
      </View>

      <Text style={styles.points}>{user.points || user.day_number * 10} pts</Text>
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
    marginBottom: 10,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  myRow: {
    backgroundColor: "#F0F3FF",
    borderColor: "#4F6EF7",
    borderWidth: 1.5,
  },
  rank: {
    fontSize: 16,
    fontWeight: "800",
    width: 28,
    textAlign: "center",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A2E",
  },
  myName: {
    color: "#4F6EF7",
    fontWeight: "700",
  },
  badge: {
    backgroundColor: "#4F6EF7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "900",
  },
  days: {
    fontSize: 12,
    color: "#9A9AAF",
    marginTop: 2,
  },
  points: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1A1A2E",
  },
});
