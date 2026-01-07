import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { generateServerClientUsingCookies, generateServerClientUsingReqRes } from "@aws-amplify/adapter-nextjs/data";
import { cookies } from "next/headers";
import type { Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";

export const { runWithAmplifyServerContext } = createServerRunner({
  config: outputs,
});

// For use in Server Components - uses cookies-based authentication
export async function createServerClient() {
  const cookieStore = await cookies();

  // Debug: Log available cookies
  console.log("Available cookies:", cookieStore.getAll().map(c => c.name));

  return generateServerClientUsingCookies<Schema>({
    config: outputs,
    cookies: cookieStore,
  });
}

// For use in API Routes - uses request/response based authentication
export function createApiClient(contextSpec: any) {
  return generateServerClientUsingReqRes<Schema>({
    config: outputs,
    ...contextSpec,
  });
}
