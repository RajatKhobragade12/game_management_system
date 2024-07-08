const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");
const logger = require("../middleware/logging.middleware");
const Game = sequelize.define("game", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
    },
    genre: {
        type: DataTypes.STRING,
    },
    releaseDate: {
        type: DataTypes.DATE,

    },
}, {
    timestamps: true,
});
sequelize.sync().then(() => {
    logger.info({
        message: `Game table created successfully.`,
        statusCode: 201
    })

}).catch((error) => {
    logger.error({
        message: `Error in creating game table:${error}`,
        statusCode: 500
    })

});
module.exports = { Game };