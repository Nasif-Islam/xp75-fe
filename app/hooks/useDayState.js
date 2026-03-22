import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useRef, useState } from "react";
import { TOTAL_DAYS, freshChecked } from "../constants/tasks";
import { checkedFromDay, msUntilMidnight, storageKey, todayString } from "../utils/dayUtils";

const BASE_URL = "https://xp75-be.onrender.com";

export const useDayState = () => {
  const [checked, setChecked] = useState(freshChecked());
  const [photo, setPhoto] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [dayNumber, setDayNumber] = useState(1);
  const [reflectionData, setReflectionData] = useState(null);

  const midnightTimerRef = useRef(null);
  const midnightIntervalRef = useRef(null);

  const saveUserDayState = useCallback(async (userId, newChecked, newPhoto, newSubmitted) => {
    try {
      await AsyncStorage.setItem(
        storageKey(userId),
        JSON.stringify({ checked: newChecked, photo: newPhoto, submitted: newSubmitted }),
      );
    } catch (err) {
      console.warn("AsyncStorage write failed:", err);
    }
  }, []);

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
          setReflectionData(null);
          return;
        }

        setDayNumber(1);
        setChecked(freshChecked());
        setPhoto(null);
        setSubmitted(false);
        setReflectionData(null);
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

  const clearMidnightTimers = () => {
    if (midnightTimerRef.current) clearTimeout(midnightTimerRef.current);
    if (midnightIntervalRef.current) clearInterval(midnightIntervalRef.current);
  };

  const resetDayState = () => {
    setChecked(freshChecked());
    setPhoto(null);
    setSubmitted(false);
    setDayNumber(1);
    setReflectionData(null);
  };

  return {
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
  };
};
