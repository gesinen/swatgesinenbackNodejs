"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const waterDevicesColumnConfigController_1 = __importDefault(require("../../controllers/water_module/waterDevicesColumnConfigController")); // "../../controllers/water_module/waterDevicesColumnConfigController";
class WaterDevicesColumnConfigRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.createWaterDeviceColumnConfig = () => this.router.post("/", (req, res) => {
            const params = req.body;
            waterDevicesColumnConfigController_1.default
                .createWaterDeviceColumnConfig(params.name, params.contract_number, params.user, params.user_id, params.units, params.counter_number, params.description, params.use_for, params.installation_address)
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        this.EditWaterDeviceColumnConfig = () => this.router.put("/", (req, res) => {
            const params = req.body;
            waterDevicesColumnConfigController_1.default
                .UpdateWaterDeviceColumnConfig(params.name, params.contract_number, params.user, params.user_id, params.units, params.counter_number, params.description, params.use_for, params.installation_address)
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        this.getWaterDeviceColumnConfigByUserIdAction = () => this.router.get("/:userId", (req, res) => {
            const params = req.params;
            console.log(params);
            waterDevicesColumnConfigController_1.default
                .getWaterDeviceColumnConfigByUserId(parseInt(params.userId))
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        // create water device column Config
        this.createWaterDeviceColumnConfig();
        this.EditWaterDeviceColumnConfig();
        this.getWaterDeviceColumnConfigByUserIdAction();
    }
}
const waterDevicesColumnConfigRouter = new WaterDevicesColumnConfigRouter();
exports.default = waterDevicesColumnConfigRouter.router;
