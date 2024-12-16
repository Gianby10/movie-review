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
exports.createReview = createReview;
exports.getReviews = getReviews;
exports.getReview = getReview;
exports.getReviewsByUserId = getReviewsByUserId;
exports.deleteReviewById = deleteReviewById;
exports.editReviewById = editReviewById;
const prisma_1 = __importDefault(require("../../utils/prisma"));
function createReview(data) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!data.userId || !data.movieId) {
        }
        let authorName;
        const author = yield prisma_1.default.user.findUnique({
            where: {
                id: data.userId,
            },
            select: {
                name: true,
            },
        });
        if (!author || !author.name) {
            authorName = "User";
        }
        else {
            authorName = author.name;
        }
        const review = yield prisma_1.default.review.create({
            data: {
                title: data.title,
                content: data.content,
                rating: data.rating,
                userId: data.userId,
                movieId: data.movieId,
                authorName,
            },
        });
        return review;
    });
}
function getReviews(_a) {
    return __awaiter(this, arguments, void 0, function* ({ movieId }) {
        const reviews = yield prisma_1.default.review.findMany({
            where: { movieId },
        });
        return reviews;
    });
}
function getReview(_a) {
    return __awaiter(this, arguments, void 0, function* ({ reviewId }) {
        const review = yield prisma_1.default.review.findFirst({
            where: { id: reviewId },
        });
        return review;
    });
}
function getReviewsByUserId(_a, _b) {
    return __awaiter(this, arguments, void 0, function* ({ userId }, { skip, limit }) {
        // const reviews = await prisma.review.findMany({
        //   where: { userId },
        // });
        const [reviews, total] = yield Promise.all([
            prisma_1.default.review.findMany({
                where: { userId: Number(userId) },
                skip: Number(skip),
                take: Number(limit),
            }),
            prisma_1.default.review.count({ where: { userId: Number(userId) } }),
        ]);
        return { reviews, total };
    });
}
function deleteReviewById(_a) {
    return __awaiter(this, arguments, void 0, function* ({ reviewId }) {
        const review = yield prisma_1.default.review.delete({
            where: { id: reviewId },
        });
        return review;
    });
}
function editReviewById(_a) {
    return __awaiter(this, arguments, void 0, function* ({ reviewId, newReviewData, }) {
        const review = yield prisma_1.default.review.update({
            where: { id: reviewId },
            data: Object.assign({}, newReviewData),
        });
        return review;
    });
}
//# sourceMappingURL=review.service.js.map