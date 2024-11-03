/**
 * Name: IrrigationPlanLog.ts
 * Date: 26 - 09 - 2024
 * Author: Shesh Kumar Singh
 * Description: Managing the plans and save logs
 */
 
 
 /*
 
 Channel 	Type   Control Field 						Sequence	Time Control
 ff 		1d		a0 => 1010 0000						 00			 3c 00 00=>00
					Bit7: 1 => enable time control						00 3c=60s		
					Bit5: 1 => valve open
					Bit0-1: 00 => valve 1
					
			ff1da0003c0000==		/x2gADwAAA==
			
send valve open for some times 60seconds
{
"confirmed":true,
"fPort":85,
"data":"/x2gADwAAA=="
}
			
			
 */
 
 /*
 
 Channel 	Type 	Control Field 				Sequence
	ff 		1d		21 => 0010 0001					00
					Bit5: 1 => valve open
					Bit0-1: 01 => valve 2
					
		ff 1d 21 00   == /x0hAA=
// Open the valve 2 right now
					
{
"confirmed":true,
"fPort":85,
"data":"/x0hAA=="
}
													
 */
 
 /*
 Channel Type Command 		Number 		Value
	ff 	  4b 	03 = set 		02 		01 = enabbled
										00 = disable
	
	ff 4b 03 02 01  == /0sDAgA=
	
 disable plan 02
 {
"confirmed":true,
"fPort":85,
"data":"/0sDAgA="
}
 */
 
 /*
 Channel Type 	Command 		Value
	ff 		4b 		00 = get 	0000
	
		ff 4b 00 00 00 ==  /0sAAAA=
 get all plan status
 {
"confirmed":true,
"fPort":85,
"data":"/0sAAAA="
}*/

function calculateHexSensorValue(fourBytes) {
    let splitValues = fourBytes.split(",")
    if (splitValues[0].substring(0, 2) == "0x") {
        splitValues[0] = splitValues[0].substring(2, 4)
    }
    if (splitValues[1].substring(0, 2) == "0x") {
        splitValues[1] = splitValues[1].substring(2, 4)
    }
    let val = hexToIntStr(splitValues[1] + splitValues[0])
    let res = val.substring(0, val.length - 1) + "." + val.substring(val.length - 1, val.length)
    return res
}
const mqtt = require('mqtt')
var moment = require('moment-timezone');
const schedule = require('node-schedule');
const asyncLoop = require('node-async-loop');

const options = {
    // Clean session
    clean: true,
    connectTimeout: 4000,
    // Auth
    clientId: getRandomNumberStr(8),
    username: 'gesinen',
    password: 'gesinen2110',
}

const mysql = require('mysql');
var btoa = require('btoa');

// Database
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Al8987154St12',
    //password: '',
    database: 'swat_gesinen'
});

