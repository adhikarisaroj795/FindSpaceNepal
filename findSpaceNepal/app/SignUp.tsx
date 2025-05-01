import React, { useState, useCallback } from "react";
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
  ActivityIndicator,
  Alert,
} from "react-native";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { useGoogleAuth } from "@/lib/Oauth";
import Constants from "expo-constants";
import { router } from "expo-router";
import { signUpRoute } from "../lib/APIRoutes";
import { validateEmail, validatePassword } from "@/lib/validators";

// Type definitions
type FormField = "fullName" | "email" | "password" | "confirmPassword";

interface FormState {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FieldError {
  field: FormField;
  message: string;
}

interface ApiError extends Error {
  response?: {
    status: number;
    data: {
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
}

const SignUp = () => {
  // Form state
  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // UI state
  const [fieldErrors, setFieldErrors] = useState<FieldError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  // Google Auth configuration
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
    isLoading: googleLoading,
  } = useGoogleAuth(clientIds);

  // Field validation
  const validateField = useCallback(
    (field: FormField, value: string): boolean => {
      const errors = fieldErrors.filter((err) => err.field !== field);
      let isValid = true;

      if (!value.trim()) {
        errors.push({ field, message: "This field is required" });
        isValid = false;
      } else {
        switch (field) {
          case "email":
            if (!validateEmail(value)) {
              errors.push({ field, message: "Please enter a valid email" });
              isValid = false;
            }
            break;
          case "password":
            const passwordValidation = validatePassword(value);
            if (!passwordValidation.isValid) {
              errors.push({ field, message: passwordValidation.message });
              isValid = false;
            }
            break;
          case "confirmPassword":
            if (value !== form.password) {
              errors.push({ field, message: "Passwords don't match" });
              isValid = false;
            }
            break;
        }
      }

      setFieldErrors(errors);
      return isValid;
    },
    [fieldErrors, form.password]
  );

  // Form validation
  const validateForm = useCallback((): boolean => {
    let isValid = true;
    const fields: FormField[] = [
      "fullName",
      "email",
      "password",
      "confirmPassword",
    ];

    fields.forEach((field) => {
      if (!validateField(field, form[field])) {
        isValid = false;
      }
    });

    return isValid;
  }, [form, validateField]);

  // Handle form field changes
  const handleChange = useCallback(
    (field: FormField, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));

      // Validate field if it has an error
      if (fieldErrors.some((err) => err.field === field)) {
        validateField(field, value);
      }
    },
    [fieldErrors, validateField]
  );

