import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Image, View } from "react-native";
import { Button, Divider, Modal, Portal, Text, TextInput, useTheme } from "react-native-paper";
import { useUserContext } from "../context/UserContext";

const BASE_URL = "https://xp75-be.onrender.com";

export default function EditProfileModal({ visible, onDismiss }) {
  const { user, accessToken, login } = useUserContext();
  const theme = useTheme();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setAvatarPreview(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${BASE_URL}/api/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name, email, avatar_url: avatarPreview }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update profile");
        return;
      }
      login(data.user, accessToken);
      setSuccess("Profile updated ✓");
    } catch {
      setError("Could not reach the server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={{
          backgroundColor: theme.colors.surface,
          margin: 20,
          borderRadius: 14,
          padding: 24,
        }}
      >
        <Text variant="titleLarge" style={{ color: theme.colors.onSurface, marginBottom: 20 }}>
          Edit Profile
        </Text>

        {/* Avatar picker */}
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          {avatarPreview ? (
            <Image
              source={{ uri: avatarPreview }}
              style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 12 }}
            />
          ) : (
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: theme.colors.primary,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 28, fontWeight: "700" }}>
                {user?.name?.slice(0, 2).toUpperCase()}
              </Text>
            </View>
          )}
          <Button mode="outlined" icon="image" onPress={handlePickImage} compact>
            Choose Photo
          </Button>
        </View>

        <Divider style={{ marginBottom: 20 }} />

        <TextInput
          label="Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={{ marginBottom: 12 }}
        />
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={{ marginBottom: 20 }}
        />

        {error && (
          <Text style={{ color: theme.colors.error, marginBottom: 12, textAlign: "center" }}>
            {error}
          </Text>
        )}
        {success && (
          <Text style={{ color: theme.colors.secondary, marginBottom: 12, textAlign: "center" }}>
            {success}
          </Text>
        )}

        <Button mode="contained" onPress={handleSave} loading={loading} style={{ marginBottom: 8 }}>
          Save Changes
        </Button>
        <Button mode="text" onPress={onDismiss}>
          Cancel
        </Button>
      </Modal>
    </Portal>
  );
}
