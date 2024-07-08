const jwt = require('jsonwebtoken');
const { User } = require("../models/user.model");
const { verifyToken } = require("../middleware/auth.middleware");
const logger = require("../middleware/logging.middleware");
require('dotenv').config();

async function register(req, res) {
    try {
        let { username, email, password, role } = req.body;
        if (!email || !username || !password || !role) {
            logger.warn({
                message: "Missing fields",
                url: req.originalUrl,
                method: req.method,
                statusCode: 400
            });
            return res.status(400).send({ message: "Missing fields" })
        }
        if (role != "Admin" && role != "Player") {
            logger.warn({
                message: "Please fill correct role Admin or Player",
                url: req.originalUrl,
                method: req.method,
                statusCode: 400
            });
            return res.status(400).send({ message: `Please fill correct role Admin or Player` })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            logger.warn({
                message: "Invalid email format",
                url: req.originalUrl,
                method: req.method,
                statusCode: 400
            });
            return res.status(400).send({ message: "Invalid email format" });
        }
        let exsistingUser = await User.findOne({ where: { email: email } });

        if (exsistingUser) {
            logger.warn({
                message: "Email already registerd",
                url: req.originalUrl,
                method: req.method,
                statusCode: 400
            });
            return res.status(400).send({ message: "Email already registerd" })
        }
        let users = await User.create({ email: email, username: username, password: password, role: role });
        logger.info({
            message: "User created successfully",
            url: req.originalUrl,
            method: req.method,
            statusCode: 201
        });
        return res.status(201).send({ message: "User created successfully", data: users })

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


async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            logger.warn({
                message: "Missing fields",
                url: req.originalUrl,
                method: req.method,
                statusCode: 400
            });
            return res.status(400).send({ message: "Missing fields" })
        }
        let exsistingUser = await User.findOne({ where: { email: email } });

        if (!exsistingUser) {
            logger.warn({
                message: "User not found",
                url: req.originalUrl,
                method: req.method,
                statusCode: 404
            });
            return res.status(404).send({ message: "User not found" })
        }
        if (exsistingUser.email !== email || exsistingUser.password != password) {
            logger.warn({
                message: "Incorrect email or password",
                url: req.originalUrl,
                method: req.method,
                statusCode: 400
            });
            return res.status(400).send({ message: "Incorrect email or password" })
        }
        let token = jwt.sign({ email: email }, process.env.SECRET)
        logger.info({
            message: "User login successfully",
            url: req.originalUrl,
            method: req.method,
            statusCode: 200
        });
        res.status(200).send({ message: "User login successfully", token: token })

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


async function getUserProfile(req, res) {
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

        let user = await User.findOne({ where: { email: email } });

        if (!user) {
            logger.warn({
                message: "User not found",
                url: req.originalUrl,
                method: req.method,
                statusCode: 404
            });
            return res.status(404).send({ message: "User not found" })
        }

        logger.info({
            message: "User retrive successfully",
            url: req.originalUrl,
            method: req.method,
            statusCode: 200
        });
        res.status(200).send({ message: "User retrive successfully", data: user })
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





module.exports = {
    register,
    login,
    getUserProfile
};