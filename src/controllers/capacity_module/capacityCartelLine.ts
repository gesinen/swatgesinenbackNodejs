import conn from "../../database";
import db from "../../database";
import { Utils } from "../../utils/Utils";


/*
 * /capacity/devices
 */
class CapacityCartelLineController {

    public async getCartelLines(cartelId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            var query = "SELECT * FROM capacity_cartel_line WHERE cartelId=" + cartelId + ";";

            db.getConnection((err: any, conn: any) => {
                //console.log(results)
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

                    resolve({
                        http: 200,
                        status: 'Success',
                        result: results
                    })
                })
            })
        })
    }

    public async getFreeCartelLines(): Promise<any> {
        return new Promise((resolve, reject) => {
            var query = "SELECT * FROM capacity_cartel_line WHERE parkingId IS NULL"

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
    public async createCartelLine(cartelId: number, parkingId: number, lineNum: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {
            db.getConnection((err: any, conn: any) => {
                try {

                    let query = "INSERT INTO `capacity_cartel_line` (`cartelId`, `parkingId`, `lineNum`) VALUES (" + cartelId + ", " + parkingId + ", " + lineNum + ")";
                    
                    if(parkingId == undefined) {
                        query = "INSERT INTO `capacity_cartel_line` (`cartelId`, `parkingId`, `lineNum`) VALUES (" + cartelId + ", NULL, " + lineNum + ")"
                    }

                    conn.query(query, (error: any, results: any, fields: any) => {
                            conn.release()

                            if (error) {
                                console.log(error)
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
                } catch (error) {
                    console.log(error)
                    reject({ error: error })
                }
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
    public async updateCartelLine(cartelId: number, parkingId: number, lineNum: number): Promise<object> {

        return new Promise((resolve, reject) => {

            if (!cartelId && !parkingId && !lineNum) {
                reject({
                    http: 406,
                    status: 'Failed',
                    error: "All fields are empty"
                })
            }

            var query = "UPDATE capacity_cartel_line SET"

            // Checking if each param is not empty and adding it to the query
            if (parkingId) {
                query += " parkingId = " + parkingId + ","
            }
            if (lineNum) {
                query += " lineNum = " + lineNum + ","
            }

            // Removing the last comma
            query = query.slice(0, -1);

            // Adding the WHERE condition 
            query += " WHERE cartelId = " + cartelId + " AND lineNum=" + lineNum;

            // Running the query
            db.getConnection((err: any, conn: any) => {
                conn.query(query, (error: any, results: any) => {
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
                                result: "There is no cartel line with this ID",
                            })
                        } else {
                            resolve({
                                http: 200,
                                status: 'Success',
                                result: "The cartel line has been updated successfully"
                            })
                        }
                    }
                })
            })
        })
    } // ()

    public async deleteCapacityCartelLine(id: number): Promise<object> {
        return new Promise((resolve, reject) => {
            db.getConnection((err: any, conn: any) => {
                conn.query("DELETE FROM capacity_cartel_line WHERE id = " + id, (err: any, results: any) => {
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

export default new CapacityCartelLineController();
