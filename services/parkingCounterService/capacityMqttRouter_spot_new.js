/**
 * Name: MeasureMqttRouter.ts
 * Date: 04 - 11 - 2021
 * Author: Alejandro Losa García
 * Description: Manages the MQTT interactions of the measure feature
 */

const mqtt = require('mqtt')
const options = {
    // Clean session
    clean: true,
    connectTimeout: 4000,
    // Auth
    clientId: getRandomNumberStr(8),
    username: 'gesinen',
    password: 'gesinen2110',
}
const loop = require('node-async-loop');
const fs = require('fs');
const schedule = require('node-schedule');
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



// Asynchronous mysql query
async function query(sql) {
    return new Promise((resolve, reject) => {

        db.getConnection(function(err, connection) {

            if (err) {
                reject(err)
            } else {
                connection.query(sql, (err, rows) => {

                    if (err) {
						console.log('query error');
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

async function getCurrentCapacityAndParkingId(deviceEui) {
    let sqlGetCurrentCapacity = "SELECT capacity_parking.currentCapacity, capacity_parking.id as parkingId FROM `sensor_info` INNER JOIN capacity_devices ON " +
        "capacity_devices.sensorId=sensor_info.id INNER JOIN capacity_type_ribbon ON " +
        "capacity_type_ribbon.capacityDeviceId=capacity_devices.id INNER JOIN capacity_parking ON" +
        " capacity_parking.id=capacity_type_ribbon.parkingId WHERE sensor_info.device_EUI = '" + deviceEui + "';"
    let res = await query(sqlGetCurrentCapacity)
    //console.log("res", res)
    return {
        currentCapacity: res[0].currentCapacity,
        parkingId: res[0].parkingId
    }
}

async function getParkingCartelDeviceEuiAndLines(parkingId) {
    return new Promise(async(resolve, reject) => {

        let sqlGetParkingCartelsIds = "SELECT capacity_cartel_line.cartelId FROM capacity_cartel " +
            "LEFT JOIN capacity_cartel_line ON capacity_cartel.id=capacity_cartel_line.cartelId LEFT JOIN sensor_info ON " +
            "sensor_info.id=capacity_cartel.sensorId WHERE capacity_cartel_line.parkingId=" + parkingId + ";";
        //console.log(sqlGetParkingCartelsIds)
        let res = await query(sqlGetParkingCartelsIds).catch(err => {
                console.log("error", err)
            })
            //console.log("res", res[0].currentCapacity)
        resArray = []
        for (const element of res) {
            let sqlGetParkingCartelDeviceEuiAndLines =
                "SELECT sensor_info.device_EUI as cartelDeviceEUI,capacity_cartel_line.lineNum, capacity_parking.currentCapacity " +
                ", capacity_parking.id as parkingId, capacity_parking.maxCapacity, capacity_parking.provider, capacity_parking.authToken" +
                ", capacity_parking.name as parkingSensorName FROM `capacity_cartel_line` RIGHT JOIN capacity_cartel ON capacity_cartel.id=capacity_cartel_line.cartelId" +
                " LEFT JOIN capacity_parking ON capacity_parking.id=capacity_cartel_line.parkingId RIGHT JOIN sensor_info" +
                " ON sensor_info.id=capacity_cartel.sensorId WHERE capacity_cartel_line.cartelId=" + element.cartelId + " AND " +
                "capacity_cartel_line.parkingId IS NULL OR capacity_cartel_line.parkingId IS NOT NULL AND " +
                "capacity_cartel_line.cartelId=" + element.cartelId + ";";
            //console.log(sqlGetParkingCartelDeviceEuiAndLines)
            let res = await query(sqlGetParkingCartelDeviceEuiAndLines).catch(err => {
                    console.log("error", err)
                })
                //console.log("getParkingCartelDeviceEuiAndLines", res)
            resArray.push(res)
        }
        resolve(resArray)
    })
}

function newMsgFormatter(number) {
    let res = '';
    let n = number.toString();

    if (n.length == 1) {
        res = '00 0' + n;
    } else if (n.length == 2) {
        res = '00 ' + n;
    } else if (n.length == 3) {
        res = '0' + n[0] + ' ' + n[1] + '' + n[2];
    } else {
        res = '' + n[0] + '' + n[1] + ' ' + n[2] + '' + n[3]
    }

    return res;
}


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

function hexToBase64(str) {
    //console.log("hexToBase64", btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))))
    return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
}


//conn.release();
const client = mqtt.connect('mqtts://gesinen.es:8882', options)

async function subscribeGateways() {
    let querySql = "SELECT gateways.mac AS mac_number, sensor_info.device_EUI FROM capacity_devices INNER JOIN sensor_info ON sensor_info.id = capacity_devices.sensorId INNER JOIN gateways ON gateways.sensors_id LIKE CONCAT('%', capacity_devices.sensorId, '%') INNER JOIN capacity_type_spot ON capacity_type_spot.capacityDeviceId=capacity_devices.id WHERE capacity_devices.type='parking_individual' OR capacity_devices.type='parking_individual_Parkdroid';";
   // console.log("querySql", querySql)

    let storedData = []
    query(querySql).then(rows => {
        rows.forEach(element => {
            storedData.push(element)
        });
       // console.log(storedData)
        storedData.forEach(element => {
            // Me subscribo a todos los gateways
            client.subscribe(element.mac_number + '/#', function(err) {
                if (!err) {
                    console.log("subscrito al gateway con mac: " + element.mac_number)
                } else {
                    console.log(err)
                }
            })
        });
    })
}
client.on('connect', function() {
    console.log('Connected')
    client.subscribe('reset/capacity/spot', function(err) {
            if (!err) {
                console.log("subscrito al topic de reset -> reset/capacity/spot")
            } else {
                console.log(err)
            }
        })
        /*let setTopic = "dca632143f21/application/4/device/1079e129d522e109/tx";
        let setMessage = "GwgGBwgC8AE="
        let messageReadyToSend = {
            confirmed: true,
            fPort: 4,
            data: setMessage
        }
        console.log("FINAL preparedMESSAGE", JSON.stringify(messageReadyToSend))
        client.publish(setTopic, JSON.stringify(messageReadyToSend))*/
        //setCartelPlaces("dca632143f21", "1079e129d522e109", 19, 21, 35, 67, 66, 45)
        //console.log("query", querySql)
    subscribeGateways()
})

client.on('disconnect', function(err) {
    console.log("disconnect", err);
})

client.on('error', function(err) {
    console.log("error", err);
})

// Parkdroid
// FREE / OCCUPIED
function decodeMessageParkdroid(messageHex) {
    // AA== decodes to 0x00 ( OCCUPIED )
    if (messageHex == "0x00") {
        return false
    }
    // AQ== decodes to 0x01 ( FREE )
    else if (messageHex == "0x01") {
        return true
    }
}

function hex2bin(hex) {
    return (parseInt(hex, 16).toString(2)).padStart(8, '0');
}
// Libelium
// FREE / OCCUPIED
function decodeMessageLibelium(messageHex) {
    let binary = hex2bin(messageHex)
    console.log(binary, 'esto es el binario antes de devolver binary 07')
    return binary[7]
}

/*
Set cartel status
SET -> OX1B
Cartel tipo: 0X08 -> display 3 parkings plazasLibres / plazasTotales
Estructura de mensaje: OX08 PL1 PL2 PL3 PT1 PT2 PT3
PL = plazas libres, PT = plazas totales
*/
function getCartelPlaces(gatewayMac, cartelDeviceEUI) {
    let setTopic = gatewayMac + "/application/2/device/" + cartelDeviceEUI + "/tx"
    let getMessage = "1A 08"
}

function intToHex(number) {
    return number.toString(16)
}
/*
Set cartel status
SET -> OX1B
Cartel tipo: 0X08 -> display 3 parkings plazasLibres / plazasTotales
Estructura de mensaje: OX08 PL1 PL2 PL3 PT1 PT2 PT3
PL = plazas libres, PT = plazas totales
*/

async function getXirivellaParkingCapacity(parkingId){
    let sqlGetCurrentCapacity = "SELECT currentCapacity,maxCapacity FROM `capacity_parking` WHERE id =" + parkingId + ";"
    let res = await query(sqlGetCurrentCapacity)
   // console.log("responseFromXirivellaCapacity", res)
    return {
        currentXirivellaCapacity: (res[0].maxCapacity - res[0].currentCapacity)
    }
}

async function setCartelPlaces(gatewayMac, username, parkingId, cartelDeviceEUI, pl1, pl2, pl3, pt1, pt2, pt3) {
    //let setTopic = gatewayMac + "/application/4/device/" + cartelDeviceEUI + "/tx"
	let setTopic = gatewayMac + "/application/2/device/" + cartelDeviceEUI + "/tx"
    let setMessage;
	console.log('username from Spot',username);
    if (username.includes('xirivella')) {
        const currentCapacity = await getXirivellaParkingCapacity(parkingId);
		//console.log('Xirivella message',"1B 02 " + intToHex(currentCapacity.currentXirivellaCapacity) + " " + intToHex(pl1));
        //setMessage = "1B 01 " + intToHex(currentCapacity.currentXirivellaCapacity) + " " + intToHex(pl1) + "0"
		setMessage = "1B 02 " + intToHex(currentCapacity.currentXirivellaCapacity) + " " + intToHex(pl1) //+ "0"
		
    }
	else if(username == 'cheste@geswat.com'){
		setTopic = gatewayMac + "/application/2/device/" + cartelDeviceEUI + "/tx"
		
		 let freeSpaces = (pt1 - pl1);
		 //console.log(freeSpaces);
		 let freeSpacesHex =  intToHex(freeSpaces);
		 console.log('cheste test',pt1,pl1,intToHex(pt1),intToHex(pl1),freeSpaces);
		setMessage = "1B 03"+" "+ freeSpacesHex;
	}
	else if(username == 'elpuig@geswat.com'){
		setTopic = gatewayMac + "/application/2/device/" + cartelDeviceEUI + "/tx"
		// message  1B 06 p1 p1m p2 p2m
		 let freeSpacesLine1 = (pt1 - pl1);
		 let freeSpacesLine2 = (pt2 - pl2);
		 //console.log('free spaces',freeSpacesLine1,freeSpacesLine2);
		 freeSpacesLine1 =  intToHex(freeSpacesLine1);
		 freeSpacesLine2 =  intToHex(freeSpacesLine2);
		// console.log(freeSpacesLine1,freeSpacesLine2,'pt1',pt1,pl1,'pt2',pt2,pl2);
		setMessage = "1B 06"+" "+ ('0'+freeSpacesLine1).slice(-2) +" 00 "+ ('0'+freeSpacesLine2).slice(-2) +" 00 ";
	}
	else if(username == 'villardelarzobispo@geswat.com'){
		//console.log('inside',username);
		setTopic = gatewayMac + "/application/2/device/" + cartelDeviceEUI + "/tx"
		// message  1B 06 p1 p1m p2 p2m
		 let freeSpacesLine1 = (pt1 - pl1);
		 let freeSpacesLine2 = (pt2 - pl2);
		 // console.log('free spaces',freeSpacesLine1,freeSpacesLine2);
		 freeSpacesLine1 =  intToHex(freeSpacesLine1);
		 freeSpacesLine2 =  intToHex(freeSpacesLine2);
		 //console.log(freeSpacesLine1,freeSpacesLine2,'pt1',pt1,pl1,'pt2',pt2,pl2);
		setMessage = "1B 06"+" "+ ('0'+freeSpacesLine1).slice(-2) +" 00 "+ ('0'+freeSpacesLine2).slice(-2) +" 00 ";
	}
	else {
		setMessage  = "1B 08 " + intToHex(pl1) + " " + intToHex(pl2) + " " + intToHex(pl3) + " " + intToHex(pt1) + " " + intToHex(pt2) + " " + intToHex(pt3)
    }
	//console.log("setMessageNormal", setMessage)
    let setMessageBase64 = hexToBase64(setMessage)
   // console.log("setMessageBase64", setMessageBase64)
    let messageReadyToSend = {
        confirmed: true,
        fPort: 4,
        data: setMessageBase64
    }
  //  console.log("FINAL preparedMESSAGE", JSON.stringify(messageReadyToSend), setTopic)
    client.publish(setTopic, JSON.stringify(messageReadyToSend))
}
// Retrieves all parking id
async function getParkingIds() {
    return new Promise((resolve, reject) => {
        let getSpotDevices = "SELECT id FROM `capacity_parking`;"
        query(getSpotDevices).then(res => {
            //console.log("getParkingIds", res)
            resolve(res)
        })
    })
}

async function getSensorRelatedParking(deviceEui) {
    return new Promise((resolve, reject) => {
        let getSpotDevices = "SELECT capacity_type_spot.parkingId FROM `sensor_info` INNER JOIN capacity_devices ON capacity_devices.sensorId=sensor_info.id " +
            "INNER JOIN `capacity_type_spot` ON capacity_type_spot.capacityDeviceId = capacity_devices.id WHERE sensor_info.device_EUI = '" + deviceEui + "';"
       // console.log(getSpotDevices, 'queryUpdateCartelParking')
        query(getSpotDevices).then(res => {
          //  console.log("getSensorRelatedParking", res)
            if (res.length > 0) {
                resolve(res[0].parkingId)
            }
            reject(false)
        })
    })
}

async function getSesnorServerRelationByDeviceEUI(deviceEui) {
    return new Promise((resolve, reject) => {
        let getSensorServerRaltion = "Select sensor_info.device_eui,sensor_info.user_id as userId, sensor_info.name ,servers.authorization_token as authtoken,servers.provider_id as provider,servers.server_url as url,sensor_server_detail.id from sensor_info  inner join sensor_server_detail on sensor_server_detail.sensor_id = sensor_info.id  inner join servers on sensor_server_detail.server_id = servers.id where sensor_info.device_eui = '" + deviceEui + "';"
       // console.log(getSensorServerRaltion, 'sesnorServerrelation')
        query(getSensorServerRaltion).then(res => {
            //console.log("getSensorServerRaltion", res)
            if (res.length > 0) {
                resolve(res[0])
            }
			else if(res.length == 0 ){
				//console.log('Sensor is not linked with server');
			resolve('Sensor is not linked with server')
			}
            reject(false)
        })
    })
}
async function getSesnorInfoByDeviceEUI(deviceEui) {
	let sensorInfo = "Select device_eui,user_id as userId, name from sensor_info  where device_eui = '" + deviceEui + "';"
    let res = await query(sensorInfo)
    //console.log("res", res)
    return {'device_eui':res[0].device_eui,'userId':res[0].userId,'name':res[0].name}
    
    
}

async function getAllParkingDevices(userId) {
    return new Promise((resolve, reject) => {
        let ParkingDevices = "Select capacity_devices.name,capacity_devices.type,sensor_info.device_eui  from capacity_devices inner join sensor_info On sensor_info.id = capacity_devices.sensorId where capacity_devices.userId = " + userId + ";"
        
        query(ParkingDevices).then(res => {
           console.log(res, 'ParkingDevices')
            //if (res.length > 0) {
                resolve(res)
            //}
			//console.log('rejection error');
            //reject(false)
        })
    })
}

async function getCartelGatewayMac(cartelDeviceEUI) {
    let sqlGetCurrentCapacity = "SELECT gateways.mac, gateways.name AS name FROM gateways INNER JOIN sensor_info ON gateways.sensors_id LIKE CONCAT('%', sensor_info.id, '%') WHERE sensor_info.device_EUI = '" + cartelDeviceEUI + "' AND gateways.name NOT LIKE '%alberto%';"
    let res = await query(sqlGetCurrentCapacity)
    //console.log("res", res)
    return {
        mac_number: res[0].mac
    }
}

async function getParkingPlacesCount(parkingId, username) {
    let sqlGetCurrentCapacity = "SELECT COUNT(*) AS placesCount FROM `capacity_type_spot` WHERE status = true AND parkingId =" + parkingId + ";"
    let res = await query(sqlGetCurrentCapacity)
    //console.log(res, "la cuenta")
    if(!username.includes('xirivella')){
        let sqlUpdateCurrentCapacity = "UPDATE capacity_parking SET currentCapacity = "+ res[0].placesCount + " WHERE id = " + parkingId + ";"
        let res2 = await query(sqlUpdateCurrentCapacity)
       // console.log(res2, "el update")
        let sqlGetTotalCapacity = "SELECT COUNT(*) AS totalPlaces FROM capacity_type_spot WHERE parkingId = " + parkingId + ";"
        let res3 = await query(sqlGetTotalCapacity)
        //console.log(res3, "el count total")
        let sqlUpdateTotalCapacity = "UPDATE capacity_parking SET maxCapacity = "+ res3[0].totalPlaces + " WHERE id = " + parkingId + ";"
        let res4 = await query(sqlUpdateTotalCapacity)
       // console.log(res4, "el update del count total")

    }
    return {
        currentCapacity: res[0].placesCount
    }
}

async function getUsernameByParking(parkingId) {
    let sqlGetCurrentCapacity = "SELECT email AS username FROM users INNER JOIN capacity_parking ON users.id = capacity_parking.userId WHERE capacity_parking.id = " + parkingId + ";"
    let res = await query(sqlGetCurrentCapacity)
   // console.log("res", res)
    return {
        username: res[0].username
    }
}

// Refresh parking capacity on all related cartels
async function refreshRealCartelCapacity(parkingId) {
	console.log('refreshRealCartelCapacity');
    let cartelDeviceEUIandLinesArray = await getParkingCartelDeviceEuiAndLines(parkingId)
   // console.log("cartelDeviceEUIandLinesArray", cartelDeviceEUIandLinesArray)
    let username = await getUsernameByParking(parkingId);
    username = username.username
    //console.log(username, 'esto es el usuario');
    for (const element of cartelDeviceEUIandLinesArray) {
        const index = cartelDeviceEUIandLinesArray.indexOf(element);
        PL1 = 0, PL2 = 0, PL3 = 0, PT1 = 0, PT2 = 0, PT3 = 0
        if (element[0].parkingId != null) {
            const currentCapacity = await getParkingPlacesCount(element[0].parkingId, username)
            //console.log(currentCapacity, 'esto es el currentcapacity 1 ma nigga')
            PL1 = currentCapacity.currentCapacity
            PT1 = element[0].maxCapacity
        }
        if (element[1].parkingId != null) {
            const currentCapacity = await getParkingPlacesCount(element[1].parkingId, username)
            //console.log(currentCapacity, 'esto es el currentcapacity 2 ma nigga')
            PL2 = currentCapacity.currentCapacity
            PT2 = element[1].maxCapacity
        }
        if (element[2].parkingId != null) {
            const currentCapacity = await getParkingPlacesCount(element[2].parkingId, username)
            //console.log(currentCapacity, 'esto es el currentcapacity 3 ma nigga')
            PL3 = currentCapacity.currentCapacity
            PT3 = element[2].maxCapacity
        }
        let gatewayMac = (await (getCartelGatewayMac(cartelDeviceEUIandLinesArray[index][0].cartelDeviceEUI))).mac_number;
       // console.log(gatewayMac, 'que coño pasa')
        await setCartelPlaces(gatewayMac, username, element[0].parkingId, cartelDeviceEUIandLinesArray[index][0].cartelDeviceEUI, PL1, PL2, PL3, PT1, PT2, PT3)
    }

}

// Updates all cartels on real (MQTT)
async function refreshAllCartelsReal() {
    let parkingIds = await getParkingIds().catch(err => {
        console.log("error", err)
    })
    for (const parking of parkingIds) {
        refreshRealCartelCapacity(parking.id)
    }
}
 //Getting status of sensor is occupied or free from sentilo
async function getStatusOfParkingSensorForlibelium(deviceName,deviceEUI,gatewayMac,provider,authtoken,url){
		return new Promise( function (resolve, reject) {
			var request = require('request');
			//let deviceName = '';
			
			//let providerId = 'cheste@cellnextelecom';
			//let authtoken = 'IuVl2c3YVgMwST1NUdCOEz7sT3mPsrvYrIMQOHBR1PWQfFRzaY2lHEZYdyO1yxUG';
			let finalurl = url+'/'+provider+'/'+deviceName+'S01';
			console.log(deviceName,finalurl,authtoken,provider);
			
			var options = {
						'method': 'GET',
						'url': finalurl,   //'https://connecta.dival.es/sentilo-api/data/sumacarcer@geswat/'+sensorName+'s01',//replace s01 with varName when you want it get automatilly var name.
						'headers': {
							'IDENTITY_KEY': authtoken,//'19230246bb3d820f1d33a652dd4b0c4223de551b3589d122481402b4cf5d3d99',
							'Content-Type': 'application/json'							
						},
						
						rejectUnauthorized: false
					};
			request(options, function(error, response,body) {
					if(error){
						console.log('Error not getting Response',error);
						//reject(false)
						return reject(false);
					}
					try {
						console.log('status code',response.statusCode);
						if(response.statusCode == 200){
							let res = JSON.parse(response.body);
							if(res.observations.length > 0){
							console.log('observation',res.observations[0].value);
							if(res.observations[0].value == 'OCUPADO'){
							resolve(1)
							}
							
							else{
								resolve(0)
							}
						}
						else{
							resolve(1)
						}
						}
						else{
							reject(false)
						}
					}
					catch(e) {
					reject(e);
				}
			})
		})
		
	}
	
	// Change related spot device parking current capacity
async function changeCurrentParkingPlaces(spotDeviceEUI,Sensorstatus) {
    return new Promise((resolve, reject) => {
		try{
        let updateSensor = "UPDATE capacity_type_spot SET capacity_type_spot.status = "+Sensorstatus+" WHERE capacity_type_spot.capacityDeviceId " +
            "= (SELECT capacity_devices.id FROM capacity_devices INNER JOIN sensor_info ON capacity_devices.sensorId = sensor_info.id " +
            "WHERE sensor_info.device_EUI = '" + spotDeviceEUI + "');"
       // console.log("update CurrentParkingPlaces", updateSensor)

        query(updateSensor).then(res => {
            //console.log("update", res)
            if (res.affectedRows > 0) {
                resolve(true)
            } else {
				
                reject(false)
            }
        })
		}
		catch(err){
			console.log('update error');
			reject(false)
		}
    })
}

// Change related spot device parking current capacity
async function getCurrentValueOfParking(spotDeviceEUI) {
    return new Promise((resolve, reject) => {
		try{
        let SelectSensor = "select capacity_type_spot.status From capacity_type_spot WHERE capacity_type_spot.capacityDeviceId " +
            "= (SELECT capacity_devices.id FROM capacity_devices INNER JOIN sensor_info ON capacity_devices.sensorId = sensor_info.id " +
            "WHERE sensor_info.device_EUI = '" + spotDeviceEUI + "');"
       

        query(SelectSensor).then(res => {           
                resolve(res)  
        })
		}
		catch(err){
			console.log('select status error');
			reject(false)
		}
    })
}



// Increases related spot device parking current capacity
async function increaseCurrentParkingPlaces(spotDeviceEUI) {
    return new Promise((resolve, reject) => {

        let updateSensor = "UPDATE capacity_type_spot SET capacity_type_spot.status = true WHERE capacity_type_spot.capacityDeviceId " +
            "= (SELECT capacity_devices.id FROM capacity_devices INNER JOIN sensor_info ON capacity_devices.sensorId = sensor_info.id " +
            "WHERE sensor_info.device_EUI = '" + spotDeviceEUI + "');"
        //console.log("increaseCurrentParkingPlaces", updateSensor)

        query(updateSensor).then(res => {
            //console.log("res", res)
            if (res.affectedRows > 0) {
                resolve(true)
            } else {
                reject(false)
            }
        })
    })
}

// Decreases related spot device parking current capacity
async function decreaseCurrentParkingPlaces(spotDeviceEUI) {
    return new Promise((resolve, reject) => {
        let updateSensor = "UPDATE capacity_type_spot SET capacity_type_spot.status = false WHERE capacity_type_spot.capacityDeviceId " +
            "= (SELECT capacity_devices.id FROM capacity_devices INNER JOIN sensor_info ON capacity_devices.sensorId = sensor_info.id " +
            "WHERE sensor_info.device_EUI = '" + spotDeviceEUI + "');"
        //console.log("decreaseCurrentParkingPlaces", updateSensor)

        query(updateSensor).then(res => {
            //console.log("res", res)
            if (res.affectedRows > 0) {
                resolve(true)
            } else {
                reject(false)
            }
        })
    })
}
function hex2Bin(hex){
	return (parseInt(hex, 16).toString(2)).padStart(8, '0');
}

// Falta saber que topic y mensaje utilizan los dispositivos de parking spot
client.on('message', async function(topic, message) {
        if (topic != undefined) {
            
            let splitedTopic = topic.split("/")

            if (topic == "reset/capacity/spot") {
                subscribeGateways()
            } else if (splitedTopic[1] == "application" && splitedTopic[2] == "2" && splitedTopic[3] == "device" && splitedTopic[5] == "rx") {
                let deviceEUI = splitedTopic[4]
                let gatewayMac = splitedTopic[0]
                let messageFormated = JSON.parse(message.toString())
               // console.log("message", messageFormated)
                if (messageFormated.object.DecodeDataString != "PING" && messageFormated.fPort == 3 && messageFormated.data != 'wQ==') {
					console.log(topic, "topic");
					await new Promise(resolve => setTimeout(resolve, 3000));
					console.log('delay for 7 sec');
					let dbUpdateStatus = true
					let sensorServerDetail = await getSesnorServerRelationByDeviceEUI(deviceEUI);
					console.log('sensorServerDetail',sensorServerDetail);
					let sensorInfo;
					let userId ;
					userId = sensorServerDetail.userId;
					if(sensorServerDetail == 'Sensor is not linked with server'){
						let sensorInfo  = await getSesnorInfoByDeviceEUI(deviceEUI);
						console.log('sesnorInfo',sensorInfo);
						userId =  sensorInfo.userId;
					}					
					
					let ParkingDevices = await getAllParkingDevices(userId);
					if(ParkingDevices.length > 0 ){
					console.log('ParkingDevices',ParkingDevices);
					loop(ParkingDevices, async function(device, next) {
					//ParkingDevices.forEach(async (device)=>{
						//console.log('device',device);
						let deviceName = device.name.trim();
						let  deviceEUI = device.device_eui.trim();
						let  deviceType = device.type.trim();						
						if(deviceType == 'parking_individual_Parkdroid'){
							if(sensorServerDetail != 'Sensor is not linked with server'){
								next();
							}
							else{
						let binaryString = hex2Bin(messageFormated.object.DecodeDataHex);						
						 let binaryarray = binaryString.split('');						 
						  let Sensorstatus = binaryarray[7] == '0' ? false :true;
						  console.log('Sensorstatus',Sensorstatus);
						  await new Promise(resolve => setTimeout(resolve, 2000));
						  dbUpdateStatus = await changeCurrentParkingPlaces(deviceEUI,Sensorstatus);
						  console.log('dbUpdateStatus',dbUpdateStatus);
							next();
							}
						}
						else{
							if(sensorServerDetail == 'Sensor is not linked with server'){
								next();
							}
							else
							{
								if(deviceType == 'parking_individual'){
									console.log('deviceType',deviceType);
						//let deviceName = messageFormated.deviceName.trim();
					let sentiloResponse = await getStatusOfParkingSensorForlibelium(deviceName,deviceEUI,gatewayMac,sensorServerDetail.provider,sensorServerDetail.authtoken,sensorServerDetail.url);
                    console.log('sentiloResponse',sentiloResponse);
					
					//console.log('sentilo respinse',sentiloResponse);
				
					let decodeResult = sentiloResponse;//decodeMessageLibelium(messageFormated.object.DecodeDataHex)
                    //console.log("decodeResult", decodeResult)
					if(decodeResult !== 'noobservation'){
					let Sensorstatus  = decodeResult == 1?true:false;
					let Perviousestatus =  await getCurrentValueOfParking(deviceEUI);
					//console.log('Perviousestatus',Perviousestatus[0].status,Sensorstatus,decodeResult);
					if(Perviousestatus[0].status != decodeResult){
						console.log('PerviousestatusIn',Perviousestatus[0].status,Sensorstatus,decodeResult);
					await changeCurrentParkingPlaces(deviceEUI,Sensorstatus);
					}
					//dbUpdateStatus = await changeCurrentParkingPlaces(deviceEUI,Sensorstatus);
					}
						next();
								}
								else{
									next();
								}
						}
						}
                    //let dbUpdateStatus = false
                    /*if (decodeResult == 1) {
                        dbUpdateStatus = await increaseCurrentParkingPlaces(deviceEUI);
                    } else if (decodeResult == 0){
                        dbUpdateStatus = await decreaseCurrentParkingPlaces(deviceEUI);
                    }*/
                   
					},	async function(err){
						if(err){
							console.error('Error In loop : ' + err.message);
							let parkingId = await getSensorRelatedParking(deviceEUI)
                        console.log("parkingId", parkingId)
                        if (!isNaN(parkingId)) {
                            await refreshRealCartelCapacity(parkingId)
                        }
						console.log('loop called end for ',userId);
							return
						}
						
						// 
						let parkingId = await getSensorRelatedParking(deviceEUI)
                       // console.log("parkingId", parkingId)
                        if (!isNaN(parkingId)) {
                            await refreshRealCartelCapacity(parkingId)
                        }
						console.log('loop called end for ',userId);
					});
					}
					 //console.log("Hemos salido ya de los updates", dbUpdateStatus);
                    /*if (dbUpdateStatus) {
                        let parkingId = await getSensorRelatedParking(deviceEUI)
                       // console.log("parkingId", parkingId)
                        if (!isNaN(parkingId)) {
                            await refreshRealCartelCapacity(parkingId)
                        }
                    }*/
					
                }
            }
        }
    }) 
    /*

    let insertSql = ""
    for (i = 8854; i < 8900; i++) {
        insertSql += "INSERT INTO `sensor_gateway_pkid` (`mac_number`, `sensor_id`, `pk_id`) VALUES ('dca63214b212', " + i + ", NULL);"

    }*/
