import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  TouchableOpacityProps,
} from "react-native";
import { useThemeColors } from "@/constants/theme";

interface GoogleButtonProps extends TouchableOpacityProps {
  title?: string;
  loading?: boolean;
}

export const GoogleButton: React.FC<GoogleButtonProps> = ({
  title = "Continue with Google",
  loading = false,
  disabled,
  style,
  ...props
}) => {
  const theme = useThemeColors();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: theme.card, borderColor: theme.border },
        (disabled || loading) && styles.disabledButton,
        style,
      ]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      <Image
        source={{
          uri: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg",
        }}
        style={styles.icon}
      />
      <Text style={[styles.buttonText, { color: theme.foreground }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    width: "100%",
  },
  icon: {
    width: 18,
    height: 18,
    marginRight: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.6,
  },
});
