import { View } from "react-native";
import { Card, Divider, List, Text, useTheme } from "react-native-paper";

export default function AISummaries({ summaries = [] }) {
  const theme = useTheme();

  if (summaries.length === 0) {
    return (
      <Card style={{ backgroundColor: theme.colors.surface }}>
        <Card.Content>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 4 }}>
            AI Personalised Summaries
          </Text>
          <Text variant="bodySmall" style={{ color: theme.custom.muted, fontStyle: "italic" }}>
            No summaries yet — complete your first week to get your first AI summary.
          </Text>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card style={{ backgroundColor: theme.colors.surface }}>
      <Card.Content>
        <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 4 }}>
          AI Personalised Summaries
        </Text>

        {summaries.map((item, index) => (
          <View key={item.week}>
            <List.Accordion
              title={`Week ${item.week}`}
              description={new Date(item.created_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
              titleStyle={{ color: theme.colors.onSurface, fontWeight: "600" }}
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
                  style={{ color: theme.colors.onSurface, lineHeight: 22, paddingTop: 12 }}
                >
                  {item.summary}
                </Text>
              </View>
            </List.Accordion>
            {index < summaries.length - 1 && <Divider />}
          </View>
        ))}
      </Card.Content>
    </Card>
  );
}
