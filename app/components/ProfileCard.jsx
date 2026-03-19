import { View } from "react-native";
import { Avatar, Button, Card, Text, useTheme } from "react-native-paper";
import { useUserContext } from "../context/UserContext";

export default function ProfileCard({ onEditPress }) {
  const { user } = useUserContext();
  const theme = useTheme();

  if (!user) return null;

  return (
    <Card style={{ backgroundColor: theme.colors.surface }}>
      <Card.Content style={{ alignItems: "center", gap: 12, paddingVertical: 20 }}>
        {user.avatar_url ? (
          <Avatar.Image size={80} source={{ uri: user.avatar_url }} />
        ) : (
          <Avatar.Text
            size={80}
            label={user.name.slice(0, 2).toUpperCase()}
            style={{ backgroundColor: theme.colors.primary }}
          />
        )}
        <View style={{ alignItems: "center", gap: 4 }}>
          <Text variant="headlineSmall" style={{ color: theme.colors.onSurface }}>
            {user.name}
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.custom.muted }}>
            {user.email}
          </Text>
        </View>
        <Button mode="contained" onPress={onEditPress}>
          Edit Profile
        </Button>
      </Card.Content>
    </Card>
  );
}
