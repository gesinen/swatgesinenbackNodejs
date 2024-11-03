import db from "../../database";
import { Utils } from "../../utils/Utils";
import sensorController from "../sensor_module/sensorController";
import waterUsersController from "./waterUsersController";

class WaterImstController {
    /**
   * POST ('/')
   * Create water Imst gateway
   *
   * @async
   * @param name
   * @param sensor_id
   * @param device_eui
   * @param user_id
   * @returns
   */
  public async createWaterImst(
    name: string,
    sensor_id: number,
    device_eui: string = null,
    
    user_id: number,
  ): Promise<object> {

    let gateway : any = await this.checkTheGateway(device_eui,sensor_id);
    
    if(gateway.http == 200 && gateway.result.length > 0){
        return new Promise((resolve: any, reject: any) => {
            resolve({
                http: 200,
                status: "Success",
                response: "The water Imst gateway already added there",
                gateway:gateway
              });
        })
    }
    else{
    if (name) {
      name = "'" + name + "'";
    }
    
    if (device_eui) {
        device_eui = "'" + device_eui + "'";
    } else {
        device_eui = "''";
    }
    

    var query =
      "INSERT INTO water_imst_gateway (name, sensor_id, device_eui,  userId) VALUES (" +
      name +
      "," +
      sensor_id +
      "," +
      device_eui +
      "," +
      user_id +
      ")";
    console.log(query)
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

        conn.query(query, (err: any, results: any) => {
          conn.release();

          // If the query fails
          if (err) {
            reject({
              http: 401,
              status: "Failed",
              error: err,
            });
          }

          // Response
          resolve({
            http: 200,
            status: "Success",
            response: "The water Imst gateway has been created successfully.",
            gateway : gateway
          });
        });
      });
    });
}
  }

  public async deleteWaterImstGateway(device_eui: string, sensor_id:number): Promise<object> {
    return new Promise((resolve, reject) => {
        db.getConnection((err: any, conn: any) => {
            if (err) {
                reject({
                    http: 401,
                    status: 'Failed',
                    error: err
                })
            }

            conn.query("DELETE FROM water_imst_gateway WHERE  device_eui = '"+device_eui+"' and sensor_id = " + sensor_id,
                (err: any, results: any) => {
                    conn.release()

                    if (err) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: err
                        })
                    } else {
                        resolve({
                            http: 200,
                            status: 'Success'
                        })
                    }
                })
        })
    })
}


  public async checkTheGateway(device_eui: string, sensor_id:number): Promise<object> {
    return new Promise((resolve: any, reject: any) => {
        db.getConnection((err: any, conn: any) => {
          let query =
            "SELECT * FROM water_imst_gateway WHERE device_eui = '" + device_eui + "' and sensor_id = "+sensor_id;
          console.log(query);
          conn.query(query, (error: any, results: any) => {
            conn.release();
            console.log("get water imst gateway by device_eui",results.length)
            if (error) {
              reject({
                http: 406,
                status: "Failed",
                error: error,
              });
            }  
  
            resolve({
              http: 200,
              status: "Success",
              result: results,
            });
          });
        });
      });

  }

  public getAllWaterImstGateway(userId: number): Promise<object> {
    return new Promise((resolve, reject) => {
        db.getConnection((err: any, conn: any) => {

            if (err) {
                reject({
                    http: 401,
                    status: 'Failed',
                    error: err
                })
            }
            
            let query = "SELECT  *  FROM water_imst_gateway where userId = " + userId
            console.log(query)
            
            conn.query(query, (err: any, results: any) => {
                conn.release()
                
                    console.log(results)
                    if (err) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: err
                        })
                    } else {
                        resolve({
                            http: 200,
                            status: 'Success',
                            gateways: results
                        })
                    }
                })
        })
    })
}

}

export default new WaterImstController();