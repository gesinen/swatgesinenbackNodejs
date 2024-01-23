import { Request, Response } from "express";
import db from "../../database";
import { Utils } from "../../utils/Utils";
import sensorController from "../sensor_module/sensorController";

/*
 * /water/
 */
class BoilerController {


  // Get boiler => sensorId, sensor deviceEUI, related gateway mac
  public async getBoilerServiceInfo() {
    var boilers: any = await this.getAllBoilers()
    console.log("boilers", boilers)
    var boilersInfo = []
    for await (let boiler of boilers.response) {
      var sensorRequiredInfo: any = await sensorController.getSensorDevEuiGatewayMac(boiler.sensorId)
      console.log("sensorRequiredInfo", sensorRequiredInfo)
      var sensorId = sensorRequiredInfo.result.sensorId
      var sensorDevEui = sensorRequiredInfo.result.devEui


      var gateways = sensorRequiredInfo.result.gatewaysMac
      for (let gateway of gateways) {
        boilersInfo.push({
          topic: gateway.mac + '/application/1/device/' + sensorDevEui + "/rx",
          sensorId: sensorId,
          sensorDevEui: sensorDevEui
        },{
          topic: gateway.mac + '/application/2/device/' + sensorDevEui + "/rx",
          sensorId: sensorId,
          sensorDevEui: sensorDevEui
        })
      }
    }
 
    return {
      http: 200,
      status: "Success",
      response: boilersInfo
    }
  }

  // This Is new Modified Method(shesh)

   // Get boiler => sensorId, sensor deviceEUI, related gateway mac
   public async getBoilerServiceInfoModified() {
    var boilers: any = await this.getAllBoilers()
    console.log("boilers", boilers)
    var boilersInfo = []
    for await (let boiler of boilers.response) {
      var sensorRequiredInfo: any = await sensorController.getSensorById(boiler.sensorId)
      console.log("sensorRequiredInfo", sensorRequiredInfo)
      var sensorId = sensorRequiredInfo.result.id
      var sensorDevEui = sensorRequiredInfo.result.device_EUI
      var gateway = sensorRequiredInfo.result.network_server_mac
      var gatewayInfo :any  = await sensorController.getNetworkServerMacAndApplication(gateway);
      let application = gatewayInfo.result.application; 
      //for (let gateway of gateways) {
        boilersInfo.push({
          topic: gateway + '/application/'+application+'/device/' + sensorDevEui + "/rx",
         // topic: gateway + '/application/1/device/' + sensorDevEui + "/rx",
          sensorId: sensorId,
          sensorDevEui: sensorDevEui
        })
      //}
    }
 
    return {
      http: 200,
      status: "Success",
      response: boilersInfo
    }
  }

  public async getAllBoilers(): Promise<any> {
    let selectSql = "SELECT * FROM `boiler_device`;"

    return new Promise<any>((resolve: any, reject: any) => {
      db.getConnection((error: any, conn: any) => {
        // If the connection with the database fails
        if (error) {
          reject({
            http: 401,
            status: "Failed",
            error: error,
          });
        }

        conn.query(selectSql, (err: any, results: any) => {
          conn.release();

          // If the query fails
          if (err) {
            reject({
              http: 401,
              status: "Failed",
              error: err,
            });
          }
          //console.log(results)
          // Response
          resolve({
            http: 200,
            status: "Success",
            response: results,
          });
        });
      });
    });
  }
  public async createBoilerDevice(userId: number, name: string, description: string, sensorId: string, mode: string,
    schedule: string = undefined, scheduleWeekend: string = undefined, model: string, height: number, length: number, width: number, shape: string, unit: string): Promise<object> {
    schedule = Utils.checkUndefined(schedule)
    let insertSql = "INSERT INTO `boiler_device` (`userId`, `name`, `description`, `mode`, `schedule`,`scheduleWeekend`, `sensorId`, `releStatus`," +
      " `lastLongitude`, `lastTemperature`, `lastUpdateTime`,`boilerModel`,`height`,`length`,`width`,`shape`,`unit`,`filling`) VALUES ('" + userId + "', '" + name + "', '" + description + "', '" + mode +
      "', '" + schedule + "', '" + scheduleWeekend + "', '" + sensorId + "', '0', '0', '0', current_timestamp(),'" + model + "','" + height + "','" + length + "','" + width + "','" + shape + "','" + unit + "', '0');"
    console.log(insertSql)

    return new Promise((resolve: any, reject: any) => {
      db.getConnection((error: any, conn: any) => {
        // If the connection with the database fails
        if (error) {
          reject({
            http: 401,
            status: "Failed",
            error: error,
          });
        }

        conn.query(insertSql, (err: any, results: any) => {
          conn.release();

          // If the query fails
          if (err) {
            reject({
              http: 401,
              status: "Failed",
              error: err,
            });
          }
          console.log(results)
          // Response
          resolve({
            http: 200,
            status: "Success",
            response: "The boiler device has been created successfully.",
          });
        });
      });
    });
  }

