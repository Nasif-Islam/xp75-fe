import { Image, View } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";

const BADGES = [
  {
    type: "bronze",
    image: require("../assets/bronze-badge-image.jpeg"),
    day: 25,
  },
  {
    type: "silver",
    image: require("../assets/silver-badge-image.jpeg"),
    day: 50,
  },
  {
    type: "gold",
    image: require("../assets/gold-badge-image.jpeg"),
    day: 75,
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

  const earnedBadges = BADGES.filter((badge) => !!getAwardedDate(badge.type));
  if (earnedBadges.length === 0) return null;

  return (
    <Card style={{ backgroundColor: theme.colors.surface }}>
      <Card.Content>
        <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
          Achievements
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          {BADGES.map((badge) => {
            const awardedDate = getAwardedDate(badge.type);
            const earned = !!awardedDate;
            return (
              <View
                key={badge.type}
                style={{ alignItems: "center", gap: 8, opacity: earned ? 1 : 0 }}
              >
                <Image
                  source={badge.image}
                  style={{ width: 100, height: 100 }}
                  resizeMode="contain"
                />
                <Text variant="labelSmall" style={{ color: theme.custom.muted }}>
                  {earned ? awardedDate : ""}
                </Text>
              </View>
            );
          })}
        </View>
      </Card.Content>
    </Card>
  );
}
