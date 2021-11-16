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
class LoraDashboardController {
    getNetworkServerGeneralInformation(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            /* var query = "SELECT COUNT(s.id) AS network_servers, s.user_id, s.id, COUNT(sn.id) AS sensors, u.user_name FROM servers AS s INNER JOIN sensor_server_detail AS ssd ON s.id = ssd.server_id INNER JOIN sensor_info AS sn ON ssd.sensor_id = sn.id INNER JOIN users AS u ON u.id = s.user_id WHERE s.user_id = " + userId + " OR u.under_admin = " + userId; */
            /* var query = "SELECT COUNT(s.id) AS network_servers, (SELECT COUNT( ssd.server_id) FROM sensor_server_detail AS ssd WHERE ssd.server_id = s.id) AS sensors, u.first_name AS user_name FROM servers s LEFT JOIN users AS u ON u.id = s.user_id WHERE s.user_id = "+ userId +" OR u.under_admin = " + userId; */
            var query = "SELECT COUNT(s.id) AS network_servers, (SELECT COUNT( si.id) FROM sensor_info AS si WHERE si.user_id = " + userId + ") AS sensors, u.first_name AS user_name FROM servers s LEFT JOIN users AS u ON u.id = s.user_id WHERE s.user_id = " + userId + " OR u.under_admin = " + userId;
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((error, conn) => {
                    if (error) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: error
                        });
                    }
                    conn.query(query, (err, results) => {
                        conn.release();
                        if (err) {
                            reject({
                                http: 401,
                                status: 'Failed',
                                error: err
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
    } // ()
    getNetworkServerSensorStatus(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var query = "SELECT si.device_EUI, sp.status FROM sensor_ping AS sp INNER JOIN sensor_info AS si ON sp.device_EUI = si.device_EUI WHERE si.user_id = " + userId;
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((error, conn) => {
                    if (error) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: error
                        });
                    }
                    conn.query(query, (err, results) => {
                        conn.release();
                        if (err) {
                            reject({
                                http: 401,
                                status: 'Failed',
                                error: err
                            });
                        }
                        let activeSensors = [];
                        let desactiveSensors = [];
                        results.forEach((element) => {
                            if (element.status == 'Active') {
                                activeSensors.push(element);
                            }
                            else {
                                desactiveSensors.push(element);
                            }
                        });
                        resolve({
                            http: 200,
                            status: 'Success',
                            result: {
                                active_sensors: activeSensors,
                                desactive_sensors: desactiveSensors
                            }
                        });
                    });
                });
            });
        });
    } // ()
    getNetworkServerSensorSignal(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var query = "SELECT id, rssi FROM sensor_info WHERE user_id = " + userId;
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((error, conn) => {
                    if (error) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: error
                        });
                    }
                    conn.query(query, (err, results) => {
                        conn.release();
                        if (err) {
                            reject({
                                http: 401,
                                status: 'Failed',
                                error: err
                            });
                        }
                        let resp = {
                            spreading_factor: {
                                DR5: 0,
                                DR4: 0,
                                DR3: 0,
                                DR2: 0,
                                DR1: 0,
                                DR0: 0,
                                NC: 0
                            },
                            rssi: {
                                excellent: 0,
                                very_good: 0,
                                good: 0,
                                low: 0,
                                very_low: 0,
                                no_signal: 0
                            }
                        };
                        results.forEach((element) => {
                            // Spreading factor
                            if (element.dr >= 10) {
                                resp.spreading_factor.DR5++;
                            }
                            else if (element.dr >= 8) {
                                resp.spreading_factor.DR4++;
                            }
                            else if (element.dr >= 6) {
                                resp.spreading_factor.DR3++;
                            }
                            else if (element.dr >= 4) {
                                resp.spreading_factor.DR2++;
                            }
                            else if (element.dr >= 2) {
                                resp.spreading_factor.DR1++;
                            }
                            else if (element.dr >= 0) {
                                resp.spreading_factor.DR0++;
                            }
                            else {
                                resp.spreading_factor.NC++;
                            }
                            // RSSI
                            if (element.rssi >= -50) {
                                resp.rssi.excellent++;
                            }
                            else if (element.rssi >= -60) {
                                resp.rssi.very_good++;
                            }
                            else if (element.rssi >= -70) {
                                resp.rssi.good++;
                            }
                            else if (element.rssi >= -80) {
                                resp.rssi.low++;
                            }
                            else if (element.rssi >= -90) {
                                resp.rssi.very_low++;
                            }
                            else {
                                resp.rssi.no_signal++;
                            }
                        });
                        resolve({
                            http: 200,
                            status: 'Success',
                            result: resp
                        });
                    });
                });
            });
        });
    } // ()
    getNetworkServerPackages(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var query = "SELECT id, name, lost_fCnt FROM sensor_info WHERE user_id = " + userId;
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((error, conn) => {
                    if (error) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: error
                        });
                    }
                    conn.query(query, (err, results) => {
                        conn.release();
                        if (err) {
                            reject({
                                http: 401,
                                status: 'Failed',
                                error: err
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
    } // ()
}
exports.default = LoraDashboardController;
