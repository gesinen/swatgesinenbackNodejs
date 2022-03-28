// @ts-nocheck
import express, { Application } from 'express';
import morgan from 'morgan';
import app from 'insure-express';
import cors from 'cors';

import usersRouter from './routes/usersRouter';
import waterDevicesRouter from './routes/water_module/waterDevicesRouter';
import waterUsersRouter from './routes/water_module/waterUsersRouter';
import waterObservationsRouter from './routes/water_module/waterObservationsRouter';
import waterGroupsRouter from './routes/water_module/waterGroupsRouter';
import capacityDevicesRouter from './routes/capacity_module/capacityDevicesRouter';
import serverRouter from "./routes/servers_module/serverRouter";
import sensorRouter from "./routes/sensor_module/sensorRouter";
import loraDashboardRouter from './routes/lora_module/loraDashboardRouter';
import irrigationDeviceRouter from './routes/irrigation_module/irrigationDeviceRouter';
import irrigationDeviceOutputRouter from './routes/irrigation_module/irrigationDeviceOutputRouter';
import irrigationDeviceInputRouter from './routes/irrigation_module/irrigationDeviceInputRouter';
import irrigationDeviceInputHistoryRouter from './routes/irrigation_module/irrigationDeviceInputHistoryRouter';
import capacityCartelRouter from './routes/capacity_module/capacityCartelRouter';
import capacityCartelLineRouter from './routes/capacity_module/capacityCartelLineRouter';
import capacityParking from './controllers/capacity_module/capacityParking';
import capacityParkingRouter from './routes/capacity_module/capacityParkingRouter';
import capacityTypeRibbonRouter from './routes/capacity_module/capacityTypeRibbonRouter';
import capacityTypeSpotRouter from './routes/capacity_module/capacityTypeSpotRouter';

class Server {

    public app: Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    config(): void {
        this.app.set('port', process.env.PORT || 8080);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }))
    }

    routes(): void {
        this.app.use('/v2/users', usersRouter);
        this.app.use('/v2/capacity/devices', capacityDevicesRouter);
        this.app.use('/v2/capacity/panels', capacityCartelRouter);
        this.app.use('/v2/capacity/panels/line', capacityCartelLineRouter);
        this.app.use('/v2/capacity/parkings', capacityParkingRouter);
        this.app.use('/v2/capacity/devices/ribbon', capacityTypeRibbonRouter);
        this.app.use('/v2/capacity/devices/spot', capacityTypeSpotRouter);
        this.app.use('/v2/water/devices', waterDevicesRouter);
        this.app.use('/v2/water/users', waterUsersRouter);
        this.app.use('/v2/water/observations', waterObservationsRouter);
        this.app.use('/v2/water/groups', waterGroupsRouter);
        this.app.use('/v2/server/', serverRouter);
        this.app.use('/v2/sensor/', sensorRouter);
        this.app.use('/v2/lora/dashboard', loraDashboardRouter);
        this.app.use('/v2/irrigation/devices', irrigationDeviceRouter);
        this.app.use('/v2/irrigation/devices/output', irrigationDeviceOutputRouter);
        this.app.use('/v2/irrigation/devices/input', irrigationDeviceInputRouter);
        this.app.use('/v2/irrigation/devices/input/history', irrigationDeviceInputHistoryRouter);

    }

    start(): void {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'))
        })

    }
}


const server = new Server();
server.start();
