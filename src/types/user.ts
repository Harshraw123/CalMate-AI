export interface UserProfile {
  clerkId: string;
  name: string;
  email: string;
  phoneNumber?: string;
  profileImage: string;
  createdAt: string;
  onboardingComplete: boolean;
  targetCalories?: number;
  age?: number;
  weight?: number;
  height?: number;
}

export interface OnboardingData {
  name: string;
  targetCalories: number;
  age: number;
  weight: number;
  height: number;
}
