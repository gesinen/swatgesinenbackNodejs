import { Router, Request, Response } from 'express';
import waterDevicesController from '../../controllers/water_module/waterUsersController';

class WaterUsersRouter {

    public router: Router = Router();

    constructor() {
        this.getAllWaterUsersAction();
        this.getWaterUserDeviceAction();
    } 

    public getAllWaterUsersAction = () => this.router.get('/all/:user_id', (req: Request, res: Response) => {
        const params = req.params;
        
        waterDevicesController.getAllWaterUsers(parseInt(params.user_id))
            .then(response => {
                res.send(response)
            })
            .catch(err => {
                res.send(err)
            })
    })

    public getWaterUserDeviceAction = () => this.router.get('/device/:user_id', (req: Request, res: Response) => {
        const user_id = req.params.user_id;

        waterDevicesController.getWaterUserDevice(parseInt(user_id))
            .then(response => {
                res.send(response)
            })
            .catch(err => {
                res.send(err)
            })
    })

}

const waterUsersRoutes = new WaterUsersRouter();
export default waterUsersRoutes.router;