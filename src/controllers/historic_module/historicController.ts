import { Request, Response } from "express";
import db from "../../database";
import { Utils } from "../../utils/Utils";
import sensorController from "../sensor_module/sensorController";
import SensorValue from "../../models/Sensor_Historic";
import { v4 as uuidv4 } from 'uuid';
/*
 * /water/
 */
class HistoricController {
  queryIfNotExist: string;
  service: any;
  queryIfNotExistLink: string;
  
  constructor() {
    this.queryIfNotExist =
      "CREATE TABLE IF NOT EXISTS historic (  id int auto_increment PRIMARY KEY,sensorName VARCHAR(255) NOT NULL,created_at TIMESTAMP NOT NULL ,value INT NOT NULL,device_id INT NOT NULL,sensor_id INT NOT NULL,user_id INT NOT NULL);";
    this.service = null;
  }

  private queryDb(query: any, reject: any, resolve: any) {
    try {
      db.getConnection((err: any, conn: any) => {
        if (err) {
          reject({
            http: 401,
            status: "Failed",
            error: err,
          });
        }
        console.log('query',query);
        conn.query(query, (error: any, results: any) => {
          conn.release();

          if (error) {
            reject({
              http: 401,
              status: "Failed",
              error: error,
            });
          }
          if (results) {
            resolve({
              http: 200,
              status: "Success",
              capacity_devices: results,
            });
          } else {
            reject({
              http: 401,
              status: "Failed",
              error: error,
            });
          }
        });
      });
    } catch (error) {
      reject({
        http: 401,
        status: "Failed",
        error: error,
      });
    }
  }

  private async _queryDbPromise(query: any) {
    return new Promise((resolve, reject) => {
      this.checkIfExistTable(this.queryIfNotExist, reject);
      this.queryDb(query, reject, resolve);
    });
  }

  private checkIfExistTable(query: any, reject: any) {
    try {
      db.getConnection((err: any, conn: any) => {
        if (err) {
          reject({
            http: 401,
            status: "Failed",
            error: err,
          });
        }

        conn.query(query, (error: any, results: any) => {
          conn.release();

          if (error) {
            reject({
              http: 401,
              status: "Failed",
              error: error,
            });
          }
          if (results) {
            console.log(results);
          } else {
            reject({
              http: 401,
              status: "Failed",
              error: error,
            });
          }
        });
      });
    } catch (error) {
      reject({
        http: 401,
        status: "Failed",
        error: error,
      });
    }
  }

  public async updateHistoric(sensor: SensorValue): Promise<object> {
    return new Promise((resolve: any, reject: any) => {
      // TODO: Implement db call
      this.checkIfExistTable(this.queryIfNotExist, reject);
      var query = "";
      this.queryDb(query, reject, resolve);
    });
  }

  public async deleteHistoric(id: number): Promise<object> {
    return new Promise((resolve: any, reject: any) => {
      // TODO: Implement db call
    });
  }

  public async getAllHistoric(): Promise<object> {
    return new Promise((resolve: any, reject: any) => {
      // TODO: Implement db call
      resolve({});
    });
  }

  public async getHistoricInfoFromSpecificId(id: number): Promise<object> {
    return new Promise((resolve: any, reject: any) => {
      // TODO: Implement db call
    });
  }

  /**
   *
   * @param sensorValues
   * const sensorValues: SensorValue[] = [
   * { sensorName: "sensor1", created_at: "2023-02-17", value: 10 },
   * { sensorName: "sensor2", created_at: "2023-02-17", value: 20 },
   * { sensorName: "sensor3", created_at: "2023-02-17", value: 30 },
   * ];
   *
   * @returns Promise
   */

