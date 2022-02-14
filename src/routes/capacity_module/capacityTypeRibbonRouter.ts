import { Router, Request, Response } from 'express';
import capacityTypeRibbonController from '../../controllers/capacity_module/capacityTypeRibbon';

class CapacityTypeRibbonRouter {

    public router: Router = Router();

    constructor() {
        this.getCapacityRibbonDeviceById();
        this.getAllCapacityRibbonDevicesInner();
        this.createCapacityRibbonDevice();
        this.removeCapacityRibbonDevice();
        this.updateCapacityRibbonDevice();
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
    public getCapacityRibbonDeviceById = () => this.router.get('/:id', (req: Request, res: Response) => {
        capacityTypeRibbonController.getCapacityRibbonDeviceById(parseInt(req.params.id))
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
     */
    public updateCapacityRibbonDevice = () => this.router.put('/:id', (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const params = req.body;

        capacityTypeRibbonController.updateCapacityRibbonDevice(id, params.parkingId)
            .then(response => {
                res.send(response)
            })
            .catch(err => {
                res.send(err)
            })
    })
}

const capacityTypeRibbonRouter = new CapacityTypeRibbonRouter();
export default capacityTypeRibbonRouter.router;