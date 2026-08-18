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

export default function DashboardScreen() {
  const { signOut } = useClerk();
  const { user, profile, loading, error } = useUserProfile();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top bar header */}
        <View style={styles.topBar}>
          <View style={styles.userInfoContainer}>
            <Image
              source={{
                uri:
                  profile?.profileImage ||
                  user?.imageUrl ||
                  "https://ui-avatars.com/api/?name=User&background=10B981&color=fff",
              }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.greetingText}>Welcome back,</Text>
              <Text style={styles.nameText}>
                {profile?.name || user?.fullName || "Fitness Enthusiast"}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={() => signOut()}
            activeOpacity={0.8}
          >
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Dashboard statistics card */}
        <View style={styles.metricsContainer}>
          <Text style={styles.sectionTitle}>Daily Overview</Text>

          <View style={styles.calorieCard}>
            <Text style={styles.calorieLabel}>Target Calories</Text>
            <Text style={styles.calorieValue}>
              {profile?.targetCalories || 2000}{" "}
              <Text style={styles.unitText}>kcal</Text>
            </Text>
          </View>

          <View style={styles.gridContainer}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Age</Text>
              <Text style={styles.metricValue}>
                {profile?.age || "--"}{" "}
                <Text style={styles.metricUnit}>yrs</Text>
              </Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Weight</Text>
              <Text style={styles.metricValue}>
                {profile?.weight || "--"}{" "}
                <Text style={styles.metricUnit}>kg</Text>
              </Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Height</Text>
              <Text style={styles.metricValue}>
                {profile?.height || "--"}{" "}
                <Text style={styles.metricUnit}>cm</Text>
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderTitle}>AI Calorie Tracker</Text>
          <Text style={styles.placeholderDescription}>
            Ready to log your meals and track calories with AI vision intelligence.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0A0A0A",
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
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#10B981",
  },
  greetingText: {
    color: "#888888",
    fontSize: 13,
  },
  nameText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  signOutButton: {
    backgroundColor: "#161616",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#222222",
  },
  signOutText: {
    color: "#EF4444",
    fontSize: 13,
    fontWeight: "600",
  },
  errorContainer: {
    backgroundColor: "#1F1212",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 13,
  },
  metricsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  calorieCard: {
    backgroundColor: "#161616",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#222222",
    marginBottom: 16,
  },
  calorieLabel: {
    color: "#888888",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  calorieValue: {
    color: "#10B981",
    fontSize: 36,
    fontWeight: "800",
    marginTop: 4,
  },
  unitText: {
    fontSize: 16,
    color: "#A0A0A0",
    fontWeight: "500",
  },
  gridContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metricCard: {
    flex: 0.31,
    backgroundColor: "#161616",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#222222",
  },
  metricLabel: {
    color: "#888888",
    fontSize: 12,
    fontWeight: "600",
  },
  metricValue: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 4,
  },
  metricUnit: {
    fontSize: 12,
    color: "#888888",
    fontWeight: "400",
  },
  placeholderCard: {
    backgroundColor: "#121212",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#222222",
    borderStyle: "dashed",
    alignItems: "center",
    marginTop: 8,
  },
  placeholderTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  placeholderDescription: {
    color: "#888888",
    fontSize: 13,
    textAlign: "center",
  },
});
