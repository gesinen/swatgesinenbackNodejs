"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const irrigationDeviceInputHistoryController_1 = __importDefault(require("../../controllers/irrigation_module/irrigationDeviceInputHistoryController"));
class IrrigationDeviceInputHistoryRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        /**
         * Get the user data
         * GET ('/information/:id')
         */
        this.getValuesOnDateRange = () => this.router.get("/:irrigationInputDeviceId/:irrigationInputDeviceIndex/:fromDate/:toDate", (req, res) => {
            console.log("params", req.params);
            const irrigationInputDeviceId = parseInt(req.params.irrigationInputDeviceId);
            const irrigationInputDeviceIndex = parseInt(req.params.irrigationInputDeviceIndex);
            const fromDate = req.params.fromDate;
            const toDate = req.params.toDate;
            irrigationDeviceInputHistoryController_1.default
                .getIrrigationInputDeviceHistoryOnRange(irrigationInputDeviceId, irrigationInputDeviceIndex, fromDate, toDate)
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        /**
         * Get user related municipality_id
         * GET ('/municipality/{user_id}')
         * params user_id -> id of the user we want to get the municipality_id from
         */
        this.storeValue = () => this.router.post("/", (req, res) => {
            const params = req.body;
            console.log("router store params");
            console.log(params);
            irrigationDeviceInputHistoryController_1.default
                .storeIrrigationInputDeviceHistory(params.irrigationInputDeviceId, params.humidity, params.temperature)
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        this.getValuesOnDateRange();
        this.storeValue();
    }
}
const irrigationDeviceInputHistoryRouter = new IrrigationDeviceInputHistoryRouter();
exports.default = irrigationDeviceInputHistoryRouter.router;
