import { useEffect, useState } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { ClerkProvider, ClerkLoaded, useAuth } from "@clerk/expo";
import { tokenCache } from "@/lib/clerk";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ActivityIndicator, View, StyleSheet } from "react-native";

function InitialLayout() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const segments = useSegments() as any;
  const router = useRouter();
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
      // User is signed in, check if their profile exists in Firestore
      const checkUserProfile = async () => {
        try {
          const docRef = doc(db, "users", userId!);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            // User profile exists, redirect to main app dashboard if they are on onboarding or auth screens
            if (inAuthGroup || isOnboarding) {
              router.replace("/(app)" as any);
            }
          } else {
            // Profile doesn't exist, redirect to onboarding unless already there
            if (!isOnboarding) {
              router.replace("/(app)/onboarding" as any);
            }
          }
        } catch (error) {
          console.error("Error checking user profile in Firestore:", error);
          // Fallback: in case of Firestore error/offline, allow entry to main dashboard
          if (inAuthGroup) {
            router.replace("/(app)" as any);
          }
        } finally {
          setCheckingProfile(false);
        }
      };

      checkUserProfile();
    }
  }, [isLoaded, isSignedIn, userId, segments]);

  if (!isLoaded || checkingProfile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
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
    backgroundColor: "#0A0A0A",
  },
});
