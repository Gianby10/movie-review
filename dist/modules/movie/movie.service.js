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
exports.createMovie = createMovie;
exports.getMovies = getMovies;
exports.getMovieByTitle = getMovieByTitle;
exports.getMovieDetails = getMovieDetails;
exports.getMoviesByCategoryId = getMoviesByCategoryId;
const prisma_1 = __importDefault(require("../../utils/prisma"));
function createMovie(data) {
    return __awaiter(this, void 0, void 0, function* () {
        // return prisma.product.create({data})
    });
}
function getMovies() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma_1.default.movie.findMany({
            include: {
                categories: {
                    select: {
                        category: true,
                    },
                },
            },
        });
    });
}
function getMovieByTitle(title) {
    return __awaiter(this, void 0, void 0, function* () {
        const movies = yield prisma_1.default.movie.findMany({
            where: {
                title: {
                    contains: title, // Operazione di ricerca "contiene"
                    mode: "insensitive", // Ignora maiuscole/minuscole
                },
            },
            include: {
                categories: {
                    select: {
                        category: true,
                    },
                },
            },
        });
        return movies;
    });
}
function getMovieDetails(_a) {
    return __awaiter(this, arguments, void 0, function* ({ movieId }) {
        if (!movieId) {
            return;
        }
        const movieDetails = yield prisma_1.default.movie.findFirst({
            where: { id: movieId },
            include: {
                categories: {
                    select: {
                        category: true,
                    },
                },
            },
        });
        return movieDetails;
    });
}
function getMoviesByCategoryId(_a) {
    return __awaiter(this, arguments, void 0, function* ({ categoryId, }) {
        if (!categoryId) {
            return;
        }
        const moviesInCategory = yield prisma_1.default.movie.findMany({
            where: {
                categories: {
                    some: {
                        categoryId: categoryId, // Filtro per categoria specifica
                    },
                },
            },
            include: {
                categories: {
                    where: {
                        categoryId: categoryId, // Assicurati che solo la categoria desiderata sia inclusa
                    },
                    select: {
                        category: {
                            select: {
                                name: true, // Includi solo il nome della categoria
                            },
                        },
                    },
                },
            },
        });
        return moviesInCategory;
    });
}
//# sourceMappingURL=movie.service.js.map