const sendToken = (user, statusCode, res, message) => {
  const token = user.getJwtToken();

  const { password, ...rest } = user._doc;
  res.status(statusCode).json({
    staus: true,
    token,
    user: rest,
    msg: message,
  });
};

module.exports = sendToken;
