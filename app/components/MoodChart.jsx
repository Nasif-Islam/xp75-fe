import { Dimensions, Image, ScrollView, StyleSheet, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Card, Text, useTheme } from "react-native-paper";

const screenWidth = Dimensions.get("window").width;

const MOOD_IMAGES = {
  1: require("../assets/low.png"),
  2: require("../assets/tired.png"),
  3: require("../assets/neutral.png"),
  4: require("../assets/good.png"),
  5: require("../assets/great.png"),
};

const MOOD_LABELS = [
  { value: "1", label: "Rough" },
  { value: "2", label: "Low" },
  { value: "3", label: "Okay" },
  { value: "4", label: "Good" },
  { value: "5", label: "Great" },
];

export default function MoodChart({ days = [] }) {
  const theme = useTheme();

  if (days.length === 0) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.title}>
            Mood Chart
          </Text>
          <Text variant="bodySmall" style={styles.emptyText}>
            No mood data yet — complete your first day to see your chart.
          </Text>
        </Card.Content>
      </Card>
    );
  }

  const chartData = {
    labels: days.map((d) => `${d.day_number}`),
    datasets: [{ data: days.map((d) => d.mood_rating) }],
  };

  const chartWidth = Math.max(screenWidth - 60, days.length * 60);

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.title}>
          Mood Chart
        </Text>

        <View style={styles.mainLayout}>
          <View style={styles.yAxisTitleContainer}>
            <Text style={styles.axisTextVertical}>MOOD</Text>
          </View>

          <View style={styles.scrollContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View>
                <LineChart
                  data={chartData}
                  width={chartWidth}
                  height={220}
                  fromZero
                  segments={4}
                  chartConfig={{
                    backgroundColor: "#fff",
                    backgroundGradientFrom: "#fff",
                    backgroundGradientTo: "#fff",
                    decimalPlaces: 0,
                    color: () => "#5C5C8A",
                    labelColor: () => "#9A9AAF",
                    propsForDots: {
                      r: "5",
                      strokeWidth: "2",
                      stroke: "#5C5C8A",
                    },
                    propsForBackgroundLines: {
                      stroke: "#F0F0F0",
                    },
                  }}
                  bezier
                  style={styles.chartStyle}
                />
              </View>
            </ScrollView>

            <View style={styles.xAxisTitleContainer}>
              <Text style={styles.axisTextHorizontal}>DAYS</Text>
            </View>
          </View>
        </View>

        <View style={styles.legendWrapper}>
          {MOOD_LABELS.map((mood) => (
            <View key={mood.value} style={styles.legendItem}>
              <Image source={MOOD_IMAGES[Number(mood.value)]} style={styles.legendImage} />
              <Text style={styles.legendValue}>{mood.value}</Text>
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
    elevation: 2,
  },
  title: {
    fontWeight: "800",
    color: "#1A1A2E",
    marginBottom: 16,
  },
  mainLayout: {
    flexDirection: "row",
  },
  yAxisTitleContainer: {
    width: 35,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },
  axisTextVertical: {
    fontSize: 10,
    fontWeight: "900",
    color: "#9A9AAF",
    transform: [{ rotate: "-90deg" }],
    width: 100,
    textAlign: "center",
    letterSpacing: 1.5,
  },
  scrollContainer: {
    flex: 1,
  },
  chartStyle: {
    paddingRight: 45,
    marginTop: 8,
  },
  xAxisTitleContainer: {
    alignItems: "center",
    marginTop: 5,
    paddingRight: 40,
  },
  axisTextHorizontal: {
    fontSize: 10,
    fontWeight: "900",
    color: "#9A9AAF",
    letterSpacing: 2,
  },
  legendWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  legendItem: {
    alignItems: "center",
    gap: 4,
  },
  legendImage: {
    width: 24,
    height: 24,
  },
  legendValue: {
    fontSize: 12,
    fontWeight: "700",
    color: "#5C5C8A",
  },
  emptyText: {
    color: "#9A9AAF",
    fontStyle: "italic",
    paddingVertical: 10,
  },
});
