import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const MUTED = "#9A9AAF";

const getMoodColor = (rating) => {
  switch (rating) {
    case 1:
      return "#E05555";
    case 2:
      return "#E07A55";
    case 3:
      return "#E0C155";
    case 4:
      return "#82C55A";
    case 5:
      return "#55C57A";
    default:
      return "#E2E4EE";
  }
};

export default function MoodTracker({ mood, onSelect, isLocked }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>
        {isLocked ? "Today's mood" : "How are you feeling today?"}
      </Text>
      <View style={styles.moodRow}>
        {[1, 2, 3, 4, 5].map((rating) => (
          <TouchableOpacity
            key={rating}
            style={[styles.moodDot, mood >= rating && { backgroundColor: getMoodColor(mood) }]}
            onPress={() => {
              if (!isLocked) onSelect(rating);
            }}
            activeOpacity={isLocked ? 1 : 0.8}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: MUTED,
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  moodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  moodDot: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E2E4EE",
    marginHorizontal: 4,
  },
});
