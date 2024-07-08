const express = require('express');
require('dotenv').config();
const logger = require("./middleware/logging.middleware");
const { connection } = require("./config/db.config");
const userRoutes = require("./routes/user.routes");
const gameRoutes = require("./routes/game.routes");
const scoreRoutes = require("./routes/score.routes")
const errorHandler = require("./middleware/error.middleware");
const app = express();

app.use(express.json());

app.use("/users", userRoutes);
app.use("/games", gameRoutes);
app.use("/scores", scoreRoutes);

app.use(errorHandler)

app.all("*", (req, res) => {
    logger.error({
        message:"Route not found",
        url: req.originalUrl,
        method: req.method,
        statusCode: 404
    })
    res.status(404).send({ message: "Route not found" });
});
const port = process.env.PORT

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
    logger.info(`Server is running on port ${port}`)
})