  public async changeBoilerStatus(id: number, status: boolean): Promise<object> {
    let insertSql = "UPDATE `boiler_device` SET releStatus=" + status + " WHERE sensorId=" + id + ";"
    console.log(insertSql)

    return new Promise((resolve: any, reject: any) => {
      db.getConnection((error: any, conn: any) => {
        // If the connection with the database fails
        if (error) {
          reject({
            http: 401,
            status: "Failed",
            error: error,
          });
        }

        conn.query(insertSql, (err: any, results: any) => {
          conn.release();

          // If the query fails
          if (err) {
            reject({
              http: 401,
              status: "Failed",
              error: err,
            });
          }
          console.log(results)
          // Response
          resolve({
            http: 200,
            status: "Success",
            response: "The boiler device has been updated successfully.",
          });
        });
      });
    });
  }


  public async updateBoilerSchedule(id: number, config: any): Promise<object> {
    let insertSql = "UPDATE `boiler_device` SET schedule=" + config + " WHERE id=" + id + ";"
    console.log(insertSql)

    return new Promise((resolve: any, reject: any) => {
      db.getConnection((error: any, conn: any) => {
        // If the connection with the database fails
        if (error) {
          reject({
            http: 401,
            status: "Failed",
            error: error,
          });
        }

        conn.query(insertSql, (err: any, results: any) => {
          conn.release();

          // If the query fails
          if (err) {
            reject({
              http: 401,
              status: "Failed",
              error: err,
            });
          }
          console.log(results)
          // Response
          resolve({
            http: 200,
            status: "Success",
            response: "The boiler device has been updated successfully.",
          });
        });
      });
    });
  }

  public async updateBoilerDevice(id: number, userId: number, name: string, description: string, sensorId: string, mode: string,
    schedule: string = undefined, scheduleWeekend: string = undefined, model: string, height: number, length: number, width: number, shape: string, unit: string): Promise<object> {
    schedule = Utils.checkUndefined(schedule)
    let insertSql = "UPDATE `boiler_device` SET userId='" + userId + "', name='" + name + "', description='" + description +
      "', sensorId='" + sensorId + "' , mode='" + mode + "', schedule='" + schedule + "', scheduleWeekend='" + scheduleWeekend + "', boilerModel='" + model + "', height='" +
      height + "', length='" + length + "', width='" + width + "', shape='" + shape + "', unit='" + unit + " ', lastUpdateTime=DATE_ADD(NOW(), INTERVAL 2 HOUR) WHERE id=" + id + ";"

    /*let insertSql = 'UPDATE `boiler_device` SET userId = @userId, name = @name, description = @description, ' +
        'sensorId = @sensorId, mode = @mode, schedule = @schedule, scheduleWeekend = @scheduleWeekend, ' +
        'boilerModel = @model, height = @height, length = @length, width = @width, ' +
        'shape = @shape, lastUpdateTime=DATE_ADD(NOW(), INTERVAL 2 HOUR) WHERE id= @id;'*/

    console.log(insertSql)

    return new Promise((resolve: any, reject: any) => {
      db.getConnection((error: any, conn: any) => {
        // If the connection with the database fails
        if (error) {
          reject({
            http: 401,
            status: "Failed",
            error: error,
          });
        }

        conn.query(insertSql, (err: any, results: any) => {
          conn.release();

          // If the query fails
          if (err) {
            reject({
              http: 401,
              status: "Failed",
              error: err,
            });
          }
          console.log(results)
          // Response
          resolve({
            http: 200,
            status: "Success",
            response: "The boiler device has been updated successfully.",
          });
        });
      });
    });
  }

