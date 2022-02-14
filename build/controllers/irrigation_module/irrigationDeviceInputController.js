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
class IrrigationDeviceInputController {
    /**
     * GET ('/information/:id')
     * Getting the information about the user
     *
     * @async
     * @param id - The user Id
     *
     * @return
     */
    getIrrigationInputDeviceById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    let query = "SELECT * FROM irrigation_device_input WHERE id = " + id;
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
                                result: 'There is no irrigation device input with this ID'
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
    getInputByIrrigationDeviceId(irrigationDeviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    let query = "SELECT * FROM irrigation_device_input WHERE irrigationDeviceId = " + irrigationDeviceId;
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
                                result: 'There is no irrigation device input with this ID'
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
    getIrrigationInputDeviceByIrrigationDeviceIdAndName(name, irrigationDeviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    let query = "SELECT * FROM irrigation_device_input WHERE name = '" + name + "' AND irrigationDeviceId=" + irrigationDeviceId;
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
                        console.log("res", results);
                        if (results == undefined) {
                            resolve({
                                http: 204,
                                status: 'Success',
                                result: 'There is no irrigation device input with this ID'
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
    storeIrrigationInputDevice(irrigationDeviceId, sensorId, lastTemperature, lastHumidity, sensorIndex, name, connectionType, authToken, provider) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    let providerCheck = provider;
                    if (provider == undefined) {
                        providerCheck = '';
                    }
                    let authCheck = authToken;
                    if (authToken == undefined) {
                        authCheck = '';
                    }
                    let query = "INSERT INTO irrigation_device_input (irrigationDeviceId,sensorId,lastHumidity,lastTemperature,sensorIndex, name,connectionType,authToken,provider)" +
                        " VALUES (" + irrigationDeviceId + "," + sensorId + "," + lastHumidity + "," +
                        lastTemperature + "," + sensorIndex + ", '" + name + "', '" + connectionType + "','" +
                        authCheck + "','" + providerCheck + "')";
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
                        if (results && results.affectedRows == 1) {
                            resolve({
                                http: 200,
                                status: 'Success',
                                result: 'Irrigation device input inserted succesfully',
                                insertId: results.insertId
                            });
                        }
                        else {
                            resolve({
                                http: 204,
                                status: 'Success',
                                message: "Irrigation device input could not be inserted",
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
                        console.log(results);
                        if (results) {
                            resolve({
                                http: 200,
                                status: 'Success',
                                message: 'Irrigation device inputs retrieved succesfully',
                                result: results.sensorsCount
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
    updateIrrigationInputDevice(id, sensorId, name, connectionType, authToken, provider) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    let providerCheck = provider;
                    if (provider == undefined) {
                        providerCheck = '';
                    }
                    let authCheck = authToken;
                    if (authToken == undefined) {
                        authCheck = '';
                    }
                    let query = "UPDATE irrigation_device_input SET sensorId=" + sensorId + ", name='" + name + "', connectionType='" +
                        connectionType + "', authToken='" + authCheck + "', provider='" + providerCheck + "' WHERE id=" + id + ";";
                    conn.query(query, (error, results) => {
                        conn.release();
                        console.log(query);
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
                                result: 'Irrigation device input updated succesfully'
                            });
                        }
                        else {
                            resolve({
                                http: 204,
                                status: 'Success',
                                message: "Irrigation device input could not be updated",
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
    deleteIrrigationInputDevice(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    let query = "DELETE FROM irrigation_device_input WHERE id=" + id + ";";
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
                                result: 'There is no irrigation device input with this ID'
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
exports.default = new IrrigationDeviceInputController();
