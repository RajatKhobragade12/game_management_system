const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss"
        }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/activity/activity.log' }),
        new winston.transports.File({ filename: 'logs/error/error.log', level: 'error' }),
    ],
});


module.exports = logger;
