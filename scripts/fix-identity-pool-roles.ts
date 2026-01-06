import {
  IAMClient,
  CreateRoleCommand,
  AttachRolePolicyCommand,
  GetRoleCommand,
} from "@aws-sdk/client-iam";
import {
  CognitoIdentityClient,
  SetIdentityPoolRolesCommand,
} from "@aws-sdk/client-cognito-identity";

const region = "us-east-1";
const iamClient = new IAMClient({ region });
const identityClient = new CognitoIdentityClient({ region });

const identityPoolId = "us-east-1:b7b1f018-e4d3-4882-b06a-f989843c31db";
const userPoolId = "us-east-1_XsGcRjOxp";
const clientId = "ek7n262itadf391h5tmpl6lm8";

async function fixIdentityPoolRoles() {
  console.log("🔧 Fixing Identity Pool IAM Roles...\n");

  // Step 1: Create Authenticated Role
  console.log("1️⃣  Creating Authenticated IAM Role...");

  const authenticatedRoleName = "Cognito_PredictifAuth_Role";
  let authenticatedRoleArn: string;

  try {
    // Check if role already exists
    const existingRole = await iamClient.send(
      new GetRoleCommand({ RoleName: authenticatedRoleName })
    );
    authenticatedRoleArn = existingRole.Role!.Arn!;
    console.log(`✅ Authenticated role already exists: ${authenticatedRoleArn}\n`);
  } catch (error: any) {
    if (error.name === "NoSuchEntity" || error.Error?.Code === "NoSuchEntity") {
      // Create new role
      const authTrustPolicy = {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Federated: "cognito-identity.amazonaws.com",
            },
            Action: "sts:AssumeRoleWithWebIdentity",
            Condition: {
              StringEquals: {
                "cognito-identity.amazonaws.com:aud": identityPoolId,
              },
              "ForAnyValue:StringLike": {
                "cognito-identity.amazonaws.com:amr": "authenticated",
              },
            },
          },
        ],
      };

      const createAuthRoleResponse = await iamClient.send(
        new CreateRoleCommand({
          RoleName: authenticatedRoleName,
          AssumeRolePolicyDocument: JSON.stringify(authTrustPolicy),
          Description: "IAM role for Cognito authenticated users",
        })
      );

      authenticatedRoleArn = createAuthRoleResponse.Role!.Arn!;
      console.log(`✅ Created authenticated role: ${authenticatedRoleArn}\n`);

      // Attach policies to authenticated role
      console.log("2️⃣  Attaching policies to authenticated role...");

      // Attach basic Cognito policy
      await iamClient.send(
        new AttachRolePolicyCommand({
          RoleName: authenticatedRoleName,
          PolicyArn: "arn:aws:iam::aws:policy/AmazonCognitoReadOnly",
        })
      );

      // Attach DynamoDB access policy
      await iamClient.send(
        new AttachRolePolicyCommand({
          RoleName: authenticatedRoleName,
          PolicyArn: "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess",
        })
      );

      console.log("✅ Policies attached\n");
    } else {
      throw error;
    }
  }

  // Step 3: Link roles to Identity Pool
  console.log("3️⃣  Linking roles to Identity Pool...");

  await identityClient.send(
    new SetIdentityPoolRolesCommand({
      IdentityPoolId: identityPoolId,
      Roles: {
        authenticated: authenticatedRoleArn,
      },
      RoleMappings: {
        [`cognito-idp.${region}.amazonaws.com/${userPoolId}:${clientId}`]: {
          Type: "Token",
          AmbiguousRoleResolution: "AuthenticatedRole",
        },
      },
    })
  );

  console.log("✅ Roles linked to Identity Pool\n");

  console.log("🎉 Identity Pool configuration complete!");
  console.log("\nYou can now login with:");
  console.log("  Email: admin@aws.com");
  console.log("  Password: TempPassword123!");
}

fixIdentityPoolRoles().catch((error) => {
  console.error("❌ Failed to fix Identity Pool roles:", error);
  process.exit(1);
});
