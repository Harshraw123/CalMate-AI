import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSignUpForm } from "@/hooks/useSignUpForm";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { CustomInput } from "@/components/ui/CustomInput";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

export default function SignUpScreen() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    pendingVerification,
    setPendingVerification,
    code,
    setCode,
    loading,
    error,
    setError,
    handleSignUp,
    handleVerify,
  } = useSignUpForm();

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
          <AuthHeader
            title={pendingVerification ? "Verify Email" : "Create Account"}
            subtitle={
              pendingVerification
                ? `Enter the code sent to ${email}`
                : "Join CalMate AI to kickstart your fitness journey"
            }
          />

          <View style={styles.formContainer}>
            {!pendingVerification ? (
              <>
                <CustomInput
                  label="Email Address"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setError(null);
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                />

                <CustomInput
                  label="Password"
                  placeholder="Create a password"
                  isPassword
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setError(null);
                  }}
                  autoCapitalize="none"
                  autoComplete="password-new"
                />

                <CustomInput
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  isPassword
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                  secureTextEntry={!showPassword}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    setError(null);
                  }}
                  autoCapitalize="none"
                />

                {error && <Text style={styles.errorText}>{error}</Text>}

                <PrimaryButton
                  title="Sign Up"
                  onPress={handleSignUp}
                  loading={loading}
                />
              </>
            ) : (
              <>
                <CustomInput
                  label="Verification Code"
                  placeholder="Enter 6-digit code"
                  keyboardType="number-pad"
                  value={code}
                  onChangeText={(text) => {
                    setCode(text);
                    setError(null);
                  }}
                />

                {error && <Text style={styles.errorText}>{error}</Text>}

                <PrimaryButton
                  title="Verify Account"
                  onPress={handleVerify}
                  loading={loading}
                />

                <TouchableOpacity
                  onPress={() => setPendingVerification(false)}
                  style={styles.backButton}
                >
                  <Text style={styles.backButtonText}>Back to Sign Up</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {!pendingVerification && (
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <Link href={"/(auth)/sign-in" as any} asChild>
                <TouchableOpacity>
                  <Text style={styles.footerLink}>Sign In</Text>
                </TouchableOpacity>
              </Link>
            </View>
          )}
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    paddingBottom: 40,
  },
  formContainer: {
    width: "100%",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 13,
    marginBottom: 16,
    fontWeight: "500",
  },
  backButton: {
    marginTop: 16,
    alignItems: "center",
  },
  backButtonText: {
    color: "#888888",
    fontSize: 14,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },
  footerText: {
    color: "#666666",
    fontSize: 14,
  },
  footerLink: {
    color: "#10B981",
    fontSize: 14,
    fontWeight: "600",
  },
});
