"use client";

import Error from "@/components/Error";
import Loading from "@/components/Loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getUserIdFromCookie } from "@/lib/context";
import { Sos, User } from "@/lib/types";
import { ArrowRight, MapPin, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function SosHistoryPage() {
  const [sosHistory, setSosHistory] = useState<Sos[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<Sos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function getData() {
      try {
        const userId = await getUserIdFromCookie();
        if (userId) {
          fetchSosHistory(userId);
        } else {
          setUser(null);
          setLoading(false);
        }
      } catch (err: any) {
        console.error(err.message);
        setLoading(false);
      }
    }

    getData();
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    let next = [...sosHistory];

    if (dateFilter) {
      next = next.filter((sos) => new Date(sos.timestamp).toISOString().split("T")[0] === dateFilter);
    }

    if (statusFilter !== "all") {
      next = next.filter((sos) => sos.status === statusFilter);
    }

    if (searchQuery.trim()) {
      next = next.filter((sos) => sos.id.includes(searchQuery.trim()));
    }

    setFilteredHistory(next);
  }, [dateFilter, searchQuery, statusFilter, sosHistory]);

  const fetchSosHistory = async (userId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/sos-alert/user/${userId}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to fetch SOS history");
        return;
      }

      setSosHistory(data.sosHistory);
      setFilteredHistory(data.sosHistory);
      setUser({ id: userId, username: "", phoneNumber: "", email: "" } as User);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const statistics = useMemo(
    () => ({
      total: sosHistory.length,
      active: sosHistory.filter((item) => item.status === "active").length,
      resolved: sosHistory.filter((item) => item.status !== "active").length,
    }),
    [sosHistory]
  );

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } catch {
      console.error("Failed to copy");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950/95 px-4 py-8 sm:px-6 lg:px-10">
      {fullScreenImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="relative mx-auto h-[80vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-slate-900 shadow-2xl">
            <Image src={fullScreenImage} alt="Fullscreen media" fill className="object-contain" sizes="100vw" priority />
          </div>
          <button className="absolute right-5 top-5 rounded-full bg-white/10 px-3 py-2 text-white transition hover:bg-white/20" onClick={() => setFullScreenImage(null)}>
            Close
          </button>
        </div>
      )}

      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-3xl border border-white/10 bg-slate-900/90 p-6 shadow-xl shadow-pink-500/10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-pink-300">SOS History</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Emergency alerts & media</h1>
              <p className="mt-2 text-sm text-slate-400">Review your alerts, copy IDs, and open details instantly.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <StatCard label="Total" value={statistics.total} />
              <StatCard label="Active" value={statistics.active} />
              <StatCard label="Resolved" value={statistics.resolved} />
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-900/20">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-300">Search alerts</label>
                <div className="flex gap-2">
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by alert ID"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                  />
                  <Button variant="outline" className="px-4 py-3">
                    <Search size={16} />
                  </Button>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Status filter</label>
                <select
                title="date"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Resolved</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Filter by date</label>
                <input
                title="date"
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-white px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                />
              </div>
            </div>

            {filteredHistory.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/70 p-8 text-center text-slate-400">
                No SOS alerts match the selected filters.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredHistory.map((sos) => (
                  <Card key={sos.id} className="rounded-3xl border border-white/10 bg-slate-950/80 shadow-lg shadow-slate-900/20">
                    <CardContent className="space-y-4 p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm uppercase tracking-[0.3em] text-pink-300">Alert ID</p>
                          <p className="mt-2 font-mono text-base text-white break-all">{sos.id}</p>
                          <p className="mt-1 text-sm text-slate-400">{new Date(sos.timestamp).toLocaleString()}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant={sos.status === "active" ? "destructive" : "secondary"}>{sos.status.toUpperCase()}</Badge>
                          <Link href={`/sos/${sos.id}`} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-pink-600/90">
                            Details <ArrowRight size={16} />
                          </Link>
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-4">
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Location</p>
                          <p className="mt-2 text-sm text-slate-200">{sos.location?.lat?.toFixed(5) ?? "—"}, {sos.location?.lng?.toFixed(5) ?? "—"}</p>
                        </div>
                        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-4">
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Media items</p>
                          <p className="mt-2 text-sm text-slate-200">{sos.media.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <aside className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-900/20">
            <p className="text-sm uppercase tracking-[0.3em] text-pink-300">Quick tips</p>
            <div className="mt-5 space-y-4 text-sm text-slate-300">
              <div className="rounded-3xl bg-slate-950/80 p-4">
                <p className="font-semibold text-white">Saved search</p>
                <p className="mt-2 text-slate-400">Use partial alert IDs or filter status to find incidents faster.</p>
              </div>
              <div className="rounded-3xl bg-slate-950/80 p-4">
                <p className="font-semibold text-white">Resolve alerts</p>
                <p className="mt-2 text-slate-400">Open an alert to mark it resolved when the situation is safe.</p>
              </div>
              <div className="rounded-3xl bg-slate-950/80 p-4">
                <p className="font-semibold text-white">Location detail</p>
                <p className="mt-2 text-slate-400">Every alert includes the coordinates and quick map access.</p>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-4 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}
