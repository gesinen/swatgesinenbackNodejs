import { Router, Request, Response } from "express";
import waterDevicesController from "../../controllers/water_module/waterUsersController";
import waterObservationsController from "../../controllers/water_module/waterObservationsController";
import usersController from "../../controllers/usersController";
import waterUsersController from "../../controllers/water_module/waterUsersController";

class WaterUsersRouter {
  public router: Router = Router();

  constructor() {
    this.getAllWaterUsersByDevicesBySewerUseAction();// shesh created this method
    this.getAllWaterUsersAction();
    this.getWaterUserDeviceAction();
    this.importFileAction();
    this.getWaterUserMunicipalityIdAction();
    this.getUserByNif();
  }

  /**
   * Get user related water_users
   * GET ('/all/:user_id')
   * params user_id -> id of the user we want to get users from
   */
   public getAllWaterUsersByDevicesBySewerUseAction = () =>
   this.router.get("/alluserwithdeviceandsewerinfo/:user_id", (req: Request, res: Response) => {
     const params = req.params;

     waterDevicesController
       .getAllWaterUsersByDeviceAndsewerInfo(parseInt(params.user_id))
       .then((response) => {
         res.send(response);
       })
       .catch((err) => {
         res.send(err);
       });
   });

  /**
   * Get user related water_users
   * GET ('/all/:user_id')
   * params user_id -> id of the user we want to get users from
   */
  public getAllWaterUsersAction = () =>
    this.router.get("/all/:user_id", (req: Request, res: Response) => {
      const params = req.params;

      waterDevicesController
        .getAllWaterUsers(parseInt(params.user_id))
        .then((response) => {
          res.send(response);
        })
        .catch((err) => {
          res.send(err);
        });
    });

  /**
   * Get user related water_users
   * GET ('/userByNif/:nif')
   * params : nif -> user nif
   */
  public getUserByNif = () =>
    this.router.get("/userByNif/:nif", (req: Request, res: Response) => {
      const params = req.params;

      waterDevicesController
        .getUserByNif(params.nif)
        .then((response) => {
          res.send(response);
        })
        .catch((err) => {
          res.send(err);
        });
    });

  /**
   * Get user related water_devices
   * GET ('/device/{user_id}')
   * params user_id -> id of the user we want to get devices from
   */
  public getWaterUserDeviceAction = () =>
    this.router.get("/device/:user_id", (req: Request, res: Response) => {
      const user_id = req.params.user_id;

      waterDevicesController
        .getWaterUserDevice(parseInt(user_id))
        .then((response) => {
          res.send(response);
        })
        .catch((err) => {
          res.send(err);
        });
    });

  /**
   * Get user related municipality_id
   * GET ('/municipality/{user_id}')
   * params user_id -> id of the user we want to get the municipality_id from
   */
  public getWaterUserMunicipalityIdAction = () =>
    this.router.get("/municipality/:user_id", (req: Request, res: Response) => {
      const user_id = req.params.user_id;

      waterDevicesController
        .getWaterUserMunicipalityId(parseInt(user_id))
        .then((response) => {
          res.send(response);
        })
        .catch((err) => {
          res.send(err);
        });
    });

  /**
   * Import observations file
   * POST ('/import')
   */
  public importFileAction = () =>
    this.router.post(
      "/import/:user_id/:municipality_id",
      (req: Request, res: Response) => {
        const user_id = req.params.user_id;
        const municipality_id = req.params.municipality_id;
        const params = req.body;
        //console.log("importFileAction -- usersRouter")
        //console.log(req.body)
        waterUsersController
          .importFile(params, user_id, municipality_id)
          .then((response) => {
            res.send(response);
          })
          .catch((err) => {
            res.send(err);
          });
      }
    );
}

const waterUsersRoutes = new WaterUsersRouter();
export default waterUsersRoutes.router;
