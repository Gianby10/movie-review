"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.$ref = exports.userSchemas = void 0;
const zod_1 = require("zod");
const fastify_zod_1 = require("fastify-zod");
const userCore = {
    email: zod_1.z
        .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
    })
        .email(),
    name: zod_1.z.string(),
};
const createUserSchema = zod_1.z.object(Object.assign(Object.assign({}, userCore), { password: zod_1.z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
    }) }));
const createUserResponseSchema = zod_1.z.object(Object.assign({ id: zod_1.z.number(), accessToken: zod_1.z.string() }, userCore));
const editPasswordSchema = zod_1.z.object({
    password: zod_1.z.string().min(6),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z
        .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
    })
        .email(),
    password: zod_1.z.string(),
});
const loginResponseSchema = zod_1.z.object({
    accessToken: zod_1.z.string(),
});
_a = (0, fastify_zod_1.buildJsonSchemas)({
    createUserSchema,
    createUserResponseSchema,
    loginSchema,
    loginResponseSchema,
}, { $id: "usersSchema" }), exports.userSchemas = _a.schemas, exports.$ref = _a.$ref;
//# sourceMappingURL=user.schema.js.map