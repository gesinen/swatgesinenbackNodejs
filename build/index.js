"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const usersRouter_1 = __importDefault(require("./routes/usersRouter"));
const waterDevicesRouter_1 = __importDefault(require("./routes/water_module/waterDevicesRouter"));
const waterUsersRouter_1 = __importDefault(require("./routes/water_module/waterUsersRouter"));
const waterObservationsRouter_1 = __importDefault(require("./routes/water_module/waterObservationsRouter"));
const waterGroupsRouter_1 = __importDefault(require("./routes/water_module/waterGroupsRouter"));
const capacityDevicesRouter_1 = __importDefault(require("./routes/capacity_module/capacityDevicesRouter"));
const serverRouter_1 = __importDefault(require("./routes/servers_module/serverRouter"));
const sensorRouter_1 = __importDefault(require("./routes/sensor_module/sensorRouter"));
const loraDashboardRouter_1 = __importDefault(require("./routes/lora_module/loraDashboardRouter"));
const irrigationDeviceRouter_1 = __importDefault(require("./routes/irrigation_module/irrigationDeviceRouter"));
const irrigationDeviceOutputRouter_1 = __importDefault(require("./routes/irrigation_module/irrigationDeviceOutputRouter"));
const irrigationDeviceInputRouter_1 = __importDefault(require("./routes/irrigation_module/irrigationDeviceInputRouter"));
const irrigationDeviceInputHistoryRouter_1 = __importDefault(require("./routes/irrigation_module/irrigationDeviceInputHistoryRouter"));
const capacityCartelRouter_1 = __importDefault(require("./routes/capacity_module/capacityCartelRouter"));
const capacityCartelLineRouter_1 = __importDefault(require("./routes/capacity_module/capacityCartelLineRouter"));
const capacityParkingRouter_1 = __importDefault(require("./routes/capacity_module/capacityParkingRouter"));
const capacityTypeRibbonRouter_1 = __importDefault(require("./routes/capacity_module/capacityTypeRibbonRouter"));
const capacityTypeSpotRouter_1 = __importDefault(require("./routes/capacity_module/capacityTypeSpotRouter"));
const boilerRouter_1 = __importDefault(require("./routes/boiler_module/boilerRouter"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.config();
        this.routes();
    }
    config() {
        this.app.set('port', process.env.PORT || 8080);
        this.app.use((0, morgan_1.default)('dev'));
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
    }
    routes() {
        this.app.use('/v2/users', usersRouter_1.default);
        this.app.use('/v2/capacity/devices', capacityDevicesRouter_1.default);
        this.app.use('/v2/capacity/panels', capacityCartelRouter_1.default);
        this.app.use('/v2/capacity/panels/line', capacityCartelLineRouter_1.default);
        this.app.use('/v2/capacity/parkings', capacityParkingRouter_1.default);
        this.app.use('/v2/capacity/devices/ribbon', capacityTypeRibbonRouter_1.default);
        this.app.use('/v2/capacity/devices/spot', capacityTypeSpotRouter_1.default);
        this.app.use('/v2/water/devices', waterDevicesRouter_1.default);
        this.app.use('/v2/water/users', waterUsersRouter_1.default);
        this.app.use('/v2/water/observations', waterObservationsRouter_1.default);
        this.app.use('/v2/water/groups', waterGroupsRouter_1.default);
        this.app.use('/v2/server/', serverRouter_1.default);
        this.app.use('/v2/sensor/', sensorRouter_1.default);
        this.app.use('/v2/lora/dashboard', loraDashboardRouter_1.default);
        this.app.use('/v2/irrigation/devices', irrigationDeviceRouter_1.default);
        this.app.use('/v2/irrigation/devices/output', irrigationDeviceOutputRouter_1.default);
        this.app.use('/v2/irrigation/devices/input', irrigationDeviceInputRouter_1.default);
        this.app.use('/v2/irrigation/devices/input/history', irrigationDeviceInputHistoryRouter_1.default);
        this.app.use('/v2/boiler/devices', boilerRouter_1.default);
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }
}
const server = new Server();
server.start();
