const express = require("express");
const auth_ctrl = require("../controllers/auth.controller");

const router = express.Router();

router.route("/sign-in").post(auth_ctrl.signIn);

module.exports = router;
