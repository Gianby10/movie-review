"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.$ref = exports.reviews = void 0;
const zod_1 = require("zod");
const fastify_zod_1 = require("fastify-zod");
const createReviewSchema = zod_1.z.object({
    title: zod_1.z.string().min(3),
    content: zod_1.z.string().min(10, "Reviews must be at least 10 characters long."),
    rating: zod_1.z.number().min(1).max(5),
    userId: zod_1.z.number(),
    movieId: zod_1.z.number(),
});
const editReviewSchema = zod_1.z.object({
    title: zod_1.z.string().min(3),
    content: zod_1.z.string().min(10, "Reviews must be at least 10 characters long."),
    rating: zod_1.z.number().min(1).max(5),
});
const createReviewResponseSchema = zod_1.z.object({
    id: zod_1.z.number(), // Identificativo della recensione
    title: zod_1.z.string(),
    content: zod_1.z.string(),
    rating: zod_1.z.number(),
    userId: zod_1.z.number(),
    movieId: zod_1.z.number(),
});
_a = (0, fastify_zod_1.buildJsonSchemas)({
    createReviewSchema,
    createReviewResponseSchema,
}, { $id: "reviewsSchema" }), exports.reviews = _a.schemas, exports.$ref = _a.$ref;
//# sourceMappingURL=review.schema.js.map