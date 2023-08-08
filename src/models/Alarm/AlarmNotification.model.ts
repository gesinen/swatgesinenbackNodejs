import db from "../../database2";
import { StatusIndividual, Devices } from "./Status";


import {
  queryDeleteAlarmNotification,
  queryGetAllAlarmNotification,
  queryGetFromIdAlarmNotification,
   queryCreateTableAlarmNotifications,
   queryGetAllNotificationCount,
   queryUpdateAlarmNotificationStatus
} from "./query";
 
class AlarmNotification {
  id?: string;
  alarm_id?: string;
  user_id?: number;
  gateway_mac?:string;
  device_eui?: string;
  sensor_id?: number;
  status?: string;
  description?: string;
  email?: string;
  email_text?:string
  created_dt?: string;
  updated_dt?: string;

  constructor(

    id?: string,
  alarm_id?: string,
  user_id?: number,
  gateway_mac?:string,
  device_eui?: string,
  sensor_id?: number,
  status?: string,
  description?: string,
  email?: string,
  email_text?:string,
  created_dt?: string,
  updated_dt?: string
  ) {
    this.id = id;
    this.alarm_id = alarm_id;
    this.user_id = user_id;
    this.gateway_mac = gateway_mac;
    this.device_eui = device_eui;
    this.sensor_id = sensor_id;
    this.email = email;
    this.status = status;
    this.description = description;
    this.email_text= email_text,
    this.created_dt = created_dt;
    this.updated_dt = updated_dt;
  }

  public async createTableIfNotExists(): Promise<void> {
    try {
      await db.query(queryCreateTableAlarmNotifications);
      return Promise.resolve();
    } catch (error) {
      throw new Error("Error creating table");
    }
  }

  

  

  
  public async update(data:any): Promise<void> {
    const values = [
      this.status = data.AlarmStatus,
      this.id = data.id
    ];

    try {
    console.log(values, queryUpdateAlarmNotificationStatus)
    await db.query(queryUpdateAlarmNotificationStatus, values);
    } catch (error) {
      throw new Error("Error updating Notification record ");
    }
  }

  public async getAll(user_id:string, limit?: string, offset?: string): Promise<any[]> {
    let query = queryGetAllAlarmNotification;
    const conditions: string[] = [];
    const values: any[] = [];
    values.push(user_id);
    if (limit) {
      query += " LIMIT ?";
      values.push(Number(limit));
    }

    if (offset) {
      let finalOffset = (Number(offset) - 1) * Number(limit);
      query += " OFFSET ?";
      values.push(Number(finalOffset));
    }

    query += ";";

    try {
      console.log(query, values);
      const results: any = await db.query(query, values);
      const total: any = await db.query(queryGetAllNotificationCount,values);
      return [{"result":results,"total":total}];
    } catch (error) {
      console.log('error',error);
      throw new Error("Error getting all records");
    }
  }

  public async getById(id:string,user_id:string): Promise<AlarmNotification | null> {
    const query = queryGetFromIdAlarmNotification;
    const values = [id,user_id];

    try {
      const results: any = await db.query(query, values);
      if (results.length === 0) {
        return null;
      } else {
        const row = results[0];
        return new AlarmNotification(
            row.id,
            row.alarm_id,
            row.user_id,
            row.gateway_mac,
            row.device_eui,
            row.sensor_id,
            row.email,
            row.status,
            row.description,
            row.email_text,
            row.created_dt,
            row.updated_dt
        );
      }
    } catch (error) {
      throw new Error("Error getting record by ID");
    }
  }

  public async delete(id:string,user_id:string): Promise<void> {
    const values = [id,
        user_id];

    try {
      console.log('in model',queryDeleteAlarmNotification, values)
      await db.query(queryDeleteAlarmNotification, values);
    } catch (error) {
      throw new Error("Error deleting record");
    }
  }
}

export default AlarmNotification;
