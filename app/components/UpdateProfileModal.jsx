import { useState } from "react";
import { ScrollView } from "react-native";
import { Button, Modal, Portal, Text, TextInput, useTheme } from "react-native-paper";
import { useUserContext } from "../context/UserContext";

const BASE_URL = "https://xp75-be.onrender.com";

export default function UpdateProfileModal({ visible, onDismiss }) {
  const { user, accessToken, login } = useUserContext();
  const theme = useTheme();

  const [name, setName] = useState(user?.name || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleUpdateProfile = async () => {
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
        body: JSON.stringify({ name, avatar_url: avatarUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update profile");
        return;
      }
      login(data.user, accessToken);
      setSuccess("Profile updated successfully");
    } catch (err) {
      setError("Could not reach the server");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${BASE_URL}/api/profile/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to change password");
        return;
      }
      setSuccess("Password changed. Please log in again.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
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
          padding: 20,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text variant="titleLarge" style={{ color: theme.colors.onSurface, marginBottom: 20 }}>
            Edit Profile
          </Text>

          {/* Update name + avatar */}
          <Text variant="titleSmall" style={{ color: theme.custom.muted, marginBottom: 12 }}>
            Profile Info
          </Text>
          <TextInput
            label="Name"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={{ marginBottom: 12 }}
          />
          <TextInput
            label="Avatar URL"
            value={avatarUrl}
            onChangeText={setAvatarUrl}
            mode="outlined"
            style={{ marginBottom: 16 }}
          />
          <Button
            mode="contained"
            onPress={handleUpdateProfile}
            loading={loading}
            style={{ marginBottom: 24 }}
          >
            Update Profile
          </Button>

          {/* Change password */}
          <Text variant="titleSmall" style={{ color: theme.custom.muted, marginBottom: 12 }}>
            Change Password
          </Text>
          <TextInput
            label="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            mode="outlined"
            style={{ marginBottom: 12 }}
          />
          <TextInput
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            mode="outlined"
            style={{ marginBottom: 16 }}
          />
          <Button
            mode="contained"
            onPress={handleChangePassword}
            loading={loading}
            style={{ marginBottom: 16 }}
          >
            Change Password
          </Button>

          {/* Feedback */}
          {error && <Text style={{ color: theme.colors.error, textAlign: "center" }}>{error}</Text>}
          {success && (
            <Text style={{ color: theme.custom.muted, textAlign: "center" }}>{success}</Text>
          )}

          <Button mode="text" onPress={onDismiss} style={{ marginTop: 8 }}>
            Cancel
          </Button>
        </ScrollView>
      </Modal>
    </Portal>
  );
}
