// Re-export from AuthContext.tsx for backward compatibility
import { useAuth, AuthProvider } from '@/lib/AuthContext';

// Export as default for any imports that use default
export default useAuth;

// Export named exports for any imports that use named exports
export { useAuth, AuthProvider };