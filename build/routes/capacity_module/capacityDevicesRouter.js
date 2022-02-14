"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const capacityDevicesController_1 = __importDefault(require("../../controllers/capacity_module/capacityDevicesController"));
class CapacityDevicesRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        /**
         * Create capacity device
         * POST ('/')
         */
        this.createCapacityDeviceAction = () => this.router.post('/', (req, res) => {
            const params = req.body;
            capacityDevicesController_1.default.createCapacityDevice(parseInt(params.sensorId), params.name, params.description, params.latitude, params.longitude, params.authToken, params.provider, parseInt(params.userId), params.type, params.parkingId)
                .then(response => {
                res.send(response);
            })
                .catch(err => {
                res.send(err);
            });
        });
        /**
         * Import capacity device spot
         * POST ('/')
         *
        public importCapacityDevicesAction = () => this.router.post('/import/spot', (req: Request, res: Response) => {
            const params = req.body;
            console.log(params)
            capacityDevicesController.importCapacityDevicesLazo(params.capacity_devices, params.user_id)
                .then(response => {
                    res.send(response)
                })
                .catch(err => {
                    /*res.send({
                        http: 401,
                        status: 'Failed',
                        error: err
                    })
                    res.send(err)
                })
        })*/
        /**
         * Import capacity device parking_area
         * POST ('/')
         *
        public importCapacityDevicesParkingAreaAction = () => this.router.post('/import/parking_area', (req: Request, res: Response) => {
            const params = req.body;
            console.log(params);
            if (params.device_id) {
                capacityDevicesController.importCapacityDevices(params.capacity_devices, params.user_id)
                    .then(response => {
                        res.send(response)
                    })
                    .catch(err => {
                        /*res.send({
                            http: 401,
                            status: 'Failed',
                            error: err
                        })*
                        res.send(err)
                    })
            } else {
                capacityDevicesController.importCapacityDevicesLazo(params.capacity_devices, params.user_id)
                    .then(response => {
                        res.send(response)
                    })
                    .catch(err => {
                        /*res.send({
                            http: 401,
                            status: 'Failed',
                            error: err
                        })*
                        res.send(err)
                    })
            }
    
        })*/
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
                res.send(err);
            });
        });
        this.removeCapacityDevice = () => this.router.delete('/:id', (req, res) => {
            capacityDevicesController_1.default.deleteCapacityDevice(parseInt(req.params.id))
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
            capacityDevicesController_1.default.updateCapacityDevice(id, params.name, params.description, parseInt(params.sensorId), params.authToken, params.provider, params.type, params.address, params.latitude, params.longitude, params.ribbonDeviceId, params.parkingId, params.spotDeviceId, params.status)
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
        this.getUserCapacityDevicesListAction = () => this.router.get('/:userId/:pageSize/:pageIndex', (req, res) => {
            capacityDevicesController_1.default.getUserCapacityDevicesList(parseInt(req.params.userId), parseInt(req.params.pageSize), parseInt(req.params.pageIndex))
                .then(response => {
                res.send(response);
            })
                .catch(err => {
                res.send(err);
            });
        });
        /**
         * Get most capacity devices of a user
         * GET ('/most/:userId')
         */
        this.getMostCapacityDevicesAction = () => this.router.get('/most/:userId', (req, res) => {
            capacityDevicesController_1.default.getMostCapacityDevices(parseInt(req.params.userId))
                .then(response => {
                res.send(response);
            })
                .catch(err => {
                res.send(err);
            });
        });
        /**
         * Get less capacity devices of a user
         * GET ('/less/:userId')
         */
        this.getLessCapacityDevicesAction = () => this.router.get('/less/:userId', (req, res) => {
            capacityDevicesController_1.default.getLessCapacityDevices(parseInt(req.params.userId))
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
        this.getUserCapacityDevicesListAction();
        this.getMostCapacityDevicesAction();
        this.getLessCapacityDevicesAction();
        this.removeCapacityDevice();
        //this.importCapacityDevicesAction();
        //this.importCapacityDevicesParkingAreaAction();
    }
}
const capacityDevicesRoutes = new CapacityDevicesRouter();
exports.default = capacityDevicesRoutes.router;
