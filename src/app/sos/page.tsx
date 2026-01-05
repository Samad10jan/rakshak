"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [formData, setFormData] = useState({ phoneNumber: "", password: "" });
    const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

    // Utility to get cookie
    const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift() ?? "";
    };

    // Check cookie on load
    useEffect(() => {
        const userId = getCookie("userId");
        if (userId) {
            fetchSosHistory(userId);
        } else {
            setLoading(false);
        }
    }, []);

    // Handle escape key to close fullscreen image
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && fullScreenImage) {
                setFullScreenImage(null);
            }
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [fullScreenImage]);

    // Handle keyboard events for fullscreen image
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && fullScreenImage) {
                setFullScreenImage(null);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [fullScreenImage]);

    // Fetch SOS history
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
            setUser({ id: userId, username: "", phoneNumber: "" });
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // Login
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
            document.cookie = `userId=${userId}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
            setUser(data.user);
            fetchSosHistory(userId);
        } catch (err: any) {
            setLoginError(err.message || "Something went wrong");
        } finally {
            setLoginLoading(false);
        }
    };

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

    // Loading state
    if (loading)
        return (
            <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                    <p className="mt-4 text-lg text-gray-700">Loading...</p>
                </div>
            </div>
        );

    // Login form
    if (!user)
        return (
            <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
                <Card className="w-full max-w-md shadow-xl">
                    <CardContent className="p-6 sm:p-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">
                            Login to View SOS History
                        </h2>
                        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    Phone Number
                                </label>
                                <input
                                    title="tel"
                                    type="tel"
                                    className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
                                    value={formData.phoneNumber}
                                    onChange={(e) =>
                                        setFormData({ ...formData, phoneNumber: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    Password
                                </label>
                                <input
                                    title="pass"
                                    type="password"
                                    className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({ ...formData, password: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            {loginError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {loginError}
                                </div>
                            )}
                            <Button
                                type="submit"
                                disabled={loginLoading}
                                className="w-full py-3 text-base sm:text-lg font-semibold bg-blue-600 hover:bg-blue-700 transition-colors"
                            >
                                {loginLoading ? "Logging in..." : "Login"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );

    // Error state
    if (error)
        return (
            <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
                <Card className="w-full max-w-md shadow-xl">
                    <CardContent className="p-6 sm:p-8 text-center">
                        <div className="text-red-500 text-5xl mb-4">⚠️</div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Error</h3>
                        <p className="text-gray-600">{error}</p>
                    </CardContent>
                </Card>
            </div>
        );

    // Empty state
    if (sosHistory.length === 0)
        return (
            <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
                <Card className="w-full max-w-md shadow-xl">
                    <CardContent className="p-6 sm:p-8 text-center">
                        <div className="text-gray-400 text-5xl mb-4">📋</div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                            No SOS History
                        </h3>
                        <p className="text-gray-600">No SOS history found.</p>
                    </CardContent>
                </Card>
            </div>
        );

    // SOS History view
    return (
        <>
            {/* Fullscreen Image Modal */}
            {fullScreenImage && (
                <div
                    className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4"
                    onClick={() => setFullScreenImage(null)}
                >
                    {/* Close button */}
                    <button
                        className="absolute top-4 right-4 text-white text-4xl sm:text-5xl hover:text-gray-300 transition-colors z-10 w-12 h-12 flex items-center justify-center"
                        onClick={() => setFullScreenImage(null)}
                        aria-label="Close fullscreen"
                    >
                        ×
                    </button>

                    {/* Download button */}
                    <a
                        href={fullScreenImage}
                        download
                        className="absolute top-4 right-20 text-white text-2xl sm:text-3xl hover:text-gray-300 transition-colors z-10 w-12 h-12 flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Download image"
                    >
                        ⬇️
                    </a>

                    {/* Instructions */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm sm:text-base text-center bg-black bg-opacity-50 px-4 py-2 rounded-lg">
                        Click anywhere or press ESC to close
                    </div>

                    {/* Image */}
                    <img
                        src={fullScreenImage}
                        alt="Fullscreen view"
                        className="max-w-full max-h-full object-contain cursor-zoom-out"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-6 sm:mb-8">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 flex items-center gap-3">
                            <span className="text-3xl sm:text-4xl">🕒</span>
                            <span className="break-words">Your SOS History</span>
                        </h1>
                        <p className="text-gray-600 mt-2 text-sm sm:text-base">
                            View all your emergency alerts and their details
                        </p>
                    </div>

                    <ScrollArea className="h-[calc(100vh-180px)] sm:h-[calc(100vh-200px)]">
                        <div className="space-y-4 sm:space-y-6 pr-2 sm:pr-4">
                            {sosHistory.map((sos) => (
                                <Card
                                    key={sos.id}
                                    className="shadow-lg hover:shadow-xl transition-shadow duration-300"
                                >
                                    <CardContent className="p-4 sm:p-6">
                                        {/* Header section */}
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-4 border-b">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs sm:text-sm text-gray-500 mb-1">ID</p>
                                                <p className="font-mono text-sm sm:text-base text-gray-800 break-all">
                                                    {sos.id}
                                                </p>
                                            </div>
                                            <Badge
                                                style={{ backgroundColor: getStatusColor(sos.status) }}
                                                className="text-white px-3 py-1 self-start sm:self-auto text-xs sm:text-sm"
                                            >
                                                {sos.status.toUpperCase()}
                                            </Badge>
                                        </div>

                                        {/* Timestamp */}
                                        <div className="mb-4">
                                            <p className="text-xs sm:text-sm text-gray-500 mb-1">Timestamp</p>
                                            <p className="text-sm sm:text-base text-gray-800">
                                                {new Date(sos.timestamp).toLocaleString()}
                                            </p>
                                        </div>

                                        {/* Location section */}
                                        {sos.location && (
                                            <div className="bg-blue-50 rounded-lg p-4 mb-4">
                                                <p className="font-semibold text-sm sm:text-base text-gray-800 mb-2">
                                                    📍 Location
                                                </p>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-3">
                                                    <span className="break-all">Lat: {sos.location.lat}</span>
                                                    <span className="hidden sm:inline">•</span>
                                                    <span className="break-all">Lng: {sos.location.lng}</span>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="w-full sm:w-auto text-xs sm:text-sm"
                                                    onClick={() => {
                                                        const url = `https://www.google.com/maps?q=${sos.location?.lat},${sos.location?.lng}`;
                                                        window.open(url, "_blank");
                                                    }}
                                                >
                                                    🗺️ Open in Google Maps
                                                </Button>
                                            </div>
                                        )}

                                        {/* Media section */}
                                        {sos.media.length > 0 && (
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <p className="font-semibold text-sm sm:text-base text-gray-800 mb-3">
                                                    📎 Media ({sos.media.length})
                                                </p>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                                    {sos.media.map((m) => (
                                                        <div
                                                            key={m.id}
                                                            className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200 hover:border-blue-300 transition-colors"
                                                        >
                                                            {m.type === "photo" && (
                                                                <div className="relative group">
                                                                    <img
                                                                        src={m.url}
                                                                        alt="SOS photo"
                                                                        className="w-full h-32 sm:h-40 object-cover rounded mb-2 cursor-pointer hover:opacity-90 transition-opacity"
                                                                        onClick={() => setFullScreenImage(m.url)}
                                                                    />
                                                                    <div className="absolute inset-0 flex items-center justify-center bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded mb-2 pointer-events-none">
                                                                        <span className="text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity">
                                                                            🔍
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {m.type === "video" && (
                                                                <video
                                                                    src={m.url}
                                                                    controls
                                                                    className="w-full h-32 sm:h-40 rounded mb-2 bg-black"
                                                                />
                                                            )}
                                                            {m.type === "audio" && (
                                                                <audio
                                                                    src={m.url}
                                                                    controls
                                                                    className="w-full mb-2"
                                                                />
                                                            )}
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-xs sm:text-sm font-medium text-gray-700 capitalize">
                                                                    {m.type}
                                                                </span>
                                                                <span className="text-xs text-gray-500">
                                                                    {m.format}
                                                                </span>
                                                                {m.duration && (
                                                                    <span className="text-xs text-blue-600 font-medium">
                                                                        Duration: {m.duration}s
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>

            {/* Fullscreen Image Modal */}
            {fullScreenImage && (
                <div
                    className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4"
                    onClick={() => setFullScreenImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 text-white text-4xl sm:text-5xl hover:text-gray-300 transition-colors z-10"
                        onClick={() => setFullScreenImage(null)}
                        aria-label="Close fullscreen"
                    >
                        ×
                    </button>
                    <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
                        <img
                            src={fullScreenImage}
                            alt="Fullscreen SOS photo"
                            className="max-w-full max-h-full object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    <p className="absolute bottom-4 text-white text-sm sm:text-base text-center px-4">
                        Click outside or press ESC to close
                    </p>
                </div>
            )}
        </>
    );
}