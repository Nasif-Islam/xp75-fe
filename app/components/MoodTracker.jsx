import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const MOOD_IMAGES = {
  1: require("../assets/low.png"),
  2: require("../assets/tired.png"),
  3: require("../assets/neutral.png"),
  4: require("../assets/good.png"),
  5: require("../assets/great.png"),
};

const MOOD_LABELS = {
  1: "Rough",
  2: "Low",
  3: "Okay",
  4: "Good",
  5: "Great",
};

const MUTED = "#9A9AAF";

export default function MoodTracker({ mood, onSelect, isLocked }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>
        {isLocked ? "Today's mood" : "How are you feeling today?"}
      </Text>
      {mood === null && isLocked ? (
        <Text style={styles.emptyText}>No mood entered for today</Text>
      ) : (
        <View style={styles.moodRow}>
          {[1, 2, 3, 4, 5].map((rating) => (
            <TouchableOpacity
              key={rating}
              style={[styles.moodBtn, mood === rating && styles.moodBtnSelected]}
              onPress={() => {
                if (!isLocked) onSelect(rating);
              }}
              activeOpacity={isLocked ? 1 : 0.8}
            >
              <Image
                source={MOOD_IMAGES[rating]}
                style={[styles.moodImg, mood !== null && mood !== rating && styles.moodImgDim]}
              />
              <Text style={[styles.moodLabel, mood === rating && styles.moodLabelActive]}>
                {MOOD_LABELS[rating]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
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
  moodBtn: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  moodBtnSelected: {
    borderColor: "#b9b9c8",
  },
  moodImg: {
    width: 40,
    height: 40,
  },
  moodImgDim: {
    opacity: 0.3,
  },
  moodLabel: {
    fontSize: 9,
    color: MUTED,
  },
  moodLabelActive: {
    color: "#5C5C8A",
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 13,
    color: MUTED,
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 8,
  },
});
