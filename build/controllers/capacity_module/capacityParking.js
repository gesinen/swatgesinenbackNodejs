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
    getParkingList(userId, pageSize, pageIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const first_value = (pageSize * pageIndex) - pageSize;
                var query = "SELECT * FROM capacity_parking WHERE userId = " + userId +
                    " ORDER BY capacity_parking.id DESC LIMIT " + first_value + ', ' + pageSize + ";";
                database_1.default.getConnection((err, conn) => {
                    if (err) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: err
                        });
                    }
                    console.log("query", query);
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
    }
    getParking(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var query = "SELECT * FROM capacity_parking WHERE id = " + id;
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
    }
    getParkingByAuthToken(id, authorization, provider) {
        return __awaiter(this, void 0, void 0, function* () {
            if (authorization == '' && provider == '' || (authorization == undefined && provider == undefined)) {
                return new Promise((resolve, reject) => {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: 'Authorization Failed'
                    });
                });
            }
            return new Promise((resolve, reject) => {
                var query = "SELECT * FROM capacity_parking WHERE id = " + id + " and authToken = '" + authorization + "' and provider ='" + provider + "'";
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
                            capacity_devices: [{
                                    "id": results[0].id,
                                    "name": results[0].name,
                                    "currentCapacity": results[0].currentCapacity,
                                    "maxCapacity": results[0].maxCapacity
                                }]
                        });
                        /*if(results[0].authToken == authorization && results[0].provider ==  provider){
                            resolve({
                                http: 200,
                                status: 'Success',
                                capacity_devices: [{
                                    "id": results[0].id,
                                    "name": results[0].name,
                                    "currentCapacity": results[0].currentCapacity,
                                    "maxCapacity": results[0].maxCapacity
                                }]
                            })
                        }
                        else{
                            reject({
                                http: 401,
                                status: 'Failed',
                                error: 'Unauthorized'
                            })
                        }*/
                    });
                });
            });
        });
    }
    getCartelById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var query = "SELECT * FROM capacity_cartel WHERE id=" + id;
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
                            result: results
                        });
                    });
                });
            });
        });
    }
    getCartelsWithFreeLines() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var query = "SELECT capacity_cartel.*, COUNT(*) as cartelFreeLines FROM capacity_cartel INNER JOIN capacity_cartel_line ON capacity_cartel.id=capacity_cartel_line.cartelId WHERE capacity_cartel_line.ribbonId IS NULL GROUP BY capacity_cartel.id";
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
                            result: results
                        });
                    });
                });
            });
        });
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
    createParking(name, description, currentCapacity, maxCapacity = 0, address, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    if (err) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: err
                        });
                    }
                    conn.query("INSERT INTO `capacity_parking` (`name`, `description`, `currentCapacity`, `maxCapacity`, `address`, `userId`) VALUES ('" + name + "', '" + description + "', " + currentCapacity + ", " + maxCapacity + ",'" + address + "'," + userId + ");", (error, results, fields) => {
                        conn.release();
                        if (error) {
                            reject({ error: error });
                        }
                        else {
                            resolve({
                                http: 200,
                                status: 'Success',
                                response: "The capacity cartel has been created succesfully"
                            });
                        }
                    });
                });
            });
        });
    } // createCapacityDevice ()
    updateParkingActualCapacity(id, currentCapacity) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var query = "UPDATE capacity_parking SET";
                // Checking if each param is not empty and adding it to the query
                if (currentCapacity) {
                    query += " currentCapacity = '" + currentCapacity + "',";
                }
                // Removing the last comma
                query = query.slice(0, -1);
                // Adding the WHERE condition 
                query += " WHERE id = " + id;
                // Running the query
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
                                error: err
                            });
                        }
                        if (results.length == 0) {
                            resolve({
                                http: 204,
                                status: 'Success',
                                result: "There are no parkings with this ID",
                            });
                        }
                        else {
                            resolve({
                                http: 200,
                                status: 'Success',
                                result: "The parking capacity has been updated successfully"
                            });
                        }
                    });
                });
            });
        });
    } // ()
    // Update Paking current Capacity and max capacity for Mobile app
    updateParkingCapacityByAuthToken(id, authorization, provider, currentCapacity, maxCapacity) {
        return __awaiter(this, void 0, void 0, function* () {
            if (authorization == '' && provider == '' || (authorization == undefined && provider == undefined)) {
                return new Promise((resolve, reject) => {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: 'Authorization Failed'
                    });
                });
            }
            return new Promise((resolve, reject) => {
                var query = "UPDATE capacity_parking SET";
                // Checking if each param is not empty and adding it to the query
                if (currentCapacity) {
                    query += " currentCapacity = '" + currentCapacity + "',";
                }
                if (maxCapacity) {
                    query += " maxCapacity = '" + maxCapacity + "',";
                }
                // Removing the last comma
                query = query.slice(0, -1);
                console.log(query);
                // Adding the WHERE condition 
                query += " WHERE id = " + id + " and  authToken = '" + authorization + "' and provider = '" + provider + "'";
                console.log('complete query', query);
                // Running the query
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
                                error: err
                            });
                        }
                        console.log('results', results.affectedRows);
                        if (results.affectedRows == 0) {
                            resolve({
                                http: 204,
                                status: 'Success',
                                result: "There are no parkings with this ID and authorization please check",
                            });
                        }
                        else {
                            resolve({
                                http: 200,
                                status: 'Success',
                                result: "The parking capacity has been updated successfully"
                            });
                        }
                    });
                });
            });
        });
    } // ()
    updateParkingCapacity(id, currentCapacity, maxCapacity) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var query = "UPDATE capacity_parking SET";
                // Checking if each param is not empty and adding it to the query
                if (currentCapacity) {
                    query += " currentCapacity = '" + currentCapacity + "',";
                }
                if (maxCapacity) {
                    query += " maxCapacity = '" + maxCapacity + "',";
                }
                // Removing the last comma
                query = query.slice(0, -1);
                // Adding the WHERE condition 
                query += " WHERE id = " + id;
                // Running the query
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
                                error: err
                            });
                        }
                        if (results.length == 0) {
                            resolve({
                                http: 204,
                                status: 'Success',
                                result: "There are no parkings with this ID",
                            });
                        }
                        else {
                            resolve({
                                http: 200,
                                status: 'Success',
                                result: "The parking capacity has been updated successfully"
                            });
                        }
                    });
                });
            });
        });
    } // ()
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
    updateCapacityParking(id, name, description, currentCapacity, maxCapacity, address) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (!name && !description && !currentCapacity && !maxCapacity && !address) {
                    reject({
                        http: 406,
                        status: 'Failed',
                        error: "All fields are empty"
                    });
                }
                var query = "UPDATE capacity_parking SET";
                // Checking if each param is not empty and adding it to the query
                if (name) {
                    query += " name = '" + name + "',";
                }
                if (description) {
                    query += " description = '" + description + "',";
                }
                if (currentCapacity) {
                    query += " currentCapacity = '" + currentCapacity + "',";
                }
                if (maxCapacity) {
                    query += " maxCapacity = '" + maxCapacity + "',";
                }
                if (address) {
                    query += " address = '" + address + "',";
                }
                // Removing the last comma
                query = query.slice(0, -1);
                // Adding the WHERE condition 
                query += " WHERE id = " + id;
                // Running the query
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
                                error: err
                            });
                        }
                        if (results.length == 0) {
                            resolve({
                                http: 204,
                                status: 'Success',
                                result: "There are no capacity parkings with this ID",
                            });
                        }
                        else {
                            resolve({
                                http: 200,
                                status: 'Success',
                                result: "The capacity parking has been updated successfully"
                            });
                        }
                    });
                });
            });
        });
    } // ()
    deleteCapacityParking(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    if (err) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: err
                        });
                    }
                    conn.query("DELETE FROM capacity_parking WHERE id = " + id, (err, results) => {
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
    getParkingSensors(id) {
        return new Promise((resolve, reject) => {
            database_1.default.getConnection((err, conn) => {
                if (err) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: err
                    });
                }
                let query = "SELECT capacity_cartel.sensorId, capacity_cartel.id, sensor_info.*, capacity_cartel_line.cartelId, capacity_cartel_line.parkingId, sensor_gateway_pkid.mac_number, sensor_gateway_pkid.sensor_id FROM capacity_cartel LEFT JOIN sensor_info ON sensor_info.id = capacity_cartel.sensorId LEFT JOIN capacity_cartel_line ON capacity_cartel_line.cartelId = capacity_cartel.id LEFT JOIN sensor_gateway_pkid ON sensor_gateway_pkid.sensor_id = sensor_info.id WHERE capacity_cartel_line.parkingId = " + id;
                console.log(query);
                conn.query(query, (err, results) => {
                    conn.release();
                    console.log(results);
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
                            status: 'Success',
                            sensors: results
                        });
                    }
                });
            });
        });
    }
}
exports.default = new CapacityDevicesController();
