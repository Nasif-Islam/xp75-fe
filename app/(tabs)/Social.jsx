import { useState } from "react";
import { Text, ScrollView, StyleSheet, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Leaderboard from "../components/Leaderboard";
import GroupCard from "../components/GroupCard";
import { GLOBAL_USERS, FRIENDS_USERS } from "../constants/mockUsers";
import { SUGGESTED_GROUPS } from "../constants/interestGroups";
import { BONUS_CHALLENGES } from "../constants/bonusChallenges";

export default function Social() {
  const [activeTab, setActiveTab] = useState("global");
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState([]);

  const data = activeTab === "global" ? GLOBAL_USERS : FRIENDS_USERS;

  const handleJoinGroup = (id) => setJoinedGroups((prev) => [...prev, id]);

  const handleCompleteChallenge = (id) => {
    setCompletedChallenges((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const userInterests = [
    ...new Set(
      BONUS_CHALLENGES.filter((c) => completedChallenges.includes(c.id)).map((c) => c.tag),
    ),
  ];

  const suggestedGroups = userInterests.flatMap((tag) => SUGGESTED_GROUPS[tag] || []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🏆 Leaderboard</Text>
      <Text style={styles.subtitle}>Weekly Rankings</Text>

      {/* Toggle */}
      <View style={styles.toggle}>
        <TouchableOpacity
          style={[styles.toggleBtn, activeTab === "global" && styles.toggleBtnActive]}
          onPress={() => setActiveTab("global")}
        >
          <Text style={[styles.toggleText, activeTab === "global" && styles.toggleTextActive]}>
            Global
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, activeTab === "friends" && styles.toggleBtnActive]}
          onPress={() => setActiveTab("friends")}
        >
          <Text style={[styles.toggleText, activeTab === "friends" && styles.toggleTextActive]}>
            Friends
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Leaderboard rows */}
        {data.map((user, index) => (
          <Leaderboard key={user.id} user={user} rank={index + 1} />
        ))}

        {/* Bonus Challenges */}
        <Text style={styles.sectionTitle}>⚡ Complete Challenges to Find Your Groups</Text>
        <Text style={styles.hint}>
          Tick challenges you want to do — we'll suggest groups based on your interests
        </Text>

        {BONUS_CHALLENGES.map((challenge) => {
          const done = completedChallenges.includes(challenge.id);
          return (
            <TouchableOpacity
              key={challenge.id}
              style={[styles.challengeRow, done && styles.challengeRowDone]}
              onPress={() => handleCompleteChallenge(challenge.id)}
            >
              <Text style={styles.challengeEmoji}>{challenge.emoji}</Text>
              <Text style={[styles.challengeLabel, done && styles.challengeLabelDone]}>
                {challenge.label}
              </Text>
              <Text style={styles.challengePts}>+{challenge.points} pts</Text>
            </TouchableOpacity>
          );
        })}

        {/* Suggested Groups */}
        {suggestedGroups.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>👥 Suggested Groups For You</Text>
            {suggestedGroups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                joined={joinedGroups.includes(group.id)}
                onJoin={() => handleJoinGroup(group.id)}
              />
            ))}
          </>
        )}

        {suggestedGroups.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Complete some challenges above to discover your groups 👆
            </Text>
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FC",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#9A9AAF",
    marginBottom: 16,
  },
  toggle: {
    flexDirection: "row",
    backgroundColor: "#E8E9F0",
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  toggleBtnActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9A9AAF",
  },
  toggleTextActive: {
    color: "#1A1A2E",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A2E",
    marginTop: 24,
    marginBottom: 12,
  },
  hint: {
    fontSize: 12,
    color: "#9A9AAF",
    marginBottom: 12,
  },
  challengeRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    gap: 10,
  },
  challengeRowDone: {
    backgroundColor: "#F0FFF4",
    borderWidth: 1,
    borderColor: "#22C55E",
  },
  challengeEmoji: {
    fontSize: 18,
  },
  challengeLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#1A1A2E",
  },
  challengeLabelDone: {
    textDecorationLine: "line-through",
    color: "#9A9AAF",
  },
  challengePts: {
    fontSize: 13,
    fontWeight: "700",
    color: "#403557",
  },
  emptyState: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginTop: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#9A9AAF",
    textAlign: "center",
  },
});
