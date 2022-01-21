"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const irrigationDeviceInputController_1 = __importDefault(require("../../controllers/irrigation_module/irrigationDeviceInputController"));
class IrrigationDeviceInputRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        /**
         * Get the user data
         * GET ('/information/:id')
         */
        this.getIrrigationInputDeviceById = () => this.router.get('/:id', (req, res) => {
            const id = parseInt(req.params.id);
            irrigationDeviceInputController_1.default.getIrrigationInputDeviceById(id)
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
        this.storeIrrigationInputDevice = () => this.router.post('/', (req, res) => {
            const params = req.body;
            console.log("router store params");
            console.log(params);
            irrigationDeviceInputController_1.default.storeIrrigationInputDevice(params.irrigationDeviceId, params.sensorId, params.lastHumidity, params.lastTemperature, params.sensorIndex)
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
        this.deleteIrrigationInputDevice = () => this.router.delete('/:id', (req, res) => {
            const id = parseInt(req.params.id);
            irrigationDeviceInputController_1.default.deleteIrrigationInputDevice(id)
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
        this.updateIrrigationInputDevice = () => this.router.put('/', (req, res) => {
            console.log("update");
            const params = req.body;
            console.log(params);
            irrigationDeviceInputController_1.default.updateIrrigationInputDevice(params.id, params.irrigationDeviceId, params.sensorId, params.lastHumidity, params.lastTemperature, params.sensorIndex)
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        this.getIrrigationInputDeviceById();
        this.storeIrrigationInputDevice();
        this.deleteIrrigationInputDevice();
        this.updateIrrigationInputDevice();
    }
}
const irrigationDeviceInputRouter = new IrrigationDeviceInputRouter();
exports.default = irrigationDeviceInputRouter.router;
