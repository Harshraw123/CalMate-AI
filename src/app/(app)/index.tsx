import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { useClerk } from "@clerk/expo";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useThemeColors } from "@/constants/theme";

export default function DashboardScreen() {
  const theme = useThemeColors();
  const { signOut } = useClerk();
  const { user, profile, loading, error } = useUserProfile();

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header bar */}
        <View style={styles.topBar}>
          <View style={styles.userInfoContainer}>
            <Image
              source={{
                uri:
                  profile?.profileImage ||
                  user?.imageUrl ||
                  "https://ui-avatars.com/api/?name=User&background=15803D&color=fff",
              }}
              style={[styles.avatar, { borderColor: theme.border }]}
            />
            <View>
              <Text style={[styles.greetingText, { color: theme.mutedForeground }]}>
                Welcome back,
              </Text>
              <Text style={[styles.nameText, { color: theme.foreground }]}>
                {profile?.name || user?.fullName || "Member"}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.signOutButton,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
            onPress={() => signOut()}
            activeOpacity={0.8}
          >
            <Text style={[styles.signOutText, { color: theme.destructive }]}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>

        {error && (
          <View
            style={[
              styles.errorContainer,
              { backgroundColor: theme.destructiveSubtle },
            ]}
          >
            <Text style={[styles.errorText, { color: theme.destructive }]}>
              {error}
            </Text>
          </View>
        )}

        {/* Daily Overview */}
        <View style={styles.metricsContainer}>
          <Text style={[styles.sectionTitle, { color: theme.foreground }]}>
            Daily Overview
          </Text>

          {/* Calorie Card - Calories Orange restricted strictly to calorie value */}
          <View
            style={[
              styles.calorieCard,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <Text
              style={[styles.calorieLabel, { color: theme.mutedForeground }]}
            >
              Target Daily Calories
            </Text>
            <Text style={[styles.calorieValue, { color: theme.calories }]}>
              {profile?.targetCalories || 2000}{" "}
              <Text style={[styles.unitText, { color: theme.mutedForeground }]}>
                kcal
              </Text>
            </Text>
          </View>

          {/* Physical Metrics Grid - Clean neutral cards */}
          <View style={styles.gridContainer}>
            <View
              style={[
                styles.metricCard,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <Text style={[styles.metricLabel, { color: theme.mutedForeground }]}>
                Age
              </Text>
              <Text style={[styles.metricValue, { color: theme.foreground }]}>
                {profile?.age || "--"}{" "}
                <Text style={[styles.metricUnit, { color: theme.mutedForeground }]}>
                  yrs
                </Text>
              </Text>
            </View>

            <View
              style={[
                styles.metricCard,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <Text style={[styles.metricLabel, { color: theme.mutedForeground }]}>
                Weight
              </Text>
              <Text style={[styles.metricValue, { color: theme.foreground }]}>
                {profile?.weight || "--"}{" "}
                <Text style={[styles.metricUnit, { color: theme.mutedForeground }]}>
                  kg
                </Text>
              </Text>
            </View>

            <View
              style={[
                styles.metricCard,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <Text style={[styles.metricLabel, { color: theme.mutedForeground }]}>
                Height
              </Text>
              <Text style={[styles.metricValue, { color: theme.foreground }]}>
                {profile?.height || "--"}{" "}
                <Text style={[styles.metricUnit, { color: theme.mutedForeground }]}>
                  cm
                </Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Integrated AI Meal Vision Card - AI Purple restricted to small badge */}
        <View
          style={[
            styles.aiCard,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <View style={styles.aiBadgeHeader}>
            <View
              style={[styles.aiBadge, { backgroundColor: theme.aiSubtle }]}
            >
              <Text style={[styles.aiBadgeText, { color: theme.ai }]}>
                AI Vision
              </Text>
            </View>
          </View>
          <Text style={[styles.aiCardTitle, { color: theme.foreground }]}>
            Log Meal via Camera
          </Text>
          <Text style={[styles.aiCardDescription, { color: theme.mutedForeground }]}>
            Snap a photo of your meal to instantly estimate macronutrients and calorie count.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    borderWidth: 1,
  },
  greetingText: {
    fontSize: 13,
  },
  nameText: {
    fontSize: 17,
    fontWeight: "700",
  },
  signOutButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  signOutText: {
    fontSize: 13,
    fontWeight: "600",
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 13,
  },
  metricsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  calorieCard: {
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    marginBottom: 14,
  },
  calorieLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  calorieValue: {
    fontSize: 34,
    fontWeight: "800",
    marginTop: 4,
    letterSpacing: -0.5,
  },
  unitText: {
    fontSize: 16,
    fontWeight: "500",
  },
  gridContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metricCard: {
    flex: 0.31,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  metricValue: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 4,
  },
  metricUnit: {
    fontSize: 12,
    fontWeight: "400",
  },
  aiCard: {
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    marginTop: 4,
  },
  aiBadgeHeader: {
    flexDirection: "row",
    marginBottom: 10,
  },
  aiBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  aiBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  aiCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  aiCardDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
});
