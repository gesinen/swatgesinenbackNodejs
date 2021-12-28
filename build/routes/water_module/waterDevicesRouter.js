"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        this.updateWaterDevicesFromExcel = () => this.router.post('/update/', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const params = req.body;
            try {
                console.log("updateWaterDevices", params);
                let waterDevicesWithErr = [];
                let contador = 0;
                let successCount = 0;
                for (const device of params) {
                    let updateRes = yield waterDevicesController_1.default.updateWaterDeviceByName(device.name, device.variableName, device.description, device.units, device.contractNumber, device.deviceDiameter, device.installAddress, device.numContador, device.numModuleLora, device.provider, device.authToken);
                    if (updateRes.http != 200 || updateRes.result.affectedRows == 0) {
                        waterDevicesWithErr.push(device.name);
                        contador++;
                    }
                    else {
                        successCount++;
                    }
                    console.log(updateRes);
                }
                //params.forEach(async (device: any) => { });
                res.send({
                    http: 200,
                    status: 'Success',
                    res: {
                        notInsertedDevices: waterDevicesWithErr,
                        notInsertedDevicesNumber: contador,
                        updateSuccededNum: successCount
                    }
                });
            }
            catch (error) {
                res.send(error);
                console.log(error);
            }
        }));
        this.updateWaterDeviceByNameAction = () => this.router.put('/name/', (req, res) => {
            const params = req.body;
            waterDevicesController_1.default.updateWaterDeviceByName(params.name, params.variableName, params.description, params.units, params.contractNumber, params.deviceDiameter, params.installAddress, params.numContador, params.numModuleLora, params.provider, params.authToken)
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
            //console.log("importFileAction -- waterDevicesRouter")
            //console.log(req.body)
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
        this.updateWaterDeviceByNameAction();
        this.updateWaterDevicesFromExcel();
    }
}
const waterDevicesRoutes = new WaterDevicesRouter();
exports.default = waterDevicesRoutes.router;
