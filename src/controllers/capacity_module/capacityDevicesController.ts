import conn from "../../database";
import db from "../../database";
import { Utils } from "../../utils/Utils";
import UsersController from "../usersController";

/*
 * /capacity/devices
 */
class CapacityDevicesController {
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
    public async createCapacityDevice(name: string, description: string = "", sensor_id: number, user_id: number, capacity: number = 0, max_capacity: number, type: string, address: string = "", coordinates_x: string = "", coordinates_y: string = ""): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {
                conn.query(
                    "INSERT INTO capacity_devices" +
                    "(name, description, sensor_id, user_id, capacity, max_capacity, type, address, coordinates_x, coordinates_y)" +
                    " VALUES ('" + name + "','" + description + "'," + sensor_id + "," + user_id + "," + capacity + "," + max_capacity + ",'" + type + "','" + address + "','" + coordinates_x + "','" + coordinates_y + "')",
                    (error: any, results: any, fields: any) => {
                        conn.release()

                        if (error) {
                            reject({ error: error })
                        } else {
                            resolve({
                                http: 200,
                                status: 'Success',
                                response: "The capacity device has been created succesfully"
                            })
                        }
                    }
                )
            })
        })
    } // createCapacityDevice ()

    /**
     * POST ('/')
     * Creating a new capacity device
     */
    public async createCapacityDeviceParkingArea(device_id: string, num_parkings: any, parking_sensor_devEUI: string, p1_max: number, p2_max: number, p3_max: number = 0, input_number: number, input1_type: string, input1_sensor: string, input1_parking: string, input2_type: string, input2_sensor: string, input2_parking: string, input3_type: string, input3_sensor: string, input3_parking: string): Promise<object> {

        return new Promise((resolve: any, reject: any) => {
            let query: any = "INSERT INTO capacity_ribbon_devices" +
                "(device_id, parking_number, parking_poster_sensor, p1, p2, p3, p1_max, p2_max, p3_max, input_number, input1_type, input1_sensor,input1_parking, input2_type, input2_sensor,input2_parking, " +
                "input3_type, input3_sensor,input3_parking)" +
                " VALUES ('" + device_id + "','" + num_parkings + "','" + parking_sensor_devEUI + "',0,0,0," + p1_max + "," + p2_max + "," + p3_max +
                "," + input_number + "," + input1_type + "," + input1_sensor + "," + input1_parking + "," + input2_type + "," + input2_sensor + "," + input2_parking + "," + input3_type + "," +
                input3_sensor + "," + input3_sensor + ")"
            console.log(query);

            db.getConnection((err: any, conn: any) => {
                conn.query(
                    query,
                    (error: any, results: any, fields: any) => {
                        conn.release()

                        if (error) {
                            reject({ error: error })
                        } else {
                            resolve({
                                http: 200,
                                status: 'Success',
                                response: "The capacity device has been created succesfully"
                            })
                        }
                    }
                )
            })
        })
    }

    /**
     * GET ('/:id')
     * Getting information about a capacity device with the device ID
     * 
     * @param id The ID of the capacity device that you want to get the information from
     * 
     * @return
     */
    public async getCapacityDeviceById(id: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {
                var query = "SELECT * FROM capacity_devices WHERE id = " + id;

                conn.query(query, (err: any, results: any) => {
                    if (err) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: err
                        })
                    } else {

                        if (results.length == 0) {
                            resolve({
                                http: 204,
                                status: 'Success',
                                result: "There are no capacity devices with this ID",
                                capacity_device: {}
                            })
                        } else {
                            resolve({
                                http: 200,
                                status: 'Success',
                                capacity_device: results[0]
                            })
                        }
                    }
                })
            })
        });
    } // getCapacityDeviceById()

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

    public async deleteCapacityDevice(id: number): Promise<object> {
        return new Promise((resolve, reject) => {
            db.getConnection((err: any, conn: any) => {
                conn.query("DELETE FROM capacity_devices WHERE id = " + id, (err: any, results: any) => {
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

    /**
     * GET ('/list/:userId')
     * Getting a list with all capacity devices from a user
     * 
     * @async
     * @param user_id - The user's Id
     * 
     * @returns 
     */
    public async getUserCapacityDevices(user_id: number): Promise<object> {

        return new Promise((resolve, reject) => {

            var query = "SELECT * FROM capacity_devices WHERE user_id = " + user_id;

            db.getConnection((err: any, conn: any) => {
                conn.query(query, (err: any, results: any) => {
                    conn.release()

                    if (err) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: err
                        })
                    } else {

                        if (results.length == 0) {
                            resolve({
                                http: 204,
                                status: 'Success',
                                result: "This user has no capacity devices",
                                capacity_devices: []
                            })
                        } else {
                            resolve({
                                http: 200,
                                status: 'Success',
                                capacity_devices: results
                            })
                        }
                    }
                })
            })
        })
    } // ()

    /**
     *  GET ('/most/:id')
     * Getting the most capacity devices from a user
     * 
     * @async
     * @param user_id - The user's Id
     * 
     * @returns 
     */
    public async getMostCapacityDevices(user_id: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            var query = "SELECT * FROM capacity_devices ORDER BY capacity DESC LIMIT 4";

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
                        capacity_devices: results
                    })
                })
            })

        })
    } // ()

    /**
     *  GET ('/less/:id')
     * Getting the less capacity devices from a user
     * 
     * @async
     * @param user_id - The user's Id
     * 
     * @returns 
     */
    public async getLessCapacityDevices(user_id: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            var query = "SELECT * FROM capacity_devices ORDER BY capacity ASC LIMIT 4";

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
                        capacity_devices: results
                    })
                })
            })

        })
    } // ()

    public async getSpotChart(userId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            var query = "SELECT name, capacity, type FROM capacity_devices WHERE user_id = " + userId;

            db.getConnection((err: any, results: any) => {
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

    // SPOT
    public async importCapacityDevices(capacity_devices: any[], user_id: any) {
        return new Promise(async (resolve, reject) => {

            let countCapacityDevs = 0;
            let notAddedCapacityDevs: any[]
            for (const capacity_device of capacity_devices) {
                try {
                    console.log("mail", capacity_device.mail)
                    let user: any = await UsersController.getUserIdByMail(capacity_device.mail)
                    console.log(user)
                    let userId
                    if (user.http != 200) {
                        userId = 99999
                    } else {
                        userId = user.user_data.id
                    }
                    let res: any = await this.createCapacityDevice(capacity_device.name, capacity_device.description, capacity_device.sensor_id, userId, 0,
                        capacity_device.max_capacity, capacity_device.type, capacity_device.address, capacity_device.coordinates_x, capacity_device.coordinates_y)
                    if (res.http == 200) {
                        console.log("res capacity device", res)
                        countCapacityDevs++
                        console.log(countCapacityDevs)
                    } else {
                        notAddedCapacityDevs.push(capacity_device.name)
                    }
                } catch (error) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: error
                    })
                }
            }

            resolve({
                http: 200,
                status: 'Success',
                added_devices: countCapacityDevs
            })
        })
    }

    // LAZO
    public async importCapacityDevicesLazo(capacity_devices: any[], user_id: any) {
        return new Promise(async (resolve, reject) => {

            let countCapacityDevs = 0;
            let countRibbonDevs = 0;
            let notAddedCapacityDevs: any[]
            for (const capacity_device of capacity_devices) {
                try {
                    console.log("mail", capacity_device.mail)
                    let user: any = await UsersController.getUserIdByMail(capacity_device.mail)
                    console.log(user)
                    let userId
                    if (user.http != 200) {
                        userId = 99999
                    } else {
                        userId = user.user_data.id
                    }
                    let res: any = await this.createCapacityDevice(capacity_device.name, capacity_device.description, capacity_device.sensor_id, userId, 0,
                        capacity_device.max_capacity, capacity_device.type, capacity_device.address, capacity_device.coordinates_x, capacity_device.coordinates_y)
                    if (res.http == 200) {
                        console.log("res capacity device", res)
                        countCapacityDevs++
                        console.log(countCapacityDevs)
                        let resRibbon: any = await this.createCapacityDeviceParkingArea(capacity_device.device_id, capacity_device.numero_de_parkings, capacity_device.sensor_devEUI_cartel, capacity_device.plazas_parking_1_max, capacity_device.plazas_parking_2_max,
                            capacity_device.plazas_parking_3_max, capacity_device.numero_de_entradas_o_salidas, capacity_device.salida_entrada_1, capacity_device.sensor_id_entrada_salida_1, capacity_device.parking_num_1, capacity_device.salida_entrada_2, capacity_device.sensor_id_entrada_salida_2, capacity_device.parking_num_2, capacity_device.salida_entrada_3, capacity_device.sensor_id_entrada_salida_3, capacity_device.parking_num_3)
                        if (resRibbon.http == 200) {
                            countRibbonDevs++
                        }
                    } else {
                        notAddedCapacityDevs.push(capacity_device.name)
                    }
                } catch (error) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: error
                    })
                }
            }

            resolve({
                http: 200,
                status: 'Success',
                added_devices: countCapacityDevs,
                added_ribbon_devices: countRibbonDevs
            })
        })
    }
}

export default new CapacityDevicesController();
