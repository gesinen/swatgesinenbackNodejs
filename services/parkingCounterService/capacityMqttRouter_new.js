/**
 * Name: MeasureMqttRouter.ts
 * Date: 04 - 11 - 2021
 * Author: Alejandro Losa García
 * Description: Manages the MQTT interactions of the measure feature
 */

const mqtt = require('mqtt')
const request = require('request');
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
    let sqlGetCurrentCapacity = "SELECT capacity_parking.currentCapacity, capacity_parking.maxCapacity, capacity_parking.id as parkingId FROM `sensor_info` INNER JOIN capacity_devices ON " +
        "capacity_devices.sensorId=sensor_info.id INNER JOIN capacity_type_ribbon ON " +
        "capacity_type_ribbon.capacityDeviceId=capacity_devices.id INNER JOIN capacity_parking ON" +
        " capacity_parking.id=capacity_type_ribbon.parkingId WHERE sensor_info.device_EUI = '" + deviceEui + "';"
    let res = await query(sqlGetCurrentCapacity)
    console.log("res", res)
    return {
        currentCapacity: res[0].currentCapacity,
        maxCapacity: res[0].maxCapacity,
        parkingId: res[0].parkingId
    }
}

async function getParkingCartelDeviceEuiAndLines(parkingId) {
    let sqlGetParkingCartelsIds = "SELECT capacity_cartel_line.cartelId FROM capacity_cartel " +
        "LEFT JOIN capacity_cartel_line ON capacity_cartel.id=capacity_cartel_line.cartelId LEFT JOIN sensor_info ON " +
        "sensor_info.id=capacity_cartel.sensorId WHERE capacity_cartel_line.parkingId=" + parkingId + ";";
    //console.log(sqlGetParkingCartelsIds)
    let res = await query(sqlGetParkingCartelsIds)
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
        let res = await query(sqlGetParkingCartelDeviceEuiAndLines)
            //console.log("getParkingCartelDeviceEuiAndLines", res)
        resArray.push(res)
    }
    return resArray
}

