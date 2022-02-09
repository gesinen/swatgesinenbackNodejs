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
            //console.log(storedData)
        storedData.forEach(element => {
            client.subscribe(element.mac_number + '/#', function(err) {
                if (!err) {
                    client.publish('test', 'Hello mqtt')
                }
            })
        });

    })

    client.on('message', function(topic, message) {
        console.log(topic, "topic")
            // message is Buffer
        let messageFormated = message.toString()
        console.log("message", messageFormated)

        let deviceEUI = topic.split("/")[4]
        console.log("deviceEUI", deviceEUI)

        storedData.forEach(element => {
            console.log("stored data elem.device_EUI", element.device_EUI)
            console.log("topic deviceEUI", deviceEUI)

            if (element.device_EUI.localeCompare(deviceEUI) == 0) {
                console.log("DE LOCOS")
                let updateSql = "UPDATE capacity_parking SET `currentCapacity`=" + currentCapacity + " WHERE id=" + element.parkingId + ";"
            }
        });
        client.end()
    })
})

//this.connect();


//this.suscribe("macGateway/#")



/**
 * Save a new measure 
 * GET postalcode/ambiental/1/#
 * 
 * Body: {
 *  "deviceEui": 1,
 *  "value": 10.32,
 *  "unit": "ppm"
 *  "type": "CO2"
 * }
 * 
 */
/*public syncDevice = () => {
    this.suscribe('deviceSync');

    // When a message arrives
    this.client.on("message", async (topic: any, message: any) => {
        if (topic == 'deviceSync') {

            this.publish("deviceSync/" + jsonData.device.deviceEui,
                '{\n\"SYNCHRONIZED\":\"' + jsonData.device.deviceEui + '\"\n}'
            )

        }
    });
}*/