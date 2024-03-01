import conn from "../../database";
import db from "../../database";
import { Utils } from "../../utils/Utils";

/*
 * /camera/devices
 */
class CameraParkingController {

    public async saveCameraParking(event:string,device:string,time:string,detectionLine:number,direction:string,snapshot:string): Promise<any> {
        return new Promise((resolve, reject) => {
            
            var query = "Insert Into camera_parking (`event`,`device`,`time`,`detectionLine`,`direction`,`snapshot`) values('"+event+"','"+device+"','"+time+"',"+detectionLine+",'"+direction+"','"+snapshot+"')";
                

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
                        capacity_devices: results
                    })
                })
            })
        })
    }

    public async getCameraParkingList(pageSize: number, pageIndex: number): Promise<any> {
        return new Promise((resolve, reject) => {
            const first_value = (pageSize * pageIndex) - pageSize;
            var query = "SELECT * FROM camera_parking ORDER BY camera_parking.id DESC LIMIT " + first_value + ', ' + pageSize + ";"

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
                        capacity_devices: results
                    })
                })
            })
        })
    }
    public async PostCameraParking(data:JSON): Promise<any> {
        return new Promise((resolve, reject) => {
            var request = require("request");
            var options = {
                method: "GET",
                url:"",
                headers: {
                // "x-token":"test",
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
   
     
}
export default new CameraParkingController();