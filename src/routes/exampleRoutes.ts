import { Router, Request, Response } from 'express';
import { exampleController } from '../controllers/exampleController';

class CapacityModuleRoutes {
    
    public router: Router = Router();

    constructor() {
        this.getDeviceByIdAction();
    }

    public getDeviceByIdAction = () => this.router.get('/device/:id', exampleController.getDeviceById)
}

const capacityModuleRoutes = new CapacityModuleRoutes();
export default capacityModuleRoutes.router;