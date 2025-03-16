import { Router, Request, Response } from "express";
import CameraParkingController from "../../controllers/capacity_module/cameraParking";
class CameraParkingRouter {
    public router: Router = Router();
  
    constructor() {
      this.getCameraParkingMessage();
      this.getCameraParkingList();
      this.postCameraConfigMessage();
      this.PanelCommunication();
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
     
      
      if(req.body.event  == 'Object Counting')
        {
          let detectionLine =null;
           let line = req.body.line == undefined ? null:req.body.line;
           let Vehicle_In = req.body.line != 0 ? req.body['Vehicle In']:null;
           let Vehicle_Out = req.body.line != 0 ? req.body['Vehicle Out']:null;
           if(line == 0 || line == null){
            res.send("message discared");
          }
          else{
            let fullMessage= JSON.stringify(req.body)
           CameraParkingController
        .saveAlteaCameraParking(
            req.body.event,
            req.body.device,
            req.body.time,
            
            req.body.direction,
            null,
            req.body.user,
            req.body.pass,

           //req.body.snapshot,
           line, 
           Vehicle_In,
           Vehicle_Out,
           fullMessage,
            )
        .then((response) => {
          res.send(response);
        })
        .catch((err) => {
          res.send(err);
        });
      }
        }
        else{
           let detectionLine = req.body.detection_line == undefined ? null:req.body.detection_line;
           CameraParkingController
           .saveCameraParking(
               req.body.event,
               req.body.device,
               req.body.time,
                  
               detectionLine,
               req.body.direction,
               null,
               req.body.user,
               req.body.pass,
   
              //req.body.snapshot,
              
               )
           .then((response) => {
             res.send(response);
           })
           .catch((err) => {
             res.send(err);
           });
          }

      console.log('vehical in out',req.body["Vehicle In"],req.body["Vehicle_Out,line"])
      
        
        
    }
  );

/**
   * send message to camera
   * POST ('/panel')
   */
public PanelCommunication = () =>
  this.router.post("/panel", (req: Request, res: Response) => {
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