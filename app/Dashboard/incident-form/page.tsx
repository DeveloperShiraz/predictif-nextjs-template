"use client";

import { IncidentReportForm } from "@/components/forms/IncidentReportForm";
import Heading from "@/components/ui/Heading";

const IncidentFormPage = () => {
  return (
    <div className="p-6">
      <Heading size="sm" className="text-[#000000] mb-6">
        Submit Incident Report
      </Heading>
      <IncidentReportForm />
    </div>
  );
};

export default IncidentFormPage;
