"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const waterObservationsController_1 = __importDefault(require("../../controllers/water_module/waterObservationsController"));
//const formidable = require('formidable');
class WaterObservationsRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        /**
         * Import observations file
         * POST ('/import')
         */
        this.importFileAction = () => this.router.post('/import/', (req, res) => {
            const params = req.body;
            console.log("importFileAction -- waterRouter");
            //console.log(req.body)
            waterObservationsController_1.default.importFile(params, waterObservationsController_1.default.insertNewWaterObservations)
                .then(response => {
                res.send(response);
            })
                .catch(err => {
                res.send(err);
            });
        });
        /**
         * Get observations by device id in date range
         * POST ('/observationsByDeviceId')
         */
        this.getObservationsByDeviceId = () => this.router.post('/observationsByDeviceId/', (req, res) => {
            const params = req.body;
            //console.log(req.body)
            waterObservationsController_1.default.getObservationValuesByDeviceId(params.devicesIdArray, params.fromDate, params.toDate, params.userColSelection)
                .then(response => {
                res.send(response);
            })
                .catch(err => {
                res.send(err);
            });
        });
        this.importFileAction();
        this.getObservationsByDeviceId();
    }
}
const waterObservationsRouter = new WaterObservationsRouter();
exports.default = waterObservationsRouter.router;
