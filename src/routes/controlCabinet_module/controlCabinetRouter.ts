import { Router, Request, Response } from "express";
import controlCabinetController from "../../controllers/controlCabinet_module/controlCabinetController";

class ControlCabinetRouter {
  public router: Router = Router();
  constructor() {
    this.createColorControlCabinetAction();
    this.updateColorControlCabinetAction();
    this.getColorControlCabinetByUserIdAction();
  }

  public createColorControlCabinetAction = () =>
    this.router.post("/create", (req: Request, res: Response) => {
      const params = req.body;

      controlCabinetController.createColorControlCabinet(params.userId, params.valleColor, params.llanoColor,
        params.puntaColor, params.llano2Color,params.weather)
        .then(response => {
          res.send(response)
        })
        .catch(err => {
          res.send(err)
        })
    });

    public updateColorControlCabinetAction = () =>
    this.router.put("/update", (req: Request, res: Response) => {
      const params = req.body;
      console.log(params)
      controlCabinetController.updateColorControlCabinetById(params.id, params.userId, params.valleColor, params.llanoColor,
        params.puntaColor, params.llano2Color,params.weather)
        .then(response => {
          res.send(response)
        })
        .catch(err => {
          res.send(err)
        })
    });

    public getColorControlCabinetByUserIdAction = () =>
    this.router.get("/:userId",
      (req: Request, res: Response) => {
        let params: any = req.params
        controlCabinetController
          .getControlCabinetColorByUserId(params.userId)
          .then((response) => {
            res.send(response);
          })
          .catch((err) => {
            res.send(err);
          });
      }
    );

}
const controlCabinetRoutes = new ControlCabinetRouter();
export default controlCabinetRoutes.router;