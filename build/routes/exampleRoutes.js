"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const exampleController_1 = require("../controllers/exampleController");
class CapacityModuleRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.getDeviceByIdAction = () => this.router.get('/device/:id', exampleController_1.exampleController.getDeviceById);
        this.getDeviceByIdAction();
    }
}
const capacityModuleRoutes = new CapacityModuleRoutes();
exports.default = capacityModuleRoutes.router;
