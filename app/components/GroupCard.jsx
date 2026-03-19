import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function GroupCard({ group, joined, onJoin }) {
  return (
    <View style={styles.groupRow}>
      <View style={styles.groupIcon}>
        <Text style={styles.groupIconText}>👥</Text>
      </View>
      <View style={styles.groupInfo}>
        <Text style={styles.groupName}>{group.name}</Text>
        <Text style={styles.groupMeta}>
          {group.members} members · {group.description}
        </Text>
      </View>
      <TouchableOpacity style={[styles.joinBtn, joined && styles.joinBtnJoined]} onPress={onJoin}>
        <Text style={styles.joinBtnText}>{joined ? "Joined ✓" : "Join"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  groupRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#403557",
  },
  groupIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEF1FE",
    justifyContent: "center",
    alignItems: "center",
  },
  groupIconText: {
    fontSize: 18,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A2E",
  },
  groupMeta: {
    fontSize: 12,
    color: "#9A9AAF",
    marginTop: 2,
  },
  joinBtn: {
    backgroundColor: "#403557",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  joinBtnJoined: {
    backgroundColor: "#22C55E",
  },
  joinBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});
