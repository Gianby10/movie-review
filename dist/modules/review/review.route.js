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
const review_controller_1 = require("./review.controller");
function reviewRoutes(server) {
    return __awaiter(this, void 0, void 0, function* () {
        server.post("/movie/:movieId", {
            preHandler: [server.authenticate],
        }, review_controller_1.createReviewHandler);
        server.get("/movies/:movieId", review_controller_1.getReviewsHandler);
        server.get("/:reviewId", review_controller_1.getReviewHandler);
        server.get("/user/:userId", { preHandler: [server.authenticate] }, review_controller_1.getMyReviewsHandler);
        server.delete("/:reviewId", { preHandler: [server.authenticate] }, review_controller_1.deleteReviewHandler);
        server.put("/:reviewId", { preHandler: [server.authenticate] }, review_controller_1.editReviewHandler);
    });
}
exports.default = reviewRoutes;
//# sourceMappingURL=review.route.js.map