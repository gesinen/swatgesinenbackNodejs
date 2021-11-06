"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const loraDashboardController_1 = __importDefault(require("../../controllers/lora_module/loraDashboardController"));
class LoraDashboardRouter {
    // Constructor
    constructor() {
        // Router
        this.router = (0, express_1.Router)();
        // Controller
        this.loraDashboardController = new loraDashboardController_1.default();
        // Methods
        this.getNetworkServerGeneralInformation = () => this.router.get('/information/:userId', (req, res) => {
            const userId = parseInt(req.params.userId);
            this.loraDashboardController.getNetworkServerGeneralInformation(userId)
                .then(response => {
                res.status(200).send(response);
            })
                .catch(err => {
                res.status(401).send(err);
            });
        });
        this.getNetworkServerGeneralInformation();
    }
}
const loraDashboardRouter = new LoraDashboardRouter();
exports.default = loraDashboardRouter.router;
