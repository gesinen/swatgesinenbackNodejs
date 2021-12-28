import { Router, Request, Response } from 'express';
import capacityDevicesController from '../../controllers/capacity_module/capacityDevicesController';

class CapacityDevicesRouter {

    public router: Router = Router();

    constructor() {
        this.createCapacityDeviceAction();
        this.getCapacityDeviceByIdAction();
        this.updateCapacityDeviceAction();
        this.getUserCapacityDevicesAction();
        this.getMostCapacityDevicesAction();
        this.getLessCapacityDevicesAction();
        this.removeCapacityDevice();
    }

    /**
     * Create capacity device
     * POST ('/')
     */
    public createCapacityDeviceAction = () => this.router.post('/', (req: Request, res: Response) => {
        const params = req.body;

        capacityDevicesController.createCapacityDevice(params.name, params.description, parseInt(params.sensor_id), parseInt(params.user_id), 0, parseInt(params.max_capacity), params.type, params.address, params.coordinates_x, params.coordinates_y)
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

    public removeCapacityDevice = () => this.router.delete('/:id', (req: Request, res: Response) => {
        capacityDevicesController.deleteCapacityDevice(parseInt(req.params.id))
            .then( response => {
                res.send(response)
            })
            .catch( err => {
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

    /**
     * Get most capacity devices of a user
     * GET ('/most/:userId') 
     */
    public getMostCapacityDevicesAction = () => this.router.get('/most/:userId', (req: Request, res: Response) => {
        capacityDevicesController.getMostCapacityDevices(parseInt(req.params.userId))
            .then(response => {
                res.send(response)
            })
            .catch(err => {
                res.send(err)
            })
    })

    /**
     * Get less capacity devices of a user
     * GET ('/less/:userId') 
     */
     public getLessCapacityDevicesAction = () => this.router.get('/less/:userId', (req: Request, res: Response) => {
        capacityDevicesController.getLessCapacityDevices(parseInt(req.params.userId))
            .then(response => {
                res.send(response)
            })
            .catch(err => {
                res.send(err)
            })
    })

}

const capacityDevicesRoutes = new CapacityDevicesRouter();
export default capacityDevicesRoutes.router;