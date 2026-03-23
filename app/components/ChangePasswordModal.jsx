import { useState } from "react";
import { Button, Modal, Portal, Text, TextInput, useTheme } from "react-native-paper";
import { useUserContext } from "../context/UserContext";

const BASE_URL = "https://xp75-be.onrender.com";

export default function ChangePasswordModal({ visible, onDismiss }) {
  const { accessToken } = useUserContext();
  const theme = useTheme();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSave = async () => {
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
        setError(data.message || "Failed to change password");
        return;
      }
      setSuccess("Password changed ✓");
      setCurrentPassword("");
      setNewPassword("");
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
          Update Password
        </Button>
        <Button mode="text" onPress={onDismiss}>
          Cancel
        </Button>
      </Modal>
    </Portal>
  );
}
