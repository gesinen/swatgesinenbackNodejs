import conn from "../../database";
import db from "../../database";
import { Utils } from "../../utils/Utils";
//import moment from "moment-timezone"


/*
 * /camera/devices
 */
class CameraParkingController {

    public async saveCameraParking(event:string,device:string,time:string,detectionLine:number,direction:string,snapshot:string): Promise<any> {
       
        return new Promise( async (resolve, reject) => {
            let device_info_arr =  device.split(" ");
            var query = "Insert Into camera_parking (`event`,`device`,`time`,`detectionLine`,`direction`,`place_name`,`camera_number`) values('"+event+"','"+device+"','"+time+"',"+detectionLine+",'"+direction+"','"+device_info_arr[0]+"','"+device_info_arr[2]+"')";
            let cameraName =  device_info_arr[0].toLowerCase()+'_'+'camera'+'_'+device_info_arr[2]
           let capacityparkingInfo  = await this.getThePakingandCapacityDeviceInfo(cameraName);   
           
           console.log('capacityInfo',capacityparkingInfo);
           
           if(capacityparkingInfo.data.length > 0){
            let capacityInfo = capacityparkingInfo.data[0];
           let parkingId = capacityInfo.parkingID;

           let calculatedVal = direction === 'B->A'?capacityInfo.currentCapacity - 1:direction == 'A->B'?capacityInfo.currentCapacity + 1:capacityInfo.currentCapacity;
          let messageInt =  detectionLine+" "+event;
           await this.saveCapacityDevicesLog(capacityInfo.currentCapacity,capacityInfo.maxCapacity,parkingId,device,messageInt,direction,1,time);
           let  updatedCapacity = await this.UpdateParkingByCamera(parkingId,calculatedVal)
           }
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

                    resolve(
                        
                        {
                        http: 200,
                        status: 'Success',
                        capacity_devices: results
                    }
                )
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

      public async getThePakingandCapacityDeviceInfo(camera_name: string): Promise<any> {
        return new Promise((resolve, reject) => {
            //camera_name= 'chulia_camera_1';
            var query = "select c.*, p.maxCapacity,p.currentCapacity,p.id as parkingID,ctr.parkingId as crtParkingId,ctr.capacityDeviceId as ctrcapacityDeviceId from capacity_devices as c inner join capacity_type_ribbon as ctr  On ctr.capacityDeviceId = c.id inner join capacity_parking as p ON p.id = ctr.parkingId where c.name='" +camera_name+"';";

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
                        data: results
                    })
                })
            })
        })
    }

    public async UpdateParkingByCamera(parkingId:string,calculatedVal:number): Promise<any> {
       
        return new Promise( async (resolve, reject) => {
            
            var query = "UPDATE capacity_parking SET `currentCapacity`=" +  calculatedVal + " WHERE id=" + parkingId + ";";
            
              

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

                    resolve(
                        
                        {
                        http: 200,
                        status: 'Success',
                        capacity_devices: results
                    }
                )
                })
            })
        })
    }

    public async saveCapacityDevicesLog(currentCapacity:number,maxCapacity:number,parkingId:number,capacityDeviceEUI:string,messageInt:string,messageHex:string,frameCounter:number,timestamp:string): Promise<any> {
       
        return new Promise( async (resolve, reject) => {
            
            var query = "Insert Into capacity_devices_log (`messageHex`,`frameCounter`,`messageInt`,`capacityDeviceEUI`,`parkingId`,`currentCapacity`,`maxCapacity`,`timestamp`) values('"+messageHex+"',"+frameCounter+",'"+messageInt+"','"+capacityDeviceEUI+"',"+parkingId+","+currentCapacity+","+maxCapacity+",'"+timestamp+"')";
           
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

                    resolve(
                        
                        {
                        http: 200,
                        status: 'Success',
                        capacity_devices: results
                    }
                )
                })
            })
        })
    }

   
     
}
export default new CameraParkingController();