import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  TouchableOpacityProps,
} from "react-native";

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
  return (
    <TouchableOpacity
      style={[styles.button, (disabled || loading) && styles.disabledButton, style]}
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
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#161616",
    height: 52,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#222222",
    width: "100%",
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.6,
  },
});
