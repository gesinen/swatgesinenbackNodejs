import { Router, Request, Response } from "express";
import irrigationDeviceInputHistoryController from "../../controllers/irrigation_module/irrigationDeviceInputHistoryController";

class IrrigationDeviceInputHistoryRouter {
  public router: Router = Router();

  constructor() {
    this.getValuesOnDateRange();
    this.storeValue();
  }

  /**
   * Get the user data
   * GET ('/information/:id')
   */
  public getValuesOnDateRange = () =>
    this.router.get("/:irrigationInputDeviceId/:fromDate/:toDate", (req: Request, res: Response) => {
      console.log("params",req.params)
      const irrigationInputDeviceId = parseInt(req.params.irrigationInputDeviceId);
      const fromDate = req.params.fromDate;
      const toDate = req.params.toDate;

      irrigationDeviceInputHistoryController
        .getIrrigationInputDeviceHistoryOnRange(irrigationInputDeviceId,fromDate,toDate)
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
  public storeValue = () =>
    this.router.post("/", (req: Request, res: Response) => {
      const params = req.body;
      console.log("router store params");
      console.log(params);
      irrigationDeviceInputHistoryController
        .storeIrrigationInputDeviceHistory(
          params.irrigationInputDeviceId,
          params.humidity,
          params.temperature,
        )
        .then((response: any) => {
          res.send(response);
        })
        .catch((err: any) => {
          res.send(err);
        });
    });

}

const irrigationDeviceInputHistoryRouter = new IrrigationDeviceInputHistoryRouter();
export default irrigationDeviceInputHistoryRouter.router;
