"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const waterController_1 = __importDefault(require("../../controllers/water_module/waterController"));
const formidable = require('formidable');
class WaterModuleRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        /**
         * Import observations file
         * POST ('/import')
         */
        this.importFileAction = () => this.router.post('/import/', (req, res) => {
            const params = req.body;
            //console.log("importFileAction -- waterRouter")
            //console.log(req.body)
            waterController_1.default.importFile(params, waterController_1.default.insertNewWaterObservations)
                .then(response => {
                res.send(response);
            })
                .catch(err => {
                res.send(err);
            });
        });
        this.importFileAction();
    }
}
const waterModuleRouter = new WaterModuleRouter();
exports.default = waterModuleRouter.router;
