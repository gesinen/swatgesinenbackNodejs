import Alarm from "../../models/Alarm/Alarm.model";
import AlarmNotification from "../../models/Alarm/AlarmNotification.model";

class AlarmsController {
  constructor() {}

  public async create(alarm: Alarm): Promise<object> {
    try {
      
      await alarm.create();
      return {};
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async update(alarm: Alarm): Promise<object> {
    try {
      await alarm.update();
      return { db: "Update successful" };
    } catch (error:any) {
      throw new Error(error);
    }
  }

  public async getAll(user_creator:string,limit?: string, offset?: string): Promise<object> {
    try {
      const alarm = new Alarm();
      const alarms = await alarm.getAll(user_creator,limit, offset);
      console.log("ALARMS: ", alarms);
      return { db: alarms };
    } catch (error:any) {
      throw new Error(error);
    }
  }

  public async getAllFromAllUsers(limit?: string, offset?: string): Promise<object> {
    try {
      const alarm = new Alarm();
      const alarms = await alarm.getAllForAllUsers(limit, offset);
      console.log("All ALARMS: ", alarms);
      return { db: alarms };
    } catch (error:any) {
      throw new Error(error);
    }
  }

  public async delete(id: string,user_creator:string): Promise<object> {
    try {
      console.log(id,user_creator)
      await new Alarm().delete(id,user_creator);
      return { db: "Delete successful" };
    } catch (error:any) {
      throw new Error(error);
    }
  }

  public async getFromSpecificId(id: string,user_creator:string): Promise<object> {
    try {
      const alarm = await new Alarm(id).getById(id,user_creator);
      return { db: alarm };
    } catch (error:any) {
      throw new Error(error);
    }
  }
  //Notofocations

public async getFromSpecificIdNotification(id: string,user_id:string): Promise<object> {
  try {
    const alarmNotification = await new AlarmNotification(id).getById(id,user_id);
    return { db: alarmNotification };
  } catch (error:any) {
    throw new Error(error);
  }
}
public async deleteNotification(id: string,user_id:string): Promise<object> {
  try {
    console.log(id,user_id)
    await new AlarmNotification().delete(id,user_id);
    return { db: "Delete successful" };
  } catch (error:any) {
    throw new Error(error);
  }
}
public async getAllNotification(user_id:string,limit?: string, offset?: string): Promise<object> {
  try {
    const alarmNotification = new AlarmNotification();
    const alarmNotifications = await alarmNotification.getAll(user_id,limit, offset);
    console.log("ALARMS Notifications: ", alarmNotifications);
    return { db: alarmNotifications };
  } catch (error:any) {
    throw new Error(error);
  }
}
public async updateNotificationStatus(data:any): Promise<object> {
  try {
    console.log('data in crontroller',data)
    const alarmNotification = new AlarmNotification();
    await alarmNotification.update(data);
    return { db: "Notification Update successful" };
  } catch (error:any) {
    throw new Error(error);
  }
}

}



export default AlarmsController;
