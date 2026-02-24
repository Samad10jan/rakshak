"use client";

import DateFilter from "@/components/DateFilter";
import Error from "@/components/Error";
import Loading from "@/components/Loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getUserIdFromCookie } from "@/lib/context";
import { Clock, Pin, XIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

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
    const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
    const router = useRouter();

    /* ---------------- INITIAL LOAD ---------------- */

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [loading, user, router]);

    useEffect(() => {

        async function getData() {
            try {
                const userId = await getUserIdFromCookie()
                if (userId) {
                    fetchSosHistory(userId);
                } else {
                    setUser(null)
                    setLoading(false);
                }

            } catch (err: any) {
                console.log(err.message);

                setLoading(false)

            }

        }
        getData()
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

    if (loading) return <Loading />;
    if (error) return <Error error={error} />;
    if (!user) return null;

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
                    className="fixed inset-0 z-55 bg-black/95 flex items-center justify-center p-3 sm:p-6"
                    onClick={() => setFullScreenImage(null)}
                >
                    <div
                        className="relative w-full max-w-xl h-[75vh] sm:h-[85vh] bg-neutral-800"
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
                    <Button onClick={() => setFullScreenImage(null)} className="rounded-full hover:bg-red-500 text-white absolute top-0 right-0 m-5 text-center ring-2 active:bg-red-500 ring-red-500 transtion-all duration-300"><XIcon /></Button>

                </div>
            )}

            <div className="min-h-screen bg-amber-100 px-3 sm:px-6 lg:px-10 py-6">
                <div className="max-w-6xl mx-auto">

                    {/* Heading */}
                    <div className=" flex justify-center items-center gap-4 text-xl md:text-4xl mb-8 mt-2">

                        <Clock color="red" size={40} /> Your SOS History

                    </div>

                    {/* Date Filter */}
                    <div className="sticky top-10 *:bg-white z-51 w-fit mx-auto">
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
                                                    <Pin size={15} color="red" /> {sos.location.lat}, {sos.location.lng}
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