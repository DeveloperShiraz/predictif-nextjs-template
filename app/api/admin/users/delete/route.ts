import { NextRequest, NextResponse } from "next/server";
import { runWithAmplifyServerContext, createApiClient } from "@/lib/amplify-server-utils";

export async function DELETE(request: NextRequest) {
  const response = NextResponse.next();
  return await runWithAmplifyServerContext({
    nextServerContext: { request, response },
    operation: async (contextSpec) => {
      try {
        const body = await request.json();
        const { username } = body;

        if (!username) {
          return NextResponse.json(
            { error: "Username is required" },
            { status: 400 }
          );
        }

        const client = createApiClient(contextSpec);

        // Delete user via the Data API bridge (Lambda mutation)
        const { data, errors } = await (client.mutations as any).deleteUser(contextSpec, {
          username,
        });

        if (errors) {
          console.error("Errors deleting user via Data API:", errors);
          // Handle specific Cognito error check from Lambda if needed
          return NextResponse.json(
            { error: "Failed to delete user", details: errors },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: `User ${username} deleted successfully`,
          data
        });
      } catch (error: any) {
        console.error("Error deleting user:", error);
        return NextResponse.json(
          { error: error.message || "Failed to delete user" },
          { status: 500 }
        );
      }
    },
  });
}
