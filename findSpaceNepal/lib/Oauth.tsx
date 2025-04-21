import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import Constants from "expo-constants";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import React from "react";

interface ClientIds {
  webClientId: string;
  androidClientId: string;
  iosClientId: string;
}

export const useGoogleAuth = (clientIds: ClientIds) => {
  const [userInfo, setUserInfo] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: clientIds.webClientId,
    androidClientId: clientIds.androidClientId,
    iosClientId: clientIds.iosClientId,
    scopes: ["openid", "profile", "email"],
    redirectUri: AuthSession.makeRedirectUri({
      scheme: Constants.expoConfig?.scheme || "com.saroj3921.findSpaceNepal",
      useProxy: true, // Keep true for Expo Go, false for standalone builds
    }),
  });

  React.useEffect(() => {
    if (response?.type === "success" && response.authentication?.accessToken) {
      fetchUserInfo(response.authentication.accessToken);
    } else if (response?.type === "error") {
      setError(
        new Error(
          response.error?.message ||
            response.error?.code ||
            "Google authentication failed"
        )
      );
    }
  }, [response]);

  const fetchUserInfo = async (token: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Google API error: ${res.status}`);

      const user = await res.json();
      setUserInfo(user);
      setError(null);

      await SecureStore.setItemAsync("user", JSON.stringify(user));
      await SecureStore.setItemAsync("accessToken", token);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch user info")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const result = await promptAsync();
      if (result?.type === "error") {
        throw new Error(result.error?.message || "Authentication error");
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Login failed"));
    } finally {
      setIsLoading(false);
    }
  };

  const resetError = () => setError(null);

  const signOut = async () => {
    await SecureStore.deleteItemAsync("user");
    await SecureStore.deleteItemAsync("accessToken");
    setUserInfo(null);
  };

  console.log(
    "Redirect URI:",
    AuthSession.makeRedirectUri({
      scheme: Constants.expoConfig?.scheme,
      useProxy: true,
    })
  );

  return {
    userInfo,
    loginWithGoogle,
    request,
    isLoading,
    error,
    resetError,
    signOut,
  };
};
