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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const fastify_1 = __importDefault(require("fastify"));
const user_route_1 = __importDefault(require("./modules/user/user.route"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const user_schema_1 = require("./modules/user/user.schema");
const movie_schema_1 = require("./modules/movie/movie.schema");
const movie_route_1 = __importDefault(require("./modules/movie/movie.route"));
const review_route_1 = __importDefault(require("./modules/review/review.route"));
exports.server = (0, fastify_1.default)();
const cors_1 = __importDefault(require("@fastify/cors"));
exports.server.register(cors_1.default, {
    origin: "http://localhost:3000", // Specifica l'origine autorizzata
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Metodi permessi
    allowedHeaders: ["Content-Type", "Authorization"], // Headers permessi
});
exports.server.register(jwt_1.default, {
    secret: "secret",
});
exports.server.decorate("authenticate", (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield request.jwtVerify();
    }
    catch (error) {
        return reply.send(error);
    }
}));
exports.server.get("/healthcheck", () => __awaiter(void 0, void 0, void 0, function* () {
    return { status: "OK" };
}));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        for (const schema of [...user_schema_1.userSchemas, ...movie_schema_1.movieSchemas]) {
            exports.server.addSchema(schema);
        }
        exports.server.register(user_route_1.default, {
            prefix: "api/users",
        });
        exports.server.register(movie_route_1.default, {
            prefix: "api/movies",
        });
        exports.server.register(review_route_1.default, {
            prefix: "api/reviews",
        });
        try {
            yield exports.server.listen({ port: 4444, host: "0.0.0.0" });
            console.log("Server ready at http://localhost:4444");
        }
        catch (e) {
            console.error(e);
            process.exit(1);
        }
    });
}
main();
//# sourceMappingURL=app.js.map