import conn from "../../database";
import db from "../../database";
import { Utils } from "../../utils/Utils";


/*
 * /capacity/devices
 */
class CapacityCartelLineController {

    public async getFreeCartelLines(): Promise<any> {
        return new Promise((resolve, reject) => {
            var query = "SELECT * FROM capacity_cartel_line WHERE parkingId IS NULL"

            db.getConnection((err: any, results: any) => {
                console.log(results)
                if (err) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: err
                    })
                }

                conn.query(query, (error: any, results: any) => {
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
                        capacity_devices: results
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
    public async createCapacityDevice(cartelId: number, ribbonId: number, lineNum: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {
                conn.query(
                    "INSERT INTO `capacity_cartel_line` (`cartelId`, `ribbonId`, `lineNum`) VALUES (" + cartelId + ", " + ribbonId + ", " + lineNum + ")",
                    (error: any, results: any, fields: any) => {
                        conn.release()

                        if (error) {
                            reject({ error: error })
                        } else {
                            resolve({
                                http: 200,
                                status: 'Success',
                                response: "The capacity cartel line has been created succesfully"
                            })
                        }
                    }
                )
            })
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
    public async updateCapacityDevice(id: number, name?: string, description?: string, sensor_id?: number, capacity?: number, max_capacity?: number, type?: string, address?: string, coordinates_x?: string, coordinates_y?: string): Promise<object> {

        return new Promise((resolve, reject) => {

            if (!name && !description && !sensor_id && !capacity && !max_capacity && !type && !address && !coordinates_x && !coordinates_y) {
                reject({
                    http: 406,
                    status: 'Failed',
                    error: "All fields are empty"
                })
            }

            var query = "UPDATE capacity_devices SET"

            // Checking if each param is not empty and adding it to the query
            if (name) {
                query += " name = '" + name + "',"
            }
            if (description) {
                query += " description = '" + description + "',"
            }
            if (sensor_id) {
                query += " sensor_id = " + sensor_id + ","
            }
            if (capacity) {
                query += " capacity = " + capacity + ","
            }
            if (max_capacity) {
                query += " max_capacity = " + max_capacity + ","
            }
            if (type) {
                query += " type = '" + type + "',"
            }
            if (address) {
                query += " address = '" + address + "',"
            }
            if (coordinates_x) {
                query += " coordinates_x = '" + coordinates_x + "',"
            }
            if (coordinates_y) {
                query += " coordinates_y = '" + coordinates_y + "',"
            }

            // Removing the last comma
            query = query.slice(0, -1);

            // Adding the WHERE condition 
            query += " WHERE id = " + id;

            // Running the query
            db.getConnection((err: any, conn: any) => {
                conn.query(query, (error: any, results: any) => {
                    conn.release()

                    if (error) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: err
                        })
                    }

                    if (results.length == 0) {
                        resolve({
                            http: 204,
                            status: 'Success',
                            result: "There are no capacity devices with this ID",
                        })
                    } else {
                        resolve({
                            http: 200,
                            status: 'Success',
                            result: "The capacity device has been updated successfully"
                        })
                    }
                })
            })
        })
    } // ()

    public async deleteCapacityCartelLine(id: number): Promise<object> {
        return new Promise((resolve, reject) => {
            db.getConnection((err: any, conn: any) => {
                conn.query("DELETE FROM capacity_cartel_line WHERE id = " + id, (err: any, results: any) => {
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

export default new CapacityCartelLineController();