  // Falta scheduleWeekend
  public async updateBoilerDevicePingData(id: number, lastLongitude: string, lastTemperature: string, releStatus: boolean,
    hourOn: any, minuteOn: any, hourOff: any, minuteOff: any, scheduleMode: boolean): Promise<object> {
    let mode = "manual"
    if (scheduleMode) {
      mode = "schedule"
    }
    let schedule = hourOn + ":" + minuteOn + "-" + hourOff + ":" + minuteOff
    let updateSql = "UPDATE `boiler_device` SET lastLongitude='" + lastLongitude + "', lastTemperature='" + lastTemperature + "', releStatus=" +
      releStatus
    if (mode == "schedule") {
      updateSql += ", schedule='" + schedule + "'"
    }
    updateSql += ", mode='" + mode + "', lastUpdateTime=DATE_ADD(NOW(), INTERVAL 2 HOUR) WHERE id=" + id + ";"
    console.log("updateSql", updateSql)

    return new Promise((resolve: any, reject: any) => {
      db.getConnection((error: any, conn: any) => {
        // If the connection with the database fails
        if (error) {
          reject({
            http: 401,
            status: "Failed",
            error: error,
          });
        }

        conn.query(updateSql, (err: any, results: any) => {
          conn.release();

          // If the query fails
          if (err) {
            reject({
              http: 401,
              status: "Failed",
              error: err,
            });
          }
          console.log(results)
          // Response
          resolve({
            http: 200,
            status: "Success",
            response: "The boiler device has been updated successfully.",
          });
        });
      });
    });
  }

  

  // Falta scheduleWeekend
  public async updateBoilerDevicePingDataBySensorId(sensorId: number, lastLongitude: string, lastTemperature: string, releStatus: boolean,
    hourOn: any, minuteOn: any, hourOff: any, minuteOff: any, scheduleMode: boolean): Promise<object> {
    let mode = "manual"
    if (scheduleMode) {
      mode = "schedule"
    }
    let schedule = hourOn + ":" + minuteOn + "-" + hourOff + ":" + minuteOff
    let updateSql = "UPDATE `boiler_device` SET lastLongitude='" + lastLongitude + "', lastTemperature='" + lastTemperature + "', releStatus=" +
      releStatus
    if (mode == "schedule") {
      updateSql += ", schedule='" + schedule + "'"
    }
    updateSql += ", mode='" + mode + "', lastUpdateTime=DATE_ADD(NOW(), INTERVAL 2 HOUR) WHERE sensorId=" + sensorId + ";"
    console.log("updateSql", updateSql)

    return new Promise((resolve: any, reject: any) => {
      db.getConnection((error: any, conn: any) => {
        // If the connection with the database fails
        if (error) {
          reject({
            http: 401,
            status: "Failed",
            error: error,
          });
        }

        conn.query(updateSql, (err: any, results: any) => {
          conn.release();

          // If the query fails
          if (err) {
            reject({
              http: 401,
              status: "Failed",
              error: err,
            });
          }
          console.log(results)
          // Response
          resolve({
            http: 200,
            status: "Success",
            response: "The boiler device has been updated successfully.",
          });
        });
      });
    });
  }

