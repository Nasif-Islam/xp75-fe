import { Dimensions, ScrollView, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Card, Text, useTheme } from "react-native-paper";

const screenWidth = Dimensions.get("window").width;

const MOOD_LABELS = [
  { value: "1", label: "😞 Terrible" },
  { value: "2", label: "😕 Bad" },
  { value: "3", label: "😐 Neutral" },
  { value: "4", label: "🙂 Good" },
  { value: "5", label: "😄 Great" },
];

export default function MoodChart({ days = [] }) {
  const theme = useTheme();

  if (days.length === 0) {
    return (
      <Card style={{ backgroundColor: theme.colors.surface }}>
        <Card.Content>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 4 }}>
            Mood Over Time
          </Text>
          <Text variant="bodySmall" style={{ color: theme.custom.muted, fontStyle: "italic" }}>
            No mood data yet — complete your first day to see your chart.
          </Text>
        </Card.Content>
      </Card>
    );
  }

  const chartData = {
    labels: days.map((d) => `D${d.day_number}`),
    datasets: [{ data: days.map((d) => d.mood_rating) }],
  };

  const chartWidth = Math.max(screenWidth - 40, days.length * 60);

  return (
    <Card style={{ backgroundColor: theme.colors.surface }}>
      <Card.Content>
        <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 4 }}>
          Mood Over Time
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <LineChart
            data={chartData}
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
