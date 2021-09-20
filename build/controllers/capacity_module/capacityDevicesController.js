"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../database"));
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
    createCapacityDevice(name, description = "", sensor_id, user_id, capacity = 0, max_capacity, type, address = "", coordinates_x = "", coordinates_y = "") {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    conn.query("INSERT INTO capacity_devices" +
                        "(name, description, sensor_id, user_id, capacity, max_capacity, type, address, coordinates_x, coordinates_y)" +
                        " VALUES ('" + name + "','" + description + "'," + sensor_id + "," + user_id + "," + capacity + "," + max_capacity + ",'" + type + "','" + address + "','" + coordinates_x + "','" + coordinates_y + "')", (error, results, fields) => {
                        conn.release();
                        if (error) {
                            reject({ error: error });
                        }
                        else {
                            resolve({
                                http: 200,
                                status: 'Success',
                                response: "The capacity device has been created succesfully"
                            });
                        }
                    });
                });
            });
        });
    } // createCapacityDevice ()
    /**
     * GET ('/:id')
     * Getting information about a capacity device with the device ID
     *
     * @param id The ID of the capacity device that you want to get the information from
     *
     * @return
     */
    getCapacityDeviceById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    var query = "SELECT * FROM capacity_devices WHERE id = " + id;
                    conn.query(query, (err, results) => {
                        if (err) {
                            reject({
                                http: 401,
                                status: 'Failed',
                                error: err
                            });
                        }
                        else {
                            if (results.length == 0) {
                                resolve({
                                    http: 204,
                                    status: 'Success',
                                    result: "There are no capacity devices with this ID",
                                    capacity_device: {}
                                });
                            }
                            else {
                                resolve({
                                    http: 200,
                                    status: 'Success',
                                    capacity_device: results[0]
                                });
                            }
                        }
                    });
                });
            });
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
    updateCapacityDevice(id, name, description, sensor_id, capacity, max_capacity, type, address, coordinates_x, coordinates_y) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (!name && !description && !sensor_id && !capacity && !max_capacity && !type && !address && !coordinates_x && !coordinates_y) {
                    reject({
                        http: 406,
                        status: 'Failed',
                        error: "All fields are empty"
                    });
                }
                var query = "UPDATE capacity_devices SET";
                // Checking if each param is not empty and adding it to the query
                if (name) {
                    query += " name = '" + name + "',";
                }
                if (description) {
                    query += " description = '" + description + "',";
                }
                if (sensor_id) {
                    query += " sensor_id = " + sensor_id + ",";
                }
                if (capacity) {
                    query += " capacity = " + capacity + ",";
                }
                if (max_capacity) {
                    query += " max_capacity = " + max_capacity + ",";
                }
                if (type) {
                    query += " type = '" + type + "',";
                }
                if (address) {
                    query += " address = '" + address + "',";
                }
                if (coordinates_x) {
                    query += " coordinates_x = '" + coordinates_x + "',";
                }
                if (coordinates_y) {
                    query += " coordinates_y = '" + coordinates_y + "',";
                }
                // Removing the last comma
                query = query.slice(0, -1);
                // Adding the WHERE condition 
                query += " WHERE id = " + id;
                // Running the query
                database_1.default.getConnection((err, conn) => {
                    conn.query(query, (err, results) => {
                        conn.release();
                        if (err) {
                            reject({
                                http: 401,
                                status: 'Failed',
                                error: err
                            });
                        }
                        if (results.length == 0) {
                            resolve({
                                http: 204,
                                status: 'Success',
                                result: "There are no capacity devices with this ID",
                            });
                        }
                        else {
                            resolve({
                                http: 200,
                                status: 'Success',
                                result: "The capacity device has been updated successfully"
                            });
                        }
                    });
                });
            });
        });
    } // ()
    /**
     * GET ('/list/:userId')
     * Getting a list with all capacity devices from a user
     *
     * @async
     * @param user_id - The user's Id
     *
     * @returns
     */
    getUserCapacityDevices(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var query = "SELECT * FROM capacity_devices WHERE user_id = " + user_id;
                database_1.default.getConnection((err, conn) => {
                    conn.query(query, (err, results) => {
                        conn.release();
                        if (err) {
                            reject({
                                http: 401,
                                status: 'Failed',
                                error: err
                            });
                        }
                        else {
                            if (results.length == 0) {
                                resolve({
                                    http: 204,
                                    status: 'Success',
                                    result: "This user has no capacity devices",
                                    capacity_devices: []
                                });
                            }
                            else {
                                resolve({
                                    http: 200,
                                    status: 'Success',
                                    capacity_devices: results
                                });
                            }
                        }
                    });
                });
            });
        });
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
    getMostCapacityDevices(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var query = "SELECT * FROM capacity_devices ORDER BY capacity DESC LIMIT 4";
                database_1.default.getConnection((err, conn) => {
                    if (err) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: err
                        });
                    }
                    conn.query(query, (error, results) => {
                        conn.release();
                        if (error) {
                            reject({
                                http: 401,
                                status: 'Failed',
                                error: error
                            });
                        }
                        resolve({
                            http: 200,
                            status: 'Success',
                            capacity_devices: results
                        });
                    });
                });
            });
        });
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
    getLessCapacityDevices(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var query = "SELECT * FROM capacity_devices ORDER BY capacity ASC LIMIT 4";
                database_1.default.getConnection((err, conn) => {
                    if (err) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: err
                        });
                    }
                    conn.query(query, (error, results) => {
                        conn.release();
                        if (error) {
                            reject({
                                http: 401,
                                status: 'Failed',
                                error: error
                            });
                        }
                        resolve({
                            http: 200,
                            status: 'Success',
                            capacity_devices: results
                        });
                    });
                });
            });
        });
    } // ()
}
exports.default = new CapacityDevicesController();
