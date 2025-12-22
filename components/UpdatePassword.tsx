"use client";

import { useState } from "react";
import { confirmSignIn } from "aws-amplify/auth";
import type { AuthError } from "@aws-amplify/auth";

interface UpdatePasswordProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  challengeResponse?: any; // This will store the challenge response from sign-in
}

export function UpdatePassword({
  onSuccess,
  onCancel,
  challengeResponse,
}: UpdatePasswordProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      await confirmSignIn({
        challengeResponse: newPassword,
      });
      onSuccess?.();
    } catch (err) {
      console.error("Error updating password:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update password"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="z-10 w-full max-w-md p-6 space-y-6 bg-white/90 dark:bg-zinc-900/90 rounded-lg shadow-xl backdrop-blur-sm">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Update Password</h1>
        <p className="text-muted-foreground">
          Please set your new password to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="newPassword"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          />
        </div>

        {error && <div className="text-sm text-red-500">{error}</div>}

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 inline-flex justify-center items-center h-10 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 inline-flex justify-center items-center h-10 rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 ring-offset-background transition-colors hover:bg-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
