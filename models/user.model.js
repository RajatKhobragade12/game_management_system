const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");
const logger = require("../middleware/logging.middleware");

const User = sequelize.define('user', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
    },
    role: {
        type: DataTypes.ENUM('Admin', 'Player'),
        defaultValue: 'Player'
    }
})
sequelize.sync().then(() => {
    logger.info({
        message: `User table created successfully.`,
        statusCode: 201
    })
}).catch((error) => {
    logger.error({
        message: `Error in creating user table:${error}`,
        statusCode: 500
    })
});
module.exports = { User };