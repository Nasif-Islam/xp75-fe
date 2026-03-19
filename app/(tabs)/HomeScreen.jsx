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
import LoginModal from "../components/LoginModal";
import TaskCard from "../components/TaskCard";
import { useUserContext } from "../context/UserContext";
import {
  ACCENT,
  BG,
  DANGER,
  MUTED,
  SUCCESS,
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
  progressPhoto: !!day.progress_pic,
});

export default function HomeScreen() {
  const [checked, setChecked] = useState(freshChecked());
  const [photo, setPhoto] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loginVisible, setLoginVisible] = useState(false);
  const [dayNumber, setDayNumber] = useState(1);
  const [apiStatus, setApiStatus] = useState("checking...");

  const { user, accessToken, login, logout } = useUserContext();

  const midnightTimerRef = useRef(null);
  const midnightIntervalRef = useRef(null);

  // For testing API status (temporary)
  useEffect(() => {
    fetch(`${BASE_URL}/api/version`)
      .then((res) => res.json())
      .then(() => setApiStatus("API connected ✓"))
      .catch(() => setApiStatus("API unreachable ✗"));
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
      return await res.json();
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
          return;
        }

        const lastDay = days[days.length - 1];
        const lastDayDate = lastDay.created_at ? lastDay.created_at.split("T")[0] : null;
        const today = todayString();
        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
        const lastDayNumber = lastDay.day_number;

        if (lastDayDate === today) {
          setDayNumber(lastDayNumber);
          setChecked(checkedFromDay(lastDay));
          setSubmitted(true);
          return;
        }

        if (lastDayDate === yesterday || lastDayNumber >= TOTAL_DAYS) {
          const nextDay = Math.min(lastDayNumber + 1, TOTAL_DAYS);
          setDayNumber(nextDay);
          setChecked(freshChecked());
          setPhoto(null);
          setSubmitted(false);
          return;
        }

        setDayNumber(1);
        setChecked(freshChecked());
        setPhoto(null);
        setSubmitted(false);
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
  };

  const toggle = (key) => {
    if (submitted || !user) return;
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
      quality: 1,
    });
    if (!result.canceled) {
      const newPhoto = result.assets[0].uri;
      setPhoto(newPhoto);
      saveUserDayState(user.id, checked, newPhoto, false);
    }
  };

  const handleSubmit = async () => {
    const payload = {
      day_number: dayNumber,
      diet_adhered: checked.diet,
      outdoor_workout_completed: checked.outdoorWorkout,
      indoor_workout_completed: checked.indoorWorkout,
      water_consumed: checked.water,
      pages_read: checked.reading,
      ...DUMMY_REFLECTION,
    };

    try {
      const res = await fetch(`${BASE_URL}/api/days`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        console.warn("Submit failed:", data.error);
        Alert.alert("Submit failed", data.error || "Please try again.");
        return;
      }

      setSubmitted(true);
      await saveUserDayState(user.id, checked, photo, true);
    } catch (err) {
      console.warn("Submit error:", err);
      Alert.alert("Submit failed", "Could not reach the server. Please try again.");
    }
  };

  const completedCount = Object.values(checked).filter(Boolean).length;
  const allDone = completedCount === TASKS.length;
  const isLoggedIn = !!user;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
      <LoginModal
        visible={loginVisible}
        onClose={() => setLoginVisible(false)}
        onLoginSuccess={handleLoginSuccess}
        user={user}
        accessToken={accessToken}
        onLogout={handleLogout}
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
    paddingTop: 16,
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
    borderColor: "#FFF",
  },
  loginBtnText: {
    color: "#FFF",
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
    backgroundColor: "#EEF1FE",
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
    color: "#FFF",
    fontWeight: fontWeights.bold,
    fontSize: fontSizes.md,
    letterSpacing: 0.3,
  },
  submittedBanner: {
    backgroundColor: "#DCFCE7",
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
