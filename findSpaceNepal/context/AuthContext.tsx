
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

type User = {
  _id: string;
  fullName: string;
  email: string;
  avatar?: string;
  // Add other user properties as needed
};

type AuthState = {
  token: string | null;
  authenticated: boolean | null;
  user: User | null;
};

type AuthContextType = {
  authState: AuthState;
  setAuthState: (authState: AuthState) => void;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    authenticated: null,
    user: null,
  });

  // Initialize auth state from secure storage
  const initializeAuth = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync("auth_token");
      const userString = await SecureStore.getItemAsync("user_data");

      if (token && userString) {
        const user = JSON.parse(userString);
        setAuthState({
          token,
          authenticated: true,
          user,
        });
      } else {
        setAuthState({
          token: null,
          authenticated: false,
          user: null,
        });
      }
    } catch (error) {
      setAuthState({
        token: null,
        authenticated: false,
        user: null,
      });
      console.error("Failed to initialize auth", error);
    }
  }, []);

  // Check auth state on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Handle logout
  const logout = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync("auth_token");
      await SecureStore.deleteItemAsync("user_data");
      setAuthState({
        token: null,
        authenticated: false,
        user: null,
      });
      router.replace("/sign-in");
    } catch (error) {
      console.error("Failed to logout", error);
    }
  }, []);

  // Update auth state and persist to secure storage
  const updateAuthState = useCallback(async (newState: AuthState) => {
    try {
      if (newState.token && newState.user) {
        await SecureStore.setItemAsync("auth_token", newState.token);
        await SecureStore.setItemAsync(
          "user_data",
          JSON.stringify(newState.user)
        );
      }
      setAuthState(newState);
    } catch (error) {
      console.error("Failed to update auth state", error);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authState,
        setAuthState: updateAuthState,
        logout,
        initializeAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
