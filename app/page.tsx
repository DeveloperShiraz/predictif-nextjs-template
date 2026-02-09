"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  signIn,
  signUp,
  confirmSignUp,
  resendSignUpCode,
  fetchAuthSession,
  signOut
} from "aws-amplify/auth";
import { UpdatePassword } from "@/components/UpdatePassword";
import { ResetPassword } from "@/components/ResetPassword";
import { LoadingSpinner, AlreadyAuthenticatedSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import Logo from "@/public/ClaimVerifAI.png";

// Define the possible authentication states
type AuthState =
  | "initial"
  | "authenticated"
  | "unauthenticated"
  | "submitting"
  | "password-update"
  | "password-reset"
  | "signup"
  | "confirm-signup";

export default function LandingPage() {
  const router = useRouter();

  // Basic form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Authentication and UI state
  const [authState, setAuthState] = useState<AuthState>("initial");
  const [challengeResponse, setChallengeResponse] = useState<any>(null);

  // Initial auth check when component mounts
  useEffect(() => {
    async function checkAuthentication() {
      try {
        const session = await fetchAuthSession();
        if (session.tokens?.accessToken) {
          console.log("User is already authenticated");
          setAuthState("authenticated");
          router.push("/Dashboard");
        } else {
          setAuthState("unauthenticated");
        }
      } catch (error) {
        setAuthState("unauthenticated");
      }
    }
    checkAuthentication();
  }, [router]);

  // Handle Login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setAuthState("submitting");

    try {
      const normalizedEmail = email.toLowerCase().trim();
      const { isSignedIn, nextStep } = await signIn({
        username: normalizedEmail,
        password,
      });

      if (nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED") {
        setChallengeResponse(nextStep);
        setAuthState("password-update");
      } else if (isSignedIn) {
        router.push("/Dashboard");
      }
    } catch (err: any) {
      console.error("Error signing in:", err);
      if (err.message && err.message.includes("already a signed in user")) {
        try {
          await signOut();
          if (typeof window !== 'undefined') {
            localStorage.clear();
            sessionStorage.clear();
          }
          setError("Session cleared. Please try logging in again.");
          setAuthState("unauthenticated");
        } catch (signOutErr) {
          setError("Please refresh the page and try again.");
          setAuthState("unauthenticated");
        }
      } else if (err.name === 'UserNotConfirmedException') {
        // Auto-switch to confirmation if user tries to login but isn't confirmed
        setError("Please confirm your account.");
        // We need to resend code because we don't know if they have one
        try {
          await resendSignUpCode({ username: email.toLowerCase().trim() });
          setSuccessMessage("Verification code sent to your email.");
        } catch (resendError) {
          console.log("Auto-resend failed", resendError);
        }
        setAuthState("confirm-signup");
      } else {
        setError(err instanceof Error ? err.message : "Failed to sign in");
        setAuthState("unauthenticated");
      }
    }
  };

  // Handle Signup submission
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setAuthState("submitting");

    try {
      const normalizedEmail = email.toLowerCase().trim();
      const { isSignUpComplete, nextStep } = await signUp({
        username: normalizedEmail,
        password,
        options: {
          userAttributes: {
            email: normalizedEmail,
          },
        },
      });

      if (nextStep.signUpStep === "CONFIRM_SIGN_UP") {
        setSuccessMessage("Account created! Please enter the code sent to your email.");
        setAuthState("confirm-signup");
      } else if (isSignUpComplete) {
        // Auto login? or just redirect to login
        setSuccessMessage("Account created successfully. Please login.");
        setAuthState("unauthenticated");
      }
    } catch (err: any) {
      console.error("Error signing up:", err);
      setError(err instanceof Error ? err.message : "Failed to sign up");
      setAuthState("signup");
    }
  };

  // Handle Confirmation submission
  const handleConfirmSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setAuthState("submitting");

    try {
      const normalizedEmail = email.toLowerCase().trim();
      const { isSignUpComplete } = await confirmSignUp({
        username: normalizedEmail,
        confirmationCode,
      });

      if (isSignUpComplete) {
        setSuccessMessage("Account verified! You can now login.");
        setAuthState("unauthenticated");
      }
    } catch (err: any) {
      console.error("Error confirming signup:", err);
      setError(err instanceof Error ? err.message : "Failed to verify code");
      setAuthState("confirm-signup");
    }
  };

  const handleResendCode = async () => {
    try {
      await resendSignUpCode({ username: email.toLowerCase().trim() });
      setSuccessMessage("Verification code resent to your email.");
    } catch (err: any) {
      setError("Failed to resend code: " + err.message);
    }
  };

  const handlePasswordUpdateSuccess = () => router.push("/Dashboard");
  const handlePasswordUpdateCancel = () => {
    setAuthState("unauthenticated");
    setPassword("");
    setChallengeResponse(null);
  };

  // Render content based on auth state
  const renderAuthContent = () => {
    switch (authState) {
      case "initial":
        return null;
      case "authenticated":
        return <AlreadyAuthenticatedSpinner />;
      case "submitting":
        return <LoadingSpinner />;
      case "password-update":
        return (
          <div className="w-full max-w-sm">
            <UpdatePassword
              onSuccess={handlePasswordUpdateSuccess}
              onCancel={handlePasswordUpdateCancel}
              challengeResponse={challengeResponse}
            />
          </div>
        );
      case "password-reset":
        return (
          <div className="w-full max-w-sm">
            <ResetPassword onCancel={() => setAuthState("unauthenticated")} />
          </div>
        );
      case "signup":
        return (
          <div className="w-full max-w-sm space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Create Account</h1>
              <p className="text-sm text-muted-foreground">
                Enter your details to create a new account
              </p>
            </div>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                />
              </div>
              {error && <div className="text-sm text-red-500 font-medium">{error}</div>}
              <Button type="submit" className="w-full bg-[#17315f] hover:bg-[#1a3a73] text-white">
                Sign Up
              </Button>
            </form>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <button onClick={() => setAuthState("unauthenticated")} className="text-blue-600 hover:underline">
                Login here
              </button>
            </div>
          </div>
        );

      case "confirm-signup":
        return (
          <div className="w-full max-w-sm space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Verify Email</h1>
              <p className="text-sm text-muted-foreground">
                We sent a code to {email}. Please enter it below.
              </p>
            </div>
            {successMessage && <div className="text-sm text-green-600 bg-green-50 p-2 rounded text-center">{successMessage}</div>}
            <form onSubmit={handleConfirmSignup} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Verification Code</label>
                <input
                  type="text"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                  placeholder="123456"
                />
              </div>
              {error && <div className="text-sm text-red-500 font-medium">{error}</div>}
              <Button type="submit" className="w-full bg-[#17315f] hover:bg-[#1a3a73] text-white">
                Verify Account
              </Button>
            </form>
            <div className="text-center text-sm space-y-2">
              <button onClick={handleResendCode} className="text-blue-600 hover:underline block w-full">
                Resend Code
              </button>
              <button onClick={() => setAuthState("unauthenticated")} className="text-gray-500 hover:text-gray-700">
                Back to Login
              </button>
            </div>
          </div>
        );

      default: // "unauthenticated" (Login)
        return (
          <div className="w-full max-w-sm space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
              <p className="text-sm text-muted-foreground">
                Enter your credentials to access your account
              </p>
            </div>

            {successMessage && <div className="text-sm text-green-600 bg-green-50 p-2 rounded text-center">{successMessage}</div>}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Username / Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium leading-none">Password</label>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                />
              </div>

              {error && <div className="text-sm text-red-500 font-medium">{error}</div>}

              <Button
                type="submit"
                className="w-full bg-[#17315f] hover:bg-[#1a3a73] text-white"
              >
                Login
              </Button>
            </form>

            <div className="text-center space-y-4">
              <button
                type="button"
                onClick={() => setAuthState("password-reset")}
                className="text-sm text-blue-600 hover:text-blue-800 underline underline-offset-4"
              >
                Forgot Password? Reset Here
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setError("");
                  setSuccessMessage("");
                  setAuthState("signup");
                }}
              >
                Sign Up
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-center items-center text-white p-10 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/Template_Background.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-[#17315f]/80 mix-blend-multiply" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-lg">
          <div className="bg-white/90 p-6 rounded-2xl shadow-xl mb-4 backdrop-blur-sm">
            <Image
              src={Logo}
              alt="ClaimVerifAI Logo"
              width={280}
              height={100}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">AI-Powered Roof Claim Intelligence</h1>
          <p className="text-xl text-blue-100/90 leading-relaxed">
            Streamline your claim investigations with advanced computer vision and automated report generation.
            Reliable, fast, and accurate.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 text-left w-full max-w-md">
            {[
              "Automated Damage Detection",
              "Instant PDF Reports",
              "Fraud Signal Analysis",
              "Weather Data Verification"
            ].map((feature, i) => (
              <div key={i} className="flex items-center space-x-2 bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/10">
                <div className="h-2 w-2 rounded-full bg-green-400" />
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center items-center p-8 lg:p-12 relative">
        <div className="absolute top-8 right-8 lg:hidden">
          <Image
            src={Logo}
            alt="ClaimVerifAI Logo"
            width={150}
            height={50}
            className="object-contain opacity-80"
          />
        </div>
        {renderAuthContent()}
      </div>
    </div>
  );
}
