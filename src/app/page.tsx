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
const ACCESS_CODE = "P20Rakshak";

// const apiList = [
//   {
//     path: "/api/auth/signup",
//     method: "POST",
//     desc: "Register a new user account. Creates user with default details (message: 'HELP!!'). Email , username , phoneNumber.",
//     body: { email: "abdul@example.com", username: "Abdul", phoneNumber: "9876543210" },
//     response: {
//       success: true,
//       message: "User registered successfully",
//       user: {
//         id: "user123",
//         email: "abdul@example.com",
//         username: "Abdul",
//         phoneNumber: "9876543210",
//         details: { id: "details123", message: "HELP!!", userId: "user123" }
//       }
//     },
//     errors: [
//       { status: 400, message: "Email is required" },
//       { status: 400, message: "Username is required" },
//       { status: 409, message: "User already exists" },
//       { status: 500, message: "Error creating user" }
//     ],
//     implemented: true
//   },
//   {
//     path: "/api/auth/signin",
//     method: "POST",
//     desc: "Sign in existing user by email. No password required (authentication disabled). Returns full user object with details.",
//     body: { email: "abdul@example.com" },
//     response: {
//       success: true,
//       message: "Sign-in successful",
//       user: {
//         id: "user123",
//         email: "abdul@example.com",
//         username: "Abdul",
//         phoneNumber: "9876543210",
//         createdAt: "2025-10-20T12:00:00Z"
//       }
//     },
//     errors: [
//       { status: 404, message: "User does not exist" },
//       { status: 500, message: "Error during sign-in" }
//     ],
//     implemented: true
//   },
//   {
//     path: "/api/user/[id]",
//     method: "GET, PUT, DELETE",
//     desc: "Fetch, update or delete user by ID",
//     body: { username: "Updated Name", phoneNumber: "9871234567" },
//     response: { id: "abc123", email: "abdul@example.com" },
//     implemented: false
//   },
//   {
//     path: "/api/user/[id]/details",
//     method: "GET, PUT",
//     desc: "Get or edit user details (message, codeword, address, etc.)",
//     body: { message: "HELP ME!", codeWord: "Rakshak", permanentAddress: { lat: 12.9, lng: 77.6 } },
//     response: { success: true, message: "Details updated successfully" },
//     implemented: false
//   },
//   {
//     path: "/api/user/[id]/trusted-friends",
//     method: "GET, POST",
//     desc: "List or add trusted friends",
//     body: { name: "Ali", phone: "9876543211" },
//     response: { success: true, message: "Friend added" },
//     implemented: false
//   },
//   {
//     path: "/api/user/[id]/trusted-friends/[friendId]",
//     method: "PUT, DELETE",
//     desc: "Edit or remove a trusted friend",
//     body: { name: "Updated Friend", phone: "9998887776" },
//     response: { success: true, message: "Friend updated" },
//     implemented: false
//   },
//   {
//     path: "/api/user/[id]/media",
//     method: "GET",
//     desc: "Fetch all user media (through SOS alerts)",
//     response: [{ type: "photo", url: "https://..." }, { type: "video", url: "https://..." }],
//     implemented: false
//   },
//   {
//     path: "/api/sos-alert/create",
//     method: "POST",
//     desc: "Create a new SOS alert (with location, etc.)",
//     body: { userDetailsId: "66eabc...", location: { lat: 12.92, lng: 77.62 } },
//     response: { success: true, message: "SOS alert created" },
//     implemented: false
//   },
//   {
//     path: "/api/sos-alert/[id]",
//     method: "GET, PUT, DELETE",
//     desc: "Manage specific SOS alert",
//     body: { status: "inactive" },
//     response: { success: true, message: "SOS alert updated" },
//     implemented: false
//   },
//   {
//     path: "/api/sos-alert/user/[userId]",
//     method: "GET",
//     desc: "Get all SOS alerts for a user",
//     response: [{ id: "abc", status: "active", timestamp: "2025-10-20T12:00Z" }],
//     implemented: false
//   },
//   {
//     path: "/api/media/upload",
//     method: "POST",
//     desc: "Upload media (image/video/audio)",
//     body: {
//       sosAlertId: "66eabc...",
//       type: "photo",
//       url: "https://res.cloudinary.com/example/photo.jpg",
//       publicId: "cloudinary123",
//       format: "jpg",
//     },
//     response: { success: true, message: "Media uploaded" },
//     implemented: false
//   },
//   {
//     path: "/api/media/[id]",
//     method: "GET, DELETE",
//     desc: "Get or delete a specific media file",
//     response: { success: true, message: "Media deleted" },
//     implemented: false
//   },
//   {
//     path: "/api/health",
//     method: "GET",
//     desc: "Check API health status",
//     response: { status: "ok", uptime: "1240s" },
//     implemented: false
//   },
// ];
const apiList = [
  // 🔐 AUTH
  {
    path: "/api/auth/signup",
    method: "POST",
    desc: "Register a new user account. Creates user with default details (message: 'HELP!!'). Required fields: email, username, phoneNumber.",
    body: { email: "2001riya@gmail.com", username: "Riya", phoneNumber: "9827453783", password: "jkAbc!@12" },
    response: {
      success: true,
      message: "User registered successfully",
      user: {
        id: "68fcc70c132244eaf83b68b0",
        username: "Riya",
        email: "2001riya@gmail.com@gmail.com",
        phoneNumber: "9827453783",
        createdAt: "2025-10-25T12:48:12.732Z",
      }
    },
    implemented: true
  },
  {
    path: "/api/auth/signin",
    method: "POST",
    desc: "Sign in an existing user by phoneNumber. Returns user with all linked details.",
    body: {
      password: "jkAbc!@12",
      phoneNumber: "9827453733"
    },
    response: {
      "success": true,
      "message": "Sign-in successful",
      "user": {
        "id": "68f857a510de027a2ec301e9",
        "username": "Riya",
        "email": "2001riya@gmail.com",
        "phoneNumber": "9827453733",
        "createdAt": "2025-10-22T04:03:49.653Z"
      }
    },
    implemented: true
  },

  // 👤 USER CORE
  {
    path: "/api/user/[id]",
    method: "GET, PUT, DELETE",
    desc: "Fetch, update, or delete a user by ID. Includes linked details, friends, and SOS alerts. PUT Example Below,for GET and DELETE no body",
    body: { username: "Updated Name", email: "updated@example.com" },
    response: {
      success: true,
      message: "User details updated successfully",
      user: {
        id: "abc123",
        username: "Abdul Updated",
        email: "updated@example.com",
        details: { id: "67a99day987d9a", message: "HELP!!" }
      }
    },
    implemented: true
  },

  // 🧩 USER DETAILS
  {
    path: "/api/user/[id]/details",
    method: "GET, PUT",
    desc: "Fetch or update user details. Includes address, codeWord, message, and SOS/friends data.",
    body: {
      permanentAddress: { lat: 12.9, lng: 77.6 },
      codeWord: "SafeHome",
      message: "I am in danger, please help!"
    },
    response: {
      success: true,
      message: "User details updated successfully",
      details: {
        id: "details123",
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
    desc: "Get or add trusted friends for a user. Each friend has a name and phone number.",
    body: { name: "Ali", phone: "9876543211" },
    response: {
      success: true,
      message: "Friend added successfully",
      friend: { id: "8s7d09as8d0a9", userDetailsId: "68f857a510de027a2ec301ea", name: "Ali", phone: "9876543211" }
    },
    implemented: true
  },
  {
    path: "/api/user/[id]/trusted-friends/[friendId]",
    method: "PUT, DELETE",
    desc: "Edit or delete a specific trusted friend.",
    body: { name: "Updated Friend", phone: "9998887776" },
    response: {
      success: true,
      message: "Friend updated successfully",
      friend: { id: "786s7dasbas7as", name: "Updated Friend", phone: "9998887776" }
    },
    implemented: true
  },

  // 📸 MEDIA
  {
    path: "/api/user/[id]/media",
    method: "GET",
    desc: "Fetch all user media through related SOS alerts.",
    response: [
      { id: "890ddidjk..", type: "photo", url: "https://cloudinary.com/photo1.jpg" },
      { id: "989sadasdkn..", type: "video", url: "https://cloudinary.com/video.mp4" }
    ],
    implemented: false
  },

  // 🚨 SOS ALERTS
  {
    path: "/api/sos-alert",
    method: "POST",
    desc: "Create a new SOS alert with location coordinates linked to userDetailsId.",
    body: {
      "userId": "68ffa766ac0cd72ed42de692",
      "location": { "lat": 12.9716, "lng": 77.5946 },
      "status": "active"
    },
    response: {
      "success": true,
      "message": "SOS alert created successfully",
      "sos": {
        "id": "6530a1f3b5c7da1a5a2b2cd9",
        "userDetailsId": "652fbfe1b7a83db45b3ef342",
        "timestamp": "2025-10-25T11:32:56.492Z",
        "location": { "lat": 12.9716, "lng": 77.5946 },
        "status": "active"
      }
    }
    ,
    implemented: true
  },
  {
    path: "/api/sos-alert/[id]",
    method: "GET, PUT, DELETE",
    desc: "Get, update, or delete a specific SOS alert.",
    body: {
      "location": { "lat": 12.9720, "lng": 77.5952 },
      "status": "active"
    }
    ,
    response: {
      "success": true,
      "message": "SOS updated successfully",
      "sos": {
        "id": "6530a1f3b5c7da1a5a2b2cd9",
        "timestamp": "2025-10-25T11:32:56.492Z",
        "location": { "lat": 12.9720, "lng": 77.5952 },
        "status": "active"
      }
    }

    ,
    implemented: true
  },
  {
    path: "/api/sos-alert/user/[userId]",
    method: "GET",
    desc: "Fetch all SOS alerts belonging to a specific user.",
    response: [
      {
        "success": true,
        "total": 2,
        "sosHistory": [
          {
            "id": "6530a1f3b5c7da1a5a2b2cd9",
            "timestamp": "2025-10-25T11:32:56.492Z",
            "status": "inactive",
            "location": { "lat": 12.9716, "lng": 77.5946 },
            "media": []
          },
          {
            "id": "6530a1f3b5c7da1a5a2b2ce0",
            "timestamp": "2025-10-25T12:00:23.492Z",
            "status": "active",
            "location": { "lat": 12.9719, "lng": 77.5950 },
            "media": []
          }
        ]
      }

    ],
    implemented: true
  },

  // 🗂️ MEDIA MANAGEMENT

  {
    path: "/api/media/upload",
    method: "POST",
    desc: `
Upload multiple media files (photos and/or a single audio) linked to an SOS alert.
- Images are uploaded to Cloudinary folder: Rakshak_uploads/images
- Audio is uploaded to Cloudinary folder: Rakshak_uploads/audio
- Max image size: 10 MB
- Max audio size: 15 MB
- Metadata (title & description) is optional and stored in Cloudinary context
- Media metadata is saved in MongoDB (Media collection) linked to SOSAlert
`,
    body: {
      sosAlertId: "string",          // ID of the SOSAlert to attach media
      files: "File[]",               // Multiple image files
      audio: "File (optional)",      // Single audio file
      title: "string (optional)",    // Metadata title
      description: "string (optional)" // Metadata description
    },
    response: {
      uploaded: [
        {
          id: "string",            // Media ID in database
          sosAlertId: "string",    // Linked SOSAlert ID
          type: "photo | audio",   // Media type
          publicId: "string",      // Cloudinary public_id
          url: "string",           // Secure Cloudinary URL
          format: "string",        // File format
          width: "number (optional, for images)",
          height: "number (optional, for images)",
          duration: "number (optional, for audio)",
          uploadedAt: "DateTime"
        }
      ]
    },
    implemented: true
  },

  {
    path: "/api/media/[id]",
    method: "GET",
    desc: `
Fetch all media linked to a specific SOSAlert by its ID.
- Returns all photos and audio associated with the SOSAlert
- Media includes URL, publicId, format, type, and metadata
`,
    params: {
      id: "string (SOSAlert ID)"
    },
    response: {
      media: [
        {
          id: "string",
          sosAlertId: "string",
          type: "photo | audio",
          publicId: "string",
          url: "string",
          format: "string",
          width: "number (optional)",
          height: "number (optional)",
          duration: "number (optional)",
          uploadedAt: "DateTime"
        }
      ]
    },
    implemented: true
  },

  {
    path: "/api/media/[id]",
    method: "DELETE",
    desc: `
Delete a specific media by its database ID.
- Removes the media from Cloudinary and MongoDB
- Only the media record with the given ID is deleted
`,
    params: {
      id: "string (Media ID)"
    },
    response: {
      success: true,
      message: "Media deleted successfully"
    },
    implemented: false
  }
  ,

  // 💓 HEALTH CHECK
  {
    path: "/api/health",
    method: "GET",
    desc: "Check API uptime and health status.",
    response: { status: "ok", uptime: "2500s", timestamp: "2025-10-25T14:00Z" },
    implemented: false
  }
];

interface ApiEndpoint {
  path: string;
  method: string;
  desc: string;
  body?: Record<string, any>;
  response: Record<string, any>;
  implemented: boolean;
  errors?: Array<{ status: number; message: string }>;
}

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
    <Card className="border-2">
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
  const [selected, setSelected] = useState<ApiEndpoint | null>(null);
  const [code, setCode] = useState("");
  const [showTestPanel, setShowTestPanel] = useState(false);

  const handleCodeSubmit = () => {
    if (code === ACCESS_CODE) {
      setShowTestPanel(true);
    }
  };

  return (
    <div className="min-h-screen  bg-gradient-to-r from-purple-400 via-emerald-400 to-indigo-400 flex items-center justify-center py-8 px-3 sm:px-6">
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
                  onClick={() => setSelected(api)}
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

        {/* Access/Test Panel */}
        <div className="mt-10 flex justify-center">
          {showTestPanel ? (
            <div className="w-full sm:w-3/4">
              <TestApiPanel selected={selected} />
            </div>
          ) : (
            <div className="bg-white/80 border border-gray-200 rounded-xl shadow-lg p-5 w-full max-w-xs flex flex-col items-center gap-3">
              <h3 className="text-base font-semibold text-gray-700">🔒 Access Test Panel</h3>
              <Input
                className="bg-gray-50 border-gray-300 focus:ring-2 focus:ring-blue-400 text-sm"
                type="password"
                value={code}
                maxLength={10}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter Access Code"
              />
              <Button onClick={handleCodeSubmit} className="w-full text-sm">
                Submit
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}