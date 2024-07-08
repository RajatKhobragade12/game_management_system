const { addScore, getAllScoresByGame, getAllScoresByUser } = require("../controllers/score.controller");
const { Game } = require("../models/game.model");
const { Score } = require("../models/score.model");
const { User } = require("../models/user.model");
const { verifyRole } = require("../middleware/rbac.middleware");
const { verifyToken } = require('../middleware/auth.middleware');

jest.mock('../middleware/auth.middleware');
jest.mock('../middleware/rbac.middleware');
jest.mock("../models/user.model")
jest.mock("../models/game.model")
jest.mock("../models/score.model")

User.hasMany = jest.fn();
Score.belongsTo = jest.fn();
Game.hasMany = jest.fn();
Score.belongsTo = jest.fn();

describe('Add score', () => {
    let req, res;
    beforeEach(() => {
        req = {
            params: { id: 1 },
            body: { score: 10, userId: 1, gameId: 1 },
            headers: { token: "valid-token" },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
    });

    it('should send status code 400 when token is missing', async () => {
        const reqWithoutToken = {
            body: { score: 10, userId: 1, gameId: 1 },
            headers: {},
        };

        await addScore(reqWithoutToken, res)
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            message: "Missing token"
        });

    })

    it('should send status code 403 when user is not authorized', async () => {
        verifyToken.mockResolvedValueOnce("test@gmail.com");
        verifyRole.mockResolvedValueOnce("Admin");
        await addScore(req, res);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith({ message: "You are not authorized" });
    });

    it('should send status code 201 when score is added successfully', async () => {
        const scoreMock = { score: 10, userId: 1, gameId: 1 };
        verifyToken.mockResolvedValueOnce("test@gmail.com");
        verifyRole.mockResolvedValueOnce("Player");
        User.findOne.mockResolvedValueOnce({});
        Game.findOne.mockResolvedValueOnce({});
        Score.create.mockResolvedValueOnce(scoreMock);
        await addScore(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith({ message: "Score added successfully", score: scoreMock });
    });
})


