import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function GroupCard({ group, joined, onJoin }) {
  return (
    <View style={styles.groupRow}>
      <View style={styles.groupIcon}>
        <MaterialCommunityIcons name="account-group-outline" size={22} color="#403557" />
      </View>
      <View style={styles.groupInfo}>
        <Text style={styles.groupName}>{group.name}</Text>
        <Text numberOfLines={1} style={styles.groupMeta}>
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
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#403557",
  },
  groupIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F0F2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  groupMeta: {
    fontSize: 12,
    color: "#9A9AAF",
    marginTop: 2,
  },
  joinBtn: {
    backgroundColor: "#403557",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  joinBtnJoined: {
    backgroundColor: "#22C55E",
  },
  joinBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
});
