"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const waterGroupsController_1 = __importDefault(require("../../controllers/water_module/waterGroupsController"));
class WaterGroupsRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        /**
         * Get user related water_users
         * GET ('/:id')
         * params user_id -> id of the user we want to get users from
         */
        this.getWaterGroupsByUser = () => this.router.get('/:user_id', (req, res) => {
            const params = req.params;
            waterGroupsController_1.default.getWaterGroupsByUser(parseInt(params.user_id))
                .then(response => {
                res.send(response);
            })
                .catch(err => {
                res.send(err);
            });
        });
        /**
         * Get user related water_users
         * GET ('/root/:id')
         * params user_id -> id of the user we want to get users from
         */
        this.getWaterRootGroupByUser = () => this.router.get('/root/:user_id', (req, res) => {
            const params = req.params;
            waterGroupsController_1.default.getWaterRootGroupByUser(parseInt(params.user_id))
                .then(response => {
                res.send(response);
            })
                .catch(err => {
                res.send(err);
            });
        });
        /**
         * Get user related water_users
         * GET ('/root/:id')
         * params user_id -> id of the user we want to get users from
         */
        this.getWaterGroupByParent = () => this.router.get('/parent/:group_id', (req, res) => {
            const params = req.params;
            waterGroupsController_1.default.getWaterGroupsByParent(parseInt(params.group_id))
                .then(response => {
                res.send(response);
            })
                .catch(err => {
                res.send(err);
            });
        });
        this.getWaterGroupsByUser();
        this.getWaterRootGroupByUser();
        this.getWaterGroupByParent();
    }
}
const waterGroupsRoutes = new WaterGroupsRouter();
exports.default = waterGroupsRoutes.router;
