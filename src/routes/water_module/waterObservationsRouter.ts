import { Router, Request, Response } from "express";
import waterObservationsController from "../../controllers/water_module/waterObservationsController";
//const formidable = require('formidable');

class WaterObservationsRouter {
  public router: Router = Router();

  constructor() {
    this.importFileAction();
    this.getObservationsByDeviceId();
    this.getWaterDeviceObservationsMediumValueInRange();
    this.getGroupsHydricBalance()
    this.getGroupsHydricBalanceOnRange()
  }

  /**
   * Import observations file
   * POST ('/import')
   */
  public importFileAction = () =>
    this.router.post("/import/", (req: Request, res: Response) => {
      const params = req.body;
      //console.log("importFileAction -- waterRouter")
      //console.log(req.body)
      waterObservationsController
        .importFile(
          params,
          waterObservationsController.insertNewWaterObservations
        )
        .then((response) => {
          res.send(response);
        })
        .catch((err) => {
          res.send(err);
        });
    });

  /**
   * Get observations by device id in date range
   * POST ('/observationsByDeviceId')
   */
  public getObservationsByDeviceId = () =>
    this.router.post(
      "/observationsByDeviceId/",
      (req: Request, res: Response) => {
        const params = req.body;
        console.log("PARAMS", params)
        waterObservationsController
          .getObservationValuesByDeviceId(
            params.devicesIdArray,
            params.fromDate,
            params.userColSelection
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
* Get observations by device id in date range
* POST ('/observationsByDeviceId')
*/
  public getGroupsHydricBalance = () =>
    this.router.post(
      "/getGroupsHydricBalance/",
      (req: Request, res: Response) => {
        const params = req.params;
        console.log("PARAMS", params)
        waterObservationsController
          .getGroupHydricBalance()
          .then((response) => {
            res.send(response);
          })
          .catch((err) => {
            res.send(err);
          });
      }
    );


  /**
* Get observations by device id in date range
* POST ('/observationsByDeviceId')
*/
  public getGroupsHydricBalanceOnRange = () =>
    this.router.get(
      "/getGroupsHydricBalance/:groupId/:dateFrom/:dateTo",
      (req: Request, res: Response) => {
        const params = req.params;
        console.log("PARAMS", params)
        waterObservationsController
          .getGroupBalanceOnRange(params.groupId,params.dateFrom,params.dateTo)
          .then((response) => {
            res.send(response);
          })
          .catch((err) => {
            res.send(err);
          });
      }
    );

  /**
* Get observations by device id in date range
* POST ('/observationsByDeviceId')
*/
  public getWaterDeviceObservationsMediumValueInRange = () =>
    this.router.get("/mediumValueInRange/:waterDeviceId/:fromDate/:toDate", (req: Request, res: Response) => {
      const params = req.params;
      waterObservationsController
        .getObservationsByRangeDateAndDeviceId(
          params.waterDeviceId,
          params.fromDate,
          params.toDate
        )
        .then((response) => {
          res.send(response);
        })
        .catch((err) => {
          res.send(err);
        });
    }
    );
}

const waterObservationsRouter = new WaterObservationsRouter();
export default waterObservationsRouter.router;
