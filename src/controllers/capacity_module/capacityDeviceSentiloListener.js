const loop = require('node-async-loop');
const request = require('request');
const fs = require('fs');
const schedule = require('node-schedule');
const mysql = require('mysql');

// Database
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Al8987154St12',
    database: 'swat_gesinen'
});

// Asynchronous mysql query
async function query( sql ) {
 return new Promise(( resolve, reject ) => {
  
    db.getConnection(function(err, connection) {
     
    if (err) {
       reject( err )
     } else {
       connection.query(sql, ( err, rows) => {

         if ( err ) {
           reject( err )
         } else {
           resolve( rows )
         }
                    // finaliza la sesión
         connection.release()
       })
     }
   })
 })
}

// Cron job running each 5 minutes
schedule.scheduleJob('*/5 * * * * ', function() {

    // Getting the devices, sensors and servers of capacity module
    query("SELECT cd.id AS deviceId, cd.sensor_id AS sensorId, cd.name AS deviceName, cd.user_id AS userId, cd.type AS deviceType, s.name AS sensorName, s.device_eui AS deviceEUI, s.sensor_model_name AS sensorModelName, ssd.sensor_id AS ssdSensorId, serv.provider_id AS providerId, serv.authorization_token AS token, serv.server_url AS url FROM capacity_devices AS cd INNER JOIN sensor_info AS s ON cd.sensor_id = s.id INNER JOIN sensor_server_detail AS ssd ON s.id = ssd.sensor_id INNER JOIN servers AS serv ON ssd.server_id = serv.id").then(rows => {
            
        rows.forEach(element => {
                
            var sensorName = element.sensorName;
            var sensorId = element.sensorId;
            var userId = element.userId;
            var deviceEUI = element.deviceEUI;
            const deviceType = element.deviceType;
            const sensorModelName = element.sensorModelName;
            const model = sensorName.substring(6, 7);
            const tokn = "1cdc2871232506e3b8f19dc7926245feb52f32ada28dba6aaa327b73d288d468";

            var deviceId = element.deviceId;
            var deviceName = element.deviceName;

            var providerId = element.providerId;
            var auth = element.token;
            var url = element.url;

            var getURL = url + '/' +providerId + '/' + sensorModelName + 'S01'
            //var getURL = "https://connecta.dival.es/sentilo-api/data/oliva@cellnextelecom/ParkingSpotOLACTMC42S01"
            var options = {
                'method': `GET`,
                'url': getURL,
                'headers': {
                    'IDENTITY_KEY': auth,
                    //'IDENTITY_KEY': tokn,
                    'Content-Type': 'application/json'
                },
                rejectUnauthorized: false
            }

            request(options, function(error, response) {
                      
                if (error) {
                    throw new Error(error)
                }

                const res = JSON.parse(response.body);
                console.log(error)

                // If there are measurements
                if (res.observations[0]) {

                    const value = res.observations[0].value;

                    if(deviceType == 'parking_individual') { // Individual parking
                                
                        if (value == "OCUPADO") {
                            query("UPDATE capacity_devices SET capacity = 1, max_capacity = 1 WHERE id = " + deviceId)
                        } else {
                            query("UPDATE capacity_devices SET capacity = 0, max_capacity = 1 WHERE id = " + deviceId)
                        }

                    } else if (model == "A") { // Parking area
                                
                        // No esta definido

                    } else if (model == "T") { // Parking TOF

                        // No esta definido

                    }
                            
                }

            });

        });
                //conn.release();
    }) 
        //})
    //})
})