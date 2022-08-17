"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const capacityParking_1 = __importDefault(require("../../controllers/capacity_module/capacityParking"));
class CapacityParkingRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        /**
         * Create capacity device
         * POST ('/')
         */
        this.createParking = () => this.router.post("/", (req, res) => {
            const params = req.body;
            capacityParking_1.default
                .createParking(params.name, params.description, params.currentCapacity, params.maxCapacity, params.address, params.userId)
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
        this.getParkingList = () => this.router.get("/:userId/:pageSize/:pageIndex", (req, res) => {
            capacityParking_1.default
                .getParkingList(parseInt(req.params.userId), parseInt(req.params.pageSize), parseInt(req.params.pageIndex))
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
        this.getParkingById = () => this.router.get("/:id", (req, res) => {
            capacityParking_1.default
                .getParking(parseInt(req.params.id))
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        /**
       * Get a capacity device Parking List
       * GET
       */
        this.getParkingListUsingAuthToken = () => this.router.get("/byAuth/list/:pageSize/:pageIndex", (req, res) => {
            capacityParking_1.default
                .getParkingListByAuthToken(parseInt(req.params.pageSize), parseInt(req.params.pageIndex), req.headers.authorization, req.headers.provider)
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        /**
       * Get a capacity device with an ID Using Auth Token for Mobile Application
       * GET ('/:id')
       */
        this.getParkingByIdUsingAuthToken = () => this.router.get("/byAuth/:id", (req, res) => {
            capacityParking_1.default
                .getParkingByAuthToken(parseInt(req.params.id), req.headers.authorization, req.headers.provider)
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        /**
         * Update a capacity device for mobile Application
         * PUT ('/:id')
         */
        this.updateParkingCapacityByAuthToken = () => this.router.put("/byAuth/:id", (req, res) => {
            const id = parseInt(req.params.id);
            const params = req.body;
            capacityParking_1.default
                .updateParkingCapacityByAuthToken(id, req.headers.authorization, req.headers.provider, params.currentCapacity, params.maxCapacity)
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        this.deleteParking = () => this.router.delete("/:id", (req, res) => {
            capacityParking_1.default
                .deleteCapacityParking(parseInt(req.params.id))
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
        this.updateParkingCapacity = () => this.router.put("/spaces/:id", (req, res) => {
            const id = parseInt(req.params.id);
            const params = req.body;
            capacityParking_1.default
                .updateParkingCapacity(id, params.currentCapacity, params.maxCapacity)
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
        this.updateParkingActualCapacity = () => this.router.put("/currentspaces/:id", (req, res) => {
            const id = parseInt(req.params.id);
            const params = req.body;
            capacityParking_1.default
                .updateParkingActualCapacity(id, params.currentCapacity)
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
        this.updateCapacityDeviceAction = () => this.router.put("/:id", (req, res) => {
            const id = parseInt(req.params.id);
            const params = req.body;
            capacityParking_1.default
                .updateCapacityParking(id, params.name, params.description, params.currentCapacity, params.maxCapacity, params.address)
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        this.getParkingSensors = () => this.router.get("/mqtt/:id", (req, res) => {
            const id = parseInt(req.params.id);
            capacityParking_1.default
                .getParkingSensors(id)
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        this.getParkingById();
        this.getParkingList();
        this.createParking();
        this.deleteParking();
        this.updateParkingCapacity();
        this.updateCapacityDeviceAction();
        this.updateParkingActualCapacity();
        this.getParkingSensors();
        //for Mobile Application
        this.getParkingByIdUsingAuthToken();
        this.getParkingListUsingAuthToken();
        this.updateParkingCapacityByAuthToken();
    }
}
const capacityParkingRouter = new CapacityParkingRouter();
exports.default = capacityParkingRouter.router;
