"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const loraDashboardController_1 = __importDefault(require("../../controllers/lora_module/loraDashboardController"));
class LoraDashboardRouter {
    // Constructor
    constructor() {
        // Router
        this.router = (0, express_1.Router)();
        // Controller
        this.loraDashboardController = new loraDashboardController_1.default();
        // Methods
        this.getNetworkServerGeneralInformation = () => this.router.get('/information/:userId', (req, res) => {
            const userId = parseInt(req.params.userId);
            this.loraDashboardController.getNetworkServerGeneralInformation(userId)
                .then(response => {
                res.status(200).send(response);
            })
                .catch(err => {
                res.status(401).send(err);
            });
        });
        this.getNetworkServerSensorStatus = () => this.router.get('/sensor/:userId', (req, res) => {
            const userId = parseInt(req.params.userId);
            this.loraDashboardController.getNetworkServerSensorStatus(userId)
                .then(response => {
                res.status(200).send(response);
            })
                .catch(err => {
                res.status(401).send(err);
            });
        });
        this.getNetworkServerSensorSignal = () => this.router.get('/signal/:userId', (req, res) => {
            const userId = parseInt(req.params.userId);
            this.loraDashboardController.getNetworkServerSensorSignal(userId)
                .then(response => {
                res.status(200).send(response);
            })
                .catch(err => {
                res.status(401).send(err);
            });
        });
        this.getNetworkServerPackages = () => this.router.get('/packages/:userId', (req, res) => {
            const userId = parseInt(req.params.userId);
            this.loraDashboardController.getNetworkServerPackages(userId)
                .then(response => {
                res.status(200).send(response);
            })
                .catch(err => {
                res.status(401).send(err);
            });
        });
        this.getNetworkServerGeneralInformationRoot = () => this.router.get('/root/information', (req, res) => {
            this.loraDashboardController.getNetworkServerGeneralInformationRoot()
                .then(response => {
                res.status(200).send(response);
            })
                .catch(err => {
                res.status(401).send(err);
            });
        });
        this.getNetworkServerSensorStatusRoot = () => this.router.get('/root/sensor', (req, res) => {
            this.loraDashboardController.getNetworkServerSensorStatusRoot()
                .then(response => {
                res.status(200).send(response);
            })
                .catch(err => {
                res.status(401).send(err);
            });
        });
        this.getNetworkServerSensorSignalRoot = () => this.router.get('/root/signal', (req, res) => {
            const userId = parseInt(req.params.userId);
            this.loraDashboardController.getNetworkServerSensorSignalRoot()
                .then(response => {
                res.status(200).send(response);
            })
                .catch(err => {
                res.status(401).send(err);
            });
        });
        this.getNetworkServerPackagesRoot = () => this.router.get('/root/packages', (req, res) => {
            const userId = parseInt(req.params.userId);
            this.loraDashboardController.getNetworkServerPackagesRoot()
                .then(response => {
                res.status(200).send(response);
            })
                .catch(err => {
                res.status(401).send(err);
            });
        });
        this.getNetworkServerGeneralInformationSelected = () => this.router.get('/information/gateway/:gatewayId', (req, res) => {
            const gatewayId = parseInt(req.params.gatewayId);
            this.loraDashboardController.getNetworkServerGeneralInformationSelected(gatewayId)
                .then(response => {
                res.status(200).send(response);
            })
                .catch(err => {
                res.status(401).send(err);
            });
        });
        this.getNetworkServers = () => this.router.get('/network_servers/:userId', (req, res) => {
            const userId = parseInt(req.params.userId);
            this.loraDashboardController.getNetworkServers(userId)
                .then(response => {
                console.log('getNetworkServers', response);
                res.status(200).send(response);
            })
                .catch(err => {
                res.status(401).send(err);
            });
        });
        this.getNetworkServerSensorStatusSelected = () => this.router.get('/sensor/gateway/:gatewayId', (req, res) => {
            const userId = parseInt(req.params.gatewayId);
            this.loraDashboardController.getNetworkServerSensorStatusSelected(userId)
                .then(response => {
                console.log('getNetworkServerSensorStatus', response);
                res.status(200).send(response);
            })
                .catch(err => {
                res.status(401).send(err);
            });
        });
        this.getNetworkServerSensorSignalSelected = () => this.router.get('/signal/gateway/:gatewayId', (req, res) => {
            const userId = parseInt(req.params.gatewayId);
            this.loraDashboardController.getNetworkServerSensorSignalSelected(userId)
                .then(response => {
                console.log('getNetworkServerSensorSignal', response);
                res.status(200).send(response);
            })
                .catch(err => {
                res.status(401).send(err);
            });
        });
        this.getNetworkServerPackagesSelected = () => this.router.get('/packages/gateway/:gatewayId', (req, res) => {
            const userId = parseInt(req.params.gatewayId);
            this.loraDashboardController.getNetworkServerPackagesSelected(userId)
                .then(response => {
                console.log('getNetworkServerPackages', response);
                res.status(200).send(response);
            })
                .catch(err => {
                res.status(401).send(err);
            });
        });
        this.getNetworkServerGeneralInformation();
        this.getNetworkServerSensorStatus();
        this.getNetworkServerSensorSignal();
        this.getNetworkServerPackages();
        this.getNetworkServerGeneralInformationRoot();
        this.getNetworkServerSensorStatusRoot();
        this.getNetworkServerSensorSignalRoot();
        this.getNetworkServerPackagesRoot();
        this.getNetworkServers();
        this.getNetworkServerGeneralInformationSelected();
        this.getNetworkServerSensorStatusSelected();
        this.getNetworkServerSensorSignalSelected();
        this.getNetworkServerPackagesSelected();
    }
}
const loraDashboardRouter = new LoraDashboardRouter();
exports.default = loraDashboardRouter.router;
