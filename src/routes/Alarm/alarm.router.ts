import { Router, Request, Response } from "express";
import AlarmsController from "../../controllers/Alarm/Alarm.controller";
import Alarm from "../../models/Alarm/Alarm.model";
import AlarmNotification from "../../models/Alarm/AlarmNotification.model";

class AlarmRoutes {
  public router: Router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // this.router.post("/notification", this.createNotification);
    //this.router.put("/notification/:id", this.updateNotification);
    this.router.delete("/notification/:id/:user_id", this.deleteNotification);
    this.router.get("/notification/:user_id/:id", this.getFromSpecificIdNotification);
    this.router.get("/notification/:user_id/:limit?/:offset?", this.getAllNotifications);
    this.router.put("/notification", this.updateAlarmNotificationStatus);
    
    this.router.get("/:user_creator/:id", this.getFromSpecificId);
    this.router.get("/:user_creator/:limit?/:offset?", this.getAll);
    this.router.get("/:limit?/:offset?", this.getAllForAllUser);
    this.router.post("/", this.create);
    this.router.delete("/:id/:user_creator", this.delete);
    this.router.put("/:id", this.update);

   
  }

  private getDataFromReq(req: Request): Alarm {
    const {
      id = "",
      name = "",
      description = "",
      isActive = true,
      timeToConsiderDeactive = new Date(),
      text = "",
      email = "",
      device = "",
      user_creator = "",
      created_at = "",
      updated_at = "",
    } = req.body;

    return new Alarm(
      id,
      name,
      description,
      isActive,
      timeToConsiderDeactive,
      text,
      email,
      device,
      user_creator,
      created_at,
      updated_at
    );
  }

  private getFromSpecificId = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('get alarm called by id');
      const  id = req.params.id;
      const  user_creator = req.params.user_creator;
      const result = await new AlarmsController().getFromSpecificId(id,user_creator);
      res.status(200).json({ data: result });
    } catch (error) {
      res.send(error);
    }
  };

  private getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("GET ALL");
      const {user_creator ,limit, offset } = req.params;
      const alarmsController = new AlarmsController();
      const result = await alarmsController.getAll(user_creator,limit, offset);
      res.status(200).json({ data: result });
    } catch (error) {
      console.log("ERROR: ", error);
      res.status(500).json({ error: "Error getting all records" });
    }
  };

  private getAllForAllUser = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("GET ALL for all users");
      const {limit, offset } = req.params;
      const alarmsController = new AlarmsController();
      const result = await alarmsController.getAllFromAllUsers(limit, offset);
      res.status(200).json({ data: result });
    } catch (error) {
      console.log("ERROR: ", error);
      res.status(500).json({ error: "Error getting all records" });
    }
  };

  private create = async (req: Request, res: Response): Promise<void> => {
    try {
      const alarm = this.getDataFromReq(req);
      const result = await new AlarmsController().create(alarm);
      res.status(201).json({ data: result });
    } catch (error:any) {
      console.log(error)
      res.status(404).json({ "error": error.message });
    }
  };

  private delete = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('params',req.params);
      const id = req.params.id;
      const user_creator = req.params.user_creator
     
      const result = await new AlarmsController().delete(id,user_creator);
      res.status(200).json({ data: result });
    } catch (error) {
      res.send(error);
    }
  };

  private update = async (req: Request, res: Response): Promise<void> => {
    try {
      const alarm: Alarm = this.getDataFromReq(req);
      alarm.id = req.params.id
      console.log(alarm)
      const result = await new AlarmsController().update(alarm);

      res.status(200).json({ data: result });
    } catch (error) {
      res.send(error);
    }
  };

//Notifications
  private getFromSpecificIdNotification = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('get Notification',req.params);
      const  id = req.params.id;
      const  user_id = req.params.user_id;
      const result = await new AlarmsController().getFromSpecificIdNotification(id,user_id);
      res.status(200).json({ data: result });
    } catch (error) {
      res.send(error);
    }
  };

  private deleteNotification = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('delete Notification',req.params);
      const id = req.params.id;
      const user_id = req.params.user_id
     
      const result = await new AlarmsController().deleteNotification(id,user_id);
      res.status(200).json({ data: result });
    } catch (error) {
      res.send(error);
    }
  };
  private getAllNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("GET ALL notification");
      const {user_id ,limit, offset } = req.params;
      const alarmsController = new AlarmsController();
      const result = await alarmsController.getAllNotification(user_id,limit, offset);
      res.status(200).json({ data: result });
    } catch (error) {
      console.log("ERROR: ", error);
      res.status(500).json({ error: "Error getting all records from Notification" });
    }
  };

  private updateAlarmNotificationStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      
      console.log(req.body)
      const result = await new AlarmsController().updateNotificationStatus(req.body);

      res.status(200).json({ data: result });
    } catch (error) {
      res.send(error);
    }
  };
}

const alarmRoutes = new AlarmRoutes();
export default alarmRoutes.router;
