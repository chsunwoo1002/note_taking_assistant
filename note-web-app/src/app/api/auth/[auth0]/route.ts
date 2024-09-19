import {
  handleAuth,
  handleCallback,
  handleLogin,
  Session,
} from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest } from "next/server";
import AuthApi from "@/api/auth.api";
import { storeSession } from "../../extension/extension-session";

const afterCallback = async (
  req: NextRequest,
  session: Session,
  state?: { [key: string]: any }
) => {
  try {
    const accessToken = session.accessToken;
    if (!accessToken) {
      throw new Error();
    }

    if (state?.action === "login") {
      const apiAccessToken = await AuthApi.signIn(accessToken);
      session.apiAccessToken = apiAccessToken.accessToken;
    } else if (state?.action === "signup") {
      const apiAccessToken = await AuthApi.signUp(accessToken);
      session.apiAccessToken = apiAccessToken.accessToken;
    } else {
      throw new Error();
    }

    // TODO: create more create flow for the chrome extension
    const extensionToken = await storeSession(session);
    session.extensionToken = extensionToken;

    return session;
  } catch (e) {
    if (state) {
      state.returnTo = "/something-went-wrong";
    }
    return;
  }
};

export const GET = handleAuth({
  login: handleLogin({
    returnTo: "/dashboard",
    getLoginState: (req: NextRequest) => {
      return {
        action: "login",
      };
    },
  }),
  signup: handleLogin({
    authorizationParams: {
      screen_hint: "signup",
    },
    returnTo: "/dashboard",
    getLoginState: (req: NextRequest) => {
      return {
        action: "signup",
      };
    },
  }),
  callback: async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const session = await handleCallback(req, res, {
        afterCallback,
      });

      return session;
    } catch (error) {
      return res.redirect("/something-went-wrong");
    }
  },
});