  public async updateBoilerDevicePingDataTempDistV1(id: number, lastLongitude: string, lastTemperature: string): Promise<object> {

    let updateSql = "UPDATE `boiler_device` SET lastLongitude='" + lastLongitude + "', lastTemperature='" + lastTemperature
      + "', lastUpdateTime=DATE_ADD(NOW(), INTERVAL 2 HOUR) WHERE sensorId=" + id + ";"
    console.log("updateSql", updateSql)

    return new Promise((resolve: any, reject: any) => {
      db.getConnection((error: any, conn: any) => {
        // If the connection with the database fails
        if (error) {
          reject({
            http: 401,
            status: "Failed",
            error: error,
          });
        }

        conn.query(updateSql, (err: any, results: any) => {
          conn.release();

          // If the query fails
          if (err) {
            reject({
              http: 401,
              status: "Failed",
              error: err,
            });
          }
          console.log(results)
          // Response
          resolve({
            http: 200,
            status: "Success",
            response: "The boiler device has been updated successfully.",
          });
        });
      });
    });
  }

  //update Boiler Device temp and distance by sensor_id (shesh)
  public async updateBoilerDevicePingDataTempDistBySensorId(sesnorId: number, lastLongitude: string, lastTemperature: string): Promise<object> {

    let updateSql = "UPDATE `boiler_device` SET lastLongitude='" + lastLongitude + "', lastTemperature='" + lastTemperature
      + "', lastUpdateTime=DATE_ADD(NOW(), INTERVAL 2 HOUR) WHERE sensorId=" + sesnorId + ";"
    console.log("updateSql", updateSql)

    return new Promise((resolve: any, reject: any) => {
      db.getConnection((error: any, conn: any) => {
        // If the connection with the database fails
        if (error) {
          reject({
            http: 401,
            status: "Failed",
            error: error,
          });
        }

        conn.query(updateSql, (err: any, results: any) => {
          conn.release();

          // If the query fails
          if (err) {
            reject({
              http: 401,
              status: "Failed",
              error: err,
            });
          }
          console.log(results)
          // Response
          resolve({
            http: 200,
            status: "Success",
            response: "The boiler device has been updated successfully.",
          });
        });
      });
    });
  }

  public async updateBoilerDevicePingDataTempDistV1BySensorId(sensorId: number, lastLongitude: string, lastTemperature: string): Promise<object> {

    let updateSql = "UPDATE `boiler_device` SET lastLongitude='" + lastLongitude + "', lastTemperature='" + lastTemperature
      + "', lastUpdateTime=DATE_ADD(NOW(), INTERVAL 2 HOUR) WHERE sensorId=" + sensorId + ";"
    console.log("updateSql", updateSql)

    return new Promise((resolve: any, reject: any) => {
      db.getConnection((error: any, conn: any) => {
        // If the connection with the database fails
        if (error) {
          reject({
            http: 401,
            status: "Failed",
            error: error,
          });
        }

        conn.query(updateSql, (err: any, results: any) => {
          conn.release();

          // If the query fails
          if (err) {
            reject({
              http: 401,
              status: "Failed",
              error: err,
            });
          }
          console.log(results)
          // Response
          resolve({
            http: 200,
            status: "Success",
            response: "The boiler device has been updated successfully.",
          });
        });
      });
    });
  }

  // Falta scheduleWeekend
  public async updateBoilerDevicePingDataScheduleV1(id: number, releStatus: boolean,
    hourOn: any, minuteOn: any, hourOff: any, minuteOff: any, scheduleMode: boolean): Promise<object> {
    let mode = "manual"
    if (scheduleMode) {
      mode = "schedule"
    }
    let schedule = hourOn + ":" + minuteOn + "-" + hourOff + ":" + minuteOff
    let updateSql = "UPDATE `boiler_device` SET releStatus=" + releStatus
    if (mode == "schedule") {
      updateSql += ", schedule='" + schedule

    }
    updateSql += ", mode='" + mode + "', lastUpdateTime= DATE_ADD(NOW(), INTERVAL 2 HOUR) WHERE id=" + id + ";"
    console.log("updateSql", updateSql)

    return new Promise((resolve: any, reject: any) => {
      db.getConnection((error: any, conn: any) => {
        // If the connection with the database fails
        if (error) {
          reject({
            http: 401,
            status: "Failed",
            error: error,
          });
        }

        conn.query(updateSql, (err: any, results: any) => {
          conn.release();

          // If the query fails
          if (err) {
            reject({
              http: 401,
              status: "Failed",
              error: err,
            });
          }
          console.log(results)
          // Response
          resolve({
            http: 200,
            status: "Success",
            response: "The boiler device has been updated successfully.",
          });
        });
      });
    });
  }

