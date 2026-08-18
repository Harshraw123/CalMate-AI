import { useState, useCallback } from "react";
import { useSignIn, useOAuth, useClerk, useAuth } from "@clerk/expo";
import * as Linking from "expo-linking";

export type AuthMethod = "email" | "phone";

export function useSignInForm() {
  const { signIn } = useSignIn();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const { isLoaded } = useAuth();
  const { setActive } = useClerk();

  const [authMethod, setAuthMethod] = useState<AuthMethod>("email");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    if (!isLoaded || !signIn) return;
    
    const identifier = authMethod === "email" ? email : phoneNumber;

    if (!identifier || !password) {
      setError(
        `Please fill in your ${
          authMethod === "email" ? "email address" : "phone number"
        } and password.`
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: signInError } = await signIn.create({
        identifier,
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
    authMethod,
    setAuthMethod,
    email,
    setEmail,
    phoneNumber,
    setPhoneNumber,
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
