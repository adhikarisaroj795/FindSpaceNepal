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
}
module.exports = AuthService;
