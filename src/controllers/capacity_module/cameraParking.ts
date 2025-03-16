import conn from "../../database";
import db from "../../database";
import { Utils } from "../../utils/Utils";
//import moment from "moment-timezone"


/*
 * /camera/devices
 */
class CameraParkingController {

    public async saveAlteaCameraParking(event:string,device:string,time:string,direction:string,snapshot:string,user:string,pass:string,line:number,vehicalIn:number,vehicalOut:number,fullMessaage:string): Promise<any> {
       
        return new Promise( async (resolve, reject) => {
            let device_info_arr =  device.split(" ");
            let detectionLine = null;
            console.log('controller caleed',vehicalIn,vehicalOut,line,fullMessaage)
            var query = "Insert Into camera_parking (`event`,`device`,`time`,`detectionLine`,`direction`,`place_name`,`camera_number`,`vehicleIn`,`vehicleOut`,`line`,`full_message`) values('"+event+"','"+device+"','"+time+"',"+detectionLine+",'"+direction+"','"+device_info_arr[0]+"','"+device_info_arr[2]+"',"+vehicalIn+","+vehicalOut+","+line+",'"+fullMessaage+"')";
            let cameraName =  device_info_arr[0].toLowerCase()+'_'+'camera'+'_'+device_info_arr[2]
            let capacityparkingInfo  = await this.getThePakingandCapacityDeviceInfo(cameraName);   
            let lastCapacityLogRes = await this.getCapacityDevicesLogLastMessageByDevice(device,line);
            let lastCapacityLog = lastCapacityLogRes.capacity_device_log[0];
            //console.log('capacityInfo',capacityparkingInfo);
            console.log('capacityLog',lastCapacityLog);
           // if the user and password matched
          // if(capacityparkingInfo.username == user && capacityparkingInfo.password == pass){

           
           
            let responseResFromPanel ='';
            if(capacityparkingInfo.data.length > 0){
            let capacityInfo = capacityparkingInfo.data[0];
           let parkingId = capacityInfo.parkingID;
           let capacitypercent = (capacityInfo.maxCapacity/100);
           let increase = 0;
           let descrease  = 0; 
           if(vehicalIn > lastCapacityLog.vehicleIn){
            increase = vehicalIn -lastCapacityLog.vehicleIn
           }
            if( vehicalOut > lastCapacityLog.vehicleOut){
                descrease =  lastCapacityLog.vehicleOut - vehicalOut;
            }
             let totalchange = increase - descrease;
            
           let calculatedVal = (capacityInfo.currentCapacity + totalchange) ;//direction === 'B->A'?capacityInfo.currentCapacity - 1:direction == 'A->B'?capacityInfo.currentCapacity + 1:capacityInfo.currentCapacity;
           let emptySpaces = (capacityInfo.maxCapacity - calculatedVal)
           console.log('all changes',vehicalIn,lastCapacityLog.vehicleIn,increase,vehicalOut,lastCapacityLog.vehicleOut,descrease,totalchange,calculatedVal,emptySpaces);
           let messageInt =  'Altea';//detectionLine+" "+event;
           let panelMessageTestType = capacityInfo.displayType;//"OnlyText";
           let textAlingment = 1;//(0 = means horizontly left) (1 = means horizontly center) (2 = means horizontly right )
          let textToPanel = "LIBRES:     25";
          let textColor = 255;

          if(emptySpaces > (capacitypercent*4)){
            if(panelMessageTestType == "onlyText"){
                textAlingment = 1; 
                textToPanel = "LIBRES";
            }
            else{
                textAlingment = 0; 
                textToPanel = "LIBRES:   "+ emptySpaces;
            }
            
            textColor = 65280;
          }
          else if(emptySpaces < (capacitypercent*4) && emptySpaces > (capacitypercent/2)){
            if(panelMessageTestType == "onlyText"){
            textToPanel = "DENSO";
            textAlingment = 1; 
            }
            else{
                textAlingment = 0; 
                textToPanel = "DENSO:   "+ emptySpaces;
            }
            textColor = 33023;
          }
          else{
            if(panelMessageTestType == "onlyText"){
            textToPanel = "OCUPADO";
            textAlingment = 1; 
            }
            else{
                textAlingment = 0; 
                textToPanel = "OCUPADO:  "+emptySpaces;
            }
            textColor = 255;
          }
          
         /*if(capacityInfo.panleType == 'rotuloselectronicos'){
           responseResFromPanel = await this.SendInfoToPanel(capacityInfo.panelUrl, capacityInfo.panelPort, textToPanel,textColor,textAlingment)
         // console.log('response from panel',responseResFromPanel,capacityInfo,calculatedVal) 
          }*/
          //await this.saveCapacityDevicesLog(capacityInfo.currentCapacity,capacityInfo.maxCapacity,parkingId,device,messageInt,direction,1,time);
          await this.saveCapacityDevicesLogAltea(calculatedVal,capacityInfo.maxCapacity,parkingId,device,messageInt,direction,1,time,vehicalIn,vehicalOut,line,fullMessaage);
           let  updatedCapacity = await this.UpdateParkingByCamera(parkingId,calculatedVal)
           }
           db.getConnection((err: any, conn: any) => {
                if (err) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: err,
                        panelResponse:responseResFromPanel,
                    })
                }
                console.log("query",query)
                conn.query(query, (error: any, results: any) => {
                    conn.release()
                   
                    if (error) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: error,
                            panelResponse:responseResFromPanel,
                        })
                    }

                    resolve(
                        
                        {
                        http: 200,
                        status: 'Success',
                        capacity_devices: results,
                        panelResponse:responseResFromPanel,
                        direction:direction,
                    }
                )
                })
            })

        //}
        /*else{
            resolve(
                        
                {
                http: 204,
                status: 'Failed',
                message:"user and password not matched please check!!",
                capacity_devices: [],
                panelResponse:[],
                direction:""
            })
        }*/
        })
        
    }

    public async saveCameraParking(event:string,device:string,time:string,detectionLine:number,direction:string,snapshot:string,user:string,pass:string): Promise<any> {
       
        return new Promise( async (resolve, reject) => {
            let device_info_arr =  device.split(" ");
            var query = "Insert Into camera_parking (`event`,`device`,`time`,`detectionLine`,`direction`,`place_name`,`camera_number`) values('"+event+"','"+device+"','"+time+"',"+detectionLine+",'"+direction+"','"+device_info_arr[0]+"','"+device_info_arr[2]+"')";
            let cameraName =  device_info_arr[0].toLowerCase()+'_'+'camera'+'_'+device_info_arr[2]
           let capacityparkingInfo  = await this.getThePakingandCapacityDeviceInfo(cameraName);   
           
           console.log('capacityInfo',capacityparkingInfo);
           // if the user and password matched
          // if(capacityparkingInfo.username == user && capacityparkingInfo.password == pass){

           
           
           let responseResFromPanel ='';
           if(capacityparkingInfo.data.length > 0){
            let capacityInfo = capacityparkingInfo.data[0];
           let parkingId = capacityInfo.parkingID;
           let capacitypercent = (capacityInfo.maxCapacity/100);
           let calculatedVal = direction === 'B->A'?capacityInfo.currentCapacity - 1:direction == 'A->B'?capacityInfo.currentCapacity + 1:capacityInfo.currentCapacity;
           let emptySpaces = (capacityInfo.maxCapacity - calculatedVal)
           let messageInt =  detectionLine+" "+event;
           let panelMessageTestType = capacityInfo.displayType;//"OnlyText";
           let textAlingment = 1;//(0 = means horizontly left) (1 = means horizontly center) (2 = means horizontly right )
          let textToPanel = "LIBRES:     25";
          let textColor = 255;

          if(emptySpaces > (capacitypercent*4)){
            if(panelMessageTestType == "onlyText"){
                textAlingment = 1; 
                textToPanel = "LIBRES";
            }
            else{
                textAlingment = 0; 
                textToPanel = "LIBRES:   "+ emptySpaces;
            }
            
            textColor = 65280;
          }
          else if(emptySpaces < (capacitypercent*4) && emptySpaces > (capacitypercent)){
            if(panelMessageTestType == "onlyText"){
            textToPanel = "DENSO";
            textAlingment = 1; 
            }
            else{
                textAlingment = 0; 
                textToPanel = "DENSO:   "+ emptySpaces;
            }
            textColor = 33023;
          }
          else{
            if(panelMessageTestType == "onlyText"){
            textToPanel = "OCUPADO";
            textAlingment = 1; 
            }
            else{
                textAlingment = 0; 
                textToPanel = "OCUPADO:  "+emptySpaces;
            }
            textColor = 255;
          }
          
          /*if(capacityInfo.panleType == 'rotuloselectronicos'){
           responseResFromPanel = await this.SendInfoToPanel(capacityInfo.panelUrl, capacityInfo.panelPort, textToPanel,textColor,textAlingment)
         // console.log('response from panel',responseResFromPanel,capacityInfo,calculatedVal) 
          }*/
          //await this.saveCapacityDevicesLog(capacityInfo.currentCapacity,capacityInfo.maxCapacity,parkingId,device,messageInt,direction,1,time);
          await this.saveCapacityDevicesLog(calculatedVal,capacityInfo.maxCapacity,parkingId,device,messageInt,direction,1,time);
           let  updatedCapacity = await this.UpdateParkingByCamera(parkingId,calculatedVal)
           }
           db.getConnection((err: any, conn: any) => {
                if (err) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: err,
                        panelResponse:responseResFromPanel,
                    })
                }
                console.log("query",query)
                conn.query(query, (error: any, results: any) => {
                    conn.release()
                   
                    if (error) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: error,
                            panelResponse:responseResFromPanel,
                        })
                    }

                    resolve(
                        
                        {
                        http: 200,
                        status: 'Success',
                        capacity_devices: results,
                        panelResponse:responseResFromPanel,
                        direction:direction,
                    }
                )
                })
            })

        //}
        /*else{
            resolve(
                        
                {
                http: 204,
                status: 'Failed',
                message:"user and password not matched please check!!",
                capacity_devices: [],
                panelResponse:[],
                direction:""
            })
        }*/
        })
        
    }
