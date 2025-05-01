import React, { useCallback, useState, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  Platform,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
} from "react-native";
import images from "@/constants/images";
import icons from "@/constants/icons";
import { useGoogleAuth } from "@/lib/Oauth";
import Constants from "expo-constants";
import { Link, router } from "expo-router";
import { signInRoute } from "../lib/APIRoutes";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "@/context/AuthContext";

const SignIn = () => {
  // Refs
  const passwordInputRef = useRef<TextInput>(null);

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  console.log(email, password, "from signIn");

  // Auth context
  const { setAuthState } = useAuth();

  // Google auth configuration
  const { googleClientIdWeb, googleClientIdAndroid, googleClientIdIos } =
    Constants.expoConfig?.extra || {};

  const clientIds = {
    webClientId: googleClientIdWeb || "",
    androidClientId: googleClientIdAndroid || "",
    iosClientId: googleClientIdIos || "",
  };

  const {
    loginWithGoogle,
    request,
    isLoading: isGoogleLoading,
    error,
  } = useGoogleAuth(clientIds);

  // Form validation
  const validateForm = useCallback(() => {
    if (!email.trim()) {
      setApiError("Email is required");
      return false;
    }
    if (!email.includes("@") || !email.includes(".")) {
      setApiError("Please enter a valid email");
      return false;
    }
    if (!password) {
      setApiError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setApiError("Password must be at least 6 characters");
      return false;
    }
    return true;
  }, [email, password]);

  // Handle email/password login
  const handleEmailLogin = useCallback(async () => {
    if (!validateForm()) return;
    if (isLoading) return;

    try {
      setApiError(null);
      setIsLoading(true);

      const response = await fetch(signInRoute, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password,
        }),
      });

      const data = await response.json();

      console.log(response, "imres");

      if (!response.ok) {
        throw {
          message: data.msg || "Login failed",
          response: {
            status: response.status,
            data,
          },
        };
      }

      if (data.token && data.user) {
        // Store token securely
        await SecureStore.setItemAsync("auth_token", data.token);

        // Update auth context
        setAuthState({
          token: data.token,
          authenticated: true,
          user: data.user,
        });

        // Navigate to home screenarrrr
        Alert.alert("success login");

        router.replace("/");
      } else {
        throw new Error("Authentication data missing in response");
      }
    } catch (error: any) {
      console.log(error);
      let errorMessage = "Login failed. Please try again.";

      if (error.message) {
        if (error.message.includes("Network request failed")) {
          errorMessage =
            "Cannot connect to server. Check your internet connection.";
        } else if (error.response?.status === 401) {
          errorMessage = "Invalid email or password";
        } else if (error.response?.status === 429) {
          errorMessage = "Too many attempts. Please try again later.";
        } else {
          errorMessage = error.message;
        }
      }

      setApiError(errorMessage);
      Alert.alert("Login Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [email, password, validateForm, isLoading, setAuthState]);

  // Handle Google login
  const handleGoogleLogin = useCallback(() => {
    if (!request) {
      Alert.alert("Error", "Google login is not available");
      return;
    }
    loginWithGoogle();
  }, [request, loginWithGoogle]);

  // Focus management
  const focusPasswordInput = useCallback(() => {
    passwordInputRef.current?.focus();
  }, []);

  // Toggle password visibility
  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible((prev) => !prev);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo and Welcome Section */}
          <View className="items-center mb-8">
            <Image
              source={images.logo as ImageSourcePropType}
              className="w-35 h-32 mb-4"
              resizeMode="contain"
            />
            <Text className="text-2xl font-rubik-bold text-primary-500">
              Welcome Back
            </Text>
            <Text className="text-gray-600 font-rubik mt-2">
              Login to your FindSpaceNepal account
            </Text>
          </View>

          {/* Error Message */}
          {apiError && (
            <View className="bg-red-100 p-3 rounded-lg mb-4">
              <Text className="text-red-600 text-center font-rubik">
                {apiError}
              </Text>
            </View>
          )}

          {/* Email Input */}
          <View className="mb-4">
            <Text className="text-gray-700 font-rubik-medium mb-2">Email</Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3">
              <Image
                source={icons.email as ImageSourcePropType}
                className="w-5 h-5 mr-2"
                resizeMode="contain"
              />
              <TextInput
                placeholder="Enter your email"
                className="flex-1 font-rubik text-gray-800"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={focusPasswordInput}
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Password Input */}
          <View className="mb-6">
            <Text className="text-gray-700 font-rubik-medium mb-2">
              Password
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3">
              <Image
                source={icons.lock as ImageSourcePropType}
                className="w-5 h-5 mr-2"
                resizeMode="contain"
              />
              <TextInput
                ref={passwordInputRef}
                placeholder="Enter your password"
                className="flex-1 font-rubik text-gray-800"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
                returnKeyType="done"
                onSubmitEditing={handleEmailLogin}
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={togglePasswordVisibility}
                disabled={isLoading}
              >
                <Image
                  source={
                    isPasswordVisible
                      ? (icons.eyeOff as ImageSourcePropType)
                      : (icons.eye as ImageSourcePropType)
                  }
                  className="w-5 h-5"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity className="self-end mt-2" disabled={isLoading}>
              <Text className="text-primary-500 font-rubik-medium">
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleEmailLogin}
            className="flex flex-row bg-white rounded-xl py-4 mb-4 items-center justify-center shadow-lg border border-gray-300"
            activeOpacity={0.8}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#000000" />
            ) : (
              <Text className="text-black-700 font-rubik-bold text-lg">
                Sign In
              </Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-500 font-rubik">OR</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Google Login */}
          <TouchableOpacity
            onPress={handleGoogleLogin}
            disabled={!request || isGoogleLoading}
            className={`flex-row items-center justify-center border border-gray-300 rounded-xl py-3 mb-6 ${
              isGoogleLoading ? "opacity-50" : ""
            }`}
            activeOpacity={0.8}
          >
            {isGoogleLoading ? (
              <ActivityIndicator
                size="small"
                color="#000000"
                className="mr-2"
              />
            ) : (
              <Image
                source={icons.google as ImageSourcePropType}
                className="w-6 h-6 mr-2"
                resizeMode="contain"
              />
            )}
            <Text className="text-gray-700 font-rubik-medium">
              Continue with Google
            </Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View className="flex-row justify-center">
            <Text className="text-gray-600 font-rubik">
              Don't have an account?{" "}
            </Text>
            <Link href={"/SignUp"} asChild>
              <TouchableOpacity disabled={isLoading}>
                <Text className="text-primary-500 font-rubik-bold">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: "center",
  },
});

export default SignIn;