async function getCapacityServiceInfo() {
    return new Promise(function(resolve, reject) {
        var options = {
            'method': 'GET',
            'url': 'http://localhost:8080/v2/capacity/devices/service/info',
            'headers': {
                'Content-Type': 'application/json'
            }

        };
        request(options, function(error, response) {
            if (error) throw new Error(error);
            //console.log("getBoilerServiceInfo", response.body);
            let jsonRes = JSON.parse(response.body)
            console.log("getCapacityServiceInfo", jsonRes)
            resolve(jsonRes.response)
        });
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

function fromHexToBase64(hexString) {
    let res = btoa(hexString)
        //console.log("fromHexToBase64 FN()", res)
    return res
}

function hexToBase64(str) {
    //console.log("hexToBase64", btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))))
    return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
}
// Setting a new value to a counter
function setCurrentCounter(dev, num) {
    const getwayMAC = dev.mac_number;
    const applicationId = 2;
    const deviceEUI = dev.device_EUI;
    const fPort = 4;

    const pre = 'A0'
    const data = pre + ' ' + newMsgFormatter(num)
        //const data64 = this.hexToBase64(data) + '==';
    const data64 = hexToBase64(data);

    const topic = getwayMAC + "/application/" + applicationId + "/device/" + deviceEUI + "/tx";
    let msg = JSON.stringify({
        confirmed: true,
        fPort: fPort,
        data: data64
    });

    console.log('DATA', data)
    console.log('TOPIC', topic)
    console.log('MSG', msg)

    //const topic_ = 'b827ebdac54c/application/2/device/181f3c71bff07000/tx'

    this._mqttService.publish(topic, msg, { qos: 1 }).subscribe(res => {
        console.log('ack', res);
    });
}

function intToHex(number) {
    return number.toString(16);
}

function hexToInt(hexString) {
    return parseInt(hexString, 16);
}

function calculateCapacityIncOrDec(message) {
    console.log("messageINSIDE", message);
    let msgSplited = message.split(",")
    let entrada = hexToInt(msgSplited[1])
    let salida = hexToInt(msgSplited[2])
    let bidir1 = hexToInt(msgSplited[3])
    let bidir2 = hexToInt(msgSplited[4])

    if (entrada < 0) {
        entrada = 0
    }
    if (salida < 0) {
        salida = 0
    }
    if (bidir1 < 0) {
        bidir1 = 0
    }
    if (bidir2 < 0) {
        bidir2 = 0
    }
    return parseInt(entrada - salida + bidir1 - bidir2)
}

async function saveMessageLog(messageHex, frameCounter, capacityDeviceEUI, parkingId, currentCapacity, maxCapacity) {
    let msgSplited = messageHex.split(",")
    let entrada = hexToInt(msgSplited[1])
    let salida = hexToInt(msgSplited[2])
    let bidir1 = hexToInt(msgSplited[3])
    let bidir2 = hexToInt(msgSplited[4])

    if (entrada < 0) {
        entrada = 0
    }
    if (salida < 0) {
        salida = 0
    }
    if (bidir1 < 0) {
        bidir1 = 0
    }
    if (bidir2 < 0) {
        bidir2 = 0
    }
    const actualCurrentCapacity = currentCapacity + parseInt(entrada - salida + bidir1 - bidir2)
    messageInt = entrada + " " + salida + " " + bidir1 + " " + bidir2

    sqlInsertLogOnTable = "INSERT INTO `capacity_devices_log` (`messageHex`, `frameCounter`,`messageInt`, `capacityDeviceEUI`, `parkingId`, `currentCapacity`, `maxCapacity`) VALUES " +
        "('" + messageHex + "', " + frameCounter + ", '" + messageInt + "', '" + capacityDeviceEUI + "', " + parkingId + ", " + actualCurrentCapacity + ", " + maxCapacity + ");"

    console.log("sqlInsertLogOnTable", sqlInsertLogOnTable);

    query(sqlInsertLogOnTable).then(res => {
        console.log(res)
    })
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
async function filterMqttMessage(deviceEUI) {
    return new Promise(async(resolve, reject) => {
        let currentCapacity
        for (const element of storedData) {
            if (element.device_EUI.localeCompare(deviceEUI) == 0) {
                //console.log("gatewayMac", gatewayMac)
                //console.log("topic deviceEUI", deviceEUI)
                //console.log("message", messageFormated)
                currentCapacity = await getCurrentCapacityAndParkingId(deviceEUI)
                    //console.log("currentCapacity", currentCapacity)
                    //let updateSql = "UPDATE capacity_parking SET `currentCapacity`=" + currentCapacity + " WHERE id=" + element.parkingId + ";"
            }
        }
        resolve(currentCapacity)
    })
}

/* capacity_devices - INNER -> sensor_info - INNER -> sensor_gateway_pkid - INNER -> capacity_type_ribbon - INNER -> capacity_parking
   obtengo (parkingId), (currentCapacity), (maxCapacity), (capacityDeviceId), (sensor_device_EUI), (gateway_mac_number)
*/

function sendToSentilo(parkingSensorName, provider, authToken, value) {
    let date = new Date(Date.now())
    let dateDayMonthYear = date.toLocaleDateString().split("/")
    let timeHhMmSs = date.toTimeString().split(' ')[0]
    let timestamp = dateDayMonthYear[1] + "/" + dateDayMonthYear[0] + "/" + dateDayMonthYear[2] + "T" + timeHhMmSs

    console.log("dateDayMonthYear", dateDayMonthYear)
    console.log("date.toTimeString().split(' ')", date.toTimeString().split(' '))
    var request = require('request');
    var options = {
        'method': 'PUT',
        'url': 'https://connecta.dival.es/sentilo-api/data/' + provider,
        'headers': {
            'IDENTITY_KEY': authToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "sensors": [{
                "sensor": parkingSensorName + "S01",
                "observations": [{
                    "value": value,
                    "timestamp": timestamp
                }]
            }]
        })

    };
    console.log("PUT SENTILO REQUEST", options)
    request(options, function(error, response) {
        if (error) {
            console.log("error", error);
            throw new Error(error);
        }
        console.log("SENTILO PUT RESPONSE", response.body);
    });
}

async function getUsernameByParking(parkingId) {
    let sqlGetCurrentCapacity = "SELECT email AS username FROM users INNER JOIN capacity_parking ON users.id = capacity_parking.userId WHERE capacity_parking.id = " + parkingId + ";"
    let res = await query(sqlGetCurrentCapacity)
    console.log("res", res)
    return {
        username: res[0].username
    }
}


async function main() {
    // Obtengo los topics de mqtt de todos los sensores para subscribirme tras la conexion satisfactoria a mqtt
    let capacityServiceInfo = await getCapacityServiceInfo()

    const client = mqtt.connect('mqtts://gesinen.es:8882', options)

    client.on('connect', function() {
        console.log('Connected')
        capacityServiceInfo.forEach(topic => {
            client.subscribe(topic, function(err) {
                if (!err) {
                    console.log("subscrito a " + topic)
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
        if (topic != undefined) {
            console.log(topic, "topic")
            let splitedTopic = topic.split("/")
            if (splitedTopic[1] == "application" && splitedTopic[2] == "2" && splitedTopic[3] == "device" && splitedTopic[5] == "rx") {
                let deviceEUI = splitedTopic[4]
                    //console.log("deviceEUI", deviceEUI)
                let gatewayMac = splitedTopic[0]
                    //console.log("gatewayMac", gatewayMac)
                    // message is Buffer
                let messageFormated = JSON.parse(message.toString())
                console.log("message", messageFormated)
                if (messageFormated.object.DecodeDataString != "PING" && messageFormated.fPort == 1) {


                    let currentCapacityFromMsg = calculateCapacityIncOrDec(messageFormated.object.DecodeDataHex)
                    console.log("currentCapacityFromMsg", currentCapacityFromMsg)

                    // Obtengo cual parking esta asociado a este sensor
                    let currentCapacityAndParkingId = await getCurrentCapacityAndParkingId(deviceEUI)

                    await saveMessageLog(messageFormated.object.DecodeDataHex, messageFormated.fCnt, deviceEUI, currentCapacityAndParkingId.parkingId,
                        currentCapacityAndParkingId.currentCapacity, currentCapacityAndParkingId.maxCapacity)

                    console.log('el mensaje ha sido guardado')

                    /*
                     Obtengo el cartel asociado a este parking y cada una de sus lineas (este cartel por ejemplo tiene 2 lineas)
                     parkingId -> getParkingCartelDeviceEuiAndLines() -> [ cartelDeviceEUI , lineNum ]
                     */
                    let cartelDeviceEUIandLinesArray = await getParkingCartelDeviceEuiAndLines(currentCapacityAndParkingId.parkingId)
                    let username = await getUsernameByParking(currentCapacityAndParkingId.parkingId);
                    username = username.username;
                    let messageWindow;

                    console.log('username', username)

                    if(username.includes('montserrat')) messageWindow = "06"
                    else if(username.includes('xirivella')) messageWindow = "01"
                    else messageWindow = "00"

                    console.log('messageWindow', messageWindow)

                    console.log("cartelDeviceEUIandLinesArray", cartelDeviceEUIandLinesArray)
                    for (const element of cartelDeviceEUIandLinesArray) {
                        const index = cartelDeviceEUIandLinesArray.indexOf(element);
                        console.log("element", element)
                        let setTopic = gatewayMac + "/application/2/device/" + cartelDeviceEUIandLinesArray[index][0].cartelDeviceEUI + "/tx"
                            // mensaje 1B 06 p1 p1m p2 p2m
                        if (element[0].parkingId != null && element[1].parkingId != null) {

                            // Checkeo que linea ha cambiado comprobando si el dispositivo que esta mandando corresponde a la linea 1 o 2
                            if (element[0].parkingId == currentCapacityAndParkingId.parkingId) {
                                //console.log("elem", elem)
                                console.log("parseInt(elem.currentCapacity)", parseInt(element[0].currentCapacity))
                                let capacityCalculated = parseInt(element[0].currentCapacity) + parseInt(currentCapacityFromMsg)
                                let capacityFreeSpaces = parseInt(element[0].maxCapacity) - parseInt(capacityCalculated)
                                let capacityFreeSpacesOther = parseInt(element[1].maxCapacity) - parseInt(element[1].currentCapacity)
                                if (capacityFreeSpaces < 0) {
                                    capacityFreeSpaces = 0
                                }
                                if (capacityFreeSpaces > parseInt(element[0].maxCapacity)) {
                                    capacityFreeSpaces = parseInt(element[0].maxCapacity)
                                }
                                if (capacityFreeSpacesOther < 0) {
                                    capacityFreeSpacesOther = 0
                                }
                                if (capacityFreeSpacesOther > parseInt(element[1].maxCapacity)) {
                                    capacityFreeSpacesOther = parseInt(element[1].maxCapacity)
                                }
                                console.log("capacityCalculated", capacityCalculated)
                                console.log("capacityFreeSpaces", capacityFreeSpaces)
                                console.log("capacityFreeSpacesOther", capacityFreeSpacesOther)

                                let setMessageHex = "1B " + messageWindow + " " + intToHex(capacityFreeSpaces) + " 0 " + intToHex(capacityFreeSpacesOther) + " 0"
                                //let setMessageHex = "1B 01 " + intToHex(capacityFreeSpaces) + " 0 0 0"
                                let setMessage = hexToBase64(setMessageHex)
                                let sqlQueryUpdateParkingCapacity = "UPDATE capacity_parking SET `currentCapacity`=" +
                                    capacityCalculated + " WHERE id=" + cartelDeviceEUIandLinesArray[index][0].parkingId + ";"

                                //let setMessage = "0x1b 0x02 " + cartelDeviceEUIandLinesArray[index][0].currentCapacity.toString(16) + " p1m " + cartelDeviceEUIandLinesArray[index][1].currentCapacity + " p2m"
                                console.log("FINAL TOPIC", setTopic)
                                console.log("FINAL setMessageHEX", setMessageHex)
                                console.log("FINAL setMessageB64", setMessage)
                                console.log("sqlQueryUpdateParkingCapacity", sqlQueryUpdateParkingCapacity)

                                query(sqlQueryUpdateParkingCapacity).then(res => {
                                    console.log(res)
                                    if (res.changedRows == 1) {
                                        console.log("CAPACITY UPDATED ON PANEL -> " + cartelDeviceEUIandLinesArray[index][0].cartelDeviceEUI)
                                        let messageReadyToSend = {
                                            confirmed: true,
                                            fPort: 4,
                                            data: setMessage
                                        }
                                        console.log("FINAL preparedMESSAGE", JSON.stringify(messageReadyToSend))

                                        // Tras preparar el mensaje y obtener cuantas plazas quedan, envio el mensaje
                                        client.publish(setTopic, JSON.stringify(messageReadyToSend))
                                        console.log("MQTT MSG SEND SUCCESFULLY");
                                    } else {
                                        console.log("CAPACITY HASNT BEEN UPDATED ON PANEL -> " + cartelDeviceEUIandLinesArray[index][0].cartelDeviceEUI)
                                    }
                                })
                                sendToSentilo(element[0].parkingSensorName, element[0].provider, element[0].authToken, capacityFreeSpaces)

                            } else if (element[1].parkingId == currentCapacityAndParkingId.parkingId) {
                                console.log("parking0", element[0].parkingId)
                                console.log("parking1", element[1].parkingId)
                                console.log("currentCapacityAndParkingId", currentCapacityAndParkingId)
                                console.log("parseInt(elem.currentCapacity)", parseInt(element[0].currentCapacity))
                                let capacityCalculated = parseInt(element[1].currentCapacity) + parseInt(currentCapacityFromMsg)
                                let capacityFreeSpaces = parseInt(element[1].maxCapacity) - parseInt(capacityCalculated)
                                let capacityFreeSpacesOther = parseInt(element[0].maxCapacity) - parseInt(element[0].currentCapacity)
                                console.log("capacityCalculated", capacityCalculated)
                                console.log("capacityFreeSpaces", capacityCalculated)
                                console.log("capacityFreeSpacesOther", capacityFreeSpacesOther)
                                if (capacityFreeSpaces < 0) {
                                    capacityFreeSpaces = 0
                                }
                                if (capacityFreeSpaces > parseInt(element[1].maxCapacity)) {
                                    capacityFreeSpaces = parseInt(element[1].maxCapacity)
                                }
                                if (capacityFreeSpacesOther < 0) {
                                    capacityFreeSpacesOther = 0
                                }
                                if (capacityFreeSpacesOther > parseInt(element[0].maxCapacity)) {
                                    capacityFreeSpacesOther = parseInt(element[0].maxCapacity)
                                }
                                let setMessageHex = "1B " + messageWindow + " " + intToHex(capacityFreeSpacesOther) + " 0 " + intToHex(capacityFreeSpaces) + " 0"
                                let setMessage = hexToBase64(setMessageHex)
                                let sqlQueryUpdateParkingCapacity = "UPDATE capacity_parking SET `currentCapacity`=" +
                                    capacityCalculated + " WHERE id=" + element[1].parkingId + ";"

                                console.log("FINAL TOPIC", setTopic)
                                console.log("FINAL setMessageHEX", setMessageHex)
                                console.log("FINAL setMessageB64", setMessage)
                                console.log("sqlQueryUpdateParkingCapacity", sqlQueryUpdateParkingCapacity)

                                query(sqlQueryUpdateParkingCapacity).then(res => {
                                    console.log(res)
                                    if (res.changedRows == 1) {
                                        console.log("CAPACITY UPDATED ON PANEL -> " + cartelDeviceEUIandLinesArray[index][0].cartelDeviceEUI)
                                        let messageReadyToSend = {
                                            confirmed: true,
                                            fPort: 4,
                                            data: setMessage
                                        }
                                        console.log("FINAL preparedMESSAGE", JSON.stringify(messageReadyToSend))

                                        client.publish(setTopic, JSON.stringify(messageReadyToSend))
                                        console.log("MQTT MSG SEND SUCCESFULLY");
                                    } else {
                                        console.log("CAPACITY HASNT BEEN UPDATED ON PANEL -> " + cartelDeviceEUIandLinesArray[index][0].cartelDeviceEUI)
                                    }
                                })
                                sendToSentilo(element[1].parkingSensorName, element[1].provider, element[1].authToken, capacityFreeSpaces)
                            }

                        } else if (element[0].parkingId != null && element[1].parkingId == null) {
                            console.log("**** SOLO HAY 1 LINEA DE PARKING ****")
                            console.log("parseInt(elem.currentCapacity)", parseInt(element[0].currentCapacity))
                            let capacityCalculated = parseInt(element[0].currentCapacity) + parseInt(currentCapacityFromMsg)
                            let capacityFreeSpaces = parseInt(element[0].maxCapacity) - parseInt(capacityCalculated)
                            if (capacityFreeSpaces < 0) {
                                capacityFreeSpaces = 0
                            }
                            if (capacityFreeSpaces > parseInt(element[0].maxCapacity)) {
                                capacityFreeSpaces = parseInt(element[0].maxCapacity)
                            }

                            console.log("capacityCalculated", capacityCalculated)
                            console.log("capacityFreeSpaces", capacityFreeSpaces)

                            let setMessageHex;

                            if(username.includes('xirivella')){
                                const xirivellaSpot = await getXirivellaSpecialSpot(element[0].parkingId)
                                setMessageHex = "1B " + messageWindow + " " + intToHex(capacityFreeSpaces) + " " + xirivellaSpot.currentXirivellaSpot + " 0"
                            }
                            else setMessageHex = "1B " + messageWindow + " " + intToHex(capacityFreeSpaces) + " 0 0 0"
                            let setMessage = hexToBase64(setMessageHex)
                            let sqlQueryUpdateParkingCapacity = "UPDATE capacity_parking SET `currentCapacity`=" +
                                capacityCalculated + " WHERE id=" + cartelDeviceEUIandLinesArray[index][0].parkingId + ";"

                            //let setMessage = "0x1b 0x02 " + cartelDeviceEUIandLinesArray[index][0].currentCapacity.toString(16) + " p1m " + cartelDeviceEUIandLinesArray[index][1].currentCapacity + " p2m"
                            console.log("FINAL TOPIC", setTopic)
                            console.log("FINAL setMessageHEX", setMessageHex)
                            console.log("FINAL setMessageB64", setMessage)
                            console.log("sqlQueryUpdateParkingCapacity", sqlQueryUpdateParkingCapacity)

                            query(sqlQueryUpdateParkingCapacity).then(res => {
                                console.log(res)
                                if (res.changedRows == 1) {
                                    console.log("CAPACITY UPDATED ON PANEL -> " + cartelDeviceEUIandLinesArray[index][0].cartelDeviceEUI)
                                    let messageReadyToSend = {
                                        confirmed: true,
                                        fPort: 4,
                                        data: setMessage
                                    }
                                    console.log("FINAL preparedMESSAGE", JSON.stringify(messageReadyToSend))

                                    client.publish(setTopic, JSON.stringify(messageReadyToSend))
                                    console.log("MQTT MSG SEND SUCCESFULLY");
                                } else {
                                    console.log("CAPACITY HASNT BEEN UPDATED ON PANEL -> " + cartelDeviceEUIandLinesArray[index][0].cartelDeviceEUI)
                                }
                            })
                            sendToSentilo(element[0].parkingSensorName, element[0].provider, element[0].authToken, capacityFreeSpaces)

                        }
                    }
                }
                //console.log("cartelDeviceEUIandLines", cartelDeviceEUIandLinesArray)

                //client.end()
            }
        }
    })
}

async function getXirivellaSpecialSpot(parkingId){
    let sqlGetCurrentCapacity = "SELECT status FROM `capacity_type_spot` WHERE parkingId ="+ parkingId + ";"
    let res = await query(sqlGetCurrentCapacity)
    console.log("responseFromXirivellaCapacity", res)
    return {
        currentXirivellaSpot: res[0].status
    }
}

main()
