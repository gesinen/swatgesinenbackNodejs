/***
 * Daniel Burruchaga Sola
 * 23/05/2023
 *
 * Ping: Save  the the last seen
 *
 * id
 * device_EUI (if its null its referenced to the NetworkServer with mac_number)
 * mac_number
 * status
 * message_datetime
 * created_dt
 * updated_dt
 *
 */
import {
  queryGetAllGateway,
  queryGetAllDevice,
  queryGetFromIdGateway,
  queryGetFromIdDevice,
  queryGetSensorLastSeenByDeveui,
  queryGetGatewayLastSeenByMac,
} from "./query";

import db from "../../database";

class Ping {
  id?: number;
  device_EUI?: string | null;
  mac_number?: string;
  status?: number;
  message_datetime?: string;
  created_dt?: any;
  updated_dt?: any;

  constructor(
    id?: number,
    device_EUI?: string | null,
    mac_number?: string,
    status?: number,
    message_datetime?: string,
    created_dt?: any,
    updated_dt?: any
  ) {
    this.id = id;
    this.device_EUI = device_EUI;
    this.mac_number = mac_number;
    this.status = status;
    this.message_datetime = message_datetime;
    this.created_dt = created_dt;
    this.updated_dt = updated_dt;
  }

  public async getByDeveuiOrMac(): Promise<Ping | null> {
    const query = this.device_EUI
      ? queryGetSensorLastSeenByDeveui
      : queryGetGatewayLastSeenByMac;
    const values = this.device_EUI
      ? [this.device_EUI]
      : [this.mac_number];

    try {
      const results: any = await db.query(query, values);
      if (results.length === 0) {
        return null;
      } else {
        const row = results[0];
        const ping = new Ping(
          row.id,
          row.device_EUI || null,
          row.mac_number,
          row.status,
          row.message_datetime,
          row.created_dt,
          row.updated_dt
        );
        return ping;
      }
    } catch (error) {
      throw new Error("Error getting record by ID");
    }
  }

  public async getAll(itsDevice: boolean, limit?: string, offset?: string) {
    let query = itsDevice ? queryGetAllDevice : queryGetAllGateway;
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

    try {
      const results = await db.query(query, values);
      return results;
    } catch (error) {
      throw new Error("Error getting all records: " + error);
    }
  }

  public async getById(): Promise<Ping | null> {
    const query = this.device_EUI
      ? queryGetFromIdDevice
      : queryGetFromIdGateway;
    const values = [this.id];

    try {
      const results: any = await db.query(query, values);
      if (results.length === 0) {
        return null;
      } else {
        const row = results[0];
        const ping = new Ping(
          row.id,
          row.device_EUI || null,
          row.mac_number,
          row.status,
          row.message_datetime,
          row.created_dt,
          row.updated_dt
        );
        return ping;
      }
    } catch (error) {
      throw new Error("Error getting record by ID");
    }
  }
}

export default Ping;
