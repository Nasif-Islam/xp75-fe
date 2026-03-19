import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { BONUS_CHALLENGES, MULTIPLIER, MULTIPLIER_THRESHOLD } from "../constants/bonusChallenges";

export default function BonusChallenges({ onInterestsChange }) {
  const [expanded, setExpanded] = useState(false);
  const [completed, setCompleted] = useState([]);

  const handleToggle = (id) => {
    const next = completed.includes(id) ? completed.filter((c) => c !== id) : [...completed, id];

    setCompleted(next);

    if (onInterestsChange) {
      const interests = [
        ...new Set(BONUS_CHALLENGES.filter((c) => next.includes(c.id)).map((c) => c.tag)),
      ];
      onInterestsChange(interests);
    }
  };

  const bonusPoints = () => {
    const count = completed.length;
    const raw = count * 10;
    return count >= MULTIPLIER_THRESHOLD ? Math.round(raw * MULTIPLIER) : raw;
  };

  const hasMultiplier = completed.length >= MULTIPLIER_THRESHOLD;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={() => setExpanded((p) => !p)}>
        <View>
          <Text style={styles.title}>⚡ Bonus Challenges</Text>
          <Text style={styles.subtitle}>
            {completed.length} completed · {bonusPoints()} bonus pts
            {hasMultiplier ? " 🔥 1.5x" : ""}
          </Text>
        </View>
        <Text style={styles.chevron}>{expanded ? "▲" : "▼"}</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.list}>
          {!hasMultiplier && (
            <Text style={styles.hint}>
              Complete {MULTIPLIER_THRESHOLD - completed.length} more to unlock 1.5x multiplier
            </Text>
          )}
          {BONUS_CHALLENGES.map((challenge) => {
            const done = completed.includes(challenge.id);
            return (
              <TouchableOpacity
                key={challenge.id}
                style={[styles.challengeRow, done && styles.challengeRowDone]}
                onPress={() => handleToggle(challenge.id)}
              >
                <Text style={styles.emoji}>{challenge.emoji}</Text>
                <Text style={[styles.label, done && styles.labelDone]}>{challenge.label}</Text>
                <Text style={styles.pts}>+{challenge.points} pts</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  subtitle: {
    fontSize: 12,
    color: "#9A9AAF",
    marginTop: 2,
  },
  chevron: {
    fontSize: 12,
    color: "#9A9AAF",
  },
  list: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  hint: {
    fontSize: 12,
    color: "#9A9AAF",
    marginBottom: 8,
    textAlign: "center",
  },
  challengeRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F8FC",
    borderRadius: 10,
    padding: 12,
    marginBottom: 6,
    gap: 10,
  },
  challengeRowDone: {
    backgroundColor: "#F0FFF4",
    borderWidth: 1,
    borderColor: "#22C55E",
  },
  emoji: {
    fontSize: 16,
  },
  label: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#1A1A2E",
  },
  labelDone: {
    textDecorationLine: "line-through",
    color: "#9A9AAF",
  },
  pts: {
    fontSize: 13,
    fontWeight: "700",
    color: "#403557",
  },
});
