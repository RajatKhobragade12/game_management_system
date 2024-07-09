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
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    gameId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Game,
            key: 'id'
        }
    }
}, {
    timestamps: true,
    updatedAt: false,
})

User.hasMany(Score,{foreignKey: 'userId', onDelete: 'CASCADE'});
Score.belongsTo(User,{foreignKey: 'userId'});

Game.hasMany(Score, {foreignKey: 'gameId', onDelete: 'CASCADE'});
Score.belongsTo(Game, {
  foreignKey: 'gameId'
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