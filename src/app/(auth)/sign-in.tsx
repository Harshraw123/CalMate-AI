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
import * as WebBrowser from "expo-web-browser";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSignInForm } from "@/hooks/useSignInForm";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { CustomInput } from "@/components/ui/CustomInput";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { GoogleButton } from "@/components/ui/GoogleButton";
import { useThemeColors } from "@/constants/theme";

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const theme = useThemeColors();
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    loading,
    error,
    setError,
    handleSignIn,
    handleGoogleSignIn,
  } = useSignInForm();

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
            title="CalMate AI"
            subtitle="Track your nutrition intelligently with AI"
          />

          <View style={styles.formContainer}>
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
              placeholder="Enter your password"
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
              autoComplete="password"
            />

            {error && (
              <Text style={[styles.errorText, { color: theme.destructive }]}>
                {error}
              </Text>
            )}

            <PrimaryButton
              title="Sign In"
              onPress={handleSignIn}
              loading={loading}
            />

            <View style={styles.dividerContainer}>
              <View
                style={[styles.dividerLine, { backgroundColor: theme.border }]}
              />
              <Text
                style={[
                  styles.dividerText,
                  { color: theme.mutedForeground },
                ]}
              >
                or continue with
              </Text>
              <View
                style={[styles.dividerLine, { backgroundColor: theme.border }]}
              />
            </View>

            <GoogleButton onPress={handleGoogleSignIn} loading={loading} />
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.mutedForeground }]}>
              Don't have an account?{" "}
            </Text>
            <Link href={"/(auth)/sign-up" as any} asChild>
              <TouchableOpacity>
                <Text style={[styles.footerLink, { color: theme.primary }]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </Link>
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
  formContainer: {
    width: "100%",
  },
  errorText: {
    fontSize: 13,
    marginBottom: 16,
    fontWeight: "500",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 13,
    paddingHorizontal: 16,
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
