import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  ACCENT,
  CARD,
  MUTED,
  SUCCESS,
  SUCCESS_SOFT,
  fontSizes,
  fontWeights,
} from "../styles/global";

export default function SubmitButton({ completedCount, totalTasks, submitted, onSubmit }) {
  const allDone = completedCount === totalTasks;

  if (submitted) {
    return (
      <View style={styles.submittedBanner}>
        <Text style={styles.submittedBannerText}>✓ Day Submitted</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.submitBtn, !allDone && styles.submitBtnDisabled]}
      onPress={allDone ? onSubmit : undefined}
      activeOpacity={allDone ? 0.85 : 1}
    >
      <Text style={styles.submitBtnText}>
        {allDone ? "Complete Day ✓" : `${completedCount}/${totalTasks} tasks complete`}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  submitBtn: {
    backgroundColor: ACCENT,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
  },
  submitBtnDisabled: {
    backgroundColor: MUTED,
  },
  submitBtnText: {
    color: CARD,
    fontWeight: fontWeights.bold,
    fontSize: fontSizes.md,
    letterSpacing: 0.3,
  },
  submittedBanner: {
    backgroundColor: SUCCESS_SOFT,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  submittedBannerText: {
    color: SUCCESS,
    fontWeight: fontWeights.semibold,
    fontSize: fontSizes.base,
    letterSpacing: 0.2,
  },
});
