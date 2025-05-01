const userModel = require("../models/user.model");
const ErrorHandler = require("../utils/error.handler");

class AuthService {
  static signUp = async (fullName, email, password) => {
    try {
      const existingEmail = await userModel.findOne({
        email: email,
      });

      if (existingEmail) {
        throw new ErrorHandler("Email already exist", 409);
      }

      const newUser = new userModel({
        fullName,
        email,
        password,
      });

      console.log(newUser);

      await newUser.save();
      return newUser;
    } catch (error) {
      throw error;
    }
  };
  static SignIn = async (email, password) => {
    try {
      const ExistingUser = await userModel.findOne({
        email: email,
      });

      if (!ExistingUser) {
        throw new ErrorHandler("Invalid Credentials", 404);
      }

      const isPasswordMatched = await ExistingUser.comparePassword(password);
      if (!isPasswordMatched) {
        throw new ErrorHandler("Invalid Credentials", 401);
      }

      return ExistingUser;
    } catch (error) {
      throw error;
    }
  };
}
module.exports = AuthService;
