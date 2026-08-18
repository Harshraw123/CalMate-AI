import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/expo";
import { SafeAreaView } from "react-native-safe-area-context";
import { completeOnboardingProfile } from "@/services/userService";
import { CustomInput } from "@/components/ui/CustomInput";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useThemeColors } from "@/constants/theme";

export default function OnboardingScreen() {
  const theme = useThemeColors();
  const { user } = useUser();
  const router = useRouter();

  const [name, setName] = useState("");
  const [targetCalories, setTargetCalories] = useState("2000");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.fullName || "");
    }
  }, [user]);

  const handleCompleteOnboarding = async () => {
    if (!user) return;
    if (!name || !targetCalories || !age || !weight || !height) {
      setError("Please complete all profile details.");
      return;
    }

    const calorieNum = Number(targetCalories);
    const ageNum = Number(age);
    const weightNum = Number(weight);
    const heightNum = Number(height);

    if (isNaN(calorieNum) || isNaN(ageNum) || isNaN(weightNum) || isNaN(heightNum)) {
      setError("Please enter valid numerical values.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await completeOnboardingProfile(user.id, {
        name,
        targetCalories: calorieNum,
        age: ageNum,
        weight: weightNum,
        height: heightNum,
      });

      router.replace("/(app)" as any);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.foreground }]}>
              Profile Onboarding
            </Text>
            <Text style={[styles.subtitle, { color: theme.mutedForeground }]}>
              Set up your physical metrics and daily calorie goals to start tracking
            </Text>
          </View>

          <View style={styles.formContainer}>
            <CustomInput
              label="Full Name"
              placeholder="Enter your name"
              value={name}
              onChangeText={(text) => {
                setName(text);
                setError(null);
              }}
            />

            <CustomInput
              label="Daily Calorie Target (kcal)"
              placeholder="e.g. 2000"
              keyboardType="number-pad"
              value={targetCalories}
              onChangeText={(text) => {
                setTargetCalories(text);
                setError(null);
              }}
            />

            <View style={styles.row}>
              <View style={styles.rowItem}>
                <CustomInput
                  label="Age"
                  placeholder="e.g. 25"
                  keyboardType="number-pad"
                  value={age}
                  onChangeText={(text) => {
                    setAge(text);
                    setError(null);
                  }}
                />
              </View>

              <View style={styles.rowItem}>
                <CustomInput
                  label="Weight (kg)"
                  placeholder="e.g. 70"
                  keyboardType="decimal-pad"
                  value={weight}
                  onChangeText={(text) => {
                    setWeight(text);
                    setError(null);
                  }}
                />
              </View>
            </View>

            <CustomInput
              label="Height (cm)"
              placeholder="e.g. 175"
              keyboardType="decimal-pad"
              value={height}
              onChangeText={(text) => {
                setHeight(text);
                setError(null);
              }}
            />

            {error && (
              <Text style={[styles.errorText, { color: theme.destructive }]}>
                {error}
              </Text>
            )}

            <PrimaryButton
              title="Complete Setup"
              onPress={handleCompleteOnboarding}
              loading={loading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    maxWidth: "85%",
    lineHeight: 20,
  },
  formContainer: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowItem: {
    flex: 0.48,
  },
  errorText: {
    fontSize: 13,
    marginBottom: 16,
    fontWeight: "500",
  },
});
