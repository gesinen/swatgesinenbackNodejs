import { Router, Request, Response } from "express";
import irrigationDeviceInputController from "../../controllers/irrigation_module/irrigationDeviceInputController";

class IrrigationDeviceInputRouter {
  public router: Router = Router();

  constructor() {
    this.getIrrigationInputDeviceById();
    this.storeIrrigationInputDevice();
    this.deleteIrrigationInputDevice();
    this.updateIrrigationInputDevice();
  }

  /**
   * Get the user data
   * GET ('/information/:id')
   */
  public getIrrigationInputDeviceById = () =>
    this.router.get("/:id", (req: Request, res: Response) => {
      const id = parseInt(req.params.id);

      irrigationDeviceInputController
        .getIrrigationInputDeviceById(id)
        .then((response: any) => {
          res.send(response);
        })
        .catch((err: any) => {
          res.send(err);
        });
    });

  /**
   * Get user related municipality_id
   * GET ('/municipality/{user_id}')
   * params user_id -> id of the user we want to get the municipality_id from
   */
  public storeIrrigationInputDevice = () =>
    this.router.post("/", (req: Request, res: Response) => {
      const params = req.body;
      console.log("router store params");
      console.log(params);
      irrigationDeviceInputController
        .storeIrrigationInputDevice(
          params.irrigationDeviceId,
          params.sensorId,
          params.lastHumidity,
          params.lastTemperature,
          params.sensorIndex,
          params.name,
          params.connectionType,
          params.authToken,
          params.provider
        )
        .then((response: any) => {
          res.send(response);
        })
        .catch((err: any) => {
          res.send(err);
        });
    });

  /**
   * Get user related municipality_id
   * GET ('/municipality/{user_id}')
   * params user_id -> id of the user we want to get the municipality_id from
   */
  public deleteIrrigationInputDevice = () =>
    this.router.delete("/:id", (req: Request, res: Response) => {
      const id = parseInt(req.params.id);

      irrigationDeviceInputController
        .deleteIrrigationInputDevice(id)
        .then((response: any) => {
          res.send(response);
        })
        .catch((err: any) => {
          res.send(err);
        });
    });

  /**
   * Get user related municipality_id
   * GET ('/municipality/{user_id}')
   * params user_id -> id of the user we want to get the municipality_id from
   */
  public updateIrrigationInputDevice = () =>
    this.router.put("/", (req: Request, res: Response) => {
      console.log("update");
      const params = req.body;
      console.log(params);
      irrigationDeviceInputController
        .updateIrrigationInputDevice(
          params.id,
          params.sensorId,
          params.name,
          params.connectionType,
          params.authToken,
          params.provider
        )
        .then((response: any) => {
          res.send(response);
        })
        .catch((err: any) => {
          res.send(err);
        });
    });
}

const irrigationDeviceInputRouter = new IrrigationDeviceInputRouter();
export default irrigationDeviceInputRouter.router;
