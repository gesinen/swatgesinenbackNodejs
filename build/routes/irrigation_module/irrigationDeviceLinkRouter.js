"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const irrigationDeviceLinkController_1 = __importDefault(require("../../controllers/irrigation_module/irrigationDeviceLinkController"));
class IrrigationDeviceLinkRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        /**
         * Get the user data
         * GET ('/information/:id')
         */
        this.getIrrigationDeviceLinkById = () => this.router.get("/:id", (req, res) => {
            const id = parseInt(req.params.id);
            irrigationDeviceLinkController_1.default
                .getIrrigationDeviceLinkById(id)
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
        this.storeIrrigationDeviceLink = () => this.router.post("/", (req, res) => {
            const params = req.body;
            console.log("router store params");
            console.log(params);
            irrigationDeviceLinkController_1.default
                .storeIrrigationDeviceLink(params.irrigationDeviceInputId, params.irrigationDeviceOutputId, params.irrigationDeviceId)
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
        this.deleteIrrigationDeviceLink = () => this.router.delete("/:id", (req, res) => {
            const id = parseInt(req.params.id);
            irrigationDeviceLinkController_1.default
                .deleteIrrigationLinkDevice(id)
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
        this.updateIrrigationDeviceLink = () => this.router.put("/", (req, res) => {
            console.log("update");
            const params = req.body;
            console.log(params);
            irrigationDeviceLinkController_1.default
                .updateIrrigationDeviceLink(params.linkDeviceId, params.irrigationDeviceInputId, params.irrigationDeviceOutputId)
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        this.getIrrigationDeviceLinkById();
        this.storeIrrigationDeviceLink();
        this.deleteIrrigationDeviceLink();
        this.updateIrrigationDeviceLink();
    }
}
const irrigationDeviceInputRouter = new IrrigationDeviceLinkRouter();
exports.default = irrigationDeviceInputRouter.router;
