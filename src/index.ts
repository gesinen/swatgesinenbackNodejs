import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';

import capacityModuleRoutes from './routes/exampleRoutes';
import capacityDevicesRouter from './routes/capacity_module/capacityDevicesRouter';
import waterRouter from './routes/water_module/waterRouter';

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
        this.app.use('/v2/capacity/devices', capacityDevicesRouter);
        this.app.use('/v2/capacity/other', capacityModuleRoutes);
        this.app.use('/v2/water/', waterRouter);
    }

    start(): void {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'))
        })
    }
}

const server = new Server();
server.start();
