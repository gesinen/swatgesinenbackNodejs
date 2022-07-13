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
const irrigationDeviceLinkController_1 = __importDefault(require("./irrigationDeviceLinkController"));
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
    getIrrigationDeviceByIdInner(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    let query = "SELECT * FROM irrigation_device WHERE id=" + id;
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
                        console.log(results);
                        if (results && !results[0]) {
                            resolve({
                                http: 204,
                                status: 'Success',
                                result: 'There is no irrigation device with this ID',
                                irrigationDevice: {}
                            });
                        }
                        else {
                            let irrigationDevice = results[0];
                            let irrigationInputRes = yield irrigationDeviceInputController_1.default.
                                getInputByIrrigationDeviceId(irrigationDevice.id);
                            let irrigationOutputRes = yield irrigationDeviceOutputController_1.default.
                                getOutputByIrrigationDeviceId(irrigationDevice.id);
                            if (irrigationOutputRes.http == 200) {
                                irrigationDevice.valves = (irrigationOutputRes.result);
                            }
                            else {
                                irrigationDevice.valves = [];
                            }
                            if (irrigationInputRes.http == 200) {
                                irrigationDevice.sensors = (irrigationInputRes.result);
                            }
                            else {
                                irrigationDevice.sensors = [];
                            }
                            resolve(irrigationDevice);
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
    getIrrigationDeviceById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    let query = "SELECT * FROM `irrigation_device` WHERE id=" + id + ";";
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
                    let query = "SELECT irrigation_device_output.*, sensor_info.id, sensor_info.app_KEY, sensor_info.device_EUI, sensor_gateway_pkid.mac_number, sensor_gateway_pkid.sensor_id FROM `irrigation_device_output` LEFT JOIN sensor_info ON sensor_info.id = irrigation_device_output.sensorId LEFT JOIN sensor_gateway_pkid ON sensor_gateway_pkid.sensor_id = sensor_info.id WHERE irrigation_device_output.irrigationDeviceId=" + irrigationDeviceId + ";";
                    conn.query(query, (error, results) => {
                        conn.release();
                        console.log('123', results);
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
                                result: []
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
    updateIrrigationDeviceRelatedSensor(irrigationDeviceId, relatedSensorDevEui, humidityLimit, humidityLimitInferior) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    let query = "UPDATE `irrigation_device` SET `parametersSensorDevEui` = '" + relatedSensorDevEui +
                        "', `humidityLimit` = '" + humidityLimit + "', `humidityLimitInferior` = '" + humidityLimitInferior + "' WHERE `irrigation_device`.`id` = " + irrigationDeviceId + ";";
                    conn.query(query, (error, results) => {
                        conn.release();
                        if (error) {
                            reject({
                                http: 406,
                                status: 'Failed',
                                error: error
                            });
                        }
                        console.log("results", results);
                        if (results && results.affectedRows) {
                            resolve({
                                http: 200,
                                status: 'Success',
                                message: 'Irrigation device related sensor updated succesfully'
                            });
                        }
                        else {
                            resolve({
                                http: 204,
                                status: 'Success',
                                message: "Irrigation device related sensor could not be updated",
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
    storeIrrigationDevice(name, nameSentilo, latitude, longitude, description, status, userId, deviceTypeId, valves, sensors, sensorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    try {
                        let lat = latitude;
                        let lng = longitude;
                        if (!latitude) {
                            lat = null;
                        }
                        if (!longitude) {
                            lng = null;
                        }
                        let query = "INSERT INTO irrigation_device (name,nameSentilo,latitude,longitude,description,status," +
                            "userId,deviceTypeId, sensorId, humidityLimit) VALUES ('" + name + "','" + nameSentilo + "'," + lat + "," +
                            lng + ",'" + description + "'," + status + "," + userId + "," + deviceTypeId + "," + sensorId + ", 100)";
                        console.log("INSERT IRRIG DEV", query);
                        conn.query(query, (error, results) => __awaiter(this, void 0, void 0, function* () {
                            conn.release();
                            if (error) {
                                reject({
                                    http: 406,
                                    status: 'Failed',
                                    error: error
                                });
                            }
                            if (results && results.affectedRows == 1) {
                                // IRRIGATION DEVICE ID
                                let irrigationDeviceInsertId = results.insertId;
                                // SENSORS
                                let sensorsInserted = 0;
                                let contador = 1;
                                if (sensors.length != 0) {
                                    for (const irrigationDeviceInput of sensors) {
                                        let deviceInputRes = yield irrigationDeviceInputController_1.default.storeIrrigationInputDevice(irrigationDeviceInsertId, irrigationDeviceInput.sensorId, 0, 0, contador, irrigationDeviceInput.name, irrigationDeviceInput.connectionType, irrigationDeviceInput.authtoken, irrigationDeviceInput.provider);
                                        if (deviceInputRes.http == 200) {
                                            sensorsInserted++;
                                        }
                                        contador++;
                                    }
                                }
                                // VALVES
                                let valvesInserted = 0;
                                contador = 1;
                                if (valves.length != 0) {
                                    for (const irrigationDeviceOutput of valves) {
                                        let indexRes = yield irrigationDeviceOutputController_1.default.getOutputIndexINSERT(irrigationDeviceInsertId);
                                        let index = indexRes.result.sensorIndex;
                                        if (index == undefined) {
                                            index = 1;
                                        }
                                        else {
                                            index++;
                                        }
                                        console.log("insertIndex", index);
                                        console.log("input valves", irrigationDeviceOutput);
                                        console.log(" ***** 1 *****");
                                        let deviceOutputRes = yield irrigationDeviceOutputController_1.default.storeIrrigationOutputDevice(irrigationDeviceInsertId, irrigationDeviceOutput.id, index, "", false, irrigationDeviceOutput.name, sensorId, irrigationDeviceOutput.description);
                                        console.log(" ***** 2 *****");
                                        console.log("deviceOutputRes", deviceOutputRes);
                                        if (deviceOutputRes.http == 200) {
                                            console.log(" ***** 3 *****");
                                            if (valves.length != 0 && sensors.length != 0) {
                                                console.log(" ***** 4 *****");
                                                let outputDeviceInsertId = deviceOutputRes.insertId;
                                                let res = yield irrigationDeviceInputController_1.default.getIrrigationInputDeviceByIrrigationDeviceIdAndName(irrigationDeviceOutput.inputSensorName, irrigationDeviceInsertId);
                                                console.log("resx", res);
                                                if (res.http == 200) {
                                                    if (irrigationDeviceOutput.inputSensorName != undefined) {
                                                        let resLink = yield irrigationDeviceLinkController_1.default.storeIrrigationDeviceLink(res.result.id, outputDeviceInsertId, irrigationDeviceInsertId);
                                                        console.log("resLink", resLink);
                                                    }
                                                }
                                            }
                                            valvesInserted++;
                                        }
                                        contador++;
                                    }
                                    /*
                                    for (const irrigationDeviceOutput of valves) {
                                        console.log("input valves", irrigationDeviceOutput)
                                        let deviceOutputRes: any = await irrigationDeviceOutputController.storeIrrigationOutputDevice(
                                            irrigationDeviceInsertId, irrigationDeviceOutput.id, contador,
                                            "", false, irrigationDeviceOutput.name, sensorId, irrigationDeviceOutput.description)
                                        if (deviceOutputRes.http == 200) {
                                            if (valves.length != 0 && sensors.length != 0) {
                                                let outputDeviceInsertId = deviceOutputRes.insertId
                                                let res: any = await irrigationDeviceInputController.getIrrigationInputDeviceByIrrigationDeviceIdAndName(irrigationDeviceOutput.inputSensorName, irrigationDeviceInsertId)
                                                console.log("resx", res)
                                                if (res.http == 200) {
                                                    let resLink = await irrigationDeviceLinkController.storeIrrigationDeviceLink(res.result.id, outputDeviceInsertId, irrigationDeviceInsertId)
                                                    console.log("resLink", resLink)
                                                }
                                            }
                                            valvesInserted++
                                        }
                                        contador++
                                    }*/
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
    updateIrrigationDevice(id, sensorId, name, nameSentilo, latitude, longitude, description, status, userId, deviceTypeId, valves, sensors) {
        return __awaiter(this, void 0, void 0, function* () {
            let valvesUpdate = [];
            let valvesInsert = [];
            let sensorsUpdate = [];
            let sensorsInsert = [];
            let myIndex = 0;
            valves.forEach(valve => {
                myIndex++;
                valve.index = myIndex;
                if (valve._id == undefined) {
                    valvesInsert.push(valve);
                }
                else {
                    valvesUpdate.push(valve);
                }
            });
            sensors.forEach(sensor => {
                if (sensor._id == undefined) {
                    sensorsInsert.push(sensor);
                }
                else {
                    sensorsUpdate.push(sensor);
                }
            });
            console.log("valvesUpdate", valvesUpdate);
            console.log("valvesInsert", valvesInsert);
            console.log("sensorsUpdate", sensorsUpdate);
            console.log("sensorsInsert", sensorsInsert);
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    try {
                        let lat = latitude;
                        let lng = longitude;
                        if (!latitude) {
                            lat = null;
                        }
                        if (!longitude) {
                            lng = null;
                        }
                        let query = "UPDATE irrigation_device SET name='" + name + "', nameSentilo='" + nameSentilo +
                            "',sensorId=" + sensorId + ",latitude=" + lat + ",longitude=" + lng + ", description='" + description + "', status=" + status +
                            ", userId=" + userId + ",deviceTypeId=" + deviceTypeId + " WHERE id=" + id + ";";
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
                            console.log(results);
                            try {
                                if (results && results.affectedRows != 0) {
                                    // SENSORS ( UPDATE )
                                    let sensorsUpdated = 0;
                                    if (sensorsUpdate.length != 0) {
                                        for (const irrigationDeviceInput of sensorsUpdate) {
                                            console.log(irrigationDeviceInput);
                                            let deviceInputRes = yield irrigationDeviceInputController_1.default.updateIrrigationInputDevice(irrigationDeviceInput.inputId, irrigationDeviceInput.sensorId, irrigationDeviceInput.name, irrigationDeviceInput.connectionType, irrigationDeviceInput.authtoken, irrigationDeviceInput.provider);
                                            if (deviceInputRes.http == 200) {
                                                sensorsUpdated++;
                                            }
                                        }
                                    }
                                    // SENSORS ( INSERT )
                                    let sensorsInserted = 0;
                                    let contador = 1;
                                    console.log("sensorsInsert FUERA", sensorsInsert);
                                    if (sensorsInsert.length != 0) {
                                        console.log("sensorsInsert DENTRO", sensorsInsert);
                                        for (const irrigationDeviceInput of sensorsInsert) {
                                            let deviceInputRes = yield irrigationDeviceInputController_1.default.storeIrrigationInputDevice(id, irrigationDeviceInput.sensorId, 0, 0, contador, irrigationDeviceInput.name, irrigationDeviceInput.connectionType, irrigationDeviceInput.authtoken, irrigationDeviceInput.provider);
                                            if (deviceInputRes.http == 200) {
                                                sensorsInserted++;
                                            }
                                            contador++;
                                        }
                                    }
                                    // VALVES ( UPDATE )
                                    let valvesUpdated = 0;
                                    console.log(" SENSORID IBOX ", sensorId);
                                    if (valvesUpdate.length != 0) {
                                        for (const irrigationDeviceOutput of valvesUpdate) {
                                            let indexRes = yield irrigationDeviceOutputController_1.default.getOutputIndexUPDATE(irrigationDeviceOutput._id);
                                            let index = indexRes.result.sensorIndex;
                                            console.log("updateIndex", index);
                                            let deviceOutputRes = yield irrigationDeviceOutputController_1.default.updateIrrigationOutputDevice(id, irrigationDeviceOutput.id, index, irrigationDeviceOutput.name, sensorId, irrigationDeviceOutput.description);
                                            console.log("updateIrrigationDeviceOutputRes", deviceOutputRes);
                                            if (deviceOutputRes.http == 200) {
                                                valvesUpdated++;
                                                let resOutputGet = yield irrigationDeviceOutputController_1.default.getByIrrigationDeviceIdAndIndex(id, index);
                                                let irrigationInputDeviceId = 'NULL';
                                                if (sensorId != undefined) {
                                                    let resInput = yield irrigationDeviceInputController_1.default.getIrrigationInputDeviceByIrrigationDeviceIdAndName(irrigationDeviceOutput.inputSensorName, id);
                                                    console.log("resInput", resInput);
                                                    irrigationInputDeviceId = resInput.result.id;
                                                }
                                                console.log("resOutputGet", resOutputGet);
                                                yield irrigationDeviceLinkController_1.default.deleteIrrigationLinkDeviceByOutputId(resOutputGet.result.id);
                                                if (sensorId != undefined) {
                                                    yield irrigationDeviceLinkController_1.default.storeIrrigationDeviceLink(irrigationInputDeviceId, resOutputGet.result.id, id);
                                                }
                                            }
                                        }
                                    }
                                    // VALVES ( INSERT )
                                    let valvesInserted = 0;
                                    console.log("valvesInsert", valvesInsert);
                                    console.log("valvesInsert.length", valvesInsert.length);
                                    if (valvesInsert.length != 0) {
                                        for (const irrigationDeviceOutput of valvesInsert) {
                                            let indexRes = yield irrigationDeviceOutputController_1.default.getOutputIndexINSERT(id);
                                            let index = indexRes.result.sensorIndex;
                                            if (index == undefined) {
                                                index = 1;
                                            }
                                            else {
                                                index++;
                                            }
                                            console.log("insertIndex", index);
                                            console.log("input valves", irrigationDeviceOutput);
                                            console.log(" ***** 1 *****");
                                            let deviceOutputRes = yield irrigationDeviceOutputController_1.default.storeIrrigationOutputDevice(id, irrigationDeviceOutput.id, index, "", false, irrigationDeviceOutput.name, sensorId, irrigationDeviceOutput.description);
                                            console.log(" ***** 2 *****");
                                            console.log("deviceOutputRes", deviceOutputRes);
                                            if (deviceOutputRes.http == 200) {
                                                console.log(" ***** 3 *****");
                                                if (valves.length != 0 && sensors.length != 0) {
                                                    console.log(" ***** 4 *****");
                                                    let outputDeviceInsertId = deviceOutputRes.insertId;
                                                    let res = yield irrigationDeviceInputController_1.default.getIrrigationInputDeviceByIrrigationDeviceIdAndName(irrigationDeviceOutput.inputSensorName, id);
                                                    console.log("resx", res);
                                                    if (res.http == 200) {
                                                        if (irrigationDeviceOutput.inputSensorName != undefined) {
                                                            let resLink = yield irrigationDeviceLinkController_1.default.storeIrrigationDeviceLink(res.result.id, outputDeviceInsertId, id);
                                                            console.log("resLink", resLink);
                                                        }
                                                    }
                                                }
                                                valvesInserted++;
                                            }
                                            contador++;
                                        }
                                    }
                                    resolve({
                                        http: 200,
                                        status: 'Success',
                                        result: 'Irrigation device updated succesfully',
                                        valvesUpdated: valvesUpdated,
                                        sensorsUpdated: sensorsUpdated
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
                            }
                            catch (error) {
                                reject({
                                    http: 406,
                                    status: 'Failed',
                                    error: error
                                });
                            }
                        }));
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
