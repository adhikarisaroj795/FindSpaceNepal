import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { useGoogleAuth } from "@/lib/Oauth";
import Constants from "expo-constants";
import { Link } from "expo-router";

const SignUp = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  console.log(form);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  // Google auth
  const { googleClientIdWeb, googleClientIdAndroid, googleClientIdIos } =
    Constants.expoConfig?.extra || {};

  const clientIds = {
    webClientId: googleClientIdWeb || "",
    androidClientId: googleClientIdAndroid || "",
    iosClientId: googleClientIdIos || "",
  };

  const { loginWithGoogle, request, isLoading, error } =
    useGoogleAuth(clientIds);

  const handleSignUp = () => {
    // Handle signup logic here
    console.log("Signing up with:", form);
  };

  const handleGoogleSignUp = () => {
    if (!request) return;
    loginWithGoogle();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingVertical: 40,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <View className="items-center mb-8">
            <Image
              source={images.logo as ImageSourcePropType}
              className="w-35 h-32  mb-4"
              resizeMode="contain"
            />
            <Text className="text-2xl font-rubik-bold text-primary-500">
              Create Account
            </Text>
            <Text className="text-gray-600 font-rubik mt-2">
              Join FindSpaceNepal today
            </Text>
          </View>

          {/* Error Message */}
          {error && (
            <View className="bg-red-100 p-3 rounded-lg mb-4">
              <Text className="text-red-600 text-center font-rubik">
                {error.message}
              </Text>
            </View>
          )}

          {/* Full Name Input */}
          <View className="mb-4">
            <Text className="text-gray-700 font-rubik-medium mb-2">
              Full Name
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3">
              <Image
                source={icons.user as ImageSourcePropType}
                className="w-5 h-5 mr-2"
                resizeMode="contain"
              />
              <TextInput
                placeholder="Enter your full name"
                className="flex-1 font-rubik text-gray-800"
                value={form.fullName}
                onChangeText={(text) => setForm({ ...form, fullName: text })}
                autoCapitalize="words"
              />
            </View>
          </View>

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
                value={form.email}
                onChangeText={(text) => setForm({ ...form, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password Input */}
          <View className="mb-4">
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
                placeholder="Create password"
                className="flex-1 font-rubik text-gray-800"
                value={form.password}
                onChangeText={(text) => setForm({ ...form, password: text })}
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
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
          </View>

          {/* Confirm Password Input */}
          <View className="mb-6">
            <Text className="text-gray-700 font-rubik-medium mb-2">
              Confirm Password
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3">
              <Image
                source={icons.lock as ImageSourcePropType}
                className="w-5 h-5 mr-2"
                resizeMode="contain"
              />
              <TextInput
                placeholder="Confirm your password"
                className="flex-1 font-rubik text-gray-800"
                value={form.confirmPassword}
                onChangeText={(text) =>
                  setForm({ ...form, confirmPassword: text })
                }
                secureTextEntry={!isConfirmPasswordVisible}
              />
              <TouchableOpacity
                onPress={() =>
                  setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                }
              >
                <Image
                  source={
                    isConfirmPasswordVisible
                      ? (icons.eyeOff as ImageSourcePropType)
                      : (icons.eye as ImageSourcePropType)
                  }
                  className="w-5 h-5"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            onPress={handleSignUp}
            className="bg-white rounded-xl py-4 mb-4 items-center justify-center shadow-lg"
            activeOpacity={0.8}
          >
            <View className="flex-row justify-center items-center">
              <Text className="text-black-700 font-rubik-bold text-lg">
                {isLoading ? "Creating Account..." : "Sign Up"}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-500 font-rubik">OR</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Google Sign Up */}
          <TouchableOpacity
            onPress={handleGoogleSignUp}
            disabled={!request || isLoading}
            className={`flex-row items-center justify-center border border-gray-300 rounded-xl py-3 mb-6 ${
              isLoading ? "opacity-50" : ""
            }`}
            activeOpacity={0.8}
          >
            <Image
              source={icons.google as ImageSourcePropType}
              className="w-6 h-6 mr-2"
              resizeMode="contain"
            />
            <Text className="text-gray-700 font-rubik-medium">
              Continue with Google
            </Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View className="flex-row justify-center">
            <Text className="text-gray-600 font-rubik">
              Already have an account?{" "}
            </Text>
            <Link href={"/sign-in"} asChild>
              <TouchableOpacity>
                <Text className="text-primary-500 font-rubik-bold">Login</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
