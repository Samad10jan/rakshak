"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const API_BASE = "https://rakshak-gamma.vercel.app/api/";

interface ApiError {
  status: number;
  message: string;
}

interface ApiRoute {
  path: string;
  method: string;
  desc: string;
  body?: Record<string, any>;
  response?: Record<string, any> | Array<any>;
  errors?: ApiError[];
  implemented: boolean;
}

const apiList: ApiRoute[] = [
  {
    path: "/api/auth/signup",
    method: "POST",
    desc: "Register a new user account. Creates user with default details (message: 'HELP!!'). Email and username are required, phoneNumber is optional.",
    body: { email: "abdul@example.com", username: "Abdul", phoneNumber: "9876543210" },
    response: {
      success: true,
      message: "User registered successfully",
      user: {
        id: "user123",
        email: "abdul@example.com",
        username: "Abdul",
        phoneNumber: "9876543210",
        details: { id: "details123", message: "HELP!!", userId: "user123" }
      }
    },
    errors: [
      { status: 400, message: "Email is required" },
      { status: 400, message: "Username is required" },
      { status: 409, message: "User already exists" },
      { status: 500, message: "Error creating user" }
    ],
    implemented: true
  },
  {
    path: "/api/auth/signin",
    method: "POST",
    desc: "Sign in existing user by email. No password required (authentication disabled). Returns full user object with details.",
    body: { email: "abdul@example.com" },
    response: {
      success: true,
      message: "Sign-in successful",
      user: {
        id: "user123",
        email: "abdul@example.com",
        username: "Abdul",
        phoneNumber: "9876543210",
        createdAt: "2025-10-20T12:00:00Z"
      }
    },
    errors: [
      { status: 404, message: "User does not exist" },
      { status: 500, message: "Error during sign-in" }
    ],
    implemented: true
  },
  {
    path: "/api/user/[id]",
    method: "GET, PUT, DELETE",
    desc: "Fetch, update or delete user by ID",
    body: { username: "Updated Name", phoneNumber: "9871234567" },
    response: { id: "abc123", email: "abdul@example.com" },
    implemented: false
  },
  {
    path: "/api/user/[id]/details",
    method: "GET, PUT",
    desc: "Get or edit user details (message, codeword, address, etc.)",
    body: { message: "HELP ME!", codeWord: "Rakshak", permanentAddress: { lat: 12.9, lng: 77.6 } },
    response: { success: true, message: "Details updated successfully" },
    implemented: false
  },
  {
    path: "/api/user/[id]/trusted-friends",
    method: "GET, POST",
    desc: "List or add trusted friends",
    body: { name: "Ali", phone: "9876543211" },
    response: { success: true, message: "Friend added" },
    implemented: false
  },
  {
    path: "/api/user/[id]/trusted-friends/[friendId]",
    method: "PUT, DELETE",
    desc: "Edit or remove a trusted friend",
    body: { name: "Updated Friend", phone: "9998887776" },
    response: { success: true, message: "Friend updated" },
    implemented: false
  },
  {
    path: "/api/user/[id]/media",
    method: "GET",
    desc: "Fetch all user media (through SOS alerts)",
    response: [{ type: "photo", url: "https://..." }, { type: "video", url: "https://..." }],
    implemented: false
  },
  {
    path: "/api/sos-alert/create",
    method: "POST",
    desc: "Create a new SOS alert (with location, etc.)",
    body: { userDetailsId: "66eabc...", location: { lat: 12.92, lng: 77.62 } },
    response: { success: true, message: "SOS alert created" },
    implemented: false
  },
  {
    path: "/api/sos-alert/[id]",
    method: "GET, PUT, DELETE",
    desc: "Manage specific SOS alert",
    body: { status: "inactive" },
    response: { success: true, message: "SOS alert updated" },
    implemented: false
  },
  {
    path: "/api/sos-alert/user/[userId]",
    method: "GET",
    desc: "Get all SOS alerts for a user",
    response: [{ id: "abc", status: "active", timestamp: "2025-10-20T12:00Z" }],
    implemented: false
  },
  {
    path: "/api/media/upload",
    method: "POST",
    desc: "Upload media (image/video/audio)",
    body: {
      sosAlertId: "66eabc...",
      type: "photo",
      url: "https://res.cloudinary.com/example/photo.jpg",
      publicId: "cloudinary123",
      format: "jpg",
    },
    response: { success: true, message: "Media uploaded" },
    implemented: false
  },
  {
    path: "/api/media/[id]",
    method: "GET, DELETE",
    desc: "Get or delete a specific media file",
    response: { success: true, message: "Media deleted" },
    implemented: false
  },
  {
    path: "/api/health",
    method: "GET",
    desc: "Check API health status",
    response: { status: "ok", uptime: "1240s" },
    implemented: false
  },
];

