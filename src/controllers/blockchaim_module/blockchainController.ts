import { Request, Response } from "express";
import db from "../../database";
import {pgdb} from "../../postgresConnection";
import { Utils } from "../../utils/Utils";
import * as fs from 'fs';
import { exec } from 'child_process';


class BlockchainController {
  
  
  /**
   * POST ('/')
   * Create a new water device
   *
   * @async
   * @param name
   * @param description
   * @param startingdate
   * @param periodicity
   * @param status
   * @param valuetype
   * @param devices
   * @param user_id
   *
   * @returns
   */
  public async createAutomaticGenerator(
    name: string=null,
    description: string=null,
    startingdate: string = null,
    
    periodicity: number = null,
    status: string,
    valuetype: string = null,
    
    devices: JSON = null,
    user_id: number = null,
    device_type: string = null,
    objects_name: string = null,
    
  ): Promise<object> {
    if (name) {
      name = "'" + name + "'";
    }
    
    if (description) {
      description = "'" + description + "'";
    } else {
      description = "''";
    }
    if (startingdate) {
      startingdate = "'" + startingdate + "'";
    } else {
      startingdate = "''";
    }
    if (valuetype) {
      valuetype = "'" + valuetype + "'";
    } else {
      valuetype = "''";
    }
    if (status) {
      status = "'" + status + "'";
    } 
    if (device_type) {
        device_type = "'" + device_type + "'";
      } else {
        device_type = null;
      }
      if (objects_name) {
        objects_name = "'" + objects_name + "'";
      } else {
        objects_name = null;
      }
    let devicesData =  "'"+JSON.stringify(devices)+"'";
    

    var query =
      "INSERT INTO blockchain_generator_info (name, description, startingdate, periodicity, status, valuetype, devices, user_id,device_type,objects_name) VALUES (" +
      name +
      "," +
      description +
      "," +
      startingdate +
      "," +
      periodicity +
      "," +
      status +
      "," +      
      valuetype +
      "," +
      devicesData +
      "," +
      user_id +
      "," +
      device_type +
      "," +
      objects_name +
      
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
            response: "The water device has been created successfully.",
          });
        });
      });
    });
  }

  public async getAllAutomaticGeneratorListForPDFGeneration(): Promise<any> {
    return new Promise((resolve, reject) => {
       
        var query = "SELECT * FROM blockchain_generator_info ;"

        db.getConnection((err: any, conn: any) => {
            if (err) {
                reject({
                    http: 401,
                    status: 'Failed',
                    error: err
                })
            }
            console.log("query",query)
            conn.query(query, (error: any, results: any) => {
                conn.release()

                if (error) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: error
                    })
                }

                resolve({
                    http: 200,
                    status: 'Success',
                    automatic_genrator: results
                })
            })
        })
    })
}

  public async getAllAutomaticGenerator(userId: number, pageSize: number, pageIndex: number): Promise<any> {
    return new Promise((resolve, reject) => {
        const first_value = (pageSize * pageIndex) - pageSize;
        var query = "SELECT * FROM blockchain_generator_info WHERE user_id = " + userId +
            " ORDER BY blockchain_generator_info.id DESC LIMIT " + first_value + ', ' + pageSize + ";"

        db.getConnection((err: any, conn: any) => {
            if (err) {
                reject({
                    http: 401,
                    status: 'Failed',
                    error: err
                })
            }
            console.log("query",query)
            conn.query(query, (error: any, results: any) => {
                conn.release()

                if (error) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: error
                    })
                }

                resolve({
                    http: 200,
                    status: 'Success',
                    automatic_genrator: results
                })
            })
        })
    })
}

public async getAutomaticGeneratorById(userId:number,id: number): Promise<any> {
  return new Promise((resolve, reject) => {
      var query = "SELECT * FROM blockchain_generator_info WHERE id = "+ id +" and user_id ="+userId;

      db.getConnection((err: any, conn: any) => {
          if (err) {
              reject({
                  http: 401,
                  status: 'Failed',
                  error: err
              })
          }

          conn.query(query, (error: any, results: any) => {
              conn.release()

              if (error) {
                  reject({
                      http: 401,
                      status: 'Failed',
                      error: error
                  })
              }

              resolve({
                  http: 200,
                  status: 'Success',
                  capacity_devices: results
              })
          })
      })
  })
}

public async getHashDetail(userId:number,hash: string): Promise<any> {
    return new Promise((resolve, reject) => {
        var query = "SELECT * FROM blockchain_history WHERE hash = '"+ hash +"' and user_id ="+userId;
  
        db.getConnection((err: any, conn: any) => {
            if (err) {
                reject({
                    http: 401,
                    status: 'Failed',
                    error: err
                })
            }
  
            conn.query(query, (error: any, results: any) => {
                conn.release()
  
                if (error) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: error
                    })
                }
  
                resolve({
                    http: 200,
                    status: 'Success',
                    capacity_devices: results
                })
            })
        })
    })
  }
