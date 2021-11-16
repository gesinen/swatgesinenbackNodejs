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
        this.getNetworkServerSensorStatus();
        this.getNetworkServerSensorSignal();
        this.getNetworkServerPackages();
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

    public getNetworkServerSensorStatus = () => this.router.get('/sensor/:userId',  (req: Request, res: Response) => {
        const userId = parseInt(req.params.userId);

        this.loraDashboardController.getNetworkServerSensorStatus(userId)
            .then( response => {
                res.status(200).send(response)
            })
            .catch( err => {
                res.status(401).send(err)
            })
    })

    public getNetworkServerSensorSignal = () => this.router.get('/signal/:userId',  (req: Request, res: Response) => {
        const userId = parseInt(req.params.userId);

        this.loraDashboardController.getNetworkServerSensorSignal(userId)
            .then( response => {
                res.status(200).send(response)
            })
            .catch( err => {
                res.status(401).send(err)
            })
    })

    public getNetworkServerPackages = () => this.router.get('/packages/:userId',  (req: Request, res: Response) => {
        const userId = parseInt(req.params.userId);

        this.loraDashboardController.getNetworkServerPackages(userId)
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