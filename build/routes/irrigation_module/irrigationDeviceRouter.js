"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const irrigationDeviceController_1 = __importDefault(require("../../controllers/irrigation_module/irrigationDeviceController"));
class IrrigationDeviceRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        /**
         * Get the user data
         * GET ('/information/:id')
         */
        this.getIrrigationDeviceById = () => this.router.get("/:id", (req, res) => {
            const id = parseInt(req.params.id);
            irrigationDeviceController_1.default
                .getIrrigationDeviceByIdInner(id)
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
        this.getIrrigationDeviceListing = () => this.router.get("/listing/:userId/:pageSize/:pageIndex", (req, res) => {
            const userId = parseInt(req.params.userId);
            const pageSize = parseInt(req.params.pageSize);
            const pageIndex = parseInt(req.params.pageIndex);
            irrigationDeviceController_1.default
                .getIrrigationDeviceListing(userId, pageSize, pageIndex)
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
        this.getIrrigationInputDevicesByIrregationDeviceId = () => this.router.get("/sensorNumber/:deviceId", (req, res) => {
            const irregationDeviceId = parseInt(req.params.deviceId);
            irrigationDeviceController_1.default
                .getIrrigationInputDevicesByIrregationDeviceId(irregationDeviceId)
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
        this.updateIrrigationDeviceRelatedSensorId = () => this.router.put("/relatedSensor/:irrigationDeviceId/:relatedSensorDevEui/:humidityLimit/:humidityLimitInferior", (req, res) => {
            const params = req.params;
            console.log("router store params");
            console.log(params);
            irrigationDeviceController_1.default
                .updateIrrigationDeviceRelatedSensor(params.irrigationDeviceId, params.relatedSensorDevEui, parseInt(params.humidityLimit), parseInt(params.humidityLimitInferior))
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
        this.storeIrrigationDevice = () => this.router.post("/", (req, res) => {
            const params = req.body;
            console.log("router store params");
            console.log(params);
            irrigationDeviceController_1.default
                .storeIrrigationDevice(params.name, params.nameSentilo, params.latitude, params.longitude, params.description, params.status, params.userId, params.deviceTypeId, params.valves, params.sensors, params.sensorId)
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
        this.updateIrrigationDevice = () => this.router.put("/:irrigationDeviceId", (req, res) => {
            const params = req.body;
            const irrigationDeviceId = parseInt(req.params.irrigationDeviceId);
            console.log("params", params);
            irrigationDeviceController_1.default
                .updateIrrigationDevice(irrigationDeviceId, params.sensorId, params.name, params.nameSentilo, params.latitude, params.longitude, params.description, params.status, params.userId, params.deviceTypeId, params.valves, params.sensors)
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
        this.deleteIrrigationDevice = () => this.router.delete("/:irrigationDeviceId", (req, res) => {
            const irrigationDeviceId = parseInt(req.params.irrigationDeviceId);
            irrigationDeviceController_1.default
                .deleteIrrigationDevice(irrigationDeviceId)
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        this.getIrrigationDeviceById();
        this.getIrrigationDeviceListing();
        this.storeIrrigationDevice();
        this.updateIrrigationDevice();
        this.deleteIrrigationDevice();
        this.updateIrrigationDeviceRelatedSensorId();
    }
}
const irrigationDeviceRouter = new IrrigationDeviceRouter();
exports.default = irrigationDeviceRouter.router;
