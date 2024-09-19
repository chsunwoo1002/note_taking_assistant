"use client";

import { useEffect } from "react";
import Router from "next/router";

export const ExtensionTokenHandler = () => {
  useEffect(() => {
    const fetchExtensionToken = async () => {
      try {
        const response = await fetch("/api/extension/token", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch extension token");
        }

        const data = await response.json();
        const { extensionToken } = data;

        console.log("location", location);
        console.log("extensionToken", extensionToken);
        // Send the extensionToken to the Chrome extension
        // window.postMessage(
        //   { type: "EXTENSION_TOKEN", token: extensionToken },
        //   "*" // set the origin to chrome extension
        // );
      } catch (error) {
        console.error("Error fetching extension token:", error);
        // Handle error (e.g., redirect to login)
        Router.push("/api/auth/login");
      }
    };

    fetchExtensionToken();
  }, []);

  return null;
};
