// components/Login.tsx
"use client";

import { useState, useEffect } from "react";
import { signIn, fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import { UpdatePassword } from "@/components/UpdatePassword";
import { ResetPassword } from "@/components/ResetPassword";
import {
  LoadingSpinner,
  AlreadyAuthenticatedSpinner,
} from "@/components/ui/LoadingSpinner";
import { Button } from "@/ui/Button";

// Define the possible authentication states
type AuthState =
  | "initial"
  | "authenticated"
  | "unauthenticated"
  | "submitting"
  | "password-update"
  | "password-reset";

export default function LoginPage() {
  // Basic form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Authentication and UI state - start with "initial" state
  const [authState, setAuthState] = useState<AuthState>("initial");
  const [challengeResponse, setChallengeResponse] = useState<any>(null);

  // Initial auth check when component mounts
  useEffect(() => {
    async function checkAuthentication() {
      try {
        // Try to get current auth session
        const session = await fetchAuthSession();

        if (session.tokens?.accessToken) {
          // User is already authenticated
          console.log("User is already authenticated");
          setAuthState("authenticated");

          // Allow UI to show "Already Authenticated" for a moment
          setTimeout(() => {
            redirectToDashboard();
          }, 1500);
        } else {
          // User is not authenticated
          console.log("User is not authenticated, showing login form");
          setAuthState("unauthenticated");
        }
      } catch (error) {
        // Error means not authenticated
        console.log("Auth check error, showing login form:", error);
        setAuthState("unauthenticated");
      }
    }

    checkAuthentication();
  }, []);

  // Function to redirect to Dashboard
  const redirectToDashboard = () => {
    console.log("Redirecting to Dashboard");
    window.location.href = "/Dashboard";
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setAuthState("submitting");

    try {
      const { isSignedIn, nextStep } = await signIn({
        username: email,
        password,
      });

      if (
        nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
      ) {
        setChallengeResponse(nextStep);
        setAuthState("password-update");
      } else if (isSignedIn) {
        console.log("Login successful - redirecting to Dashboard");
        redirectToDashboard();
      }
    } catch (err) {
      console.error("Error signing in:", err);
      setError(err instanceof Error ? err.message : "Failed to sign in");
      setAuthState("unauthenticated");
    }
  };

  // Handle successful password update
  const handlePasswordUpdateSuccess = () => {
    redirectToDashboard();
  };

  // Handle password update cancellation
  const handlePasswordUpdateCancel = () => {
    setAuthState("unauthenticated");
    setPassword("");
    setChallengeResponse(null);
  };

  // Determine what to render based on auth state
  const renderContent = () => {
    switch (authState) {
      case "initial":
        // During initial auth check, show nothing yet (or could show a minimal spinner)
        return null;

      case "authenticated":
        return <AlreadyAuthenticatedSpinner />;

      case "submitting":
        return <LoadingSpinner />;

      case "password-update":
        return (
          <UpdatePassword
            onSuccess={handlePasswordUpdateSuccess}
            onCancel={handlePasswordUpdateCancel}
            challengeResponse={challengeResponse}
          />
        );

      case "password-reset":
        return (
          <ResetPassword onCancel={() => setAuthState("unauthenticated")} />
        );

      default: // "unauthenticated"
        return (
          <div className="z-10 w-full max-w-md p-6 space-y-6 bg-white/90 dark:bg-zinc-900/90 rounded-lg shadow-xl backdrop-blur-sm">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold">Sign In</h1>
              <p className="text-muted-foreground">
                Enter your credentials to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-blue-300 dark:border-blue-700 bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
              </div>

              {error && <div className="text-sm text-red-500">{error}</div>}

              <Button
                type="submit"
                disabled={(authState as string) === "submitting"}
                variant="default"
                className="w-full inline-flex justify-center items-center h-10 rounded-md px-4 py-2 text-sm font-medium text-white bg-[#17315f] hover:bg-[#1a3a73] ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                {(authState as string) === "submitting"
                  ? "Signing in..."
                  : "Sign in"}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setAuthState("password-reset")}
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Forgot your password?
                </button>
              </div>
            </form>
          </div>
        );
    }
  };

  // The main return always shows the background, but content depends on auth state
  return (
    <div className="relative min-h-screen min-w-screen flex items-center justify-center overflow-hidden">
      {/* Background Image - always visible */}
      <div
        className="fixed inset-0 w-screen h-screen z-0"
        style={{
          backgroundImage: "url('/Template_Background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "100vw",
          height: "100vh",
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Show empty div during initial check to avoid layout shift */}
      {authState === "initial" && (
        <div className="z-10 w-full max-w-md p-6 space-y-6 opacity-0">
          {/* This is an invisible placeholder to prevent layout shift */}
        </div>
      )}

      {/* Content for all other states */}
      {authState !== "initial" && renderContent()}
    </div>
  );
}
