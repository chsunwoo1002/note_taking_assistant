import { getSession, handleAuth, handleCallback } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";

export const GET = handleAuth({
  callback: async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Perform the normal Auth0 callback handling
      await handleCallback(req, res);

      // Get the user's session
      const session = await getSession(req, res);

      if (session?.accessToken) {
        // Send the access token to your backend service
        const backendResponse = await fetch("http://localhost:8080/note/test", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ accessToken: session.accessToken }),
        });

        const customJWT = await backendResponse.json();
        const jwt = customJWT.data.jwt;

        // Set the JWT as an HTTP-only cookie
        const response = NextResponse.redirect(new URL("/dashboard", req.url));
        response.cookies.set("jwt", jwt, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 3600, // 1 hour, adjust as needed
          path: "/",
        });

        return response;
      }
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 500 }
      );
    }
  },
});
