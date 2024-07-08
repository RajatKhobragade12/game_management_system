const logger = require("../middleware/logging.middleware");

function errorHandler(err, req, res, next) {
    logger.error({
        message: err.message,
        stack: err.stack,
        statusCode:500
    })
    res.status(500).send({
        status: 500,
        message: err.message || 'Internal Server Error'
    });
}

module.exports = errorHandler;