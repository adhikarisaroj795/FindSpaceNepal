const sendToken = (user, statusCode, res, message) => {
  const token = user.getJwtToken();

  const cookieExpireTimeInDays = parseInt(process.env.COOKIE_EXPIRE_TIME, 10);
  const cookieExpireTimeInMilis = cookieExpireTimeInDays * 24 * 60 * 60 * 1000;
  const expireDate = new Date(Date.now() + cookieExpireTimeInMiliS);

  const isProduction = process.env.NODE_ENV === "production";

  const options = {
    expires: expireDate,
    httpOnly: true,
    samSite: "Lax",
    secure: isProduction,
  };

  const { password, ...rest } = user._doc;
  res.status(statusCode).cookie("token", token, options).json({
    staus: true,
    token,
    user: rest,
    msg: message,
  });
};

module.exports = sendToken;
