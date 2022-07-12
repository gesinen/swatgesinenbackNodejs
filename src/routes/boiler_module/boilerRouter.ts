import { Router, Request, Response } from "express";
import boilerController from "../../controllers/boiler_module/boilerController";

class BoilerRouter {
  public router: Router = Router();

  constructor() {
    this.createBoilerAction();
    this.updateBoilerAction();
    this.deleteBoilerAction();
    this.getBoilersPaginatedAction();
    this.getBoilerByIdAction();
    this.updateBoilerStatusAction();
    this.updateBoilerPingDataV2();
    this.updateBoilerPingDataActionTempDistV1();
    this.updateBoilerPingDataScheduleV1();
  }

  public createBoilerAction = () =>
    this.router.post("/", (req: Request, res: Response) => {
      const params = req.body;

      boilerController.createBoilerDevice(params.userId, params.name, params.description,
        params.sensorId, params.mode, params.schedule, params.model, params.depth, params.length, params.width)
        .then(response => {
          res.send(response)
        })
        .catch(err => {
          res.send(err)
        })
    });

  public updateBoilerAction = () =>
    this.router.put("/", (req: Request, res: Response) => {
      const params = req.body;

      boilerController.updateBoilerDevice(params.id, params.userId, params.name, params.description, params.sensorId, params.mode,
        params.schedule, params.model, params.depth, params.length, params.width)
        .then(response => {
          res.send(response)
        })
        .catch(err => {
          res.send(err)
        })
    });

  public updateBoilerPingDataV2 = () =>
    this.router.put("/ping", (req: Request, res: Response) => {
      const params = req.body;
      console.log(params)
      boilerController.updateBoilerDevicePingData(params.id, params.distance, params.temperature, params.relayState, params.hourOn,
        params.minuteOn, params.hourOff, params.minuteOff, params.schedulerMode)
        .then(response => {
          res.send(response)
        })
        .catch(err => {
          res.send(err)
        })
    });


  public updateBoilerPingDataActionTempDistV1 = () =>
    this.router.put("/pingDistTempV1", (req: Request, res: Response) => {
      const params = req.body;
      console.log(params)
      boilerController.updateBoilerDevicePingDataTempDistV1(params.id, params.distance, params.temperature)
        .then(response => {
          res.send(response)
        })
        .catch(err => {
          res.send(err)
        })
    });


  public updateBoilerPingDataScheduleV1 = () =>
    this.router.put("/pingScheduleV1", (req: Request, res: Response) => {
      const params = req.body;
      console.log(params)
      boilerController.updateBoilerDevicePingDataScheduleV1(params.id, params.relayState,
        params.hourOn, params.minuteOn, params.hourOff, params.minuteOff, params.schedulerMode)
        .then(response => {
          res.send(response)
        })
        .catch(err => {
          res.send(err)
        })
    });

  public updateBoilerStatusAction = () =>
    this.router.put("/status", (req: Request, res: Response) => {
      const params = req.body;

      boilerController.changeBoilerStatus(params.id, params.releStatus)
        .then(response => {
          res.send(response)
        })
        .catch(err => {
          res.send(err)
        })
    });

  public getBoilersPaginatedAction = () =>
    this.router.get("/:userId/:pageSize/:pageIndex",
      (req: Request, res: Response) => {
        let params: any = req.params
        boilerController
          .getBoilersPaginated(params.userId, params.pageSize, params.pageIndex)
          .then((response) => {
            res.send(response);
          })
          .catch((err) => {
            res.send(err);
          });
      }
    );

  public getBoilerByIdAction = () =>
    this.router.get("/:id",
      (req: Request, res: Response) => {
        let params: any = req.params
        boilerController
          .getBoilerById(params.id)
          .then((response) => {
            res.send(response);
          })
          .catch((err) => {
            res.send(err);
          });
      }
    );

  public deleteBoilerAction = () =>
    this.router.delete("/:id", (req: Request, res: Response) => {

      boilerController.deleteBoilerDevice(parseInt(req.params.id))
        .then(response => {
          res.send(response)
        })
        .catch(err => {
          res.send(err)
        })
    });
}

const boilerRoutes = new BoilerRouter();
export default boilerRoutes.router;
