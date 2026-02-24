"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [formData, setFormData] = useState({ phoneNumber: "", password: "" });
    const router= useRouter()


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

            router.push("/sos")
           
           
        } catch (err: any) {
            setLoginError(err.message || "Something went wrong");
        } finally {
            setLoginLoading(false);
        }
    };
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

}