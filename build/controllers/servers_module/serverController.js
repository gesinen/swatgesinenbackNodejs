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
 * /water/
 */
class ServerController {
    /**
     * GET ('/list')
     * Get server list
     * @return Promise<object>
     */
    getUserServerList(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            var query = "SELECT id,name FROM `servers` WHERE user_id = " + user_id + ";";
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((error, conn) => {
                    // If the connection with the database fails
                    if (error) {
                        reject({
                            http: 401,
                            status: 'Failed to connect to database',
                            error: error
                        });
                    }
                    conn.query(query, (err, results) => {
                        conn.release();
                        // If the query fails
                        if (err) {
                            reject({
                                http: 401,
                                status: 'Failed',
                                error: err
                            });
                        }
                        // Response
                        if (results && results.length == 0) {
                            resolve({
                                http: 204,
                                status: 'Success',
                                result: "Error no server found with the given id",
                            });
                        }
                        else {
                            resolve({
                                http: 200,
                                status: 'Success',
                                result: results
                            });
                        }
                    });
                });
            });
        });
    } // importFile()
    /**
     * GET ('/server/sensor_server_detail')
     * Get server list
     * @return Promise<object>
     */
    getSensorServerDetail(sensor_id) {
        return __awaiter(this, void 0, void 0, function* () {
            var query = "SELECT `server_id` FROM `sensor_server_detail` WHERE `sensor_id`=" + sensor_id + ";";
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((error, conn) => {
                    // If the connection with the database fails
                    if (error) {
                        reject({
                            http: 401,
                            status: 'Failed to connect to database',
                            error: error
                        });
                    }
                    conn.query(query, (err, results) => {
                        conn.release();
                        // If the query fails
                        if (err) {
                            reject({
                                http: 401,
                                status: 'Failed',
                                error: err
                            });
                        }
                        // Response
                        if (results && results.length == 0) {
                            resolve({
                                http: 204,
                                status: 'Success',
                                result: "Error no network server found with the given sensor_id",
                            });
                        }
                        else {
                            resolve({
                                http: 200,
                                status: 'Success',
                                result: results[0]
                            });
                        }
                    });
                });
            });
        });
    } // importFile()
    /**
     * GET ('/providerIdAndToken')
     * Get server provider_id and auth token
     *
     * @param server_id id of the serve we are retrieving the info from
     *
     * @return
     */
    getServerTokenAndProviderId(server_id) {
        return __awaiter(this, void 0, void 0, function* () {
            var query = "SELECT provider_id, authorization_token FROM `servers` WHERE id = " + server_id + ";";
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((error, conn) => {
                    // If the connection with the database fails
                    if (error) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: error
                        });
                    }
                    conn.query(query, (err, results) => {
                        conn.release();
                        // If the query fails
                        if (err) {
                            reject({
                                http: 401,
                                status: 'Failed',
                                error: err
                            });
                        }
                        // Response
                        if (results && results.length == 0) {
                            resolve({
                                http: 204,
                                status: 'Success',
                                result: "Error no server found with the given id",
                            });
                        }
                        else {
                            resolve({
                                http: 200,
                                status: 'Success',
                                result: results[0]
                            });
                        }
                    });
                });
            });
        });
    } // getServerTokenAndProviderId()
    /**
     * POST ('/serverLinkToGateway')
     * Gets gateway <-> server information -> server_id & pk_id
     *
     * @param gatewayMac mac of the gateway
     *
     * @return
     */
    getGatewaysServerInfo(gateway_mac) {
        var query = "SELECT server_gateway_pkid.server_id, server_gateway_pkid.pk_id, servers.name, servers.type " +
            "FROM `server_gateway_pkid` INNER JOIN `servers` ON server_gateway_pkid.server_id=servers.id WHERE `mac_number`= '"
            + gateway_mac + "';";
        return new Promise((resolve, reject) => {
            database_1.default.getConnection((error, conn) => {
                // If the connection with the database fails
                if (error) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: error
                    });
                }
                conn.query(query, (err, results) => {
                    conn.release();
                    // If the query fails
                    if (err) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: err
                        });
                    }
                    // Response
                    //console.log(results)
                    resolve({
                        http: 200,
                        status: 'Success',
                        results: results
                    });
                });
            });
        });
    }
    /**
     * POST ('/serverLinkToGateway')
     * Creates row in server_gateway_pkid (links server to gateway)
     *
     * @param server_id id of the server
     * @param pk_id pk_id of the server on gateway
     * @param gatewayMac mac of the gateway
     *
     * @return
     */
    createServerAndGatewayLink(gateway_mac, server_id, pk_id) {
        var query = "INSERT INTO `server_gateway_pkid` (`mac_number`, `server_id`, `pk_id`) " +
            "VALUES ('" + gateway_mac + "','" + server_id + "','" + pk_id + "');";
        return new Promise((resolve, reject) => {
            database_1.default.getConnection((error, conn) => {
                // If the connection with the database fails
                if (error) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: error
                    });
                }
                conn.query(query, (err, results) => {
                    conn.release();
                    // If the query fails
                    if (err) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: err
                        });
                    }
                    // Response
                    resolve({
                        http: 200,
                        status: 'Success'
                    });
                });
            });
        });
    }
}
exports.default = new ServerController();
