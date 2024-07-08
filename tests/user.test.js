const { register, login, getUserProfile } = require("../controllers/user.controller");
const { verifyToken } = require('../middleware/auth.middleware');
const { User } = require('../models/user.model');
const jwt = require('jsonwebtoken');

jest.mock("../models/user.model")
jest.mock('jsonwebtoken');
jest.mock('../middleware/auth.middleware');

describe('User registration', () => {
    const req = {
        body: {
            username: "rajatKhobragade",
            password: "Rajat123565",
            email: "rajat@gmail.com",
            role: "Admin"
        },
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
    };

    it("should send status code 400 when user exists", async () => {
        User.findOne.mockImplementationOnce(() => ({
            email: "email"
        }));

        await register(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledTimes(1);
    });

    it("Should send a status code of 201 when new user created", async () => {
        User.create.mockResolvedValueOnce({ id: 1, email: "test@gmail.com1", username: "test", role: "testRole" })
        await register(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith({
            message: "User created successfully",
            data: { id: 1, email: "test@gmail.com1", username: "test", role: "testRole" }
        });
    })
    it("Should send a status code of 400 when fields are missing", async () => {
        const req = {
            body: {}
        }
        await register(req, res)
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            message: "Missing fields"
        });
    })
    it("Should send a status code of 400 when role is invalid", async () => {
        req.body.role = "InvalidRole";
        await register(req, res)
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            message: "Please fill correct role Admin or Player"
        });
    })
});


describe('User login', () => {
    const req = {
        body: {
            email: "rajat@gmail.com",
            password: "Rajat123565"
        }
    }

    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
    };

    it("Should send a status code of 400 when fields are missing", async () => {
        const req = {
            body: {
                email: "",
                password: ""
            }
        }
        await login(req, res)
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            message: "Missing fields"
        });
    })


    it("should send status code 400 when user not found", async () => {
        User.findOne.mockResolvedValueOnce(null);
        await login(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith({
            message: "User not found"
        });
    });

    it("should send status code 400 when user not found", async () => {
        User.findOne.mockResolvedValueOnce({
            email: "rajat@gmail.com",
            password: "wrongPassword"
        });

        await login(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            message: "Incorrect email or password"
        });
    });

    it("should send status code 200 when user login successfully", async () => {
        const token = "testJWTToken"
        User.findOne.mockResolvedValueOnce({
            email: "rajat@gmail.com",
            password: "Rajat123565"
        });
        jwt.sign.mockReturnValue(token);
        await login(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({
            message: "User login successfully",
            token: token
        });
    });



});


describe('Get user profile', () => {
    const req = {
        headers: {
            token: "mockToken"
        },
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
    };

    it('should send status code 400 when token is  missing', async () => {
        const reqWithoutToken = {
            headers: {},
        };

        await getUserProfile(reqWithoutToken, res)
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            message: "Missing token"
        });
    })


    it("should send status code 404 when user not found", async () => {
        User.findOne.mockResolvedValueOnce(null);
        await getUserProfile(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith({
            message: "User not found"
        });
    });

    it("should send status code 200 when user retrive successfully", async () => {
        const user = {
            username: "testUser",
            password: "test123456",
            email: "test@gmail.com",
            role: "testRole",
            id: 1

        }
        verifyToken.mockResolvedValueOnce("test@gmail.com")
        User.findOne.mockResolvedValueOnce(user);
        await getUserProfile(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({
            message: "User retrive successfully",
            data: user
        });
    });

});

