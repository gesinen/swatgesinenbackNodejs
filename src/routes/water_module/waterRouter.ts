import { Router, Request, Response } from 'express';
import waterModuleController from '../../controllers/water_module/waterController';
const formidable = require('formidable');

class WaterModuleRouter {

    public router: Router = Router();

    constructor() {
        this.importFileAction();
    }

    /**
     * Import observations file
     * POST ('/import')
     */
    public importFileAction = () => this.router.post('/import/', (req: Request, res: Response) => {
        const params = req.body;
        //console.log(req.body)
        waterModuleController.importFile(params,waterModuleController.insertNewWaterObservations)
            .then( response => {
                res.send(response)
            })
            .catch( err => {

                res.send(err)
            })
    })

}

const waterModuleRouter = new WaterModuleRouter();
export default waterModuleRouter.router;