  public async createHistoric(
    sensorValues: SensorValue[]
  ): Promise<object[]> {
    return new Promise((resolve: any, reject: any) => {
      this.checkIfExistTable(this.queryIfNotExist, reject);
      let promiseArray: Promise<any>[] = [];
      sensorValues.forEach(async (sensor) => {
          let res : any = await this.getGenricDeviceInfo((sensor.sensorName).slice(0, -3))
        //sensor.forEach((observation: SensorValue) => {
           
          //console.log('response',res);
          //console.log(res.result[0].deviceeui);
          if(res.http == 200){
            let deviceeui = res.result[0].deviceeui;
            let deviceId = res.result[0].id;
            let sensorId = res.result[0].sensor_id;
            let userId =res.result[0].user_id == null? 0:res.result[0].user_id;
            console.log(deviceeui,deviceId,sensor.value,sensor.received_at,userId);
            const Insertquery = `INSERT INTO generic_observations (device_eui,device_id,observation,observation_time) VALUES ('${deviceeui}', '${deviceId}', '${sensor.value}','${sensor.received_at}')`;
           // const updatedQuery = `update sensor_ping set messsageTimes = '${sensor.received_at}' where id = '${sensorId}'`;
            const updatedGericObservationQuery = `update generic_device_variables set observation_time = '${sensor.received_at}' , last_observation = '${sensor.value}' where generic_device = '${deviceId}'`;
           // let response = await this.InsertGenericObservations(Insertquery);
          //console.log('generic_observation',response);
          //promiseArray.push(this._queryDbPromise(Insertquery));
       // console.log('updateQuery',updatedGericObservationQuery);
          const query = `INSERT INTO historic (sensorName, created_at, value, device_id,user_id,sensor_id) VALUES ('${sensor.sensorName}', '${sensor.received_at}', '${sensor.value}','${sensor.device_id}','${sensor.sensor_id}','${sensor.user_id}')`;
          promiseArray.push(this._queryDbPromise(updatedGericObservationQuery));
         // promiseArray.push(this._queryDbPromise(updatedQuery));
          promiseArray.push(this._queryDbPromise(Insertquery));
          promiseArray.push(this._queryDbPromise(query));
          }
          //});
      });
      Promise.all(promiseArray)
        .then(() => {
          const insertedRows = sensorValues.flat().length;
          resolve([{ message: `Inserted ${insertedRows} rows into historic table` }]);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async InsertGenericObservations(query: string): Promise<object> {

    return new Promise((resolve: any, reject: any) => {

        db.getConnection((err: any, conn: any) => {

            conn.query(query, (error: any, results: any) => {
                conn.release()

                if (error) {
                    reject({
                        http: 406,
                        status: 'Failed',
                        error: error
                    })
                }
                resolve({
                    http: 200,
                    status: 'Success',
                    result: results
                })
            })
        })
    })
  }


  
  public async getGenricDeviceInfo(deviceName: string): Promise<object> {

    return new Promise((resolve: any, reject: any) => {
        
        db.getConnection((err: any, conn: any) => {

            let query = "Select generic_define_device.*, sensor_info.id AS sensorInfoId,sensor_info.name AS sensorName,sensor_info.device_eui AS deviceeui ,sensor_info.user_id AS sensorUserId from generic_define_device inner join sensor_info ON generic_define_device.sensor_id= sensor_info.id where generic_define_device.name ='" + deviceName+"';"
            console.log("get the genericDevice", query);

            conn.query(query, (error: any, results: any) => {
                conn.release()

                if (error) {
                    reject({
                        http: 406,
                        status: 'Failed',
                        error: error
                    })
                }

                if (results.length == 0) {
                    resolve({
                        http: 204,
                        status: 'Success',
                        result: 'There is no irrigation device output with this ID'
                    })
                }

                resolve({
                    http: 200,
                    status: 'Success',
                    result: results
                })
            })
        })
    })
}

  public async getHistoric(id: number): Promise<object> {
    return new Promise((resolve: any, reject: any) => {
      // TODO: Implement db call
    });
  }
}

export default new HistoricController();