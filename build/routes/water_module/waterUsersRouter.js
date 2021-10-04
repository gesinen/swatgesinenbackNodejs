"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const waterUsersController_1 = __importDefault(require("../../controllers/water_module/waterUsersController"));
class WaterUsersRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.getAllWaterUsersAction = () => this.router.get('/all/:user_id', (req, res) => {
            const params = req.params;
            waterUsersController_1.default.getAllWaterUsers(parseInt(params.user_id))
                .then(response => {
                res.send(response);
            })
                .catch(err => {
                res.send(err);
            });
        });
        this.getWaterUserDeviceAction = () => this.router.get('/device/:user_id', (req, res) => {
            const user_id = req.params.user_id;
            waterUsersController_1.default.getWaterUserDevice(parseInt(user_id))
                .then(response => {
                res.send(response);
            })
                .catch(err => {
                res.send(err);
            });
        });
        this.getAllWaterUsersAction();
        this.getWaterUserDeviceAction();
    }
}
const waterUsersRoutes = new WaterUsersRouter();
exports.default = waterUsersRoutes.router;
