const express = require('express');
const router = express.Router()
const { createGame, getAllGames, updateGame, deleteGame } = require('../controllers/game.controller');


router.post("/game", createGame);
router.get("/game", getAllGames);
router.put("/game/:id", updateGame);
router.delete("/game/:id", deleteGame);


module.exports = router;