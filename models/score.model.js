const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");
const { User } = require("../models/user.model");
const { Game } = require("../models/game.model");
const logger = require("../middleware/logging.middleware");

const Score = sequelize.define('score', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,


    },
    score: {
        type: DataTypes.INTEGER
    },
}, {
    timestamps: true,
    updatedAt: false,
})

User.hasMany(Score);
Score.belongsTo(User);

Game.hasMany(Score);
Score.belongsTo(Game, {
    constraints: true,
    onDelete: 'CASCADE'
});

sequelize.sync().then(() => {
    logger.info({
        message: `Score table created successfully.`,
        statusCode: 201
    })
}).catch((error) => {
    logger.error({
        message: `Error in creating score table:${error}`,
        statusCode: 500
    })
});
module.exports = { Score };