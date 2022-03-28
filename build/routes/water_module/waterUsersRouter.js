"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const waterUsersController_1 = __importDefault(require("../../controllers/water_module/waterUsersController"));
const waterUsersController_2 = __importDefault(require("../../controllers/water_module/waterUsersController"));
class WaterUsersRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        /**
         * Get user related water_users
         * GET ('/all/:user_id')
         * params user_id -> id of the user we want to get users from
         */
        this.getAllWaterUsersAction = () => this.router.get("/all/:user_id", (req, res) => {
            const params = req.params;
            waterUsersController_1.default
                .getAllWaterUsers(parseInt(params.user_id))
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        /**
         * Get user related water_users
         * GET ('/userByNif/:nif')
         * params : nif -> user nif
         */
        this.getUserByNif = () => this.router.get("/userByNif/:nif", (req, res) => {
            const params = req.params;
            waterUsersController_1.default
                .getUserByNif(params.nif)
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        /**
         * Get user related water_devices
         * GET ('/device/{user_id}')
         * params user_id -> id of the user we want to get devices from
         */
        this.getWaterUserDeviceAction = () => this.router.get("/device/:user_id", (req, res) => {
            const user_id = req.params.user_id;
            waterUsersController_1.default
                .getWaterUserDevice(parseInt(user_id))
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
        this.getWaterUserMunicipalityIdAction = () => this.router.get("/municipality/:user_id", (req, res) => {
            const user_id = req.params.user_id;
            waterUsersController_1.default
                .getWaterUserMunicipalityId(parseInt(user_id))
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        /**
         * Import observations file
         * POST ('/import')
         */
        this.importFileAction = () => this.router.post("/import/:user_id/:municipality_id", (req, res) => {
            const user_id = req.params.user_id;
            const municipality_id = req.params.municipality_id;
            const params = req.body;
            //console.log("importFileAction -- usersRouter")
            //console.log(req.body)
            waterUsersController_2.default
                .importFile(params, user_id, municipality_id)
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        this.getAllWaterUsersAction();
        this.getWaterUserDeviceAction();
        this.importFileAction();
        this.getWaterUserMunicipalityIdAction();
        this.getUserByNif();
    }
}
const waterUsersRoutes = new WaterUsersRouter();
exports.default = waterUsersRoutes.router;
