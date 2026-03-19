import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import AISummaries from "../components/AISummaries";
import BadgesCard from "../components/BadgesCard";
import MoodChart from "../components/MoodChart";
import ProfileCard from "../components/ProfileCard";
import UpdateProfileModal from "../components/UpdateProfileModal";
import { useUserContext } from "../context/UserContext";

const BASE_URL = "https://xp75-be.onrender.com";

export default function Profile() {
  const { accessToken } = useUserContext();
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) {
      setLoading(false);
      return;
    }
    fetch(`${BASE_URL}/api/milestones`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => setMilestones(data))
      .catch(() => setMilestones([]))
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
      <UpdateProfileModal visible={modalVisible} onDismiss={() => setModalVisible(false)} />

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

        <ProfileCard onEditPress={() => setModalVisible(true)} />
        <BadgesCard milestones={milestones} />
        <MoodChart />
        <AISummaries />

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
