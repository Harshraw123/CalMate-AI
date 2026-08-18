import { useEffect, useState } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { ClerkProvider, ClerkLoaded, useAuth, useUser } from "@clerk/expo";
import { tokenCache } from "@/lib/clerk";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ActivityIndicator, View, StyleSheet } from "react-native";

function InitialLayout() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { user } = useUser();
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
      // User is signed in, check and initialize profile in Firestore
      const checkAndInitializeProfile = async () => {
        if (!user) return;
        
        try {
          const docRef = doc(db, "users", userId!);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.onboardingComplete) {
              // User profile complete, redirect to main app dashboard
              if (inAuthGroup || isOnboarding) {
                router.replace("/(app)" as any);
              }
            } else {
              // Document exists but onboarding not complete, go to onboarding
              if (!isOnboarding) {
                router.replace("/(app)/onboarding" as any);
              }
            }
          } else {
            // Initialize user document with basic Clerk information immediately
            const userDisplayName =
              user.fullName ||
              (user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "") ||
              user.primaryEmailAddress?.emailAddress?.split("@")[0] ||
              "User";

            await setDoc(docRef, {
              clerkId: user.id,
              name: userDisplayName,
              email: user.primaryEmailAddress?.emailAddress || "",
              profileImage: user.imageUrl || "",
              createdAt: new Date().toISOString(),
              onboardingComplete: false,
            });

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
