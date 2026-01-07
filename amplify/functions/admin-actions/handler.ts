import {
    CognitoIdentityProviderClient,
    ListUsersCommand,
    AdminCreateUserCommand,
    AdminAddUserToGroupCommand,
    AdminSetUserPasswordCommand,
    AdminListGroupsForUserCommand,
    MessageActionType,
} from "@aws-sdk/client-cognito-identity-provider";

interface AdminActionEvent {
    action: "listUsers" | "createUser";
    payload: any;
}

const client = new CognitoIdentityProviderClient({});

export const handler = async (event: any) => {
    const userPoolId = process.env.AMPLIFY_AUTH_USERPOOL_ID;

    if (!userPoolId) {
        throw new Error("AMPLIFY_AUTH_USERPOOL_ID is not set");
    }

    // Determine the action (Direct Lambda call uses 'action', AppSync uses 'fieldName')
    const action = event.action || event.fieldName;
    // AppSync passes arguments in 'arguments', direct call uses 'payload'
    const payload = event.payload || event.arguments || {};

    console.log(`Executing admin action: ${action}`, { hasPayload: !!payload });

    switch (action) {
        case "listUsers": {
            const command = new ListUsersCommand({
                UserPoolId: userPoolId,
            });
            const response = await client.send(command);

            const mappedUsers = await Promise.all((response.Users || []).map(async (user: any) => {
                const getAttr = (name: string) => user.Attributes?.find((a: any) => a.Name === name)?.Value;

                // Fetch groups for this user
                let groups: string[] = [];
                try {
                    const groupResponse = await client.send(new AdminListGroupsForUserCommand({
                        UserPoolId: userPoolId,
                        Username: user.Username
                    }));
                    groups = groupResponse.Groups?.map(g => g.GroupName!).filter(Boolean) || [];
                } catch (groupError) {
                    console.error(`Error fetching groups for user ${user.Username}:`, groupError);
                }

                return {
                    username: user.Username,
                    email: getAttr("email"),
                    emailVerified: getAttr("email_verified") === "true",
                    status: user.UserStatus,
                    enabled: user.Enabled,
                    createdAt: user.UserCreateDate?.toISOString(),
                    groups: groups,
                    companyId: getAttr("custom:companyId"),
                    companyName: getAttr("custom:companyName"),
                };
            }));

            return event.fieldName ? mappedUsers : { users: mappedUsers };
        }

        case "createUser": {
            const {
                email,
                tempPassword,
                group,
                companyId,
                companyName
            } = payload;

            const userAttributes = [
                { Name: "email", Value: email },
                { Name: "email_verified", Value: "true" },
            ];

            if (companyId) userAttributes.push({ Name: "custom:companyId", Value: companyId });
            if (companyName) userAttributes.push({ Name: "custom:companyName", Value: companyName });

            // Ensure we have a temporary password
            const actualTempPassword = tempPassword || `Temp${Math.random().toString(36).slice(-8)}!`;

            const createCommand = new AdminCreateUserCommand({
                UserPoolId: userPoolId,
                Username: email,
                UserAttributes: userAttributes,
                MessageAction: MessageActionType.SUPPRESS,
                TemporaryPassword: actualTempPassword,
            });

            const response = await client.send(createCommand);

            if (actualTempPassword) {
                await client.send(new AdminSetUserPasswordCommand({
                    UserPoolId: userPoolId,
                    Username: email,
                    Password: actualTempPassword,
                    Permanent: false, // Keep it temporary so they have to change it, or permanent if specified? 
                    // Manual creation usually implies "FORCE_CHANGE_PASSWORD" unless permanent is set.
                }));
            }

            if (group) {
                await client.send(new AdminAddUserToGroupCommand({
                    UserPoolId: userPoolId,
                    Username: email,
                    GroupName: group,
                }));
            }

            const resultUser = {
                username: response.User?.Username,
                email: email,
                emailVerified: true,
                status: response.User?.UserStatus,
                enabled: response.User?.Enabled,
                createdAt: new Date().toISOString(),
                groups: group ? [group] : [],
                companyId,
                companyName
            };

            return event.fieldName ? resultUser : { success: true, user: resultUser };
        }

        default:
            throw new Error(`Unknown action: ${action}`);
    }
};
