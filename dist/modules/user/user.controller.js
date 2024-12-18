"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserHandler = registerUserHandler;
exports.loginHandler = loginHandler;
exports.getUsersHandler = getUsersHandler;
exports.updatePasswordHandler = updatePasswordHandler;
const user_service_1 = require("./user.service");
const hash_1 = require("../../utils/hash");
const app_1 = require("../../app");
const prisma_1 = __importDefault(require("../../utils/prisma"));
function registerUserHandler(req, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = req.body;
        try {
            // Controlla se l'email esiste già
            const existingUser = yield (0, user_service_1.findUserByEmail)(body.email);
            if (existingUser) {
                return reply.code(409).send({ message: "Email already exists." }); // 409: Conflict
            }
            const user = yield (0, user_service_1.createUser)(body);
            if (user) {
                const { password, salt, createdAt, updatedAt } = user, rest = __rest(user, ["password", "salt", "createdAt", "updatedAt"]);
                return Object.assign({ accessToken: app_1.server.jwt.sign(Object.assign({}, rest)) }, rest);
            }
            return reply.code(201).send(user);
        }
        catch (error) {
            console.log(error);
            return reply.code(500).send(error);
        }
    });
}
function loginHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = request.body;
        // Find the user by email
        const user = yield (0, user_service_1.findUserByEmail)(body.email);
        if (!user)
            return reply.code(401).send({ message: "Invalid email or password" });
        // verify password
        const correctPassword = (0, hash_1.verifyPassword)(body.password, user.salt, user.password);
        // Generate token
        if (correctPassword) {
            const { password, salt } = user, rest = __rest(user, ["password", "salt"]);
            return { accessToken: app_1.server.jwt.sign(rest) };
        }
        // Respond
        return reply.code(401).send({ message: "Invalid email or password" });
    });
}
function getUsersHandler() {
    return __awaiter(this, void 0, void 0, function* () {
        const users = yield (0, user_service_1.findUsers)();
        return users;
    });
}
function updatePasswordHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = request.body;
        const loggedUser = yield request.jwtVerify();
        // @ts-ignore
        const loggedUserId = loggedUser.id;
        const newPassword = body.password;
        if (!loggedUserId) {
            reply.code(409).send({ message: "Unauthorized." });
        }
        if (!newPassword) {
            reply
                .code(400)
                .send({ message: "Provide a new password to update profile name." });
        }
        const existingUser = yield prisma_1.default.user.findUnique({
            where: { id: loggedUserId },
        });
        if (!existingUser) {
            reply.code(409).send({ message: "Unauthorized." });
        }
        const { hash, salt } = (0, hash_1.hashPassword)(newPassword);
        const newUserInfo = yield prisma_1.default.user.update({
            where: { id: loggedUserId },
            data: {
                password: hash,
                salt,
            },
        });
        return newUserInfo;
        return reply.code(401).send({ message: "Invalid email or password" });
    });
}
//# sourceMappingURL=user.controller.js.map