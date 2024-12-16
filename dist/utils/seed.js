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
// import ky from "ky";
// import ky from "ky";
require("dotenv/config");
const client_1 = require("@prisma/client");
const axios_1 = __importDefault(require("axios"));
const prisma = new client_1.PrismaClient();
const seedCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get("https://api.themoviedb.org/3/genre/movie/list?language=en", {
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${process.env.MOVIE_DB_TOKEN}`,
            },
        });
        const json = response.data;
        yield prisma.category.deleteMany();
        json.genres.forEach((genre) => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.category.create({
                data: genre,
            });
        }));
    }
    catch (error) {
        console.log("FAILED TO SEED CATEGORIES");
        console.log(error);
    }
});
const seedMovies = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get("https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc", {
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${process.env.MOVIE_DB_TOKEN}`,
            },
        });
        const json = response.data;
        yield prisma.movie.deleteMany();
        console.log(json);
        json.results.forEach((movie) => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.movie.create({
                data: {
                    id: movie.id,
                    posterUrl: movie.poster_path,
                    backdropUrl: movie.backdrop_path,
                    releaseDate: new Date(movie.release_date),
                    title: movie.title,
                    synopsis: movie.overview,
                    categories: {
                        create: movie.genre_ids.map((categoryId) => ({
                            category: { connect: { id: categoryId } },
                        })),
                    },
                },
            });
        }));
    }
    catch (error) {
        console.log("FAILED TO SEED Movies");
        console.log(error);
    }
});
seedCategories().then(() => {
    seedMovies();
});
//# sourceMappingURL=seed.js.map