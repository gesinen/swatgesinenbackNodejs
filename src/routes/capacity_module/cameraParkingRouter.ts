import { Router, Request, Response } from "express";
import CameraParkingController from "../../controllers/capacity_module/cameraParking";
class CameraParkingRouter {
    public router: Router = Router();
  
    constructor() {
      this.getCameraParkingMessage();
      this.getCameraParkingList();
      this.postCameraConfigMessage();
    }
    /**
   * send message to camera
   * POST ('/')
   */
  public postCameraConfigMessage = () =>
  this.router.post("/", (req: Request, res: Response) => {
    const params = req.body;

    CameraParkingController
      .PostCameraParking(
        params
      )
      .then((response) => {
        res.send(response);
      })
      .catch((err) => {
        res.send(err);
      });
  });

/**
 * Get a message from camera parking
 * POST ('/message')
 */
public getCameraParkingMessage = () =>
  this.router.post(
    "/message",
    (req: Request, res: Response) => {
      console.log('snapshot',req.body);
      let detectionLine = req.body.detection_line == undefined ? null:req.body.detection_line;
        CameraParkingController
        .saveCameraParking(
            req.body.event,
            req.body.device,
            req.body.time,
            detectionLine,
            req.body.direction,
            null
           //req.body.snapshot,

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
 * Get a message from camera parking
 * GET ('/')
 */
public getCameraParkingList = () =>
this.router.get(
  "/:pageSize/:pageIndex",
  (req: Request, res: Response) => {
      CameraParkingController
      .getCameraParkingList(
        parseInt(req.params.pageSize),
        parseInt(req.params.pageIndex)
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
const cameraParkingRouter = new CameraParkingRouter();
export default cameraParkingRouter.router;