  public async updateBoilerDevicePingDataScheduleV1BySensorId(id: number, releStatus: boolean,
    hourOn: any, minuteOn: any, hourOff: any, minuteOff: any, scheduleMode: boolean): Promise<object> {
    let mode = "manual"
    if (scheduleMode) {
      mode = "schedule"
    }
    let schedule = hourOn + ":" + minuteOn + "-" + hourOff + ":" + minuteOff
    let updateSql = "UPDATE `boiler_device` SET releStatus=" + releStatus
    if (mode == "schedule") {
      updateSql += ", schedule='" + schedule

    }
    updateSql += ", mode='" + mode + "', lastUpdateTime=DATE_ADD(NOW(), INTERVAL 2 HOUR) WHERE id=" + id + ";"
    console.log("updateSql", updateSql)

    return new Promise((resolve: any, reject: any) => {
      db.getConnection((error: any, conn: any) => {
        // If the connection with the database fails
        if (error) {
          reject({
            http: 401,
            status: "Failed",
            error: error,
          });
        }

        conn.query(updateSql, (err: any, results: any) => {
          conn.release();

          // If the query fails
          if (err) {
            reject({
              http: 401,
              status: "Failed",
              error: err,
            });
          }
          console.log(results)
          // Response
          resolve({
            http: 200,
            status: "Success",
            response: "The boiler device has been updated successfully.",
          });
        });
      });
    });
  }

  public async deleteBoilerDevice(id: number): Promise<object> {
    let deleteSql = "DELETE FROM boiler_device WHERE id=" + id + ";"
    console.log(deleteSql)

    return new Promise((resolve: any, reject: any) => {
      db.getConnection((error: any, conn: any) => {
        // If the connection with the database fails
        if (error) {
          reject({
            http: 401,
            status: "Failed",
            error: error,
          });
        }

        conn.query(deleteSql, (err: any, results: any) => {
          conn.release();

          // If the query fails
          if (err) {
            reject({
              http: 401,
              status: "Failed",
              error: err,
            });
          }
          console.log(results)
          // Response
          resolve({
            http: 200,
            status: "Success",
            response: "The boiler device has been deleted successfully.",
          });
        });
      })
    })
  }


  public async getBoilerById(id: number) {
    return new Promise((resolve, reject) => {
      db.getConnection((err: any, conn: any) => {
        var select_query = "SELECT * FROM `boiler_device` WHERE id=" + id + ";"
        console.log(select_query)
        conn.query(select_query, (err: any, results: any) => {
          if (err) {
            reject({
              http: 401,
              status: "Failed",
              error: err,
            });
          } else {
            if (results && results.length == 0) {
              resolve({
                http: 204,
                status: "Success",
                result: "There is no boiler with given id",
              });
            } else {
              resolve({
                http: 200,
                status: "Success",
                result: results[0],
              });
            }
          }
        });
      });
    });
  }

  public async getBoilersPaginated(userId: number, pageSize: number, pageIndex: number) {
    return new Promise((resolve, reject) => {
      db.getConnection((err: any, conn: any) => {
        const first_value = (pageSize * pageIndex) - pageSize;

        var select_query = "SELECT * FROM `boiler_device` WHERE userId=" + userId + " ORDER BY `id` DESC LIMIT " + first_value + ', ' + pageSize + ";"
        console.log(select_query)
        conn.query(select_query, (err: any, results: any) => {
          conn.release()
          if (err) {
            reject({
              http: 401,
              status: "Failed",
              error: err,
            });
          } else {
            if (results && results.length == 0) {
              resolve({
                http: 204,
                status: "Success",
                result: "There are no related boilers to this user",
              });
            } else {
              resolve({
                http: 200,
                status: "Success",
                result: results,
              });
            }
          }
        });
      });
    });
  }
}

export default new BoilerController();
