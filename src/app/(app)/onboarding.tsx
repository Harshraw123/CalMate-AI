import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/expo";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingScreen() {
  const { user, isLoaded } = useUser();
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
    if (!isLoaded || !user) return;
    if (!name || !targetCalories || !age || !weight || !height) {
      setError("Please fill in all profile details.");
      return;
    }

    const calorieNum = parseInt(targetCalories, 10);
    const ageNum = parseInt(age, 10);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (isNaN(calorieNum) || calorieNum <= 0) {
      setError("Please enter a valid daily calorie target.");
      return;
    }
    if (isNaN(ageNum) || ageNum <= 0) {
      setError("Please enter a valid age.");
      return;
    }
    if (isNaN(weightNum) || weightNum <= 0) {
      setError("Please enter a valid weight.");
      return;
    }
    if (isNaN(heightNum) || heightNum <= 0) {
      setError("Please enter a valid height.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Save user profile to Firestore using merge to preserve automatically initialized fields
      const userDocRef = doc(db, "users", user.id);
      await setDoc(
        userDocRef,
        {
          name: name,
          targetCalories: calorieNum,
          age: ageNum,
          weight: weightNum,
          height: heightNum,
          onboardingComplete: true,
        },
        { merge: true }
      );

      // Navigate to the main dashboard
      router.replace("/(app)" as any);
    } catch (err: any) {
      console.error("Firestore user creation error:", err);
      setError("Failed to create profile. Please check your network and try again.");
    } finally {
      setLoading(false);
    }
  };

  const adjustCalories = (amount: number) => {
    const current = parseInt(targetCalories, 10) || 2000;
    const nextVal = Math.max(500, current + amount);
    setTargetCalories(nextVal.toString());
  };

  if (!isLoaded || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title */}
          <View style={styles.header}>
            <Text style={styles.title}>Let's Know You</Text>
            <Text style={styles.subtitle}>
              Configure your daily calorie goal and physical profile metrics for precise AI suggestions
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor="#666"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setError(null);
                }}
              />
            </View>

            {/* Target Calories Slider-like section */}
            <Text style={styles.label}>Daily Calorie Target (kcal)</Text>
            <View style={styles.calorieAdjuster}>
              <TouchableOpacity
                onPress={() => adjustCalories(-100)}
                style={styles.adjustButton}
                activeOpacity={0.7}
              >
                <Text style={styles.adjustButtonText}>-100</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.calorieInput}
                keyboardType="number-pad"
                value={targetCalories}
                onChangeText={(text) => {
                  setTargetCalories(text);
                  setError(null);
                }}
              />
              <TouchableOpacity
                onPress={() => adjustCalories(100)}
                style={styles.adjustButton}
                activeOpacity={0.7}
              >
                <Text style={styles.adjustButtonText}>+100</Text>
              </TouchableOpacity>
            </View>

            {/* Grid of inputs */}
            <View style={styles.gridRow}>
              <View style={styles.gridCol}>
                <Text style={styles.label}>Age</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 25"
                    placeholderTextColor="#666"
                    keyboardType="number-pad"
                    value={age}
                    onChangeText={(text) => {
                      setAge(text);
                      setError(null);
                    }}
                  />
                </View>
              </View>

              <View style={styles.gridCol}>
                <Text style={styles.label}>Weight (kg)</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 70"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                    value={weight}
                    onChangeText={(text) => {
                      setWeight(text);
                      setError(null);
                    }}
                  />
                </View>
              </View>

              <View style={styles.gridCol}>
                <Text style={styles.label}>Height (cm)</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 175"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                    value={height}
                    onChangeText={(text) => {
                      setHeight(text);
                      setError(null);
                    }}
                  />
                </View>
              </View>
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* Complete Profile CTA */}
            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.disabledButton]}
              onPress={handleCompleteOnboarding}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#050505" size="small" />
              ) : (
                <Text style={styles.primaryButtonText}>Complete Setup</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  keyboardView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0A0A0A",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 36,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#888888",
    textAlign: "center",
    marginTop: 8,
    maxWidth: "90%",
  },
  formContainer: {
    width: "100%",
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#A0A0A0",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  inputWrapper: {
    width: "100%",
    backgroundColor: "#161616",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#222222",
    marginBottom: 20,
  },
  input: {
    height: 52,
    paddingHorizontal: 16,
    color: "#FFFFFF",
    fontSize: 15,
  },
  calorieAdjuster: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#161616",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#222222",
    padding: 8,
    marginBottom: 24,
  },
  adjustButton: {
    backgroundColor: "#222222",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  adjustButtonText: {
    color: "#10B981",
    fontSize: 14,
    fontWeight: "700",
  },
  calorieInput: {
    flex: 1,
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    height: 48,
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  gridCol: {
    flex: 1,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 13,
    marginBottom: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  primaryButton: {
    backgroundColor: "#10B981",
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: "#050505",
    fontSize: 16,
    fontWeight: "700",
  },
  disabledButton: {
    opacity: 0.6,
  },
});
