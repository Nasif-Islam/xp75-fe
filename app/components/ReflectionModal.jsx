import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

const summaryDay = [7, 14, 21, 28, 35, 42, 49, 56, 63, 70];

function buildWeekSummary(dayId, data) {
  const weekStart = dayId - 6;
  const weekDays = data.filter((d) => d.day_number >= weekStart && d.day_number <= dayId);

  if (weekDays.length === 0) return null;

  const totalDays = weekDays.length;
  const dietDays = weekDays.filter((d) => d.diet_adhered).length;
  const indoorDays = weekDays.filter((d) => d.indoor_workout_completed).length;
  const outdoorDays = weekDays.filter((d) => d.outdoor_workout_completed).length;
  const readDays = weekDays.filter((d) => d.pages_read).length;
  const waterDays = weekDays.filter((d) => d.water_consumed).length;
  const avgMood = (weekDays.reduce((sum, d) => sum + d.mood_rating, 0) / totalDays).toFixed(1);

  const achievements = weekDays
    .map((d) => d.achievements)
    .filter(Boolean)
    .join(" ");
  const challenges = weekDays
    .map((d) => d.challenges)
    .filter(Boolean)
    .join(" ");

  return {
    stats: {
      diet: dietDays,
      indoor: indoorDays,
      outdoor: outdoorDays,
      read: readDays,
      water: waterDays,
      total: totalDays,
      avgMood,
    },
    achievements,
    challenges,
  };
}

