import { useState, useCallback } from "react";
import { useSignIn, useOAuth, useClerk, useAuth } from "@clerk/expo";
import * as Linking from "expo-linking";

export function useSignInForm() {
  const { signIn } = useSignIn();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const { isLoaded } = useAuth();
  const { setActive } = useClerk();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    if (!isLoaded || !signIn) return;
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: signInError } = await signIn.create({
        identifier: email,
        password,
      });

      if (signInError) {
        setError(signInError.message || "Failed to sign in. Please check your credentials.");
        return;
      }

      if (signIn.status === "complete") {
        const { error: finalizeError } = await signIn.finalize();
        if (finalizeError) {
          setError(finalizeError.message || "Failed to finalize session.");
        }
      } else {
        setError("Sign-in incomplete. Please verify your credentials.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = useCallback(async () => {
    if (!isLoaded || !setActive) return;
    setLoading(true);
    setError(null);

    try {
      const { createdSessionId } = await startOAuthFlow({
        redirectUrl: Linking.createURL("/(app)", { scheme: "myfirstapp" }),
      });

      if (createdSessionId) {
        await setActive({ session: createdSessionId });
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Google Sign-In failed.");
    } finally {
      setLoading(false);
    }
  }, [isLoaded, startOAuthFlow, setActive]);

  return {
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
  };
}
