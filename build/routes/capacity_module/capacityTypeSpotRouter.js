"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const capacityTypeSpot_1 = __importDefault(require("../../controllers/capacity_module/capacityTypeSpot"));
class CapacityTypeSpotRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        /**
         * Create capacity device
         * POST ('/')
         */
        this.createCapacitySpotDevice = () => this.router.post('/', (req, res) => {
            const params = req.body;
            capacityTypeSpot_1.default.createCapacitySpotDevice(parseInt(params.capacityDeviceId), params.status)
                .then(response => {
                res.send(response);
            })
                .catch(err => {
                res.send(err);
            });
        });
        /**
         * Get a capacity device with an ID
         * GET ('/:id')
         */
        this.getCapacitySpotDevice = () => this.router.get('/:id', (req, res) => {
            capacityTypeSpot_1.default.getCapacitySpotDevice(parseInt(req.params.id))
                .then(response => {
                res.send(response);
            })
                .catch(err => {
                res.send(err);
            });
        });
        this.removeCapacitySpotDevice = () => this.router.delete('/:id', (req, res) => {
            capacityTypeSpot_1.default.deleteCapacitySpotDevice(parseInt(req.params.id))
                .then(response => {
                res.send(response);
            })
                .catch(err => {
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
            capacityTypeSpot_1.default.updateCapacitySpotDevice(id, params.status)
                .then(response => {
                res.send(response);
            })
                .catch(err => {
                res.send(err);
            });
        });
        this.getCapacitySpotDevice();
        this.createCapacitySpotDevice();
        this.removeCapacitySpotDevice();
        this.updateCapacityDeviceAction();
    }
}
const capacityTypeSpotRouter = new CapacityTypeSpotRouter();
exports.default = capacityTypeSpotRouter.router;
