import { Router, Request, Response } from "express";
import sensorController from "../../controllers/sensor_module/sensorController";
import serverController from "../../controllers/servers_module/serverController";

class ServerRouter {
  public router: Router = Router();

  constructor() {
    this.getServerTokenAndProviderIdAction();
    this.getUserServerListAction();
    this.createServerAndGatewayLinkAction();
    this.getGatewaysServerInfo();
    this.getSensorServerDetailAction();
  }

  public getUserServerListAction = () =>
    this.router.get("/list/:user_id", (req: Request, res: Response) => {
      const user_id = req.params.user_id;
      serverController
        .getUserServerList(user_id)
        .then((response) => {
          res.send(response);
        })
        .catch((err) => {
          res.send(err);
        });
    });

  public getServerTokenAndProviderIdAction = () =>
    this.router.get(
      "/providerIdAndToken/:server_id",
      (req: Request, res: Response) => {
        const server_id = req.params.server_id;

        serverController
          .getServerTokenAndProviderId(parseInt(server_id))
          .then((response) => {
            res.send(response);
          })
          .catch((err) => {
            res.send(err);
          });
      }
    );

  public getGatewaysServerInfo = () =>
    this.router.get(
      "/gatewayServers/:gateway_mac",
      (req: Request, res: Response) => {
        const gatewayMac = req.params.gateway_mac;

        serverController
          .getGatewaysServerInfo(gatewayMac)
          .then((response) => {
            res.send(response);
          })
          .catch((err) => {
            res.send(err);
          });
      }
    );

  public createServerAndGatewayLinkAction = () =>
    this.router.post(
      "/createServerAndGatewayLink/",
      (req: Request, res: Response) => {
        const params = req.body;

        serverController
          .createServerAndGatewayLink(
            params.gateway_mac,
            params.server_id,
            params.pk_id
          )
          .then((response) => {
            res.send(response);
          })
          .catch((err) => {
            res.send(err);
          });
      }
    );

  public getSensorServerDetailAction = () =>
    this.router.get(
      "/sensor_server_detail/:sensorId",
      (req: Request, res: Response) => {
        const sensorId = req.params.sensorId;

        serverController
          .getSensorServerDetail(sensorId)
          .then((response) => {
            res.send(response);
          })
          .catch((err) => {
            res.send(err);
          });
      }
    );
}

const serverRoutes = new ServerRouter();
export default serverRoutes.router;
