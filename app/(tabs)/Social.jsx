import { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GroupCard from "../components/GroupCard";
import Leaderboard from "../components/Leaderboard";

import { SUGGESTED_GROUPS } from "../constants/interestGroups";
import { GLOBAL_USERS } from "../constants/mockUsers";

export default function Social() {
  const [joinedGroups, setJoinedGroups] = useState([]);

  const handleJoinGroup = (id) => {
    setJoinedGroups((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.headerRow}>
          <Image source={require("../assets/trophy.png")} style={styles.headerIcon} />
          <View style={styles.headerText}>
            <Text style={styles.title}>Global Rankings</Text>
            <Text style={styles.subtitle}>Real-time community progress</Text>
          </View>
        </View>

        <View style={styles.section}>
          {GLOBAL_USERS.map((item, index) => (
            <Leaderboard key={item.id} user={item} rank={index + 1} isMe={item.isMe} />
          ))}
        </View>

        <View style={[styles.headerRow, { marginTop: 32 }]}>
          <Image source={require("../assets/groups.png")} style={styles.headerIcon} />
          <View style={styles.headerText}>
            <Text style={styles.sectionTitle}>Suggested Groups</Text>
            <Text style={styles.hint}>Find a group with similar interests to stay on track</Text>
          </View>
        </View>

        <View style={styles.section}>
          {SUGGESTED_GROUPS.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              joined={joinedGroups.includes(group.id)}
              onJoin={() => handleJoinGroup(group.id)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FC",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
    gap: 12,
  },
  headerIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1A1A2E",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1A1A2E",
  },
  subtitle: {
    fontSize: 13,
    color: "#9A9AAF",
    marginTop: 2,
  },
  hint: {
    fontSize: 13,
    color: "#9A9AAF",
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 20,
  },
});
