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
import { useThemeColors } from "@/constants/theme";

export default function SignUpScreen() {
  const theme = useThemeColors();
  const {
    authMethod,
    setAuthMethod,
    email,
    setEmail,
    phoneNumber,
    setPhoneNumber,
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
          <AuthHeader
            title={pendingVerification ? "Verify Account" : "Create Account"}
            subtitle={
              pendingVerification
                ? `Enter the 6-digit code sent to ${
                    authMethod === "email" ? email : phoneNumber
                  }`
                : "Join CalMate AI to track your nutrition intelligently"
            }
          />

          <View style={styles.formContainer}>
            {!pendingVerification ? (
              <>
                {/* Method Selector Tabs */}
                <View
                  style={[
                    styles.tabContainer,
                    { backgroundColor: theme.card, borderColor: theme.border },
                  ]}
                >
                  <TouchableOpacity
                    style={[
                      styles.tabButton,
                      authMethod === "email" && { backgroundColor: theme.muted },
                    ]}
                    onPress={() => {
                      setAuthMethod("email");
                      setError(null);
                    }}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        {
                          color:
                            authMethod === "email"
                              ? theme.foreground
                              : theme.mutedForeground,
                        },
                      ]}
                    >
                      Email
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.tabButton,
                      authMethod === "phone" && { backgroundColor: theme.muted },
                    ]}
                    onPress={() => {
                      setAuthMethod("phone");
                      setError(null);
                    }}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        {
                          color:
                            authMethod === "phone"
                              ? theme.foreground
                              : theme.mutedForeground,
                        },
                      ]}
                    >
                      Phone Number
                    </Text>
                  </TouchableOpacity>
                </View>

                {authMethod === "email" ? (
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
                ) : (
                  <CustomInput
                    label="Phone Number"
                    placeholder="e.g. +1234567890"
                    value={phoneNumber}
                    onChangeText={(text) => {
                      setPhoneNumber(text);
                      setError(null);
                    }}
                    autoCapitalize="none"
                    keyboardType="phone-pad"
                    autoComplete="tel"
                  />
                )}

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

                {error && (
                  <Text style={[styles.errorText, { color: theme.destructive }]}>
                    {error}
                  </Text>
                )}

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

                {error && (
                  <Text style={[styles.errorText, { color: theme.destructive }]}>
                    {error}
                  </Text>
                )}

                <PrimaryButton
                  title="Verify Account"
                  onPress={handleVerify}
                  loading={loading}
                />

                <TouchableOpacity
                  onPress={() => setPendingVerification(false)}
                  style={styles.backButton}
                >
                  <Text
                    style={[
                      styles.backButtonText,
                      { color: theme.mutedForeground },
                    ]}
                  >
                    Back to Sign Up
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {!pendingVerification && (
            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: theme.mutedForeground }]}>
                Already have an account?{" "}
              </Text>
              <Link href={"/(auth)/sign-in" as any} asChild>
                <TouchableOpacity>
                  <Text style={[styles.footerLink, { color: theme.primary }]}>
                    Sign In
                  </Text>
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
  tabContainer: {
    flexDirection: "row",
    borderRadius: 10,
    borderWidth: 1,
    padding: 3,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 7,
    alignItems: "center",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 13,
    marginBottom: 16,
    fontWeight: "500",
  },
  backButton: {
    marginTop: 16,
    alignItems: "center",
  },
  backButtonText: {
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
    fontSize: 14,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: "600",
  },
});
