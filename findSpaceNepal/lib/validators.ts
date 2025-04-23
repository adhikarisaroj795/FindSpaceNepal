/**
 * Validates an email address
 * @param email - The email to validate
 * @returns boolean - True if valid, false otherwise
 */
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validates a password against complexity requirements
 * @param password - The password to validate
 * @returns { isValid: boolean; message?: string; requirements: PasswordRequirements }
 */
export const validatePassword = (password: string) => {
  const requirements = {
    hasMinLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[^A-Za-z0-9]/.test(password),
  };

  const isValid = Object.values(requirements).every(Boolean);

  let message = "";
  if (!isValid) {
    const missingRequirements = [];
    if (!requirements.hasMinLength)
      missingRequirements.push("at least 8 characters");
    if (!requirements.hasUpperCase)
      missingRequirements.push("one uppercase letter");
    if (!requirements.hasLowerCase)
      missingRequirements.push("one lowercase letter");
    if (!requirements.hasNumber) missingRequirements.push("one number");
    if (!requirements.hasSpecialChar)
      missingRequirements.push("one special character");

    message = `Password must contain ${missingRequirements.join(", ")}`;
  }

  return {
    isValid,
    message: isValid ? undefined : message,
    requirements,
  };
};

/**
 * Validates a full name (allows letters, spaces, and common name characters)
 * @param name - The name to validate
 * @returns boolean - True if valid, false otherwise
 */
export const validateFullName = (name: string): boolean => {
  const re = /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/;
  return re.test(name.trim());
};

/**
 * Validates that two passwords match
 * @param password - The first password
 * @param confirmPassword - The confirmation password
 * @returns boolean - True if they match, false otherwise
 */
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): boolean => {
  return password === confirmPassword;
};

/**
 * Validates a form field based on its type
 * @param field - The field name
 * @param value - The field value
 * @param form - The complete form state (for cross-field validation)
 * @returns { isValid: boolean; message?: string }
 */
export const validateFormField = (
  field: string,
  value: string,
  form?: Record<string, string>
): { isValid: boolean; message?: string } => {
  if (!value.trim()) {
    return { isValid: false, message: "This field is required" };
  }

  switch (field) {
    case "email":
      return {
        isValid: validateEmail(value),
        message: "Please enter a valid email address",
      };
    case "password":
      const passwordValidation = validatePassword(value);
      return {
        isValid: passwordValidation.isValid,
        message: passwordValidation.message,
      };
    case "confirmPassword":
      return {
        isValid: form?.password === value,
        message: "Passwords don't match",
      };
    case "fullName":
      return {
        isValid: validateFullName(value),
        message: "Please enter a valid name",
      };
    default:
      return { isValid: true };
  }
};

// Type definitions
interface PasswordRequirements {
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export type { PasswordRequirements };
