const express = require('express');
const router = express.Router();
const { register , login , getUserProfile} = require("../controllers/user.controller");

router.post("/register",register);
router.post("/login",login);
router.get("/profile",getUserProfile);


module.exports = router