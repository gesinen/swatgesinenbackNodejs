import { Router, Request, Response } from 'express';
import waterGroupsController from '../../controllers/water_module/waterGroupsController';

class WaterGroupsRouter {

    public router: Router = Router();

    constructor() {
        this.getWaterGroupsByUser();
    }

    /**
     * Get user related water_users
     * GET ('/groups/:id')
     * params user_id -> id of the user we want to get users from
     */
    public getWaterGroupsByUser = () => this.router.get('/groups/:user_id', (req: Request, res: Response) => {
        const params = req.params;
        
        waterGroupsController.getWaterGroupsByUser(parseInt(params.user_id))
            .then(response => {
                res.send(response)
            })
            .catch(err => {
                res.send(err)
            })
    })
}

const waterGroupsRoutes = new WaterGroupsRouter();
export default waterGroupsRoutes.router;
