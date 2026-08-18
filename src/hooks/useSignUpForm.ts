import { useState } from "react";
import { useSignUp, useClerk, useAuth } from "@clerk/expo";

export type AuthMethod = "email" | "phone";

export function useSignUpForm() {
  const { signUp } = useSignUp();
  const { isLoaded } = useAuth();
  const { setActive } = useClerk();

  const [authMethod, setAuthMethod] = useState<AuthMethod>("email");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changeAuthMethod = (method: AuthMethod) => {
    setAuthMethod(method);
    setEmail("");
    setPhoneNumber("");
    setPassword("");
    setConfirmPassword("");
    setCode("");
    setPendingVerification(false);
    setError(null);
  };

  const handleSignUp = async () => {
    if (!isLoaded || !signUp) return;
    
    if (authMethod === "email" && !email) {
      setError("Please enter your email address.");
      return;
    }
    if (authMethod === "phone" && !phoneNumber) {
      setError("Please enter your phone number.");
      return;
    }
    if (!password || !confirmPassword) {
      setError("Please fill in all password fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (authMethod === "email") {
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
      } else {
        const { error: signUpError } = await signUp.create({
          phoneNumber,
          password,
        });

        if (signUpError) {
          setError(signUpError.message || "Sign-up failed.");
          return;
        }

        const { error: verificationError } = await signUp.verifications.sendPhoneCode();

        if (verificationError) {
          setError(verificationError.message || "Failed to send SMS verification code.");
          return;
        }
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
      if (authMethod === "email") {
        const { error: verifyError } = await signUp.verifications.verifyEmailCode({
          code,
        });

        if (verifyError) {
          setError(verifyError.message || "Invalid verification code.");
          return;
        }
      } else {
        const { error: verifyError } = await signUp.verifications.verifyPhoneCode({
          code,
        });

        if (verifyError) {
          setError(verifyError.message || "Invalid SMS verification code.");
          return;
        }
      }

      // Finalize sign-up session directly once code is verified
      const { error: finalizeError } = await signUp.finalize();
      if (finalizeError) {
        setError(finalizeError.message || "Failed to finalize session.");
        return;
      }
    } catch (err: any) {
      console.error("Verification error:", err);
      setError(err?.message || "Invalid verification code.");
    } finally {
      setLoading(false);
    }
  };

  return {
    authMethod,
    changeAuthMethod,
    email,
    setEmail,
    phoneNumber,
    setPhoneNumber,
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
