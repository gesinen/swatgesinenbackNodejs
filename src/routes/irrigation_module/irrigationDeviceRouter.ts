import { Router, Request, Response } from "express";
import irrigationController from "../../controllers/irrigation_module/irrigationDeviceController";

class IrrigationDeviceRouter {
  public router: Router = Router();

  constructor() {
    this.getIrrigationDeviceById();
    this.getIrrigationDeviceListing();
    this.storeIrrigationDevice();
    this.updateIrrigationDevice();
    this.deleteIrrigationDevice();
    this.updateIrrigationDeviceRelatedSensorId();
    this.getSensorTypeBySensorId();
    this.updateGeswatIrrigationIntervals();
    this.getGeswatInterval();
    this.updateIrrigationDeviceRelatedSensorIdValves();
    this.getIrrigationDeviceTempHumById();
  }

  /**
   * Get the user data
   * GET ('/information/:id')
   */
  public getIrrigationDeviceById = () =>
    this.router.get("/:id", (req: Request, res: Response) => {
      const id = parseInt(req.params.id);

      irrigationController
        .getIrrigationDeviceByIdInner(id)
        .then((response) => {
          res.send(response);
        })
        .catch((err) => {
          res.send(err);
        });
    });

    public getIrrigationDeviceTempHumById = () =>
        this.router.get("/temphum/:id", (req: Request, res: Response) => {
            const id = parseInt(req.params.id);

            irrigationController
                .getIrrigationDeviceTempHum(id)
                .then((response) => {
                    res.send(response);
                })
                .catch((err) => {
                    res.send(err);
                });
        });

  /**
   * Get the user data
   * GET ('/information/:id')
   */
  public getIrrigationDeviceListing = () =>
    this.router.get(
      "/listing/:userId/:pageSize/:pageIndex",
      (req: Request, res: Response) => {
        const userId = parseInt(req.params.userId);
        const pageSize = parseInt(req.params.pageSize);
        const pageIndex = parseInt(req.params.pageIndex);

        irrigationController
          .getIrrigationDeviceListing(userId, pageSize, pageIndex)
          .then((response) => {
            res.send(response);
          })
          .catch((err) => {
            res.send(err);
          });
      }
    );

  /**
   * Get the user data
   * GET ('/information/:id')
   */
  public getIrrigationInputDevicesByIrregationDeviceId = () =>
    this.router.get(
      "/sensorNumber/:deviceId",
      (req: Request, res: Response) => {
        const irregationDeviceId = parseInt(req.params.deviceId);

        irrigationController
          .getIrrigationInputDevicesByIrregationDeviceId(irregationDeviceId)
          .then((response: any) => {
            res.send(response);
          })
          .catch((err: any) => {
            res.send(err);
          });
      }
    );

  /**
* Get user related municipality_id
* GET ('/municipality/{user_id}')
* params user_id -> id of the user we want to get the municipality_id from
*/
  public updateIrrigationDeviceRelatedSensorId = () =>
    this.router.put("/relatedSensor/:irrigationDeviceId/:relatedSensorDevEui/:humidityLimit/:humidityLimitInferior", (req: Request, res: Response) => {
      const params: any = req.params;
      console.log("router store params");
      console.log(params);
      irrigationController
        .updateIrrigationDeviceRelatedSensor(
          params.irrigationDeviceId,
          params.relatedSensorDevEui,
          parseInt(params.humidityLimit),
          parseInt(params.humidityLimitInferior)
        )
        .then((response) => {
          res.send(response);
        })
        .catch((err) => {
          res.send(err);
        });
    });

