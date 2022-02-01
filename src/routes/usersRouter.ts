import { Router, Request, Response, request } from 'express';
import usersController from '../controllers/usersController';
import waterDevicesController from "../controllers/water_module/waterUsersController";

class UsersRouter {

    public router: Router = Router();

    constructor() {
        this.getUserInformationAction();
        this.getUserLoginAction();
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

    /**
     * Get the user data
     * GET ('/login')
     */
     public getUserLoginAction = () => this.router.post('/login', (req: Request, res: Response) => {
        const mail = req.body.email;
        const pass = req.body.password;

        usersController.getUserLogin(mail, pass)
            .then( response => {
                res.send(response)
            })
            .catch( err => {
                res.send(err)
            })
    })

    /**
     * Get the user data
     * GET ('/login')
     */
     public getUserIdByMailAction = () => this.router.post('/getUserByNif/:mail', (req: Request, res: Response) => {
        const mail = req.params.mail;


        usersController.getUserIdByMail(mail)
            .then( response => {
                res.send(response)
            })
            .catch( err => {
                res.send(err)
            })
    })
}

const userRouter = new UsersRouter();
export default userRouter.router;
