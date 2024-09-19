"use server";
import { Session as Auth0Session } from "@auth0/nextjs-auth0";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";
import { env } from "@/lib/env.config";

interface Session extends Auth0Session {
  apiAccessToken?: string;
}

const sessions: Record<string, Session> = {};

export async function getSessionByExtensionToken(
  token: string | null
): Promise<Session | null> {
  if (!token) {
    return null;
  }
  try {
    const decoded = (await jwt.verify(token, env.AUTH_SECRET)) as {
      tokenId: string;
    };
    const session = sessions[decoded.tokenId];
    return session || null;
  } catch (error) {
    return null;
  }
}

export async function storeSession(session: Session) {
  const tokenId = uuid();
  sessions[tokenId] = session;

  const jwtToken = await jwt.sign({ tokenId }, env.AUTH_SECRET, {
    expiresIn: "30d",
  });

  return jwtToken;
}
