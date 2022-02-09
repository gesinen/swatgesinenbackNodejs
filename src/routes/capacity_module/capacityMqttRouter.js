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
    clientId: '1951624853',
    username: 'gesinen',
    password: 'gesinen2110',
}
const loop = require('node-async-loop');
const request = require('request');
const fs = require('fs');
const schedule = require('node-schedule');
const mysql = require('mysql');

// Database
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
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
        //console.log("res", res[0].currentCapacity)
    return {
        currentCapacity: res[0].currentCapacity,
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
            "FROM `capacity_cartel_line` RIGHT JOIN capacity_cartel ON capacity_cartel.id=capacity_cartel_line.cartelId" +
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

async function filterMqttMessage(deviceEUI, messageFormated) {
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

let querySql = "SELECT capacity_parking.id as parkingId, capacity_parking.currentCapacity, capacity_parking.maxCapacity," +
    " capacity_devices.id, sensor_info.device_EUI, sensor_gateway_pkid.mac_number FROM capacity_devices " +
    " INNER JOIN sensor_info ON sensor_info.id = capacity_devices.sensorId INNER JOIN sensor_gateway_pkid" +
    " ON sensor_gateway_pkid.sensor_id=sensor_info.id INNER JOIN capacity_type_ribbon ON capacity_type_ribbon.capacityDeviceId" +
    "=capacity_devices.id INNER JOIN capacity_parking ON capacity_type_ribbon.parkingId=capacity_parking.id"

/*
 */
let storedData = []
query(querySql).then(rows => {


    rows.forEach(element => {
        storedData.push(element)
    });
    //conn.release();
    const client = mqtt.connect('mqtts://gesinen.es:8882', options)

    client.on('connect', function() {
        console.log('Connected')
        console.log(storedData)
        storedData.forEach(element => {
            client.subscribe(element.mac_number + '/#', function(err) {
                if (!err) {
                    client.publish('test', 'Hello mqtt')
                }
            })
        });

    })

    client.on('message', async function(topic, message) {
        console.log(topic, "topic")
            // message is Buffer
        let messageFormated = message.toString()
            //console.log("message", messageFormated)
        let deviceEUI
        let gatewayMac
        if (topic.split("/")) {
            deviceEUI = topic.split("/")[4]
                //console.log("deviceEUI", deviceEUI)
            gatewayMac = topic.split("/")[0]
        } //console.log("gatewayMac", gatewayMac)
        let currentCapacityAndParkingId = await filterMqttMessage(deviceEUI, messageFormated)
            //console.log("currentCapacityAndParkingId", currentCapacityAndParkingId)
        let cartelDeviceEUIandLinesArray = await getParkingCartelDeviceEuiAndLines(currentCapacityAndParkingId.parkingId)
        console.log("cartelDeviceEUIandLinesArray", cartelDeviceEUIandLinesArray)
        cartelDeviceEUIandLinesArray.forEach((element, index) => {
            let setTopic = gatewayMac + "/application/2/device/" + cartelDeviceEUIandLinesArray[index][0].cartelDeviceEUI + "/tx"
            let setMessage = "0x1b 0x06 " + cartelDeviceEUIandLinesArray[index][0].currentCapacity + " p1m " + cartelDeviceEUIandLinesArray[index][1].currentCapacity + " p2m"
            console.log("FINAL TOPIC", setTopic)
            console.log("FINAL setMessage", setMessage)
        });
        //console.log("cartelDeviceEUIandLines", cartelDeviceEUIandLinesArray)

        //client.end()
    })
})