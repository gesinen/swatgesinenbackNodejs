import { Router, Request, Response } from "express";
import WaterDevicesColumnConfigController from "../../controllers/water_module/waterDevicesColumnConfigController"// "../../controllers/water_module/waterDevicesColumnConfigController";

class WaterDevicesColumnConfigRouter {
  public router: Router = Router();

  constructor() {
    // create water device column Config
    this.createWaterDeviceColumnConfig(); 
    this.EditWaterDeviceColumnConfig();
    this.getWaterDeviceColumnConfigByUserIdAction(); 
  }
  public createWaterDeviceColumnConfig = () =>
    this.router.post("/", (req: Request, res: Response) => {
      const params = req.body;
      WaterDevicesColumnConfigController
        .createWaterDeviceColumnConfig(
          params.name,          
          params.contract_number,
          params.user,
          params.user_id,
          params.units,
          params.description,
          params.use_for,
          params.installation_address,
          params.user_name,
          params.device_eui,
          params.sensor_name,
          params.device_diameter,
          params.numContador,
          params.numModuleLora,
          params.provider,
          params.authToken
          
        )
        .then((response) => {
          res.send(response);
        })
        .catch((err) => {
          res.send(err);
        });
    });
    public EditWaterDeviceColumnConfig = () =>
    this.router.put("/", (req: Request, res: Response) => {
      const params = req.body;
      WaterDevicesColumnConfigController
        .UpdateWaterDeviceColumnConfig(
          params.name,          
          params.contract_number,
          params.user,
          params.user_id,
          params.units,
          params.counter_number,
          params.description,
          params.use_for,
          params.installation_address,
          params.user_name,
          params.device_eui,
          params.sensor_name,
          params.device_diameter,
          params.numContador,
          params.numModuleLora,
          params.provider,
          params.authToken
        )
        .then((response) => {
          res.send(response);
        })
        .catch((err) => {
          res.send(err);
        });
    });

    public getWaterDeviceColumnConfigByUserIdAction = () =>
    this.router.get("/:userId", (req: Request, res: Response) => {
      const params = req.params;
        console.log(params);
      WaterDevicesColumnConfigController
        .getWaterDeviceColumnConfigByUserId(parseInt(params.userId))
        .then((response) => {
          res.send(response);
        })
        .catch((err) => {
          res.send(err);
        });
    });
}
  const waterDevicesColumnConfigRouter = new WaterDevicesColumnConfigRouter();
export default waterDevicesColumnConfigRouter.router;