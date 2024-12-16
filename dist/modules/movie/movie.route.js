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
Object.defineProperty(exports, "__esModule", { value: true });
const movie_controller_1 = require("./movie.controller");
const movie_schema_1 = require("./movie.schema");
function movieRoutes(server) {
    return __awaiter(this, void 0, void 0, function* () {
        server.post("/", {
            preHandler: [server.authenticate],
            schema: {
                body: (0, movie_schema_1.$ref)("createMovieSchema"),
                response: {
                    201: (0, movie_schema_1.$ref)("movieResponseSchema"),
                },
            },
        }, movie_controller_1.createMovieHandler);
        server.get("/", {
            schema: {
                response: {
                    200: (0, movie_schema_1.$ref)("moviesResponseSchema"),
                },
            },
        }, movie_controller_1.getMoviesHandler);
        server.get("/search", {}, movie_controller_1.searchMoviesHandler);
        server.get("/:movieId", {}, movie_controller_1.getMovieDetailsHandler);
        server.get("/category/:categoryId", {}, movie_controller_1.getMoviesByCategoryHandler);
        server.get("/categories", {}, movie_controller_1.getCategories);
    });
}
exports.default = movieRoutes;
//# sourceMappingURL=movie.route.js.map