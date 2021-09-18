import { Router, Request, Response } from 'express';
import capacityDevicesController from '../../controllers/capacity_module/capacityDevicesController';

class CapacityModuleRoutes {

    public router: Router = Router();

    constructor() {
        this.createCapacityDeviceAction();
    }

    public createCapacityDeviceAction = () => this.router.post('/', (req: Request, res: Response) => {
        const params = req.body;

        capacityDevicesController.createCapacityDevice(params.name, params.description, parseInt(params.sensor_id), parseInt(params.user_id), parseInt(params.capacity), parseInt(params.max_capacity), params.type, params.address, params.coordinates_x, params.coordinates_y)
            .then( (response) => {
                res.send(response)
            })
            .catch( (err) => {
                res.send({
                    http: 401,
                    status: 'Failed',
                    error: err
                })
            })
    })

}

const capacityModuleRoutes = new CapacityModuleRoutes();
export default capacityModuleRoutes.router;