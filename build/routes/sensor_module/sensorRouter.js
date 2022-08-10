"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sensorController_1 = __importDefault(require("../../controllers/sensor_module/sensorController"));
class SensorRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.createSensorAction = () => this.router.post("/", (req, res) => {
            const params = req.body;
            /*
              sensorController.createMultipleSensors(params.user_id,params.name, params.description, params.provider, params.device_EUI, params.app_EUI, params.app_KEY)
                  .then(response => {
                      res.send(response)
                  })
                  .catch(err => {
                      res.send(err)
                  })*/
        });
        this.getSensorGatewayIdAction = () => this.router.get("/sensorGatewayId/:sensorId", (req, res) => {
            sensorController_1.default
                .getSensorGatewayId(req.params.sensorId)
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        this.getSensorDevEuiAndGatewayMacAction = () => this.router.get("/mqttinfo/:sensorId", (req, res) => {
            sensorController_1.default
                .getSensorDevEuiGatewayMac(req.params.sensorId)
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        this.getSensorByDevEui = () => this.router.get("/deveui/:deveui", (req, res) => {
            sensorController_1.default
                .getSensorByDeviceEUI(req.params.deveui)
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        this.getSensorGatewayMacAction = () => this.router.get("/sensorGatewayMac/:sensorId", (req, res) => {
            sensorController_1.default
                .getSensorGatewayMac(req.params.sensorId)
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        this.getSensorSentiloObservationsAction = () => this.router.get("/observations/:sensorId", (req, res) => {
            console.log(" *** ON ROUTER *** ");
            sensorController_1.default
                .addSensorObservationsFromSentilo(parseInt(req.params.sensorId), 1, 1, 1)
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        this.createSensorAction();
        this.getSensorGatewayIdAction();
        this.getSensorSentiloObservationsAction();
        this.getSensorGatewayMacAction();
        this.getSensorDevEuiAndGatewayMacAction();
        this.getSensorByDevEui();
    }
}
const sensorRoutes = new SensorRouter();
exports.default = sensorRoutes.router;
