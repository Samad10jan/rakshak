"use client";

import DateFilter from "@/components/DateFilter";
import Error from "@/components/Error";
import Loading from "@/components/Loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getUserIdFromCookie } from "@/lib/context";
import { Sos, User } from "@/lib/types";
import { ArrowRight, Clock, Fullscreen, MapPin, Minimize, TouchpadIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function SosHistoryPage() {
    const [sosHistory, setSosHistory] = useState<Sos[]>([]);
    const [filteredHistory, setFilteredHistory] = useState<Sos[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
    const router = useRouter();
    const [copiedId, setCopiedId] = useState(false);


    /* ---------------- INITIAL LOAD ---------------- */

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

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [loading, user, router]);


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
            setUser({ id: userId, username: "", phoneNumber: "", email: "" } as User);
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };


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

    /* ---------------- COPY ---------------- */

    const copyToClipboard = async (text: string) => {
        try {

            await navigator.clipboard.writeText(text);

            setCopiedId(true);
            setTimeout(() => setCopiedId(false), 2000);
        } catch {
            console.error("Failed to copy");
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
                    <Button onClick={() => setFullScreenImage(null)} className="rounded-full hover:bg-red-500 text-white absolute top-0 right-0 m-5 text-center ring-2 active:bg-red-500 ring-red-500 transtion-all duration-300"><Minimize /></Button>

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



                    <div className="h-full pr-2 sm:pr-4">
                        <div className="space-y-4 sm:space-y-6">
                            {filteredHistory.map((sos) => (
                                <Card key={sos.id} className="shadow-lg relative">
                                    <Link href={`/sos/${sos.id}`} className=" absolute top-2 right-5 rounded-full text-xs *:size-5 md:*:size-auto" title="sos page"><Button ><ArrowRight /></Button></Link>
                                    <CardContent className="p-4 sm:p-6">

                                        <Badge
                                            variant={sos.status !== "active" ? "secondary" : "destructive"}
                                            className=" w-fit absolute top-2 left-2 "
                                        >
                                            {sos.status.toUpperCase()}
                                        </Badge>

                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                                            <div className="">
                                                <p className="text-sm text-gray-500">Alert ID</p>
                                                <p className="font-mono break-keep text-xs md:text-base">{sos.id}</p>
                                                <Button

                                                    onClick={() => copyToClipboard(sos.id)}
                                                    className="font-mono rounded-full text-xs size-5 md:size-auto  "
                                                >
                                                    {copiedId ? "Copied" : "Copy"}
                                                </Button>
                                            </div>


                                        </div>


                                        <div className=" flex justify-between flex-wrap">
                                            <div className="text-sm sm:text-base mb-3">
                                                <p className="font-bold">Last Active Time:</p>
                                                {new Date(sos.timestamp).toLocaleString()}
                                            </div>

                                            {/* Location */}
                                            {
                                                <a href={`https://www.google.com/maps?q=${sos?.location?.lat},${sos?.location?.lng}`}
                                                    target="_blank">

                                                    <Button size="sm" variant="outline" className="text-xs md:text-base mb-3">
                                                        <MapPin size={14} /> Open in GoogleMaps
                                                    </Button>
                                                </a>}
                                        </div>

                                        {/* Media */}
                                        {sos.media.length > 0 && (
                                            <div>
                                                <div className="font-bold mb-2 text-center text-rose-700 text-xl">SOS Media</div>

                                                <div className="flex flex-col gap-4 flex-wrap ring-1 p-3 rounded-4xl">
                                                    {sos.media
                                                        .slice() // make a copy so we don’t mutate original

                                                        .sort((a, b) => {
                                                            // photos first, then audio
                                                            if (a.type === "photo" && b.type === "audio") return -1;
                                                            if (a.type === "audio" && b.type === "photo") return 1;
                                                            return 0;
                                                        })
                                                        .map((m) => (
                                                            <div key={m.id}>
                                                                {m.type === "photo" && (
                                                                    <div
                                                                        className="group relative w-full h-38 sm:h-56 md:h-64 rounded-lg overflow-hidden cursor-pointer"
                                                                        onClick={() => setFullScreenImage(m.url)}
                                                                    >
                                                                        <Image
                                                                            src={m.url}
                                                                            alt="SOS photo"
                                                                            fill
                                                                            className="object-cover hover:scale-105 transition-transform duration-300"
                                                                            sizes="(max-width: 640px) 100vw, 50vw"
                                                                        />
                                                                        <div className="opacity-0 flex justify-center items-center group-hover:opacity-100 absolute inset-0 w-full z-10 bg-black/50 rounded-2xl p-1 transition-opacity duration-700">
                                                                            <Fullscreen color="white" />
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {m.type === "audio" && (
                                                                    <audio src={m.url} controls className="w-full" />
                                                                )}
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        )}

                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>


                </div>
            </div>
        </>
    );
}