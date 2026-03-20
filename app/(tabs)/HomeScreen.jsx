import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  AppState,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DayProgress from "../components/DayProgress";
import LoadingScreen from "../components/LoadingScreen";
import LoginModal from "../components/LoginModal";
import ReflectionAccordion from "../components/ReflectionAccordion";
import SubmitSuccessModal from "../components/SubmitSuccessModal";
import TaskCard from "../components/TaskCard";
import { useUserContext } from "../context/UserContext";
import {
  ACCENT,
  ACCENT_SOFT,
  BG,
  CARD,
  DANGER,
  MUTED,
  SUCCESS,
  SUCCESS_SOFT,
  baseCard,
  fontSizes,
  fontWeights,
} from "../styles/global";
const BASE_URL = "https://xp75-be.onrender.com";
const TOTAL_DAYS = 75;

const DUMMY_REFLECTION = {
  mood_rating: 3,
  achievements: "Completed all tasks for the day successfully.",
  challenges: "Staying consistent and focused throughout the day.",
  next_day_focus: "Keep the same energy and complete all tasks again.",
  progress_pic:
    "https://static.vecteezy.com/system/resources/previews/001/218/694/non_2x/under-construction-warning-sign-vector.jpg",
};

const TASKS = [
  { key: "diet", label: "Diet", emoji: "🥗", subtitle: "Stick to your plan, no cheat meals" },
  {
    key: "outdoorWorkout",
    label: "Outdoor Workout",
    emoji: "🏃",
    subtitle: "45 min minimum outside",
  },
  { key: "indoorWorkout", label: "Indoor Workout", emoji: "🏋️", subtitle: "45 min minimum inside" },
  { key: "water", label: "Water", emoji: "💧", subtitle: "Drink 1 gallon (≈4 litres)" },
  { key: "reading", label: "Reading", emoji: "📖", subtitle: "10 pages of a non-fiction book" },
  { key: "reflection", label: "Reflection", emoji: "🪞", subtitle: "Complete today's reflection" },
  { key: "progressPhoto", label: "Progress Photo", emoji: "📸", subtitle: "Take your daily photo" },
];

const freshChecked = () => Object.fromEntries(TASKS.map((t) => [t.key, false]));

const todayString = () => new Date().toISOString().split("T")[0];

const storageKey = (userId) => `xp75_day_${userId}_${todayString()}`;

const msUntilMidnight = () => {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
  return midnight.getTime() - now.getTime();
};

const checkedFromDay = (day) => ({
  diet: day.diet_adhered,
  outdoorWorkout: day.outdoor_workout_completed,
  indoorWorkout: day.indoor_workout_completed,
  water: day.water_consumed,
  reading: day.pages_read,
  reflection: true,
  progressPhoto: !!day.progress_pic_key,
});

