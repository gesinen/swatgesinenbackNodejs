import conn from "../../database";
import db from "../../database";
import { Utils } from "../../utils/Utils";


/*
 * /capacity/devices
 */
class CapacityDevicesController {

    public async getCapacitySpotDevice(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            var query = "SELECT * FROM capacity_type_spot WHERE id = " + id;

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
    public async createCapacitySpotDevice(capacityDeviceId: number, parkingId: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {
                let query = "INSERT INTO `capacity_type_spot` (`capacityDeviceId`, `status`, `parkingId`) VALUES (" + capacityDeviceId + ", false, " + parkingId + ")";
                console.log("insertSpotQuery",query)
                conn.query(query,
                    (error: any, results: any, fields: any) => {
                        conn.release()
                        console.log("insertSpotQueryRes",results)
                        if (error) {
                            reject({ error: error })
                        } else {
                            resolve({
                                http: 200,
                                status: 'Success',
                                response: "The capacity spot device has been created succesfully"
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
    public async updateCapacitySpotDevice(id: number, status: boolean): Promise<object> {

        return new Promise((resolve, reject) => {

            if (status == undefined) {
                reject({
                    http: 406,
                    status: 'Failed',
                    error: "All fields are empty"
                })
            }

            var query = "UPDATE capacity_type_spot SET"

            // Checking if each param is not empty and adding it to the query
            if (status) {
                query += " status = " + status + ","
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

                    /*if (results.length == 0) {
                        resolve({
                            http: 204,
                            status: 'Success',
                            result: "There is no capacity spot device with this ID",
                        })
                    }*/ else {
                        resolve({
                            http: 200,
                            status: 'Success',
                            result: "The capacity spot device has been updated successfully"
                        })
                    }
                })
            })
        })
    } // ()

    public async deleteCapacitySpotDevice(id: number): Promise<object> {
        return new Promise((resolve, reject) => {
            db.getConnection((err: any, conn: any) => {
                conn.query("DELETE FROM capacity_type_spot WHERE id = " + id,
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

export default new CapacityDevicesController();