// message to rautolaEletronics panel
    public async SendInfoToPanel(url:string, port:number, textToPanle:string,textColor:number,textAlingment:number): Promise<any> {
        return new Promise((resolve, reject) => {
            var request = require("request");
            var options = {
                'method': 'POST',
                'url':'http://95.19.73.47:5000/api/Camera',//'http://5.250.190.230/api/Camera',
                'headers': {
                // "x-token":"test",
                  'Content-Type': 'application/json',
                },
                body:JSON.stringify({
                    "panelIP": url,//"46.26.171.249",
                    "textToPanel": textToPanle,//"LIBRES:      35",
                    "port":"5200",
                    "color": textColor,
                    "textAlingment":textAlingment,
                })
              };
              console.log('options',options)
              request(options, function (error: string, response: { body: any }) {
                if (error) {
                  reject(error);
                }
                console.log("***** response ******")
                //console.log(response.body)
                let observations: any;
                try {
                  observations = response.body;
                  resolve(observations);
                } catch (error) {
                  console.log(error)
                }
                //console.log("***** observations ******")
                //console.log(observations)
              });
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
            //var query = "select c.*, p.maxCapacity,p.currentCapacity,p.id as parkingID,ctr.parkingId as crtParkingId,ctr.capacityDeviceId as ctrcapacityDeviceId from capacity_devices as c inner join capacity_type_ribbon as ctr  On ctr.capacityDeviceId = c.id inner join capacity_parking as p ON p.id = ctr.parkingId where c.name='" +camera_name+"';";
           var query = "select c.*, p.maxCapacity,p.currentCapacity,p.id as parkingID,ctr.parkingId as crtParkingId,ctr.capacityDeviceId as ctrcapacityDeviceId, capacity_cartel.url as panelUrl, capacity_cartel.port as panelPort, capacity_cartel.type as panleType, capacity_cartel.displayType as displayType from capacity_devices as c inner join capacity_type_ribbon as ctr  On ctr.capacityDeviceId = c.id inner join capacity_parking as p ON p.id = ctr.parkingId inner join capacity_cartel_line on capacity_cartel_line.parkingId = ctr.parkingId inner join capacity_cartel on capacity_cartel.id = capacity_cartel_line.cartelId where c.name= '" +camera_name+"';";
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

    public async saveCapacityDevicesLogAltea(currentCapacity:number,maxCapacity:number,parkingId:number,capacityDeviceEUI:string,messageInt:string,messageHex:string,frameCounter:number,timestamp:string,vehicalIn:Number,vehicalOut:Number,line:Number,fullMessaage:string): Promise<any> {
       
        return new Promise( async (resolve, reject) => {
            
            var query = "Insert Into capacity_devices_log (`messageHex`,`frameCounter`,`messageInt`,`capacityDeviceEUI`,`parkingId`,`currentCapacity`,`maxCapacity`,`timestamp`,vehicleIn,vehicleOut,line,full_message) values('"+messageHex+"',"+frameCounter+",'"+messageInt+"','"+capacityDeviceEUI+"',"+parkingId+","+currentCapacity+","+maxCapacity+",'"+timestamp+"',"+vehicalIn+","+vehicalOut+","+line+",'"+fullMessaage+"')";
           
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

    public async getCapacityDevicesLogLastMessageByDevice(capacityDeviceEUI:string,line:Number): Promise<any> {
       
        return new Promise( async (resolve, reject) => {
            
            var query = "select * from capacity_devices_log where capacityDeviceEUI = '"+capacityDeviceEUI+"' and line ="+line+" order by id desc limit 1";
           
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
                        capacity_device_log: results
                    }
                )
                })
            })
        })
    }

   
     
}
export default new CameraParkingController();