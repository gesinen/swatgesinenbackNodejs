import { Router, Request, Response } from 'express';
import usersController from '../controllers/usersController';

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
}

const userRouter = new UsersRouter();
export default userRouter.router;