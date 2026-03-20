import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import AISummaries from "../components/AISummaries";
import BadgesCard from "../components/BadgesCard";
import ChangePasswordModal from "../components/ChangePasswordModal";
import EditProfileModal from "../components/EditProfileModal";
import MoodChart from "../components/MoodChart";
import MoodTracker from "../components/MoodTracker";
import ProfileCard from "../components/ProfileCard";
import { useUserContext } from "../context/UserContext";

const BASE_URL = "https://xp75-be.onrender.com";

export default function Profile() {
  const { accessToken } = useUserContext();
  const theme = useTheme();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todayMood, setTodayMood] = useState(null);
  const [days, setDays] = useState([]);

  useEffect(() => {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    Promise.all([
      fetch(`${BASE_URL}/api/milestones`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }).then((res) => res.json()),
      fetch(`${BASE_URL}/api/days`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
        .then((res) => res.json())
        .then((data) => (Array.isArray(data) ? data : data.days)),
    ])
      .then(([milestonesData, daysData]) => {
        setMilestones(milestonesData);
        setDays(daysData);
        if (daysData.length > 0) {
          const lastDay = daysData[daysData.length - 1];
          setTodayMood(lastDay.mood_rating ?? null);
        }
      })
      .catch(() => {
        setMilestones([]);
        setDays([]);
      })
      .finally(() => setLoading(false));
  }, [accessToken]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  if (!accessToken) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
          <Text variant="titleMedium" style={{ color: theme.custom.muted, textAlign: "center" }}>
            Please log in to view your profile
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <EditProfileModal visible={editModalVisible} onDismiss={() => setEditModalVisible(false)} />
      <ChangePasswordModal
        visible={passwordModalVisible}
        onDismiss={() => setPasswordModalVisible(false)}
      />

      <ScrollView
        contentContainerStyle={{ padding: 20, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          variant="headlineMedium"
          style={{ color: theme.colors.onBackground, fontWeight: "700" }}
        >
          Profile
        </Text>

        <ProfileCard
          onEditPress={() => setEditModalVisible(true)}
          onChangePasswordPress={() => setPasswordModalVisible(true)}
        />
        <BadgesCard milestones={milestones} />
        <MoodChart days={days} />
        <MoodTracker mood={todayMood} isLocked={true} />

        <AISummaries />

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
