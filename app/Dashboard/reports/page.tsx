"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { RefreshCw, AlertCircle, CheckCircle, Clock } from "lucide-react";

const client = generateClient<Schema>();

interface IncidentReport {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zip: string;
  incidentDate: string;
  description: string;
  photoUrls?: string[];
  status?: string;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Fetching incident reports...");
      const result = await client.models.IncidentReport.list();
      
      console.log("API Response:", result);
      
      if (result.data) {
        const sortedReports = result.data.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.incidentDate).getTime();
          const dateB = new Date(b.createdAt || b.incidentDate).getTime();
          return dateB - dateA; // Most recent first
        });
        setReports(sortedReports as IncidentReport[]);
        console.log(`✅ Loaded ${sortedReports.length} incident reports`);
      } else if (result.errors) {
        console.error("Errors fetching reports:", result.errors);
        setError(result.errors.map(e => e.message).join(", "));
      } else {
        setError("No data returned from API");
      }
    } catch (err: any) {
      console.error("Error fetching reports:", err);
      setError(err?.message || "Failed to load incident reports");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    const statusConfig = {
      submitted: { icon: Clock, color: "bg-blue-100 text-blue-800", label: "Submitted" },
      in_review: { icon: AlertCircle, color: "bg-yellow-100 text-yellow-800", label: "In Review" },
      resolved: { icon: CheckCircle, color: "bg-green-100 text-green-800", label: "Resolved" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.submitted;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Loading incident reports...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <Heading size="sm" className="text-[#000000]">
          Incident Reports
        </Heading>
        <Button onClick={fetchReports} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-red-900 mb-1">Error Loading Reports</h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {reports.length === 0 && !error && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium mb-1">No incident reports found</p>
          <p className="text-sm text-gray-500">Submit an incident report to see it here.</p>
        </div>
      )}

      {reports.length > 0 && (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {report.firstName} {report.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    ID: <span className="font-mono text-xs">{report.id}</span>
                  </p>
                </div>
                {getStatusBadge(report.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Contact</p>
                  <p className="text-sm text-gray-900">{report.email}</p>
                  <p className="text-sm text-gray-900">{report.phone}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Location</p>
                  <p className="text-sm text-gray-900">
                    {report.address}
                    {report.apartment && `, Apt ${report.apartment}`}
                  </p>
                  <p className="text-sm text-gray-900">
                    {report.city}, {report.state} {report.zip}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Incident Date</p>
                  <p className="text-sm text-gray-900">{formatDate(report.incidentDate)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Submitted</p>
                  <p className="text-sm text-gray-900">{formatDate(report.submittedAt || report.createdAt)}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 uppercase mb-1">Description</p>
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{report.description}</p>
              </div>

              {report.photoUrls && report.photoUrls.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-2">Photos</p>
                  <div className="flex gap-2 flex-wrap">
                    {report.photoUrls.map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        Photo {index + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

