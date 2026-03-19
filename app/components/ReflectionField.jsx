import { View, Text, TextInput, StyleSheet } from "react-native";
import { useState } from "react";

const MUTED = "#9A9AAF";
const TEXT = "#1A1A2E";
const CARD = "#FFFFFF";
const PURPLE = "#403557";

const ReflectionField = ({ label, placeholder, value, onChangeText, maxLength, editable }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      {editable ? (
        <>
          <TextInput
            style={[styles.textArea, isFocused && styles.textAreaFocused]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={MUTED}
            multiline
            maxLength={maxLength}
            textAlignVertical="top"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <Text style={styles.charCount}>
            {(value || "").length}/{maxLength}
          </Text>
        </>
      ) : (
        <Text style={styles.value}>{value}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: CARD,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: PURPLE,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  value: {
    fontSize: 14,
    color: TEXT,
    lineHeight: 22,
    paddingTop: 4,
  },
  charCount: {
    fontSize: 11,
    color: MUTED,
    textAlign: "right",
    marginTop: 4,
  },
  textArea: {
    fontSize: 14,
    color: TEXT,
    minHeight: 100,
    textAlignVertical: "top",
    paddingTop: 4,
    borderWidth: 1,
    borderColor: "#E2E4EE",
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  textAreaFocused: {
    borderColor: PURPLE,
  },
});

export default ReflectionField;
