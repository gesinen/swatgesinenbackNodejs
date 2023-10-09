import { Request, Response } from "express";
import db from "../../database";
import { Utils } from "../../utils/Utils";


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
    let devicesData =  "'"+JSON.stringify(devices)+"'";
    

    var query =
      "INSERT INTO blockchain_generator_info (name, description, startingdate, periodicity, status, valuetype, devices, user_id) VALUES (" +
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

    
  
}

export default new BlockchainController();
