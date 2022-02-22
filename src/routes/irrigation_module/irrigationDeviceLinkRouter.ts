import { Router, Request, Response } from "express";
import irrigationDeviceLinkController from "../../controllers/irrigation_module/irrigationDeviceLinkController";

class IrrigationDeviceLinkRouter {
  public router: Router = Router();

  constructor() {
    this.getIrrigationDeviceLinkById();
    this.storeIrrigationDeviceLink();
    this.deleteIrrigationDeviceLink();
    this.updateIrrigationDeviceLink();
  }

  /**
   * Get the user data
   * GET ('/information/:id')
   */
  public getIrrigationDeviceLinkById = () =>
    this.router.get("/:id", (req: Request, res: Response) => {
      const id = parseInt(req.params.id);

      irrigationDeviceLinkController
        .getIrrigationDeviceLinkById(id)
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
  public storeIrrigationDeviceLink = () =>
    this.router.post("/", (req: Request, res: Response) => {
      const params = req.body;
      console.log("router store params");
      console.log(params);
      irrigationDeviceLinkController
        .storeIrrigationDeviceLink(
          params.irrigationDeviceInputId,
          params.irrigationDeviceOutputId,
          params.irrigationDeviceId
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
  public deleteIrrigationDeviceLink = () =>
    this.router.delete("/:id", (req: Request, res: Response) => {
      const id = parseInt(req.params.id);

      irrigationDeviceLinkController
        .deleteIrrigationLinkDevice(id)
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
  public updateIrrigationDeviceLink = () =>
    this.router.put("/", (req: Request, res: Response) => {
      console.log("update");
      const params = req.body;
      console.log(params);
      irrigationDeviceLinkController
        .updateIrrigationDeviceLink(
          params.linkDeviceId,
          params.irrigationDeviceInputId,
          params.irrigationDeviceOutputId
        )
        .then((response: any) => {
          res.send(response);
        })
        .catch((err: any) => {
          res.send(err);
        });
    });
}

const irrigationDeviceInputRouter = new IrrigationDeviceLinkRouter();
export default irrigationDeviceInputRouter.router;
