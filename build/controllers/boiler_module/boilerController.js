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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../database"));
const Utils_1 = require("../../utils/Utils");
const sensorController_1 = __importDefault(require("../sensor_module/sensorController"));
/*
 * /water/
 */
class BoilerController {
    // Get boiler => sensorId, sensor deviceEUI, related gateway mac
    getBoilerServiceInfo() {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            var boilers = yield this.getAllBoilers();
            console.log("boilers", boilers);
            var boilersInfo = [];
            try {
                for (var _b = __asyncValues(boilers.response), _c; _c = yield _b.next(), !_c.done;) {
                    let boiler = _c.value;
                    var sensorRequiredInfo = yield sensorController_1.default.getSensorDevEuiGatewayMac(boiler.sensorId);
                    console.log("sensorRequiredInfo", sensorRequiredInfo);
                    var sensorId = sensorRequiredInfo.result.sensorId;
                    var sensorDevEui = sensorRequiredInfo.result.devEui;
                    var gateways = sensorRequiredInfo.result.gatewaysMac;
                    for (let gateway of gateways) {
                        boilersInfo.push({
                            topic: gateway.mac + '/application/1/device/' + sensorDevEui + "/rx",
                            sensorId: sensorId,
                            sensorDevEui: sensorDevEui
                        }, {
                            topic: gateway.mac + '/application/2/device/' + sensorDevEui + "/rx",
                            sensorId: sensorId,
                            sensorDevEui: sensorDevEui
                        });
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return {
                http: 200,
                status: "Success",
                response: boilersInfo
            };
        });
    }
    // This Is new Modified Method(shesh)
    // Get boiler => sensorId, sensor deviceEUI, related gateway mac
    getBoilerServiceInfoModified() {
        var e_2, _a;
        return __awaiter(this, void 0, void 0, function* () {
            var boilers = yield this.getAllBoilers();
            console.log("boilers", boilers);
            var boilersInfo = [];
            try {
                for (var _b = __asyncValues(boilers.response), _c; _c = yield _b.next(), !_c.done;) {
                    let boiler = _c.value;
                    var sensorRequiredInfo = yield sensorController_1.default.getSensorById(boiler.sensorId);
                    console.log("sensorRequiredInfo", sensorRequiredInfo);
                    var sensorId = sensorRequiredInfo.result.id;
                    var sensorDevEui = sensorRequiredInfo.result.device_EUI;
                    var gateway = sensorRequiredInfo.result.network_server_mac;
                    var gatewayInfo = yield sensorController_1.default.getNetworkServerMacAndApplication(gateway);
                    let application = gatewayInfo.result.application;
                    //for (let gateway of gateways) {
                    boilersInfo.push({
                        topic: gateway + '/application/' + application + '/device/' + sensorDevEui + "/rx",
                        // topic: gateway + '/application/1/device/' + sensorDevEui + "/rx",
                        sensorId: sensorId,
                        sensorDevEui: sensorDevEui
                    });
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return {
                http: 200,
                status: "Success",
                response: boilersInfo
            };
        });
    }
    getAllBoilers() {
        return __awaiter(this, void 0, void 0, function* () {
            let selectSql = "SELECT * FROM `boiler_device`;";
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((error, conn) => {
                    // If the connection with the database fails
                    if (error) {
                        reject({
                            http: 401,
                            status: "Failed",
                            error: error,
                        });
                    }
                    conn.query(selectSql, (err, results) => {
                        conn.release();
                        // If the query fails
                        if (err) {
                            reject({
                                http: 401,
                                status: "Failed",
                                error: err,
                            });
                        }
                        //console.log(results)
                        // Response
                        resolve({
                            http: 200,
                            status: "Success",
                            response: results,
                        });
                    });
                });
            });
        });
    }
    createBoilerDevice(userId, name, description, sensorId, mode, schedule = undefined, scheduleWeekend = undefined, model, height, length, width, shape, unit) {
        return __awaiter(this, void 0, void 0, function* () {
            schedule = Utils_1.Utils.checkUndefined(schedule);
            let insertSql = "INSERT INTO `boiler_device` (`userId`, `name`, `description`, `mode`, `schedule`,`scheduleWeekend`, `sensorId`, `releStatus`," +
                " `lastLongitude`, `lastTemperature`, `lastUpdateTime`,`boilerModel`,`height`,`length`,`width`,`shape`,`unit`,`filling`) VALUES ('" + userId + "', '" + name + "', '" + description + "', '" + mode +
                "', '" + schedule + "', '" + scheduleWeekend + "', '" + sensorId + "', '0', '0', '0', current_timestamp(),'" + model + "','" + height + "','" + length + "','" + width + "','" + shape + "','" + unit + "', '0');";
            console.log(insertSql);
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((error, conn) => {
                    // If the connection with the database fails
                    if (error) {
                        reject({
                            http: 401,
                            status: "Failed",
                            error: error,
                        });
                    }
                    conn.query(insertSql, (err, results) => {
                        conn.release();
                        // If the query fails
                        if (err) {
                            reject({
                                http: 401,
                                status: "Failed",
                                error: err,
                            });
                        }
                        console.log(results);
                        // Response
                        resolve({
                            http: 200,
                            status: "Success",
                            response: "The boiler device has been created successfully.",
                        });
                    });
                });
            });
        });
    }
    changeBoilerStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            let insertSql = "UPDATE `boiler_device` SET releStatus=" + status + " WHERE id=" + id + ";";
            console.log(insertSql);
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((error, conn) => {
                    // If the connection with the database fails
                    if (error) {
                        reject({
                            http: 401,
                            status: "Failed",
                            error: error,
                        });
                    }
                    conn.query(insertSql, (err, results) => {
                        conn.release();
                        // If the query fails
                        if (err) {
                            reject({
                                http: 401,
                                status: "Failed",
                                error: err,
                            });
                        }
                        console.log(results);
                        // Response
                        resolve({
                            http: 200,
                            status: "Success",
                            response: "The boiler device has been updated successfully.",
                        });
                    });
                });
            });
        });
    }
    updateBoilerDevice(id, userId, name, description, sensorId, mode, schedule = undefined, scheduleWeekend = undefined, model, height, length, width, shape, unit) {
        return __awaiter(this, void 0, void 0, function* () {
            schedule = Utils_1.Utils.checkUndefined(schedule);
            let insertSql = "UPDATE `boiler_device` SET userId='" + userId + "', name='" + name + "', description='" + description +
                "', sensorId='" + sensorId + "' , mode='" + mode + "', schedule='" + schedule + "', scheduleWeekend='" + scheduleWeekend + "', boilerModel='" + model + "', height='" +
                height + "', length='" + length + "', width='" + width + "', shape='" + shape + "', unit='" + unit + " ', lastUpdateTime=now() WHERE id=" + id + ";";
            /*let insertSql = 'UPDATE `boiler_device` SET userId = @userId, name = @name, description = @description, ' +
                'sensorId = @sensorId, mode = @mode, schedule = @schedule, scheduleWeekend = @scheduleWeekend, ' +
                'boilerModel = @model, height = @height, length = @length, width = @width, ' +
                'shape = @shape, lastUpdateTime=now() WHERE id= @id;'*/
            console.log(insertSql);
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((error, conn) => {
                    // If the connection with the database fails
                    if (error) {
                        reject({
                            http: 401,
                            status: "Failed",
                            error: error,
                        });
                    }
                    conn.query(insertSql, (err, results) => {
                        conn.release();
                        // If the query fails
                        if (err) {
                            reject({
                                http: 401,
                                status: "Failed",
                                error: err,
                            });
                        }
                        console.log(results);
                        // Response
                        resolve({
                            http: 200,
                            status: "Success",
                            response: "The boiler device has been updated successfully.",
                        });
                    });
                });
            });
        });
    }
    // Falta scheduleWeekend
    updateBoilerDevicePingData(id, lastLongitude, lastTemperature, releStatus, hourOn, minuteOn, hourOff, minuteOff, scheduleMode) {
        return __awaiter(this, void 0, void 0, function* () {
            let mode = "manual";
            if (scheduleMode) {
                mode = "schedule";
            }
            let schedule = hourOn + ":" + minuteOn + "-" + hourOff + ":" + minuteOff;
            let updateSql = "UPDATE `boiler_device` SET lastLongitude='" + lastLongitude + "', lastTemperature='" + lastTemperature + "', releStatus=" +
                releStatus;
            if (mode == "schedule") {
                updateSql += ", schedule='" + schedule + "'";
            }
            updateSql += ", mode='" + mode + "', lastUpdateTime=now() WHERE id=" + id + ";";
            console.log("updateSql", updateSql);
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((error, conn) => {
                    // If the connection with the database fails
                    if (error) {
                        reject({
                            http: 401,
                            status: "Failed",
                            error: error,
                        });
                    }
                    conn.query(updateSql, (err, results) => {
                        conn.release();
                        // If the query fails
                        if (err) {
                            reject({
                                http: 401,
                                status: "Failed",
                                error: err,
                            });
                        }
                        console.log(results);
                        // Response
                        resolve({
                            http: 200,
                            status: "Success",
                            response: "The boiler device has been updated successfully.",
                        });
                    });
                });
            });
        });
    }
    // Falta scheduleWeekend
    updateBoilerDevicePingDataBySensorId(sensorId, lastLongitude, lastTemperature, releStatus, hourOn, minuteOn, hourOff, minuteOff, scheduleMode) {
        return __awaiter(this, void 0, void 0, function* () {
            let mode = "manual";
            if (scheduleMode) {
                mode = "schedule";
            }
            let schedule = hourOn + ":" + minuteOn + "-" + hourOff + ":" + minuteOff;
            let updateSql = "UPDATE `boiler_device` SET lastLongitude='" + lastLongitude + "', lastTemperature='" + lastTemperature + "', releStatus=" +
                releStatus;
            if (mode == "schedule") {
                updateSql += ", schedule='" + schedule + "'";
            }
            updateSql += ", mode='" + mode + "', lastUpdateTime=now() WHERE sensorId=" + sensorId + ";";
            console.log("updateSql", updateSql);
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((error, conn) => {
                    // If the connection with the database fails
                    if (error) {
                        reject({
                            http: 401,
                            status: "Failed",
                            error: error,
                        });
                    }
                    conn.query(updateSql, (err, results) => {
                        conn.release();
                        // If the query fails
                        if (err) {
                            reject({
                                http: 401,
                                status: "Failed",
                                error: err,
                            });
                        }
                        console.log(results);
                        // Response
                        resolve({
                            http: 200,
                            status: "Success",
                            response: "The boiler device has been updated successfully.",
                        });
                    });
                });
            });
        });
    }
    updateBoilerDevicePingDataTempDistV1(id, lastLongitude, lastTemperature) {
        return __awaiter(this, void 0, void 0, function* () {
            let updateSql = "UPDATE `boiler_device` SET lastLongitude='" + lastLongitude + "', lastTemperature='" + lastTemperature
                + "', lastUpdateTime=now() WHERE sensorId=" + id + ";";
            console.log("updateSql", updateSql);
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((error, conn) => {
                    // If the connection with the database fails
                    if (error) {
                        reject({
                            http: 401,
                            status: "Failed",
                            error: error,
                        });
                    }
                    conn.query(updateSql, (err, results) => {
                        conn.release();
                        // If the query fails
                        if (err) {
                            reject({
                                http: 401,
                                status: "Failed",
                                error: err,
                            });
                        }
                        console.log(results);
                        // Response
                        resolve({
                            http: 200,
                            status: "Success",
                            response: "The boiler device has been updated successfully.",
                        });
                    });
                });
            });
        });
    }
    //update Boiler Device temp and distance by sensor_id (shesh)
    updateBoilerDevicePingDataTempDistBySensorId(sesnorId, lastLongitude, lastTemperature) {
        return __awaiter(this, void 0, void 0, function* () {
            let updateSql = "UPDATE `boiler_device` SET lastLongitude='" + lastLongitude + "', lastTemperature='" + lastTemperature
                + "', lastUpdateTime=now() WHERE sensorId=" + sesnorId + ";";
            console.log("updateSql", updateSql);
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((error, conn) => {
                    // If the connection with the database fails
                    if (error) {
                        reject({
                            http: 401,
                            status: "Failed",
                            error: error,
                        });
                    }
                    conn.query(updateSql, (err, results) => {
                        conn.release();
                        // If the query fails
                        if (err) {
                            reject({
                                http: 401,
                                status: "Failed",
                                error: err,
                            });
                        }
                        console.log(results);
                        // Response
                        resolve({
                            http: 200,
                            status: "Success",
                            response: "The boiler device has been updated successfully.",
                        });
                    });
                });
            });
        });
    }
    updateBoilerDevicePingDataTempDistV1BySensorId(sensorId, lastLongitude, lastTemperature) {
        return __awaiter(this, void 0, void 0, function* () {
            let updateSql = "UPDATE `boiler_device` SET lastLongitude='" + lastLongitude + "', lastTemperature='" + lastTemperature
                + "', lastUpdateTime=now() WHERE sensorId=" + sensorId + ";";
            console.log("updateSql", updateSql);
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((error, conn) => {
                    // If the connection with the database fails
                    if (error) {
                        reject({
                            http: 401,
                            status: "Failed",
                            error: error,
                        });
                    }
                    conn.query(updateSql, (err, results) => {
                        conn.release();
                        // If the query fails
                        if (err) {
                            reject({
                                http: 401,
                                status: "Failed",
                                error: err,
                            });
                        }
                        console.log(results);
                        // Response
                        resolve({
                            http: 200,
                            status: "Success",
                            response: "The boiler device has been updated successfully.",
                        });
                    });
                });
            });
        });
    }
    // Falta scheduleWeekend
    updateBoilerDevicePingDataScheduleV1(id, releStatus, hourOn, minuteOn, hourOff, minuteOff, scheduleMode) {
        return __awaiter(this, void 0, void 0, function* () {
            let mode = "manual";
            if (scheduleMode) {
                mode = "schedule";
            }
            let schedule = hourOn + ":" + minuteOn + "-" + hourOff + ":" + minuteOff;
            let updateSql = "UPDATE `boiler_device` SET releStatus=" + releStatus;
            if (mode == "schedule") {
                updateSql += ", schedule='" + schedule;
            }
            updateSql += ", mode='" + mode + "', lastUpdateTime=now() WHERE id=" + id + ";";
            console.log("updateSql", updateSql);
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((error, conn) => {
                    // If the connection with the database fails
                    if (error) {
                        reject({
                            http: 401,
                            status: "Failed",
                            error: error,
                        });
                    }
                    conn.query(updateSql, (err, results) => {
                        conn.release();
                        // If the query fails
                        if (err) {
                            reject({
                                http: 401,
                                status: "Failed",
                                error: err,
                            });
                        }
                        console.log(results);
                        // Response
                        resolve({
                            http: 200,
                            status: "Success",
                            response: "The boiler device has been updated successfully.",
                        });
                    });
                });
            });
        });
    }
    updateBoilerDevicePingDataScheduleV1BySensorId(id, releStatus, hourOn, minuteOn, hourOff, minuteOff, scheduleMode) {
        return __awaiter(this, void 0, void 0, function* () {
            let mode = "manual";
            if (scheduleMode) {
                mode = "schedule";
            }
            let schedule = hourOn + ":" + minuteOn + "-" + hourOff + ":" + minuteOff;
            let updateSql = "UPDATE `boiler_device` SET releStatus=" + releStatus;
            if (mode == "schedule") {
                updateSql += ", schedule='" + schedule;
            }
            updateSql += ", mode='" + mode + "', lastUpdateTime=now() WHERE id=" + id + ";";
            console.log("updateSql", updateSql);
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((error, conn) => {
                    // If the connection with the database fails
                    if (error) {
                        reject({
                            http: 401,
                            status: "Failed",
                            error: error,
                        });
                    }
                    conn.query(updateSql, (err, results) => {
                        conn.release();
                        // If the query fails
                        if (err) {
                            reject({
                                http: 401,
                                status: "Failed",
                                error: err,
                            });
                        }
                        console.log(results);
                        // Response
                        resolve({
                            http: 200,
                            status: "Success",
                            response: "The boiler device has been updated successfully.",
                        });
                    });
                });
            });
        });
    }
    deleteBoilerDevice(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let deleteSql = "DELETE FROM boiler_device WHERE id=" + id + ";";
            console.log(deleteSql);
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((error, conn) => {
                    // If the connection with the database fails
                    if (error) {
                        reject({
                            http: 401,
                            status: "Failed",
                            error: error,
                        });
                    }
                    conn.query(deleteSql, (err, results) => {
                        conn.release();
                        // If the query fails
                        if (err) {
                            reject({
                                http: 401,
                                status: "Failed",
                                error: err,
                            });
                        }
                        console.log(results);
                        // Response
                        resolve({
                            http: 200,
                            status: "Success",
                            response: "The boiler device has been deleted successfully.",
                        });
                    });
                });
            });
        });
    }
    getBoilerById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    var select_query = "SELECT * FROM `boiler_device` WHERE id=" + id + ";";
                    console.log(select_query);
                    conn.query(select_query, (err, results) => {
                        if (err) {
                            reject({
                                http: 401,
                                status: "Failed",
                                error: err,
                            });
                        }
                        else {
                            if (results && results.length == 0) {
                                resolve({
                                    http: 204,
                                    status: "Success",
                                    result: "There is no boiler with given id",
                                });
                            }
                            else {
                                resolve({
                                    http: 200,
                                    status: "Success",
                                    result: results[0],
                                });
                            }
                        }
                    });
                });
            });
        });
    }
    getBoilersPaginated(userId, pageSize, pageIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    const first_value = (pageSize * pageIndex) - pageSize;
                    var select_query = "SELECT * FROM `boiler_device` WHERE userId=" + userId + " ORDER BY `id` DESC LIMIT " + first_value + ', ' + pageSize + ";";
                    console.log(select_query);
                    conn.query(select_query, (err, results) => {
                        conn.release();
                        if (err) {
                            reject({
                                http: 401,
                                status: "Failed",
                                error: err,
                            });
                        }
                        else {
                            if (results && results.length == 0) {
                                resolve({
                                    http: 204,
                                    status: "Success",
                                    result: "There are no related boilers to this user",
                                });
                            }
                            else {
                                resolve({
                                    http: 200,
                                    status: "Success",
                                    result: results,
                                });
                            }
                        }
                    });
                });
            });
        });
    }
}
exports.default = new BoilerController();