function getRandomNumberStr(length) {
    var result = '';
    var characters = '0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}
// Asynchronous mysql query
async function query(sql) {
    return new Promise((resolve, reject) => {

        db.getConnection(function(err, connection) {

            if (err) {
                reject(err)
            } else {
                connection.query(sql, (err, rows) => {

                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                    // finaliza la sesión
                    connection.release()
                })
            }
        })
    })
}
function hexToIntStr(hexString) {
    return parseInt(hexString, 16).toString();
}
function fromHexToBase64(hexString) {
    let res = btoa(hexString)
        //console.log("fromHexToBase64 FN()", res)
    return res
}


function hexToBase64(str) {
	
    //console.log("hexToBase64", btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))))
    return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
}

function replaceAt(array, index, value) {
		
		const ret = array.slice(0);
		ret[index] = value;
		return ret;
	  }
	  
async function main() {
	let querySrt = `SELECT irrigation_device.id as irrigation_device_id, gateways.mac as device_gateway, sensor_info.device_EUI as irrigation_deviceEUI FROM irrigation_device INNER JOIN sensor_info ON sensor_info.id=irrigation_device.sensorId INNER JOIN gateways ON gateways.sensors_id LIKE CONCAT('%',irrigation_device.sensorId,'%');`
	

	let subbscribeList = []
    let deviceEUI_fk_irrigationDevEUI = []
	 let data = await query(querySrt);
   


        data.forEach(element => {
            subbscribeList.push({
                gateway_mac: element.device_gateway,
                deviceEUI: element.irrigation_deviceEUI
            })
            deviceEUI_fk_irrigationDevEUI[element.irrigation_deviceEUI] = element.irrigation_device_id
        });
	   
   
		
		//console.log('subbscribeList',subbscribeList);
		
		
    let querySql = `SELECT irrigation_device_output_config.*,irrigation_device.name, irrigation_device.parametersSensorDevEui from irrigation_device_output_config inner join irrigation_device On irrigation_device.id = irrigation_device_output_config.irrigationDeviceId;`
	
	let storedData = []
   
    query(querySql).then(rows => {


        rows.forEach(element => {
			let controlFieldvalve = [0,0];
			let controlFieldfourZero = '0000';
			let controlFieldEnbDsb ='1';
			let controlFieldOpenClose = '1';
			let valveNumber;
			let repeatday = [0,0,0,0,0,0,0,0];
			let device_EUI ='';
			let id;
			let irrigationDeviceId;
			let sensorId;
			let deviceTypeId;
			let gateway_mac;
			let applicationId;
			let startTiming;
			let endTiming;
			let valveConfig = JSON.parse(element.valveConfig);
			//console.log('valve config',valveConfig);
			valveConfig.valve.forEach( info => {
				if(element.parametersSensorDevEui){
				//console.log('parametersSensorDevEui',element.parametersSensorDevEui)
				}
				valveNumber = info.sensorIndex;
				device_EUI =  element.parametersSensorDevEui;//info.device_EUI;
				id = info.id;
				irrigationDeviceId =  info.irrigationDeviceId;
				sensorId =  info.sensorId;
				deviceTypeId = info.deviceTypeId;
				gateway_mac = info.gateway_mac;
				applicationId = info.applicationId;
				startTiming = valveConfig.startTime;
				endTiming = valveConfig.endTime;
				controlFieldvalve =  replaceAt(controlFieldvalve,info.sensorIndex-1,1);
				
			});
			//console.log('start',startTiming,endTiming);
			
			
			  controlFieldvalve = controlFieldvalve.reverse();
				//console.log('valve',controlFieldvalve);
				controlFieldEnbDsb = Number(valveConfig.controlFieldenable); 
				controlFieldOpenClose = Number(valveConfig.controlFieldopen);
				var controlFieldhexa = (parseInt((''+controlFieldEnbDsb+controlFieldOpenClose+controlFieldfourZero+controlFieldvalve.join("")), 2).toString(16).toUpperCase()).toLowerCase();
				//console.log('controlfiled',controlFieldhexa)
				valveConfig.days.forEach(element => {
					repeatday = replaceAt(repeatday,element,1);				
				});
				//console.log('before reverse',repeatday);
				repeatday= repeatday.reverse();
				//console.log('after server',repeatday);
				var repetdayhexa = ('0'+(parseInt(repeatday.join(""), 2).toString(16).toUpperCase()).toLowerCase()).slice(-2);
				//console.log('repetday hexa',repetdayhexa);
				let startTime = valveConfig.startTime.split(":");
				let endTime = valveConfig.endTime.split(":");
				starttimeHour = (('0'+(parseInt(startTime[0]).toString(16).toUpperCase())).slice(-2)).toLowerCase();
				starttimeMinute = (('0'+(parseInt(startTime[1]).toString(16).toUpperCase())).slice(-2)).toLowerCase();
				endtimeHour = (('0'+(parseInt(endTime[0]).toString(16))).slice(-2));
				endtimeMinute = (('0'+(parseInt(endTime[1]).toString(16))).slice(-2));
				//console.log(startTime[0],startTime[1],starttimeHour,starttimeMinute,endTime[0],endTime[1],endtimeHour,endtimeMinute);
				valveConfig.days.forEach(day => {
					let  myday = '';
					switch(day){
						case "0":
							myday = "Monday";
							break;
						case "1":
							myday = "Tuesday";
							break;
						case "2":
							myday = "Wednesday";
							break;
						case "3":
							myday = "Thursday";
							break;
						case "4":
							myday = "Friday";
							break;
						case "5":
							myday = "Saturday";
							break;
						case "6":
							myday = "Sunday";
							break;
						
					}
				storedData.push({
					
					id:id,
					planNumber: (('0'+(parseInt(element.slotNumber).toString(16))).slice(-2)).toLowerCase(),
					deviceEUI:device_EUI,
					irrigationDeviceId:irrigationDeviceId,
					day:myday,
					valveNumber:valveNumber,
					sensorId:sensorId,
					deviceTypeId:deviceTypeId,
					gateway_mac:gateway_mac,
					applicationId:applicationId,
					startTiming:startTiming,
					endTiming:endTiming,
					controlFieldvalve:controlFieldvalve,					
					controlFieldEnbDsb:controlFieldEnbDsb,
					controlFieldOpenClose:controlFieldOpenClose,
					controlFieldhexa:controlFieldhexa,
					repeatday:repeatday,
					repetdayhexa:repetdayhexa,
					starttimeHour:starttimeHour,
					starttimeMinute:starttimeMinute,
					endtimeHour:endtimeHour,
					endtimeMinute: endtimeMinute
					
				})
				})
		})
			
			/*valveConfig.days.forEach(item=>{
				if(item !="" && valveConfig.ControlFieldenable == "1"){	
					let valve = valveConfig.ControlFieldvalve1 == "1" ? 1:(valveConfig.ControlFieldvalve2 == "1")?2:null;
				storedData.push({
                device_gateway: element.irrigationGatewayMac,
                deviceEUI: element.irrigationDeviceEUI,
				deviceId:element.irrigationDeviceId,
				day:item,
				startTiming:valveConfig.startTime,
				endTiming:valveConfig.endTime,
				valveNumber : valve
				})
				}
            })*/
				
			
            
    
        //conn.release();
		//console.log('storedData',storedData);
         const client = mqtt.connect('mqtts://gesinen.es:8882', options);
		client.on('connect', function() {
            console.log('Connected')
			subbscribeList.forEach(element => {
				/*if(element.deviceEUI == '24e124460d085961'){
				console.log('deveui',element.deviceEUI)
				}
				else{
					console.log(element.deviceEUI)
				}*/
                // Me subscribo a todos los gateways
                client.subscribe(element.gateway_mac + '/application/+/device/'+element.deviceEUI+'/#', function(err) {
				//	client.subscribe('b827eb805934/application/2/device/#', function(err) {
                    if (!err) {
                        console.log("subscrito a " + element.gateway_mac+'/application/+/device/'+element.deviceEUI+'/#')
                    } else {
                        console.log(err)
                    }
                })
				})
            
        })
		client.on('disconnect', function(err) {
            console.log("disconnect", err);
        })

        client.on('error', function(err) {
            console.log("error", err);
        })
		
		client.on('message', async function(topic, message) {
		console.log('message',topic,message)
		
		let messageJSON = JSON.parse(message.toString());
		
		
			//console.log("topic", topic,messageJSON);
		let dateStr  = moment().tz("Europe/Madrid").format('YYYY-MM-DD hh:mm:ss');
		
		if (messageJSON.object.DecodeDataHex.substring(0, 4).toLowerCase() == "0x15"){
			console.log("topic", topic,message);
			let name = messageJSON.deviceName;
			let deviceEui = messageJSON.devEUI;
			let valveNumber = messageJSON.object.DecodeDataHex.substring(5, 9).toLowerCase();
			let valveStatus = messageJSON.object.DecodeDataHex.substring(10, 14).toLowerCase() == "0x00" ? 0:1;
				let  matchedRecord = storedData.find(o => o.deviceEUI === deviceEui && o.valveNumber == valveNumber);
			await InsertTheVolveLog(matchedRecord.deviceEUI,name,matchedRecord.deviceId,null,matchedRecord.startTiming,null,null,'Plan started',valveNumber,valveStatus);
		}
		else if(messageJSON.fPort == 85){
			let topicSplit = topic.split("/")
			let gatewayMac = topicSplit[0]
			let relatedSensorDeviceEui = topicSplit[4]
			let bytesVolveStatus = 0;
			
			let splitMsg = messageJSON.object.DecodeDataHex.split(",");
			let deviceName = messageJSON.deviceName;
			//let queryGetIrrigationDevices = "SELECT irrigation_device.id , irrigation_device.deviceTypeId,irrigation_device_output.sensorId as humitytempId  FROM `sensor_info` LEFT JOIN irrigation_device ON sensor_info.id = irrigation_device.sensorId LEFT JOIN irrigation_device_output ON sensor_info.id = irrigation_device_output.sensorId WHERE device_EUI='" + relatedSensorDeviceEui + "';"
              //          console.log('porque no está funcionando esto');
			//query(queryGetIrrigationDevices).then(async function(rows) {
							//console.log("getDeviceEuiBySensorId RES", rows);
							//for (const row of rows) {
								let  deviceInfo = storedData.find(item => {
									console.log(item.deviceEUI,relatedSensorDeviceEui)
									return item.deviceEUI == relatedSensorDeviceEui
									});
								console.log('deviceInfo',deviceInfo,relatedSensorDeviceEui)
								let irrigationDeviceId = deviceInfo.irrigationDeviceId
								
								console.log('deviceType',deviceInfo.deviceTypeId,deviceInfo.irrigationDeviceId)
								if(deviceInfo.deviceTypeId == 5){
									
									let decoderControllerRes	= DecoderController(splitMsg,85);
									console.log('decoderControllerRes',decoderControllerRes);
									
						
									if(decoderControllerRes.valve1 ==  1 ){
										let dateStr  = moment().tz("Europe/Madrid").format('YYYY-MM-DD hh:mm:ss');
										let currentTime  = moment().tz("Europe/Madrid").format('hh:mm');
										let today = moment().format('dddd');// eg. Monday 
										let device_eui = relatedSensorDeviceEui;
										let name =  deviceName;
										let deviceId = irrigationDeviceId;
										let planId = null;
										let plan_timing  = null;
										let plan_actually_started =  dateStr;
										let plan_runs_on_time = '';
										let Remark ='running log';
										let valveNumber = 1;
										let valveStatus  = decoderControllerRes.valve1Status ;
										console.log('devicecheck',device_eui,relatedSensorDeviceEui,irrigationDeviceId);
										let  matchedRecord = storedData.find(o => {
											//console.log(o.deviceEUI +'==='+ device_eui +'&&'+ o.valveNumber +'=='+ valveNumber +'&&'+ o.day +'=='+ today)
										return o.deviceEUI === device_eui && o.valveNumber == valveNumber && o.day == today
										});
										
										console.log('matchedrecord',matchedRecord);
										
										// checking for matched record;
										//SendForceCloseThePlan(matchedRecord,client);
										if(matchedRecord ){
											plan_timing = matchedRecord.startTiming;
											// checking the valve statatus if valve is ON = 1;
											if(valveStatus == 1){
												// checking startting and endtiming and day;
												 if(currentTime >= matchedRecord.startTiming && currentTime <= matchedRecord.endTiming  && matchedRecord.day == today){
													let  remark_message = 'Plan Started On Time';
													 await InsertTheVolveLog(device_eui,name, deviceId,planId, plan_timing,plan_actually_started,plan_runs_on_time,remark_message,valveNumber,valveStatus);

												 }
												 // valve is ON but time and day is not  matched send the command to close the valve
												 else{
													 let  remark_message = 'Plan Started out of  Time';
													 // saving the log
													 await InsertTheVolveLog(device_eui,name, deviceId,planId, plan_timing,plan_actually_started,plan_runs_on_time,remark_message,valveNumber,valveStatus);
													// sending the close command
													disableThePlan(matchedRecord,client);
													let topic = matchedRecord.device_gateway + "/application/" + matchedRecord.applicationId + "/device/" + matchedRecord.deviceEUI + "/tx";
													let message ="ff4b03"+planNumber+'01';
													let date  = moment().tz("Europe/Madrid").format('YYYY-MM-DD');
													 let time = date+matchedRecord.endTiming+':00'
													
													InsertTheIrrigationPlanToEnable(topic,message,time,matchedRecord.deviceEUI,'Active');
													SendForceCloseThePlan(matchedRecord,client);
													
												 }
												
												}
												// valve is OFF execute else cammand
											else{
												console.log(currentTime,plan_timing);
											}
										}
									}
									if(decoderControllerRes.valve2 ==  2 ){
										let dateStr  = moment().tz("Europe/Madrid").format('YYYY-MM-DD hh:mm:ss');
										let currentTime  = moment().tz("Europe/Madrid").format('hh:mm');
										let today = moment().format('dddd');// eg. Monday 
										let device_eui = relatedSensorDeviceEui;
										let name =  deviceName;
										let deviceId = irrigationDeviceId;
										let planId = null;
										let plan_timing  = null;
										let plan_actually_started =  dateStr;
										let plan_runs_on_time = '';
										let Remark ='running log';
										let valveNumber = 2;
										let valveStatus  = decoderControllerRes.valve1Status 
										let  matchedRecord = storedData.find(o => o.deviceEUI === device_eui && o.valveNumber == valveNumber && o.day == today);
										console.log('matchedrecord',matchedRecord);
										
										// checking for matched record;
										if(matchedRecord){
											plan_timing = matchedRecord.startTiming;
											// checking the valve statatus if valve is ON = 1;
											SendForceCloseThePlan(matchedRecord,client);
											if(valveStatus == 1){
												// checking startting and endtiming and day;
												if(currentTime >= matchedRecord.startTiming && currentTime <= matchedRecord.endTiming   && matchedRecord.day == today){
													let  remark_message = 'Plan Started On Time';
													 await InsertTheVolveLog(device_eui,name, deviceId,planId, plan_timing,plan_actually_started,plan_runs_on_time,remark_message,valveNumber,valveStatus);

												 }
												 // valve is ON but time and day is not  matched send the command to close the valve
												 else{
													 let  remark_message = 'Plan Started out of  Time';
													// saving the log
													await InsertTheVolveLog(device_eui,name, deviceId,planId, plan_timing,plan_actually_started,plan_runs_on_time,remark_message,valveNumber,valveStatus);
													disableThePlan(matchedRecord,client);
													// sending the close command
													let topic = matchedRecord.device_gateway + "/application/" + matchedRecord.applicationId + "/device/" + matchedRecord.deviceEUI + "/tx";
													let message ="ff4b03"+planNumber+'01';
													let date  = moment().tz("Europe/Madrid").format('YYYY-MM-DD');
													 let time = date+matchedRecord.endTiming+':00'
													InsertTheIrrigationPlanToEnable(topic,message,time,matchedRecord.deviceEUI,'Active');
													SendForceCloseThePlan(matchedRecord,client);
													 
												 }
												 }
											// valve is OFF execute else cammand
											else{
												console.log(currentTime,plan_timing);
											}
										}
										}
															 
								}
								
						
							//}
						
						//});
			
		}
	
		})
})
}

async function InsertTheVolveLog(device_eui,name, deviceId,planId, plan_timing,plan_actually_started,plan_runs_on_time,Remark,valveNumber,valveStatus) {
    return new Promise((resolve, reject) => {
      
		let dateStr  = moment().tz("Europe/Madrid").format('YYYY-MM-DD hh:mm:ss');
		plan_actually_started = dateStr;
       
		let queryLog = "INSERT INTO irrigation_log_table (`device_eui`,`name`,`deviceId`,`planId`,`plan_timing`,`plan_actually_started`,`plan_runs_on_time`,`Remark`, `valveNumber`, `valveStatus`)" +
            " VALUES ('" + device_eui + "','"+name+"','" + deviceId + "'," + planId + ",'" + plan_timing + "','" + plan_actually_started + "','" + plan_runs_on_time + "','"+Remark+"','"+valveNumber+"','"+valveStatus+"');"
        query(queryLog).then(rows => {
           // console.log("queryUpdateVolveStatus RES", rows)
            resolve(rows)
        })
    })
}

//console.log(Decoder(["0x01","0x75","0x64","0x03","0x67","0x19","0x01","0x04","0x68","0x73","0x05","0x7f","0xf0","0x00"]));

//milesight UC-511
function DecoderController(bytes, port) {
    var decoded = {};

    for (var i = 0; i < bytes.length;) {
        var channel_id = bytes[i++];
        var channel_type = bytes[i++];

        // BATTERY
        if (channel_id === "0x01" && channel_type === "0x75") {
			hexbytes = bytes[i];
			let hex =  hexbytes.substring(2,4);
			 console.log(hex);
			 decoded.batteryStatus = true;
            decoded.battery =  parseInt(hex,16);
            i += 1;
        }
        // VALVE 1
        else if (channel_id === "0x03" && channel_type == "0x01") {
			
			hexbytes = bytes[i];
			let hex =  hexbytes.substring(2,4);
			 console.log('Hex',hexbytes,hex,parseInt(hex,16));
			 decoded.valve1 =  1;
            decoded.valve1Status = parseInt(hex,16) === 0 ? 0 : 1;
            i += 1;
        }
        // VALVE 2
        else if (channel_id === "0x05" && channel_type == "0x01") {
			hexbytes = bytes[i];
			let hex =  hexbytes.substring(2,4);
			console.log('Hex',hexbytes,hex,parseInt(hex,16));
			decoded.valve2 =  2;
            decoded.valve2Status = parseInt(hex,16) === 0 ? 0 : 1;
            i += 1;
        }
        // VALVE 1 Pulse
        else if (channel_id === "0x04" && channel_type === "0xc8") {
            //decoded.valve1_pulse = readUInt32LE(bytes.slice(i, i + 4));
            i += 4;
        }
        // VALVE 2 Pulse
        else if (channel_id === "0x06" && channel_type === "0xc8") {
            //decoded.valve2_pulse = readUInt32LE(bytes.slice(i, i + 4));
            i += 4;
        }
        // GPIO 1
        else if (channel_id === "0x07" && channel_type == "0x01") {
            //decoded.gpio_1 = bytes[i] === 0 ? "off" : "on";
            i += 1;
        }
        // GPIO 2
        else if (channel_id === "0x08" && channel_type == "0x01") {
            //decoded.gpio_2 = bytes[i] === 0 ? "off" : "on";
            i += 1;
        } else {
            break;
        }
    }

    return decoded;
}

var j = schedule.scheduleJob('*/1 * * * *', async function(){
	async function scheduleFunctions(){
		console.log('schedule Called');
		const plans = await getAllThePlans();
		//console.log('plans',plans);
		let currentTime  = moment().tz("Europe/Madrid").format('hh:mm');
		 let today = moment().format('dddd');// eg. Monday 
		 const client = mqtt.connect('mqtts://gesinen.es:8882', options);
		 const topic = "dca632143f21/application/2/device/123/tx";
		 let msg = JSON.stringify({
        confirmed: true,
        fPort: 85,
        data: "abcd"
    });
			  client.publish(topic, msg)
		plans.forEach((element) => {
      try {
		  
		  if(today  == element.day && currentTime == element.startTiming){
			  
			  disableThePlan(element)
			  
			  sendForceStartTheIrrigationForSomeTime(element)
			  //sendForceStartTheIrrigation(element);
			  enableTheIrrigationPlan();
		  }
       
		//console.log('plans',element);
      } catch (error) {
        console.log("[ERROR]: ", error);
      }
    });
}
//scheduleFunctions();
});

async function getAllThePlans() {
    let querySql = `SELECT * from irrigation_device_ouput_config_from_device;`
	
	let storedData = []
   
    let records = await query(querySql);
	records.forEach(element => {
			let valveConfig = JSON.parse(element.valveConfigfromDevice);
			valveConfig.days.forEach(item=>{
				if(item !="" && valveConfig.ControlFieldenable == "1"){
					let valve = valveConfig.ControlFieldvalve1 == "1" ? 1:(valveConfig.ControlFieldvalve2 == "1")?2:null;
				storedData.push({
                device_gateway: element.irrigationGatewayMac,
                deviceEUI: element.irrigationDeviceEUI,
				deviceId:element.irrigationDeviceId,
				day:item,
				startTiming:valveConfig.startTime,
				endTiming:valveConfig.endTime,
				valveNumber : valve
				})
				}
            })
				
			});
	return storedData;
}



async function SendForceCloseThePlan(deviceInfo,client){
	let applicationId = 2;
	let fPort = 85;
const topic = deviceInfo.device_gateway + "/application/" + applicationId + "/device/" + deviceInfo.deviceEUI + "/tx";
	let Closevalve2 = "ff1d01";
	let Closevalve1 = "ff1d00";
	let messageData = deviceInfo.valveNumber == 2 ?Closevalve2:Closevalve1; 
     let messageText = hexToBase64(messageData);
	let msg = JSON.stringify({
        confirmed: true,
        fPort: fPort,
        data: messageText
    });
	//if(deviceInfo.device_gateway == 'e45f01b18d2f'){
	console.log('SendForceCloseThePlan',topic,msg)
	
	client.publish(topic, msg)
	//}
}

async function sendForceStartTheIrrigation(deviceInfo){
	let applicationId = 2;
	let fPort = 85;
const topic = deviceInfo.device_gateway + "/application/" + applicationId + "/device/" + deviceInfo.deviceEUI + "/tx";
     let Openvalve2 = "ff1d21";
	let Openvalve1 = "ff1d20";
	let messageData = deviceInfo.valveNumber == 2 ?Openvalve2:Openvalve1; 
     let messageText = hexToBase64(messageData);
	let msg = JSON.stringify({
        confirmed: true,
        fPort: fPort,
        data: messageText
    });
	console.log('sendForceStartTheIrrigation',topic,msg)
	client.publish(topic, msg)
}

async function sendForceStartTheIrrigationForSomeTime(deviceInfo){
	let applicationId = 2;
	let fPort = 85;
const topic = deviceInfo.device_gateway + "/application/" + applicationId + "/device/" + deviceInfo.deviceEUI + "/tx";
     let time =  period.toString(16)
	 let timereverse = time.padStart(6,"0")
	 let Openvalve2 = "ff1da100"+timereverse;
	let Openvalve1 = "ff1da000"+timereverse;
	let messageData = deviceInfo.valveNumber == 2 ?Openvalve2:Openvalve1; 
     let messageText = hexToBase64(messageData);
	let msg = JSON.stringify({
        confirmed: true,
        fPort: fPort,
        data: messageText
    });
	console.log('sendForceStartTheIrrigationForSomeTime',topic,msg)
	client.publish(topic, msg)
}
async function InsertTheIrrigationPlanToEnable(topic,message,time,device_eui,Status) {
    return new Promise((resolve, reject) => {
      
		let dateStr  = moment().tz("Europe/Madrid").format('YYYY-MM-DD hh:mm:ss');
		time = dateStr;
       
		let queryLog = "INSERT INTO irrigation_to_enable_plan_list (`topic`,`message`,`time`,`device_eui`,`Status`)" +
            " VALUES ('" + topic + "','"+message+"','" + time + "'," + device_eui + ",'" + Status + "');"
        query(queryLog).then(rows => {
           // console.log("queryUpdateVolveStatus RES", rows)
            resolve(rows)
        })
    })
	console.log('InsertTheIrrigationPlanToEnable',device_eui,topic);
}
async function enableTheIrrigationPlan(){
	let querySql = `SELECT * from irrigation_to_enable_plan_list;`
	
	let storedData = []
	let fPort = 85;
   
    let records = await query(querySql);
	records.forEach(element => {
		const topic = element.topic;
    let enablePlan = element.message;
	 
    let messageText = hexToBase64(enablePlan);
	let msg = JSON.stringify({
        confirmed: true,
        fPort: fPort,
        data: messageText
    });
		
	});
	console.log('enable plan msg',topic,msg)
	client.publish(topic, msg)
	
}

async function enableThePlan(deviceInfo){
	let applicationId = deviceInfo.applicationId;
	let fPort = 85;
	let planNumber = (deviceInfo.planNumber).toString(16);
	const topic = deviceInfo.gateway_mac + "/application/" + applicationId + "/device/" + deviceInfo.deviceEUI + "/tx";
    let enablePlan = "ff4b03"+planNumber+'01';
	 
    let messageText = hexToBase64(enablePlan);
	let msg = JSON.stringify({
        confirmed: true,
        fPort: fPort,
        data: messageText
    });
	console.log('enable plan msg',topic,msg)
	client.publish(topic, msg)
}
async function disableThePlan(deviceInfo){
	let applicationId = deviceInfo.applicationId;
	let fPort = 85;
	let planNumber = (deviceInfo.planNumber).toString(16);
	const topic = deviceInfo.gateway_mac + "/application/" + applicationId + "/device/" + deviceInfo.deviceEUI + "/tx";
    let diablePlan = "ff4b03"+planNumber+'00';
	 
    let messageText = hexToBase64(diablePlan);
	let msg = JSON.stringify({
        confirmed: true,
        fPort: fPort,
        data: messageText
    });
	console.log('disable plan msg',topic,msg)
	client.publish(topic, msg)
}
main()