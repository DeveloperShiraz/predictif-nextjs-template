import { NextRequest, NextResponse } from "next/server";
import { runWithAmplifyServerContext, createApiClient } from "@/lib/amplify-server-utils";

export async function GET(request: NextRequest) {
  const response = NextResponse.next();
  return await runWithAmplifyServerContext({
    nextServerContext: { request, response },
    operation: async (contextSpec) => {
      try {
        console.log("Fetching companies from Amplify Data...");

        const client = createApiClient(contextSpec);
        const { data: companies, errors } = await client.models.Company.list(contextSpec, {
          selectionSet: ['id', 'name', 'domain', 'logoUrl', 'settings', 'isActive', 'createdAt', 'maxUsers'],
        });

        if (errors) {
          console.error("Errors fetching companies:", errors);
          return NextResponse.json(
            { error: "Failed to fetch companies", details: errors },
            { status: 500 }
          );
        }

        console.log(`Found ${companies?.length || 0} companies`);
        return NextResponse.json({ companies: companies || [] });
      } catch (error: any) {
        console.error("Exception fetching companies:", error);
        console.error("Error stack:", error.stack);
        return NextResponse.json(
          { error: "Failed to fetch companies", details: error.message },
          { status: 500 }
        );
      }
    },
  });
}

export async function POST(request: NextRequest) {
  const response = NextResponse.next();
  return await runWithAmplifyServerContext({
    nextServerContext: { request, response },
    operation: async (contextSpec) => {
      try {
        console.log("POST /api/admin/companies - Starting...");
        const body = await request.json();
        const { name, domain, logoUrl, settings, maxUsers } = body;
        console.log("Request body:", { name, domain, logoUrl, settings, maxUsers });

        if (!name) {
          return NextResponse.json(
            { error: "Company name is required" },
            { status: 400 }
          );
        }

        console.log("Creating Amplify client...");
        const client = createApiClient(contextSpec);
        console.log("Client created successfully");

        const { data: company, errors } = await client.models.Company.create(contextSpec, {
          name,
          domain: domain || undefined,
          logoUrl: logoUrl || undefined,
          settings: settings || undefined,
          maxUsers: maxUsers || undefined,
          isActive: true,
          createdAt: new Date().toISOString(),
        });

        if (errors) {
          console.error("Errors creating company:", JSON.stringify(errors, null, 2));
          return NextResponse.json(
            { error: "Failed to create company", details: errors },
            { status: 500 }
          );
        }

        console.log("Company created successfully:", company?.id);
        return NextResponse.json({ company }, { status: 201 });
      } catch (error: any) {
        console.error("Exception in POST /api/admin/companies:", error);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        return NextResponse.json(
          { error: "Failed to create company", details: error.message, stack: error.stack },
          { status: 500 }
        );
      }
    },
  });
}
