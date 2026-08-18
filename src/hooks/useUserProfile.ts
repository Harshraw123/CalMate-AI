import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/expo";
import { UserProfile } from "@/types/user";
import { getUserProfile } from "@/services/userService";

export function useUserProfile() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getUserProfile(user.id);
      setProfile(data);
    } catch (err: any) {
      console.error("useUserProfile hook error:", err);
      setError(err?.message || "Failed to load user profile.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isUserLoaded) {
      fetchProfile();
    }
  }, [isUserLoaded, fetchProfile]);

  return {
    user,
    profile,
    loading,
    error,
    refetchProfile: fetchProfile,
  };
}
