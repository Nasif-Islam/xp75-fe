import { View } from "react-native";
import { Card, Divider, List, Text, useTheme } from "react-native-paper";

// Mock data — replace with real GET /api/weekly-summaries later
const MOCK_SUMMARIES = [
  {
    id: 1,
    week: 1,
    summary:
      "Strong start to the challenge. You completed all 5 core tasks on 6 out of 7 days. Your mood averaged 4/5 — keep that energy going into week 2. Focus on consistency with your outdoor workouts.",
    created_at: "2024-09-07T00:00:00.000Z",
  },
  {
    id: 2,
    week: 2,
    summary:
      "A slight dip in mood mid-week but you bounced back strongly. Diet adherence was excellent — 7/7 days. Consider adding more variety to your reading to keep it engaging.",
    created_at: "2024-09-14T00:00:00.000Z",
  },
  {
    id: 3,
    week: 3,
    summary:
      "Best week so far. All tasks completed every day. Your mood peaked at 5/5 on three occasions. The consistency is building — you're developing a strong routine.",
    created_at: "2024-09-21T00:00:00.000Z",
  },
  {
    id: 4,
    week: 4,
    summary:
      "Bronze milestone achieved! 25 days complete. You're a quarter of the way through. Water consumption was slightly down — make sure you're hitting the gallon target daily.",
    created_at: "2024-09-28T00:00:00.000Z",
  },
];

export default function AISummaries() {
  const theme = useTheme();

  return (
    <Card style={{ backgroundColor: theme.colors.surface }}>
      <Card.Content>
        <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 4 }}>
          AI Personalised Summaries
        </Text>

        {MOCK_SUMMARIES.map((item, index) => (
          <View key={item.id}>
            <List.Accordion
              title={`Week ${item.week}`}
              description={new Date(item.created_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
              titleStyle={{
                color: theme.colors.onSurface,
                fontWeight: "600",
              }}
              descriptionStyle={{ color: theme.custom.muted }}
              style={{ backgroundColor: theme.colors.surface }}
              left={(props) => <List.Icon {...props} icon="robot" color={theme.colors.primary} />}
            >
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingBottom: 16,
                  backgroundColor: theme.colors.background,
                  borderRadius: 10,
                  marginHorizontal: 8,
                  marginBottom: 8,
                }}
              >
                <Text
                  variant="bodyMedium"
                  style={{
                    color: theme.colors.onSurface,
                    lineHeight: 22,
                    paddingTop: 12,
                  }}
                >
                  {item.summary}
                </Text>
              </View>
            </List.Accordion>
            {index < MOCK_SUMMARIES.length - 1 && <Divider />}
          </View>
        ))}
      </Card.Content>
    </Card>
  );
}
