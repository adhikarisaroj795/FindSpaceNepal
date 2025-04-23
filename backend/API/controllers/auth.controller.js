const catchAsync = require("../utils/catchAsync");
const auth_svc = require("../services/auth.service");
const ErrorHandler = require("../utils/error.handler");

class AuthController {
  static signUp = catchAsync(async (req, res, next) => {
    const { fullName, email, password } = req.body;

    console.log("igothit");
    console.log(req.body);

    try {
      if (
        !email ||
        email.trim() === "" ||
        !password ||
        password.trim() === "" ||
        !fullName ||
        fullName.trim() === ""
      ) {
        throw new ErrorHandler("All fields are required", 400);
      }

      const newUser = await auth_svc.signUp(fullName, email, password);

      res.status(200).json({
        status: true,
        user: newUser,
        msg: "User created successfully",
      });
    } catch (err) {
      return next(err);
    }
  });
  static signIn = async (req, res, next) => {};
  static logOut = async (req, res, next) => {};
}
module.exports = AuthController;
