"use client";

import Error from "@/components/Error";
import Loading from "@/components/Loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getUserIdFromCookie } from "@/lib/context";
import { Sos, User } from "@/lib/types";
import { ArrowRight, Calendar, Filter, Search, Shield, X } from "lucide-react";
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
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    let next = [...sosHistory];
    if (dateFilter) {
      next = next.filter(
        (sos) => new Date(sos.timestamp).toISOString().split("T")[0] === dateFilter
      );
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
      active: sosHistory.filter((i) => i.status === "active").length,
      resolved: sosHistory.filter((i) => i.status !== "active").length,
    }),
    [sosHistory]
  );

  const hasActiveFilters = dateFilter || statusFilter !== "all" || searchQuery.trim();

  const clearFilters = () => {
    setDateFilter("");
    setStatusFilter("all");
    setSearchQuery("");
  };

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0623] via-slate-950 to-black px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">

      {/* Fullscreen image viewer */}
      {fullScreenImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          onClick={() => setFullScreenImage(null)}
        >
          <div
            className="relative mx-auto h-[80vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-slate-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image src={fullScreenImage} alt="Fullscreen media" fill className="object-contain" sizes="100vw" priority />
          </div>
          <button
            className="absolute right-4 top-4 sm:right-6 sm:top-6 flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 text-xs sm:text-sm text-white transition hover:bg-white/20"
            onClick={() => setFullScreenImage(null)}
          >
            <X size={14} /> Close
          </button>
        </div>
      )}

      <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6">

        {/* Header */}
        <section className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/80 p-4 sm:p-6 shadow-xl shadow-pink-500/5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-pink-400 font-medium">
                SOS History
              </p>
              <h1 className="mt-1.5 sm:mt-2 text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
                Emergency alerts &amp; media
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-md">
                Review your alerts, filter by date or status, and open details instantly.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:min-w-[280px]">
              <StatCard label="Total" value={statistics.total} />
              <StatCard label="Active" value={statistics.active} accent />
              <StatCard label="Resolved" value={statistics.resolved} />
            </div>
          </div>
        </section>

        {/* Main content */}
        <section className="grid gap-4 sm:gap-6 xl:grid-cols-[1fr_280px]">

          {/* Alerts panel */}
          <div className=" relative space-y-4 rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/70 p-4 sm:p-6 shadow-xl shadow-slate-900/20">

            {/* Filters */}
            <div className="space-y-3 sticky top-15 md:top-20 bg-slate-900 p-2 rounded-xl border-2 border-pink-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
                  <Filter size={13} />
                  <span>Filters</span>
                  {hasActiveFilters && (
                    <span className="rounded-full bg-pink-500/20 px-2 py-0.5 text-[10px] text-pink-300 ring-1 ring-pink-500/30">
                      Active
                    </span>
                  )}
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-[11px] text-slate-500 hover:text-pink-400 transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-3">
                {/* Search */}
                <div className="sm:col-span-1">
                  <label className="mb-1.5 block text-[11px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Search by ID
                  </label>
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Alert ID..."
                      className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 pl-9 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-600 outline-none transition focus:border-pink-500/60 focus:ring-2 focus:ring-pink-500/15"
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="mb-1.5 block text-[11px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Status
                  </label>
                  <select
                    title="Status filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-3 py-2.5 text-xs sm:text-sm text-white outline-none transition focus:border-pink-500/60 focus:ring-2 focus:ring-pink-500/15 appearance-none cursor-pointer"
                  >
                    <option value="all">All statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Resolved</option>
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="mb-1.5 block text-[11px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Date
                  </label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none z-10" />
                    <input
                      title="Date filter"
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white outline-none transition focus:border-pink-500/60 focus:ring-2 focus:ring-pink-500/15 [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between border-t border-white/5 pt-3">
              <p className="text-xs text-slate-500">
                {filteredHistory.length === sosHistory.length
                  ? `${sosHistory.length} alert${sosHistory.length !== 1 ? "s" : ""}`
                  : `${filteredHistory.length} of ${sosHistory.length} alerts`}
              </p>
            </div>

            {/* Alert list */}
            {filteredHistory.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/50 p-8 sm:p-12 text-center">
                <Shield size={28} className="mx-auto mb-3 text-slate-700" />
                <p className="text-sm font-medium text-slate-400">No alerts match your filters</p>
                <p className="mt-1 text-xs text-slate-600">Try adjusting or clearing the filters above.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredHistory.map((sos) => (
                  <Card
                    key={sos.id}
                    className="rounded-2xl border border-white/8 bg-slate-950/70 shadow-md shadow-slate-900/30 transition-all duration-200 hover:border-pink-500/20 hover:bg-slate-950/90"
                  >
                    <CardContent className="p-4 sm:p-5">

                      {/* Top row: ID + actions */}
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] uppercase tracking-[0.25em] text-pink-400/70 font-medium mb-1">
                            Alert ID
                          </p>
                          <p className="font-mono text-xs sm:text-sm text-white/90 break-all leading-relaxed">
                            {sos.id}
                          </p>
                          <p className="mt-1 text-[11px] sm:text-xs text-slate-500">
                            {new Date(sos.timestamp).toLocaleString(undefined, {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </p>
                        </div>
                        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 shrink-0">
                          <Badge
                            variant={sos.status === "active" ? "destructive" : "secondary"}
                            className="text-[10px] tracking-wider"
                          >
                            {sos.status.toUpperCase()}
                          </Badge>
                          <Link
                            href={`/sos/${sos.id}`}
                            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80 transition hover:bg-pink-600/80 hover:text-white hover:border-pink-500/30 active:scale-95"
                          >
                            Details <ArrowRight size={13} />
                          </Link>
                        </div>
                      </div>

                      {/* Bottom row: location + media */}
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div className="rounded-xl border border-white/8 bg-slate-900/60 px-3 py-2.5">
                          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-medium">
                            Location
                          </p>
                          <p className="mt-1 text-xs text-slate-300 font-mono">
                            {sos.location?.lat != null
                              ? `${sos.location.lat.toFixed(4)}, ${sos.location.lng.toFixed(4)}`
                              : "—"}
                          </p>
                        </div>
                        <div className="rounded-xl border border-white/8 bg-slate-900/60 px-3 py-2.5">
                          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-medium">
                            Media
                          </p>
                          <p className="mt-1 text-xs text-slate-300">
                            {sos.media.length} item{sos.media.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>

                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/70 p-4 sm:p-5 shadow-xl shadow-slate-900/20 h-fit xl:sticky xl:top-20">
            <p className="text-[10px] uppercase tracking-[0.3em] text-pink-400 font-medium">
              Quick tips
            </p>
            <div className="mt-4 space-y-2.5 text-sm text-slate-300">
              {[
                {
                  title: "Faster search",
                  body: "Use partial alert IDs or filter by status to find incidents quickly.",
                },
                {
                  title: "Resolve alerts",
                  body: "Open an alert and mark it resolved once the situation is safe.",
                },
                {
                  title: "Location detail",
                  body: "Every alert includes coordinates with quick map access inside.",
                },
              ].map((tip) => (
                <div key={tip.title} className="rounded-xl bg-slate-950/60 px-4 py-3 border border-white/5">
                  <p className="text-xs font-semibold text-white">{tip.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{tip.body}</p>
                </div>
              ))}
            </div>
          </aside>

        </section>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl sm:rounded-2xl border border-white/8 bg-slate-950/80 p-3 sm:p-4 text-center">
      <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-slate-500 font-medium">
        {label}
      </p>
      <p className={`mt-2 text-2xl sm:text-3xl font-bold tracking-tight ${accent ? "text-pink-400" : "text-white"}`}>
        {value}
      </p>
    </div>
  );
}