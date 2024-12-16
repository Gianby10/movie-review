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
exports.createReviewHandler = createReviewHandler;
exports.getReviewsHandler = getReviewsHandler;
exports.getReviewHandler = getReviewHandler;
exports.getMyReviewsHandler = getMyReviewsHandler;
exports.deleteReviewHandler = deleteReviewHandler;
exports.editReviewHandler = editReviewHandler;
const review_service_1 = require("./review.service");
const prisma_1 = __importDefault(require("../../utils/prisma"));
function createReviewHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const movieId = +request.params.movieId;
        const movieExists = yield prisma_1.default.movie.findUnique({
            where: { id: movieId },
        });
        if (!movieExists) {
            return reply
                .status(404)
                .send({ error: `Movie with ID ${movieId} not found` });
        }
        const review = yield (0, review_service_1.createReview)(Object.assign(Object.assign({}, request.body), { userId: request.user.id, movieId }));
        const averageRating = yield prisma_1.default.review.aggregate({
            where: { movieId: movieId },
            _avg: { rating: true },
        });
        yield prisma_1.default.movie.update({
            where: { id: movieId },
            data: {
                rating: parseFloat((_a = averageRating._avg.rating) === null || _a === void 0 ? void 0 : _a.toFixed(1)) || 0, // Valore di default se non ci sono recensioni
            },
        });
        return review;
    });
}
function getReviewsHandler(request, reply) {
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
        const reviews = yield (0, review_service_1.getReviews)({ movieId });
        return reviews;
    });
}
function getReviewHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const reviewId = +request.params.reviewId;
        const reviewExists = yield prisma_1.default.review.findUnique({
            where: { id: reviewId },
        });
        if (!reviewExists) {
            return reply
                .status(404)
                .send({ error: `Review with ID ${reviewId} not found` });
        }
        const review = yield (0, review_service_1.getReview)({ reviewId });
        return review;
    });
}
function getMyReviewsHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = +request.params.userId;
        const loggedUser = yield request.jwtVerify();
        // @ts-ignore
        const loggedUserId = loggedUser.id;
        if (userId !== loggedUserId) {
            return reply.status(401).send({ error: `Unauthorized.` });
        }
        const userExists = yield prisma_1.default.user.findUnique({
            where: { id: userId },
        });
        if (!userExists) {
            return reply
                .status(404)
                .send({ error: `User with ID ${userId} not found` });
        }
        const { page = 1, limit = 4 } = request.query;
        const skip = (page - 1) * limit;
        const { reviews, total } = yield (0, review_service_1.getReviewsByUserId)({ userId }, { skip, limit });
        return { reviews, total };
    });
}
function deleteReviewHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const reviewId = +request.params.reviewId;
        const loggedUser = yield request.jwtVerify();
        // @ts-ignore
        const loggedUserId = loggedUser.id;
        const review = yield prisma_1.default.review.findUnique({
            where: {
                id: reviewId,
            },
        });
        const movieId = review === null || review === void 0 ? void 0 : review.movieId;
        if (!review) {
            return reply
                .status(404)
                .send({ error: `Review with ID ${reviewId} not found` });
        }
        if ((review === null || review === void 0 ? void 0 : review.userId) !== loggedUserId) {
            return reply.status(401).send({ error: `Unauthorized.` });
        }
        const response = yield (0, review_service_1.deleteReviewById)({ reviewId });
        const averageRating = yield prisma_1.default.review.aggregate({
            where: { movieId: movieId },
            _avg: { rating: true },
        });
        yield prisma_1.default.movie.update({
            where: { id: movieId },
            data: {
                rating: parseFloat((_a = averageRating._avg.rating) === null || _a === void 0 ? void 0 : _a.toFixed(1)) || 0, // Valore di default se non ci sono recensioni
            },
        });
        return response;
    });
}
function editReviewHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const reviewId = +request.params.reviewId;
        const loggedUser = yield request.jwtVerify();
        // @ts-ignore
        const loggedUserId = loggedUser.id;
        const review = yield prisma_1.default.review.findUnique({
            where: {
                id: reviewId,
            },
        });
        const movieId = review === null || review === void 0 ? void 0 : review.movieId;
        if (!review) {
            return reply
                .status(404)
                .send({ error: `Review with ID ${reviewId} not found` });
        }
        if ((review === null || review === void 0 ? void 0 : review.userId) !== loggedUserId) {
            return reply.status(401).send({ error: `Unauthorized.` });
        }
        const response = yield (0, review_service_1.editReviewById)({
            reviewId,
            newReviewData: Object.assign({}, request.body),
        });
        const averageRating = yield prisma_1.default.review.aggregate({
            where: { movieId: movieId },
            _avg: { rating: true },
        });
        yield prisma_1.default.movie.update({
            where: { id: movieId },
            data: {
                rating: parseFloat((_a = averageRating._avg.rating) === null || _a === void 0 ? void 0 : _a.toFixed(1)) || 0, // Valore di default se non ci sono recensioni
            },
        });
        return response;
    });
}
//# sourceMappingURL=review.controller.js.map