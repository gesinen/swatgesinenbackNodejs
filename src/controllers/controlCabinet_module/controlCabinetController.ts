import { Request, Response } from "express";
import db from "../../database";
import { Utils } from "../../utils/Utils";


/*
 * /water/
 */
class ControlCabinetController {
    public async createColorControlCabinet(userId: number, valle: string, llano: string, punta: string, llano2: string,weather:string): Promise<object> {
       
        let insertSql = "INSERT INTO `public_light_control_color` (`user_id`, `valle`, `llano`, `punta`, `llano2`,`weather`) VALUES ('" + userId + "', '" + valle + "', '" + llano + "', '" + punta +
          "', '" + llano2 + "', '" + weather + "');"
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
                response: "Color Control Cabinet has been created successfully.",
              });
            });
          });
        });
      }

      public async updateColorControlCabinetById(id: number,userId: number, valle: string, llano: string, punta: string, llano2: string,weather:string): Promise<object> {
        
        
        let updateSql = "UPDATE `public_light_control_color` SET valle= '" + valle+"' , llano='" + llano+"' ,punta='" + punta+"',llano2='" + llano2+"',weather='" + weather+"',user_id='" + userId+"' WHERE id=" + id + ";"
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
                response: "Control cabinet color has been updated successfully.",
              });
            });
          });
        });
      }

      public async getControlCabinetColorByUserId(userId: number) {
        return new Promise((resolve, reject) => {
          db.getConnection((err: any, conn: any) => {
            var select_query = "SELECT * FROM `public_light_control_color` WHERE user_id=" + userId + ";"
            console.log(select_query)
            conn.query(select_query, (err: any, results: any) => {
              conn.release();
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
                    result: "There is no color List with given id",
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
    
      
}
export default new ControlCabinetController();