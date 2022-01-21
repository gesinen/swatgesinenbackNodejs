"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const irrigationDeviceOutputController_1 = __importDefault(require("../../controllers/irrigation_module/irrigationDeviceOutputController"));
class IrrigationDeviceOutputRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        /**
         * Get the user data
         * GET ('/information/:id')
         */
        this.getIrrigationOutputDeviceById = () => this.router.get('/:id', (req, res) => {
            const id = parseInt(req.params.id);
            irrigationDeviceOutputController_1.default.getIrrigationOutputDeviceById(id)
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
        this.storeIrrigationOutputDevice = () => this.router.post('/', (req, res) => {
            const params = req.body;
            console.log("router store params");
            console.log(params);
            irrigationDeviceOutputController_1.default.storeIrrigationOutputDevice(params.irrigationDeviceId, params.sensorId, params.sensorIndex, params.intervals, params.status)
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
        this.deleteIrrigationOutputDevice = () => this.router.delete('/:id', (req, res) => {
            const id = parseInt(req.params.id);
            irrigationDeviceOutputController_1.default.deleteIrrigationOutputDevice(id)
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        /**
        * Get user related municipality_id
        * POST ('/municipality/{user_id}')
        * params user_id -> id of the user we want to get the municipality_id from
        */
        this.updateValvesConfig = () => this.router.post('/config/valves', (req, res) => {
            console.log("WORKS");
            const params = req.body;
            console.log(params);
            irrigationDeviceOutputController_1.default.updateIrrigationOutputDeviceIntervals(params.body.data.id, params.valves)
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
        this.updateIrrigationOutputDevice = () => this.router.put('/', (req, res) => {
            console.log("update");
            const params = req.body;
            console.log(params);
            irrigationDeviceOutputController_1.default.updateIrrigationOutputDevice(params.id, params.irrigationDeviceId, params.sensorId, params.sensorIndex, params.intervals, params.status)
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        this.getIrrigationOutputDeviceById();
        this.storeIrrigationOutputDevice();
        this.deleteIrrigationOutputDevice();
        this.updateIrrigationOutputDevice();
        this.updateValvesConfig();
    }
}
const irrigationDeviceOutputRouter = new IrrigationDeviceOutputRouter();
exports.default = irrigationDeviceOutputRouter.router;
