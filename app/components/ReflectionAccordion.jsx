import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import {
  ACCENT,
  ACCENT_SOFT,
  NAVY,
  MUTED,
  DANGER,
  CARD,
  SURFACE,
  closeBtnStyles,
  fontSizes,
  fontWeights,
  shadow,
} from "../styles/global";

const MOODS = [
  { rating: 1, emoji: "😞", label: "Rough" },
  { rating: 2, emoji: "😕", label: "Low" },
  { rating: 3, emoji: "😐", label: "Okay" },
  { rating: 4, emoji: "🙂", label: "Good" },
  { rating: 5, emoji: "😄", label: "Great" },
];

export default function ReflectionAccordion({ visible, onClose, onSave, existingData }) {
  const [mood, setMood] = useState(existingData?.mood_rating ?? null);
  const [achievements, setAchievements] = useState(existingData?.achievements ?? "");
  const [challenges, setChallenges] = useState(existingData?.challenges ?? "");
  const [nextDayFocus, setNextDayFocus] = useState(existingData?.next_day_focus ?? "");
  const [error, setError] = useState(null);

  const isComplete =
    mood !== null &&
    achievements.trim().length >= 10 &&
    challenges.trim().length >= 10 &&
    nextDayFocus.trim().length >= 10;

  const handleSave = () => {
    if (!mood) {
      setError("Please select a mood rating.");
      return;
    }
    if (achievements.trim().length < 10) {
      setError("Achievements must be at least 10 characters.");
      return;
    }
    if (challenges.trim().length < 10) {
      setError("Challenges must be at least 10 characters.");
      return;
    }
    if (nextDayFocus.trim().length < 10) {
      setError("Tomorrow's focus must be at least 10 characters.");
      return;
    }

    setError(null);
    onSave({ mood_rating: mood, achievements, challenges, next_day_focus: nextDayFocus });
    onClose();
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <View style={styles.overlay}>
            <View style={styles.sheet}>
              <View style={styles.handle} />

              <View style={styles.header}>
                <Text style={styles.title}>Reflection for today</Text>
                <TouchableOpacity onPress={handleClose} style={closeBtnStyles.btn}>
                  <Text style={closeBtnStyles.text}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.scroll}>
                {error && <Text style={styles.error}>{error}</Text>}

                <Text style={styles.sectionLabel}>How are you feeling today?</Text>
                <View style={styles.moodRow}>
                  {MOODS.map(({ rating, emoji, label }) => (
                    <TouchableOpacity
                      key={rating}
                      style={[styles.moodBtn, mood === rating && styles.moodBtnSelected]}
                      onPress={() => setMood(rating)}
                      activeOpacity={0.8}>
                      <Text style={styles.moodEmoji}>{emoji}</Text>
                      <Text style={styles.moodNumber}>{rating}</Text>
                      <Text style={[styles.moodLabel, mood === rating && styles.moodLabelSelected]}>
                        {label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.sectionLabel}>Today I achieved...</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="What did you achieve today?"
                  placeholderTextColor={MUTED}
                  value={achievements}
                  onChangeText={setAchievements}
                  multiline
                  maxLength={500}
                  textAlignVertical="top"
                />
                <Text style={styles.charCount}>{achievements.length}/500</Text>

                <Text style={styles.sectionLabel}>Challenges I faced...</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="What challenges did you face?"
                  placeholderTextColor={MUTED}
                  value={challenges}
                  onChangeText={setChallenges}
                  multiline
                  maxLength={500}
                  textAlignVertical="top"
                />
                <Text style={styles.charCount}>{challenges.length}/500</Text>

                <Text style={styles.sectionLabel}>Focus for tomorrow...</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="What will you focus on tomorrow?"
                  placeholderTextColor={MUTED}
                  value={nextDayFocus}
                  onChangeText={setNextDayFocus}
                  multiline
                  maxLength={500}
                  textAlignVertical="top"
                />
                <Text style={styles.charCount}>{nextDayFocus.length}/500</Text>

                <TouchableOpacity
                  style={[styles.saveBtn, !isComplete && styles.saveBtnDisabled]}
                  onPress={handleSave}
                  activeOpacity={isComplete ? 0.85 : 1}>
                  <Text style={styles.saveBtnText}>
                    {isComplete ? "Save Reflection ✓" : "Fill in all fields to save"}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    backgroundColor: CARD,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 32,
    maxHeight: "90%",
    ...shadow,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: MUTED,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: NAVY,
  },
  scroll: {
    paddingBottom: 16,
    gap: 4,
  },
  error: {
    fontSize: fontSizes.sm,
    color: DANGER,
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    color: NAVY,
    marginTop: 16,
    marginBottom: 10,
  },
  moodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
  },
  moodBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: MUTED,
    backgroundColor: SURFACE,
    gap: 2,
  },
  moodBtnSelected: {
    borderColor: ACCENT,
    backgroundColor: ACCENT_SOFT,
  },
  moodEmoji: {
    fontSize: 20,
  },
  moodNumber: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
    color: NAVY,
  },
  moodLabel: {
    fontSize: 9,
    color: MUTED,
  },
  moodLabelSelected: {
    color: ACCENT,
  },
  textInput: {
    borderWidth: 1,
    borderColor: MUTED,
    borderRadius: 10,
    padding: 12,
    fontSize: fontSizes.base,
    color: NAVY,
    minHeight: 90,
    backgroundColor: SURFACE,
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: fontSizes.xs,
    color: MUTED,
    textAlign: "right",
    marginTop: 4,
  },
  saveBtn: {
    backgroundColor: ACCENT,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
  },
  saveBtnDisabled: {
    backgroundColor: MUTED,
  },
  saveBtnText: {
    color: CARD,
    fontWeight: fontWeights.bold,
    fontSize: fontSizes.md,
  },
});
