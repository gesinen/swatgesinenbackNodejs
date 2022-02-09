import { Router, Request, Response } from 'express';
import capacityTypeRibbonController from '../../controllers/capacity_module/capacityTypeRibbon';

class CapacityTypeRibbonRouter {

    public router: Router = Router();

    constructor() {
        this.getAllCapacityRibbonDevicesInner();
        this.createCapacityRibbonDevice();
        this.removeCapacityRibbonDevice();
        //this.removeCapacityDevice();
    }

    /**
     * Create capacity device
     * POST ('/')
     */
     public createCapacityRibbonDevice = () => this.router.post('/', (req: Request, res: Response) => {
        const params = req.body;

        capacityTypeRibbonController.createCapacityRibbonDevice(parseInt(params.capacityDeviceId), parseInt(params.parkingId))
            .then(response => {
                res.send(response)
            })
            .catch(err => {
                res.send(err)
            })
    })

    /**
     * Get a capacity device with an ID
     * GET ('/:id') 
     */
    public getAllCapacityRibbonDevicesInner = () => this.router.get('/all', (req: Request, res: Response) => {
        capacityTypeRibbonController.getAllCapacityRibbonDevicesInner()
            .then(response => {
                res.send(response)
            })
            .catch(err => {
                res.send(err)
            })
    })

    public removeCapacityRibbonDevice = () => this.router.delete('/:id', (req: Request, res: Response) => {
        capacityTypeRibbonController.deleteCapacityRibbonDevice(parseInt(req.params.id))
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
     *
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
    })*/
}

const capacityTypeRibbonRouter = new CapacityTypeRibbonRouter();
export default capacityTypeRibbonRouter.router;