import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  ACCENT,
  CARD,
  MUTED,
  NAVY,
  baseCard,
  fontSizes,
  fontWeights,
  pillBtn,
} from "../styles/global";

/**
 * TaskCard — the core interactive row card for the app.
 *
 * Teammates: this card pattern (white, rounded, elevated) is the standard
 * container for the whole app. The baseCard style from global.js gives you
 * the same shadow/radius/bg — import it for reflection fields, achievement
 * boxes, book cards, anything card-shaped. See app/styles/global.js.
 */
export default function TaskCard({
  task,
  done,
  submitted,
  locked,
  photo,
  toggle,
  pickImage,
  onOpenReflection,
}) {
  const isDisabled = submitted || locked;

  return (
    <TouchableOpacity
      style={[baseCard.card, styles.card, isDisabled && styles.cardLocked]}
      onPress={() => toggle(task.key)}
      activeOpacity={isDisabled ? 1 : 0.85}
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
                style={pillBtn.btn}
                onPress={(e) => {
                  e.stopPropagation();
                  pickImage();
                }}
                activeOpacity={0.8}
              >
                <Text style={pillBtn.text}>{photo ? "Change" : "Upload"}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {task.key === "reflection" && !isDisabled && (
          <TouchableOpacity
            style={[pillBtn.btn, done && pillBtn.btnDone]}
            onPress={(e) => {
              e.stopPropagation();
              onOpenReflection();
            }}
            activeOpacity={0.8}
          >
            <Text style={[pillBtn.text, done && pillBtn.textDone]}>
              {done ? "Done ✓" : "Start →"}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.checkbox,
            done && styles.checkboxDone,
            isDisabled && styles.checkboxLocked,
          ]}
          onPress={(e) => {
            e.stopPropagation();
            if (task.key === "reflection" && !done && !isDisabled) {
              onOpenReflection();
              return;
            }
            toggle(task.key);
          }}
          activeOpacity={isDisabled ? 1 : 0.8}
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
    color: NAVY,
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
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: MUTED,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: CARD,
  },
  checkboxDone: {
    backgroundColor: ACCENT,
    borderColor: ACCENT,
  },
  checkboxLocked: {
    borderColor: MUTED,
  },
  checkmark: {
    color: CARD,
    fontSize: 14,
    fontWeight: fontWeights.bold,
    lineHeight: 18,
  },
});
