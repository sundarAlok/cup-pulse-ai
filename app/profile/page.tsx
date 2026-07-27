"use client";

import { useEffect, useMemo, useState } from "react";
import {
  User,
  Mail,
  Calendar,
  Trophy,
  Coins,
  Flame,
  Target,
  ShieldCheck,
  Crown,
  Lock,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import UserAvatar from "@/components/UserAvatar";

type ProfileField = "username" | "displayName" | "photoURL" | "secretWords";

type ProfileState = {
  username: string;
  displayName: string;
  email: string;
  photoURL: string;
  secretWords: string;
  points: number;
  rank: number;
  streak: number;
  predictions: number;
  correctPredictions: number;
  wrongPredictions: number;
  accuracy: string;
  bestPrediction: string;
  joined: string;
  lastCheckin: string;
  premiumActive: boolean;
  walletAddress: string;
  premiumUnlocked: string;
  rewardsClaimed: string;
  emailVerified: boolean;
  authProvider: string;
};

const initialProfile: ProfileState = {
  username: "",
  displayName: "",
  email: "",
  photoURL: "",
  secretWords: "",
  points: 0,
  rank: 0,
  streak: 0,
  predictions: 0,
  correctPredictions: 0,
  wrongPredictions: 0,
  accuracy: "0%",
  bestPrediction: "—",
  joined: "Recently joined",
  lastCheckin: "Not yet",
  premiumActive: false,
  walletAddress: "Not connected",
  premiumUnlocked: "Not unlocked",
  rewardsClaimed: "0 INJ",
  emailVerified: false,
  authProvider: "email",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileState>(initialProfile);
  const [draftProfile, setDraftProfile] = useState<ProfileState>(initialProfile);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSecretWords, setShowSecretWords] = useState(false);

  const hasPremiumUnlock = useMemo(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const storedWallet = window.localStorage.getItem("premiumWalletAddress")?.trim();
    const storedTxHash = window.localStorage.getItem("premiumTxHash")?.trim();
    return Boolean(storedWallet && storedTxHash);
  }, []);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) {
          throw new Error("Unable to load profile");
        }

        const data = await res.json();
        if (data.authenticated && data.profile) {
          const nextProfile = {
            ...initialProfile,
            username: data.profile.username || initialProfile.username,
            displayName: data.profile.displayName || initialProfile.displayName,
            email: data.profile.email || initialProfile.email,
            photoURL: data.profile.photoURL || initialProfile.photoURL,
            secretWords: data.profile.secretWords || initialProfile.secretWords,
            points: data.profile.points ?? initialProfile.points,
            rank: data.profile.rank ?? initialProfile.rank,
            streak: data.profile.streak ?? initialProfile.streak,
            predictions: data.profile.predictions ?? initialProfile.predictions,
            correctPredictions: data.profile.correctPredictions ?? initialProfile.correctPredictions,
            wrongPredictions: data.profile.wrongPredictions ?? initialProfile.wrongPredictions,
            accuracy: data.profile.accuracy || initialProfile.accuracy,
            bestPrediction: data.profile.bestPrediction || initialProfile.bestPrediction,
            joined: data.profile.joined || initialProfile.joined,
            lastCheckin: data.profile.lastCheckin || initialProfile.lastCheckin,
            premiumActive: data.profile.premiumActive ?? initialProfile.premiumActive,
            walletAddress: data.profile.walletAddress || initialProfile.walletAddress,
            premiumUnlocked: data.profile.premiumUnlocked || initialProfile.premiumUnlocked,
            rewardsClaimed: data.profile.rewardsClaimed || initialProfile.rewardsClaimed,
            emailVerified: data.profile.emailVerified ?? initialProfile.emailVerified,
            authProvider: data.profile.authProvider || initialProfile.authProvider,
          };

          setProfile(nextProfile);
          setDraftProfile(nextProfile);
        }
      } catch {
        setError("Unable to load your profile right now.");
      }
    }

    void loadProfile();
  }, []);

  useEffect(() => {
    const refreshPoints = async () => {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) {
          return;
        }

        const data = await res.json();
        if (data.authenticated && data.profile) {
          setProfile((current) => ({
            ...current,
            points: data.profile.points ?? current.points,
            rank: data.profile.rank ?? current.rank,
            streak: data.profile.streak ?? current.streak,
            predictions: data.profile.predictions ?? current.predictions,
            joined: data.profile.joined || current.joined,
          }));
        }
      } catch {
        // Ignore refresh failures.
      }
    };

    window.addEventListener("points-updated", refreshPoints);
    return () => {
      window.removeEventListener("points-updated", refreshPoints);
    };
  }, []);

  function handleFieldChange(field: ProfileField, value: string) {
    setDraftProfile((current) => ({ ...current, [field]: value }));
    setError("");
    setSuccess("");
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: draftProfile.username.trim(),
          displayName: draftProfile.displayName.trim(),
          photoURL: draftProfile.photoURL.trim(),
          secretWords: draftProfile.secretWords.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Unable to save profile");
      }

      if (data.profile) {
        const nextProfile = {
          ...profile,
          username: data.profile.username || profile.username,
          displayName: data.profile.displayName || profile.displayName,
          email: data.profile.email || profile.email,
          photoURL: data.profile.photoURL || profile.photoURL,
          secretWords: data.profile.secretWords || profile.secretWords,
          points: data.profile.points ?? profile.points,
          rank: data.profile.rank ?? profile.rank,
          streak: data.profile.streak ?? profile.streak,
          predictions: data.profile.predictions ?? profile.predictions,
          joined: data.profile.joined || profile.joined,
          lastCheckin: data.profile.lastCheckin || profile.lastCheckin,
          premiumActive: data.profile.premiumActive ?? profile.premiumActive,
          walletAddress: data.profile.walletAddress || profile.walletAddress,
          premiumUnlocked: data.profile.premiumUnlocked || profile.premiumUnlocked,
          rewardsClaimed: data.profile.rewardsClaimed || profile.rewardsClaimed,
          emailVerified: data.profile.emailVerified ?? profile.emailVerified,
          authProvider: data.profile.authProvider || profile.authProvider,
        };

        setProfile(nextProfile);
        setDraftProfile(nextProfile);
      }

      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="px-4 py-28 lg:px-24">
      <div className="mx-auto max-w-7xl space-y-8">
        {error ? (
          <div className="rounded-[24px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        ) : null}

        <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-600 text-white">
              {profile.photoURL ? (
                <UserAvatar
                  src={profile.photoURL}
                  alt={profile.displayName || profile.username}
                  className="h-full w-full object-cover"
                  fallbackClassName="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-600 text-white"
                  fallbackText={profile.displayName || profile.username || "U"}
                />
              ) : (
                <User className="h-12 w-12" />
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-black text-slate-900">
                {profile.displayName || "Your profile"}
              </h1>

              <div className="mt-1 flex flex-wrap items-center gap-2 text-slate-500">
                <p>@{profile.username || "user"}</p>
                {profile.authProvider?.toLowerCase() === "google" ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-100 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md">
                  <CheckCircle2 className="h-4 w-4 fill-emerald-500 text-white" />
                  Verified
                </span>
                ) : null}
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="h-4 w-4 text-cyan-600" />
                  {profile.email || "No email yet"}
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="h-4 w-4 text-cyan-600" />
                  Joined {profile.joined}
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                  <Crown className={`h-4 w-4 ${profile.premiumActive || hasPremiumUnlock ? "text-yellow-500" : "text-slate-400"}`} />
                  {profile.premiumActive || hasPremiumUnlock ? "Premium Member" : "Standard Member"}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <Coins className="h-8 w-8 text-cyan-600" />
            <p className="mt-4 text-sm text-slate-500">Total Points</p>
            <h3 className="mt-1 text-3xl font-black text-slate-900">{profile.points}</h3>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <p className="mt-4 text-sm text-slate-500">Current Rank</p>
            <h3 className="mt-1 text-3xl font-black text-slate-900">#{profile.rank}</h3>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <Flame className="h-8 w-8 text-orange-500" />
            <p className="mt-4 text-sm text-slate-500">Current Streak</p>
            <h3 className="mt-1 text-3xl font-black text-slate-900">{profile.streak}</h3>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <Target className="h-8 w-8 text-violet-600" />
            <p className="mt-4 text-sm text-slate-500">Predictions Made</p>
            <h3 className="mt-1 text-3xl font-black text-slate-900">{profile.predictions}</h3>
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Username</span>
                  <input
                    value={draftProfile.username}
                    onChange={(e) => handleFieldChange("username", e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Display Name</span>
                  <input
                    value={draftProfile.displayName}
                    onChange={(e) => handleFieldChange("displayName", e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Photo URL</span>
                <input
                  value={draftProfile.photoURL}
                  onChange={(e) => handleFieldChange("photoURL", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                  placeholder="https://..."
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Secret Words</span>
                <div className="relative">
                  <input
                    type={showSecretWords ? "text" : "password"}
                    value={draftProfile.secretWords}
                    onChange={(e) => handleFieldChange("secretWords", e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 pr-12 outline-none"
                    placeholder="Enter your secret words"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecretWords((current) => !current)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-500"
                    aria-label={showSecretWords ? "Hide secret words" : "Show secret words"}
                  >
                    {showSecretWords ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
                <input
                  value={profile.email}
                  readOnly
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500"
                />
              </label>
            </div>

            <div className="space-y-5">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-2 text-cyan-600">
                  <Coins className="h-5 w-5" />
                  <p className="text-sm font-medium">Total Points</p>
                </div>
                <p className="mt-3 text-3xl font-black text-slate-900">{profile.points}</p>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-2 text-green-600">
                  <ShieldCheck className="h-5 w-5" />
                  <p className="text-sm font-medium">Account Security</p>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Email is stored in your account
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Lock className="h-4 w-4 text-slate-500" />
                    Password can be changed from account settings
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-sm text-slate-600">
              These fields are saved to your profile document: username, displayName, photoURL, and secretWords.
            </p>
            <button
              onClick={handleSave}
              disabled={saving || !draftProfile.username.trim() || !draftProfile.displayName.trim()}
              className="rounded-2xl bg-cyan-600 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}