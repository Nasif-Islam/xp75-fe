import { Dimensions, ScrollView, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Card, Text, useTheme } from "react-native-paper";

const screenWidth = Dimensions.get("window").width;

// Mock weekly mood data — replace with real API data later
// Each entry is the average mood for that week (weeks 1-10)
const MOCK_WEEKLY_MOOD = {
  labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10"],
  datasets: [{ data: [3, 4, 2, 5, 3, 4, 5, 4, 3, 5] }],
};

const MOOD_LABELS = [
  { value: "1", label: "😞 Terrible" },
  { value: "2", label: "😕 Bad" },
  { value: "3", label: "😐 Neutral" },
  { value: "4", label: "🙂 Good" },
  { value: "5", label: "😄 Great" },
];

export default function MoodChart() {
  const theme = useTheme();

  const chartWidth = Math.max(screenWidth - 40, MOCK_WEEKLY_MOOD.labels.length * 60);

  return (
    <Card style={{ backgroundColor: theme.colors.surface }}>
      <Card.Content>
        <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 4 }}>
          😊 Weekly Mood
        </Text>
        <Text variant="bodySmall" style={{ color: theme.custom.muted, marginBottom: 16 }}>
          Your average mood rating each week
        </Text>

        {/* Horizontally scrollable chart */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <LineChart
            data={MOCK_WEEKLY_MOOD}
            width={chartWidth}
            height={200}
            fromZero
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: theme.colors.surface,
              backgroundGradientFrom: theme.colors.surface,
              backgroundGradientTo: theme.colors.surface,
              decimalPlaces: 0,
              color: () => theme.colors.primary,
              labelColor: () => theme.custom.muted,
              propsForDots: {
                r: "5",
                strokeWidth: "2",
                stroke: theme.colors.secondary,
                fill: theme.custom.yellow,
              },
              propsForBackgroundLines: {
                stroke: theme.colors.background,
              },
            }}
            bezier
            style={{ borderRadius: 12 }}
          />
        </ScrollView>

        {/* Legend */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
            marginTop: 16,
            justifyContent: "center",
          }}
        >
          {MOOD_LABELS.map((mood) => (
            <View
              key={mood.value}
              style={{
                backgroundColor: theme.colors.background,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 20,
              }}
            >
              <Text variant="labelSmall" style={{ color: theme.custom.muted }}>
                {mood.label}
              </Text>
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );
}
