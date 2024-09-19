import { getSession } from "@auth0/nextjs-auth0";
import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await getSession();

    if (!session || !session.extensionToken) {
      return NextResponse.json({ status: StatusCodes.UNAUTHORIZED });
    }

    return NextResponse.json({ extensionToken: session.extensionToken });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json({ status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
}
