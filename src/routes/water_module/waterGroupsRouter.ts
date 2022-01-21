import { Router, Request, Response } from 'express';
import waterGroupsController from '../../controllers/water_module/waterGroupsController';

class WaterGroupsRouter {

    public router: Router = Router();

    constructor() {
        this.getWaterGroupsByUser();
        this.getWaterRootGroupByUser();
        this.getWaterGroupByParent();
    }

    /**
     * Get user related water_users
     * GET ('/:id')
     * params user_id -> id of the user we want to get users from
     */
    public getWaterGroupsByUser = () => this.router.get('/:user_id', (req: Request, res: Response) => {
        const params = req.params;
        
        waterGroupsController.getWaterGroupsByUser(parseInt(params.user_id))
            .then(response => {
                res.send(response)
            })
            .catch(err => {
                res.send(err)
            })
    })

    /**
     * Get user related water_users
     * GET ('/root/:id')
     * params user_id -> id of the user we want to get users from
     */
     public getWaterRootGroupByUser = () => this.router.get('/root/:user_id', (req: Request, res: Response) => {
        const params = req.params;
        
        waterGroupsController.getWaterRootGroupByUser(parseInt(params.user_id))
            .then(response => {
                res.send(response)
            })
            .catch(err => {
                res.send(err)
            })
    })

    /**
     * Get user related water_users
     * GET ('/root/:id')
     * params user_id -> id of the user we want to get users from
     */
     public getWaterGroupByParent = () => this.router.get('/parent/:group_id', (req: Request, res: Response) => {
        const params = req.params;
        
        waterGroupsController.getWaterGroupsByParent(parseInt(params.group_id))
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
