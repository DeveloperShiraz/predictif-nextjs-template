"use client";

import { useState, useEffect } from "react";
import { fetchAuthSession, fetchUserAttributes } from "aws-amplify/auth";

export type UserRole = "Admin" | "IncidentReporter" | "Customer" | null;

interface UseUserRoleReturn {
  role: UserRole;
  isLoading: boolean;
  isAdmin: boolean;
  isIncidentReporter: boolean;
  isCustomer: boolean;
  userEmail: string | null;
}

export function useUserRole(): UseUserRoleReturn {
  const [role, setRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    async function getUserRole() {
      try {
        const session = await fetchAuthSession();
        const attributes = await fetchUserAttributes();

        setUserEmail(attributes.email || null);

        // Get groups from Cognito token
        const groups = session.tokens?.accessToken?.payload["cognito:groups"] as string[] | undefined;

        if (groups && groups.length > 0) {
          // Priority: Admin > IncidentReporter > Customer
          if (groups.includes("Admin")) {
            setRole("Admin");
          } else if (groups.includes("IncidentReporter")) {
            setRole("IncidentReporter");
          } else if (groups.includes("Customer")) {
            setRole("Customer");
          } else {
            setRole(null);
          }
        } else {
          // Default to Customer if no group assigned
          setRole("Customer");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setRole(null);
      } finally {
        setIsLoading(false);
      }
    }

    getUserRole();
  }, []);

  return {
    role,
    isLoading,
    isAdmin: role === "Admin",
    isIncidentReporter: role === "IncidentReporter",
    isCustomer: role === "Customer",
    userEmail,
  };
}
