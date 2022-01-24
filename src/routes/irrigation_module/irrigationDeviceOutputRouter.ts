import { Router, Request, Response } from 'express';
import irrigationController from "../../controllers/irrigation_module/irrigationDeviceController";
import irrigationDeviceOutputController from '../../controllers/irrigation_module/irrigationDeviceOutputController';

class IrrigationDeviceOutputRouter {

    public router: Router = Router();

    constructor() {
        this.getIrrigationOutputDeviceById();
        this.storeIrrigationOutputDevice();
        this.deleteIrrigationOutputDevice();
        this.updateIrrigationOutputDevice();
        this.updateValvesConfig();
        this.getIrrigationOutputDeviceIntervalById();
    }

    /**
     * Get the user data
     * GET ('/information/:id')
     */
    public getIrrigationOutputDeviceById = () => this.router.get('/:id', (req: Request, res: Response) => {
        const id = parseInt(req.params.id);

        irrigationDeviceOutputController.getIrrigationOutputDeviceById(id)
            .then((response: any) => {
                res.send(response)
            })
            .catch((err: any) => {
                res.send(err)
            })
    })

    /**
     * Get the user data
     * GET ('/information/:id')
     */
     public getIrrigationOutputDeviceIntervalById = () => this.router.get('/intervals/:id', (req: Request, res: Response) => {
        const id = parseInt(req.params.id);

        irrigationDeviceOutputController.getIrrigationOutputDeviceIntervalById(id)
            .then(response => {
                res.send(response)
            })
            .catch(err => {
                res.send(err)
            })
    })

    /**
     * Get user related municipality_id
     * GET ('/municipality/{user_id}')
     * params user_id -> id of the user we want to get the municipality_id from
     */
    public storeIrrigationOutputDevice = () => this.router.post('/', (req: Request, res: Response) => {
        const params = req.body;
        console.log("router store params")
        console.log(params)
        irrigationDeviceOutputController.storeIrrigationOutputDevice(params.irrigationDeviceId, params.sensorId, params.sensorIndex,
            params.intervals, params.status, params.name)
            .then((response: any) => {
                res.send(response)
            })
            .catch((err: any) => {
                res.send(err)
            })
    })

    /**
     * Get user related municipality_id
     * GET ('/municipality/{user_id}')
     * params user_id -> id of the user we want to get the municipality_id from
     */
    public deleteIrrigationOutputDevice = () => this.router.delete('/:id', (req: Request, res: Response) => {
        const id = parseInt(req.params.id);

        irrigationDeviceOutputController.deleteIrrigationOutputDevice(id)
            .then((response: any) => {
                res.send(response)
            })
            .catch((err: any) => {
                res.send(err)
            })
    })

    /**
    * Get user related municipality_id
    * POST ('/municipality/{user_id}')
    * params user_id -> id of the user we want to get the municipality_id from
    */
    public updateValvesConfig = () => this.router.post('/config/valves', (req: Request, res: Response) => {
        console.log("WORKS")
        const params = req.body;
        console.log(params)
        irrigationDeviceOutputController.updateIrrigationOutputDeviceIntervals(params.body.data.id, params.valves)
            .then((response: any) => {
                res.send(response)
            })
            .catch((err: any) => {
                res.send(err)
            })
    })

    /**
     * Get user related municipality_id
     * GET ('/municipality/{user_id}')
     * params user_id -> id of the user we want to get the municipality_id from
     */
    public updateIrrigationOutputDevice = () => this.router.put('/', (req: Request, res: Response) => {
        console.log("update")
        const params = req.body;
        console.log(params)
        irrigationDeviceOutputController.updateIrrigationOutputDevice(params.id, params.irrigationDeviceId, params.sensorId, params.sensorIndex,
            params.intervals, params.status, params.name)
            .then((response: any) => {
                res.send(response)
            })
            .catch((err: any) => {
                res.send(err)
            })
    })

}

const irrigationDeviceOutputRouter = new IrrigationDeviceOutputRouter();
export default irrigationDeviceOutputRouter.router;
