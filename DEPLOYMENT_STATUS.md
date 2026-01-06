# Deployment Status & Next Steps

## Current Situation

We encountered a persistent bug with Amplify Gen 2 sandbox where the CDK bootstrap detection fails despite the account being properly bootstrapped. This appears to be a known issue with Amplify CLI v1.5.0.

## What We've Completed

### ✅ Code Changes (All Committed & Pushed)

1. **Multi-Tenant Company Model** - `amplify/data/resource.ts`
   - Added Company model with proper authorization rules
   - SuperAdmin can manage all companies
   - Other roles can read their assigned company

2. **API Routes** - Created full CRUD for companies:
   - `app/api/admin/companies/route.ts` (GET all, POST new)
   - `app/api/admin/companies/[id]/route.ts` (GET one, PATCH, DELETE)

3. **Company Context** - `contexts/CompanyContext.tsx`
   - Global state management for companies
   - Integrated into Dashboard layout

4. **Companies Management Page** - `app/Dashboard/companies/page.tsx`
   - UI for viewing and managing companies
   - Only visible to SuperAdmin users

5. **Setup Scripts**:
   - `scripts/add-cognito-attributes.ts` - Adds custom:companyId and custom:companyName
   - `scripts/setup-after-clean-install.ts` - Complete setup automation
   - `scripts/migrate-existing-data.ts` - For migrating existing users

6. **Authentication Fixes**:
   - Updated `lib/amplify-server-utils.ts` with proper cookie handling
   - Fixed Next.js 15 compatibility issues
   - Added `createServerClient()` function for server-side data access

## Deployment Method

Since sandbox is blocked by the bootstrap bug, we're using **Amplify Hosting** (production deployment):

**App Details:**
- App ID: `d1rjertzivbohi`
- App Name: `predictif-nextjs-template`
- Repository: https://github.com/DeveloperShiraz/predictif-nextjs-template
- Branch: `main`
- Console: https://console.aws.amazon.com/amplify/home?region=us-east-1#/d1rjertzivbohi

## Next Steps

### 1. Wait for Amplify Build to Complete

Check build status:
\`\`\`bash
aws amplify list-jobs --app-id d1rjertzivbohi --branch-name main --max-items 1
\`\`\`

Or visit the AWS Console link above.

### 2. Once Build Completes

The build will generate a new `amplify_outputs.json` file. Download it from the build artifacts or the Amplify Console.

### 3. Run Setup Script

Once you have the new `amplify_outputs.json`:

\`\`\`bash
npx tsx scripts/setup-after-clean-install.ts
\`\`\`

This will:
- Add custom Cognito attributes (companyId, companyName)
- Create user groups (SuperAdmin, Admin, IncidentReporter, Customer)
- Create admin@aws.com user with password: `TempPassword123!`
- Add admin user to SuperAdmin group

### 4. Test the Application

1. Start dev server: `npm run dev`
2. Login with: `admin@aws.com` / `TempPassword123!`
3. Navigate to Dashboard > Companies
4. Create your first company (e.g., "StraightForward")

### 5. Create Additional Users

Use the existing user management pages to:
- Create users for different companies
- Assign them to companies using custom attributes
- Add them to appropriate groups

## Known Issues

### Amplify Sandbox Bootstrap Detection Bug

**Issue:** Amplify Gen 2 sandbox fails to detect CDK bootstrap even when properly configured.

**Error:** "This AWS account and region has not been bootstrapped"

**Verified:**
- CDK bootstrap exists and is valid
- SSM parameter `/cdk-bootstrap/hnb659fds/version` is set
- CloudFormation stack `CDKToolkit` is CREATE_COMPLETE

**Workaround:** Use Amplify Hosting production deployment instead of sandbox.

**Reported:** This should be reported to https://github.com/aws-amplify/amplify-backend/issues

## Architecture Notes

### Multi-Tenancy Approach

**Company Isolation:**
- Each company has a unique ID
- Users are assigned to companies via `custom:companyId` attribute
- Data is isolated using authorization rules

**Authorization Levels:**
1. **SuperAdmin** - Global access to all companies and data
2. **Admin** - Company admin (full access to their company's data)
3. **IncidentReporter** - Can create and view incident reports
4. **Customer** - Read-only access to reports

### Data Flow

\`\`\`
User Login → Cognito
  ↓
Custom Attributes (companyId, companyName)
  ↓
CompanyContext (Global State)
  ↓
API Routes (with authorization)
  ↓
Amplify Data (DynamoDB)
\`\`\`

## S3 Bucket Costs

You have 3 S3 buckets:
1. **incidentreportstorage** - User-uploaded files (will grow with usage)
2. **amplifydataamplifycodege** - Amplify infrastructure (small, KB range)
3. **modelintrospectionschema** - GraphQL schema metadata (small, KB range)

**Cost Impact:** The infrastructure buckets cost ~$0.01-0.05/month. Only the user storage bucket will scale with your app usage.

## Files Modified

- `amplify/data/resource.ts` - Added Company model
- `amplify/auth/resource.ts` - Updated group definitions
- `app/Dashboard/layout.tsx` - Added CompanyProvider
- `components/App-sidebar.tsx` - Added Companies menu item
- `lib/auth/useUserRole.ts` - Enhanced role detection
- Created new files for company management, context, and API routes

## Temporary Changes to Revert Later

In `amplify/data/resource.ts`, line 40, we added:
\`\`\`typescript
allow.authenticated().to(["read"]),
\`\`\`

This was for debugging. Once everything works, you can remove this line so only the specified groups have access.

## Contact & Support

If you continue to have issues with the Amplify sandbox, consider:
1. Filing a bug report with AWS Amplify team
2. Using Amplify Hosting for all deployments (recommended for production anyway)
3. Checking for updates to `@aws-amplify/backend-cli`

---

**Last Updated:** January 5, 2026
**Status:** Awaiting Amplify Hosting build completion
