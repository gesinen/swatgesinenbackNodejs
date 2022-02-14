import conn from "../../database";
import db from "../../database";
import { Utils } from "../../utils/Utils";


/*
 * /capacity/devices
 */
class CapacityDevicesController {

    public async getAllCapacityRibbonDevicesInner(): Promise<any> {
        return new Promise((resolve, reject) => {
            var query = "SELECT sensor_info.device_EUI"
                + ",sensor_gateway_pkid.mac_number FROM capacity_devices " +
                " INNER JOIN sensor_info ON sensor_info.id = capacity_devices.sensorId INNER JOIN sensor_gateway_pkid" +
                " ON sensor_gateway_pkid.sensor_id=sensor_info.id";
            console.log(query)
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

    public async getCapacityRibbonDeviceById(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            var query = "SELECT * FROM capacity_type_ribbon WHERE capacityDeviceId=" + id;
            console.log(query)
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
    public async createCapacityRibbonDevice(capacityDeviceId: number, parkingId: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {
                var query: any = "INSERT INTO `capacity_type_ribbon` (`capacityDeviceId`, `parkingId`) VALUES (" + capacityDeviceId + ", " + parkingId + ")"
                conn.query(query, (error: any, results: any, fields: any) => {
                    conn.release()

                    if (error) {
                        reject({ error: error })
                    } else {
                        resolve({
                            http: 200,
                            status: 'Success',
                            response: "The capacity ribbon device has been created succesfully"
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
    public async updateCapacityRibbonDevice(id: number, parkingId: number): Promise<object> {

        return new Promise((resolve, reject) => {

            if (!parkingId) {
                reject({
                    http: 406,
                    status: 'Failed',
                    error: "All fields are empty"
                })
            }

            var query = "UPDATE capacity_type_ribbon SET"

            // Checking if each param is not empty and adding it to the query
            if (parkingId) {
                query += " parkingId = " + parkingId + ","
            }

            // Removing the last comma
            query = query.slice(0, -1);

            // Adding the WHERE condition 
            query += " WHERE capacityDeviceId = " + id;
            console.log('QUERY', query)
            // Running the query
            db.getConnection((err: any, conn: any) => {
                conn.query(query, (error: any, results: any) => {
                    conn.release()

                    console.log('RESULTADO', results)
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
                            result: "There is no capacity ribbon device with this ID",
                        })
                    } else {
                        resolve({
                            http: 200,
                            status: 'Success',
                            result: "The capacity ribbon device has been updated successfully"
                        })
                    }
                })
            })
        })
    } // ()

    public async deleteCapacityRibbonDevice(id: number): Promise<object> {
        return new Promise((resolve, reject) => {
            db.getConnection((err: any, conn: any) => {
                conn.query("DELETE FROM capacity_type_ribbon WHERE capacityDeviceId = " + id, (err: any, results: any) => {
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
