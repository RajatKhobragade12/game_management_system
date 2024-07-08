const express = require('express');
const router = express.Router();
const { addScore , getAllScoresByUser,getAllScoresByGame } = require("../controllers/score.controller")


router.post("/score", addScore);
router.get("/score/user/:userId", getAllScoresByUser);
router.get("/score/game/:gameId", getAllScoresByGame);

module.exports = router;