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
const Utils_1 = require("../../utils/Utils");
/*
 * /water/
 */
class BoilerController {
    createBoilerDevice(userId, name, description, sensorId, mode, schedule = undefined, model, height, length, width) {
        return __awaiter(this, void 0, void 0, function* () {
            schedule = Utils_1.Utils.checkUndefined(schedule);
            let insertSql = "INSERT INTO `boiler_device` (`userId`, `name`, `description`, `mode`, `schedule`, `sensorId`, `releStatus`," +
                " `lastLongitude`, `lastTemperature`, `lastUpdateTime`,`boilerModel`,`height`,`length`,`width`) VALUES ('" + userId + "', '" + name + "', '" + description + "', '" + mode +
                "', '" + schedule + "', '" + sensorId + "', '0', '0', '0', current_timestamp(),'" + model + "','" + height + "','" + length + "','" + width + "');";
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
    updateBoilerDevice(id, userId, name, description, sensorId, mode, schedule = undefined, model, height, length, width) {
        return __awaiter(this, void 0, void 0, function* () {
            schedule = Utils_1.Utils.checkUndefined(schedule);
            let insertSql = "UPDATE `boiler_device` SET userId='" + userId + "', name='" + name + "', description='" + description +
                "', sensorId='" + sensorId + "' , mode='" + mode + "', schedule='" + schedule + "', boilerModel='" + model + "', height='" +
                height + "', length='" + length + "', width='" + width + "', lastUpdateTime=now() WHERE id=" + id + ";";
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
    updateBoilerDevicePingDataTempDistV1(id, lastLongitude, lastTemperature) {
        return __awaiter(this, void 0, void 0, function* () {
            let updateSql = "UPDATE `boiler_device` SET lastLongitude='" + lastLongitude + "', lastTemperature='" + lastTemperature
                + "', lastUpdateTime=now() WHERE id=" + id + ";";
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
