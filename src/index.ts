import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';

import usersRouter from './routes/usersRouter';
import waterDevicesRouter from './routes/water_module/waterDevicesRouter';
import waterUsersRouter from './routes/water_module/waterUsersRouter';
import capacityDevicesRouter from './routes/capacity_module/capacityDevicesRouter';

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
    }

    start(): void {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'))
        })
    }
}

const server = new Server();
server.start();