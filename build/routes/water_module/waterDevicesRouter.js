"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const waterDevicesController_1 = __importDefault(require("../../controllers/water_module/waterDevicesController"));
class WaterDevicesRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.createWaterDeviceAction = () => this.router.post('/', (req, res) => {
            const params = req.body;
            waterDevicesController_1.default.createWaterDevice(params.name, params.sensor_id, params.variable_name, params.water_group_id, params.water_user_id, params.user_id, params.municipality_id, params.description, params.units, params.contract_number, params.device_diameter, params.sewer_rate_id, params.installation_address)
                .then(response => {
                res.send(response);
            })
                .catch(err => {
                res.send(err);
            });
        });
        this.getWaterDeviceListingAction = () => this.router.get('/page/:user_id/:page_index/:page_size', (req, res) => {
            const params = req.params;
            waterDevicesController_1.default.getWaterDevicesListing(parseInt(params.user_id), parseInt(params.page_index), parseInt(params.page_size))
                .then(response => {
                res.send(response);
            })
                .catch(err => {
                res.send(err);
            });
        });
        this.getWaterDeviceByIdAction = () => this.router.get('/:deviceId', (req, res) => {
            const params = req.params;
            waterDevicesController_1.default.getWaterDeviceById(parseInt(params.deviceId))
                .then(response => {
                res.send(response);
            })
                .catch(err => {
                res.send(err);
            });
        });
        /**
         * Import observations file
         * POST ('/import/{userId}')
         * userId -> id of the user doing the import
         */
        this.importFileAction = () => this.router.post('/import/:userId', (req, res) => {
            const params = req.body;
            //console.log(req.body)
            //console.log("importFileAction -- waterDevicesRouter")
            waterDevicesController_1.default.importFile(params.file_to_upload, params.municipality_id, req.params.userId, params.provider, params.authToken, params.selectedUnitValue)
                .then(response => {
                res.send(response);
            })
                .catch(err => {
                res.send(err);
            });
        });
        this.createWaterDeviceAction();
        this.getWaterDeviceListingAction();
        this.importFileAction();
        this.getWaterDeviceByIdAction();
    }
}
const waterDevicesRoutes = new WaterDevicesRouter();
exports.default = waterDevicesRoutes.router;
