import { Router, Request, Response } from 'express';
import capacityCartelLineController from '../../controllers/capacity_module/capacityCartelLine';

class CapacityCartelLineRouter {

    public router: Router = Router();

    constructor() {
        this.getCartelLines();
        this.createCartelLine();
        this.deleteCartelLine();
        this.updateCapacityDeviceAction();
    }

    /**
     * Create capacity device
     * POST ('/')
     */
    public createCartelLine = () => this.router.post('/', (req: Request, res: Response) => {
        const params = req.body;

        capacityCartelLineController.createCartelLine(parseInt(params.sensor_id), parseInt(params.user_id), parseInt(params.max_capacity))
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
    public getCartelLines = () => this.router.get('/:cartelId', (req: Request, res: Response) => {
        capacityCartelLineController.getCartelLines(parseInt(req.params.cartelId))
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
     *
    public getFreeCartelLines = () => this.router.get('/:id', (req: Request, res: Response) => {
        capacityCartelLineController.getFreeCartelLines(parseInt(req.params.id))
            .then(response => {
                res.send(response)
            })
            .catch(err => {
                res.send({
                    http: 401,
                    status: 'Failed',
                    error: err
                })
                res.send(err)
            })
    })*/

    public deleteCartelLine = () => this.router.delete('/:id', (req: Request, res: Response) => {
        capacityCartelLineController.deleteCapacityCartelLine(parseInt(req.params.id))
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

        capacityCartelLineController.updateCartelLine(params.cartelId, params.parkingId, params.lineNum)
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