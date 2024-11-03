import { Router, Request, Response } from "express";
import sensorController from "../../controllers/sensor_module/sensorController";

class SensorRouter {
  public router: Router = Router();

  constructor() {
    this.createSensorAction();
    this.getSensorGatewayIdAction();
    this.getSensorSentiloObservationsAction();
    this.getSensorGatewayMacAction();
    this.getSensorDevEuiAndGatewayMacAction();
    this.getSensorByDevEui();
    this.getGatewaySensorPkId();
  }

  public createSensorAction = () =>
    this.router.post("/", (req: Request, res: Response) => {
      const params = req.body;
      /*
        sensorController.createMultipleSensors(params.user_id,params.name, params.description, params.provider, params.device_EUI, params.app_EUI, params.app_KEY)
            .then(response => {
                res.send(response)
            })
            .catch(err => {
                res.send(err)
            })*/
    });
  public getSensorGatewayIdAction = () =>
    this.router.get(
      "/sensorGatewayId/:sensorId",
      (req: Request, res: Response) => {
        sensorController
          .getSensorGatewayId(req.params.sensorId)
          .then((response) => {
            res.send(response);
          })
          .catch((err) => {
            res.send(err);
          });
      }
    );

  public getSensorDevEuiAndGatewayMacAction = () =>
    this.router.get(
      "/mqttinfo/:sensorId",
      (req: Request, res: Response) => {
        sensorController
          .getSensorDevEuiGatewayMac(req.params.sensorId)
          .then((response) => {
            res.send(response);
          })
          .catch((err) => {
            res.send(err);
          });
      }
    );

  public getSensorByDevEui = () =>
    this.router.get(
      "/deveui/:deveui",
      (req: Request, res: Response) => {
        sensorController
          .getSensorByDeviceEUI(req.params.deveui)
          .then((response) => {
            res.send(response);
          })
          .catch((err) => {
            res.send(err);
          });
      }
    );

  public getSensorGatewayMacAction = () =>
    this.router.get(
      "/sensorGatewayMac/:sensorId",
      (req: Request, res: Response) => {
        sensorController
          .getSensorGatewayMac(req.params.sensorId)
          .then((response) => {
            res.send(response);
          })
          .catch((err) => {
            res.send(err);
          });
      }
    );

    public getGatewaySensorPkId = () =>
      this.router.get(
        "/sensorPkIdByGateway/:gatewayMac",
        (req: Request, res: Response) => {
          sensorController
            .getGatewaySensorPkIdAction(req.params.gatewayMac)
            .then((response) => {
              res.send(response);
            })
            .catch((err) => {
              res.send(err);
            });
        }
      );
  

  public getSensorSentiloObservationsAction = () =>
    this.router.get(
      "/observations/:sensorId",
      (req: Request, res: Response) => {
        console.log(" *** ON ROUTER *** ");
        sensorController
          .addSensorObservationsFromSentilo(
            parseInt(req.params.sensorId),
            1,
            1,
            1
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

const sensorRoutes = new SensorRouter();
export default sensorRoutes.router;