    public updateIrrigationDeviceRelatedSensorIdValves = () =>
        this.router.put("/relatedSensor/byValve/:irrigationDeviceId/:relatedSensorDevEui/:humidityLimit/:humidityLimitInferior/:valveNumber/:active", (req: Request, res: Response) => {
            const params: any = req.params;
            console.log("router store params");
            console.log(params);
            irrigationController
                .updateIrrigationDeviceRelatedSensorValves(
                    params.irrigationDeviceId,
                    params.valveNumber,
                    parseInt(params.humidityLimit),
                    parseInt(params.humidityLimitInferior),
                    params.relatedSensorDevEui,
                    params.active
                )
                .then((response) => {
                    res.send(response);
                })
                .catch((err) => {
                    res.send(err);
                });
        });

  /**
   * Get user related municipality_id
   * GET ('/municipality/{user_id}')
   * params user_id -> id of the user we want to get the municipality_id from
   */
  public storeIrrigationDevice = () =>
    this.router.post("/", (req: Request, res: Response) => {
      const params = req.body;
      console.log("router store params");
      console.log(params);
      irrigationController
        .storeIrrigationDevice(
          params.name,
          params.nameSentilo,
          params.latitude,
          params.longitude,
          params.description,
          params.status,
          params.userId,
          params.deviceTypeId,
          params.valves,
          params.sensors,
          params.sensorId
        )
        .then((response) => {
          res.send(response);
        })
        .catch((err) => {
          res.send(err);
        });
    });

  /**
   * Get user related municipality_id
   * GET ('/municipality/{user_id}')
   * params user_id -> id of the user we want to get the municipality_id from
   */
  public updateIrrigationDevice = () =>
    this.router.put("/:irrigationDeviceId", (req: Request, res: Response) => {
      const params = req.body;
      const irrigationDeviceId = parseInt(req.params.irrigationDeviceId);

      console.log("params", params);
      irrigationController
        .updateIrrigationDevice(
          irrigationDeviceId,
          params.sensorId,
          params.name,
          params.nameSentilo,
          params.latitude,
          params.longitude,
          params.description,
          params.status,
          params.userId,
          params.deviceTypeId,
          params.valves,
          params.sensors
        )
        .then((response) => {
          res.send(response);
        })
        .catch((err) => {
          res.send(err);
        });
    });

  /**
   * Get user related municipality_id
   * GET ('/municipality/{user_id}')
   * params user_id -> id of the user we want to get the municipality_id from
   */
  public deleteIrrigationDevice = () =>
    this.router.delete(
      "/:irrigationDeviceId",
      (req: Request, res: Response) => {
        const irrigationDeviceId = parseInt(req.params.irrigationDeviceId);

        irrigationController
          .deleteIrrigationDevice(irrigationDeviceId)
          .then((response) => {
            res.send(response);
          })
          .catch((err) => {
            res.send(err);
          });
      }
    );

    public getSensorTypeBySensorId = () =>
        this.router.get("/relatedSensor/:irrigationDeviceId", (req: Request, res: Response) => {
            const params: any = req.params;
            console.log(params, "Que esta pasando aqui")
            irrigationController
                .getSensorTypeBySensorId(params.irrigationDeviceId)
                .then((response) => {
                    res.send(response);
                })
                .catch((err) => {
                    res.send(err);
                });
        });

    public updateGeswatIrrigationIntervals = () =>
        this.router.put("/updateGeswat/:irrigationDeviceId/:intervals", (req: Request, res: Response) => {
            const intervals = req.params.intervals;
            const irrigationDeviceId = req.params.irrigationDeviceId;
            irrigationController
                .updateGeswatIrrigationIntervals(irrigationDeviceId, intervals)
                .then((response) => {
                    res.send(response);
                })
                .catch((err) => {
                    res.send(err);
                });
        });
    public getGeswatInterval = () =>
        this.router.get("/geswatInterval/:id", (req: Request, res: Response) => {
            const params: any = req.params;
            irrigationController
                .getGeswatInterval(params.id)
                .then((response) => {
                    res.send(response);
                })
                .catch((err) => {
                    res.send(err);
                });
        });
}

const irrigationDeviceRouter = new IrrigationDeviceRouter();
export default irrigationDeviceRouter.router;
