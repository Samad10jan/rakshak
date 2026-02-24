"use server";

import { cookies } from "next/headers";
import { verifyToken } from "./jwt";

export async function getUserIdFromCookie(): Promise<string | null> {
    
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  if (!token) return null;

  try {
    const decoded = verifyToken(token);
    return decoded.userId;
  } catch {
    return null;
  }
}