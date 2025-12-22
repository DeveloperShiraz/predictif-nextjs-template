import Heading from "@/components/ui/Heading";
import { IncidentReportForm } from "@/components/forms/IncidentReportForm";
import type { NextPage } from "next";

const Dashboard: NextPage = () => {
  return (
    <div className="p-6">
      <Heading size="sm" className="text-[#000000] mb-6">
        Dashboard
      </Heading>
      <IncidentReportForm />
    </div>
  );
};

export default Dashboard;
