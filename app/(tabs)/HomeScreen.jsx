import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Alert, AppState, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import DayProgress from "../components/DayProgress";
import HomeHeader from "../components/HomeHeader";
import LoginModal from "../components/LoginModal";
import ReflectionAccordion from "../components/ReflectionAccordion";
import SubmitButton from "../components/SubmitButton";
import SubmitSuccessModal from "../components/SubmitSuccessModal";
import TaskCard from "../components/TaskCard";
import { TASKS, TOTAL_DAYS } from "../constants/tasks";
import { useUserContext } from "../context/UserContext";
import { useApiStatus } from "../hooks/useApiStatus";
import { useDayState } from "../hooks/useDayState";
import {
  ACCENT,
  ACCENT_SOFT,
  BG,
  DANGER,
  SUCCESS,
  baseCard,
  fontSizes,
  fontWeights,
} from "../styles/global";

const BASE_URL = "https://xp75-be.onrender.com";

export default function HomeScreen() {
  const { user, accessToken, logout } = useUserContext();
  const navigation = useNavigation();
  const apiStatus = useApiStatus();
  const {
    checked,
    setChecked,
    photo,
    setPhoto,
    submitted,
    setSubmitted,
    dayNumber,
    reflectionData,
    setReflectionData,
    saveUserDayState,
    loadUserDayState,
    scheduleMidnightReset,
    clearMidnightTimers,
    resetDayState,
  } = useDayState();

  const [loginVisible, setLoginVisible] = useState(false);
  const [reflectionVisible, setReflectionVisible] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const isLoggedIn = !!user;

  const completedCount = Object.values(checked).filter(Boolean).length;

  useEffect(() => {
    return () => clearMidnightTimers();
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active" && user && accessToken) {
        loadUserDayState(user.id, accessToken);
      }
    });
    return () => sub.remove();
  }, [user, accessToken, loadUserDayState]);

  const handleLogout = () => {
    clearMidnightTimers();
    logout();
    resetDayState();
  };

  const handleReflectionSave = (data) => {
    setReflectionData(data);
    setChecked((prev) => {
      const next = { ...prev, reflection: true };
      if (user) saveUserDayState(user.id, next, photo, false);
      return next;
    });
  };

  const toggle = (key) => {
    if (submitted || !user) return;
    if (key === "reflection") {
      setReflectionVisible(true);
      return;
    }
    if (key === "progressPhoto") return;
    setChecked((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      saveUserDayState(user.id, next, photo, false);
      return next;
    });
  };

  const pickImage = async () => {
    if (submitted || !user) return;
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Permission to access the photo library is required.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 0.5,
    });
    if (!result.canceled) {
      const newPhoto = result.assets[0].uri;
      setPhoto(newPhoto);
      setChecked((prev) => {
        const next = { ...prev, progressPhoto: true };
        saveUserDayState(user.id, next, newPhoto, false);
        return next;
      });
    }
  };

  const handleSubmit = async () => {
    if (!reflectionData) {
      Alert.alert("Reflection required", "Please complete your reflection before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("day_number", String(dayNumber));
    formData.append("diet_adhered", String(checked.diet));
    formData.append("outdoor_workout_completed", String(checked.outdoorWorkout));
    formData.append("indoor_workout_completed", String(checked.indoorWorkout));
    formData.append("water_consumed", String(checked.water));
    formData.append("pages_read", String(checked.reading));
    formData.append("mood_rating", String(reflectionData.mood_rating));
    formData.append("achievements", reflectionData.achievements);
    formData.append("challenges", reflectionData.challenges);
    formData.append("next_day_focus", reflectionData.next_day_focus);
    if (photo) {
      formData.append("progress_pic", {
        uri: photo,
        name: "progress-pic.jpg",
        type: "image/jpeg",
      });
    }

    try {
      const res = await fetch(`${BASE_URL}/api/days`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        console.warn("Submit failed:", data.error);
        Alert.alert("Submit failed", data.error || "Please try again.");
        return;
      }

      setSubmitted(true);
      setShowAnimation(true);
      await saveUserDayState(user.id, checked, photo, true);
      navigation.navigate("Map");
    } catch (err) {
      console.warn("Submit error:", err);
      Alert.alert("Submit failed", "Could not reach the server. Please try again.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
      <LoginModal
        visible={loginVisible}
        onClose={() => setLoginVisible(false)}
        user={user}
        accessToken={accessToken}
        onLogout={handleLogout}
      />

      <ReflectionAccordion
        visible={reflectionVisible}
        onClose={() => setReflectionVisible(false)}
        onSave={handleReflectionSave}
        existingData={reflectionData}
      />

      <SubmitSuccessModal
        visible={showAnimation}
        onClose={() => setShowAnimation(false)}
        dayNumber={dayNumber}
      />

      <HomeHeader user={user} onPressLogin={() => setLoginVisible(true)} />

      <Text style={[styles.apiStatus, { color: apiStatus.includes("✓") ? SUCCESS : DANGER }]}>
        {apiStatus}
      </Text>

      <DayProgress
        completedCount={completedCount}
        totalTasks={TASKS.length}
        dayNumber={dayNumber}
        totalDays={TOTAL_DAYS}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {!isLoggedIn && (
          <View style={styles.loginBanner}>
            <Text style={styles.loginBannerText}>Login to start tracking your progress</Text>
          </View>
        )}

        {TASKS.map((task) => (
          <TaskCard
            key={task.key}
            task={task}
            done={checked[task.key]}
            submitted={submitted}
            locked={!isLoggedIn}
            photo={photo}
            toggle={toggle}
            pickImage={pickImage}
            onOpenReflection={() => setReflectionVisible(true)}
          />
        ))}

        {isLoggedIn && (
          <SubmitButton
            completedCount={completedCount}
            totalTasks={TASKS.length}
            submitted={submitted}
            onSubmit={handleSubmit}
          />
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  apiStatus: {
    textAlign: "center",
    fontSize: fontSizes.xs,
    paddingBottom: 6,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 4,
    gap: 12,
  },
  loginBanner: {
    ...baseCard.card,
    backgroundColor: ACCENT_SOFT,
    alignItems: "center",
    paddingVertical: 14,
  },
  loginBannerText: {
    color: ACCENT,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
  },
});
