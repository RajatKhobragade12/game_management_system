const { createGame, getAllGames, updateGame, deleteGame } = require("../controllers/game.controller");
const { verifyToken } = require('../middleware/auth.middleware');
const { User } = require('../models/user.model');
const { Game } = require("../models/game.model");
const { verifyRole } = require("../middleware/rbac.middleware");


jest.mock("../models/user.model")
jest.mock("../models/game.model")
jest.mock('jsonwebtoken');
jest.mock('../middleware/auth.middleware');
jest.mock('../middleware/rbac.middleware');


describe('Create a new  game', () => {
    const req = {
        body: {
            name: "testname",
            genre: "test",
            releaseDate: "2025/12/06",
        },
        headers: {
            token: "testToken"
        }
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
    };

    // beforeEach(() => {
    //     jest.clearAllMocks();
    // });
    it("Should send a status code of 400 when fields are missing", async () => {
        const Invalidreq = {
            body: {},
            headers: {
                token: "testToken"
            }
        }
        await createGame(Invalidreq, res)
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            message: "Missing fields"
        });
    })

    it('should send status code 400 when token is missing', async () => {
        const reqWithoutToken = {
            body: {
                name: "testname",
                genre: "test",
                releaseDate: "2025/12/06",
            },
            headers: {},
        };

        await createGame(reqWithoutToken, res)
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            message: "Missing token"
        });

    })

    it('should send status code 401 when token is invalid', async () => {
        const error = new Error('Invalid token');
        verifyToken.mockRejectedValueOnce(error);
        await createGame(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith({ message: error.message })
    })

    it('should send status code 403 when user role verification fails', async () => {
        const error = new Error('Invalid token');
        verifyToken.mockResolvedValueOnce('test@gmail.com')
        verifyRole.mockRejectedValueOnce(error);
        await createGame(req, res);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith({ message: error.message })
    })
    it('should send status code 403 when user is not authorized', async () => {
        verifyToken.mockResolvedValueOnce('test@gmail.com')
        verifyRole.mockResolvedValueOnce("testRole");
        await createGame(req, res);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith({ message: "You are not authorized" })
    })

    it('should send status code 201 when game created successfully', async () => {
        const newGame = {
            id: 1,
            name: "NewGame",
            genre: "test",
            releaseDate: "2024/02/12"
        }
        verifyToken.mockResolvedValueOnce('test@gmail.com')
        verifyRole.mockResolvedValueOnce("Admin");
        await Game.create.mockResolvedValueOnce(newGame);
        await createGame(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith({ message: "Game created successfully", data: newGame })
    })
});


describe('Get all games', () => {

    const req = {
        headers: {
            headers: { token: "valid_token" }
        }
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
    };

    // beforeEach(() => {
    //     jest.clearAllMocks();
    // });
    it('should send status code 400 when token is missing', async () => {
        const reqWithoutToken = {
            headers: {},
        };

        await getAllGames(reqWithoutToken, res)
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            message: "Missing token"
        });

    })

    // it("should send status code 200 when games are retrieved successfully", async () => {
    //     const games = [{ id: 1, name: "Game1", genre: "Genre1", releaseDate: "2024/02/12" }];
    //     const verifyToken = jest.fn().mockResolvedValue("test@gmail.com");
    //     // Mock verifyRole to return "Admin"
    //     const verifyRole = jest.fn().mockResolvedValue("Admin");
    //     // Mock Game.findAll to return games
    //     Game.findAll = jest.fn().mockResolvedValue(games);

    //     // Execute the function
    //     await getAllGames(req, res, verifyToken, verifyRole);

    //     // Assertions
    //     expect(res.status).toHaveBeenCalledWith(200);
    //     expect(res.send).toHaveBeenCalledWith({
    //         message: "Game retrive successfully",
    //         data: games
    //     });


    // });


})



describe('Update game', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: { id: 1 },
            body: { name: "Updated Game", genre: "Updated Genre", releaseDate: "2024/02/12" },
            headers: { token: "valid-token" },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
    });

    it("Should send a status code of 400 when id is missing", async () => {
        const Invalidreq = {
            body: {
                name: "test",
                genre: "testgenre",
                releaseDate: "2024/02/12"
            },
            headers: {
                token: "validToken"
            },
            params: {}
        }
        await updateGame(Invalidreq, res)
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            message: "Missing game id"
        });
    })


    it("Should send a status code of 400 when fields are missing", async () => {
        const Invalidreq = {
            body: {

            },
            headers: {
                token: "validToken"
            },
            params: {
                id: 1
            }
        }
        await updateGame(Invalidreq, res)
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            message: "Missing fields"
        });
    })


    it("Should send a status code of 400 when token is missing", async () => {
        const Invalidreq = {
            body: {
                name: "test",
                genre: "testgenre",
                releaseDate: "2024/02/12"
            },
            headers: {

            },
            params: {
                id: 1
            }
        }
        await updateGame(Invalidreq, res)
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            message: "Missing token"
        });
    })
    

    it('should send status code 200 when update game', async () => {
        const GameData = {
            id:1,
            name:"test",
            genre: 'testGenre',
            releaseDate: '2023/01/01',
            save: jest.fn()
        }
        verifyToken.mockResolvedValueOnce("test@gmail.com");
        verifyRole.mockResolvedValueOnce("Admin");
        Game.findOne.mockResolvedValueOnce(GameData);
        await updateGame(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({  message: 'Game updated successfully'  })
    })



})




describe('Delete Game',()=>{
    let req,res;
    beforeEach(()=>{
        req = {
            params: { id: 1 },
            headers: { token: "valid-token" }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
    })

    it("Should send a status code of 400 when id is missing", async () => {
        const Invalidreq = {
            body: {
                name: "test",
                genre: "testgenre",
                releaseDate: "2024/02/12"
            },
            headers: {
                token: "validToken"
            },
            params: {}
        }
        await deleteGame(Invalidreq, res)
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            message: "Missing game id"
        });
    })
    it("Should send a status code of 400 when token is missing", async () => {
        const Invalidreq = {
            body: {
                name: "test",
                genre: "testgenre",
                releaseDate: "2024/02/12"
            },
            headers: {

            },
            params: {
                id: 1
            }
        }
        await deleteGame(Invalidreq, res)
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            message: "Missing token"
        });
    })

    it('should send status code 200 when game is deleted successfully', async () => {
        const gameMock = {
            id: 1,
            destroy: jest.fn()
        };
        verifyToken.mockResolvedValueOnce("test@gmail.com");
        verifyRole.mockResolvedValueOnce("Admin");
        Game.findOne.mockResolvedValueOnce(gameMock);
        await deleteGame(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({ message: "Game deleted successfully" });
    
    })
})