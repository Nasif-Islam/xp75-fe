import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { baseCard, ACCENT, MUTED, fontSizes, fontWeights } from "../styles/global";

export default function TaskCard({ task, done, submitted, locked, photo, toggle, pickImage }) {
  const isDisabled = submitted || locked;

  return (
    <TouchableOpacity
      style={[baseCard.card, styles.card, isDisabled && styles.cardLocked]}
      onPress={() => toggle(task.key)}
      activeOpacity={submitted ? 1 : 0.85}
    >
      <View style={styles.cardLeft}>
        <Text style={styles.cardEmoji}>{task.emoji}</Text>
        <View style={styles.cardText}>
          <Text style={[styles.cardLabel, done && styles.cardLabelDone]}>{task.label}</Text>
          <Text style={styles.cardSubtitle}>{task.subtitle}</Text>
        </View>
      </View>

      <View style={styles.cardRight}>
        {task.key === "progressPhoto" && (
          <View style={styles.photoContainer}>
            {photo && <Image source={{ uri: photo }} style={styles.photoPreview} />}
            {!isDisabled && (
              <TouchableOpacity
                style={styles.uploadBtn}
                onPress={(e) => {
                  e.stopPropagation();
                  pickImage();
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.uploadBtnText}>{photo ? "Change" : "Upload"}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.checkbox,
            done && styles.checkboxDone,
            isDisabled && styles.checkboxLocked,
          ]}
          onPress={(e) => {
            e.stopPropagation();
            toggle(task.key);
          }}
          activeOpacity={submitted ? 1 : 0.8}
        >
          {done && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardLocked: {
    opacity: 0.45,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 14,
  },
  cardEmoji: {
    fontSize: 24,
  },
  cardText: {
    flex: 1,
  },
  cardLabel: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: "#1A1A2E",
    letterSpacing: -0.2,
  },
  cardLabelDone: {
    color: MUTED,
    textDecorationLine: "line-through",
  },
  cardSubtitle: {
    fontSize: fontSizes.sm,
    color: MUTED,
    marginTop: 2,
  },
  cardRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  photoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  photoPreview: {
    width: 36,
    height: 36,
    borderRadius: 6,
  },
  uploadBtn: {
    backgroundColor: "#EEF1FE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 7,
  },
  uploadBtnText: {
    color: ACCENT,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#D0D3E8",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  checkboxDone: {
    backgroundColor: ACCENT,
    borderColor: ACCENT,
  },
  checkboxLocked: {
    borderColor: MUTED,
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: fontWeights.bold,
    lineHeight: 18,
  },
});
