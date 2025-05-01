import { Redirect, Slot } from "expo-router";
import { ActivityIndicator, SafeAreaView } from "react-native";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function AppLayout() {
  const { authState, initializeAuth } = useAuth();

  const [isInitialized, setIsinitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      await initializeAuth();
      setIsinitialized(true);
    };
    init();
  }, [initializeAuth]);
  // const loading = false;
  // const isLogged = false;

  if (!isInitialized || authState.authenticated === null) {
    return (
      <SafeAreaView className="bg-white h-full flex justify-center items-center">
        <ActivityIndicator className="text-primary-300" size={"large"} />
      </SafeAreaView>
    );
  }

  if (!authState.authenticated) {
    return <Redirect href={"/sign-in"} />;
  }

  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
