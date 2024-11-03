import { Router, Request, Response } from "express";
import waterImstController from "../../controllers/water_module/waterImstController";

class WaterImstRouter {
  public router: Router = Router();

  constructor() {
    this.createWaterImstGatewayAction();
    this.getAllWaterImstGatewayAction();
    this.deleteWaterImstGatewayAction();
  }

  public createWaterImstGatewayAction = () =>
    this.router.post("/addGateway", (req: Request, res: Response) => {
      const params = req.body;
      console.log("create water Imst gateway", params)
      waterImstController
        .createWaterImst(
          params.name,
          params.sensor_id,
          params.device_eui,
          params.userId,
          
        )
        .then((response) => {
          res.send(response);
        })
        .catch((err) => {
          res.send(err);
        });
    });


    public getAllWaterImstGatewayAction = () =>
      this.router.get("/allGateway/:userId", (req: Request, res: Response) => {
        
        let userId = parseInt(req.params.userId);
        console.log("create water Imst gateway", userId)
        waterImstController
          .getAllWaterImstGateway(
            userId
          )
          .then((response) => {
            res.send(response);
          })
          .catch((err) => {
            res.send(err);
          });
      });
  
    public deleteWaterImstGatewayAction = () =>
      this.router.delete("/deleteGateway", (req: Request, res: Response) => {
        const params = req.body;
        console.log("create water Imst gateway", params)
        waterImstController
          .deleteWaterImstGateway(
            params.device_eui,
            params.sensor_id,  
          )
          .then((response) => {
            res.send(response);
          })
          .catch((err) => {
            res.send(err);
          });
      });

}

const waterImstRouter = new WaterImstRouter();
export default waterImstRouter.router;