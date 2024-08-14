import { query } from "express";
import db from "../../database";

export default class PublicLightingController {
    public async getHistoryInSelectedPeriod(deviceId: string,meterNumber: number, fromDateTime: string, toDateTime: string) {
        var query_servers =
          "SELECT *  FROM energy_meter_value WHERE device_id = '" + deviceId +"' and counter_number = " + meterNumber + " and created_dt >= '" + fromDateTime + "' and created_dt <= '" + toDateTime+"'";
        return new Promise((resolve, reject) => {
          db.getConnection((error: any, conn: any) => {
            
            if (error) {
              reject({
                http: 401,
                status: "Failed",
                error: error,
              });
            }
    
            conn.query(query_servers, (err: any, results: any) => {
              conn.release();
              if (err) {
                reject({
                  http: 401,
                  status: "Failed",
                  error: err,
                });
              }
             /* resolve({
                http: 200,
                status: "Success",
                result: results,
              });*/
             // console.log('results',results)
             
                let label :any []=[];
                let voltR :any [] = [];
                let voltS :any [] = [];
                let voltT :any [] = [];
                let currentR :any [] = [];
                let currentS:any [] = [];
                let currentT :any [] = [];
                let activePAR :any [] = [];
                let activePAS:any [] = [];
                let activePAT:any [] = [];
                let powerPFR:any [] = [];
                let powerPFS:any [] = [];
                let powerPFT:any [] = [];
                let Qat:any [] = [];
                let QrOneT:any [] = [];

                let firstQuater :any[] = [];
                let secondQuater:any[] =[];
                let thirdQuater :any[] =[];
                let fourthQuater :any[] = [];
                let finalVal :any[] =[];
        
        results.forEach((element:any) => {
            let minutes = Number(element.created_dt.getMinutes());
            //console.log('minutes',minutes,element.created_dt.getMinutes());
            if(minutes > 0 && minutes <= 15){
                fourthQuater.length>0?finalVal.push(fourthQuater):null;
                firstQuater.push(element);
                fourthQuater =[]
              }
              else if( minutes >= 16 && minutes <= 30){
                firstQuater.length>0?finalVal.push(firstQuater):null;
                secondQuater.push(element);
                firstQuater =[]
                }
                else if( minutes >= 31 && minutes <= 45){
                  secondQuater.length>0?finalVal.push(secondQuater):null;
                  thirdQuater.push(element);
                  secondQuater =[]
                }
                else if( minutes > 45 && minutes <= 59){
                  thirdQuater.length>0?finalVal.push(thirdQuater):null;
                  fourthQuater.push(element);
                  thirdQuater =[]
                }
          
        });
        //console.log('final Val',finalVal);
        
        let lastArray =[];
        finalVal.forEach(element=>{
            //console.log('check date',element,element[element.length-1].created_dt);
            let minute = Number((element[element.length-1].created_dt).getMinutes());
            let hour = Number((element[element.length-1].created_dt).getHours())
      minute = minute > 0 && minute < 16 ? 15:minute > 15 && minute < 31 ?30:  minute > 30 && minute < 46 ? 45:minute > 45 && minute <= 59 ?59:null;
      let dateString = (element[element.length-1].created_dt)//.substring(0,10));
      dateString = hour+':'+minute;//dateString.substring(0, 13) +':'+minute+dateString.substring(16, dateString.length); 
      //console.log('value',((element[element.length -1].volt_in_ver/1000).toFixed(2)),dateString);
      voltR.push({value:Number((element[element.length -1].volt_in_ver/1000).toFixed(2)),label:dateString,dataPointText:(element[element.length -1].volt_in_ver/1000).toFixed(2)});
      voltS.push({value:Number((element[element.length -1].volt_in_ves/1000).toFixed(2)),label:dateString,dataPointText:(element[element.length -1].volt_in_ves/1000).toFixed(2)});
      voltT.push({value:Number((element[element.length -1].volt_in_vet/1000).toFixed(2)),label:dateString,dataPointText:(element[element.length -1].volt_in_vet/1000).toFixed(2)});
      currentR.push({value:Number((element[element.length -1].current_ir).toFixed(2)),label:dateString,dataPointText:(element[element.length -1].current_ir).toFixed(2)});
      currentS.push({value:Number((element[element.length -1].current_is).toFixed(2)),label:dateString,dataPointText:(element[element.length -1].current_is).toFixed(2)});
      currentT.push({value:Number((element[element.length -1].current_it).toFixed(2)),label:dateString,dataPointText:(element[element.length -1].current_it).toFixed(2)});
      activePAR.push({value:Number((element[element.length -1].active_par).toFixed(2)),label:dateString,dataPointText:(element[element.length -1].active_par).toFixed(2)});
      activePAS.push({value:Number((element[element.length -1].active_pas).toFixed(2)),label:dateString,dataPointText:(element[element.length -1].active_pas).toFixed(2)});
      activePAT.push({value:Number((element[element.length -1].active_pat).toFixed(2)),label:dateString,dataPointText:(element[element.length -1].active_pat).toFixed(2)});
      powerPFR.push({value:Number((element[element.length -1].power_pfr).toFixed(2)),label:dateString,dataPointText:(element[element.length -1].power_pfr).toFixed(2)});
      powerPFS.push({value:Number((element[element.length -1].power_pfs).toFixed(2)),label:dateString,dataPointText:(element[element.length -1].power_pfs).toFixed(2)});
      powerPFT.push({value:Number((element[element.length -1].power_pft).toFixed(2)),label:dateString,dataPointText:(element[element.length -1].power_pft).toFixed(2)});
     
      Qat.push({value:Number((element[element.length -1].qat/1000).toFixed(2)),label:dateString,dataPointText:(element[element.length -1].qat/1000).toFixed(2)});
      QrOneT.push({value:Number((element[element.length -1].qr_one_t/1000).toFixed(2)),label:dateString,dataPointText:(element[element.length -1].qr_one_t/1000).toFixed(2)});
    });
    let data =  {"label":label,"voltR":voltR,"voltS":voltS,"voltT":voltT,"currentR":currentR,"currentS":currentS,"currentT":currentT,"activePAR":activePAR,"activePAS":activePAS,"activePAT":activePAT,"powerPFR":powerPFR,"powerPFS":powerPFS,"powerPFT":powerPFT,"Qat":Qat,"QrOneT":QrOneT};
     resolve({
                http: 200,
                status: "Success",
                result: data,
              });        
    
            });
          });
        });

      } // ()
}