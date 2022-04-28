/**
 * Name: MeasureMqttRouter.ts
 * Date: 01 - 04 - 2021
 * Author: Daniel Poquet Ramirez
 * Description: Manages the MQTT interactions of the irrigation feature
 */
/*
message = {
    applicationID: '2',
    applicationName: 'app',
    deviceName: 'a079e129d522e617',
    devEUI: 'a079e129d522e617',
    rxInfo: [{
        gatewayID: 'dca632fffe143f21',
        uplinkID: 'b5d8be1b-9968-4b5e-814e-a1e093c9f122',
        name: 'rak-gateway',
        rssi: -88,
        loRaSNR: 7.5,
        location: [Object]
    }],
    txInfo: { frequency: 868500000, dr: 5 },
    adr: true,
    fCnt: 107,
    fPort: 2,
    data: 'ZGQAyQAAAOgBAAD//wAA//8AADAFBgCSggiA/xZAACAFBgD//wAA//8AAA==',
    object: {
        DecodeDataHex: '0x64,0x64,0x00,0xc9,0x00,0x00,0x00,0xe8,0x01,0x00,0x00,0xff,0xff,0x00,0x00,0xff,0xff,0x00,0x00,0x30,0x05,0x06,0x00,0x92,0x82,0x08,0x80,0xff,0x16,0x40,0x00,0x20,0x05,0x06,0x00,0xff,0xff,0x00,0x00,0xff,0xff,0x00,0x00',
        DecodeDataString: 'dd\x00É\x00\x00\x00è\x01\x00\x00ÿÿ\x00\x00ÿÿ\x00\x000\x05\x06\x00\x92\x82\b\x80ÿ\x16@\x00 \x05\x06\x00ÿÿ\x00\x00ÿÿ\x00\x00'
    }
}
console.log("message", message)
let cabecera = message.object.DecodeDataHex.substring(0, 9)
console.log("cabecera", cabecera)
let inputIndex = message.object.DecodeDataHex.substring(10, 14)
console.log("inputIndex", inputIndex)
let temperatura = message.object.DecodeDataHex.substring(15, 34)
console.log("temperatura", calculateHexSensorValue(temperatura))
let humedad = message.object.DecodeDataHex.substring(35, 54)
console.log("humedad", calculateHexSensorValue(humedad))
*/
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
const options = {
    // Clean session
    clean: true,
    connectTimeout: 4000,
    // Auth
    clientId: '45678985637',
    username: 'gesinen',
    password: 'gesinen2110',
}

const mysql = require('mysql');

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

function hexToIntStr(hexString) {
    return parseInt(hexString, 16).toString();
}
let querySql = `SELECT irrigation_device.id as irrigation_device_id, sensor_gateway_pkid.mac_number as device_gateway, sensor_info.device_EUI as irrigation_deviceEUI FROM irrigation_device INNER JOIN 
sensor_info ON sensor_info.id=irrigation_device.sensorId INNER JOIN sensor_gateway_pkid ON sensor_gateway_pkid.sensor_id=irrigation_device.sensorId`

let storedData = []
let deviceEUI_fk_irrigationDevEUI = []
query(querySql).then(rows => {


    rows.forEach(element => {
        storedData.push({
            device_gateway: element.device_gateway,
            irrigation_deviceEUI: element.irrigation_deviceEUI
        })
        deviceEUI_fk_irrigationDevEUI[element.irrigation_deviceEUI] = element.irrigation_device_id
    });
    //conn.release();
    const client = mqtt.connect('mqtts://gesinen.es:8882', options)

    client.on('connect', function() {
        console.log('Connected')
        console.log("storedData", storedData)
        console.log("deviceEUI_fk_irrigationDevEUI", deviceEUI_fk_irrigationDevEUI)

        storedData.forEach(element => {
            // Me subscribo a todos los gateways
            client.subscribe(element.device_gateway + '/application/2/device/' + element.irrigation_deviceEUI + '/rx', function(err) {
                if (!err) {
                    console.log("subscrito a " + element.device_gateway + '/application/2/device/' + element.irrigation_deviceEUI + '/rx')
                } else {
                    console.log(err)
                }
            })
        });

    })
    client.on('disconnect', function(err) {
        console.log("disconnect", err);
    })

    client.on('error', function(err) {
        console.log("error", err);
    })

    client.on('message', async function(topic, message) {
        console.log("topic", topic)
        console.log("message", JSON.parse(message.toString()))

        let messageJSON = JSON.parse(message.toString())
        if (topic != undefined && messageJSON.object.DecodeDataHex.substring(0, 9) == "0x64,0x64" && messageJSON.object.DecodeDataHex.split(",").length > 5) {
            console.log("message", messageJSON)
            let cabecera = messageJSON.object.DecodeDataHex.substring(0, 9)
            console.log("cabecera", cabecera)
                // Le sumo uno porque en firmware comienzan en el sensor 0 y en la plataforma ese es el 1
            let inputIndex = parseInt(hexToIntStr(messageJSON.object.DecodeDataHex.substring(10, 14))) + 1
            console.log("inputIndex", inputIndex)
            let temperatura = calculateHexSensorValue(messageJSON.object.DecodeDataHex.substring(15, 34))
            console.log("temperatura", temperatura)
            let humedad = calculateHexSensorValue(messageJSON.object.DecodeDataHex.substring(35, 54))
            console.log("humedad", humedad)
            let topicSplit = topic.split("/")
            let irrigationDeviceId = deviceEUI_fk_irrigationDevEUI[topicSplit[4]]
                // Obtengo el irrigation_device_input.id del sensor de suelo dado el sensorIndex y el irrigationDeviceId
            let queryGetIrrigationInputId = "SELECT id FROM irrigation_device_input WHERE irrigationDeviceId=" + irrigationDeviceId + " AND sensorIndex=" + inputIndex
            console.log("selectQuery", queryGetIrrigationInputId)
            let date = new Date(Date.now())
            date.setHours(date.getHours() + 2);
            let dateStr = date.toISOString().split("T")[0] + date.toISOString().split("T")[1]
            query(queryGetIrrigationInputId).then(rows => {
                    console.log("rows", rows)
                    let irrigationInputDeviceId = rows[0].id
                        // Falta configurar la hora del servidor
                    let queryAddSensorValues = "INSERT INTO irrigation_device_input_history (`irrigationDeviceInputId`, `humidity`, `temperature`, `timestamp`)" +
                        " VALUES (" + irrigationInputDeviceId + "," + humedad + "," + temperatura + "," + dateStr + ");"
                    console.log("queryAddSensorValues", queryAddSensorValues)

                    query(queryAddSensorValues).then(rowsAdd => {
                        console.log(rowsAdd)
                    })
                })
                // }
        }
    })
})