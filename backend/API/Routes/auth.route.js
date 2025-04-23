const express = require("express");
const auth_ctrl = require("../controllers/auth.controller");

const router = express.Router();

router.route("/sign-in").post(auth_ctrl.signIn);
router.route("/sign-up").post(auth_ctrl.signUp);

module.exports = router;
