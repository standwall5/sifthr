"use client";
import { useEffect, useState } from "react";
import {
  fetchProfile,
  Profile,
} from "@/app/(logged-in)/profile/services/profileService";
import { getCurrentAppUser } from "@/app/lib/userHelpers";

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      console.log("🔍 Starting profile load...");
      setLoading(true);

      const appUser = await getCurrentAppUser();
      console.log("👤 App user:", appUser);

      if (!appUser) {
        console.log("❌ No app user found");
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        console.log("🔄 Fetching profile for user ID:", appUser.id);
        const data = await fetchProfile(appUser.id);
        console.log("✅ Profile data:", data);
        setProfile(data ?? null);
      } catch (error) {
        console.error("❌ Error loading profile:", error);
        setProfile(null);
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  return { profile, loading };
}
