import { useState } from "react";
import { useSignUp, useClerk, useAuth } from "@clerk/expo";

export function useSignUpForm() {
  const { signUp } = useSignUp();
  const { isLoaded } = useAuth();
  const { setActive } = useClerk();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    if (!isLoaded || !signUp) return;
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: signUpError } = await signUp.create({
        emailAddress: email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message || "Sign-up failed.");
        return;
      }

      const { error: verificationError } = await signUp.verifications.sendEmailCode();

      if (verificationError) {
        setError(verificationError.message || "Failed to send verification code.");
        return;
      }

      setPendingVerification(true);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Sign-up failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!isLoaded || !signUp || !setActive) return;
    if (!code) {
      setError("Please enter the verification code.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: verifyError } = await signUp.verifications.verifyEmailCode({
        code,
      });

      if (verifyError) {
        setError(verifyError.message || "Invalid verification code.");
        return;
      }

      if (signUp.status === "complete") {
        const { error: finalizeError } = await signUp.finalize();
        if (finalizeError) {
          setError(finalizeError.message || "Failed to finalize session.");
        }
      } else {
        setError("Verification incomplete. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Invalid verification code.");
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
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
  };
}
