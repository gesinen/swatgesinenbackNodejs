import { query } from "express";
import db from "../../database";

export default class LoraDashboardController {

    public async getNetworkServerGeneralInformation( userId: number ) {

        /* var query = "SELECT COUNT(s.id) AS network_servers, s.user_id, s.id, COUNT(sn.id) AS sensors, u.user_name FROM servers AS s INNER JOIN sensor_server_detail AS ssd ON s.id = ssd.server_id INNER JOIN sensor_info AS sn ON ssd.sensor_id = sn.id INNER JOIN users AS u ON u.id = s.user_id WHERE s.user_id = " + userId + " OR u.under_admin = " + userId; */

        /* var query = "SELECT COUNT(s.id) AS network_servers, (SELECT COUNT( ssd.server_id) FROM sensor_server_detail AS ssd WHERE ssd.server_id = s.id) AS sensors, u.first_name AS user_name FROM servers s LEFT JOIN users AS u ON u.id = s.user_id WHERE s.user_id = "+ userId +" OR u.under_admin = " + userId; */

        /* var query = "SELECT COUNT(s.id) AS network_servers, (SELECT COUNT( si.id) FROM sensor_info AS si WHERE si.user_id = "+ userId +") AS sensors, u.first_name AS user_name FROM servers s LEFT JOIN users AS u ON u.id = s.user_id WHERE s.user_id = "+ userId +" OR u.under_admin = " + userId;  */

        var query_servers = "SELECT server_id, id FROM gateways WHERE user_id = " + userId; 

        return new Promise((resolve, reject) => {
            
            db.getConnection((error:any, conn:any) => {
                
                if (error) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: error
                    })
                }

                conn.query( query_servers, (err: any, results: any) => {

                    if (err) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: err
                        })
                    }

                    let gateway_id = results[0].id;
                    let server_id_raw = results[0].server_id;
                    let server_ids = server_id_raw.split(',');

                    var query2 = "SELECT s.name AS network_servers, (SELECT COUNT( si.id) FROM sensor_info AS si WHERE si.user_id = "+ userId +") AS sensors, u.first_name AS user_name FROM servers s LEFT JOIN users AS u ON u.id = s.user_id WHERE s.id = "; 
                    
                    let servers_query = "";

                    for (let i = 0; i < server_ids.length; i++) {
                        const element = server_ids[i];
                        if(i == 0) {
                            servers_query += "" + element + "";
                        } else {
                            servers_query += " OR s.id = " + element + ""
                        }
                    }

                    if(servers_query.length <= 0) {
                        query2 += 0;
                    } else {
                        query2 += servers_query
                    }
                    
                    conn.query( query2, (err2: any, results2: any) => {
                        conn.release();
    
                        if (err2) {
                            reject({
                                http: 401,
                                status: 'Failed',
                                error: err2
                            })
                        }

                        let obj = {
                            network_servers: new Array(),
                            sensors: results2[0].sensors,
                            user_name: results2[0].user_name
                        }

                        for (let i = 0; i < results2.length; i++) {
                            const element = results2[i];
                            obj.network_servers.push(element.network_servers)
                        }

                        resolve({
                            http: 200,
                            status: 'Success',
                            result: obj
                        })
                    })
                })
            })
        })
    } // ()

    public async getNetworkServerSensorStatus( userId: number ) {

        var query = "SELECT si.device_EUI, sp.status FROM sensor_ping AS sp INNER JOIN sensor_info AS si ON sp.device_EUI = si.device_EUI WHERE si.user_id = " + userId;

        return new Promise((resolve, reject) => {
            
            db.getConnection((error:any, conn:any) => {
                
                if (error) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: error
                    })
                }

                conn.query( query, (err: any, results: any) => {
                    conn.release();

                    if (err) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: err
                        })
                    }

                    let activeSensors: any = [];
                    let desactiveSensors: any = [];

                    results.forEach((element:any) => {
                        if (element.status == 'Active') {
                            activeSensors.push(element)
                        } else {
                            desactiveSensors.push(element)
                        }
                    });

                    resolve({
                        http: 200,
                        status: 'Success',
                        result: {
                            active_sensors: activeSensors,
                            desactive_sensors: desactiveSensors
                        }
                    })
                })
            })
        })
    } // ()

    public async getNetworkServerSensorSignal( userId: number ) {

        var query = "SELECT id, rssi FROM sensor_info WHERE user_id = " + userId;

        return new Promise((resolve, reject) => {
            
            db.getConnection((error:any, conn:any) => {
                
                if (error) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: error
                    })
                }

                conn.query( query, (err: any, results: any) => {
                    conn.release();

                    if (err) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: err
                        })
                    }

                    let resp = {
                        spreading_factor: {
                            DR5: 0,
                            DR4: 0,
                            DR3: 0,
                            DR2: 0,
                            DR1: 0,
                            DR0: 0,
                            NC: 0
                        },
                        rssi: {
                            excellent: 0,
                            very_good: 0,
                            good: 0,
                            low: 0,
                            very_low: 0,
                            no_signal: 0 
                        }
                    }

                    results.forEach((element:any) => {
                        // Spreading factor
                        if (element.dr >= 10) {
                            resp.spreading_factor.DR5++
                        } else if (element.dr >= 8) {
                            resp.spreading_factor.DR4++
                        } else if (element.dr >= 6) {
                            resp.spreading_factor.DR3++
                        } else if (element.dr >= 4) {
                            resp.spreading_factor.DR2++
                        } else if (element.dr >= 2) {
                            resp.spreading_factor.DR1++
                        } else if (element.dr >= 0) {
                            resp.spreading_factor.DR0++
                        } else {
                            resp.spreading_factor.NC++;
                        }

                        // RSSI
                        if (element.rssi >= -50) {
                            resp.rssi.excellent++
                        } else if (element.rssi >= -60) {
                            resp.rssi.very_good++
                        } else if (element.rssi >= -70) {
                            resp.rssi.good++
                        } else if (element.rssi >= -80) {
                            resp.rssi.low++
                        } else if (element.rssi >= -90) {
                            resp.rssi.very_low++
                        } else {
                            resp.rssi.no_signal++;
                        }
                    });

                    resolve({
                        http: 200,
                        status: 'Success',
                        result: resp
                    })
                })
            })
        })
    } // ()
    
    public async getNetworkServerPackages( userId:number ) {
        var query = "SELECT id, name, lost_fCnt, first_frame_counter_fCnt, latest_frame_counter_fCnt FROM sensor_info WHERE user_id = " + userId;
        
        return new Promise((resolve, reject) => {
            
            db.getConnection((error:any, conn:any) => {
                
                if (error) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: error
                    })
                }

                conn.query( query, (err: any, results: any) => {
                    conn.release();

                    if (err) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: err
                        })
                    }

                    resolve({
                        http: 200,
                        status: 'Success',
                        result: results
                    })
                })
            })
        })
    } // ()
}