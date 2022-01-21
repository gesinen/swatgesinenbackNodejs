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
            var query_servers = "SELECT server_id, id, name FROM gateways WHERE user_id = " + userId;
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((error, conn) => {
                    if (error) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: error
                        });
                    }
                    conn.query(query_servers, (err, results) => {
                        if (err) {
                            reject({
                                http: 401,
                                status: 'Failed',
                                error: err
                            });
                        }
                        let gateway_id = results[0].id;
                        var servers = [];
                        for (let i = 0; i < results.length; i++) {
                            const element = results[i];
                            servers.push(element.name);
                        }
                        var query2 = "SELECT u.first_name AS user_name, COUNT(si.id) AS sensors FROM sensor_info AS si INNER JOIN users AS u ON u.id = si.user_id WHERE si.user_id = " + userId;
                        conn.query(query2, (err2, results2) => {
                            conn.release();
                            if (err2) {
                                reject({
                                    http: 401,
                                    status: 'Failed',
                                    error: err2
                                });
                            }
                            let obj = {
                                network_servers: servers,
                                sensors: results2[0].sensors,
                                user_name: results2[0].user_name
                            };
                            resolve({
                                http: 200,
                                status: 'Success',
                                result: obj
                            });
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
            var query = "SELECT id, rssi, dr FROM sensor_info WHERE user_id = " + userId;
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
                            if (element.rssi >= -105) {
                                resp.rssi.excellent++;
                            }
                            else if (element.rssi >= -110) {
                                resp.rssi.very_good++;
                            }
                            else if (element.rssi >= -115) {
                                resp.rssi.good++;
                            }
                            else if (element.rssi >= -120) {
                                resp.rssi.low++;
                            }
                            else if (element.rssi < -120) {
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
            var query = "SELECT id, name, lost_fCnt, first_frame_counter_fCnt, latest_frame_counter_fCnt FROM sensor_info WHERE user_id = " + userId;
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
    // Root users
    getNetworkServerGeneralInformationRoot() {
        return __awaiter(this, void 0, void 0, function* () {
            var query_servers = "SELECT server_id, id, name FROM gateways";
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((error, conn) => {
                    if (error) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: error
                        });
                    }
                    conn.query(query_servers, (err, results) => {
                        if (err) {
                            reject({
                                http: 401,
                                status: 'Failed',
                                error: err
                            });
                        }
                        let gateway_name = results[0].name;
                        let gateway_id = results[0].id;
                        let server_id_raw = results[0].server_id;
                        let server_ids = server_id_raw.split(',');
                        var query2 = "SELECT s.name AS network_servers, (SELECT COUNT( si.id) FROM sensor_info AS si) AS sensors, u.first_name AS user_name FROM servers s LEFT JOIN users AS u ON u.id = s.user_id WHERE s.id = ";
                        let servers_query = "";
                        for (let i = 0; i < server_ids.length; i++) {
                            const element = server_ids[i];
                            if (i == 0) {
                                servers_query += "" + element + "";
                            }
                            else {
                                servers_query += " OR s.id = " + element + "";
                            }
                        }
                        if (servers_query.length <= 0) {
                            query2 += 0;
                        }
                        else {
                            query2 += servers_query;
                        }
                        conn.query(query2, (err2, results2) => {
                            conn.release();
                            if (err2) {
                                reject({
                                    http: 401,
                                    status: 'Failed',
                                    error: err2
                                });
                            }
                            let obj = {
                                network_servers: new Array(),
                                sensors: results2[0].sensors,
                                user_name: results2[0].user_name,
                                gateway_name: gateway_name
                            };
                            for (let i = 0; i < results2.length; i++) {
                                const element = results2[i];
                                obj.network_servers.push(element.network_servers);
                            }
                            resolve({
                                http: 200,
                                status: 'Success',
                                result: obj
                            });
                        });
                    });
                });
            });
        });
    } // ()
    getNetworkServerSensorStatusRoot() {
        return __awaiter(this, void 0, void 0, function* () {
            var query = "SELECT si.device_EUI, sp.status FROM sensor_ping AS sp INNER JOIN sensor_info AS si ON sp.device_EUI = si.device_EUI";
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
    getNetworkServerSensorSignalRoot() {
        return __awaiter(this, void 0, void 0, function* () {
            var query = "SELECT id, rssi FROM sensor_info";
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
    getNetworkServerPackagesRoot() {
        return __awaiter(this, void 0, void 0, function* () {
            var query = "SELECT id, name, lost_fCnt, first_frame_counter_fCnt, latest_frame_counter_fCnt FROM sensor_info";
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
    //////
    getNetworkServers(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var query_servers = "SELECT server_id, id, name FROM gateways WHERE user_id = " + userId;
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((error, conn) => {
                    if (error) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: error
                        });
                    }
                    conn.query(query_servers, (err, results) => {
                        conn.release();
                        if (err) {
                            reject({
                                http: 401,
                                status: 'Failed',
                                error: err
                            });
                        }
                        var servers = [];
                        var ids = [];
                        var res = [];
                        for (let i = 0; i < results.length; i++) {
                            const element = results[i];
                            let server_names = element.name;
                            let server_ids = element.id;
                            res.push({
                                id: server_ids,
                                name: server_names
                            });
                        }
                        resolve({
                            http: 200,
                            status: 'Success',
                            result: res
                        });
                    });
                });
            });
        });
    }
    getAllNetworkServers() {
        return __awaiter(this, void 0, void 0, function* () {
            var query_servers = "SELECT server_id, id, name FROM gateways";
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((error, conn) => {
                    if (error) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: error
                        });
                    }
                    conn.query(query_servers, (err, results) => {
                        conn.release();
                        if (err) {
                            reject({
                                http: 401,
                                status: 'Failed',
                                error: err
                            });
                        }
                        var servers = [];
                        var ids = [];
                        var res = [];
                        for (let i = 0; i < results.length; i++) {
                            const element = results[i];
                            let server_names = element.name;
                            let server_ids = element.id;
                            res.push({
                                id: server_ids,
                                name: server_names
                            });
                        }
                        resolve({
                            http: 200,
                            status: 'Success',
                            result: res
                        });
                    });
                });
            });
        });
    }
    getNetworkServerGeneralInformationSelected(networkServerId) {
        return __awaiter(this, void 0, void 0, function* () {
            var query_servers = "SELECT server_id, id, name, user_id, sensors_id FROM gateways WHERE id = " + networkServerId;
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((error, conn) => {
                    if (error) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: error
                        });
                    }
                    conn.query(query_servers, (err, results) => {
                        if (err) {
                            reject({
                                http: 401,
                                status: 'Failed',
                                error: err
                            });
                        }
                        var servers = [];
                        var user;
                        var sensors = [];
                        for (let i = 0; i < results.length; i++) {
                            const element = results[i];
                            servers.push(element.name);
                            user = element.user_id;
                            sensors.push(element.sensors_id.split(","));
                        }
                        var query2 = "SELECT id FROM sensor_info AS si WHERE ";
                        let ind = 0;
                        sensors[0].forEach((element) => {
                            if (ind == sensors[0].length - 1) {
                                query2 += "si.id = " + element;
                            }
                            else {
                                query2 += "si.id = " + element + " OR ";
                            }
                            ind += 1;
                        });
                        conn.query(query2, (err2, results2) => {
                            conn.release();
                            if (err2) {
                                reject({
                                    http: 401,
                                    status: 'Failed',
                                    error: err2
                                });
                            }
                            let obj = {
                                network_servers: servers,
                                sensors: results2.length
                            };
                            resolve({
                                http: 200,
                                status: 'Success',
                                result: obj
                            });
                        });
                    });
                });
            });
        });
    } // ()
    getNetworkServerSensorStatusSelected(gatewayId) {
        return __awaiter(this, void 0, void 0, function* () {
            var query_servers = "SELECT user_id, sensors_id FROM gateways WHERE id = " + gatewayId;
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((error, conn) => {
                    if (error) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: error
                        });
                    }
                    conn.query(query_servers, (err, results) => {
                        if (err) {
                            reject({
                                http: 401,
                                status: 'Failed',
                                error: err
                            });
                        }
                        var sensors = [];
                        for (let i = 0; i < results.length; i++) {
                            const element = results[i];
                            sensors.push(element.sensors_id.split(","));
                        }
                        var query2 = "SELECT si.device_EUI, sp.status FROM sensor_ping AS sp INNER JOIN sensor_info AS si ON sp.device_EUI = si.device_EUI WHERE ";
                        let ind = 0;
                        sensors[0].forEach((element) => {
                            if (ind == sensors[0].length - 1) {
                                query2 += "si.id = " + element;
                            }
                            else {
                                query2 += "si.id = " + element + " OR ";
                            }
                            ind += 1;
                        });
                        conn.query(query2, (err, results2) => {
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
                            results2.forEach((element) => {
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
        });
    } // ()
    getNetworkServerSensorSignalSelected(gatewayId) {
        return __awaiter(this, void 0, void 0, function* () {
            var query_servers = "SELECT user_id, sensors_id FROM gateways WHERE id = " + gatewayId;
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((error, conn) => {
                    if (error) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: error
                        });
                    }
                    conn.query(query_servers, (err, results) => {
                        if (err) {
                            reject({
                                http: 401,
                                status: 'Failed',
                                error: err
                            });
                        }
                        var sensors = [];
                        for (let i = 0; i < results.length; i++) {
                            const element = results[i];
                            sensors.push(element.sensors_id.split(","));
                        }
                        var query2 = "SELECT id, rssi, dr FROM sensor_info AS si WHERE ";
                        let ind = 0;
                        sensors[0].forEach((element) => {
                            if (ind == sensors[0].length - 1) {
                                query2 += "si.id = " + element;
                            }
                            else {
                                query2 += "si.id = " + element + " OR ";
                            }
                            ind += 1;
                        });
                        console.log('probando ------------', query2);
                        conn.query(query2, (err, results2) => {
                            conn.release();
                            console.log('testing ==============', results2);
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
                            results2.forEach((element) => {
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
                                if (element.rssi >= -105) {
                                    resp.rssi.excellent++;
                                }
                                else if (element.rssi >= -110) {
                                    resp.rssi.very_good++;
                                }
                                else if (element.rssi >= -115) {
                                    resp.rssi.good++;
                                }
                                else if (element.rssi >= -120) {
                                    resp.rssi.low++;
                                }
                                else if (element.rssi < -120) {
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
        });
    } // ()
    getNetworkServerPackagesSelected(gatewayId) {
        return __awaiter(this, void 0, void 0, function* () {
            var query_servers = "SELECT user_id, sensors_id FROM gateways WHERE id = " + gatewayId;
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((error, conn) => {
                    if (error) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: error
                        });
                    }
                    conn.query(query_servers, (err, results) => {
                        if (err) {
                            reject({
                                http: 401,
                                status: 'Failed',
                                error: err
                            });
                        }
                        var sensors = [];
                        for (let i = 0; i < results.length; i++) {
                            const element = results[i];
                            sensors.push(element.sensors_id.split(","));
                        }
                        var query2 = "SELECT id, name, lost_fCnt, first_frame_counter_fCnt, latest_frame_counter_fCnt FROM sensor_info AS si WHERE ";
                        let ind = 0;
                        sensors[0].forEach((element) => {
                            if (ind == sensors[0].length - 1) {
                                query2 += "si.id = " + element;
                            }
                            else {
                                query2 += "si.id = " + element + " OR ";
                            }
                            ind += 1;
                        });
                        conn.query(query2, (err, results) => {
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
        });
    } // ()
}
exports.default = LoraDashboardController;
