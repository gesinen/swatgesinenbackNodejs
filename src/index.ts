// @ts-nocheck
import express, { Application } from 'express';
import morgan from 'morgan';
import app from 'insure-express';
import cors from 'cors';
//import bodyParser from 'body-parser';

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
import cameraParkingRouter from './routes/capacity_module/cameraParkingRouter'
import capacityParkingRouter from './routes/capacity_module/capacityParkingRouter';
import capacityTypeRibbonRouter from './routes/capacity_module/capacityTypeRibbonRouter';
import capacityTypeSpotRouter from './routes/capacity_module/capacityTypeSpotRouter';
import boilerRouter from './routes/boiler_module/boilerRouter';
import waterDevicesColumnConfigRouter from './routes/water_module/waterDevicesColumnConfigRouter'
import historicRouter from './routes/historic_module/historicRouter';
import AlarmRouter from "./routes/Alarm/alarm.router";
import Alarm from "./models/Alarm/Alarm.model";
import BlockChainRouter from './routes/blockchain_module/blockchainRouter';
import ControlCabinetRouter from './routes/controlCabinet_module/controlCabinetRouter';
import publicLightingRouter from './routes/PublicLighting_module/publicLightingRouter';
import waterImstRouter from './routes/water_module/waterImstRouter';

//import AlarmChecker from "../services/Alarms/alarms.service";//"./Services/Alarms/alarms.service";
class Server {

    public app: Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    config(): void {
        this.app.set('port', process.env.PORT || 8080);//8080,8082
        this.app.use(morgan('dev'));
        this.app.use(cors());
       // this.app.use(express.json({limit: '50mb'}));
        this.app.use(express.json())
        this.app.use(express.urlencoded({extended: false}))
        //this.app.use(bodyParser.json({ limit: "50mb" }))
        this.app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}))
    }

    routes(): void {
        this.app.use('/v2/users', usersRouter);
        this.app.use('/v2/camera/parking', cameraParkingRouter);
        this.app.use('/v2/capacity/devices', capacityDevicesRouter);
        this.app.use('/v2/capacity/panels', capacityCartelRouter);
        this.app.use('/v2/capacity/panels/line', capacityCartelLineRouter);
        this.app.use('/v2/capacity/parkings', capacityParkingRouter);
        this.app.use('/v2/capacity/devices/ribbon', capacityTypeRibbonRouter);
        this.app.use('/v2/capacity/devices/spot', capacityTypeSpotRouter);
        this.app.use('/v2/water/columnConfig', waterDevicesColumnConfigRouter);
        this.app.use('/v2/water/devices', waterDevicesRouter);        
        this.app.use('/v2/water/users', waterUsersRouter);
        this.app.use('/v2/water/observations', waterObservationsRouter);
        this.app.use('/v2/water/groups', waterGroupsRouter);
        this.app.use('/v2/water/imst', waterImstRouter);
        this.app.use('/v2/server/', serverRouter);
        this.app.use('/v2/sensor/', sensorRouter);
        this.app.use('/v2/lora/dashboard', loraDashboardRouter);
        this.app.use('/v2/irrigation/devices', irrigationDeviceRouter);
        this.app.use('/v2/irrigation/devices/output', irrigationDeviceOutputRouter);
        this.app.use('/v2/irrigation/devices/input', irrigationDeviceInputRouter);
        this.app.use('/v2/irrigation/devices/input/history', irrigationDeviceInputHistoryRouter);
        this.app.use('/v2/boiler/devices', boilerRouter);
        this.app.use('/v2/historic', historicRouter);
        this.app.use('/v2/service/alarm', AlarmRouter);
        this.app.use('/v2/blockchain', BlockChainRouter);
        this.app.use('/v2/controlCabinetColor', ControlCabinetRouter);
        this.app.use('/v2/publicLighting', publicLightingRouter);
    }

    start(): void {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'))
        })
       // this.startServices()

    }
    /*startServices(): void {
        const alarmChecker = new AlarmChecker();
        alarmChecker.startCronJob();
        alarmChecker.checkAlarms()
      }*/
}


const server = new Server();
server.start();
