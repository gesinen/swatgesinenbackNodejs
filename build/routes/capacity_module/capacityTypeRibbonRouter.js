"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const capacityTypeRibbon_1 = __importDefault(require("../../controllers/capacity_module/capacityTypeRibbon"));
class CapacityTypeRibbonRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        /**
         * Create capacity device
         * POST ('/')
         */
        this.createCapacityRibbonDevice = () => this.router.post('/', (req, res) => {
            const params = req.body;
            capacityTypeRibbon_1.default.createCapacityRibbonDevice(parseInt(params.capacityDeviceId), parseInt(params.parkingId))
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
        this.getCapacityRibbonDeviceById = () => this.router.get('/:id', (req, res) => {
            capacityTypeRibbon_1.default.getCapacityRibbonDeviceById(parseInt(req.params.id))
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
        this.getAllCapacityRibbonDevicesInner = () => this.router.get('/all', (req, res) => {
            capacityTypeRibbon_1.default.getAllCapacityRibbonDevicesInner()
                .then(response => {
                res.send(response);
            })
                .catch(err => {
                res.send(err);
            });
        });
        this.removeCapacityRibbonDevice = () => this.router.delete('/:id', (req, res) => {
            capacityTypeRibbon_1.default.deleteCapacityRibbonDevice(parseInt(req.params.id))
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
        this.updateCapacityRibbonDevice = () => this.router.put('/:id', (req, res) => {
            const id = parseInt(req.params.id);
            const params = req.body;
            capacityTypeRibbon_1.default.updateCapacityRibbonDevice(id, params.parkingId)
                .then(response => {
                res.send(response);
            })
                .catch(err => {
                res.send(err);
            });
        });
        this.getCapacityRibbonDeviceById();
        this.getAllCapacityRibbonDevicesInner();
        this.createCapacityRibbonDevice();
        this.removeCapacityRibbonDevice();
        this.updateCapacityRibbonDevice();
    }
}
const capacityTypeRibbonRouter = new CapacityTypeRibbonRouter();
exports.default = capacityTypeRibbonRouter.router;
