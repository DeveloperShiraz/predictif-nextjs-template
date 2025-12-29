"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Heading from "@/components/ui/Heading";
import { useUserRole } from "@/lib/auth/useUserRole";
import type { NextPage } from "next";

const Dashboard: NextPage = () => {
  const router = useRouter();
  const { isAdmin, isIncidentReporter, isCustomer, isLoading, userEmail } = useUserRole();

  // Redirect non-admin users to their respective default pages
  useEffect(() => {
    if (!isLoading) {
      if (isIncidentReporter) {
        router.push("/Dashboard/incident-form");
      } else if (isCustomer) {
        router.push("/Dashboard/reports");
      }
    }
  }, [isLoading, isIncidentReporter, isCustomer, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  // Only admins see the dashboard
  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="p-6">
      <Heading size="sm" className="text-[#000000] mb-6">
        Admin Dashboard
      </Heading>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Dashboard Stats Cards */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Reports</h3>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Pending Review</h3>
          <p className="text-3xl font-bold text-yellow-600">0</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Resolved</h3>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Welcome, Admin</h2>
        <p className="text-gray-600 mb-4">
          You are logged in as: <span className="font-medium">{userEmail}</span>
        </p>
        <p className="text-gray-600">
          Use the navigation menu to manage incident reports, users, and view analytics.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
