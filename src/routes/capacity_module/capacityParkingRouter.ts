import { Router, Request, Response } from 'express';
import capacityParkingController from '../../controllers/capacity_module/capacityParking';

class CapacityParkingRouter {

    public router: Router = Router();

    constructor() {
        this.getParkingList();
        this.createParking();
        this.deleteParking();
        this.updateParkingCapacity();
        //this.removeCapacityDevice();
    }

    /**
     * Create capacity device
     * POST ('/')
     */
    public createParking = () => this.router.post('/', (req: Request, res: Response) => {
        const params = req.body;

        capacityParkingController.createParking(params.name, params.description, params.currentCapacity, params.maxCapacity, params.address, params.userId)
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
    public getParkingList = () => this.router.get('/:userId/:pageSize/:pageIndex', (req: Request, res: Response) => {
        capacityParkingController.getParkingList(parseInt(req.params.userId), parseInt(req.params.pageSize), parseInt(req.params.pageIndex))
            .then(response => {
                res.send(response)
            })
            .catch(err => {
                res.send(err)
            })
    })

    public deleteParking = () => this.router.delete('/:id', (req: Request, res: Response) => {
        capacityParkingController.deleteCapacityParking(parseInt(req.params.id))
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
    public updateParkingCapacity = () => this.router.put('/spaces/:id', (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const params = req.body;

        capacityParkingController.updateParkingCapacity(id, params.currentCapacity, params.maxCapacity)
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

const capacityParkingRouter = new CapacityParkingRouter();
export default capacityParkingRouter.router;