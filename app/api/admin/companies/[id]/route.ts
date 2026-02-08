import { NextRequest, NextResponse } from "next/server";
import { runWithAmplifyServerContext, createApiClient } from "@/lib/amplify-server-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const response = NextResponse.next();
  return await runWithAmplifyServerContext({
    nextServerContext: { request, response },
    operation: async (contextSpec) => {
      try {
        const { id } = await params;

        const client = createApiClient(contextSpec);
        const { data: company, errors } = await client.models.Company.get(contextSpec, { id }, {
          selectionSet: ['id', 'name', 'domain', 'logoUrl', 'settings', 'isActive', 'createdAt', 'maxUsers'],
        });

        if (errors) {
          console.error("Errors fetching company:", errors);
          return NextResponse.json(
            { error: "Failed to fetch company", details: errors },
            { status: 500 }
          );
        }

        if (!company) {
          return NextResponse.json({ error: "Company not found" }, { status: 404 });
        }

        return NextResponse.json({ company });
      } catch (error: any) {
        console.error("Error fetching company:", error);
        return NextResponse.json(
          { error: "Failed to fetch company", details: error.message },
          { status: 500 }
        );
      }
    },
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const response = NextResponse.next();
  return await runWithAmplifyServerContext({
    nextServerContext: { request, response },
    operation: async (contextSpec) => {
      try {
        const { id } = await params;
        const body = await request.json();

        if (Object.keys(body).filter(key => key !== "id").length === 0) {
          return NextResponse.json(
            { error: "No fields to update" },
            { status: 400 }
          );
        }

        const client = createApiClient(contextSpec);

        // Remove id from body if present
        const { id: _, ...updateData } = body;

        const { data: company, errors } = await client.models.Company.update(contextSpec, {
          id,
          ...updateData,
        });

        if (errors) {
          console.error("Errors updating company:", errors);
          return NextResponse.json(
            { error: "Failed to update company", details: errors },
            { status: 500 }
          );
        }

        // CASCADING UPDATE: If name changed, update all IncidentReports
        if (updateData.name) {
          console.log(`Starting cascading update for company: ${id} -> ${updateData.name}`);

          // 1. Fetch all reports for this company
          const { data: reports, errors: fetchErrors } = await client.models.IncidentReport.list(contextSpec, {
            filter: { companyId: { eq: id } },
            selectionSet: ['id'] // Optimized fetch
          });

          if (fetchErrors) {
            console.error("Failed to fetch reports for cascading update:", fetchErrors);
          } else if (reports && reports.length > 0) {
            console.log(`Found ${reports.length} reports to update.`);

            // 2. Update each report (Sequentially to avoid rate limits, or Promise.all for speed)
            let updatedCount = 0;
            for (const report of reports) {
              try {
                await client.models.IncidentReport.update(contextSpec, {
                  id: report.id,
                  companyName: updateData.name
                });
                updatedCount++;
              } catch (e) {
                console.error(`Failed to cascade update for report ${report.id}:`, e);
              }
            }
            console.log(`Successfully cascaded name change into ${updatedCount}/${reports.length} reports.`);
          } else {
            console.log("No reports found to update.");
          }
        }

        return NextResponse.json({ company });
      } catch (error: any) {
        console.error("Error updating company:", error);
        return NextResponse.json(
          { error: "Failed to update company", details: error.message },
          { status: 500 }
        );
      }
    },
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const response = NextResponse.next();
  return await runWithAmplifyServerContext({
    nextServerContext: { request, response },
    operation: async (contextSpec) => {
      try {
        const { id } = await params;

        // TODO: Add validation to prevent deletion if company has users or reports
        // You may want to implement soft deletion instead

        const client = createApiClient(contextSpec);
        const { errors } = await client.models.Company.delete(contextSpec, { id });

        if (errors) {
          console.error("Errors deleting company:", errors);
          return NextResponse.json(
            { error: "Failed to delete company", details: errors },
            { status: 500 }
          );
        }

        return NextResponse.json({ success: true, message: "Company deleted successfully" });
      } catch (error: any) {
        console.error("Error deleting company:", error);
        return NextResponse.json(
          { error: "Failed to delete company", details: error.message },
          { status: 500 }
        );
      }
    },
  });
}