export default function ReflectionModal({ dayId, isLatest, data }) {
  const [visible, setVisible] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scrollRef = useRef(null);
  const { width } = useWindowDimensions();

  const sheetWidth = Math.min(width - 40, 380);

  const today = data.find((day) => day.day_number === dayId);
  const hasReflection = !!today;
  const isSummaryDay = summaryDay.includes(dayId);
  const nodeColor = isSummaryDay ? "#e16041" : "#fbe268";
  const accentColor = isSummaryDay ? "#e16041" : "#cc785c";

  const weekSummary = isSummaryDay ? buildWeekSummary(dayId, data) : null;

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
  }, [isLatest, pulseAnim]);

  const handleScroll = (e) => {
    const page = Math.round(e.nativeEvent.contentOffset.x / sheetWidth);
    setActivePage(page);
  };

  const goToPage = (page) => {
    scrollRef.current?.scrollTo({ x: page * sheetWidth, animated: true });
    setActivePage(page);
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      scrollRef.current?.scrollTo({ x: 0, animated: false });
      setActivePage(0);
    }, 300);
  };

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
                    backgroundColor: nodeColor,
                    transform: [{ scale: pulseAnim }],
                    opacity: pulseAnim.interpolate({
                      inputRange: [1, 1.25],
                      outputRange: [0.5, 0],
                    }),
                  },
                ]}
              />
            )}
            <Ionicons name="radio-button-on" size={30} color={nodeColor} />
          </View>
        ) : (
          <Ionicons name="radio-button-on" size={30} color="#9e9898" />
        )}
      </Pressable>

      <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={handleClose}>
        <View style={styles.overlay}>
          <View style={[styles.sheet, { width: sheetWidth }]}>
            <View style={[styles.accentBar, { backgroundColor: accentColor }]} />

            <View style={styles.header}>
              <View>
                <Text style={[styles.dayLabel, { color: accentColor }]}>
                  {isSummaryDay ? "Week Summary · " : ""}Day {dayId}
                </Text>
                <Text style={styles.headerTitle}>
                  {activePage === 0 ? "Journal Entry" : "Week in Review"}
                </Text>
              </View>
              <Pressable
                onPress={handleClose}
                style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]}
              >
                <Ionicons name="close" size={14} color={accentColor} />
              </Pressable>
            </View>

            <View style={styles.divider} />

            <ScrollView
              ref={scrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleScroll}
              scrollEnabled={isSummaryDay}
              style={{ width: sheetWidth }}
            >
              {/* Page 1 — Daily journal entry */}
              <View style={{ width: sheetWidth }}>
                <ScrollView
                  style={styles.scrollArea}
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  {today && (
                    <>
                      <Section
                        icon="trophy-outline"
                        label="Achievements"
                        body={today.achievements}
                        accentColor={accentColor}
                      />
                      <Section
                        icon="thunderstorm-outline"
                        label="Challenges"
                        body={today.challenges}
                        accentColor={accentColor}
                      />
                      <Section
                        icon="arrow-forward-circle-outline"
                        label="Tomorrow's Focus"
                        body={today.next_day_focus}
                        accentColor={accentColor}
                      />
                    </>
                  )}
                </ScrollView>
              </View>

              {isSummaryDay && weekSummary && (
                <View style={{ width: sheetWidth }}>
                  <ScrollView
                    style={styles.scrollArea}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                  >
                    <Section
                      icon="trophy-outline"
                      label="Week Highlights"
                      body={weekSummary.achievements}
                      accentColor={accentColor}
                    />
                    <Section
                      icon="thunderstorm-outline"
                      label="Week Challenges"
                      body={weekSummary.challenges}
                      accentColor={accentColor}
                    />
                  </ScrollView>
                </View>
              )}
            </ScrollView>

            {isSummaryDay && (
              <View style={styles.pagination}>
                {[0, 1].map((i) => (
                  <Pressable key={i} onPress={() => goToPage(i)}>
                    <View
                      style={[
                        styles.dot,
                        activePage === i
                          ? [styles.dotActive, { backgroundColor: accentColor }]
                          : styles.dotInactive,
                      ]}
                    />
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

function WeekStatsRow({ stats, accentColor }) {
  const items = [
    { label: "Diet", value: `${stats.diet}/${stats.total}` },
    { label: "Indoor", value: `${stats.indoor}/${stats.total}` },
    { label: "Outdoor", value: `${stats.outdoor}/${stats.total}` },
    { label: "Reading", value: `${stats.read}/${stats.total}` },
    { label: "Mood", value: `${stats.avgMood}/5` },
  ];

  return (
    <View style={statsStyles.row}>
      {items.map((item) => (
        <View key={item.label} style={[statsStyles.card, { borderColor: `${accentColor}30` }]}>
          <Text style={[statsStyles.value, { color: accentColor }]}>{item.value}</Text>
          <Text style={statsStyles.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const statsStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 4,
  },
  card: {
    flex: 1,
    minWidth: 56,
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#faf9f8",
  },
  value: {
    fontSize: 15,
    fontWeight: "700",
  },
  label: {
    fontSize: 10,
    color: "#888",
    marginTop: 2,
    fontWeight: "500",
  },
});

function Section({ icon, label, body, accentColor }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={[styles.iconPill, { backgroundColor: `${accentColor}18` }]}>
          <Ionicons name={icon} size={14} color={accentColor} />
        </View>
        <Text style={[styles.sectionLabel, { color: accentColor }]}>{label}</Text>
      </View>
      <Text style={styles.sectionBody}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  nodeTrigger: { padding: 3 },
  nodeTriggerPressed: { opacity: 0.5 },
  pulseWrapper: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  pulseRing: { position: "absolute", width: 36, height: 36, borderRadius: 18 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  sheet: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 16,
  },
  accentBar: { height: 4 },
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
  closeBtnPressed: { backgroundColor: "#ede5df", opacity: 0.8 },
  divider: { height: 1, backgroundColor: "#ede8e3", marginHorizontal: 24 },
  scrollArea: { maxHeight: 340 },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 28,
    gap: 20,
  },
  section: { gap: 8 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconPill: {
    width: 26,
    height: 26,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  sectionBody: {
    fontSize: 15,
    color: "#4a4a4a",
    lineHeight: 23,
    paddingLeft: 36,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingVertical: 14,
  },
  dot: { borderRadius: 4 },
  dotActive: { width: 20, height: 6 },
  dotInactive: { width: 6, height: 6, backgroundColor: "#d1cdc9" },
});
