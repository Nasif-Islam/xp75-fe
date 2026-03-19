import { View } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";

const BADGES = [
  {
    type: "bronze",
    emoji: "🥉",
    label: "Bronze",
    day: 25,
    color: "#CD7F32",
  },
  {
    type: "silver",
    emoji: "🥈",
    label: "Silver",
    day: 50,
    color: "#C0C0C0",
  },
  {
    type: "gold",
    emoji: "🥇",
    label: "Gold",
    day: 75,
    color: "#FFD700",
  },
];

export default function BadgesCard({ milestones = [] }) {
  const theme = useTheme();

  const getAwardedDate = (type) => {
    const milestone = milestones.find((m) => m.badge_type === type);
    if (!milestone) return null;
    return new Date(milestone.awarded_at).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Card style={{ backgroundColor: theme.colors.surface }}>
      <Card.Content>
        <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
          🏅 Achievements
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          {BADGES.map((badge) => {
            const awardedDate = getAwardedDate(badge.type);
            const earned = !!awardedDate;
            return (
              <View
                key={badge.type}
                style={{ alignItems: "center", gap: 6, opacity: earned ? 1 : 0.3 }}
              >
                <Text style={{ fontSize: 40 }}>{badge.emoji}</Text>
                <Text variant="labelLarge" style={{ color: badge.color, fontWeight: "700" }}>
                  {badge.label}
                </Text>
                <Text variant="labelSmall" style={{ color: theme.custom.muted }}>
                  {earned ? awardedDate : `Day ${badge.day}`}
                </Text>
              </View>
            );
          })}
        </View>
      </Card.Content>
    </Card>
  );
}
