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
        this.importFileAction = () => this.router.post("/import/", (req, res) => {
            const params = req.body;
            //console.log("importFileAction -- waterRouter")
            //console.log(req.body)
            waterObservationsController_1.default
                .importFile(params, waterObservationsController_1.default.insertNewWaterObservations)
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        /**
         * Get observations by device id in date range
         * POST ('/observationsByDeviceId')
         */
        this.getObservationsByDeviceId = () => this.router.post("/observationsByDeviceId/", (req, res) => {
            const params = req.body;
            console.log("PARAMS", params);
            waterObservationsController_1.default
                .getObservationValuesByDeviceId(params.devicesIdArray, params.fromDate, params.userColSelection)
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        /**
      * Get observations by device id in date range
      * POST ('/observationsByDeviceId')
      */
        this.getGroupsHydricBalance = () => this.router.post("/getGroupsHydricBalance/", (req, res) => {
            const params = req.params;
            console.log("PARAMS", params);
            waterObservationsController_1.default
                .getGroupHydricBalance()
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        /**
      * Get observations by device id in date range
      * POST ('/observationsByDeviceId')
      */
        this.getGroupsHydricBalanceOnRange = () => this.router.get("/getGroupsHydricBalance/:groupId/:dateFrom/:dateTo", (req, res) => {
            const params = req.params;
            console.log("PARAMS", params);
            waterObservationsController_1.default
                .getGroupBalanceOnRange(params.groupId, params.dateFrom, params.dateTo)
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        /**
      * Get observations by device id in date range
      * POST ('/observationsByDeviceId')
      */
        this.getWaterDeviceObservationsMediumValueInRange = () => this.router.get("/mediumValueInRange/:waterDeviceId/:fromDate/:toDate", (req, res) => {
            const params = req.params;
            waterObservationsController_1.default
                .getObservationsByRangeDateAndDeviceId(params.waterDeviceId, params.fromDate, params.toDate)
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        this.importFileAction();
        this.getObservationsByDeviceId();
        this.getWaterDeviceObservationsMediumValueInRange();
        this.getGroupsHydricBalance();
        this.getGroupsHydricBalanceOnRange();
    }
}
const waterObservationsRouter = new WaterObservationsRouter();
exports.default = waterObservationsRouter.router;
