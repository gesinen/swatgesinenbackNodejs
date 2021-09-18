import { Router, Request, Response } from 'express';
import capacityDevicesController from '../../controllers/capacity_module/capacityDevicesController';

class CapacityModuleRoutes {

    public router: Router = Router();

    constructor() {
        this.createCapacityDeviceAction();
        this.getCapacityDeviceByIdAction();
        this.updateCapacityDeviceAction();
        this.getUserCapacityDevicesAction();
    }

    /**
     * Create capacity device
     * POST ('/')
     */
    public createCapacityDeviceAction = () => this.router.post('/', (req: Request, res: Response) => {
        const params = req.body;

        capacityDevicesController.createCapacityDevice(params.name, params.description, parseInt(params.sensor_id), parseInt(params.user_id), parseInt(params.capacity), parseInt(params.max_capacity), params.type, params.address, params.coordinates_x, params.coordinates_y)
            .then( response => {
                res.send(response)
            })
            .catch( err => {
                /*res.send({
                    http: 401,
                    status: 'Failed',
                    error: err
                })*/
                res.send(err)
            })
    })

    /**
     * Get a capacity device with an ID
     * GET ('/:id') 
     */
    public getCapacityDeviceByIdAction = () => this.router.get('/:id', (req: Request, res: Response) => {
        capacityDevicesController.getCapacityDeviceById(parseInt(req.params.id))
            .then( response => {
                res.send(response)
            })
            .catch( err => {
                /*res.send({
                    http: 401,
                    status: 'Failed',
                    error: err
                })*/
                res.send(err)
            })
    })

    /**
     * Update a capacity device
     * PUT ('/:id')
     */
    public updateCapacityDeviceAction = () => this.router.put('/:id', (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const params = req.body;

        capacityDevicesController.updateCapacityDevice(id, params.name, params.description, parseInt(params.sensor_id), params.type, params.address, params.coordinates_x, params.coordinates_y)
        .then( response => {
            res.send(response)
        })
        .catch( err => {
            res.send(err)
        })
    })

    /**
     * Get capacity devices of a user
     * GET ('/:userId') 
     */
     public getUserCapacityDevicesAction = () => this.router.get('/list/:userId', (req: Request, res: Response) => {
        capacityDevicesController.getUserCapacityDevices(parseInt(req.params.userId))
            .then( response => {
                res.send(response)
            })
            .catch( err => {
                res.send(err)
            })
    })

}

const capacityModuleRoutes = new CapacityModuleRoutes();
export default capacityModuleRoutes.router;