"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usersController_1 = __importDefault(require("../controllers/usersController"));
class UsersRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        /**
         * Get the user data
         * GET ('/information/:id')
         */
        this.getUserInformationAction = () => this.router.get('/information/:id', (req, res) => {
            const id = parseInt(req.params.id);
            usersController_1.default.getUserInformation(id)
                .then(response => {
                res.send(response);
            })
                .catch(err => {
                res.send(err);
            });
        });
        this.getUserInformationAction();
    }
}
const userRouter = new UsersRouter();
exports.default = userRouter.router;
