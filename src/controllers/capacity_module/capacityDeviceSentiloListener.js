const each = require('sync-each');
const loop = require('node-async-loop');
const schedule = require('node-schedule');
const db = require('../../database');

schedule.scheduleJob('*/10 * * * *', function() {

    console.log('Starting capacity module listener...')

    db.getConnection( function(err, conn) {
        
        // Checking database connection
        if(err) {
            console.log("There is an error: " + err)
        }


        // Getting the devices, sensors and servers of capacity module
        conn.query("SELECT cd.id AS deviceId, cd.sensor_id AS sensorId, cd.name AS deviceName, cd.user_id AS userId, s.name AS sensorName, s.device_eui AS deviceEUI, s.sensor_model_name AS sensorModelName, ssd.sensor_id AS ssdSensorId, serv.provider_id AS providerId, serv.authorization_token AS token, serv.server_url AS url FROM capacity_devices AS cd INNER JOIN sensor_info AS s ON cd.sensor_id = s.id INNER JOIN sensor_server_detail AS ssd ON s.id = ssd.sensor_id INNER JOIN servers AS serv ON ssd.server_id = serv.id", function (err, rows) {

        })
    })
})