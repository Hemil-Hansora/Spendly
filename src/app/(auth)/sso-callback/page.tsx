"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

const SSOCallbackPage = () => {
  // This component handles the redirect flow and completes the authentication
  return <AuthenticateWithRedirectCallback />;
};

export default SSOCallbackPage;