  // Handle form submission
  const handleSignUp = useCallback(async () => {
    if (isSubmitting) return;
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(signUpRoute, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();
      console.log(data, "imdata");

      if (!response.ok) {
        throw {
          message: data.msg || "Registration failed",
          response: {
            status: response.status,
            data,
          },
        };
      }

      // Success - navigate to sign in with success message
      router.push({
        pathname: "/sign-in",
        params: { registrationSuccess: "true" },
      });
    } catch (err) {
      const error = err as ApiError;

      let errorMessage = "An error occurred during registration";

      if (error.message) {
        if (error.message.includes("Network request failed")) {
          errorMessage =
            "Cannot connect to server. Check your internet connection.";
        } else if (error.message.includes("Failed to fetch")) {
          errorMessage = "Server unavailable. Please try again later.";
        } else {
          errorMessage = error.message;
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle field-specific errors from API
        const apiErrors = error.response.data.errors;
        const newFieldErrors: FieldError[] = [];

        Object.entries(apiErrors).forEach(([field, messages]) => {
          if (messages.length > 0) {
            newFieldErrors.push({
              field: field as FormField,
              message: messages[0],
            });
          }
        });

        setFieldErrors(newFieldErrors);
        errorMessage = "Please fix the errors in the form";
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [form, isSubmitting, validateForm]);

  // Handle Google sign up
  const handleGoogleSignUp = useCallback(async () => {
    if (!request || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await loginWithGoogle();
    } catch (err) {
      Alert.alert("Error", "Google sign up failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [loginWithGoogle, request, isSubmitting]);

  // Get error for a specific field
  const getFieldError = useCallback(
    (field: FormField): string | undefined => {
      return fieldErrors.find((err) => err.field === field)?.message;
    },
    [fieldErrors]
  );

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
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View className="items-center mb-8">
            <Image
              source={images.logo}
              className="w-35 h-32 mb-4"
              resizeMode="contain"
              accessibilityLabel="App Logo"
            />
            <Text className="text-2xl font-rubik-bold text-primary-500">
              Create Account
            </Text>
            <Text className="text-gray-600 font-rubik mt-2">
              Join FindSpaceNepal today
            </Text>
          </View>

          {/* Full Name Input */}
          <View className="mb-4">
            <Text className="text-gray-700 font-rubik-medium mb-2">
              Full Name
            </Text>
            <View
              className={`flex-row items-center border rounded-xl px-4 py-3 ${
                getFieldError("fullName")
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
            >
              <Image
                source={icons.person}
                className="w-5 h-5 mr-2"
                resizeMode="contain"
                accessibilityIgnoresInvertColors
              />
              <TextInput
                placeholder="Enter your full name"
                className="flex-1 font-rubik text-gray-800"
                value={form.fullName}
                onChangeText={(text) => handleChange("fullName", text)}
                onBlur={() => validateField("fullName", form.fullName)}
                autoCapitalize="words"
                maxLength={50}
                accessibilityLabel="Full Name Input"
                accessibilityHint="Enter your full name"
              />
            </View>
            {getFieldError("fullName") && (
              <Text className="text-red-500 text-xs mt-1 font-rubik">
                {getFieldError("fullName")}
              </Text>
            )}
          </View>

          {/* Email Input */}
          <View className="mb-4">
            <Text className="text-gray-700 font-rubik-medium mb-2">Email</Text>
            <View
              className={`flex-row items-center border rounded-xl px-4 py-3 ${
                getFieldError("email")
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
            >
              <Image
                source={icons.email}
                className="w-5 h-5 mr-2"
                resizeMode="contain"
                accessibilityIgnoresInvertColors
              />
              <TextInput
                placeholder="Enter your email"
                className="flex-1 font-rubik text-gray-800"
                value={form.email}
                onChangeText={(text) => handleChange("email", text)}
                onBlur={() => validateField("email", form.email)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
                accessibilityLabel="Email Input"
                accessibilityHint="Enter your email address"
              />
            </View>
            {getFieldError("email") && (
              <Text className="text-red-500 text-xs mt-1 font-rubik">
                {getFieldError("email")}
              </Text>
            )}
          </View>

          {/* Password Input */}
          <View className="mb-4">
            <Text className="text-gray-700 font-rubik-medium mb-2">
              Password
            </Text>
            <View
              className={`flex-row items-center border rounded-xl px-4 py-3 ${
                getFieldError("password")
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
            >
              <Image
                source={icons.lock}
                className="w-5 h-5 mr-2"
                resizeMode="contain"
                accessibilityIgnoresInvertColors
              />
              <TextInput
                placeholder="(min 8 characters)"
                className="flex-1 font-rubik text-gray-800"
                value={form.password}
                onChangeText={(text) => handleChange("password", text)}
                onBlur={() => validateField("password", form.password)}
                secureTextEntry={!isPasswordVisible}
                textContentType="newPassword"
                accessibilityLabel="Password Input"
                accessibilityHint="Create a password with at least 8 characters"
              />
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                accessibilityLabel={
                  isPasswordVisible ? "Hide password" : "Show password"
                }
              >
                <Image
                  source={isPasswordVisible ? icons.eyeOff : icons.eye}
                  className="w-5 h-5"
                  resizeMode="contain"
                  accessibilityIgnoresInvertColors
                />
              </TouchableOpacity>
            </View>
            {getFieldError("password") && (
              <Text className="text-red-500 text-xs mt-1 font-rubik">
                {getFieldError("password")}
              </Text>
            )}
          </View>

          {/* Confirm Password Input */}
          <View className="mb-6">
            <Text className="text-gray-700 font-rubik-medium mb-2">
              Confirm Password
            </Text>
            <View
              className={`flex-row items-center border rounded-xl px-4 py-3 ${
                getFieldError("confirmPassword")
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
            >
              <Image
                source={icons.lock}
                className="w-5 h-5 mr-2"
                resizeMode="contain"
                accessibilityIgnoresInvertColors
              />
              <TextInput
                placeholder="Confirm your password"
                className="flex-1 font-rubik text-gray-800"
                value={form.confirmPassword}
                onChangeText={(text) => handleChange("confirmPassword", text)}
                onBlur={() =>
                  validateField("confirmPassword", form.confirmPassword)
                }
                secureTextEntry={!isConfirmPasswordVisible}
                textContentType="newPassword"
                onSubmitEditing={handleSignUp}
                accessibilityLabel="Confirm Password Input"
                accessibilityHint="Re-enter your password"
              />
              <TouchableOpacity
                onPress={() =>
                  setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                }
                accessibilityLabel={
                  isConfirmPasswordVisible ? "Hide password" : "Show password"
                }
              >
                <Image
                  source={isConfirmPasswordVisible ? icons.eyeOff : icons.eye}
                  className="w-5 h-5"
                  resizeMode="contain"
                  accessibilityIgnoresInvertColors
                />
              </TouchableOpacity>
            </View>
            {getFieldError("confirmPassword") && (
              <Text className="text-red-500 text-xs mt-1 font-rubik">
                {getFieldError("confirmPassword")}
              </Text>
            )}
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            onPress={handleSignUp}
            disabled={isSubmitting}
            className={`bg-white rounded-xl py-4 mb-4 items-center border border-gray-300 justify-center ${
              isSubmitting ? "opacity-70" : ""
            }`}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Sign Up"
            accessibilityState={{ disabled: isSubmitting }}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-black-700 font-rubik-bold text-lg">
                Sign up
              </Text>
            )}
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
            disabled={!request || isSubmitting}
            className={`flex-row items-center  justify-center border border-gray-300 rounded-xl py-3 mb-6 ${
              isSubmitting ? "opacity-50" : ""
            }`}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Continue with Google"
            accessibilityState={{ disabled: !request || isSubmitting }}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#64748b" />
            ) : (
              <>
                <Image
                  source={icons.google}
                  className="w-6 h-6 mr-2"
                  resizeMode="contain"
                  accessibilityIgnoresInvertColors
                />
                <Text className="text-gray-700 font-rubik-medium">
                  Continue with Google
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View className="flex-row justify-center">
            <Text className="text-gray-600 font-rubik">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Login"
            >
              <Text className="text-primary-500 font-rubik-bold">Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
