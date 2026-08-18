import { useEffect, useState } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { ClerkProvider, ClerkLoaded, useAuth, useUser } from "@clerk/expo";
import { tokenCache } from "@/lib/clerk";
import { getUserProfile, initializeUserProfile } from "@/services/userService";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { useThemeColors } from "@/constants/theme";

function InitialLayout() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const segments = useSegments() as any;
  const router = useRouter();
  const theme = useThemeColors();
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === "(auth)";
    const isOnboarding = segments[1] === "onboarding";

    if (!isSignedIn) {
      setCheckingProfile(false);
      // Redirect to sign-up if the user is not in the auth group
      if (!inAuthGroup) {
        router.replace("/(auth)/sign-up" as any);
      }
    } else {
      // User is signed in, check and initialize profile in Firestore via userService
      const checkAndInitializeProfile = async () => {
        if (!user) return;
        
        try {
          const profile = await getUserProfile(userId!);
          
          if (profile) {
            if (profile.onboardingComplete) {
              // User profile complete, redirect to main app dashboard
              if (inAuthGroup || isOnboarding) {
                router.replace("/(app)" as any);
              }
            } else {
              // Profile exists but onboarding incomplete, go to onboarding
              if (!isOnboarding) {
                router.replace("/(app)/onboarding" as any);
              }
            }
          } else {
            // Initialize user document with basic Clerk info immediately
            await initializeUserProfile(user);

            // Redirect new user to onboarding
            if (!isOnboarding) {
              router.replace("/(app)/onboarding" as any);
            }
          }
        } catch (error) {
          console.error("Error verifying or initializing user profile:", error);
          // Fallback: in case of Firestore connection issue, allow entry to main dashboard
          if (inAuthGroup) {
            router.replace("/(app)" as any);
          }
        } finally {
          setCheckingProfile(false);
        }
      };

      checkAndInitializeProfile();
    }
  }, [isLoaded, isSignedIn, userId, user, segments]);

  if (!isLoaded || checkingProfile) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  if (!publishableKey) {
    throw new Error("Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env");
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <InitialLayout />
      </ClerkLoaded>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
