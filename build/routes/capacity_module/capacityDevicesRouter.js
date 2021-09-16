"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const capacityDevicesController_1 = __importDefault(require("../../controllers/capacity_module/capacityDevicesController"));
class CapacityModuleRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.createCapacityDeviceAction = () => this.router.post('/', (req, res) => {
            const params = req.body;
            capacityDevicesController_1.default.createCapacityDevice(params.name, params.description, parseInt(params.sensor_id), parseInt(params.user_id), parseInt(params.capacity), parseInt(params.max_capacity), params.type, params.address, params.coordinates_x, params.coordinates_y)
                .then((response) => {
                res.send({
                    response: response
                });
                /* if (response == true) {
                    res.send({

                    })
                } */
            });
        });
        this.createCapacityDeviceAction();
    }
}
const capacityModuleRoutes = new CapacityModuleRoutes();
exports.default = capacityModuleRoutes.router;
