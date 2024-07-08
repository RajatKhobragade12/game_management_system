const { User } = require('../models/user.model');
const { Score } = require("../models/score.model");
const { Game } = require("../models/game.model");
const logger = require("../middleware/logging.middleware");
const { verifyToken } = require("../middleware/auth.middleware");
const { verifyRole } = require("../middleware/rbac.middleware");

async function addScore(req, res) {
    try {
        const token = req.headers["token"];
        if (!token) {
            logger.warn({
                message: "Missing token",
                url: req.originalUrl,
                method: req.method,
                statusCode: 400
            });
            return res.status(400).send({ message: "Missing token" })
        }

        let email;
        try {
            email = await verifyToken(token)

        } catch (error) {
            logger.error({
                message: error.message,
                url: req.originalUrl,
                method: req.method,
                statusCode: 401
            });
            return res.status(401).send({ message: error.message })
        }

        let role;
        try {
            role = await verifyRole(email);
        } catch (error) {
            logger.error({
                message: error.message,
                url: req.originalUrl,
                method: req.method,
                statusCode: 403
            });
            return res.status(403).send({ message: error.message })
        }
        if (role != "Player") {
            logger.warn({
                message: "You are not authorized",
                url: req.originalUrl,
                method: req.method,
                statusCode: 403
            });
            return res.status(403).send({ message: "You are not authorized" })
        }
        const { score, userId, gameId } = req.body;
        if (!score || !userId || !gameId) {
            logger.warn({
                message: "Missing fields",
                url: req.originalUrl,
                method: req.method,
                statusCode: 400
            });
            return res.status(400).send({ message: "Missing fields" })
        }
        let user = await User.findOne({ where: { id: userId } });
        let game = await Game.findOne({ where: { id: gameId } });
        if (!user) {
            logger.warn({
                message:  "User not found" ,
                url: req.originalUrl,
                method: req.method,
                statusCode: 404
            });
            return res.status(404).send({ message: "User not found" })
        }
        if (!game) {
            logger.warn({
                message:  "Game not found" ,
                url: req.originalUrl,
                method: req.method,
                statusCode: 404
            });
            return res.status(404).send({ message: "Game not found" })
        }
        const newScore = await Score.create({ score: score, userId: userId, gameId: gameId });
        logger.info({
            message:  "Score added successfully" ,
            url: req.originalUrl,
            method: req.method,
            statusCode: 201
        });
        return res.status(201).send({ message: "Score added successfully", score: newScore })
    } catch (error) {
        logger.error({
            message: `Internal server error: ${error.message}`,
            url: req.originalUrl,
            method: req.method,
            statusCode: 500
        });
        return res.status(500).send({ message: "Internal server error", error: error.message })
    }
}


async function getAllScoresByUser(req, res) {
    try {

        const { userId } = req.params;
        const token = req.headers["token"];
        if (!token) {
            logger.warn({
                message: "Missing token",
                url: req.originalUrl,
                method: req.method,
                statusCode: 400
            });
            return res.status(400).send({ message: "Missing token" })
        }
        let exsistingUser = await User.findOne({ where: { id: userId } });

        if (!exsistingUser) {
            logger.warn({
                message: "User not found",
                url: req.originalUrl,
                method: req.method,
                statusCode: 404
            });
            return res.status(404).send({ message: "User not found" })
        }

        let email;
        try {
            email = await verifyToken(token)

        } catch (error) {
            logger.error({
                message:  error.message,
                url: req.originalUrl,
                method: req.method,
                statusCode: 401
            });
            return res.status(401).send({ message: error.message })
        }
        let score = await Score.findAll({ where: { userId: userId } })
        logger.info({
            message:  "Score retrived successfully",
            url: req.originalUrl,
            method: req.method,
            statusCode: 200
        });
        return res.status(200).send({ message: "Score retrived successfully", data: score })
    } catch (error) {
        logger.error({
            message: `Internal server error ${error.message}`,
            url: req.originalUrl,
            method: req.method,
            statusCode: 500
        });
        return res.status(500).send({ message: "Internal server error", error: error.message })
    }

}


async function getAllScoresByGame(req, res) {
    try {
        const { gameId } = req.params;
        const token = req.headers["token"];
        if (!token) {
            logger.warn({
                message: "Missing token",
                url: req.originalUrl,
                method: req.method,
                statusCode: 400
            });
            return res.status(400).send({ message: "Missing token" })
        }

        let exsistingGame = await Game.findOne({ where: { id: gameId } });

        if (!exsistingGame) {
            logger.warn({
                message: "Game not found",
                url: req.originalUrl,
                method: req.method,
                statusCode: 404
            });
            return res.status(404).send({ message: "Game not found" })
        }

        let email;
        try {
            email = await verifyToken(token)

        } catch (error) {
            logger.error({
                message: error.message,
                url: req.originalUrl,
                method: req.method,
                statusCode: 401
            });
            return res.status(401).send({ message: error.message })
        }
        let score = await Score.findAll({ where: { gameId: gameId } })
        logger.info({
            message: "Score retrived successfully",
            url: req.originalUrl,
            method: req.method,
            statusCode: 200
        });
        return res.status(200).send({ message: "Score retrived successfully", data: score })
    } catch (error) {
        logger.error({
            message: `Internal server error ${error.message}`,
            url: req.originalUrl,
            method: req.method,
            statusCode: 500
        });
        return res.status(500).send({ message: "Internal server error", error: error.message })
    }

}


module.exports = {
    addScore,
    getAllScoresByUser,
    getAllScoresByGame
}
