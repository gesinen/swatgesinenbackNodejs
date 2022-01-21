import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';

import usersRouter from './routes/usersRouter';
import waterDevicesRouter from './routes/water_module/waterDevicesRouter';
import waterUsersRouter from './routes/water_module/waterUsersRouter';
import waterObservationsRouter from './routes/water_module/waterObservationsRouter';
import waterGroupsRouter from './routes/water_module/waterGroupsRouter';
import capacityDevicesRouter from './routes/capacity_module/capacityDevicesRouter';
import loraDashboardRouter from './routes/lora_module/loraDashboardRouter';

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
        this.app.use(express.urlencoded({extended: false}))
    }

    routes(): void {
        this.app.use('/v2/users', usersRouter);
        this.app.use('/v2/capacity/devices', capacityDevicesRouter);
        this.app.use('/v2/water/devices', waterDevicesRouter);
        this.app.use('/v2/water/users', waterUsersRouter);
        this.app.use('/v2/water/observations', waterObservationsRouter);
        this.app.use('/v2/water/groups', waterGroupsRouter);
        this.app.use('/v2/lora/dashboard', loraDashboardRouter);
    }

    start(): void {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'))
        })
    }
}

const server = new Server();
server.start();
