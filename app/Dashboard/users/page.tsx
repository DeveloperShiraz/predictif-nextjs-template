"use client";

import { useState, useEffect } from "react";
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { RefreshCw, UserPlus, Shield, FileText, Users as UsersIcon } from "lucide-react";
import { useUserRole } from "@/lib/auth/useUserRole";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const router = useRouter();
  const { isAdmin, isLoading } = useUserRole();

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/Dashboard");
    }
  }, [isAdmin, isLoading, router]);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <Heading size="sm" className="text-[#000000]">
          User Management
        </Heading>
        <Button variant="default" size="sm">
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Role Stats Cards */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-5 h-5 text-red-600" />
            <h3 className="text-sm font-medium text-gray-500">Admins</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-medium text-gray-500">Incident Reporters</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <UsersIcon className="w-5 h-5 text-green-600" />
            <h3 className="text-sm font-medium text-gray-500">Customers</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Users</h2>
          <p className="text-sm text-gray-600 mt-1">Manage user accounts and roles</p>
        </div>

        <div className="p-6">
          <div className="text-center py-12 text-gray-500">
            <UsersIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="font-medium mb-2">User Management Coming Soon</p>
            <p className="text-sm">
              This feature will allow you to create, edit, and delete users, as well as assign them to different roles.
            </p>
            <p className="text-sm mt-4 text-gray-400">
              For now, please use the AWS Cognito Console to manage users and groups.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
