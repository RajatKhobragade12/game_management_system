const { Game } = require("../models/game.model");
const { verifyToken } = require("../middleware/auth.middleware");
const { verifyRole } = require("../middleware/rbac.middleware");
const logger = require("../middleware/logging.middleware");
require('dotenv').config();


async function createGame(req, res) {
    try {
        const token = req.headers["token"];
        const { name, genre, releaseDate } = req.body;
        if (!name || !genre || !releaseDate) {
            logger.warn({
                message: "Missing fields",
                url: req.originalUrl,
                method: req.method,
                statusCode: 400
            });
            return res.status(400).send({ message: "Missing fields" })
        }
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
        if (role != "Admin") {
            logger.warn({
                message: "You are not authorized",
                url: req.originalUrl,
                method: req.method,
                statusCode: 403
            });
            return res.status(403).send({ message: "You are not authorized" })
        }
        let newGame = await Game.create({ name: name, genre: genre, releaseDate: releaseDate });
        logger.info({
            message: "Game created successfully",
            url: req.originalUrl,
            method: req.method,
            statusCode: 201
        });
        res.status(201).send({ message: "Game created successfully", data: newGame });

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


async function getAllGames(req, res) {
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

        let games = await Game.findAll();
        logger.info({
            message: "Game retrive successfully",
            url: req.originalUrl,
            method: req.method,
            statusCode: 200
        });
        res.status(200).send({ message: "Game retrive successfully", data: games });

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


async function getSingleGame(req, res) {
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
        const { id } = req.params;
        const game = await Game.findOne({ where: { id: id } });
        if (!game) {
            logger.warn({
                message: "Game not found",
                url: req.originalUrl,
                method: req.method,
                statusCode: 404
            });
            return res.status(404).send({ message: "Game not found" })
        }
        logger.info({
            message: "Game retrive successfully",
            url: req.originalUrl,
            method: req.method,
            statusCode: 200
        });
        res.status(200).send({ message: "Game retrive successfully", data: game })

    } catch (error) {
        logger.error({
            message: `Internal server error: ${error.message}`,
            url: req.originalUrl,
            method: req.method,
            statusCode: 500
        });
        res.status(500).send({ message: "Internal server error", error: error.message })
    }
}


async function updateGame(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            logger.warn({
                message: "Missing game id",
                url: req.originalUrl,
                method: req.method,
                statusCode: 400
            });
            return res.status(400).send({ message: "Missing game id" })
        }
        const { name, genre, releaseDate } = req.body;

        if (!name && !genre && !releaseDate) {
            logger.warn({
                message: "Missing fields",
                url: req.originalUrl,
                method: req.method,
                statusCode: 400
            });
            return res.status(400).send({ message: "Missing fields" })
        }

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
        if (role != "Admin") {
            logger.warn({
                message: "You are not authorized",
                url: req.originalUrl,
                method: req.method,
                statusCode: 403
            });
            return res.status(403).send({ message: "You are not authorized" })
        }
        let game = await Game.findOne({ where: { id: id } });

        if (!game) {
            logger.warn({
                message: "Game not found",
                url: req.originalUrl,
                method: req.method,
                statusCode: 404
            });
            return res.status(404).send({ message: "Game not found" });
        }
        if (name) {
            game.name = name
        }
        if (genre) {
            game.genre = genre
        }
        if (releaseDate) {
            game.releaseDate = releaseDate
        }
        await game.save();
        logger.info({
            message: "Game updated successfully",
            url: req.originalUrl,
            method: req.method,
            statusCode: 200
        });
        return res.status(200).send({ message: "Game updated successfully" });

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


async function deleteGame(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            logger.warn({
                message: "Missing game id",
                url: req.originalUrl,
                method: req.method,
                statusCode: 400
            });
            return res.status(400).send({ message: "Missing game id" })
        }

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
        if (role != "Admin") {
            logger.warn({
                message: "You are not authorized",
                url: req.originalUrl,
                method: req.method,
                statusCode: 403
            });
            return res.status(403).send({ message: "You are not authorized" })
        }
        let game = await Game.findOne({ where: { id: id } });
        if (!game) {
            logger.warn({
                message: "Game not found",
                url: req.originalUrl,
                method: req.method,
                statusCode: 404
            });
            return res.status(404).send({ message: "Game not found" });
        }
        await game.destroy({
            where: {
                id: id,
            },
        });
        logger.info({
            message: "Game deleted successfully",
            url: req.originalUrl,
            method: req.method,
            statusCode: 200
        });
        return res.status(200).send({ message: "Game deleted successfully" });
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
    createGame,
    getAllGames,
    updateGame,
    deleteGame,
    getSingleGame
}