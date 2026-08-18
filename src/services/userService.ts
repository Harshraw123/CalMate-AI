import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserProfile, OnboardingData } from "@/types/user";

/**
 * Fetch a user profile document from Firestore by user ID.
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile from Firestore:", error);
    throw error;
  }
}

/**
 * Initialize a new user profile document in Firestore using basic Clerk details.
 */
export async function initializeUserProfile(user: any): Promise<UserProfile> {
  const userDisplayName =
    user.fullName ||
    (user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "") ||
    user.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    "User";

  const newProfile: UserProfile = {
    clerkId: user.id,
    name: userDisplayName,
    email: user.primaryEmailAddress?.emailAddress || "",
    profileImage: user.imageUrl || "",
    createdAt: new Date().toISOString(),
    onboardingComplete: false,
  };

  try {
    const docRef = doc(db, "users", user.id);
    await setDoc(docRef, newProfile);
    return newProfile;
  } catch (error) {
    console.error("Error initializing user profile in Firestore:", error);
    throw error;
  }
}

/**
 * Complete onboarding and update fitness metrics for a user profile in Firestore.
 */
export async function completeOnboardingProfile(
  userId: string,
  data: OnboardingData
): Promise<void> {
  try {
    const docRef = doc(db, "users", userId);
    await setDoc(
      docRef,
      {
        name: data.name,
        targetCalories: data.targetCalories,
        age: data.age,
        weight: data.weight,
        height: data.height,
        onboardingComplete: true,
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error completing onboarding profile in Firestore:", error);
    throw error;
  }
}
