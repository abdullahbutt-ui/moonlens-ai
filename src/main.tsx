import React from "react";
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router-dom";
import App from './App.tsx'
import './index.css'

const PUBLISHABLE_KEY = "pk_test_ZXZvbHZlZC1zdGlua2J1Zy0zOS5jbGVyay5hY2NvdW50cy5kZXYk";

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ClerkProvider 
        publishableKey={PUBLISHABLE_KEY}
        signInUrl="/login"
        signUpUrl="/login"
        afterSignInUrl="/dashboard"
        afterSignUpUrl="/profile-setup"
      >
        <App />
      </ClerkProvider>
    </BrowserRouter>
  </React.StrictMode>
);
