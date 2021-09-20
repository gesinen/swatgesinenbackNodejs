import { Router, Request, Response } from 'express';
import waterDevicesController from '../../controllers/water_module/waterDevicesController';

class WaterDevicesRouter {

    public router: Router = Router();

    constructor() {
        this.createWaterDeviceAction();
        this.getWaterDeviceListingAction();
    }

    public createWaterDeviceAction = () => this.router.post('/', (req: Request, res: Response) => {
        const params = req.body;

        waterDevicesController.createWaterDevice(params.name, params.sensor_id, params.variable_name, params.water_group_id, params.water_user_id, params.user_id, params.municipality_id, params.description, params.units, params.contract_number, params.device_diameter, params.sewer_rate_id, params.installation_address)
            .then(response => {
                res.send(response)
            })
            .catch(err => {
                res.send(err)
            })
    })

    public getWaterDeviceListingAction = () => this.router.get('/page', (req: Request, res: Response) => {
        const params = req.body;

        waterDevicesController.getWaterDevicesListing(params.user_id, params.page_index, params.page_size)
            .then(response => {
                res.send(response)
            })
            .catch(err => {
                res.send(err)
            })
    })

}

const waterDevicesRoutes = new WaterDevicesRouter();
export default waterDevicesRoutes.router;