const methodColors: Record<string, string> = {
  GET: "bg-green-100 text-green-700",
  POST: "bg-blue-100 text-blue-700",
  PUT: "bg-orange-100 text-orange-700",
  DELETE: "bg-red-100 text-red-700",
};

interface TestApiPanelProps {
  selected: ApiRoute | null;
}

function TestApiPanel({ selected }: TestApiPanelProps) {
  const [endpoint, setEndpoint] = useState<string>(selected?.path || "/api/auth/signup");
  const [method, setMethod] = useState<string>(selected?.method.split(", ")[0] || "POST");
  const [body, setBody] = useState<string>(JSON.stringify(selected?.body || {}, null, 2));
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSend = async () => {
    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: method !== "GET" ? body : undefined,
      });
      setResponse(await res.json());
    } catch (err: any) {
      setResponse({ error: err.message });
    }
    setLoading(false);
  };

  return (
    <Card className="border-2">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="text-2xl">🧪</span>Test Endpoint
        </h2>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-700">Endpoint</label>
          <input
            title="Endpoints"
            className="w-full p-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-700">Method</label>
          <select
            title="Method"
            className="w-full p-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>DELETE</option>
          </select>
        </div>

        {method !== "GET" && (
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700">Request Body (JSON)</label>
            <textarea
              title="body"
              className="w-full h-32 p-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 font-mono text-xs"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
        )}

        <button
          onClick={handleSend}
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Request"}
        </button>

        {response && (
          <div>
            <h3 className="text-sm font-medium mb-2 text-gray-700">Response:</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-auto max-h-64">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const [selected, setSelected] = useState<ApiRoute | null>(null);
  const [code, setCode] = useState("");
  const [textApiPanel, setTestApiPanel] = useState(false)
  // console.log(code);
  
  function handleCode() {
    if (code ==="P20Rakshak") {
      setTestApiPanel(!textApiPanel)
      console.log("code ok");
      
      return
    }
    console.log(code);
    
    return
  }


  return (
    <div className="min-h-screen p-6 sm:p-10 bg-gradient-to-r from-purple-400 to-indigo-400 ">
      <main className="max-w-4xl mx-auto flex flex-col items-center">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold mb-3">
            RAKSHAK API
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Complete API documentation for managing SOS alerts, trusted contacts, and emergency media
          </p>
          <div className="mt-4 inline-block bg-white px-4 py-2 rounded-lg shadow-sm border">
            <span className="text-sm text-gray-600">Base URL: </span>
            <code className="text-sm font-mono font-semibold text-blue-600">{API_BASE}</code>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 ">
          <div className="space-y-4 ">
            <h2 className="text-2xl font-bold mb-4">API Endpoints</h2>
            <Accordion type="single" collapsible className="space-y-2">
              {apiList.map((api, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="border rounded-lg bg-white shadow-sm hover:shadow-md transition"
                >
                  <AccordionTrigger onClick={() => setSelected(api)} className="px-4 hover:no-underline">
                    <div className="flex items-center justify-between w-full text-left gap-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-medium">{api.path}</span>

                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold whitespace-nowrap ${methodColors[api.method.split(",")[0].trim()]}`}>
                        {api.method}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    {!api.implemented && (
                      <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg mb-3">
                        <p className="text-sm text-yellow-800 font-medium">⚠️ This endpoint is not yet implemented</p>
                      </div>
                    )}
                    <p className="text-sm text-gray-600 mb-3">{api.desc}</p>

                    {api.body && (
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-gray-700 mb-1">Request Body:</p>
                        <pre className="bg-gray-50 text-gray-800 p-3 rounded-md text-xs font-mono overflow-auto border">
                          {JSON.stringify(api.body, null, 2)}
                        </pre>
                      </div>
                    )}
                    {api.response && (
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-gray-700 mb-1">Success Response (201):</p>
                        <pre className="bg-gray-900 text-green-400 p-3 rounded-md text-xs font-mono overflow-auto">
                          {JSON.stringify(api.response, null, 2)}
                        </pre>
                      </div>
                    )}
                    {api.errors && (
                      <div>
                        <p className="text-xs font-semibold text-gray-700 mb-1">Possible Errors:</p>
                        <div className="space-y-1">
                          {api.errors.map((err, idx) => (
                            <div key={idx} className="bg-red-50 border border-red-200 p-2 rounded text-xs">
                              <span className="font-semibold text-red-700">{err.status}:</span>{" "}
                              <span className="text-red-600">{err.message}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="mt-12 h-fit">
            {
              textApiPanel ?
                <TestApiPanel selected={selected} /> :
                <div className="flex flex-col items-center gap-4 ">
                  <Input className="bg-white/50" title="code" type="password" value={code} maxLength={10} onChange={(e) => { setCode(e.target.value) }} placeholder="Enter Code" />
                  <Button title="submit" onClick={handleCode} > Submit </Button>
                </div>
            }


          </div>
        </div>
      </main>
    </div>
  );
}