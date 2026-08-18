import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { useThemeColors } from "@/constants/theme";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => {
  const theme = useThemeColors();

  return (
    <View style={styles.header}>
      <Image
        source={require("@/assets/images/logo-glow.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={[styles.title, { color: theme.foreground }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: theme.mutedForeground }]}>
        {subtitle}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 6,
    maxWidth: "85%",
    lineHeight: 20,
  },
});
