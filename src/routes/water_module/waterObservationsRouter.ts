import { Router, Request, Response } from 'express';
import waterObservationsController from '../../controllers/water_module/waterObservationsController';
//const formidable = require('formidable');

class WaterObservationsRouter {

    public router: Router = Router();

    constructor() {
        this.importFileAction();
        this.getObservationsByDeviceId();
    }

    /**
     * Import observations file
     * POST ('/import')
     */
    public importFileAction = () => this.router.post('/import/', (req: Request, res: Response) => {
        const params = req.body;
        console.log("importFileAction -- waterRouter")
        //console.log(req.body)
        waterObservationsController.importFile(params,waterObservationsController.insertNewWaterObservations)
            .then( response => {
                res.send(response)
            })
            .catch( err => {

                res.send(err)
            })
    })

    /**
     * Get observations by device id in date range
     * POST ('/observationsByDeviceId')
     */
    public getObservationsByDeviceId = () => this.router.post('/observationsByDeviceId/', (req: Request, res: Response) => {
        const params = req.body;
        //console.log(req.body)
        waterObservationsController.getObservationValuesByDeviceId(params.devicesIdArray,params.fromDate,params.toDate,params.userColSelection)
            .then( response => {
                res.send(response)
            })
            .catch( err => {
                res.send(err)
            })
    })
}

const waterObservationsRouter = new WaterObservationsRouter();
export default waterObservationsRouter.router;
