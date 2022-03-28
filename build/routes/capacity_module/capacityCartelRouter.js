"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const capacityCartel_1 = __importDefault(require("../../controllers/capacity_module/capacityCartel"));
class CapacityCartelRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        /**
         * Create capacity device
         * POST ('/')
         */
        this.createCartel = () => this.router.post("/", (req, res) => {
            const params = req.body;
            console.log("createCartelParams", params);
            capacityCartel_1.default
                .createCapacityCartel(parseInt(params.sensorId), params.name, params.description, params.latitude, params.longitude, parseInt(params.userId), params.cartelLines)
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        /**
         * Get a capacity device with an ID
         * GET ('/:id')
         */
        this.getCartel = () => this.router.get("/:userId/:pageSize/:pageIndex", (req, res) => {
            capacityCartel_1.default
                .getCapacityCartelList(parseInt(req.params.userId), parseInt(req.params.pageSize), parseInt(req.params.pageIndex))
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        /**
         * Get a capacity device with an ID
         * GET ('/:id')
         */
        this.getCartelById = () => this.router.get("/:id", (req, res) => {
            capacityCartel_1.default
                .getCartelById(parseInt(req.params.id))
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        this.deleteCartel = () => this.router.delete("/:id", (req, res) => {
            capacityCartel_1.default
                .deleteCapacityCartel(parseInt(req.params.id))
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        /**
         * Update a capacity device
         * PUT ('/:id')
         */
        this.updateCartel = () => this.router.put("/:id", (req, res) => {
            const id = parseInt(req.params.id);
            const params = req.body;
            capacityCartel_1.default
                .updateCapacityCartel(id, params.cartelLines, params.name, params.description, parseInt(params.sensorId), params.latitude, params.longitude, params.authToken, params.provider)
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        this.getCartel();
        this.getCartelById();
        this.createCartel();
        this.deleteCartel();
        this.updateCartel();
    }
}
const capacityCartelRouter = new CapacityCartelRouter();
exports.default = capacityCartelRouter.router;
