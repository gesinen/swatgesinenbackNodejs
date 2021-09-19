"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const capacityDevicesController_1 = __importDefault(require("../../controllers/capacity_module/capacityDevicesController"));
class CapacityModuleRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        /**
         * Create capacity device
         * POST ('/')
         */
        this.createCapacityDeviceAction = () => this.router.post('/', (req, res) => {
            const params = req.body;
            capacityDevicesController_1.default.createCapacityDevice(params.name, params.description, parseInt(params.sensor_id), parseInt(params.user_id), parseInt(params.capacity), parseInt(params.max_capacity), params.type, params.address, params.coordinates_x, params.coordinates_y)
                .then(response => {
                res.send(response);
            })
                .catch(err => {
                /*res.send({
                    http: 401,
                    status: 'Failed',
                    error: err
                })*/
                res.send(err);
            });
        });
        /**
         * Get a capacity device with an ID
         * GET ('/:id')
         */
        this.getCapacityDeviceByIdAction = () => this.router.get('/:id', (req, res) => {
            capacityDevicesController_1.default.getCapacityDeviceById(parseInt(req.params.id))
                .then(response => {
                res.send(response);
            })
                .catch(err => {
                /*res.send({
                    http: 401,
                    status: 'Failed',
                    error: err
                })*/
                res.send(err);
            });
        });
        /**
         * Update a capacity device
         * PUT ('/:id')
         */
        this.updateCapacityDeviceAction = () => this.router.put('/:id', (req, res) => {
            const id = parseInt(req.params.id);
            const params = req.body;
            capacityDevicesController_1.default.updateCapacityDevice(id, params.name, params.description, parseInt(params.sensor_id), params.type, params.address, params.coordinates_x, params.coordinates_y)
                .then(response => {
                res.send(response);
            })
                .catch(err => {
                res.send(err);
            });
        });
        /**
         * Get capacity devices of a user
         * GET ('/:userId')
         */
        this.getUserCapacityDevicesAction = () => this.router.get('/list/:userId', (req, res) => {
            capacityDevicesController_1.default.getUserCapacityDevices(parseInt(req.params.userId))
                .then(response => {
                res.send(response);
            })
                .catch(err => {
                res.send(err);
            });
        });
        this.createCapacityDeviceAction();
        this.getCapacityDeviceByIdAction();
        this.updateCapacityDeviceAction();
        this.getUserCapacityDevicesAction();
    }
}
const capacityModuleRoutes = new CapacityModuleRouter();
exports.default = capacityModuleRoutes.router;
