import { Router, Request, Response } from 'express';
import irrigationController from "../../controllers/irrigation_module/irrigationDeviceController";

class IrrigationDeviceRouter {

    public router: Router = Router();

    constructor() {
        this.getIrrigationDeviceById();
        this.getIrrigationDeviceListing();
        this.storeIrrigationDevice();
        this.updateIrrigationDevice();
        this.deleteIrrigationDevice();
    }

    /**
     * Get the user data
     * GET ('/information/:id')
     */
    public getIrrigationDeviceById = () => this.router.get('/:id', (req: Request, res: Response) => {
        const id = parseInt(req.params.id);

        irrigationController.getIrrigationDeviceByIdInner(id)
            .then(response => {
                res.send(response)
            })
            .catch(err => {
                res.send(err)
            })
    })

    /**
     * Get the user data
     * GET ('/information/:id')
     */
    public getIrrigationDeviceListing = () => this.router.get('/listing/:userId/:pageSize/:pageIndex', (req: Request, res: Response) => {
        const userId = parseInt(req.params.userId)
        const pageSize = parseInt(req.params.pageSize)
        const pageIndex = parseInt(req.params.pageIndex)

        irrigationController.getIrrigationDeviceListing(userId, pageSize, pageIndex)
            .then(response => {
                res.send(response)
            })
            .catch(err => {
                res.send(err)
            })
    })


    /**
    * Get the user data
    * GET ('/information/:id')
    */
    public getIrrigationInputDevicesByIrregationDeviceId = () => this.router.get('/sensorNumber/:deviceId', (req: Request, res: Response) => {
        const irregationDeviceId = parseInt(req.params.deviceId);

        irrigationController.getIrrigationInputDevicesByIrregationDeviceId(irregationDeviceId)
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
    public storeIrrigationDevice = () => this.router.post('/', (req: Request, res: Response) => {
        const params = req.body;
        console.log("router store params")
        console.log(params)
        irrigationController.storeIrrigationDevice(params.name, params.nameSentilo, params.latitude, params.longitude,
            params.description, params.status, params.userId, params.deviceTypeId, params.valves, params.sensors, params.sensorId)
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
    public updateIrrigationDevice = () => this.router.put('/:irrigationDeviceId', (req: Request, res: Response) => {
        const params = req.body;
        const irrigationDeviceId = parseInt(req.params.irrigationDeviceId);

        console.log("params", params)
        irrigationController.updateIrrigationDevice(irrigationDeviceId, params.sensorId, params.name, params.nameSentilo, params.latitude, params.longitude,
            params.description, params.status, params.userId, params.deviceTypeId, params.valves, params.sensors)
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
    public deleteIrrigationDevice = () => this.router.delete('/:irrigationDeviceId', (req: Request, res: Response) => {
        const irrigationDeviceId = parseInt(req.params.irrigationDeviceId);

        irrigationController.deleteIrrigationDevice(irrigationDeviceId)
            .then(response => {
                res.send(response)
            })
            .catch(err => {
                res.send(err)
            })
    })

}

const irrigationDeviceRouter = new IrrigationDeviceRouter();
export default irrigationDeviceRouter.router;
