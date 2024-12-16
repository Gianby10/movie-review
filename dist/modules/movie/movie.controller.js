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
exports.createMovieHandler = createMovieHandler;
exports.getMoviesHandler = getMoviesHandler;
exports.searchMoviesHandler = searchMoviesHandler;
exports.getMovieDetailsHandler = getMovieDetailsHandler;
exports.getMoviesByCategoryHandler = getMoviesByCategoryHandler;
exports.getCategories = getCategories;
const movie_service_1 = require("./movie.service");
const prisma_1 = __importDefault(require("../../utils/prisma"));
function createMovieHandler(request) {
    return __awaiter(this, void 0, void 0, function* () {
        const movie = yield (0, movie_service_1.createMovie)(Object.assign(Object.assign({}, request.body), { ownerId: request.user.id }));
        return movie;
    });
}
function getMoviesHandler() {
    return __awaiter(this, void 0, void 0, function* () {
        const movies = yield (0, movie_service_1.getMovies)();
        return movies;
    });
}
function searchMoviesHandler(req, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { title } = req.query; // Estrarre il titolo dalla query string
        // Verifica che il titolo sia stato passato
        if (!title) {
            const movies = yield (0, movie_service_1.getMovies)();
            return movies;
            // return reply.code(400).send({ error: "Title parameter is required" });
        }
        // Ricerca i film nel database che contengono la stringa del titolo
        const movies = yield (0, movie_service_1.getMovieByTitle)(title);
        // Restituisce i risultati della ricerca
        return movies;
    });
}
function getMovieDetailsHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const movieId = +request.params.movieId;
        const movieExists = yield prisma_1.default.movie.findUnique({
            where: { id: movieId },
        });
        if (!movieExists) {
            return reply
                .status(404)
                .send({ error: `Movie with ID ${movieId} not found` });
        }
        const movieDetails = yield (0, movie_service_1.getMovieDetails)({ movieId });
        return movieDetails;
    });
}
function getMoviesByCategoryHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const categoryId = +request.params.categoryId;
        const categoryExists = yield prisma_1.default.category.findUnique({
            where: { id: categoryId },
        });
        if (!categoryExists) {
            return reply
                .status(404)
                .send({ error: `Category with ID ${categoryId} not found` });
        }
        const movies = yield (0, movie_service_1.getMoviesByCategoryId)({ categoryId });
        return movies;
    });
}
function getCategories(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const categories = yield prisma_1.default.category.findMany({});
        return categories;
    });
}
//# sourceMappingURL=movie.controller.js.map