"use client";

import { useEffect, useState } from "react";
import { getUserIdFromCookie } from "@/lib/context";
import { User as UserIcon, Phone, Mail, Calendar, Users, ShieldCheck, Plus, Trash2 } from "lucide-react";
import Loading from "@/components/Loading";
import ErrorComponent from "@/components/Error";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "@/lib/types";
import { useParams } from "next/navigation";

type TrustedFriend = {
  id: string;
  name: string;
  phone: string;
};

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
  const [updateState, setUpdateState] = useState<string | null>(null);
  const [friendState, setFriendState] = useState<string | null>(null);

  const [settings, setSettings] = useState({ codeWord: "", message: "", latitude: "", longitude: "" });
  const [friendForm, setFriendForm] = useState({ name: "", phone: "" });

  useEffect(() => {
    async function checkAuth() {
      try {
        const currentUserId = await getUserIdFromCookie();
        if (!currentUserId) {
          setError("Unauthorized access. Please login.");
          setLoading(false);
          return;
        }

        if (currentUserId !== userId) {
          setError("You are not allowed to view this profile.");
          setLoading(false);
          return;
        }

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
        userRes.json(),
        detailsRes.json(),
        friendsRes.json(),
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
    setUpdateState(null);
    try {
      const res = await fetch(`/api/user/${userId}/details`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codeWord: settings.codeWord,
          message: settings.message,
          permanentAddress: settings.latitude && settings.longitude ? { lat: Number(settings.latitude), lng: Number(settings.longitude) } : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Unable to save details.");
      setDetails(data.details);
      setUpdateState("Saved successfully.");
    } catch (err: any) {
      setUpdateState(err.message || "Unable to save details.");
    }
  };

  const addFriend = async () => {
    setFriendState(null);
    try {
      const res = await fetch(`/api/user/${userId}/trusted-friends`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(friendForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Unable to add friend.");
      setFriends((prev) => [...prev, data.friend]);
      setFriendState("Trusted contact added.");
      setFriendForm({ name: "", phone: "" });
    } catch (err: any) {
      setFriendState(err.message || "Unable to add friend.");
    }
  };

  const removeFriend = async (friendId: string) => {
    try {
      const res = await fetch(`/api/user/${userId}/trusted-friends/${friendId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Unable to remove contact.");
      setFriends((prev) => prev.filter((friend) => friend.id !== friendId));
      setFriendState("Trusted contact removed.");
    } catch (err: any) {
      setFriendState(err.message || "Unable to remove contact.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-950 via-[#120519] to-black">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-white border-r-transparent"></div>
          <p className="mt-4 text-lg text-slate-300">Loading your profile…</p>
        </div>
      </div>
    );
  }

  if (error) return <ErrorComponent error={error} />;
  if (!user || !details) return null;

  return (
    <div className="bg-gradient-to-br from-[#12061e] via-[#1d0b33] to-black px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-pink-500/20 text-pink-200 shadow-lg">
                <UserIcon className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-pink-300">User profile</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">{user.username}</h1>
                <p className="text-sm text-slate-400">Secure account and emergency settings.</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <StatBlock label="Joined" value={new Date(user.createdAt).toLocaleDateString()} />
              <StatBlock label="Contacts" value={friends.length.toString()} />
              <StatBlock label="Code word" value={details.codeWord || "help"} />
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_0.7fr]">
          <div className="space-y-6">
            <Card className="rounded-3xl border-white/10 bg-slate-950/80 p-6 shadow-xl shadow-black/20">
              <CardContent className="space-y-5 p-0">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-pink-300">Account</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Profile details</h2>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Email</p>
                    <p className="mt-2 text-sm text-slate-200">{user.email || "Not set"}</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Phone</p>
                    <p className="mt-2 text-sm text-slate-200">{user.phoneNumber}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-white/10 bg-slate-950/80 p-6 shadow-xl shadow-black/20">
              <CardContent className="space-y-4 p-0">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-pink-300">Emergency settings</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Alert customization</h2>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">Update anytime</span>
                </div>
                <div className="grid gap-4">
                  <div>
                    <label className="mb-2 block text-sm text-slate-300">Secret code word</label>
                    <Input
                      value={settings.codeWord}
                       className=" text-stone-500"
                      onChange={(e) => setSettings({ ...settings, codeWord: e.target.value })}
                      placeholder="Example: helpme"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-slate-300">Emergency message</label>
                    <Input
                      value={settings.message}
                      className=" text-stone-500"
                      onChange={(e) => setSettings({ ...settings, message: e.target.value })}
                      placeholder="I am in danger, please help!"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm text-slate-300">Address latitude</label>
                      <Input
                        value={settings.latitude}
                        onChange={(e) => setSettings({ ...settings, latitude: e.target.value })}
                        placeholder="12.9716"
                        type="number"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm text-slate-300">Address longitude</label>
                      <Input
                        value={settings.longitude}
                        onChange={(e) => setSettings({ ...settings, longitude: e.target.value })}
                        placeholder="77.5946"
                        type="number"
                      />
                    </div>
                  </div>
                  {updateState && <p className="text-sm text-slate-300">{updateState}</p>}
                  <Button onClick={updateDetails}>Save emergency settings</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-white/10 bg-slate-950/80 p-6 shadow-xl shadow-black/20">
              <CardContent className="space-y-4 p-0">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-pink-300">Trusted contacts</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Add a new contact</h2>
                  </div>
                </div>
                <div className="grid gap-4">
                  <div>
                    <label className="mb-2 block text-sm text-slate-300">Name</label>
                    <Input
                      value={friendForm.name}
                      onChange={(e) => setFriendForm({ ...friendForm, name: e.target.value })}
                      placeholder="Contact name"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-slate-300">Phone number</label>
                    <Input
                      value={friendForm.phone}
                      onChange={(e) => setFriendForm({ ...friendForm, phone: e.target.value })}
                      placeholder="Contact phone"
                      type="tel"
                    />
                  </div>
                  {friendState && <p className="text-sm text-slate-300">{friendState}</p>}
                  <Button onClick={addFriend}>
                    <span className="flex items-center gap-2">
                      <Plus size={16} /> Add contact
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-xl shadow-black/20">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-pink-300" />
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-pink-300">Contacts list</p>
                  <h2 className="text-xl font-semibold text-white">Trusted people</h2>
                </div>
              </div>
              <div className="mt-5 space-y-4">
                {friends.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900/80 p-5 text-sm text-slate-400">
                    No trusted contacts yet. Add one to share your location quickly during an alert.
                  </div>
                ) : (
                  friends.map((friend) => (
                    <div key={friend.id} className="rounded-3xl border border-white/10 bg-slate-900/80 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-base font-semibold text-white">{friend.name}</p>
                          <p className="mt-1 text-sm text-slate-400">{friend.phone}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => removeFriend(friend.id)}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-4 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{label}</p>
      <p className="mt-3 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}
