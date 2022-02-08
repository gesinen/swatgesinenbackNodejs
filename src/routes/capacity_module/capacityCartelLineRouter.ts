import { Router, Request, Response } from 'express';
import capacityCartelLineController from '../../controllers/capacity_module/capacityCartelLine';

class CapacityCartelLineRouter {

    public router: Router = Router();

    constructor() {
        this.createCapacityDeviceAction();
        this.getCapacityDeviceByIdAction();
        this.updateCapacityDeviceAction();
        this.removeCapacityDevice();
    }

    /**
     * Create capacity device
     * POST ('/')
     */
    public createCartelLine = () => this.router.post('/', (req: Request, res: Response) => {
        const params = req.body;

        capacityDevicesController.createCapacityDevice(params.name, params.description, parseInt(params.sensor_id), parseInt(params.user_id), 0, parseInt(params.max_capacity), params.type, params.address, params.coordinates_x, params.coordinates_y)
            .then(response => {
                res.send(response)
            })
            .catch(err => {
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
    public getFreeCartelLines = () => this.router.get('/:id', (req: Request, res: Response) => {
        capacityDevicesController.getCapacityDeviceById(parseInt(req.params.id))
            .then(response => {
                res.send(response)
            })
            .catch(err => {
                /*res.send({
                    http: 401,
                    status: 'Failed',
                    error: err
                })*/
                res.send(err)
            })
    })

    public removeCapacityDevice = () => this.router.delete('/:id', (req: Request, res: Response) => {
        capacityDevicesController.deleteCapacityDevice(parseInt(req.params.id))
            .then(response => {
                res.send(response)
            })
            .catch(err => {
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

        capacityDevicesController.updateCapacityDevice(id, params.name, params.description, parseInt(params.sensor_id), parseInt(params.capacity), parseInt(params.max_capacity), params.type, params.address, params.coordinates_x, params.coordinates_y)
            .then(response => {
                res.send(response)
            })
            .catch(err => {
                res.send(err)
            })
    })

}

const capacityCartelLineRouter = new CapacityCartelLineRouter();
export default capacityCartelLineRouter.router;