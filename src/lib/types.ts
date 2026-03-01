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
    
};