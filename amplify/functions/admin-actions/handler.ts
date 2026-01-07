import {
    CognitoIdentityProviderClient,
    ListUsersCommand,
    AdminCreateUserCommand,
    AdminAddUserToGroupCommand,
    AdminSetUserPasswordCommand,
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

            const mappedUsers = (response.Users || []).map((user: any) => {
                const getAttr = (name: string) => user.Attributes?.find((a: any) => a.Name === name)?.Value;
                return {
                    username: user.Username,
                    email: getAttr("email"),
                    emailVerified: getAttr("email_verified") === "true",
                    status: user.UserStatus,
                    enabled: user.Enabled,
                    createdAt: user.UserCreateDate?.toISOString(),
                    groups: [], // Adding groups would require a separate call per user
                    companyId: getAttr("custom:companyId"),
                    companyName: getAttr("custom:companyName"),
                };
            });

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

            const createCommand = new AdminCreateUserCommand({
                UserPoolId: userPoolId,
                Username: email,
                UserAttributes: userAttributes,
                MessageAction: MessageActionType.SUPPRESS,
                TemporaryPassword: tempPassword,
            });

            const response = await client.send(createCommand);

            if (tempPassword) {
                await client.send(new AdminSetUserPasswordCommand({
                    UserPoolId: userPoolId,
                    Username: email,
                    Password: tempPassword,
                    Permanent: true,
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
                createdAt: response.User?.Attributes?.find(a => a.Name === "sub") ? new Date().toISOString() : undefined, // Placeholder or sub
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
