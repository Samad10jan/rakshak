export type Sos = {
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
    width?: number;
    height?: number;
  }[];
};

export type User = {
    id: string;
    username: string;
    phoneNumber: string;
    email: string;
    createdAt: string;
    
};

export interface ApiEndpoint {
  path: string;
  method: string;
  desc: string;
  body?: Record<string, any>;
  response: Record<string, any>;
  implemented: boolean;
  errors?: Array<{ status: number; message: string }>;
}