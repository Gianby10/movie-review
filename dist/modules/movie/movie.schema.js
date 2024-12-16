"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.$ref = exports.movieSchemas = void 0;
const zod_1 = __importDefault(require("zod"));
const fastify_zod_1 = require("fastify-zod");
const movieInput = {
    title: zod_1.default.string(),
    posterUrl: zod_1.default.string(),
    synopsis: zod_1.default.string(),
    rating: zod_1.default.number({}),
    releaseDate: zod_1.default.date(),
    content: zod_1.default.string().optional(),
};
const movieGenerated = {
    id: zod_1.default.number(),
    createdAt: zod_1.default.string(),
    updatedAt: zod_1.default.string(),
};
const createMovieSchema = zod_1.default.object(Object.assign({}, movieInput));
const movieResponseSchema = zod_1.default.object(Object.assign(Object.assign({}, movieInput), movieGenerated));
const moviesResponseSchema = zod_1.default.array(movieResponseSchema);
_a = (0, fastify_zod_1.buildJsonSchemas)({
    createMovieSchema,
    movieResponseSchema,
    moviesResponseSchema,
}, { $id: "moviesSchema" }), exports.movieSchemas = _a.schemas, exports.$ref = _a.$ref;
//# sourceMappingURL=movie.schema.js.map