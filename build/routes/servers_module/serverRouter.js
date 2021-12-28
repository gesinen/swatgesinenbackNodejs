"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const serverController_1 = __importDefault(require("../../controllers/servers_module/serverController"));
class ServerRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.getUserServerListAction = () => this.router.get('/list/:user_id', (req, res) => {
            const user_id = req.params.user_id;
            serverController_1.default.getUserServerList(user_id)
                .then(response => {
                res.send(response);
            })
                .catch(err => {
                res.send(err);
            });
        });
        this.getServerTokenAndProviderIdAction = () => this.router.get('/providerIdAndToken/:server_id', (req, res) => {
            const server_id = req.params.server_id;
            serverController_1.default.getServerTokenAndProviderId(parseInt(server_id))
                .then(response => {
                res.send(response);
            })
                .catch(err => {
                res.send(err);
            });
        });
        this.getGatewaysServerInfo = () => this.router.get('/gatewayServers/:gateway_mac', (req, res) => {
            const gatewayMac = req.params.gateway_mac;
            serverController_1.default.getGatewaysServerInfo(gatewayMac)
                .then(response => {
                res.send(response);
            })
                .catch(err => {
                res.send(err);
            });
        });
        this.createServerAndGatewayLinkAction = () => this.router.post('/createServerAndGatewayLink/', (req, res) => {
            const params = req.body;
            serverController_1.default.createServerAndGatewayLink(params.gateway_mac, params.server_id, params.pk_id)
                .then(response => {
                res.send(response);
            })
                .catch(err => {
                res.send(err);
            });
        });
        this.getSensorServerDetailAction = () => this.router.get('/sensor_server_detail/:sensorId', (req, res) => {
            const sensorId = req.params.sensorId;
            serverController_1.default.getSensorServerDetail(sensorId)
                .then(response => {
                res.send(response);
            })
                .catch(err => {
                res.send(err);
            });
        });
        this.getServerTokenAndProviderIdAction();
        this.getUserServerListAction();
        this.createServerAndGatewayLinkAction();
        this.getGatewaysServerInfo();
        this.getSensorServerDetailAction();
    }
}
const serverRoutes = new ServerRouter();
exports.default = serverRoutes.router;
