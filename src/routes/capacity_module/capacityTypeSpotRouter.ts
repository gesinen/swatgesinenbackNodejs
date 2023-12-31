import { Router, Request, Response } from "express";
import capacityTypeSpotController from "../../controllers/capacity_module/capacityTypeSpot";

class CapacityTypeSpotRouter {
  public router: Router = Router();

  constructor() {
    this.getCapacitySpotDevice();
    this.createCapacitySpotDevice();
    this.removeCapacitySpotDevice();
    this.updateCapacityDeviceAction();
  }

  /**
   * Create capacity device
   * POST ('/')
   */
  public createCapacitySpotDevice = () =>
    this.router.post("/", (req: Request, res: Response) => {
      const params = req.body;

      capacityTypeSpotController
        .createCapacitySpotDevice(
          parseInt(params.capacityDeviceId),
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
   * Get a capacity device with an ID
   * GET ('/:id')
   */
  public getCapacitySpotDevice = () =>
    this.router.get("/:id", (req: Request, res: Response) => {
      capacityTypeSpotController
        .getCapacitySpotDevice(parseInt(req.params.id))
        .then((response) => {
          res.send(response);
        })
        .catch((err) => {
          res.send(err);
        });
    });

  public removeCapacitySpotDevice = () =>
    this.router.delete("/:id", (req: Request, res: Response) => {
      capacityTypeSpotController
        .deleteCapacitySpotDevice(parseInt(req.params.id))
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

      capacityTypeSpotController
        .updateCapacitySpotDevice(id, params.status)
        .then((response) => {
          res.send(response);
        })
        .catch((err) => {
          res.send(err);
        });
    });
}

const capacityTypeSpotRouter = new CapacityTypeSpotRouter();
export default capacityTypeSpotRouter.router;