public async deleteAtomaticGenerator(userId:number,id: number): Promise<object> {
  return new Promise((resolve, reject) => {
      db.getConnection((err: any, conn: any) => {
          if (err) {
              reject({
                  http: 401,
                  status: 'Failed',
                  error: err
              })
          }

          conn.query("DELETE FROM blockchain_generator_info WHERE id = " + id +" and user_id = "+ userId,
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

public async updateAutomaticGenerator(id: number, currentCapacity: number, maxCapacity: number): Promise<object> {

  return new Promise((resolve, reject) => {


      var query = "UPDATE capacity_parking SET"

      // Checking if each param is not empty and adding it to the query
      if (currentCapacity) {
          query += " currentCapacity = '" + currentCapacity + "',"
      }
      if (maxCapacity) {
          query += " maxCapacity = '" + maxCapacity + "',"
      }

      // Removing the last comma
      query = query.slice(0, -1);

      // Adding the WHERE condition 
      query += " WHERE id = " + id;

      // Running the query
      db.getConnection((err: any, conn: any) => {
          if (err) {
              reject({
                  http: 401,
                  status: 'Failed',
                  error: err
              })
          }

          conn.query(query, (error: any, results: any) => {
              conn.release()

              if (error) {
                  reject({
                      http: 401,
                      status: 'Failed',
                      error: err
                  })
              }

              if (results.length == 0) {
                  resolve({
                      http: 204,
                      status: 'Success',
                      result: "There are no parkings with this ID",
                  })
              } else {
                  resolve({
                      http: 200,
                      status: 'Success',
                      result: "The parking capacity has been updated successfully"
                  })
              }
          })
      })
  })
}

public async getTheRealBalaceFromDirectAPI(): Promise<any> {
    return new Promise((resolve, reject) => {
        var request = require("request");
        var options = {
            method: "GET",
            url:
              "http://localhost:8000/account_balance",
            headers: {
             "x-token":"test",
              "Content-Type": "application/json",
            },
          };
          request(options, function (error: string, response: { body: any }) {
            if (error) {
              reject(error);
            }
            console.log("***** response ******")
            console.log(response.body)
            let observations: any;
            try {
              observations = response.body;
              resolve(observations);
            } catch (error) {
              //console.log(error)
            }
            //console.log("***** observations ******")
            //console.log(observations)
          });
        })
  }

public async getAllPDFHistory(userId: number, pageSize: number, pageIndex: number): Promise<any> {
  return new Promise((resolve, reject) => {
      const first_value = (pageSize * pageIndex) - pageSize;
      var query = "SELECT * FROM blockchain_history WHERE user_id = " + userId +
          " ORDER BY blockchain_history.id DESC LIMIT " + first_value + ', ' + pageSize + ";"

      db.getConnection((err: any, conn: any) => {
          if (err) {
              reject({
                  http: 401,
                  status: 'Failed',
                  error: err
              })
          }
          console.log("query",query)
          conn.query(query, (error: any, results: any) => {
              conn.release()

              if (error) {
                  reject({
                      http: 401,
                      status: 'Failed',
                      error: error
                  })
              }

              resolve({
                  http: 200,
                  status: 'Success',
                  pdf_history: results
              })
          })
      })
  })
}

public async deletePDFHistory(userId:number,id: number): Promise<object> {
  return new Promise((resolve, reject) => {
      db.getConnection((err: any, conn: any) => {
          if (err) {
              reject({
                  http: 401,
                  status: 'Failed',
                  error: err
              })
          }

          conn.query("DELETE FROM blockchain_history WHERE id = " + id +" and user_id = "+ userId,
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

public async getAllDeviceFromEvent(application_name:any) {  
      //   return  await pgdb.query("SELECT DISTINCT dev_eui, device_name as name FROM event_up where application_name =  '"+application_name+"'");
      let query = "SELECT DISTINCT e.device_name as name, FROM event_up e WHERE e.application_name = '"+application_name+"' AND (e.device_name, e.dev_eui) IN (  SELECT device_name, dev_eui   FROM event_up   WHERE application_name = '"+application_name+"'   AND (dev_eui, time) IN ( SELECT dev_eui, MAX(time) FROM event_up WHERE application_name = '"+application_name+"' GROUP BY dev_eui))";
     // return  await pgdb.query(query);
}
public async getAllDeviceTypeFromEvent() {  
    //return  await pgdb.query('SELECT DISTINCT application_name  FROM event_up');
}

public async getAllDeviceObjectByTypeFromEvent(application_name:any) {  
    //return  await pgdb.query("SELECT DISTINCT object,time  FROM event_up where application_name = '"+application_name+"' order by time DESC limit 1");
}

public async getDeviceObjectByDeviceNameLastValueFromEvent(device_name:any) {  
    //return  await pgdb.query("SELECT  object,time,device_name,dev_eui,application_name  FROM event_up where device_name = '"+device_name+"' order by time DESC limit 1");
}

public async getDeviceObjectByDeviceNamePeriodicValueFromEvent(device_name:any,start_time :any,end_time:any) {  
    // return  await pgdb.query("SELECT  object,time,device_name,dev_eui,application_name  FROM event_up where device_name = '"+device_name+"' AND time >= timestamp '"+start_time+"' and time <  timestamp '"+end_time+"'");
}

public async findtheAssetswitheFilenameAndHash(filename:string,hash:string) {
    var request = require("request");
    return new Promise((resolve, reject) => {
    var options = {
        method: "GET",
        url:
          "http://localhost:8000/find_asset?fileName=" +
          filename +
          "&hash=" +
          hash,
        headers: {
          "x-token": 'test',
          "Content-Type": "application/json",
        },
      };  
      request(options, function (error: string, response: { body: any }) {
        if (error) {
          reject(error);
        }
        console.log("***** response ******")
        console.log(response.body)
        let observations: any;
        try {
          observations = JSON.parse(response.body);
          resolve(observations);
        } catch (error) {
          //console.log(error)
        }
    });
});
}

// this method read from production.json
public async readInfoFromProdFile(fileName:any){  
  return fs.readFileSync('/var/www/html/swat-gesinen/blockchain-code/algorand-ASAManager/production.json','utf8');
}

// this method write the changes in production.json
public async WriteInfoToProdFile(fileName:any,token:any,mnemonic:any,networkvalue:any){
  return new Promise((resolve, reject) => {
  
  try {
    //fs.writeFileSync('foo.json', contents);
     let dataJson = fs.readFileSync('/var/www/html/swat-gesinen/blockchain-code/algorand-ASAManager/production.json', 'utf8');
     var parsedData = JSON.parse(dataJson);
     //console.log(parsedData["x-token"]);
     parsedData["x-token"] = token;
     parsedData["mnemonic"] = mnemonic;
     parsedData["network"]["value"] = networkvalue;
     //console.log('final',JSON.stringify(parsedData));
     fs.writeFileSync("/var/www/html/swat-gesinen/blockchain-code/algorand-ASAManager/production.json", JSON.stringify(parsedData), "utf-8");
     resolve('Written Successfully');
     
    
  } catch (err) {
    console.error(err);
    reject(err);
  }
})
 
}

// this is read from config.json
public async readInfoFromFile(fileName:any){  
  return fs.readFileSync('/var/www/html/swat-gesinen/blockchain-code/algorand-ASAManager/config.json','utf8');
}

// this is read from config.json and update the values of config.json
public async WriteInfoToFile(fileName:any,token:any,mnemonic:any,networkvalue:any){
  return new Promise((resolve, reject) => {
  
  try {
    //fs.writeFileSync('foo.json', contents);
     let dataJson = fs.readFileSync('/var/www/html/swat-gesinen/blockchain-code/algorand-ASAManager/config.json', 'utf8');
     var parsedData = JSON.parse(dataJson);
     //console.log(parsedData["x-token"]);
     parsedData["x-token"] = token;
     parsedData["mnemonic"] = mnemonic;
     parsedData["network"]["value"] = networkvalue;
     //console.log('final',JSON.stringify(parsedData));
     fs.writeFileSync("/var/www/html/swat-gesinen/blockchain-code/algorand-ASAManager/config.json", JSON.stringify(parsedData), "utf-8");
     resolve('Written Successfully');
     
    
  } catch (err) {
    console.error(err);
    reject(err);
  }
})
 
}

// this is method to stop the docker remove image remove container build again the code and run the container again hash-nft
public async dockerRestartProcess(){
  return new Promise(async (resolve, reject) => {
  
  try {
    // stop  the docker blockchain process
     await this.shellCommands('sudo docker stop hash-nft','/var/www/html/swat-gesinen/blockchain-code/algorand-ASAManager');

     // remove the image from docker
     await this.shellCommands('sudo docker rmi hash-nft -f','/var/www/html/swat-gesinen/blockchain-code/algorand-ASAManager');

     // remover container
      await this.shellCommands('sudo docker rm hash-nft','/var/www/html/swat-gesinen/blockchain-code/algorand-ASAManager');

     // build the blockchain code
     await this.shellCommands('sudo docker build -t hash-nft .','/var/www/html/swat-gesinen/blockchain-code/algorand-ASAManager');

     // run the blockchain code
    // = await this.shellCommands('sudo docker run -d --name hash-nft -p 8000:8000 hash-nft');

    exec("sudo docker run -d --name hash-nft -p 8000:8000 hash-nft", {cwd: '/var/www/html/swat-gesinen/blockchain-code/algorand-ASAManager'}, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve({ stdout, stderr });
      }
    });
    
     
    
  } catch (err) {
    console.error(err);
    reject(err);
  }
})
 
}

// this is method to run the shell commands
public async shellCommands(cmd:any,cwd:any) {
  return new Promise(function (resolve, reject) {
    exec(cmd, {cwd:cwd}, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}
  
}

export default new BlockchainController();
