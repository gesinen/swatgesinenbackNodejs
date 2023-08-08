import db from "../../database2";
import { StatusIndividual, Devices } from "./Status";
/**
 *    id --> UUID PRIMARY KEY (id)
 *    name --> Alarm Name
 *    description --> alarm description
 *    isActive --> Bool  Alarm is active - True / is deactive - False
 *    timeToConsiderDeactive --> timeToConsiderDeactive example 02:30:00 2hours and 30 mins since last seen will be considered deactive and then send alarms
 *    text --> text which will be sended in the email " this text is an example and will be sended to the email example@example.com "
 *    email --> array of emails to send the alarm,
 *    device --> JSON {gateway:[{mac_number:"XXXXXXX",status:"xxxx"},],sensor:[{deveui:"XXXXXXX",status:"xxxx"},]}
 *    user_creator --> User creator
 * 
 * EXAMPLE: 
 * {
 *   "name": "2 Alarma Prueba con Fran 2",
 *   "description": "Esta es la description",
 *   "isActive": true,
 *   "timeToConsiderDeactive": "02:30:00",
 *   "text": "Este texto es una prueba que debe de ser enviado en caso de deactive device.",
 *   "email": "danielburru@gmail.com",
 *   "device": {"gateway":[{"mac_number":"xxxxxxx", "status":"OK"}],"sensor":[{"deveui":"xxxxxxx", "status":"OK"}]},
 *   "user_creator": "1"
 * }
 */

import {
  queryCreate,
  queryDelete,
  queryGetAll,
  queryGetAllForAllUsers,
  queryGetFromId,
  queryUpdate,
  queryCreateTable,
} from "./query";

class Alarm {
  id?: string;
  name?: string;
  description?: string;
  isActive?:boolean;
  timeToConsiderDeactive?: string;
  text?: string;
  email?: string;
  device?: Devices;
  user_creator?: string;
  created_at?: string;
  updated_at?: string;

  constructor(

    id?: string,
    name?: string,
    description?: string,
    isActive?: boolean,
    timeToConsiderDeactive?: string,
    text?: string,
    email?: string,
    device?: Devices,
    user_creator?: string,
    created_at?: string,
    updated_at?: string
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.isActive = isActive;
    this.timeToConsiderDeactive = timeToConsiderDeactive;
    this.text = text;
    this.email = email;
    this.device = device;
    this.user_creator = user_creator;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  public async createTableIfNotExists(): Promise<void> {
    try {
      await db.query(queryCreateTable);
      return Promise.resolve();
    } catch (error) {
      throw new Error("Error creating table");
    }
  }

  public async create(): Promise<number> {
    const values = [
      this.name,
      this.description,
      this.isActive,
      this.timeToConsiderDeactive,
      this.text,
      this.email,
      JSON.stringify(this.device),
      this.user_creator,
    ];
    console.log(values, queryCreate)
    try {
      const results: any = await db.query(queryCreate, values);
      const insertedId = results.insertId;
      return insertedId;
    } catch (error) {
      throw new Error("Error creating record");
    }
  }

  public async update(): Promise<void> {
    const values = [
      this.name,
      this.description,
      this.isActive,
      this.timeToConsiderDeactive,
      this.text,
      this.email,
      JSON.stringify(this.device),
      this.id
    ];

    try {
    console.log(values, queryUpdate)
    await db.query(queryUpdate, values);
    } catch (error) {
      throw new Error("Error updating record");
    }
  }

  public async getAllForAllUsers( limit?: string, offset?: string): Promise<any[]> {
    let query = queryGetAllForAllUsers;
    const conditions: string[] = [];
    const values: any[] = [];
    
    if (limit) {
      query += " LIMIT ?";
      values.push(Number(limit));
    }

    if (offset) {
      query += " OFFSET ?";
      values.push(Number(offset));
    }

    query += ";";

    try {
      console.log(query, values);
      const results: any = await db.query(query, values);
      return results;
    } catch (error) {
      console.log('error',error);
      throw new Error("Error getting all records");
    }
  }

  public async getAll(user_creator:string, limit?: string, offset?: string): Promise<any[]> {
    let query = queryGetAll;
     
    const conditions: string[] = [];
    const values: any[] = [];
    values.push(user_creator);
    
    if (limit) {
      query += " LIMIT ?";
      values.push(Number(limit));
    }

    if (offset) {
      query += " OFFSET ?";
      values.push(Number(offset));
    }

    query += ";";

    try {
      console.log(query, values);
      const results: any = await db.query(query, values);
      return results;
    } catch (error) {
      console.log('error',error);
      throw new Error("Error getting all records");
    }
  }

  public async getById(id:string,user_creator:string): Promise<Alarm | null> {
    const query = queryGetFromId;
    const values = [id,user_creator];

    try {
      const results: any = await db.query(query, values);
      if (results.length === 0) {
        return null;
      } else {
        const row = results[0];
        return new Alarm(
          row.id,
          row.name,
          row.description,
          row.isActive,
          row.timeToConsiderDeactive,
          row.text,
          row.email,
          row.device,
          row.user_creator,
          row.created_at,
          row.updated_at
        );
      }
    } catch (error) {
      throw new Error("Error getting record by ID");
    }
  }

  public async delete(id:string,user_creator:string): Promise<void> {
    const values = [id,
      user_creator];

    try {
      console.log('in model',queryDelete, values)
      await db.query(queryDelete, values);
    } catch (error) {
      throw new Error("Error deleting record");
    }
  }
}

export default Alarm;
