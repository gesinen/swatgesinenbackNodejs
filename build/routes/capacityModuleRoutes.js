"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const capacityModuleController_1 = require("../controllers/capacityModuleController");
class CapacityModuleRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.getDeviceByIdAction = () => this.router.get('/device/:id', capacityModuleController_1.capacityModuleController.getDeviceById);
        this.getDeviceByIdAction();
    }
}
const capacityModuleRoutes = new CapacityModuleRoutes();
exports.default = capacityModuleRoutes.router;
