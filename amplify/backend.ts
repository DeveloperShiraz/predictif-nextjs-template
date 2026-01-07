import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource.js";
import { data } from "./data/resource.js";
import { storage } from "./storage/resource.js";

const backend = defineBackend({
  auth,
  data,
  storage,
});

const { cfnUserPool } = backend.auth.resources.cfnResources;

// Grant permissions to the Next.js Compute resource (Lambda)
// This enables the API routes to call Cognito Admin APIs
const iam = await import("aws-cdk-lib/aws-iam");
const statement = new iam.PolicyStatement({
  sid: "AllowAdminUserActions",
  actions: [
    "cognito-idp:ListUsers",
    "cognito-idp:AdminGetUser",
    "cognito-idp:AdminListGroupsForUser",
    "cognito-idp:AdminCreateUser",
    "cognito-idp:AdminDisableUser",
    "cognito-idp:AdminEnableUser",
    "cognito-idp:AdminDeleteUser",
    "cognito-idp:AdminAddUserToGroup",
    "cognito-idp:AdminRemoveUserFromGroup",
    "cognito-idp:GlobalSignOut"
  ],
  resources: [cfnUserPool.attrArn],
});

// Attach the policy to the Lambda execution role.
// Note: We cast to any because the 'compute' property is dynamically added for Next.js apps
// but might not be in the static type definition yet.
const computeLambda = (backend as any).compute?.resources?.lambda;
if (computeLambda) {
  computeLambda.addToRolePolicy(statement);

  // Explicitly pass environment variables to the Lambda runtime
  // This ensures variables set in the Console are available to the API routes
  if (process.env.APP_AWS_ACCESS_KEY_ID) {
    computeLambda.addEnvironment("APP_AWS_ACCESS_KEY_ID", process.env.APP_AWS_ACCESS_KEY_ID);
  }
  if (process.env.APP_AWS_SECRET_ACCESS_KEY) {
    computeLambda.addEnvironment("APP_AWS_SECRET_ACCESS_KEY", process.env.APP_AWS_SECRET_ACCESS_KEY);
  }
  if (process.env.APP_AWS_SESSION_TOKEN) {
    computeLambda.addEnvironment("APP_AWS_SESSION_TOKEN", process.env.APP_AWS_SESSION_TOKEN);
  }
  // Pass the Tables and Bucket as well to be safe
  if (process.env.DYNAMODB_COMPANY_TABLE) {
    computeLambda.addEnvironment("DYNAMODB_COMPANY_TABLE", process.env.DYNAMODB_COMPANY_TABLE);
  }
  if (process.env.DYNAMODB_INCIDENT_REPORT_TABLE) {
    computeLambda.addEnvironment("DYNAMODB_INCIDENT_REPORT_TABLE", process.env.DYNAMODB_INCIDENT_REPORT_TABLE);
  }
  if (process.env.S3_BUCKET_NAME) {
    computeLambda.addEnvironment("S3_BUCKET_NAME", process.env.S3_BUCKET_NAME);
  }
}
