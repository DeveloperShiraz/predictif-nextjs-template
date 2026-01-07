import { NextRequest, NextResponse } from "next/server";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/data";
import { cookies } from "next/headers";
import outputs from "@/amplify_outputs.json";
import { type Schema } from "@/amplify/data/resource";

const client = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});

export async function GET(request: NextRequest) {
  try {
    // Call the custom query in our Data API
    const { data: users, errors } = await client.queries.listUsers();

    if (errors) {
      console.error("AppSync errors:", errors);
      throw new Error(errors[0].message);
    }

    const formattedUsers = (users || []).map((user: any) => ({
      username: user.username,
      email: user.email || "",
      emailVerified: user.emailVerified || false,
      status: user.status,
      enabled: user.enabled,
      createdAt: user.createdAt,
      groups: user.groups || [],
      companyId: user.companyId || null,
      companyName: user.companyName || null,
    }));

    return NextResponse.json({ users: formattedUsers });
  } catch (error: any) {
    console.error("Error listing users:", error);
    return NextResponse.json(
      {
        error: "Failed to list users",
        details: error.message,
        code: error.name
      },
      { status: 500 }
    );
  }
}
