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
    getCapacitySpotDevice(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var query = "SELECT * FROM capacity_type_spot WHERE id = " + id;
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
    createCapacitySpotDevice(capacityDeviceId, parkingId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    let query = "INSERT INTO `capacity_type_spot` (`capacityDeviceId`, `status`, `parkingId`) VALUES (" + capacityDeviceId + ", false, " + parkingId + ")";
                    console.log("insertSpotQuery", query);
                    conn.query(query, (error, results, fields) => {
                        conn.release();
                        console.log("insertSpotQueryRes", results);
                        if (error) {
                            reject({ error: error });
                        }
                        else {
                            resolve({
                                http: 200,
                                status: 'Success',
                                response: "The capacity spot device has been created succesfully"
                            });
                        }
                    });
                });
            });
        });
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
    updateCapacitySpotDevice(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (status == undefined) {
                    reject({
                        http: 406,
                        status: 'Failed',
                        error: "All fields are empty"
                    });
                }
                var query = "UPDATE capacity_type_spot SET";
                // Checking if each param is not empty and adding it to the query
                if (status) {
                    query += " status = " + status + ",";
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
                                result: "There is no capacity spot device with this ID",
                            });
                        }
                        else {
                            resolve({
                                http: 200,
                                status: 'Success',
                                result: "The capacity spot device has been updated successfully"
                            });
                        }
                    });
                });
            });
        });
    } // ()
    deleteCapacitySpotDevice(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    conn.query("DELETE FROM capacity_type_spot WHERE id = " + id, (err, results) => {
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
}
exports.default = new CapacityDevicesController();
