import { useState, useEffect } from 'react';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';

export interface AuthUser {
  userId: string;
  email?: string;
  username?: string;
  isLoading: boolean;
  error: Error | null;
}

export function useAuthUser(): AuthUser {
  const [userId, setUserId] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        console.log("useAuthUser: Fetching user data...");
        
        // Try to get current user
        const user = await getCurrentUser();
        console.log("useAuthUser: User found", user);
        
        // Try to get attributes
        const attributes = await fetchUserAttributes();
        console.log("useAuthUser: Attributes found", attributes);
        
        // Set user details
        const id = user.userId || attributes.sub || '';
        setUserId(id);
        
        if (attributes.email) {
          setEmail(attributes.email);
        }
        
        if (attributes.preferred_username || user.username) {
          setUsername(attributes.preferred_username || user.username || '');
        }
      } catch (err) {
        console.error('Error fetching authenticated user:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return {
    userId,
    email,
    username,
    isLoading,
    error
  };
}