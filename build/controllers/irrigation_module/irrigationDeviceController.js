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
const irrigationDeviceInputController_1 = __importDefault(require("./irrigationDeviceInputController"));
const irrigationDeviceOutputController_1 = __importDefault(require("./irrigationDeviceOutputController"));
/*
 * /users
 */
class IrrigationDeviceController {
    /**
     * GET ('/information/:id')
     * Getting the information about the user
     *
     * @async
     * @param id - The user Id
     *
     * @return
     */
    getIrrigationDeviceById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    let query = "SELECT * FROM irrigation_device WHERE id = " + id;
                    conn.query(query, (error, results) => {
                        conn.release();
                        if (error) {
                            reject({
                                http: 406,
                                status: 'Failed',
                                error: error
                            });
                        }
                        if (results.length == 0) {
                            resolve({
                                http: 204,
                                status: 'Success',
                                result: 'There is no irrigation device with this ID',
                                user_data: {}
                            });
                        }
                        resolve({
                            http: 200,
                            status: 'Success',
                            user_data: results[0]
                        });
                    });
                });
            });
        });
    }
    /**
     * GET ('/information/:id')
     * Getting the information about the user
     *
     * @async
     * @param id - The user Id
     *
     * @return
     */
    getIrrigationDeviceOutputCount(irrigationDeviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    let query = "SELECT * FROM `irrigation_device_output` WHERE irrigation_device_output.status=1 and irrigation_device_output.irrigationDeviceId=" + irrigationDeviceId + ";";
                    conn.query(query, (error, results) => {
                        conn.release();
                        if (error) {
                            reject({
                                http: 406,
                                status: 'Failed',
                                error: error
                            });
                        }
                        if (results.length == 0) {
                            resolve({
                                http: 204,
                                status: 'Success',
                                result: []
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
     * GET ('/information/:id')
     * Getting the information about the user
     *
     * @async
     * @param id - The user Id
     *
     * @return
     */
    getIrrigationDeviceOutputTotalCount(irrigationDeviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    let query = "SELECT irrigation_device_output.*, sensor_info.id, sensor_info.app_KEY, sensor_info.device_EUI, sensor_gateway_pkid.mac_number, sensor_gateway_pkid.sensor_id FROM `irrigation_device_output` INNER JOIN sensor_info ON sensor_info.id = irrigation_device_output.sensorId INNER JOIN sensor_gateway_pkid ON sensor_gateway_pkid.sensor_id = sensor_info.id WHERE irrigation_device_output.irrigationDeviceId=" + irrigationDeviceId + ";";
                    conn.query(query, (error, results) => {
                        conn.release();
                        if (error) {
                            reject({
                                http: 406,
                                status: 'Failed',
                                error: error
                            });
                        }
                        if (results.length == 0) {
                            resolve({
                                http: 204,
                                status: 'Success',
                                result: 'There are no irrigation devices with the given user id'
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
     * GET ('/information/:id')
     * Getting the information about the user
     *
     * @async
     * @param id - The user Id
     *
     * @return
     */
    getIrrigationDeviceListing(userId, pageSize, pageIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            const first_value = (pageSize * pageIndex) - pageSize;
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    //let query = "SELECT * FROM irrigation_device INNER JOIN irrigation_device_output ON irrigation_device_output.irrigationDeviceId = irrigation_device.id WHERE userId=" + userId + " AND irrigation_device_output.status=1 ORDER BY irrigation_device.id DESC LIMIT " + first_value + ', ' + pageSize;
                    let query = "SELECT irrigation_device.*, users.first_name, irrigation_device_type.name AS deviceTypeName FROM irrigation_device INNER JOIN users ON users.id=irrigation_device.userId INNER JOIN irrigation_device_type ON irrigation_device_type.id=irrigation_device.deviceTypeId WHERE userId=" + userId + " ORDER BY irrigation_device.id DESC LIMIT " + first_value + ', ' + pageSize;
                    //let query = "SELECT irrigation_device.*, COUNT(*) as openIrrigationOutputs FROM irrigation_device INNER JOIN irrigation_device_output ON irrigation_device_output.irrigationDeviceId = irrigation_device.id WHERE userId=" + userId + " AND irrigation_device_output.status=1 GROUP BY irrigation_device.id" + " ORDER BY irrigation_device.id DESC LIMIT " + first_value + ', ' + pageSize;
                    console.log(query);
                    conn.query(query, (error, results) => __awaiter(this, void 0, void 0, function* () {
                        conn.release();
                        if (error) {
                            reject({
                                http: 406,
                                status: 'Failed',
                                error: error
                            });
                        }
                        if (results.length == 0) {
                            resolve({
                                http: 204,
                                status: 'Success',
                                result: 'There are no irrigation devices with the given user id'
                            });
                        }
                        console.log(results);
                        let contador = 0;
                        for (const irrigationDevice of results) {
                            let outputRes = yield this.getIrrigationDeviceOutputCount(irrigationDevice.id);
                            if (outputRes.result) {
                                results[contador].openIrrigationOutputs = outputRes.result;
                            }
                            else {
                                results[contador].openIrrigationOutputs = 0;
                            }
                            let outputTotalRes = yield this.getIrrigationDeviceOutputTotalCount(irrigationDevice.id);
                            if (outputTotalRes.result) {
                                results[contador].totalIrrigationOutputs = outputTotalRes.result;
                            }
                            else {
                                results[contador].totalIrrigationOutputs = 0;
                            }
                            let inputTotalRes = yield this.getIrrigationInputDevicesByIrregationDeviceId(irrigationDevice.id);
                            console.log("inputTotalRes", inputTotalRes);
                            if (inputTotalRes.result) {
                                results[contador].totalIrrigationSensors = inputTotalRes.result.sensorsCount;
                            }
                            else {
                                results[contador].totalIrrigationSensors = 0;
                            }
                            contador++;
                        }
                        resolve({
                            http: 200,
                            status: 'Success',
                            result: results
                        });
                    }));
                });
            });
        });
    }
    /**
     * GET ('/information/:id')
     * Getting the information about the user
     *
     * @async
     * @param id - The user Id
     *
     * @return
     */
    getIrrigationInputDevicesByIrregationDeviceId(irrigationDeviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    let query = "SELECT COUNT(*) as sensorsCount FROM irrigation_device_input WHERE irrigationDeviceId=" + irrigationDeviceId + ";";
                    console.log("query", query);
                    conn.query(query, (error, results) => {
                        conn.release();
                        if (error) {
                            reject({
                                http: 406,
                                status: 'Failed',
                                error: error
                            });
                        }
                        if (results.length != 0) {
                            resolve({
                                http: 200,
                                status: 'Success',
                                message: 'Irrigation device inputs retrieved succesfully',
                                result: results[0]
                            });
                        }
                        else {
                            resolve({
                                http: 204,
                                status: 'Success',
                                message: "Irrigation device inputs could not be retrieved",
                                result: results
                            });
                        }
                    });
                });
            });
        });
    }
    /**
     * GET ('/information/:id')
     * Getting the information about the user
     *
     * @async
     * @param id - The user Id
     *
     * @return
     */
    storeIrrigationDevice(name, nameSentilo, latitude, longitude, description, status, userId, deviceTypeId, valves, sensors) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    let query = "INSERT INTO irrigation_device (name,nameSentilo,latitude,longitude,description,status," +
                        "userId,deviceTypeId) VALUES ('" + name + "','" + nameSentilo + "'," + latitude + "," +
                        longitude + ",'" + description + "'," + status + "," + userId + "," + deviceTypeId + ")";
                    conn.query(query, (error, results) => __awaiter(this, void 0, void 0, function* () {
                        conn.release();
                        if (error) {
                            reject({
                                http: 406,
                                status: 'Failed',
                                error: error
                            });
                        }
                        if (results.affectedRows == 1) {
                            let irrigationDeviceInsertId = results.insertId;
                            let valvesInserted = 0;
                            let contador = 1;
                            for (const irrigationDeviceOutputId of valves) {
                                let deviceOutputRes = yield irrigationDeviceOutputController_1.default.storeIrrigationOutputDevice(irrigationDeviceInsertId, irrigationDeviceOutputId, contador, "", false);
                                if (deviceOutputRes.http == 200) {
                                    valvesInserted++;
                                }
                                contador++;
                            }
                            let sensorsInserted = 0;
                            contador = 1;
                            for (const irrigationDeviceInput of sensors) {
                                let deviceInputRes = yield irrigationDeviceInputController_1.default.storeIrrigationInputDevice(irrigationDeviceInsertId, irrigationDeviceInput, 0, 0, contador);
                                if (deviceInputRes.http == 200) {
                                    sensorsInserted++;
                                }
                                contador++;
                            }
                            resolve({
                                http: 200,
                                status: 'Success',
                                result: 'Irrigation device inserted succesfully',
                                insertId: irrigationDeviceInsertId,
                                valvesInserted: valvesInserted,
                                sensorsInserted: sensorsInserted
                            });
                        }
                        else {
                            resolve({
                                http: 204,
                                status: 'Success',
                                message: "Irrigation device could not be inserted",
                                result: results
                            });
                        }
                    }));
                });
            });
        });
    }
    /**
     * GET ('/information/:id')
     * Getting the information about the user
     *
     * @async
     * @param id - The user Id
     *
     * @return
     */
    updateIrrigationDevice(id, name, nameSentilo, latitude, longitude, description, status, userId, deviceTypeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    let query = "UPDATE irrigation_device SET name='" + name + "', nameSentilo='" + nameSentilo +
                        "', latitude=" + latitude + ",longitude=" + longitude + ", description='" + description + "', status=" + status +
                        ", userId=" + userId + ",deviceTypeId=" + deviceTypeId + " WHERE id=" + id + ";";
                    conn.query(query, (error, results) => {
                        conn.release();
                        if (error) {
                            reject({
                                http: 406,
                                status: 'Failed',
                                error: error
                            });
                        }
                        console.log(results);
                        if (results.affectedRows == 1) {
                            resolve({
                                http: 200,
                                status: 'Success',
                                result: 'Irrigation device updated succesfully'
                            });
                        }
                        else {
                            resolve({
                                http: 204,
                                status: 'Success',
                                message: "Irrigation device could not be updated",
                                result: results
                            });
                        }
                    });
                });
            });
        });
    }
    /**
     * GET ('/information/:id')
     * Getting the information about the user
     *
     * @async
     * @param id - The user Id
     *
     * @return
     */
    deleteIrrigationDevice(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    let query = "DELETE FROM irrigation_device WHERE id=" + id + ";";
                    conn.query(query, (error, results) => {
                        conn.release();
                        if (error) {
                            reject({
                                http: 406,
                                status: 'Failed',
                                error: error
                            });
                        }
                        console.log(results);
                        if (results.length == 0) {
                            resolve({
                                http: 204,
                                status: 'Success',
                                result: 'There are no users with this ID'
                            });
                        }
                        resolve({
                            http: 200,
                            status: 'Success',
                            result: results[0]
                        });
                    });
                });
            });
        });
    }
}
exports.default = new IrrigationDeviceController();
