"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ApiEndpoint } from "@/lib/types";
import { useState } from "react";

const API_BASE = "https://rakshak-gamma.vercel.app/api/";


const apiList = [

  // 🔐 AUTH
  {
    path: "/api/auth/signup",
    method: "POST",
    desc: "Register a new user. Creates default userDetails with codeWord='help' and message='HELP!!! I am in danger.'",
    body: {
      username: "Riya",
      email: "2001riya@gmail.com",
      phoneNumber: "9827453783",
      password: "jkAbc!@12"
    },
    response: {
      success: true,
      message: "User registered successfully",
      user: {
        id: "userId",
        username: "Riya",
        email: "2001riya@gmail.com",
        phoneNumber: "9827453783",
        createdAt: "2025-10-25T12:48:12.732Z"
      }
    },
    implemented: true
  },

  {
    path: "/api/auth/signin",
    method: "POST",
    desc: "Authenticate user using phoneNumber and password. Returns user data and sets a JWT cookie (token).",
    body: {
      phoneNumber: "9827453733",
      password: "jkAbc!@12"
    },
    response: {
      success: true,
      message: "Sign-in successful",
      user: {
        id: "userId",
        username: "Riya",
        email: "2001riya@gmail.com",
        phoneNumber: "9827453733",
        details: {
          codeWord: "help"
        }
      }
    },
    implemented: true
  },

  // 👤 USER CORE
  {
    path: "/api/user/[id]",
    method: "GET, PUT, DELETE",
    desc: "Fetch, update, or delete a user by ID.",
    body: {
      username: "Updated Name",
      email: "updated@example.com"
    },
    response: {
      success: true,
      message: "User updated successfully",
      user: {
        id: "userId",
        username: "Updated Name",
        email: "updated@example.com"
      }
    },
    implemented: true
  },

  // 🧩 USER DETAILS
  {
    path: "/api/user/[id]/details",
    method: "GET, PUT",
    desc: "Fetch or update user details including permanentAddress, codeWord, and emergency message.",
    body: {
      permanentAddress: { lat: 12.9, lng: 77.6 },
      codeWord: "SafeHome",
      message: "I am in danger, please help!"
    },
    response: {
      success: true,
      message: "User details updated successfully",
      details: {
        id: "detailsId",
        permanentAddress: { lat: 12.9, lng: 77.6 },
        codeWord: "SafeHome",
        message: "I am in danger, please help!"
      }
    },
    implemented: true
  },

  // 🤝 TRUSTED FRIENDS
  {
    path: "/api/user/[id]/trusted-friends",
    method: "GET, POST",
    desc: "Get or add trusted emergency contacts for the user.",
    body: {
      name: "Ali",
      phone: "9876543211"
    },
    response: {
      success: true,
      message: "Friend added successfully",
      friend: {
        id: "friendId",
        name: "Ali",
        phone: "9876543211"
      }
    },
    implemented: true
  },

  {
    path: "/api/user/[id]/trusted-friends/[friendId]",
    method: "PUT, DELETE",
    desc: "Update or delete a trusted friend.",
    body: {
      name: "Updated Friend",
      phone: "9998887776"
    },
    response: {
      success: true,
      message: "Friend updated successfully"
    },
    implemented: true
  },

  // 🚨 SOS ALERTS
  {
    path: "/api/sos-alert",
    method: "POST",
    desc: "Create a new SOS alert linked to userId.",
    body: {
      userId: "userId",
      location: { lat: 12.9716, lng: 77.5946 },
      status: "active"
    },
    response: {
      success: true,
      message: "SOS alert created successfully",
      sos: {
        id: "sosId",
        userDetailsId: "detailsId",
        location: { lat: 12.9716, lng: 77.5946 },
        status: "active"
      }
    },
    implemented: true
  },

  {
    path: "/api/sos-alert",
    method: "GET",
    desc: "Admin endpoint to fetch all SOS alerts.",
    response: {
      success: true,
      total: 5,
      allSOS: []
    },
    implemented: true
  },

  {
    path: "/api/sos-alert/[id]",
    method: "GET, PUT, DELETE",
    desc: "Fetch, update, or delete a specific SOS alert.",
    body: {
      location: { lat: 12.9720, lng: 77.5952 },
      status: "inactive"
    },
    response: {
      success: true,
      message: "SOS updated successfully",
      sos: {
        id: "sosId",
        status: "inactive"
      }
    },
    implemented: true
  },

  {
    path: "/api/sos-alert/user/[userid]",
    method: "GET",
    desc: "Fetch SOS history of a user including media.",
    response: {
      success: true,
      total: 2,
      sosHistory: []
    },
    implemented: true
  },

  // 📸 MEDIA
  {
    path: "/api/media/upload",
    method: "POST",
    desc: "Upload SOS images and optional audio using multipart/form-data. Images stored in Cloudinary folder Rakshak_uploads/images and audio in Rakshak_uploads/audio.",
    body: {
      sosAlertId: "string",
      files: "File[]",
      audio: "File (optional)"
    },
    response: {
      uploaded: [
        {
          id: "mediaId",
          type: "photo",
          url: "https://cloudinary.com/file.jpg",
          format: "jpg"
        }
      ]
    },
    implemented: true
  },

  {
    path: "/api/media/[id]",
    method: "GET",
    desc: "Fetch all media linked to a specific SOSAlert ID.",
    response: {
      media: [
        {
          id: "mediaId",
          sosAlertId: "sosId",
          type: "photo",
          url: "https://cloudinary.com/file.jpg",
          uploadedAt: "Date"
        }
      ]
    },
    implemented: true
  }

];



