const { Sequelize } = require('sequelize');
const logger = require("../middleware/logging.middleware");
require('dotenv').config();

const database = process.env.DB;
const username = process.env.USER;
const password = process.env.PASSWORD;
const host = process.env.HOST;

const sequelize = new Sequelize( database,username,password, {
    host: host,
    dialect: 'postgres',
    logging: false,

});
const connection = async () => {
    try {
        await sequelize.authenticate();
        logger.info({
            message: `Connection has been established successfully`,
            statusCode: 200
        });
    } catch (error) {
        logger.error({
            message: `Unable to connect to the database: error:${error.message}`,
            statusCode: 500
        });
    }


}

connection()

module.exports = sequelize;
