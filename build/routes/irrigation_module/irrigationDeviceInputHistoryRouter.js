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
        this.getValuesOnDateRange = () => this.router.get("/modbus/:irrigationDeviceId/:irrigationInputDeviceIndex/:fromDate/:toDate", (req, res) => {
            console.log("params", req.params);
            const irrigationDeviceId = parseInt(req.params.irrigationDeviceId);
            const irrigationInputDeviceIndex = parseInt(req.params.irrigationInputDeviceIndex);
            const fromDate = req.params.fromDate;
            const toDate = req.params.toDate;
            irrigationDeviceInputHistoryController_1.default
                .getIrrigationInputDeviceHistoryOnRange(irrigationDeviceId, irrigationInputDeviceIndex, fromDate, toDate)
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        /**
        * Get the user data
        * GET ('/information/:id')
        */
        this.getValuesOnDateRangeLora = () => this.router.get("/lora/:irrigationDeviceId/:fromDate/:toDate", (req, res) => {
            console.log("params", req.params);
            const irrigationDeviceId = parseInt(req.params.irrigationDeviceId);
            const fromDate = req.params.fromDate;
            const toDate = req.params.toDate;
            irrigationDeviceInputHistoryController_1.default
                .getIrrigationInputDeviceHistoryOnRangeLora(irrigationDeviceId, fromDate, toDate)
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
        /**
        * Get user related municipality_id
        * GET ('/municipality/{user_id}')
        * params user_id -> id of the user we want to get the municipality_id from
        */
        this.storeValueLora = () => this.router.post("/lora", (req, res) => {
            const params = req.body;
            console.log("router store params");
            console.log(params);
            irrigationDeviceInputHistoryController_1.default
                .storeIrrigationInputDeviceHistoryLora(params.irrigationDeviceId, params.humidity, params.temperature)
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        this.getValuesOnDateRange();
        this.storeValue();
        this.storeValueLora();
        this.getValuesOnDateRangeLora();
    }
}
const irrigationDeviceInputHistoryRouter = new IrrigationDeviceInputHistoryRouter();
exports.default = irrigationDeviceInputHistoryRouter.router;