const methodColors: Record<string, string> = {
  GET: "bg-green-100 text-green-700",
  POST: "bg-blue-100 text-blue-700",
  PUT: "bg-orange-100 text-orange-700",
  DELETE: "bg-red-100 text-red-700",
};

function TestApiPanel({ selected }: { selected: ApiEndpoint | null }) {
  const [endpoint, setEndpoint] = useState(selected?.path || "/api/auth/signup");
  const [method, setMethod] = useState(selected?.method.split(", ")[0] || "POST");
  const [body, setBody] = useState(JSON.stringify(selected?.body || {}, null, 2));
  const [response, setResponse] = useState({});
  const [loading, setLoading] = useState(false);

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
    <Card className="border-2 ">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="text-2xl">🧪</span>Test Endpoint
        </h2>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-700">Endpoint</label>
          <input
            className="w-full p-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            aria-label="API Endpoint"
            placeholder="Enter API endpoint"
            title="API Endpoint input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-700">Method</label>
          <select
            className="w-full p-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            title="HTTP Method"
            aria-label="Select HTTP Method"
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





  return (
    <div className="min-h-screen flex bg-amber-100 justify-center py-8 px-3 sm:px-6">
      <main className="w-full max-w-2xl md:max-w-4xl bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/30 p-5 sm:p-8 ">
        {/* Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div>

            <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 text-gray-800">
              RAKSHAK API
            </h1>
            <p className="text-gray-700 text-sm sm:text-base  max-w-md mx-auto">
              Complete API documentation for managing SOS alerts, trusted contacts, and emergency media.
            </p>
          </div>
          <div className="mt-4 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200 w-fit ">
            <p className="text-xs sm:text-sm text-gray-600">Base URL: </p>
            <code className="text-xs md:text-sm font-mono font-semibold text-blue-700 ">
              {API_BASE}
            </code>
          </div>
        </div>

        {/* API Section */}
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800 text-center sm:text-left">
            API Endpoints
          </h2>

          <Accordion type="single" collapsible className="space-y-3">
            {apiList.map((api, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <AccordionTrigger

                  className="px-2 "
                >
                  <div className="flex justify-between flex-col md:flex-row w-full ">

                    <p className="font-mono text-xs text-gray-800">{api.path}</p>
                    <p
                      className={`text-[10px]  md:text-xs px-2 py-0.5 rounded-full font-semibold  ${methodColors[api.method.split(",")[0].trim()]}`}
                    >
                      {api.method}
                    </p>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-4 pb-4">
                  {!api.implemented && (
                    <div className="bg-yellow-50 border border-yellow-200 p-2 rounded-lg mb-3">
                      <p className="text-xs text-yellow-800 font-medium">
                        ⚠️ This endpoint is not yet implemented
                      </p>
                    </div>
                  )}

                  <p className="text-xs sm:text-sm text-gray-700 mb-3">{api.desc}</p>

                  {api.body && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-gray-700 mb-1">Request Body:</p>
                      <pre className="bg-gray-50 text-gray-800 p-3 rounded-md text-[10px] sm:text-xs font-mono overflow-auto border border-gray-200">
                        {JSON.stringify(api.body, null, 2)}
                      </pre>
                    </div>
                  )}

                  {api.response && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-gray-700 mb-1">Success Response:</p>
                      <pre className="bg-gray-900 text-green-400 p-3 rounded-md text-[10px] sm:text-xs font-mono overflow-auto">
                        {JSON.stringify(api.response, null, 2)}
                      </pre>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

      </main>
    </div>
  );
}