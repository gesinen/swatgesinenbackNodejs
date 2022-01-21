import { Router, Request, Response } from 'express';
import usersController from '../controllers/usersController';
import waterDevicesController from "../controllers/water_module/waterUsersController";

class UsersRouter {

    public router: Router = Router();

    constructor() {
        this.getUserInformationAction();
    }

    /**
     * Get the user data
     * GET ('/information/:id')
     */
    public getUserInformationAction = () => this.router.get('/information/:id', (req: Request, res: Response) => {
        const id = parseInt(req.params.id);

        usersController.getUserInformation(id)
            .then( response => {
                res.send(response)
            })
            .catch( err => {
                res.send(err)
            })
    })

    /**
     * Get user related municipality_id
     * GET ('/municipality/{user_id}')
     * params user_id -> id of the user we want to get the municipality_id from
     */
    public getUserServersAction = () => this.router.get('/municipality/:user_id', (req: Request, res: Response) => {
        const user_id = req.params.user_id;

        waterDevicesController.getWaterUserMunicipalityId(parseInt(user_id))
            .then(response => {
                res.send(response)
            })
            .catch(err => {
                res.send(err)
            })
    })
}

const userRouter = new UsersRouter();
export default userRouter.router;
