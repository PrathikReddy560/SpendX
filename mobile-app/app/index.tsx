// App Loading/Index Entry
// Redirects to appropriate screen

import { Redirect } from 'expo-router';

export default function Index() {
    // In production, check auth state and redirect accordingly
    // const isAuthenticated = useAuth();
    // return <Redirect href={isAuthenticated ? '/(app)' : '/auth/login'} />;

    // Start with login page
    return <Redirect href="/auth/login" />;
}
