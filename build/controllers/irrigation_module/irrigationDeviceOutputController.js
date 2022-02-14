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
 * /users
 */
class IrrigationDeviceOutputController {
    /**
     * GET ('/information/:id')
     * Getting the information about the user
     *
     * @async
     * @param id - The user Id
     *
     * @return
     */
    getIrrigationOutputDeviceById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    let query = "SELECT * FROM irrigation_device_output INNER JOIN irrigation_device_link ON irrigation_device_link.irrigationDeviceOutputId=irrigation_device_output.id INNER JOIN irrigation_device_input ON irrigation_device_input.id=irrigation_device_link.irrigationDeviceInputId WHERE irrigation.device.output.id = " + id;
                    console.log("queryGetIrrigationOutputDevice", query);
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
                                result: 'There is no irrigation device output with this ID'
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
    /**
 * GET ('/information/:id')
 * Getting the information about the user
 *
 * @async
 * @param id - The user Id
 *
 * @return
 */
    getOutputByIrrigationDeviceId(irrigationDeviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    //let query = "SELECT irrigation_device_output.name,irrigation_device_output.description,irrigation_device_output.id,irrigation_device_output.sensorIdInput as inputSensorId FROM irrigation_device_output WHERE irrigation_device_output.irrigationDeviceId = " + irrigationDeviceId;
                    let query = "SELECT irrigation_device_output.name,irrigation_device_output.description,irrigation_device_output.id,irrigation_device_output.sensorIdInput as inputSensorId, irrigation_device_input.name as inputSensorName FROM irrigation_device_output LEFT JOIN irrigation_device_link ON irrigation_device_link.irrigationDeviceOutputId=irrigation_device_output.id LEFT JOIN irrigation_device_input ON irrigation_device_input.id=irrigation_device_link.irrigationDeviceInputId WHERE irrigation_device_output.irrigationDeviceId = " + irrigationDeviceId;
                    console.log(query);
                    conn.query(query, (error, results) => {
                        conn.release();
                        if (error) {
                            reject({
                                http: 406,
                                status: 'Failed',
                                error: error
                            });
                        }
                        if (results && results.length == 0) {
                            resolve({
                                http: 204,
                                status: 'Success',
                                result: 'There is no irrigation device output with this ID'
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
    getOutputIndexUPDATE(irrigationOutputDeviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    let query = "SELECT sensorIndex FROM irrigation_device_output WHERE id=" + irrigationOutputDeviceId;
                    console.log(query);
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
                                result: 'There is no irrigation device output with this ID'
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
    /**
* GET ('/information/:id')
* Getting the information about the user
*
* @async
* @param id - The user Id
*
* @return
*/
    getOutputIndexINSERT(irrigationDeviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    let query = "SELECT sensorIndex FROM irrigation_device_output WHERE irrigationDeviceId=" + irrigationDeviceId + " ORDER BY sensorIndex DESC LIMIT 1";
                    console.log(query);
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
                                result: 'There is no irrigation device output with this ID'
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
    /**
 * GET ('/information/:id')
 * Getting the information about the user
 *
 * @async
 * @param id - The user Id
 *
 * @return
 */
    getByIrrigationDeviceIdAndIndex(irrigationDeviceId, sensorIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    let query = "SELECT * FROM irrigation_device_output WHERE irrigationDeviceId=" + irrigationDeviceId + " AND sensorIndex=" + sensorIndex;
                    console.log(query);
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
                                result: 'There is no irrigation device output with this ID'
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
    /**
     * GET ('/information/:id')
     * Getting the information about the user
     *
     * @async
     * @param id - The user Id
     *
     * @return
     */
    getIrrigationOutputDeviceIntervalById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    let query = "SELECT id as valve,intervals as config FROM irrigation_device_output WHERE irrigationDeviceId = " + id;
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
                                result: 'There is no interval on irrigation device output with this ID'
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
    storeIrrigationOutputDevice(irrigationDeviceId, sensorId, sensorIndex, intervals, status, name, sensorIdInput, description) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                try {
                    database_1.default.getConnection((err, conn) => {
                        let sensorIdInputCheck = sensorIdInput;
                        console.log("sensorIdInput", sensorIdInput);
                        if (sensorIdInput == undefined) {
                            sensorIdInputCheck = 'NULL';
                        }
                        let query = "INSERT INTO irrigation_device_output (irrigationDeviceId,sensorId,sensorIndex,intervals,status,name,sensorIdInput,description)" +
                            " VALUES (" + irrigationDeviceId + "," + sensorId + "," + sensorIndex + ",'" +
                            intervals + "'," + status + ",'" + name + "'," + sensorIdInputCheck + ",'" + description + "');";
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
                            console.log(results);
                            if (results && results.affectedRows != undefined && results.affectedRows == 1) {
                                resolve({
                                    http: 200,
                                    status: 'Success',
                                    result: 'Irrigation device output inserted succesfully',
                                    insertId: results.insertId
                                });
                            }
                            else {
                                resolve({
                                    http: 204,
                                    status: 'Success',
                                    message: "Irrigation device output could not be inserted",
                                    result: results
                                });
                            }
                        });
                    });
                }
                catch (error) {
                    reject({
                        http: 406,
                        status: 'Failed',
                        error: error
                    });
                }
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
    updateIrrigationOutputDevice(irrigationDeviceId, sensorId, index, name, sensorIdInput, description) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    let sensorIdInputCheck = sensorIdInput;
                    sensorIdInputCheck = 'NULL';
                    if (sensorIdInput) {
                        sensorIdInputCheck = sensorIdInput;
                    }
                    let query = "UPDATE irrigation_device_output SET sensorId=" + sensorId + ",sensorIdInput=" + sensorIdInputCheck + ",name='" + name + "',description='" + description + "' WHERE `sensorIndex`=" + index + " AND irrigationDeviceId=" + irrigationDeviceId + ";";
                    console.log("queryUpdOutput", query);
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
                        if (results && results.affectedRows == 1) {
                            resolve({
                                http: 200,
                                status: 'Success',
                                result: 'Irrigation device output updated succesfully'
                            });
                        }
                        else {
                            resolve({
                                http: 204,
                                status: 'Success',
                                message: "Irrigation device output could not be updated",
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
    updateIrrigationOutputDeviceInterval(irrigationDeviceId, intervals, valveIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    let query = "UPDATE irrigation_device_output SET intervals='" + intervals + "' WHERE irrigationDeviceId=" + irrigationDeviceId
                        + " AND sensorIndex=" + valveIndex + ";";
                    console.log(query);
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
                        if (results && results.affectedRows > 0) {
                            resolve({
                                http: 200,
                                status: 'Success',
                                result: 'Irrigation device output valve intervals updated succesfully'
                            });
                        }
                        else {
                            resolve({
                                http: 204,
                                status: 'Success',
                                message: "Irrigation device output valve intervals could not be updated",
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
    deleteIrrigationOutputDevice(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    let query = "DELETE FROM irrigation_device_output WHERE id=" + id + ";";
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
                                result: 'There is no irrigation device output with this ID'
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
exports.default = new IrrigationDeviceOutputController();
