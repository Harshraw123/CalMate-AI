# CalMate-AI 🥗🤖

**CalMate-AI** is a professional, AI-powered Calorie Tracker mobile application built with **React Native**, **Expo Router**, **Clerk Authentication**, and **Firebase Cloud Firestore**.

---

## ✨ Features Implemented

- 🔐 **Clerk Authentication:**
  - Email + Password Sign Up & Sign In with 6-digit email verification code.
  - Google OAuth SSO integration via `expo-web-browser`.
  - Secure token caching using `expo-secure-store`.
  - Sign Out & automatic route protection.
- ⚡ **Automated Firestore Profile Sync:**
  - Automatically initializes a user profile document in Firestore upon initial sign-up or Google OAuth sign-in.
  - Preserves user metadata (`clerkId`, `email`, `profileImage`, `createdAt`).
- 🎯 **Interactive Onboarding:**
  - Dynamic profile setup collecting target daily calories, age, weight, and height.
  - Merges metrics seamlessly into the existing Firestore user record (`onboardingComplete: true`).
- 🛡️ **Automated Route Guards:**
  - Unauthenticated users are automatically redirected to `/(auth)/sign-up`.
  - Users with incomplete onboarding are routed to `/(app)/onboarding`.
  - Authenticated users with completed profiles land directly on the Dashboard (`/(app)`).
- 🧩 **Modular Architecture & Custom Hooks:**
  - Clean separation of UI, business logic hooks, services layer, and TypeScript types.

---

## 📁 Project Architecture

```
src/
├── app/                      # Expo Router File-Based Navigation
│   ├── (app)/
│   │   ├── _layout.tsx       # Protected App Stack Layout Guard
│   │   ├── index.tsx         # Dashboard Screen (uses useUserProfile hook)
│   │   └── onboarding.tsx    # Profile Setup Screen (uses userService)
│   ├── (auth)/
│   │   ├── sign-in.tsx       # Sign In Screen (uses useSignInForm hook)
│   │   └── sign-up.tsx       # Sign Up Screen (uses useSignUpForm hook)
│   └── _layout.tsx           # Root Clerk & Firestore Route Guard
├── components/               # Reusable Modular UI Components
│   ├── auth/
│   │   └── AuthHeader.tsx    # Reusable Auth Screen Header
│   └── ui/
│       ├── CustomInput.tsx   # Input component with error and eye-toggle
│       ├── GoogleButton.tsx  # Styled Google SSO Button
│       └── PrimaryButton.tsx # Action button with loading states
├── hooks/                    # Custom React Hooks
│   ├── useSignInForm.ts      # Sign-In & Google OAuth form state & actions
│   ├── useSignUpForm.ts      # Sign-Up & Email verification form state & actions
│   └── useUserProfile.ts     # Firestore profile state management & refetching
├── services/                 # Business Logic & Firestore API Layer
│   └── userService.ts        # Firestore CRUD operations
├── types/                    # TypeScript Contracts
│   └── user.ts               # UserProfile and OnboardingData interfaces
└── lib/                      # Third-Party SDK Initializers
    ├── clerk.ts              # Clerk Keychain Token Cache Manager
    └── firebase.ts           # Modular Firebase App & Firestore Config
```

---

## 🛠️ Environment Configuration

Create a `.env` file in the root directory (refer to `.env.example`):

```env
# Clerk Authentication Configuration
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here

# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

---

## 🚀 Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Metro Bundler:**
   ```bash
   npx expo start
   ```

3. **Clear Cache (If updating `.env` keys):**
   ```bash
   npx expo start -c
   ```

4. **Run TypeScript Type Check:**
   ```bash
   npx tsc --noEmit
   ```
