import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";

export function configureAmplify() {
  Amplify.configure(outputs);
}

export function getClient() {
  return generateClient<Schema>();
}
