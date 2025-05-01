const catchAsync = require("../utils/catchAsync");
const auth_svc = require("../services/auth.service");
const ErrorHandler = require("../utils/error.handler");
const sendToken = require("../utils/jwToken");

class AuthController {
  static signUp = catchAsync(async (req, res, next) => {
    const { fullName, email, password } = req.body;

    console.log("igothit");
    console.log(req.body, "imrequest");

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

      console.log(newUser, "ctrl");

      res.status(200).json({
        status: true,
        user: newUser,
        msg: "User created successfully",
      });
    } catch (err) {
      return next(err);
    }
  });
  static signIn = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    console.log(req.body, "igot hirt");

    if (!email || email.trim() === "" || !password || password.trim() === "") {
      return next(new ErrorHandler("All Fields are required", 400));
    }

    try {
      const user = await auth_svc.SignIn(email, password);

      const message = "User LoggedIn Success";
      sendToken(user, 200, res, message);
    } catch (error) {
      next(error);
    }
  });
  static logOut = async (req, res, next) => {};
}
module.exports = AuthController;
