import { Router, Request, Response } from "express";
import irrigationDeviceInputHistoryController from "../../controllers/irrigation_module/irrigationDeviceInputHistoryController";

class IrrigationDeviceInputHistoryRouter {
  public router: Router = Router();

  constructor() {
    this.getValuesOnDateRange();
    this.storeValue();
    this.storeValueLora();
    this.getValuesOnDateRangeLora();
  }

  /**
   * Get the user data
   * GET ('/information/:id')
   */
  public getValuesOnDateRange = () =>
    this.router.get("/modbus/:irrigationDeviceId/:irrigationInputDeviceIndex/:fromDate/:toDate", (req: Request, res: Response) => {
      console.log("params", req.params)
      const irrigationDeviceId = parseInt(req.params.irrigationDeviceId);
      const irrigationInputDeviceIndex = parseInt(req.params.irrigationInputDeviceIndex);
      const fromDate = req.params.fromDate;
      const toDate = req.params.toDate;

      irrigationDeviceInputHistoryController
        .getIrrigationInputDeviceHistoryOnRange(irrigationDeviceId, irrigationInputDeviceIndex, fromDate, toDate)
        .then((response: any) => {
          res.send(response);
        })
        .catch((err: any) => {
          res.send(err);
        });
    });

  /**
  * Get the user data
  * GET ('/information/:id')
  */
  public getValuesOnDateRangeLora = () =>
    this.router.get("/lora/:irrigationDeviceId/:fromDate/:toDate", (req: Request, res: Response) => {
      console.log("params", req.params)
      const irrigationDeviceId = parseInt(req.params.irrigationDeviceId);
      const fromDate = req.params.fromDate;
      const toDate = req.params.toDate;

      irrigationDeviceInputHistoryController
        .getIrrigationInputDeviceHistoryOnRangeLora(irrigationDeviceId, fromDate, toDate)
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
  public storeValue = () => this.router.post("/", (req: Request, res: Response) => {
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

  /**
  * Get user related municipality_id
  * GET ('/municipality/{user_id}')
  * params user_id -> id of the user we want to get the municipality_id from
  */
  public storeValueLora = () => this.router.post("/lora", (req: Request, res: Response) => {
    const params = req.body;
    console.log("router store params");
    console.log(params);
    irrigationDeviceInputHistoryController
      .storeIrrigationInputDeviceHistoryLora(
        params.irrigationDeviceId,
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
