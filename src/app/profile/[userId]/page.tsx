"use client";

import { useEffect, useState } from "react";
import { getUserIdFromCookie } from "@/lib/context";
import { User as UserIcon, Users, Plus, Trash2, Save, ShieldAlert } from "lucide-react";
import Loading from "@/components/Loading";
import ErrorComponent from "@/components/Error";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "@/lib/types";
import { useParams } from "next/navigation";

type TrustedFriend = { id: string; name: string; phone: string };
type UserDetails = {
  id: string;
  permanentAddress?: { lat: number; lng: number } | null;
  codeWord: string;
  message: string;
};

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.userId;

  const [user, setUser] = useState<User | null>(null);
  const [details, setDetails] = useState<UserDetails | null>(null);
  const [friends, setFriends] = useState<TrustedFriend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateState, setUpdateState] = useState<{ text: string; ok: boolean } | null>(null);
  const [friendState, setFriendState] = useState<{ text: string; ok: boolean } | null>(null);
  const [settings, setSettings] = useState({ codeWord: "", message: "", latitude: "", longitude: "" });
  const [friendForm, setFriendForm] = useState({ name: "", phone: "" });
  const [savingSettings, setSavingSettings] = useState(false);
  const [addingFriend, setAddingFriend] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const currentUserId = await getUserIdFromCookie();
        if (!currentUserId) { setError("Unauthorized access. Please login."); setLoading(false); return; }
        if (currentUserId !== userId) { setError("You are not allowed to view this profile."); setLoading(false); return; }
        fetchData();
      } catch (err: any) {
        setError(err.message || "Authentication failed");
        setLoading(false);
      }
    }
    checkAuth();
  }, [userId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [userRes, detailsRes, friendsRes] = await Promise.all([
        fetch(`/api/user/${userId}`),
        fetch(`/api/user/${userId}/details`),
        fetch(`/api/user/${userId}/trusted-friends`),
      ]);
      const [userData, detailsData, friendsData] = await Promise.all([
        userRes.json(), detailsRes.json(), friendsRes.json(),
      ]);
      if (!userRes.ok) throw new Error(userData.message || "Failed to fetch user");
      if (!detailsRes.ok) throw new Error(detailsData.message || "Failed to fetch details");
      if (!friendsRes.ok) throw new Error(friendsData.message || "Failed to fetch friends");
      setUser(userData.user);
      setDetails(detailsData.details);
      setFriends(friendsData.friends || []);
      setSettings({
        codeWord: detailsData.details.codeWord || "",
        message: detailsData.details.message || "",
        latitude: detailsData.details.permanentAddress?.lat?.toString() || "",
        longitude: detailsData.details.permanentAddress?.lng?.toString() || "",
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const updateDetails = async () => {
    if (!details) return;
    setSavingSettings(true);
    setUpdateState(null);
    try {
      const res = await fetch(`/api/user/${userId}/details`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codeWord: settings.codeWord,
          message: settings.message,
          permanentAddress:
            settings.latitude && settings.longitude
              ? { lat: Number(settings.latitude), lng: Number(settings.longitude) }
              : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Unable to save details.");
      setDetails(data.details);
      setUpdateState({ text: "Settings saved successfully.", ok: true });
    } catch (err: any) {
      setUpdateState({ text: err.message || "Unable to save details.", ok: false });
    } finally {
      setSavingSettings(false);
    }
  };

  const addFriend = async () => {
    setAddingFriend(true);
    setFriendState(null);
    try {
      const res = await fetch(`/api/user/${userId}/trusted-friends`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(friendForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Unable to add contact.");
      setFriends((prev) => [...prev, data.friend]);
      setFriendState({ text: "Trusted contact added.", ok: true });
      setFriendForm({ name: "", phone: "" });
    } catch (err: any) {
      setFriendState({ text: err.message || "Unable to add contact.", ok: false });
    } finally {
      setAddingFriend(false);
    }
  };

  const removeFriend = async (friendId: string) => {
    setRemovingId(friendId);
    try {
      const res = await fetch(`/api/user/${userId}/trusted-friends/${friendId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Unable to remove contact.");
      setFriends((prev) => prev.filter((f) => f.id !== friendId));
      setFriendState({ text: "Contact removed.", ok: true });
    } catch (err: any) {
      setFriendState({ text: err.message || "Unable to remove contact.", ok: false });
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorComponent error={error} />;
  if (!user || !details) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0623] via-slate-950 to-black px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6">

        {/* Profile header */}
        <section className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/80 p-4 sm:p-6 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-pink-500/15 text-pink-300 ring-1 ring-pink-500/20">
                <UserIcon className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-pink-400 font-medium">
                  User profile
                </p>
                <h1 className="mt-0.5 sm:mt-1 text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
                  {user.username}
                </h1>
                <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
                  Secure account and emergency settings.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:min-w-[300px]">
              <StatBlock
                label="Joined"
                value={new Date(user.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  year: "numeric",
                })}
              />
              <StatBlock label="Contacts" value={String(friends.length)} />
              <StatBlock label="Code word" value={details.codeWord || "—"} />
            </div>
          </div>
        </section>

        {/* Main grid */}
        <div className="grid gap-4 sm:gap-5 xl:grid-cols-[1fr_340px]">

          {/* Left column */}
          <div className="space-y-4 sm:space-y-5">

            {/* Account info */}
            <Card className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/70 shadow-xl shadow-black/20">
              <CardContent className="p-4 sm:p-6">
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-pink-400 font-medium">
                  Account
                </p>
                <h2 className="mt-1 text-base sm:text-xl font-semibold text-white">Profile details</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <InfoField label="Email" value={user.email || "Not set"} />
                  <InfoField label="Phone" value={user.phoneNumber} />
                </div>
              </CardContent>
            </Card>

            {/* Emergency settings */}
            <Card className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/70 shadow-xl shadow-black/20">
              <CardContent className="p-4 sm:p-6">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-pink-400 font-medium">
                      Emergency settings
                    </p>
                    <h2 className="mt-1 text-base sm:text-xl font-semibold text-white">
                      Alert customization
                    </h2>
                  </div>
                  <span className="shrink-0 rounded-full bg-white/8 px-2.5 py-1 text-[10px] sm:text-xs text-slate-400 ring-1 ring-white/10">
                    Update anytime
                  </span>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <FormField label="Secret code word">
                    <Input
                      value={settings.codeWord}
                      onChange={(e) => setSettings({ ...settings, codeWord: e.target.value })}
                      placeholder="e.g. helpme"
                      className="rounded-xl border-slate-700/80 bg-slate-950/80 text-sm text-white placeholder-slate-600 focus:border-pink-500/60 focus:ring-pink-500/15"
                    />
                  </FormField>

                  <FormField label="Emergency message">
                    <Input
                      value={settings.message}
                      onChange={(e) => setSettings({ ...settings, message: e.target.value })}
                      placeholder="I am in danger, please help!"
                      className="rounded-xl border-slate-700/80 bg-slate-950/80 text-sm text-white placeholder-slate-600 focus:border-pink-500/60 focus:ring-pink-500/15"
                    />
                  </FormField>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <FormField label="Home latitude">
                      <Input
                        value={settings.latitude}
                        onChange={(e) => setSettings({ ...settings, latitude: e.target.value })}
                        placeholder="12.9716"
                        type="number"
                        className="rounded-xl border-slate-700/80 bg-slate-950/80 text-sm text-white placeholder-slate-600 focus:border-pink-500/60 focus:ring-pink-500/15"
                      />
                    </FormField>
                    <FormField label="Home longitude">
                      <Input
                        value={settings.longitude}
                        onChange={(e) => setSettings({ ...settings, longitude: e.target.value })}
                        placeholder="77.5946"
                        type="number"
                        className="rounded-xl border-slate-700/80 bg-slate-950/80 text-sm text-white placeholder-slate-600 focus:border-pink-500/60 focus:ring-pink-500/15"
                      />
                    </FormField>
                  </div>

                  {updateState && (
                    <FeedbackBanner ok={updateState.ok} text={updateState.text} />
                  )}

                  <button
                    onClick={updateDetails}
                    disabled={savingSettings}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-pink-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-pink-600/20 transition hover:bg-pink-400 active:scale-[0.98] disabled:opacity-60"
                  >
                    <Save size={15} />
                    {savingSettings ? "Saving…" : "Save"}
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Add contact */}
            <Card className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/70 shadow-xl shadow-black/20">
              <CardContent className="p-4 sm:p-6">
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-pink-400 font-medium">
                  Trusted contacts
                </p>
                <h2 className="mt-1 text-base sm:text-xl font-semibold text-white">Add a contact</h2>

                <div className="mt-4 space-y-3">
                  <FormField label="Name">
                    <Input
                      value={friendForm.name}
                      onChange={(e) => setFriendForm({ ...friendForm, name: e.target.value })}
                      placeholder="Contact name"
                      className="rounded-xl border-slate-700/80 bg-slate-950/80 text-sm text-white placeholder-slate-600 focus:border-pink-500/60 focus:ring-pink-500/15"
                    />
                  </FormField>
                  <FormField label="Phone number">
                    <Input
                      value={friendForm.phone}
                      onChange={(e) => setFriendForm({ ...friendForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      type="tel"
                      className="rounded-xl border-slate-700/80 bg-slate-950/80 text-sm text-white placeholder-slate-600 focus:border-pink-500/60 focus:ring-pink-500/15"
                    />
                  </FormField>

                  {friendState && (
                    <FeedbackBanner ok={friendState.ok} text={friendState.text} />
                  )}

                  <button
                    onClick={addFriend}
                    disabled={addingFriend}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-pink-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-pink-600/20 transition hover:bg-pink-400 active:scale-[0.98] disabled:opacity-60"
                  >
                    <Plus size={15} />
                    {addingFriend ? "Adding…" : "Add contact"}
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right sidebar — contacts list */}
          <aside className="xl:sticky xl:top-20 h-fit">
            <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/70 p-4 sm:p-5 shadow-xl shadow-black/20">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-pink-500/10 ring-1 ring-pink-500/20">
                  <Users size={15} className="text-pink-400" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-pink-400 font-medium">
                    Contacts list
                  </p>
                  <h2 className="text-sm sm:text-base font-semibold text-white leading-tight">
                    Trusted people
                  </h2>
                </div>
                <span className="ml-auto rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-slate-400 ring-1 ring-white/10">
                  {friends.length}
                </span>
              </div>

              {friends.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 bg-slate-950/50 p-5 text-center">
                  <ShieldAlert size={20} className="mx-auto mb-2 text-slate-700" />
                  <p className="text-xs text-slate-500 leading-relaxed">
                    No trusted contacts yet. Add one to share your location during an alert.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {friends.map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-slate-950/60 px-3 sm:px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">{friend.name}</p>
                        <p className="mt-0.5 truncate text-xs text-slate-500">{friend.phone}</p>
                      </div>
                      <button
                        onClick={() => removeFriend(friend.id)}
                        disabled={removingId === friend.id}
                        title="Remove contact"
                        className="shrink-0 rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-400 transition hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400 active:scale-95 disabled:opacity-50"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ── Small reusable components ── */

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl sm:rounded-2xl border border-white/8 bg-slate-950/80 p-3 sm:p-4 text-center">
      <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-slate-500 font-medium">
        {label}
      </p>
      <p className="mt-1.5 sm:mt-2 text-sm sm:text-base font-bold text-white truncate">
        {value}
      </p>
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/8 bg-slate-950/60 px-3 sm:px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-medium">{label}</p>
      <p className="mt-1 text-xs sm:text-sm text-slate-300">{value}</p>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] sm:text-xs font-medium uppercase tracking-wider text-slate-400">
        {label}
      </label>
      {children}
    </div>
  );
}

function FeedbackBanner({ ok, text }: { ok: boolean; text: string }) {
  return (
    <div
      className={`rounded-xl px-4 py-2.5 text-xs sm:text-sm ${
        ok
          ? "bg-green-500/10 text-green-300 ring-1 ring-green-500/20"
          : "bg-rose-500/10 text-rose-300 ring-1 ring-rose-500/20"
      }`}
    >
      {text}
    </div>
  );
}