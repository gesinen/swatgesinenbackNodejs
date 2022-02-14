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
const capacityTypeRibbon_1 = __importDefault(require("./capacityTypeRibbon"));
const capacityTypeSpot_1 = __importDefault(require("./capacityTypeSpot"));
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
    createCapacityDevice(sensorId, name, description, latitude, longitude, authToken, provider, userId, type, parkingId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    let query = "INSERT INTO `capacity_devices` (`sensorId`, `name`, `description`, `latitude`, `longitude`, " +
                        "`authToken`, `provider`, `userId`, `type`) VALUES (" + sensorId + ", '" + name + "', '" + description + "', " + latitude +
                        ", " + longitude + ", '" + authToken + "', '" + provider + "', " + userId + ", '" + type + "');";
                    console.log(query);
                    conn.query(query, (error, results, fields) => __awaiter(this, void 0, void 0, function* () {
                        conn.release();
                        try {
                            if (results && results.length == 0) {
                                resolve({
                                    http: 204,
                                    status: 'Error',
                                    response: "Capacity device could not be created"
                                });
                            }
                            else {
                                console.log(results);
                                let lastInsertCapacityDeviceId = results.insertId;
                                if (type == "parking_individual") {
                                    let capacitySpotCreateRes = yield capacityTypeSpot_1.default.createCapacitySpotDevice(lastInsertCapacityDeviceId, false)
                                        .catch(err => {
                                        console.log(err);
                                        resolve({
                                            http: 204,
                                            status: 'Error',
                                            message: err,
                                            response: "Capacity spot device could not be created"
                                        });
                                    });
                                    if (capacitySpotCreateRes.http != 200) {
                                        this.deleteCapacityDevice(lastInsertCapacityDeviceId).catch(err => {
                                            console.log(err);
                                            resolve({
                                                http: 204,
                                                status: 'Error',
                                                message: err,
                                                response: "Capacity spot device could not be deleted"
                                            });
                                        });
                                        resolve({
                                            http: 204,
                                            status: 'Error',
                                            response: "Capacity spot device could not be created"
                                        });
                                    }
                                }
                                else {
                                    let capacityRibbonCreateRes = yield capacityTypeRibbon_1.default.createCapacityRibbonDevice(lastInsertCapacityDeviceId, parkingId)
                                        .catch(err => {
                                        console.log(err);
                                        resolve({
                                            http: 204,
                                            status: 'Error',
                                            message: err,
                                            response: "Capacity ribbon device could not be created"
                                        });
                                    });
                                    if (capacityRibbonCreateRes.http != 200) {
                                        this.deleteCapacityDevice(lastInsertCapacityDeviceId).catch(err => {
                                            console.log(err);
                                            resolve({
                                                http: 204,
                                                status: 'Error',
                                                message: err,
                                                response: "Capacity ribbon device could not be deleted"
                                            });
                                        });
                                        resolve({
                                            http: 204,
                                            status: 'Error',
                                            response: "Capacity ribbon device could not be created"
                                        });
                                    }
                                }
                            }
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
                        }
                        catch (error) {
                            resolve({
                                http: 204,
                                status: 'Error',
                                message: err,
                                response: "Capacity spot device could not be created"
                            });
                        }
                    }));
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
                    var query = "SELECT capacity_devices.* , sensor_info.device_EUI, sensor_info.name as sensorName, sensor_gateway_pkid.mac_number FROM capacity_devices LEFT JOIN sensor_info ON sensor_info.id = capacity_devices.sensorId LEFT JOIN sensor_gateway_pkid ON sensor_gateway_pkid.sensor_id=sensor_info.id WHERE capacity_devices.id=" + id + ";";
                    conn.query(query, (err, results) => __awaiter(this, void 0, void 0, function* () {
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
                                    result: "There are no capacity devices with this ID",
                                    capacity_device: {}
                                });
                            }
                            else {
                                if (results[0].type == "parking_individual") {
                                    let res = yield capacityTypeSpot_1.default.getCapacitySpotDevice(results[0].id).catch(err => {
                                        console.log(err);
                                        resolve({
                                            http: 204,
                                            status: 'Error',
                                            message: err,
                                            response: "Capacity spot device could not be retrieved"
                                        });
                                    });
                                    console.log("res", res);
                                    results[0].status = res.capacity_devices[0].status;
                                    results[0].spotDeviceId = res.capacity_devices[0].id;
                                }
                                else {
                                    let res = yield capacityTypeRibbon_1.default.getCapacityRibbonDeviceById(results[0].id).catch(err => {
                                        console.log(err);
                                        resolve({
                                            http: 204,
                                            status: 'Error',
                                            message: err,
                                            response: "Capacity ribbon device could not be retrieved"
                                        });
                                    });
                                    console.log("res", res);
                                    results[0].parkingId = res.result[0].parkingId;
                                    results[0].ribbonDeviceId = res.result[0].id;
                                }
                                resolve({
                                    http: 200,
                                    status: 'Success',
                                    capacity_device: results[0]
                                });
                            }
                        }
                    }));
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
    updateCapacityDevice(id, name, description, sensorId, authToken, provider, type, address, latitude, longitude, ribbonDeviceId, parkingId, spotDeviceId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (!name && !description && !sensorId && !authToken && !provider && !type && !address && !latitude && !longitude) {
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
                if (authToken) {
                    query += " authToken = '" + authToken + "',";
                }
                if (provider) {
                    query += " provider = '" + provider + "',";
                }
                if (sensorId) {
                    query += " sensorId = " + sensorId + ",";
                }
                if (type) {
                    query += " type = '" + type + "',";
                }
                if (address) {
                    query += " address = '" + address + "',";
                }
                if (latitude) {
                    query += " latitude = " + latitude + ",";
                }
                if (longitude) {
                    query += " longitude = " + longitude + ",";
                }
                // Removing the last comma
                query = query.slice(0, -1);
                // Adding the WHERE condition 
                query += " WHERE id = " + id;
                // Running the query
                database_1.default.getConnection((err, conn) => {
                    conn.query(query, (error, results) => {
                        conn.release();
                        if (error) {
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
                                result: "There is no capacity device with this ID",
                            });
                        }
                        else {
                            if (type == "parking_individual") {
                                capacityTypeSpot_1.default.updateCapacitySpotDevice(spotDeviceId, status).catch(err => {
                                    console.log(err);
                                    resolve({
                                        http: 204,
                                        status: 'Error',
                                        message: err,
                                        response: "Capacity spot device could not be updated"
                                    });
                                });
                            }
                            else {
                                capacityTypeRibbon_1.default.updateCapacityRibbonDevice(id, parkingId).catch(err => {
                                    console.log(err);
                                    resolve({
                                        http: 204,
                                        status: 'Error',
                                        message: err,
                                        response: "Capacity ribbon device could not be updated"
                                    });
                                });
                            }
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
    deleteCapacityDevice(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    conn.query("DELETE FROM capacity_devices WHERE id = " + id, (err, results) => {
                        conn.release();
                        if (err) {
                            reject({
                                http: 401,
                                status: 'Failed',
                                error: err
                            });
                        }
                        else {
                            resolve({
                                http: 200,
                                status: 'Success'
                            });
                        }
                    });
                });
            });
        });
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
    getUserCapacityDevicesList(userId, pageSize, pageIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const first_value = (pageSize * pageIndex) - pageSize;
                var query = "SELECT capacity_devices.* , sensor_info.device_EUI, sensor_info.name as sensorName, sensor_gateway_pkid.mac_number FROM capacity_devices LEFT JOIN sensor_info ON sensor_info.id = capacity_devices.sensorId LEFT JOIN sensor_gateway_pkid ON sensor_gateway_pkid.sensor_id=sensor_info.id WHERE userId = " + userId +
                    " ORDER BY capacity_devices.id DESC LIMIT " + first_value + ', ' + pageSize + ";";
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
                                    message: "This user has no capacity devices",
                                    result: []
                                });
                            }
                            else {
                                resolve({
                                    http: 200,
                                    status: 'Success',
                                    result: results
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
    getSpotChart(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var query = "SELECT name, capacity, type FROM capacity_devices WHERE user_id = " + userId;
                database_1.default.getConnection((err, conn) => {
                    if (err) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: err
                        });
                    }
                    conn.query(query, (error, results) => {
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
    }
}
exports.default = new CapacityDevicesController();
