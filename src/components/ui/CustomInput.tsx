import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TextInputProps,
} from "react-native";
import { SymbolView } from "expo-symbols";
import { useThemeColors } from "@/constants/theme";

interface CustomInputProps extends TextInputProps {
  label: string;
  isPassword?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  isPassword = false,
  showPassword = false,
  onTogglePassword,
  style,
  ...props
}) => {
  const theme = useThemeColors();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.mutedForeground }]}>
        {label}
      </Text>
      <View
        style={[
          styles.inputWrapper,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            { color: theme.foreground },
            isPassword && { paddingRight: 50 },
            style,
          ]}
          placeholderTextColor={theme.mutedForeground}
          {...props}
        />
        {isPassword && onTogglePassword && (
          <TouchableOpacity
            onPress={onTogglePassword}
            style={styles.eyeIcon}
            activeOpacity={0.7}
          >
            <SymbolView
              name={showPassword ? "eye.slash" : "eye"}
              size={18}
              tintColor={theme.mutedForeground}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  inputWrapper: {
    position: "relative",
    width: "100%",
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    height: "100%",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
});
