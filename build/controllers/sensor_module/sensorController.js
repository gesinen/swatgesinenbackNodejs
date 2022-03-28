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
class SensorController {
    /**
     * POST ('/import')
     * Importing water_obeservation_value records from xls file
     *
     * @param json_file_data xls file info formated on json
     * @param resolveCbFn fn called when values to insert are prepared
     *
     * @return
     */
    createMultipleSensors(sensors, provider_id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log("creating multiple sensors")
            //public async createMultipleSensors(user_id: any, name: any, description: any, provider: any, device_EUI: any, app_EUI: any, app_KEY: any): Promise<object> {
            let insert_values = "";
            sensors.forEach((element, index) => {
                insert_values +=
                    "('" +
                        Utils_1.Utils.checkUndefined(user_id) +
                        "','" +
                        Utils_1.Utils.checkUndefined(element.Name) +
                        "','" +
                        Utils_1.Utils.checkUndefined(element.Description) +
                        "','" +
                        Utils_1.Utils.checkUndefined(provider_id) +
                        "','" +
                        Utils_1.Utils.checkUndefined(element.device_EUI) +
                        "','" +
                        Utils_1.Utils.checkUndefined(element.app_EUI) +
                        "','" +
                        Utils_1.Utils.checkUndefined(element.app_KEY) +
                        "',current_timestamp(), current_timestamp()),";
            });
            var query = "INSERT INTO `sensor_info` (`user_id`, `name`, `description`, `provider`, `device_EUI`, `app_EUI`, " +
                "`app_KEY`, `created_dt`, `updated_dt`) VALUES " +
                insert_values.slice(0, -1) +
                ";";
            //console.log(query)
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
                    conn.query(query, (err, results) => {
                        conn.release();
                        // If the query fails
                        if (err) {
                            reject({
                                http: 401,
                                status: "Failed",
                                error: err,
                            });
                        }
                        // Response
                        resolve({
                            http: 200,
                            status: "Success",
                            response: "The sensors have been created successfully.",
                        });
                    });
                });
            });
        });
    } // importFile()
    /**
     * GET ('/byDevEUI')
     * Importing water_obeservation_value records from xls file
     *
     * @param json_file_data xls file info formated on json
     *
     * @return
     */
    // get sensor + server info by given devEUI
    getSensorsByDevEUI2(json_file_data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                //console.log("createMultipleWaterDevices")
                database_1.default.getConnection((err, conn) => {
                    //console.log(err)
                    var sensors_EUI = "";
                    //console.log("file on controller")
                    //console.log(json_file_data)
                    json_file_data.forEach((element, index) => {
                        sensors_EUI += "'" + element.device_EUI + "',";
                    });
                    var select_query = "SELECT * FROM `sensor_info` INNER JOIN sensor_server_detail ON " +
                        "sensor_server_detail.sensor_id=sensor_info.id INNER JOIN servers ON " +
                        "servers.id=sensor_server_detail.server_id WHERE `sensor_info`.`device_EUI` IN " +
                        "(" +
                        sensors_EUI.slice(0, -1) +
                        ") ORDER BY sensor_info.id ASC;";
                    //console.log("*** select_query ***")
                    //console.log(select_query)
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
                                    result: [],
                                    message: "There are no sensors matching the given devices EUI",
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
    addSensorObservationsFromSentilo(sensorName, sensorServerUrl, sensorProvider, identityKey) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var request = require("request");
                /*var options = {
                          'method': 'GET',
                          'url': 'https://connecta.dival.es/sentilo-api/data/quatretonda@geswat/WaterExternaQUAGWTC0005S01?from=01/10/2021T00:48:00&to=25/11/2021T14:48:0&limit=20',
                          'headers': {
                              'IDENTITY_KEY': 'c983789060185ad5928cd9e1ce3f59595b74ae566d985788b42e14eb5dbbe7db',
                              'Content-Type': 'application/json'
                          }
                      };*/
                let toDateNow = new Date(Date.now())
                    .toISOString()
                    .replace("-", "/")
                    .replace("-", "/")
                    .slice(0, -1);
                //console.log(toDateNow)
                var options = {
                    method: "GET",
                    url: "https://connecta.dival.es/sentilo-api/data/" +
                        sensorProvider +
                        "/" +
                        sensorName +
                        "S01",
                    headers: {
                        IDENTITY_KEY: identityKey,
                        "Content-Type": "application/json",
                    },
                };
                //console.log("***** request (options) ******")
                //console.log(options)
                request(options, function (error, response) {
                    if (error) {
                        reject(error);
                    }
                    //console.log("***** response ******")
                    //console.log(response)
                    let observations;
                    try {
                        observations = JSON.parse(response.body);
                        resolve(observations);
                    }
                    catch (error) {
                        //console.log(error)
                    }
                    //console.log("***** observations ******")
                    //console.log(observations)
                });
            });
        });
    }
    /**
     * GET ('/byDevEUI')
     * Importing water_obeservation_value records from xls file
     *
     * @param json_file_data xls file info formated on json
     *
     * @return
     */
    // get sensor + server info by given devEUI
    getSensorsByDevEUI(json_file_data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                //console.log("createMultipleWaterDevices")
                database_1.default.getConnection((err, conn) => {
                    //console.log(err)
                    var sensors_EUI = "";
                    //console.log("file on controller")
                    //console.log(json_file_data)
                    json_file_data.forEach((element, index) => {
                        sensors_EUI += "'" + element.device_EUI + "',";
                    });
                    var select_query = "SELECT * FROM `sensor_info` WHERE `device_EUI` IN (" +
                        sensors_EUI.slice(0, -1) +
                        ") ORDER BY `id` ASC;";
                    //console.log(select_query)
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
                                    result: [],
                                    message: "There are no sensors matching the given devices EUI",
                                });
                            }
                            else {
                                //console.log("**** results getSensorsInfoQuery ****");
                                //console.log(results);
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
    /**
     * GET ('/sensorGatewayId/:sensorId')
     * Gets sensor relater gateway id
     *
     * @param json_file_data xls file info formated on json
     *
     * @return
     */
    // create water devices from the recently created sensors
    getSensorGatewayId(sensorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    var select_query = "SELECT `gateways`.`id` FROM `sensor_gateway_pkid` INNER JOIN `gateways` ON `sensor_gateway_pkid`.`mac_number`=`gateways`.`mac` WHERE `sensor_gateway_pkid`.`sensor_id`=" +
                        sensorId +
                        ";";
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
                                    result: "There are no related gateway to this sensor",
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
}
exports.default = new SensorController();
