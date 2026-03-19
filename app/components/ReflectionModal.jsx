import Ionicons from "@expo/vector-icons/Ionicons";
import { View, Modal, StyleSheet, Pressable, Text, ScrollView, Animated } from "react-native";
import { useState, useEffect, useRef } from "react";
import { mockReflections } from "../mockData/reflectionsData";

export default function ReflectionModal({ dayId, userId, isLatest }) {
  const [visible, setVisible] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const user = mockReflections.find((entry) => entry.day_id === dayId && entry.user_id === userId);

  const hasReflection = !!user;

  useEffect(() => {
    if (!isLatest) return;

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.25,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );

    pulse.start();
    return () => pulse.stop();
  }, [isLatest]);

  return (
    <View>
      <Pressable
        onPress={() => hasReflection && setVisible(true)}
        disabled={!hasReflection}
        style={({ pressed }) => [
          styles.nodeTrigger,
          pressed && hasReflection && styles.nodeTriggerPressed,
        ]}
      >
        {hasReflection ? (
          <View style={styles.pulseWrapper}>
            {isLatest && (
              <Animated.View
                style={[
                  styles.pulseRing,
                  {
                    transform: [{ scale: pulseAnim }],
                    opacity: pulseAnim.interpolate({
                      inputRange: [1, 1.25],
                      outputRange: [0.5, 0],
                    }),
                  },
                ]}
              />
            )}
            <Ionicons name="radio-button-on" size={30} color="#fbe268" />
          </View>
        ) : (
          <Ionicons name="radio-button-on" size={30} color="#9e9898" />
        )}
      </Pressable>

      <Modal
        visible={visible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.accentBar} />

            <View style={styles.header}>
              <View>
                <Text style={styles.dayLabel}>Day {dayId}</Text>
                <Text style={styles.headerTitle}>Journal Entry</Text>
              </View>
              <Pressable
                onPress={() => setVisible(false)}
                style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]}
              >
                <Ionicons name="close" size={14} color="#cc785c" />
              </Pressable>
            </View>

            <View style={styles.divider} />

            <ScrollView
              style={styles.scrollArea}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {user && (
                <>
                  <Section icon="trophy-outline" label="Achievements" body={user.achievements} />
                  <Section icon="thunderstorm-outline" label="Challenges" body={user.challenges} />
                  <Section
                    icon="arrow-forward-circle-outline"
                    label="Tomorrow's Focus"
                    body={user.next_day_focus}
                  />
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function Section({ icon, label, body }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.iconPill}>
          <Ionicons name={icon} size={14} color="#cc785c" />
        </View>
        <Text style={styles.sectionLabel}>{label}</Text>
      </View>
      <Text style={styles.sectionBody}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  nodeTrigger: {
    padding: 3,
  },
  nodeTriggerPressed: {
    opacity: 0.5,
  },
  pulseWrapper: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  pulseRing: {
    position: "absolute",
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fbe268",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  sheet: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 16,
  },
  accentBar: {
    height: 4,
    backgroundColor: "#cc785c",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 3,
    textTransform: "uppercase",
    color: "#cc785c",
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
    letterSpacing: 0.3,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f5f0ed",
    justifyContent: "center",
    alignItems: "center",
  },
  closeBtnPressed: {
    backgroundColor: "#ede5df",
    opacity: 0.8,
  },
  divider: {
    height: 1,
    backgroundColor: "#ede8e3",
    marginHorizontal: 24,
  },
  scrollArea: {
    maxHeight: 340,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 28,
    gap: 20,
  },
  section: {
    gap: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconPill: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: "#f5f0ed",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#cc785c",
  },
  sectionBody: {
    fontSize: 15,
    color: "#4a4a4a",
    lineHeight: 23,
    paddingLeft: 36,
  },
});
