"use client";

import { use, useEffect, useState } from "react";
import { getUserIdFromCookie } from "@/lib/context";
import {
    User as UserIcon,
    Phone,
    Mail,
    Calendar,
    Users,
    ShieldCheck,
} from "lucide-react";

import Loading from "@/components/Loading";
import ErrorComponent from "@/components/Error";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "@/lib/types";
import { useParams } from "next/navigation";

type TrustedFriend = {
    id: string;
    name: string;
    phone: string;
};

export default function UserProfilePage() {
    const params = useParams();
    const userId = params.userId;
    // const { userId } = use(params);

    const [user, setUser] = useState<User | null>(null);
    const [friends, setFriends] = useState<TrustedFriend[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /* ---------------- AUTH CHECK ---------------- */

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

            const resUser = await fetch(`/api/user/${userId}`);
            const userData = await resUser.json();

            if (!resUser.ok) {
                throw new Error(userData.message || "Failed to fetch user");
            }

            const resFriends = await fetch(
                `/api/user/${userId}/trusted-friends`
            );
            const friendsData = await resFriends.json();

            if (!resFriends.ok) {
                throw new Error(
                    friendsData.message || "Failed to fetch friends"
                );
            }

            setUser(userData.user);
            setFriends(friendsData.friends || []);
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- STATES ---------------- */

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-900 via-[#1a0b2e] to-black">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-white border-r-transparent"></div>
                    <p className="mt-4 text-lg text-gray-500">Loading...</p>
                </div>
            </div>
        )
    };
    if (error) return <ErrorComponent error={error} />;
    if (!user) return null;

    return (
        <div className="text-white min-h-screen bg-gradient-to-br from-purple-900 via-[#1a0b2e] to-black px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10">

            <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10">

                {/* -------- HEADER -------- */}
                <div className="text-center flex flex-col items-center space-y-2 sm:space-y-3">

                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <UserIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>

                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white break-words">
                        {user.username}
                    </h1>

                    <p className="text-[10px] sm:text-xs tracking-widest opacity-60 uppercase text-white">
                        User Profile
                    </p>

                </div>

                {/* -------- USER INFO GRID -------- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">



                    <Card className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-lg">
                        <CardContent className="p-4 sm:p-5 space-y-3 sm:space-y-4">

                            <div className="flex items-center gap-2 sm:gap-3">
                                <Mail className="w-4 h-4 opacity-70" />
                                <span className="text-xs sm:text-sm opacity-70 text-white">
                                    Email
                                </span>
                            </div>

                            <p className="text-base sm:text-lg font-medium break-all text-white">
                                {user.email || "N/A"}
                            </p>

                        </CardContent>
                    </Card>

                    <Card className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-lg">
                        <CardContent className="p-4 sm:p-5 space-y-3 sm:space-y-4">

                            <div className="flex items-center gap-2 sm:gap-3">
                                <Phone className="w-4 h-4 opacity-70" />
                                <span className="text-xs sm:text-sm opacity-70 text-white">
                                    Phone
                                </span>
                            </div>

                            <p className="text-base sm:text-lg font-medium text-white">
                                {user.phoneNumber}
                            </p>

                        </CardContent>
                    </Card>

                    <Card className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-lg">
                        <CardContent className="p-4 sm:p-5 space-y-3 sm:space-y-4">

                            <div className="flex items-center gap-2 sm:gap-3">
                                <Calendar className="w-4 h-4 opacity-70" />
                                <span className="text-xs sm:text-sm opacity-70 text-white">
                                    Member Since
                                </span>
                            </div>

                            <p className="text-base sm:text-lg font-medium text-white">
                                {new Date(user.createdAt).toLocaleDateString()}
                            </p>

                        </CardContent>
                    </Card>

                </div>

                {/* -------- TRUSTED CONTACTS -------- */}
                <div className="space-y-4">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                        <div className="flex items-center gap-2">
                            <Users className="w-10 h-10" />
                            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-white">
                                {friends.length} Trusted Contacts
                            </h2>

                        </div>

                        <Badge className="bg-purple-600/30 text-purple-200 border border-purple-400/30 text-xs sm:text-sm">
                            Limit 10
                        </Badge>

                    </div>

                    {friends.length === 0 ? (
                        <p className="text-xs sm:text-sm opacity-60 text-white">
                            No trusted contacts added.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">


                            {friends.map((friend) => (
                                <Card
                                    key={friend.id}
                                    className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl"
                                >
                                    <CardContent className="p-3 sm:p-4 space-y-2">

                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white">
                                                {friend.name.charAt(0).toUpperCase()}
                                            </div>

                                            <p className="font-medium text-white text-sm sm:text-base break-words">
                                                {friend.name}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 text-xs sm:text-sm opacity-70 text-white">
                                            <Phone className="w-4 h-4" />
                                            {friend.phone}
                                        </div>

                                        <Badge className="bg-green-500/20 text-green-300 border border-green-400/30 text-[10px] sm:text-xs">
                                            <ShieldCheck className="w-3 h-3 mr-1" />
                                            Trusted
                                        </Badge>

                                    </CardContent>
                                </Card>
                            ))}

                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}