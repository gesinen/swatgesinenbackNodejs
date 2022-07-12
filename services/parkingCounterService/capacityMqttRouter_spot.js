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
    console.log("res", res)
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
                "SELECT sensor_gateway_pkid.mac_number,sensor_info.device_EUI as cartelDeviceEUI,capacity_cartel_line.lineNum, capacity_parking.currentCapacity " +
                ", capacity_parking.id as parkingId, capacity_parking.maxCapacity, capacity_parking.provider, capacity_parking.authToken" +
                ", capacity_parking.name as parkingSensorName FROM `capacity_cartel_line` RIGHT JOIN capacity_cartel ON capacity_cartel.id=capacity_cartel_line.cartelId" +
                " LEFT JOIN capacity_parking ON capacity_parking.id=capacity_cartel_line.parkingId RIGHT JOIN sensor_info" +
                " ON sensor_info.id=capacity_cartel.sensorId INNER JOIN sensor_gateway_pkid ON sensor_gateway_pkid.sensor_id=capacity_cartel.sensorId " +
                "WHERE capacity_cartel_line.cartelId=" + element.cartelId + " AND " +
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
    let querySql = "SELECT sensor_gateway_pkid.mac_number, sensor_info.device_EUI FROM capacity_devices INNER JOIN sensor_info ON sensor_info.id = capacity_devices.sensorId INNER JOIN " +
        "sensor_gateway_pkid ON sensor_gateway_pkid.sensor_id=sensor_info.id INNER JOIN capacity_type_spot ON" +
        " capacity_type_spot.capacityDeviceId=capacity_devices.id WHERE capacity_devices.type='parking_individual'"
    console.log("querySql", querySql)

    let storedData = []
    query(querySql).then(rows => {
        rows.forEach(element => {
            storedData.push(element)
        });
        console.log(storedData)
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
function setCartelPlaces(gatewayMac, cartelDeviceEUI, pl1, pl2, pl3, pt1, pt2, pt3) {
    let setTopic = gatewayMac + "/application/4/device/" + cartelDeviceEUI + "/tx"
    let setMessage = "1B 08 " + intToHex(pl1) + " " + intToHex(pl2) + " " + intToHex(pl3) + " " + intToHex(pt1) + " " + intToHex(pt2) + " " + intToHex(pt3)
    console.log("setMessageNormal", setMessage)
    let setMessageBase64 = hexToBase64(setMessage)
    console.log("setMessageBase64", setMessageBase64)
    let messageReadyToSend = {
        confirmed: true,
        fPort: 4,
        data: setMessageBase64
    }
    console.log("FINAL preparedMESSAGE", JSON.stringify(messageReadyToSend))
    client.publish(setTopic, JSON.stringify(messageReadyToSend))
}
// Retrieves all parking id
async function getParkingIds() {
    return new Promise((resolve, reject) => {
        let getSpotDevices = "SELECT id FROM `capacity_parking`;"
        query(getSpotDevices).then(res => {
            console.log("getParkingIds", res)
            resolve(res)
        })
    })
}

async function getSensorRelatedParking(deviceEui) {
    return new Promise((resolve, reject) => {
        let getSpotDevices = "SELECT capacity_type_spot.parkingId FROM `sensor_info` INNER JOIN capacity_devices ON capacity_devices.sensorId=sensor_info.id " +
            "INNER JOIN `capacity_type_spot` ON capacity_type_spot.capacityDeviceId = capacity_devices.id WHERE sensor_info.device_EUI = '" + deviceEui + "';"
        query(getSpotDevices).then(res => {
            //console.log("getSensorRelatedParking", res)
            if (res.length > 0) {
                resolve(res[0].parkingId)
            }
            reject(false)
        })
    })
}

// Refresh parking capacity on all related cartels
async function refreshRealCartelCapacity(parkingId) {
    let cartelDeviceEUIandLinesArray = await getParkingCartelDeviceEuiAndLines(parkingId)
        //console.log("cartelDeviceEUIandLinesArray", cartelDeviceEUIandLinesArray)
    cartelDeviceEUIandLinesArray.forEach((element, index) => {
        PL1 = 0, PL2 = 0, PL3 = 0, PT1 = 0, PT2 = 0, PT3 = 0
        if (element[0].parkingId != null) {
            PL1 = element[0].currentCapacity
            PT1 = element[0].maxCapacity
        }
        if (element[1].parkingId != null) {
            PL2 = element[1].currentCapacity
            PT2 = element[1].maxCapacity
        }
        if (element[2].parkingId != null) {
            PL3 = element[2].currentCapacity
            PT3 = element[2].maxCapacity
        }
        setCartelPlaces(cartelDeviceEUIandLinesArray[index][0].mac_number, cartelDeviceEUIandLinesArray[index][0].cartelDeviceEUI, PL1, PL2, PL3, PT1, PT2, PT3)
    })
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

// Increases related spot device parking current capacity
function increaseCurrentParkingPlaces(spotDeviceEUI) {
    return new Promise((resolve, reject) => {

        let getParkingId = "SELECT capacity_type_spot.parkingId FROM `sensor_info` INNER JOIN capacity_devices ON capacity_devices.sensorId=sensor_info.id " +
            "INNER JOIN capacity_type_spot ON capacity_type_spot.capacityDeviceId=capacity_devices.id WHERE " +
            "sensor_info.device_EUI='" + spotDeviceEUI + "' AND capacity_devices.type='parking_individual';"
        console.log("increaseCurrentParkingPlaces", getParkingId)
        query(getParkingId).then(res => {
            console.log("res", res)
            let parkingId = res[0].parkingId
            let updateParkingCapacity = "UPDATE capacity_parking SET currentCapacity = currentCapacity + 1 WHERE id = " + parkingId
            query(updateParkingCapacity).then(putRes => {
                if (putRes.affectedRows > 0) {
                    resolve(true)
                } else {
                    reject(false)
                }
            })
        })
    })
}

// Decreases related spot device parking current capacity
function decreaseCurrentParkingPlaces(spotDeviceEUI) {
    let getParkingId = "SELECT capacity_type_spot.parkingId FROM `sensor_info` INNER JOIN capacity_devices ON capacity_devices.sensorId=sensor_info.id " +
        "INNER JOIN capacity_type_spot ON capacity_type_spot.capacityDeviceId=capacity_devices.id WHERE " +
        "sensor_info.device_EUI='" + spotDeviceEUI + "' AND capacity_devices.type='parking_individual';"
    console.log("increaseCurrentParkingPlaces", getParkingId)

    query(getParkingId).then(res => {
        console.log("res", res)
        let parkingId = res[0].parkingId
        let updateParkingCapacity = "UPDATE capacity_parking SET currentCapacity = currentCapacity - 1 WHERE id = " + parkingId
        query(updateParkingCapacity).then(putRes => {

            if (putRes.affectedRows > 0) {
                if (putRes.affectedRows > 0) {
                    resolve(true)
                } else {
                    reject(false)
                }
            }
        })
    })
}

// Falta saber que topic y mensaje utilizan los dispositivos de parking spot
client.on('message', async function(topic, message) {
        if (topic != undefined) {
            console.log(topic, "topic")
            let splitedTopic = topic.split("/")

            if (topic == "reset/capacity/spot") {
                subscribeGateways()
            } else if (splitedTopic[1] == "application" && splitedTopic[2] == "2" && splitedTopic[3] == "device" && splitedTopic[5] == "rx") {
                let deviceEUI = splitedTopic[4]
                let gatewayMac = splitedTopic[0]
                let messageFormated = JSON.parse(message.toString())
                    //console.log("message", messageFormated)
                if (messageFormated.object.DecodeDataString != "PING" && messageFormated.fPort == 3) {
                    let decodeResult = decodeMessageLibelium(messageFormated.object.DecodeDataHex)
                        //console.log("decodeResult", decodeResult)
                    let dbUpdateStatus = false
                    if (decodeResult) {
                        dbUpdateStatus = increaseCurrentParkingPlaces(deviceEUI)
                    } else {
                        dbUpdateStatus = decreaseCurrentParkingPlaces(deviceEUI)
                    }
                    if (dbUpdateStatus) {
                        let parkingId = await getSensorRelatedParking(deviceEUI)
                        console.log("parkingId", parkingId)
                        if (!isNaN(parkingId)) {
                            refreshRealCartelCapacity(parkingId)
                        }
                    }
                }
            }
        }
    })
    /*

    let insertSql = ""
    for (i = 8854; i < 8900; i++) {
        insertSql += "INSERT INTO `sensor_gateway_pkid` (`mac_number`, `sensor_id`, `pk_id`) VALUES ('dca63214b212', " + i + ", NULL);"

    }*/