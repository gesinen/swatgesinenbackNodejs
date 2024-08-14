import { Router, Request, Response } from "express";
import  PublicLightingController  from "../../controllers/PublicLighting_module/publicLightingController";
class PublicLightingRouter {
    // Router
    public router: Router = Router();
  
    // Controller
    private publicLightingController = new PublicLightingController();
  
    // Constructor
    constructor() {
        this.getHistoryOfSelectedPeriod();
  
    }

    public getHistoryOfSelectedPeriod = () =>
        this.router.get("/history", (req: Request, res: Response) => {
          let params = req.body
          this.publicLightingController
            .getHistoryInSelectedPeriod(params.deviceId, params.meterNumber, params.fromDateTime, params.toDateTime)
            .then((response) => {
              res.status(200).send(response);
            })
            .catch((err) => {
              res.status(401).send(err);
            });
        });
}
const publicLightingRouter = new PublicLightingRouter();
export default publicLightingRouter.router;