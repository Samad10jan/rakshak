"use server";

import { cookies } from "next/headers";
import { verifyToken } from "./jwt";

export async function getUserIdFromCookie(): Promise<string | null> {
    
  const cookieStore =  await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const decoded = verifyToken(token);
    return decoded.userId;
  } catch {
    return null;
  }
}