import { Router, Request, Response } from 'express';
import LoraDashboardController from '../../controllers/lora_module/loraDashboardController';

class LoraDashboardRouter {
    
    // Router
    public router: Router = Router();

    // Controller
    private loraDashboardController = new LoraDashboardController();

    // Constructor
    constructor() {
        this.getNetworkServerGeneralInformation();
    }

    // Methods
    public getNetworkServerGeneralInformation = () => this.router.get('/information/:userId',  (req: Request, res: Response) => {
        const userId = parseInt(req.params.userId);

        this.loraDashboardController.getNetworkServerGeneralInformation(userId)
            .then( response => {
                res.status(200).send(response)
            })
            .catch( err => {
                res.status(401).send(err)
            })
    })
}

const loraDashboardRouter = new LoraDashboardRouter();
export default loraDashboardRouter.router;