import conn from "../../database";
import db from "../../database";
import { Utils } from "../../utils/Utils";
import capacityCartelLineController from './capacityCartelLine';


/*
 * /capacity/devices
 */
class CapacityCartelDevicesController {

    public async getCapacityCartelList(userId: number, pageSize: number, pageIndex: number): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                const first_value = (pageSize * pageIndex) - pageSize;

                var query = "SELECT capacity_cartel.*, sensor_info.device_EUI, sensor_info.name as sensorName, sensor_gateway_pkid.mac_number FROM capacity_cartel " +
                    " LEFT JOIN sensor_info ON sensor_info.id = capacity_cartel.sensorId LEFT JOIN sensor_gateway_pkid ON" +
                    " sensor_gateway_pkid.sensor_id=sensor_info.id WHERE userId = " + userId +
                    " ORDER BY capacity_cartel.id DESC LIMIT " + first_value + ', ' + pageSize + ";"


                db.getConnection((err: any, conn: any) => {
                    if (err) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: err
                        })
                    }

                    conn.query(query, (error: any, results: any) => {
                        conn.release()

                        if (error) {
                            reject({
                                http: 401,
                                status: 'Failed',
                                error: error
                            })
                        }
                        if (results) {
                            resolve({
                                http: 200,
                                status: 'Success',
                                capacity_devices: results
                            })
                        } else {
                            reject({
                                http: 401,
                                status: 'Failed',
                                error: error
                            })
                        }

                    })
                })
            } catch (error) {
                reject({
                    http: 401,
                    status: 'Failed',
                    error: error
                })
            }
        })
    }

    public async getAllCartels(): Promise<any> {
        return new Promise((resolve, reject) => {
            var query = "SELECT * FROM capacity_cartel";

            db.getConnection((err: any, conn: any) => {
                if (err) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: err
                    })
                }

                conn.query(query, (error: any, results: any) => {
                    conn.release()

                    if (error) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: error
                        })
                    }
                    if (results) {
                        resolve({
                            http: 200,
                            status: 'Success',
                            result: results
                        })
                    } else {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: error
                        })
                    }

                })
            })
        })
    }

    public async getCartelById(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            var query = "SELECT * FROM capacity_cartel WHERE id=" + id;

            db.getConnection((err: any, conn: any) => {
                if (err) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: err
                    })
                }

                conn.query(query, async (error: any, results: any) => {
                    conn.release()

                    if (error) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: error
                        })
                    }
                    let cartelLines: any = await capacityCartelLineController.getCartelLines(results[0].id).catch(err => {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: err
                        })
                    })
                    results[0].cartelLines = cartelLines.result
                    resolve({
                        http: 200,
                        status: 'Success',
                        result: results
                    })
                })
            })
        })
    }

    public async getCartelsWithFreeLines(): Promise<any> {
        return new Promise((resolve, reject) => {
            var query = "SELECT capacity_cartel.*, COUNT(*) as cartelFreeLines FROM capacity_cartel INNER JOIN capacity_cartel_line ON capacity_cartel.id=capacity_cartel_line.cartelId WHERE capacity_cartel_line.parkingId IS NULL GROUP BY capacity_cartel.id";

            db.getConnection((err: any, conn: any) => {
                if (err) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: err
                    })
                }

                conn.query(query, (error: any, results: any) => {
                    conn.release();

                    if (error) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: error
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
    }

    /**
     * POST ('/')
     * Creating a new capacity device
     *
     * @async
     * @param name - The name of the capacity device
     * @param description - The description of the capacity device
     * @param sensor_id - The ID of the sensor that is assigned to capacity device
     * @param user_id - The ID of the user that has the capacity device
     * @param capacity - The current capacity of the device
     * @param max_capacity - The maximum capacity that the device can have
     * @param type - The capacity device type. It can be TOF, parking_individual or parking_area
     * @param address - The address where is installed the capacity device
     * @param coordinates_x - The coordinates in X axis of the capacity devices
     * @param coordinates_y - The coordinates in Y axis of the capacity devices
     *
     * @return
     */
    public async createCapacityCartel(sensorId: number, name: string, description: string, latitude: number, longitude: number = 0, userId: number, url:string,port:string,type:string,displayType:string,cartelLines: any[]): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            try {
                db.getConnection((err: any, conn: any) => {
                    let query = "INSERT INTO `capacity_cartel` (`sensorId`, `name`, `description`, `latitude`, `longitude`, `userId`, `url`, `port`,`type`,`displayType`)" +
                        " VALUES (" + sensorId + ", '" + name + "','" + description + "', " + latitude + ", " + longitude + "," + userId + ",'" + url + "','" + port + "','" + type + "','" + displayType + "');"
                    console.log('query',query);
                    conn.query(query, async (error: any, results: any, fields: any) => {
                        conn.release()
                        if (results && results.length == 0) {
                            resolve({
                                http: 204,
                                status: 'Error',
                                response: "Cartel could not be created"
                            })
                        } else {
                            let linesCreated = 0
                            console.log(results)
                            let lastInsertCartelId: any = results.insertId
                            for (let cartelLine of cartelLines) {
                                let createCartelLineRes: any = await capacityCartelLineController.createCartelLine(lastInsertCartelId, cartelLine.parkingId,
                                    cartelLine.lineNum).catch(err => {
                                        console.log(err)
                                        reject({ error: err })
                                    })
                                if (createCartelLineRes.http == 200) {
                                    linesCreated++
                                } else {
                                    this.deleteCapacityCartel(lastInsertCartelId)
                                    resolve({
                                        http: 204,
                                        status: 'Error',
                                        response: "Some cartel line could not be created"
                                    })
                                }
                            }
                        }
                        if (error) {
                            console.log(error)
                            reject({ error: error })
                        } else {
                            resolve({
                                http: 200,
                                status: 'Success',
                                response: "The capacity cartel has been created succesfully"
                            })
                        }
                    }
                    )
                })
            } catch (error) {
                reject({ error: error })
            }

        })
    } // createCapacityDevice ()

    /**
     * PUT ('/:id')
     * Updating data of a capacity device
     * 
     * @async
     * @param name - The name of the capacity device
     * @param description - The description of the capacity device
     * @param sensor_id - The ID of the sensor that is assigned to capacity device
     * @param capacity - The current capacity of the device
     * @param max_capacity - The maximum capacity that the device can have
     * @param type - The capacity device type. It can be TOF, parking_individual or parking_area
     * @param address - The address where is installed the capacity device
     * @param coordinates_x - The coordinates in X axis of the capacity devices
     * @param coordinates_y - The coordinates in Y axis of the capacity devices 
     * 
     * @returns 
     */
    public async updateCapacityCartel(id: number, cartelLines: any[], name?: string, description?: string, sensorId?: number, latitude?: number, longitude?: number, authToken?: string, provider?: string,url?:string,port?:string, type?:string,displayType?:string): Promise<object> {

        return new Promise((resolve, reject) => {

            if (!name && !description && !sensorId && !latitude && !longitude && !authToken && !provider) {
                reject({
                    http: 406,
                    status: 'Failed',
                    error: "All fields are empty"
                })
            }

            var query = "UPDATE capacity_cartel SET"

            // Checking if each param is not empty and adding it to the query
            if (name) {
                query += " name = '" + name + "',"
            }
            if (description) {
                query += " description = '" + description + "',"
            }
            if (sensorId) {
                query += " sensorId = " + sensorId + ","
            }
            if (latitude) {
                query += " latitude = " + latitude + ","
            }
            if (longitude) {
                query += " longitude = " + longitude + ","
            }
            if (authToken) {
                query += " authToken = '" + authToken + "',"
            }
            if (provider) {
                query += " provider = '" + provider + "',"
            }
            if (url) {
                query += " url = '" + url + "',"
            }
            if (port) {
                query += " port = '" + port + "',"
            }
            if (type) {
                query += " type = '" + type + "',"
            }
            if (displayType) {
                query += " displayType = '" + displayType + "',"
            }

            // Removing the last comma
            query = query.slice(0, -1);

            // Adding the WHERE condition 
            query += " WHERE id = " + id;

            // Running the query
            db.getConnection((err: any, conn: any) => {
                conn.query(query, async (error: any, results: any) => {
                    conn.release()

                    if (error) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: err,
                            query: query
                        })
                    }

                    if (results == undefined) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: "result undefined",
                            query: query
                        })
                    } else {
                        if (results.length == 0) {
                            resolve({
                                http: 204,
                                status: 'Success',
                                result: "There is no capacity cartel with this ID",
                            })
                        } else {
                            for (const cartelLineObj of cartelLines) {
                                let res: any = await capacityCartelLineController.updateCartelLine(id, cartelLineObj.parkingId, cartelLineObj.lineNum).catch(err => {
                                    console.log(err)
                                    reject({
                                        http: 401,
                                        status: 'Failed',
                                        error: err
                                    })
                                })
                                if (res.http != 200) {
                                    resolve({
                                        http: 204,
                                        status: 'Success',
                                        result: "Some capacity line couldnt be updated",
                                    })
                                }
                            }
                            resolve({
                                http: 200,
                                status: 'Success',
                                result: "The capacity cartel has been updated successfully"
                            })
                        }
                    }
                })
            })
        })
    } // ()

    public async deleteCapacityCartel(id: number): Promise<object> {
        return new Promise((resolve, reject) => {
            db.getConnection((err: any, conn: any) => {
                conn.query("DELETE FROM capacity_cartel WHERE id = " + id,
                    (err: any, results: any) => {
                        conn.release()
                        if (err) {
                            reject({
                                http: 401,
                                status: 'Failed',
                                error: err
                            })
                        } else {
                            resolve({
                                http: 200,
                                status: 'Success'
                            })
                        }
                    })
            })
        })
    }
}

export default new CapacityCartelDevicesController();
