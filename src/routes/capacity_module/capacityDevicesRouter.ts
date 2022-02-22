import { Router, Request, Response } from "express";
import capacityDevicesController from "../../controllers/capacity_module/capacityDevicesController";

class CapacityDevicesRouter {
  public router: Router = Router();

  constructor() {
    this.createCapacityDeviceAction();
    this.getCapacityDeviceByIdAction();
    this.updateCapacityDeviceAction();
    this.getUserCapacityDevicesListAction();
    this.getMostCapacityDevicesAction();
    this.getLessCapacityDevicesAction();
    this.removeCapacityDevice();
    //this.importCapacityDevicesAction();
    //this.importCapacityDevicesParkingAreaAction();
  }

  /**
   * Create capacity device
   * POST ('/')
   */
  public createCapacityDeviceAction = () =>
    this.router.post("/", (req: Request, res: Response) => {
      const params = req.body;

      capacityDevicesController
        .createCapacityDevice(
          parseInt(params.sensorId),
          params.name,
          params.description,
          params.latitude,
          params.longitude,
          params.authToken,
          params.provider,
          parseInt(params.userId),
          params.type,
          params.parkingId
        )
        .then((response) => {
          res.send(response);
        })
        .catch((err) => {
          res.send(err);
        });
    });

  /**
     * Import capacity device spot
     * POST ('/')
     *
    public importCapacityDevicesAction = () => this.router.post('/import/spot', (req: Request, res: Response) => {
        const params = req.body;
        console.log(params)
        capacityDevicesController.importCapacityDevicesLazo(params.capacity_devices, params.user_id)
            .then(response => {
                res.send(response)
            })
            .catch(err => {
                /*res.send({
                    http: 401,
                    status: 'Failed',
                    error: err
                })
                res.send(err)
            })
    })*/
  /**
     * Import capacity device parking_area
     * POST ('/')
     *
    public importCapacityDevicesParkingAreaAction = () => this.router.post('/import/parking_area', (req: Request, res: Response) => {
        const params = req.body;
        console.log(params);
        if (params.device_id) {
            capacityDevicesController.importCapacityDevices(params.capacity_devices, params.user_id)
                .then(response => {
                    res.send(response)
                })
                .catch(err => {
                    /*res.send({
                        http: 401,
                        status: 'Failed',
                        error: err
                    })*
                    res.send(err)
                })
        } else {
            capacityDevicesController.importCapacityDevicesLazo(params.capacity_devices, params.user_id)
                .then(response => {
                    res.send(response)
                })
                .catch(err => {
                    /*res.send({
                        http: 401,
                        status: 'Failed',
                        error: err
                    })*
                    res.send(err)
                })
        }

    })*/

  /**
   * Get a capacity device with an ID
   * GET ('/:id')
   */
  public getCapacityDeviceByIdAction = () =>
    this.router.get("/:id", (req: Request, res: Response) => {
      capacityDevicesController
        .getCapacityDeviceById(parseInt(req.params.id))
        .then((response) => {
          res.send(response);
        })
        .catch((err) => {
          res.send(err);
        });
    });

  public removeCapacityDevice = () =>
    this.router.delete("/:id", (req: Request, res: Response) => {
      capacityDevicesController
        .deleteCapacityDevice(parseInt(req.params.id))
        .then((response) => {
          res.send(response);
        })
        .catch((err) => {
          res.send(err);
        });
    });

  /**
   * Update a capacity device
   * PUT ('/:id')
   */
  public updateCapacityDeviceAction = () =>
    this.router.put("/:id", (req: Request, res: Response) => {
      const id = parseInt(req.params.id);
      const params = req.body;
      capacityDevicesController
        .updateCapacityDevice(
          id,
          params.name,
          params.description,
          parseInt(params.sensorId),
          params.authToken,
          params.provider,
          params.type,
          params.address,
          params.latitude,
          params.longitude,
          params.ribbonDeviceId,
          params.parkingId,
          params.spotDeviceId,
          params.status
        )
        .then((response) => {
          res.send(response);
        })
        .catch((err) => {
          res.send(err);
        });
    });

  /**
   * Get capacity devices of a user
   * GET ('/:userId')
   */
  public getUserCapacityDevicesListAction = () =>
    this.router.get(
      "/:userId/:pageSize/:pageIndex",
      (req: Request, res: Response) => {
        capacityDevicesController
          .getUserCapacityDevicesList(
            parseInt(req.params.userId),
            parseInt(req.params.pageSize),
            parseInt(req.params.pageIndex)
          )
          .then((response) => {
            res.send(response);
          })
          .catch((err) => {
            res.send(err);
          });
      }
    );

  /**
   * Get most capacity devices of a user
   * GET ('/most/:userId')
   */
  public getMostCapacityDevicesAction = () =>
    this.router.get("/most/:userId", (req: Request, res: Response) => {
      capacityDevicesController
        .getMostCapacityDevices(parseInt(req.params.userId))
        .then((response) => {
          res.send(response);
        })
        .catch((err) => {
          res.send(err);
        });
    });

  /**
   * Get less capacity devices of a user
   * GET ('/less/:userId')
   */
  public getLessCapacityDevicesAction = () =>
    this.router.get("/less/:userId", (req: Request, res: Response) => {
      capacityDevicesController
        .getLessCapacityDevices(parseInt(req.params.userId))
        .then((response) => {
          res.send(response);
        })
        .catch((err) => {
          res.send(err);
        });
    });
}

const capacityDevicesRoutes = new CapacityDevicesRouter();
export default capacityDevicesRoutes.router;
