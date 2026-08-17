import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import { useAuth, useUser } from "@clerk/expo";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SafeAreaView } from "react-native-safe-area-context";
import { SymbolView } from "expo-symbols";

export default function DashboardScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchUserProfile = async () => {
      try {
        const docRef = doc(db, "users", user.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  const userDisplayName = profile?.name || user?.fullName || "User";
  const userPhoto = profile?.profileImage || user?.imageUrl || null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Header Row */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{userDisplayName}</Text>
          </View>
          {userPhoto ? (
            <Image source={{ uri: userPhoto }} style={styles.profilePic} />
          ) : (
            <View style={styles.profilePicFallback}>
              <SymbolView name="person.fill" size={24} tintColor="#A0A0A0" />
            </View>
          )}
        </View>

        {/* Hero Card: Daily Calorie Goal */}
        <View style={styles.heroCard}>
          <View style={styles.heroLeft}>
            <Text style={styles.heroLabel}>Daily Target</Text>
            <Text style={styles.heroValue}>
              {profile?.targetCalories || 2000} <Text style={styles.heroUnit}>kcal</Text>
            </Text>
            <Text style={styles.heroDesc}>AI suggested target based on metrics</Text>
          </View>
          <View style={styles.heroRight}>
            <View style={styles.circleGraphic}>
              <SymbolView name="flame.fill" size={32} tintColor="#10B981" />
            </View>
          </View>
        </View>

        {/* Physical Stats Grid */}
        <Text style={styles.sectionTitle}>Your Fitness Metrics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <SymbolView name="calendar" size={20} tintColor="#10B981" />
            </View>
            <Text style={styles.statLabel}>Age</Text>
            <Text style={styles.statValue}>{profile?.age || "--"} yrs</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <SymbolView name="scalemass.fill" size={20} tintColor="#10B981" />
            </View>
            <Text style={styles.statLabel}>Weight</Text>
            <Text style={styles.statValue}>{profile?.weight || "--"} kg</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <SymbolView name="ruler.fill" size={20} tintColor="#10B981" />
            </View>
            <Text style={styles.statLabel}>Height</Text>
            <Text style={styles.statValue}>{profile?.height || "--"} cm</Text>
          </View>
        </View>

        {/* Action card for future calorie tracker features */}
        <View style={styles.actionCard}>
          <Text style={styles.actionTitle}>Log meals with AI</Text>
          <Text style={styles.actionSubtitle}>
            Take a photo of your meal or write a description to get an instant nutritional breakdown. Coming in Phase 2!
          </Text>
        </View>

        {/* Sign Out Action Button */}
        <TouchableOpacity style={styles.signOutButton} onPress={() => signOut()} activeOpacity={0.8}>
          <SymbolView name="rectangle.portrait.and.arrow.right" size={18} tintColor="#EF4444" />
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  greeting: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
  },
  userName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 2,
  },
  profilePic: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "#10B981",
  },
  profilePicFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#161616",
    borderWidth: 1.5,
    borderColor: "#222222",
    justifyContent: "center",
    alignItems: "center",
  },
  heroCard: {
    backgroundColor: "#161616",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#222222",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  heroLeft: {
    flex: 1,
  },
  heroLabel: {
    fontSize: 11,
    color: "#888888",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  heroValue: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 6,
  },
  heroUnit: {
    fontSize: 18,
    fontWeight: "500",
    color: "#10B981",
  },
  heroDesc: {
    fontSize: 12,
    color: "#666666",
    marginTop: 8,
  },
  heroRight: {
    marginLeft: 16,
  },
  circleGraphic: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#A0A0A0",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#161616",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#222222",
    padding: 16,
    alignItems: "center",
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#222222",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 11,
    color: "#666666",
    fontWeight: "600",
  },
  statValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 4,
  },
  actionCard: {
    backgroundColor: "rgba(16, 185, 129, 0.05)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.15)",
    padding: 20,
    marginBottom: 36,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#10B981",
  },
  actionSubtitle: {
    fontSize: 13,
    color: "#888888",
    lineHeight: 18,
    marginTop: 6,
  },
  signOutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1C1414",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EF4444",
    height: 52,
    gap: 8,
  },
  signOutButtonText: {
    color: "#EF4444",
    fontSize: 15,
    fontWeight: "700",
  },
});
