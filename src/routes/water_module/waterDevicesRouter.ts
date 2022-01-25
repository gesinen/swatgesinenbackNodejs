import { Router, Request, Response } from 'express';
import waterDevicesController from '../../controllers/water_module/waterDevicesController';
import waterUsersController from "../../controllers/water_module/waterUsersController";

class WaterDevicesRouter {

    public router: Router = Router();

    constructor() {
        this.createWaterDeviceAction();
        this.getWaterDeviceListingAction();
        this.importFileAction();
        this.getWaterDeviceByIdAction();
        this.updateWaterDeviceByNameAction();
        this.updateWaterDevicesFromExcel();
        this.getWaterDeviceListingSortedAction();
    }

    public createWaterDeviceAction = () => this.router.post('/', (req: Request, res: Response) => {
        const params = req.body;

        waterDevicesController.createWaterDevice(params.name, params.sensor_id, params.variable_name, params.water_group_id, params.water_user_id, params.user_id, params.municipality_id, params.description, params.units, params.contract_number, params.device_diameter, params.sewer_rate_id, params.installation_address)
            .then(response => {
                res.send(response)
            })
            .catch(err => {
                res.send(err)
            })
    })

    public getWaterDeviceListingAction = () => this.router.get('/page/:user_id/:page_index/:page_size', (req: Request, res: Response) => {
        const params = req.params;

        waterDevicesController.getWaterDevicesListing(parseInt(params.user_id), parseInt(params.page_index), parseInt(params.page_size))
            .then(response => {
                res.send(response)
            })
            .catch(err => {
                res.send(err)
            })
    })

    public getWaterDeviceListingSortedAction = () => this.router.get('/page/:user_id/:page_index/:page_size/:sort_by_col/:direction', (req: Request, res: Response) => {
        const params = req.params;

        waterDevicesController.getWaterDevicesListingSorted(parseInt(params.user_id), parseInt(params.page_index), parseInt(params.page_size), params.sort_by_col, params.direction)
            .then(response => {
                res.send(response)
            })
            .catch(err => {
                res.send(err)
            })
    })

    public updateWaterDevicesFromExcel = () => this.router.post('/update/', async (req: Request, res: Response) => {
        const params = req.body;
        try {
            console.log("updateWaterDevices", params)
            let waterDevicesWithErr: any[] = []
            let contador: number = 0
            let successCount: number = 0
            for (const device of params) {
                let updateRes: any = await waterDevicesController.updateWaterDeviceByName(device.name, device.variableName, device.description, device.units,
                    device.contractNumber, device.deviceDiameter, device.installAddress, device.numContador, device.numModuleLora, device.provider, device.authToken, device.nif);
                if (updateRes.http != 200 || updateRes.result.affectedRows == 0) {
                    waterDevicesWithErr.push(device.name)
                    contador++
                } else {
                    successCount++
                }
                console.log(updateRes)
            }
            //params.forEach(async (device: any) => { });
            res.send({
                http: 200,
                status: 'Success',
                res: {
                    notInsertedDevices: waterDevicesWithErr,
                    notInsertedDevicesNumber: contador,
                    updateSuccededNum: successCount
                }
            })
        } catch (error) {
            res.send(error)
            console.log(error)
        }
    })

    public updateWaterDeviceByNameAction = () => this.router.put('/name/', (req: Request, res: Response) => {
        const params = req.body;
        waterDevicesController.updateWaterDeviceByName(params.name, params.variableName, params.description,
            params.units, params.contractNumber, params.deviceDiameter, params.installAddress, params.numContador,
            params.numModuleLora, params.provider, params.authToken, params.nif)
            .then(response => {
                res.send(response)
            })
            .catch(err => {
                res.send(err)
            })
    })

    public getWaterDeviceByIdAction = () => this.router.get('/:deviceId', (req: Request, res: Response) => {
        const params = req.params;

        waterDevicesController.getWaterDeviceById(parseInt(params.deviceId))
            .then(response => {
                res.send(response)
            })
            .catch(err => {
                res.send(err)
            })
    })

    /**
     * Import observations file
     * POST ('/import/{userId}')
     * userId -> id of the user doing the import
     */
    public importFileAction = () => this.router.post('/import/:userId', (req: Request, res: Response) => {
        const params = req.body;
        //console.log("importFileAction -- waterDevicesRouter")
        //console.log(req.body)
        waterDevicesController.importFile(params.file_to_upload, params.municipality_id, req.params.userId,
            params.provider, params.authToken, params.selectedUnitValue)
            .then(response => {
                res.send(response)
            })
            .catch(err => {

                res.send(err)
            })
    })

}

const waterDevicesRoutes = new WaterDevicesRouter();
export default waterDevicesRoutes.router;
