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
const irrigationDeviceOutputController_1 = __importDefault(require("../../controllers/irrigation_module/irrigationDeviceOutputController"));
class IrrigationDeviceOutputRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        /**
         * Get the user data
         * GET ('/information/:id')
         */
        this.getIrrigationOutputDeviceById = () => this.router.get('/:id', (req, res) => {
            const id = parseInt(req.params.id);
            irrigationDeviceOutputController_1.default.getIrrigationOutputDeviceById(id)
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        /**
         * Get the user data
         * GET ('/information/:id')
         */
        this.getIrrigationOutputDeviceIntervalById = () => this.router.get('/intervals/:id', (req, res) => {
            const id = parseInt(req.params.id);
            irrigationDeviceOutputController_1.default.getIrrigationOutputDeviceIntervalById(id)
                .then(response => {
                res.send(response);
            })
                .catch(err => {
                res.send(err);
            });
        });
        /**
         * Get user related municipality_id
         * GET ('/municipality/{user_id}')
         * params user_id -> id of the user we want to get the municipality_id from
         */
        this.storeIrrigationOutputDevice = () => this.router.post('/', (req, res) => {
            const params = req.body;
            console.log("router store params");
            console.log(params);
            irrigationDeviceOutputController_1.default.storeIrrigationOutputDevice(params.irrigationDeviceId, params.sensorId, params.sensorIndex, params.intervals, params.status, params.name)
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        /**
         * Get user related municipality_id
         * GET ('/municipality/{user_id}')
         * params user_id -> id of the user we want to get the municipality_id from
         */
        this.deleteIrrigationOutputDevice = () => this.router.delete('/:id', (req, res) => {
            const id = parseInt(req.params.id);
            irrigationDeviceOutputController_1.default.deleteIrrigationOutputDevice(id)
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        /**
        * Get user related municipality_id
        * POST ('/municipality/{user_id}')
        * params user_id -> id of the user we want to get the municipality_id from
        */
        this.updateValvesConfig = () => this.router.post('/config/valves', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const params = req.body;
                console.log(params);
                let acumRes = 0;
                for (let i = 0; i < params.valves.length; i++) {
                    let res = yield irrigationDeviceOutputController_1.default.updateIrrigationOutputDeviceInterval(params.body.data.id, params.valves[i], params.valvesIndex[i]);
                    if (res.http == 200) {
                        acumRes++;
                    }
                    console.log("res", res);
                }
                if (params.valves.length == acumRes) {
                    res.send({
                        http: 200,
                        status: 'Success',
                        result: 'Irrigation device valve intervals updated succesfully'
                    });
                }
                else {
                    res.send({
                        http: 204,
                        status: 'Success',
                        result: 'Irrigation device valve intervals couldnt be updated'
                    });
                }
            }
            catch (error) {
                res.send(error);
            }
        }));
        /**
         * Get user related municipality_id
         * GET ('/municipality/{user_id}')
         * params user_id -> id of the user we want to get the municipality_id from
         */
        this.updateIrrigationOutputDevice = () => this.router.put('/', (req, res) => {
            console.log("update");
            const params = req.body;
            console.log(params);
            irrigationDeviceOutputController_1.default.updateIrrigationOutputDevice(params.id, params.irrigationDeviceId, params.sensorId, params.sensorIndex, params.intervals, params.status, params.name)
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        this.getIrrigationOutputDeviceById();
        this.storeIrrigationOutputDevice();
        this.deleteIrrigationOutputDevice();
        this.updateIrrigationOutputDevice();
        this.updateValvesConfig();
        this.getIrrigationOutputDeviceIntervalById();
    }
}
const irrigationDeviceOutputRouter = new IrrigationDeviceOutputRouter();
exports.default = irrigationDeviceOutputRouter.router;
