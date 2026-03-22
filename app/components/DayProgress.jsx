import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ACCENT, MUTED, TEXT, fontSizes, fontWeights } from "../styles/global";

export default function DayProgress({ completedCount, totalTasks, dayNumber, totalDays }) {
  const percent = (completedCount / totalTasks) * 100;

  return (
    <View style={styles.wrapper}>
      <View style={styles.dayInfo}>
        <Text style={styles.dayNumber}>Day {dayNumber}</Text>
        <Text style={styles.totalDays}>of {totalDays}</Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${percent}%` }]} />
      </View>

      <Text style={styles.progressLabel}>
        {completedCount}/{totalTasks} complete
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dayInfo: {
    marginRight: 12,
    alignItems: "flex-start",
  },
  dayNumber: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: TEXT,
  },
  totalDays: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: MUTED,
    marginTop: -2,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: "#E2E4EE",
    borderRadius: 99,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: ACCENT,
    borderRadius: 99,
  },
  progressLabel: {
    fontSize: fontSizes.sm,
    color: MUTED,
    fontWeight: fontWeights.medium,
    minWidth: 70,
    textAlign: "right",
  },
});
