# Workaround Setup Guide

Due to the Amplify Gen 2 bootstrap detection bug, we'll manually create the necessary AWS resources to test the multi-tenant functionality.

## Current Situation

- ✅ Code is complete and committed
- ❌ Amplify sandbox won't deploy (bootstrap bug)
- ❌ Amplify Hosting builds fail (same bootstrap bug)
- ❌ All previous AWS resources were deleted

## Manual Setup Steps

### 1. Create Cognito User Pool

```bash
# Create user pool
aws cognito-idp create-user-pool \
  --pool-name "predictif-manual-userpool" \
  --policies "PasswordPolicy={MinimumLength=8,RequireUppercase=true,RequireLowercase=true,RequireNumbers=true,RequireSymbols=true}" \
  --username-attributes email \
  --auto-verified-attributes email \
  --schema \
    Name=email,Required=true,Mutable=false,AttributeDataType=String \
    Name=custom:companyId,Mutable=true,AttributeDataType=String \
    Name=custom:companyName,Mutable=true,AttributeDataType=String \
  --region us-east-1
```

Save the `UserPoolId` from the output.

### 2. Create User Pool Client

```bash
# Replace USER_POOL_ID with the ID from step 1
aws cognito-idp create-user-pool-client \
  --user-pool-id USER_POOL_ID \
  --client-name "predictif-web-client" \
  --no-generate-secret \
  --explicit-auth-flows ALLOW_USER_PASSWORD_AUTH ALLOW_REFRESH_TOKEN_AUTH \
  --region us-east-1
```

Save the `ClientId` from the output.

### 3. Create User Groups

```bash
# Create SuperAdmin group
aws cognito-idp create-group \
  --user-pool-id USER_POOL_ID \
  --group-name SuperAdmin \
  --description "Global administrators" \
  --precedence 0 \
  --region us-east-1

# Create other groups
aws cognito-idp create-group --user-pool-id USER_POOL_ID --group-name Admin --precedence 1 --region us-east-1
aws cognito-idp create-group --user-pool-id USER_POOL_ID --group-name IncidentReporter --precedence 2 --region us-east-1
aws cognito-idp create-group --user-pool-id USER_POOL_ID --group-name Customer --precedence 3 --region us-east-1
```

### 4. Create Admin User

```bash
# Create user
aws cognito-idp admin-create-user \
  --user-pool-id USER_POOL_ID \
  --username admin@aws.com \
  --user-attributes Name=email,Value=admin@aws.com Name=email_verified,Value=true \
  --message-action SUPPRESS \
  --region us-east-1

# Set permanent password
aws cognito-idp admin-set-user-password \
  --user-pool-id USER_POOL_ID \
  --username admin@aws.com \
  --password "TempPassword123!" \
  --permanent \
  --region us-east-1

# Add to SuperAdmin group
aws cognito-idp admin-add-user-to-group \
  --user-pool-id USER_POOL_ID \
  --username admin@aws.com \
  --group-name SuperAdmin \
  --region us-east-1
```

### 5. Create Identity Pool

```bash
# Create identity pool
aws cognito-identity create-identity-pool \
  --identity-pool-name "predictif_manual_identitypool" \
  --allow-unauthenticated-identities \
  --cognito-identity-providers \
    ProviderName=cognito-idp.us-east-1.amazonaws.com/USER_POOL_ID,ClientId=USER_POOL_CLIENT_ID \
  --region us-east-1
```

Save the `IdentityPoolId`.

### 6. Create DynamoDB Tables

#### Company Table
```bash
aws dynamodb create-table \
  --table-name Company \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

#### IncidentReport Table
```bash
aws dynamodb create-table \
  --table-name IncidentReport \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=companyId,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    "IndexName=byCompanyId,KeySchema=[{AttributeName=companyId,KeyType=HASH}],Projection={ProjectionType=ALL}" \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

### 7. Update amplify_outputs.json

Create a new `amplify_outputs.json` with your manual resource IDs:

```json
{
  "auth": {
    "user_pool_id": "YOUR_USER_POOL_ID",
    "aws_region": "us-east-1",
    "user_pool_client_id": "YOUR_CLIENT_ID",
    "identity_pool_id": "YOUR_IDENTITY_POOL_ID",
    "mfa_methods": [],
    "standard_required_attributes": ["email"],
    "username_attributes": ["email"],
    "user_verification_types": ["email"],
    "password_policy": {
      "min_length": 8,
      "require_lowercase": true,
      "require_uppercase": true,
      "require_numbers": true,
      "require_symbols": true
    }
  },
  "data": {
    "url": "https://dynamodb.us-east-1.amazonaws.com",
    "aws_region": "us-east-1",
    "default_authorization_type": "AMAZON_COGNITO_USER_POOLS",
    "authorization_types": ["AMAZON_COGNITO_USER_POOLS"]
  },
  "version": "1.3"
}
```

### 8. Create IAM Roles for Identity Pool

You'll need to create authenticated and unauthenticated roles and attach them to the identity pool.

## Alternative: Use Automated Script

I can create a script that does all of the above automatically. Would you like me to do that?

## Testing After Setup

Once resources are created:

1. Start your dev server: `npm run dev`
2. Login with admin@aws.com / TempPassword123!
3. Navigate to `/Dashboard/companies`
4. Create your first company

## Known Limitations

- This manual setup bypasses Amplify entirely
- You won't have automatic schema updates
- You'll need to manually manage DynamoDB tables
- No GraphQL API (direct DynamoDB access only)

## Recommendation

File a support ticket with AWS about the bootstrap issue while using this workaround to continue development.

---

**Status:** Ready to execute once you confirm
**Time to complete:** ~10-15 minutes
