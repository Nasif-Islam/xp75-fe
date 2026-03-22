import { Image } from "react-native";

export const TOTAL_DAYS = 75;

export const TASKS = [
  {
    key: "diet",
    label: "Diet",
    emoji: <Image source={require("../assets/food.jpg")} style={{ height: 50, width: 50 }} />,
    subtitle: "Stick to your plan, no cheat meals",
  },
  {
    key: "outdoorWorkout",
    label: "Outdoor Workout",
    emoji: <Image source={require("../assets/sun.jpg")} style={{ height: 50, width: 50 }} />,
    subtitle: "45 min minimum outside",
  },
  {
    key: "indoorWorkout",
    label: "Indoor Workout",
    emoji: <Image source={require("../assets/dumbell.jpg")} style={{ height: 50, width: 50 }} />,
    subtitle: "45 min minimum inside",
  },
  {
    key: "water",
    label: "Water",
    emoji: <Image source={require("../assets/water.jpg")} style={{ height: 50, width: 50 }} />,
    subtitle: "Drink 1 gallon (≈4 litres)",
  },
  {
    key: "reading",
    label: "Reading",
    emoji: <Image source={require("../assets/book.jpg")} style={{ height: 50, width: 50 }} />,
    subtitle: "10 pages of a non-fiction book",
  },
  {
    key: "reflection",
    label: "Reflection",
    emoji: (
      <Image source={require("../assets/thought-bubble.jpg")} style={{ height: 50, width: 50 }} />
    ),
    subtitle: "Complete today's reflection",
  },
  {
    key: "progressPhoto",
    label: "Progress Photo",
    emoji: <Image source={require("../assets/camera.jpg")} style={{ height: 50, width: 50 }} />,
    subtitle: "Take your daily photo",
  },
];

export const freshChecked = () => Object.fromEntries(TASKS.map((t) => [t.key, false]));