export default function HomeScreen() {
  const [checked, setChecked] = useState(freshChecked());
  const [photo, setPhoto] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loginVisible, setLoginVisible] = useState(false);
  const [dayNumber, setDayNumber] = useState(1);
  const [apiStatus, setApiStatus] = useState("checking...");
  const [reflectionVisible, setReflectionVisible] = useState(false);
  const [reflectionData, setReflectionData] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [loadingDone, setLoadingDone] = useState(false);

  const { user, accessToken, login, logout } = useUserContext();

  const midnightTimerRef = useRef(null);
  const midnightIntervalRef = useRef(null);

  // For testing API status (temporary)
  useEffect(() => {
    const minDelay = new Promise((resolve) => setTimeout(resolve, 4700));
    const apiCheck = fetch(`${BASE_URL}/api/version`)
      .then((res) => res.json())
      .then(() => "connected")
      .catch(() => "unreachable");

    Promise.all([minDelay, apiCheck]).then(([, status]) => {
      setApiStatus(status === "connected" ? "API connected ✓" : "API unreachable ✗");
    });
  }, []);

  const saveUserDayState = async (userId, newChecked, newPhoto, newSubmitted) => {
    try {
      await AsyncStorage.setItem(
        storageKey(userId),
        JSON.stringify({ checked: newChecked, photo: newPhoto, submitted: newSubmitted }),
      );
    } catch (err) {
      console.warn("AsyncStorage write failed:", err);
    }
  };

  const loadDayStateFromDB = useCallback(async (token) => {
    try {
      const res = await fetch(`${BASE_URL}/api/days`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return null;
      const data = await res.json();
      return Array.isArray(data) ? data : (data.days ?? []);
    } catch (err) {
      console.warn("Could not fetch days from DB:", err);
      return null;
    }
  }, []);

  const loadUserDayState = useCallback(
    async (userId, token) => {
      const days = await loadDayStateFromDB(token);

      if (days !== null) {
        if (days.length === 0) {
          setDayNumber(1);
          setChecked(freshChecked());
          setPhoto(null);
          setSubmitted(false);
          setReflectionData(null);
          return;
        }

        const lastDay = days[days.length - 1];
        const lastDayNumber = lastDay?.day_number ?? 0;

        if (lastDayNumber >= TOTAL_DAYS) {
          setDayNumber(TOTAL_DAYS);
          setChecked(checkedFromDay(lastDay));
          setSubmitted(true);
          return;
        }

        setDayNumber(lastDayNumber);
        setChecked(checkedFromDay(lastDay));
        setSubmitted(true);
        return;
      }

      try {
        const stored = await AsyncStorage.getItem(storageKey(userId));
        if (stored) {
          const { checked: c, photo: p, submitted: s } = JSON.parse(stored);
          setChecked(c ?? freshChecked());
          setPhoto(p ?? null);
          setSubmitted(s ?? false);
        } else {
          setChecked(freshChecked());
          setPhoto(null);
          setSubmitted(false);
        }
      } catch (err) {
        console.warn("AsyncStorage read failed:", err);
        setChecked(freshChecked());
        setPhoto(null);
        setSubmitted(false);
      }
    },
    [loadDayStateFromDB],
  );

  const scheduleMidnightReset = useCallback(
    (userId, token) => {
      if (midnightTimerRef.current) clearTimeout(midnightTimerRef.current);
      if (midnightIntervalRef.current) clearInterval(midnightIntervalRef.current);

      midnightTimerRef.current = setTimeout(() => {
        loadUserDayState(userId, token);

        midnightIntervalRef.current = setInterval(
          () => {
            loadUserDayState(userId, token);
          },
          24 * 60 * 60 * 1000,
        );
      }, msUntilMidnight());
    },
    [loadUserDayState],
  );

  useEffect(() => {
    return () => {
      if (midnightTimerRef.current) clearTimeout(midnightTimerRef.current);
      if (midnightIntervalRef.current) clearInterval(midnightIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active" && user && accessToken) {
        loadUserDayState(user.id, accessToken);
      }
    });
    return () => sub.remove();
  }, [user, accessToken, loadUserDayState]);

  const handleLoginSuccess = useCallback(
    async (userData, token) => {
      login(userData, token);
      await loadUserDayState(userData.id, token);
      scheduleMidnightReset(userData.id, token);
    },
    [login, loadUserDayState, scheduleMidnightReset],
  );

  const handleLogout = () => {
    if (midnightTimerRef.current) clearTimeout(midnightTimerRef.current);
    if (midnightIntervalRef.current) clearInterval(midnightIntervalRef.current);
    logout();
    setChecked(freshChecked());
    setPhoto(null);
    setSubmitted(false);
    setDayNumber(1);
    setReflectionData(null);
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
      quality: 0.7,
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

    const payload = new FormData();

    payload.append("day_number", dayNumber);
    payload.append("diet_adhered", checked.diet);
    payload.append("outdoor_workout_completed", checked.outdoorWorkout);
    payload.append("indoor_workout_completed", checked.indoorWorkout);
    payload.append("water_consumed", checked.water);
    payload.append("pages_read", checked.reading);
    payload.append("mood_rating", reflectionData.mood_rating);
    payload.append("achievements", reflectionData.achievements);
    payload.append("challenges", reflectionData.challenges);
    payload.append("next_day_focus", reflectionData.next_day_focus);
    payload.append("progress_pic", {
      uri: photo,
      name: "progress-pic.jpg",
      type: "image/jpeg",
    });

    try {
      const res = await fetch(`${BASE_URL}/api/days`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: payload,
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
    } catch (err) {
      console.warn("Submit error:", err);
      Alert.alert("Submit failed", "Could not reach the server. Please try again.");
    }
  };

  const completedCount = Object.values(checked).filter(Boolean).length;
  const allDone = completedCount === TASKS.length;
  const isLoggedIn = !!user;
  const isLoading = apiStatus === "checking...";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
      {!loadingDone && <LoadingScreen onReady={isLoading ? null : () => setLoadingDone(true)} />}
      <LoginModal
        visible={loginVisible}
        onClose={() => setLoginVisible(false)}
        onLoginSuccess={handleLoginSuccess}
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

      <View style={styles.header}>
        <TouchableOpacity onPress={() => setLoginVisible(true)} style={styles.loginBtn}>
          {user ? (
            <>
              <Image source={{ uri: user.avatar_url }} style={styles.avatarThumb} />
              <Text style={styles.loginBtnText}>{user.name}</Text>
            </>
          ) : (
            <Text style={styles.loginBtnText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>

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

        {isLoggedIn && !submitted && (
          <TouchableOpacity
            style={[styles.submitBtn, !allDone && styles.submitBtnDisabled]}
            onPress={allDone ? handleSubmit : undefined}
            activeOpacity={allDone ? 0.85 : 1}
          >
            <Text style={styles.submitBtnText}>
              {allDone ? "Complete Day ✓" : `${completedCount}/${TASKS.length} tasks complete`}
            </Text>
          </TouchableOpacity>
        )}

        {submitted && (
          <View style={styles.submittedBanner}>
            <Text style={styles.submittedBannerText}>✓ Day Submitted</Text>
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 12,
  },
  loginBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: ACCENT,
  },
  avatarThumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: CARD,
  },
  loginBtnText: {
    color: CARD,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    letterSpacing: 0.4,
  },
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
