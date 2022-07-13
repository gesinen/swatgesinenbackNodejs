"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const boilerController_1 = __importDefault(require("../../controllers/boiler_module/boilerController"));
class BoilerRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.createBoilerAction = () => this.router.post("/", (req, res) => {
            const params = req.body;
            boilerController_1.default.createBoilerDevice(params.userId, params.name, params.description, params.sensorId, params.mode, params.schedule, params.model, params.depth, params.length, params.width)
                .then(response => {
                res.send(response);
            })
                .catch(err => {
                res.send(err);
            });
        });
        this.updateBoilerAction = () => this.router.put("/", (req, res) => {
            const params = req.body;
            boilerController_1.default.updateBoilerDevice(params.id, params.userId, params.name, params.description, params.sensorId, params.mode, params.schedule, params.model, params.depth, params.length, params.width)
                .then(response => {
                res.send(response);
            })
                .catch(err => {
                res.send(err);
            });
        });
        this.updateBoilerPingDataV2 = () => this.router.put("/ping", (req, res) => {
            const params = req.body;
            console.log(params);
            boilerController_1.default.updateBoilerDevicePingData(params.id, params.distance, params.temperature, params.relayState, params.hourOn, params.minuteOn, params.hourOff, params.minuteOff, params.schedulerMode)
                .then(response => {
                res.send(response);
            })
                .catch(err => {
                res.send(err);
            });
        });
        this.updateBoilerPingDataActionTempDistV1 = () => this.router.put("/pingDistTempV1", (req, res) => {
            const params = req.body;
            console.log(params);
            boilerController_1.default.updateBoilerDevicePingDataTempDistV1(params.id, params.distance, params.temperature)
                .then(response => {
                res.send(response);
            })
                .catch(err => {
                res.send(err);
            });
        });
        this.updateBoilerPingDataScheduleV1 = () => this.router.put("/pingScheduleV1", (req, res) => {
            const params = req.body;
            console.log(params);
            boilerController_1.default.updateBoilerDevicePingDataScheduleV1(params.id, params.relayState, params.hourOn, params.minuteOn, params.hourOff, params.minuteOff, params.schedulerMode)
                .then(response => {
                res.send(response);
            })
                .catch(err => {
                res.send(err);
            });
        });
        this.updateBoilerStatusAction = () => this.router.put("/status", (req, res) => {
            const params = req.body;
            boilerController_1.default.changeBoilerStatus(params.id, params.releStatus)
                .then(response => {
                res.send(response);
            })
                .catch(err => {
                res.send(err);
            });
        });
        this.getBoilersPaginatedAction = () => this.router.get("/:userId/:pageSize/:pageIndex", (req, res) => {
            let params = req.params;
            boilerController_1.default
                .getBoilersPaginated(params.userId, params.pageSize, params.pageIndex)
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        this.getBoilerByIdAction = () => this.router.get("/:id", (req, res) => {
            let params = req.params;
            boilerController_1.default
                .getBoilerById(params.id)
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        this.deleteBoilerAction = () => this.router.delete("/:id", (req, res) => {
            boilerController_1.default.deleteBoilerDevice(parseInt(req.params.id))
                .then(response => {
                res.send(response);
            })
                .catch(err => {
                res.send(err);
            });
        });
        this.createBoilerAction();
        this.updateBoilerAction();
        this.deleteBoilerAction();
        this.getBoilersPaginatedAction();
        this.getBoilerByIdAction();
        this.updateBoilerStatusAction();
        this.updateBoilerPingDataV2();
        this.updateBoilerPingDataActionTempDistV1();
        this.updateBoilerPingDataScheduleV1();
    }
}
const boilerRoutes = new BoilerRouter();
exports.default = boilerRoutes.router;
