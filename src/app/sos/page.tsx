"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DateFilter from "@/components/DateFilter";
import Image from "next/image";
import { Clock, Pin } from "lucide-react";

type Sos = {
    id: string;
    status: "active" | "inactive";
    location?: { lat: number; lng: number } | null;
    timestamp: string;
    media: {
        id: string;
        url: string;
        type: "photo" | "video" | "audio";
        format: string;
        duration?: number;
    }[];
};

type User = {
    id: string;
    username: string;
    phoneNumber: string;
};

export default function SosHistoryPage() {
    const [sosHistory, setSosHistory] = useState<Sos[]>([]);
    const [filteredHistory, setFilteredHistory] = useState<Sos[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [formData, setFormData] = useState({ phoneNumber: "", password: "" });
    const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

    /* ---------------- COOKIE ---------------- */

    const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift() ?? "";
    };

    /* ---------------- INITIAL LOAD ---------------- */

    useEffect(() => {
        const userId = getCookie("userId");
        if (userId) {
            fetchSosHistory(userId);
        } else {
            setLoading(false);
        }
    }, []);

    /* ---------------- ESC CLOSE FULLSCREEN ---------------- */

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setFullScreenImage(null);
            }
        };

        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, []);

    /* ---------------- FETCH ---------------- */

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
            setUser({ id: userId, username: "", phoneNumber: "" });
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- DATE FILTER (STABLE) ---------------- */

    const handleDateFilter = useCallback(
        (date: string | null) => {
            if (!date) {
                setFilteredHistory(sosHistory);
                return;
            }

            const filtered = sosHistory.filter((sos) => {
                const sosDate = new Date(sos.timestamp)
                    .toISOString()
                    .split("T")[0];

                return sosDate === date;
            });

            setFilteredHistory(filtered);
        },
        [sosHistory]
    );

    /* ---------------- LOGIN ---------------- */

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginLoading(true);
        setLoginError(null);

        try {
            const res = await fetch("/api/auth/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                setLoginError(data.message || "Login failed");
                return;
            }

            const userId = data.user.id;

            document.cookie = `userId=${userId}; path=/; max-age=${60 * 60 * 24 * 7
                }; SameSite=Lax`;

            setUser(data.user);
            fetchSosHistory(userId);
        } catch (err: any) {
            setLoginError(err.message || "Something went wrong");
        } finally {
            setLoginLoading(false);
        }
    };

    /* ---------------- STATUS COLOR ---------------- */

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "green";
            case "inactive":
                return "gray";
            default:
                return "gray";
        }
    };

    /* ---------------- STATES ---------------- */

    if (loading)
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-r-transparent"></div>
                    <p className="mt-4 text-lg text-gray-700">Loading...</p>
                </div>
            </div>
        );

    if (!user)
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <Card className="w-full max-w-md shadow-xl">
                    <CardContent className="p-8">
                        <h2 className="text-2xl font-bold text-center mb-6">
                            Login to View SOS History
                        </h2>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                className="w-full border rounded-lg px-4 py-3"
                                value={formData.phoneNumber}
                                onChange={(e) =>
                                    setFormData({ ...formData, phoneNumber: e.target.value })
                                }
                                required
                            />

                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full border rounded-lg px-4 py-3"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                                required
                            />

                            {loginError && (
                                <div className="text-red-600 text-sm">{loginError}</div>
                            )}

                            <Button className="w-full">
                                {loginLoading ? "Logging in..." : "Login"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );

    if (error)
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-red-500 text-lg">{error}</p>
            </div>
        );

    if (sosHistory.length === 0)
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-gray-500 text-lg">No SOS history found.</p>
            </div>
        );

    /* ---------------- MAIN UI ---------------- */

    return (
        <>
            {/* Fullscreen Modal */}
            {fullScreenImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-3 sm:p-6"
                    onClick={() => setFullScreenImage(null)}
                >
                    <div
                        className="relative w-full max-w-7xl h-[75vh] sm:h-[85vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={fullScreenImage}
                            alt="Fullscreen image"
                            fill
                            className="object-contain"
                            sizes="100vw"
                            priority
                        />
                    </div>
                </div>
            )}

            <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 px-3 sm:px-6 lg:px-10 py-6">
                <div className="max-w-6xl mx-auto">

                    {/* Heading */}
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2">
                        <Clock color="blue" size={40}/> Your SOS History
                    </h1>

                    {/* Date Filter */}
                    <div className="mb-5 sticky top-5 *:bg-white z-99">
                        <DateFilter onFilter={handleDateFilter} />
                    </div>

                    {/* Scrollable Area */}
                    <div className="">
                        <div className="h-full pr-2 sm:pr-4">
                            <div className="space-y-4 sm:space-y-6">
                                {filteredHistory.map((sos) => (
                                    <Card key={sos.id} className="shadow-lg">
                                        <CardContent className="p-4 sm:p-6">

                                            {/* Top Row */}
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                                                <p className="font-mono text-xs sm:text-sm break-all">
                                                    {sos.id}
                                                </p>

                                                <Badge
                                                    style={{
                                                        backgroundColor: getStatusColor(sos.status),
                                                    }}
                                                    className="text-white w-fit"
                                                >
                                                    {sos.status.toUpperCase()}
                                                </Badge>
                                            </div>

                                            {/* Timestamp */}
                                            <p className="text-sm sm:text-base mb-3">
                                                {new Date(sos.timestamp).toLocaleString()}
                                            </p>

                                            {/* Location */}
                                            {sos.location && (
                                                <div className="text-sm sm:text-base mb-4 break-all flex items-center gap-2">
                                                    <Pin size={15} color="red"/> {sos.location.lat}, {sos.location.lng}
                                                </div>
                                            )}

                                            {/* Media */}
                                            {sos.media.length > 0 && (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                                    {sos.media.map((m) => (
                                                        <div key={m.id}>

                                                            {m.type === "photo" && (
                                                                <div
                                                                    className="relative w-full h-48 sm:h-56 md:h-64 rounded-lg overflow-hidden cursor-pointer"
                                                                    onClick={() => setFullScreenImage(m.url)}
                                                                >
                                                                    <Image
                                                                        src={m.url}
                                                                        alt="SOS photo"
                                                                        fill
                                                                        className="object-cover hover:scale-105 transition-transform duration-300"
                                                                        sizes="(max-width: 640px) 100vw, 50vw"
                                                                    />
                                                                </div>
                                                            )}

                                                            {m.type === "audio" && (
                                                                <audio
                                                                    src={m.url}
                                                                    controls
                                                                    className="w-full"
                                                                />
                                                            )}

                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}