import { ScrollView, Text, StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MoodTracker from "../components/MoodTracker";
import ReflectionField from "../components/ReflectionField";
import { PaperProvider, Button } from "react-native-paper";

const mockReflection = {
  id: 1,
  day_id: 1,
  mood_rating: 3,
  achievements: "Completed my workout and drank all my water.",
  challenges: "Struggled to stay off my phone in the evening.",
  next_day_focus: "Get to bed before 11pm and prep meals.",
  created_at: "2025-03-10T21:00:00.000Z",
};

const BG = "#F7F8FC";
const MUTED = "#9A9AAF";
const TEXT = "#1A1A2E";

const Reflections = () => {
  const hasReflection = mockReflection.achievements !== null && mockReflection.mood_rating !== null;
  const [mood, setMood] = useState(mockReflection.mood_rating);
  const [achievements, setAchievements] = useState(mockReflection.achievements);
  const [challenges, setChallenges] = useState(mockReflection.challenges);
  const [nextDayFocus, setNextDayFocus] = useState(mockReflection.next_day_focus);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("saved!");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PaperProvider>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView style={styles.safe}>
          <View style={styles.header}>
            <View style={styles.dayBadge}>
              <Text style={styles.dayNumber}>Day {mockReflection.day_id}</Text>
              <Text style={styles.dayTotal}>of 75</Text>
            </View>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
            indicatorStyle="black"
          >
            <MoodTracker mood={mood} onSelect={setMood} isLocked={hasReflection} />
            <ReflectionField
              label="Today I achieved..."
              placeholder="What have you achieved today?"
              value={hasReflection ? mockReflection.achievements : achievements}
              onChangeText={setAchievements}
              maxLength={500}
              editable={!hasReflection}
            />
            <ReflectionField
              label="What challenges I faced..."
              placeholder="What challenges did you face today?"
              value={hasReflection ? mockReflection.challenges : challenges}
              onChangeText={setChallenges}
              maxLength={500}
              editable={!hasReflection}
            />
            <ReflectionField
              label="Tomorrow's Focus"
              placeholder="What do you want to focus on tomorrow?"
              value={hasReflection ? mockReflection.next_day_focus : nextDayFocus}
              onChangeText={setNextDayFocus}
              maxLength={500}
              editable={!hasReflection}
            />
            {!hasReflection && (
              <Button
                mode="contained"
                onPress={handleSave}
                disabled={isLoading}
                loading={isLoading}
                style={{ marginTop: 8, marginBottom: 24 }}
              >
                Save
              </Button>
            )}
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: BG,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 16,
  },
  dayBadge: {
    alignItems: "flex-end",
  },
  dayNumber: {
    fontSize: 22,
    fontWeight: "700",
    color: TEXT,
    letterSpacing: -0.5,
  },
  dayTotal: {
    fontSize: 12,
    color: MUTED,
    fontWeight: "500",
    marginTop: -2,
  },
});

export default Reflections;
