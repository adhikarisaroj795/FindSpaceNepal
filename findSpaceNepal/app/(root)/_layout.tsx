import { Redirect, Slot } from "expo-router";
import { ActivityIndicator, SafeAreaView } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function AppLayout() {
  const { authState, initializeAuth } = useAuth();

  const [isInitialized, setIsinitialized] = useState(false);
  const loading = false;
  const isLogged = false;

  if (loading) {
    return (
      <SafeAreaView className="bg-white h-full flex justify-center items-center">
        <ActivityIndicator className="text-primary-300" size={"large"} />
      </SafeAreaView>
    );
  }

  if (!isLogged) {
    return <Redirect href={"/sign-in"} />;
  }

  return <Slot />;
}
