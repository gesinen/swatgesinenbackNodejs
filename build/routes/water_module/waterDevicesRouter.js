"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const waterDevicesController_1 = __importDefault(require("../../controllers/water_module/waterDevicesController"));
class WaterDevicesRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.createWaterDeviceAction = () => this.router.post('/', (req, res) => {
            const params = req.body;
            waterDevicesController_1.default.createWaterDevice(params.name, params.sensor_id, params.variable_name, params.water_group_id, params.water_user_id, params.user_id, params.municipality_id, params.description, params.units, params.contract_number, params.device_diameter, params.sewer_rate_id, params.installation_address)
                .then(response => {
                res.send(response);
            })
                .catch(err => {
                res.send(err);
            });
        });
        this.getWaterDeviceListingAction = () => this.router.get('/page', (req, res) => {
            const params = req.body;
            waterDevicesController_1.default.getWaterDevicesListing(params.user_id, params.page_index, params.page_size)
                .then(response => {
                res.send(response);
            })
                .catch(err => {
                res.send(err);
            });
        });
        this.createWaterDeviceAction();
        this.getWaterDeviceListingAction();
    }
}
const waterDevicesRoutes = new WaterDevicesRouter();
exports.default = waterDevicesRoutes.router;
