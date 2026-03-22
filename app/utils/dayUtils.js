export const todayString = () => new Date().toISOString().split("T")[0];

export const storageKey = (userId) => `xp75_day_${userId}_${todayString()}`;

export const msUntilMidnight = () => {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
  return midnight.getTime() - now.getTime();
};

export const checkedFromDay = (day) => ({
  diet: day.diet_adhered,
  outdoorWorkout: day.outdoor_workout_completed,
  indoorWorkout: day.indoor_workout_completed,
  water: day.water_consumed,
  reading: day.pages_read,
  reflection: true,
  progressPhoto: !!day.progress_pic_key,
});
