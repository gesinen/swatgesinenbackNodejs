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
const sensorController_1 = __importDefault(require("../sensor_module/sensorController"));
const waterUsersController_1 = __importDefault(require("./waterUsersController"));
class WaterDevicesController {
    /**
     * POST ('/import')
     * Importing water_observation_value records from xls file
     * @param json_file_data xls file info formated on json
     * @param municipality_id id of the municipality (device table)
     * @param provider_id id of the provider (sensor table)
     * @param user_id id of the user importing the devices
     * @return Promise
     */
    importFile(json_file_data, municipality_id, user_id, provider, authToken, selectedUnitValue) {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log("**** importFileController ****")
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                // First we check if we have the given sensors -> deviceEUI
                yield sensorController_1.default
                    .getSensorsByDevEUI(json_file_data)
                    .then((response) => __awaiter(this, void 0, void 0, function* () {
                    //console.log("*********** getSensorsByDevEUI response ***********")
                    if (response.result.length == 0) {
                        resolve({
                            http: 204,
                            status: "Success",
                            message: "There are no sensors with the given DEVEUI",
                        });
                    }
                    //console.log("***** json_file_data *****")
                    //console.log(json_file_data)
                    //console.log("***** getSensorsByDevEUI *****")
                    //console.log(response.result)
                    let DeviceEUIcheckResponse = yield this.addSensorWaterInfo(response.result, json_file_data);
                    let json_data = DeviceEUIcheckResponse.addedSensors;
                    //console.log("***** json_data *****")
                    //console.log(json_data)
                    let contador = 0;
                    try {
                        for (const addedSensorRow of json_data) {
                            // provider and authorization token can be given
                            let lastObservation;
                            if (provider != undefined && authToken != undefined) {
                                //console.log("***** addedSensorRow.name *****")
                                //console.log(addedSensorRow.name)
                                lastObservation =
                                    yield sensorController_1.default.addSensorObservationsFromSentilo(addedSensorRow.name, addedSensorRow.server_url, provider, authToken);
                                //console.log("*** usando token y auth por parametro ***")
                            }
                            else {
                                lastObservation =
                                    yield sensorController_1.default.addSensorObservationsFromSentilo(addedSensorRow.name, addedSensorRow.server_url, addedSensorRow.provider_id, addedSensorRow.authorization_token);
                                //console.log("*** usando token y auth desde sensor_info ***")
                            }
                            if (lastObservation != undefined && lastObservation.code != 401) {
                                if (selectedUnitValue == "liter") {
                                    json_data[contador].lastObservation =
                                        lastObservation.observations[0].value / 1000;
                                }
                                else {
                                    json_data[contador].lastObservation =
                                        lastObservation.observations[0].value;
                                }
                                //console.log(lastObservation.observations[0])
                                json_data[contador].lastObservationDate =
                                    lastObservation.observations[0].time;
                            }
                            contador++;
                        }
                    }
                    catch (error) {
                        console.log(error);
                    }
                    //console.log("***** json_data after observations *****")
                    //console.log(json_data)
                    let sensorsMismatchingDeviceEUI = DeviceEUIcheckResponse.notAddedSensors;
                    // if sensors are created correctly i create the related water devices
                    if (response.status == "Success") {
                        yield this.createMultipleWaterDevices(json_data, user_id, selectedUnitValue, provider, authToken)
                            .then((response) => {
                            // if sensors are created correctly i create the related water devices
                            if (response.status == "Success") {
                                if (response.result && response.result.length == 0) {
                                    resolve({
                                        http: 204,
                                        status: "Success",
                                        result: {
                                            message: "No water devices could be imported",
                                            notCreatedSensorlist: sensorsMismatchingDeviceEUI,
                                        },
                                    });
                                }
                                else {
                                    //console.log(response)
                                    resolve({
                                        http: 200,
                                        status: "Success",
                                        result: {
                                            sensorsCreatedNum: response.response.affectedRows,
                                            notCreatedSensorlist: sensorsMismatchingDeviceEUI,
                                        },
                                    });
                                }
                            }
                            else {
                                reject({
                                    http: 401,
                                    status: "Failed",
                                    error: response.error,
                                });
                            }
                        })
                            .catch((err) => {
                            console.log(err);
                            reject({
                                http: 401,
                                status: "Failed",
                                error: "error importing devices",
                                msgError: err,
                            });
                        });
                    }
                    else {
                        reject({
                            http: 401,
                            status: "Failed",
                            error: "error getting created sensors by dev_EUI",
                        });
                    }
                }))
                    .catch((err) => {
                    //console.log(err)
                });
            }));
        });
    } // importFile()
    // add CN,Diameter... or other creating a water_device from a sensor
    addSensorWaterInfo(sensors_json, json_file_data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                var notAddedSensors = [];
                console.log("************** sensors_json ***************");
                console.log(sensors_json);
                console.log("************** json_file_data ***************");
                console.log(json_file_data);
                try {
                    let sensorIndex;
                    for (const element of json_file_data) {
                        //const index: any = json_file_data.indexOf(element);
                        if (element.device_EUI) {
                            sensorIndex = sensors_json.findIndex((sensor) => sensor.device_EUI.toUpperCase() ===
                                element.device_EUI.toUpperCase());
                        }
                        else {
                            sensorIndex = -1;
                        }
                        //console.log("************** sensor.device_EUI (getsensors) ***************")
                        //console.log(sensors_json[0].device_EUI)
                        //console.log("************** sensor.device_EUI (excel) ***************")
                        //console.log(element.device_EUI)
                        // if device_EUI matches (sensor created correctly) we add the desired info to the sensors
                        if (sensorIndex != -1) {
                            try {
                                if (sensors_json[sensorIndex].Diameter) {
                                    sensors_json[sensorIndex].Diameter = element.Diameter;
                                }
                                if (sensors_json[sensorIndex].SewerRate) {
                                    sensors_json[sensorIndex].SewerRate = element.SewerRate;
                                }
                                if (sensors_json[sensorIndex].WaterUnits) {
                                    sensors_json[sensorIndex].WaterUnits = element.WaterUnits;
                                }
                                if (sensors_json[sensorIndex].Variable) {
                                    sensors_json[sensorIndex].Variable = element.Variable;
                                }
                                if (sensors_json[sensorIndex].WaterGroup) {
                                    sensors_json[sensorIndex].WaterGroup = element.WaterGroup;
                                }
                                if (element.numContador) {
                                    sensors_json[sensorIndex].numContador = element.numContador;
                                }
                                if (element.numModuleLora) {
                                    sensors_json[sensorIndex].numModuleLora = element.numModuleLora;
                                }
                                if (element.contractNumber) {
                                    sensors_json[sensorIndex].contractNumber =
                                        element.contractNumber;
                                }
                                if (element.UserDni) {
                                    let response = yield waterUsersController_1.default.getUserByNif(element.UserDni);
                                    if (response.http == 200 && response.user_module_data) {
                                        sensors_json[sensorIndex].water_user_id =
                                            response.user_module_data.id;
                                    }
                                    else {
                                        // If water user id is undefined we should not be able to create the device
                                        sensors_json[sensorIndex].water_user_id = undefined;
                                    }
                                }
                            }
                            catch (err) {
                                //console.log(err)
                            }
                        }
                        else {
                            // If deviceEUI doesnt exist we add this to an array that will be shown on erro lod to user
                            notAddedSensors.push(element);
                            /*console.log("***** SENSOR NOT ADDED *****")
                                        console.log(element);*/
                        }
                    }
                    /*console.log("***** ADD SENSOR INFO *****")
                            console.log({
                                addedSensors: sensors_json,
                                    notAddedSensors: notAddedSensors
                            })*/
                    resolve({
                        addedSensors: sensors_json,
                        notAddedSensors: notAddedSensors,
                    });
                }
                catch (err) {
                    //console.log(err)
                    reject(err);
                }
            }));
        });
    }
    createMultipleWaterDevices(sensors_created, user_id, unit, provider, authToken) {
        return __awaiter(this, void 0, void 0, function* () {
            let insert_values = "";
            let lastObservationTimestamp;
            if (provider == undefined || authToken == undefined) {
                provider = "";
                authToken = "";
            }
            //console.log(sensors_created)
            //console.log("*** CREATING WATER DEVICES ***")
            sensors_created.forEach((element, index) => {
                //console.log(element.lastObservationDate)
                // date to mysql format
                let description = "";
                try {
                    if (element.lastObservationDate != undefined) {
                        lastObservationTimestamp = new Date(element.lastObservationDate)
                            .toISOString()
                            .slice(0, -5)
                            .replace("T", " ");
                    }
                    else {
                        lastObservationTimestamp = "9999-99-99 00:00:00.000000";
                        element.lastObservation = false;
                    }
                    description = element.description.replace(/'/g, "");
                }
                catch (error) {
                    console.log(error);
                }
                if (!element.lastObservation) {
                    insert_values +=
                        "('" +
                            Utils_1.Utils.checkUndefined(element.name) +
                            "','" +
                            Utils_1.Utils.checkUndefined(element.id) +
                            "','" +
                            Utils_1.Utils.checkUndefined(user_id) +
                            "','" +
                            Utils_1.Utils.checkUndefined(unit) +
                            "','" +
                            description +
                            "', NULL ,'1999-10-10 00:00:00.000000',' " +
                            +Utils_1.Utils.checkUndefined(element.numContador) +
                            "','" +
                            Utils_1.Utils.checkUndefined(element.numModuleLora) +
                            "','" +
                            Utils_1.Utils.checkUndefined(element.contractNumber) +
                            "',current_timestamp(), current_timestamp(), '" +
                            provider +
                            "', '" +
                            authToken +
                            "'),";
                }
                else {
                    //console.log("*** lastObservationTimestamp ***")
                    //console.log(lastObservationTimestamp)
                    //console.log("*** lastObservation ***")
                    //console.log(element.lastObservation)
                    insert_values +=
                        "('" +
                            Utils_1.Utils.checkUndefined(element.name) +
                            "','" +
                            Utils_1.Utils.checkUndefined(element.id) +
                            "','" +
                            Utils_1.Utils.checkUndefined(user_id) +
                            "','" +
                            Utils_1.Utils.checkUndefined(unit) +
                            "','" +
                            Utils_1.Utils.checkUndefined(element.description) +
                            "','" +
                            element.lastObservation +
                            "','" +
                            lastObservationTimestamp +
                            "','" +
                            Utils_1.Utils.checkUndefined(element.numContador) +
                            "','" +
                            Utils_1.Utils.checkUndefined(element.numModuleLora) +
                            "','" +
                            Utils_1.Utils.checkUndefined(element.contractNumber) +
                            "',current_timestamp(), current_timestamp(), '" +
                            provider +
                            "', '" +
                            authToken +
                            "'),";
                }
            });
            var query = "INSERT INTO `water_devices` (`name`, `sensor_id`, " +
                "`user_id`, `units`, `description`, `last_observation`, `last_message`, `numContador`, `numModuleLora`," +
                " `contract_number`, `created_dt`, `updated_dt`,`provider`,`authToken`) VALUES " +
                insert_values.slice(0, -1) +
                ";";
            console.log(query);
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
                        //console.log("*** IMPORT WATER DEVICES (QUERY) ***")
                        //console.log(query)
                        // If the query fails
                        if (err) {
                            console.log("***ERROR INSERTING WATER DEVICES***");
                            console.log(err);
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
                            response: results,
                        });
                    });
                });
            });
        });
    }
    /**
     * POST ('/')
     * Create a new water device
     *
     * @async
     * @param name
     * @param sensor_id
     * @param variable_name
     * @param water_group_id
     * @param water_user_id
     * @param user_id
     * @param municipality_id
     * @param description
     * @param units
     * @param contract_number
     * @param device_diameter
     * @param sewer_rate_id
     * @param installation_address
     *
     * @returns
     */
    createWaterDevice(name, sensor_id, variable_name = null, water_group_id = null, water_user_id = null, user_id, municipality_id = null, description = null, units = null, contract_number = null, device_diameter = null, sewer_rate_id = null, installation_address = null, coeficiente_corrector = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (name) {
                name = "'" + name + "'";
            }
            if (variable_name) {
                variable_name = "'" + variable_name + "'";
            }
            if (description) {
                description = "'" + description + "'";
            }
            else {
                description = "''";
            }
            if (units) {
                units = "'" + units + "'";
            }
            else {
                units = "''";
            }
            if (contract_number) {
                contract_number = "'" + contract_number + "'";
            }
            if (installation_address) {
                installation_address = "'" + installation_address + "'";
            }
            if (coeficiente_corrector) {
                coeficiente_corrector = "'" + coeficiente_corrector + "'";
            }
            var query = "INSERT INTO water_devices (name, sensor_id, variable_name, water_group_id, water_user_id, user_id, municipality_id, description, units, contract_number, device_diameter, sewer_rate_id, installation_address,coeficiente_corrector) VALUES (" +
                name +
                "," +
                sensor_id +
                "," +
                variable_name +
                "," +
                water_group_id +
                "," +
                water_user_id +
                "," +
                user_id +
                "," +
                municipality_id +
                "," +
                description +
                "," +
                units +
                "," +
                contract_number +
                "," +
                device_diameter +
                "," +
                sewer_rate_id +
                "," +
                installation_address +
                "," +
                coeficiente_corrector +
                ")";
            console.log(query);
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
                            response: "The water device has been created successfully.",
                        });
                    });
                });
            });
        });
    }
    /**
     * GET ('/page')
     *
     * @async
     * @param user_id
     * @param page_index
     * @param page_size
     *
     * @returns
     */
    getWaterDevicesListing(user_id, page_index, page_size) {
        return __awaiter(this, void 0, void 0, function* () {
            const first_value = page_size * page_index - page_size;
            const second_value = page_size * page_index;
            var query = "SELECT w.*, msr.usefor,o.observation_value, o.message_timestamp, s.device_e_u_i, s.sensor_name, water_module_users.first_name as user_name, water_module_users.address as user_address FROM water_devices w LEFT JOIN (SELECT observation_value, message_timestamp, device_id FROM water_module_observation ORDER BY id DESC LIMIT 1) o ON (o.device_id = w.id) LEFT JOIN (SELECT device_EUI AS device_e_u_i, id, name as sensor_name FROM sensor_info) s ON (w.sensor_id = s.id) LEFT JOIN water_module_users ON water_module_users.id=w.water_user_id LEFT JOIN municipality_sewer_rate msr on msr.id = w.sewer_rate_id WHERE w.user_id = " +
                user_id +
                " ORDER BY w.id DESC LIMIT " +
                first_value +
                ", " +
                page_size;
            console.log(query);
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
                        //console.log(results)
                        // Response
                        resolve({
                            http: 200,
                            status: "Success",
                            water_devices: results,
                        });
                    });
                });
            });
        });
    }
    /**
     * GET ('/page')
     *
     * @async
     * @param user_id
     * @param page_index
     * @param page_size
     *
     * @returns
     */
    getWaterDevicesListingSorted(user_id, page_index, page_size, sortByCol, direction) {
        return __awaiter(this, void 0, void 0, function* () {
            const first_value = page_size * page_index - page_size;
            const second_value = page_size * page_index;
            var query = "SELECT w.*, o.observation_value, o.message_timestamp, s.device_e_u_i, s.sensor_name, water_module_users.first_name as user_name, water_module_users.address as user_address FROM water_devices w LEFT JOIN (SELECT observation_value, message_timestamp, device_id FROM water_module_observation ORDER BY id DESC LIMIT 1) o ON (o.device_id = w.id) LEFT JOIN (SELECT device_EUI AS device_e_u_i, id, name as sensor_name FROM sensor_info) s ON (w.sensor_id = s.id) LEFT JOIN water_module_users ON water_module_users.id=w.water_user_id WHERE w.user_id = " +
                user_id;
            if (sortByCol == "device_EUI") {
                query +=
                    " ORDER BY s.device_e_u_i " +
                        direction +
                        " LIMIT " +
                        first_value +
                        ", " +
                        page_size;
            }
            else if (sortByCol == "sensor_name") {
                query +=
                    " ORDER BY s." +
                        sortByCol +
                        " " +
                        direction +
                        " LIMIT " +
                        first_value +
                        ", " +
                        page_size;
            }
            else {
                query =
                    "SELECT w.*, o.observation_value, o.message_timestamp, s.device_e_u_i, s.sensor_name, water_module_users.first_name as user_name, water_module_users.address as user_address FROM water_devices w LEFT JOIN (SELECT observation_value, message_timestamp, device_id FROM water_module_observation ORDER BY id DESC LIMIT 1) o ON (o.device_id = w.id) LEFT JOIN (SELECT device_EUI AS device_e_u_i, id, name as sensor_name FROM sensor_info) s ON (w.sensor_id = s.id) LEFT JOIN water_module_users ON water_module_users.id=w.water_user_id WHERE w.user_id = " +
                        user_id +
                        " ORDER BY w." +
                        sortByCol +
                        " " +
                        direction +
                        " LIMIT " +
                        first_value +
                        ", " +
                        page_size;
            }
            console.log(query);
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
                        //console.log(results)
                        // Response
                        resolve({
                            http: 200,
                            status: "Success",
                            water_devices: results,
                        });
                    });
                });
            });
        });
    }
    /**
     * GET ('/admin_page')
     *
     * @async
     * @param user_id
     * @param page_index
     * @param page_size
     *
     * @returns
     */
    getAdminWaterDevicesListing(user_id, page_index, page_size) {
        return __awaiter(this, void 0, void 0, function* () {
            // Pagination limit values
            const first_value = page_size * page_index - page_size;
            const second_value = page_size * page_index;
            var query = "SELECT w.*, o.observation_value, o.message_timestamp, s.device_e_u_i FROM water_devices w LEFT JOIN (SELECT observation_value, message_timestamp, device_id FROM water_module_observation ORDER BY id DESC LIMIT 1) o ON (o.device_id = w.id) LEFT JOIN (SELECT device_EUI AS device_e_u_i, id FROM sensor_info) s ON (w.sensor_id = s.id) LEFT JOIN (SELECT * FROM users WHERE under_admin = " +
                user_id +
                ") u ON (w.user_id = u.id) ORDER BY w.id DESC LIMIT " +
                first_value +
                ", " +
                second_value;
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
                            water_devices: results,
                        });
                    });
                });
            });
        });
    }
    /**
     * GET ('/:deviceId')
     *
     * @async
     * @param deviceId
     *
     * @returns
     */
    getWaterDeviceById(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            var query = "SELECT * FROM water_devices where id=" + deviceId;
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
                        console.log(results);
                        if (results[0] != undefined) {
                            // Response
                            resolve({
                                http: 200,
                                status: "Success",
                                water_device: results[0],
                            });
                        }
                        else {
                            reject({
                                http: 204,
                                status: "Empty result",
                                error: err,
                            });
                        }
                    });
                });
            });
        });
    }
    /**
   * GET ('/userByNif/:nif')
   * Getting the information about the user by a given nif
   *
   * @async
   * @param nif - The user nif
   *
   * @return
   */
    getWaterDeviceSewerRateIdByNameAndMunicipalityId(name, municipalityId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    let query = "SELECT * FROM municipality_sewer_rate WHERE usefor = '" + name + "' and municipality_id=" + municipalityId + ";";
                    console.log(query);
                    conn.query(query, (error, results) => {
                        conn.release();
                        if (error) {
                            reject({
                                http: 406,
                                status: "Failed",
                                error: error,
                            });
                        }
                        if (results.length && results.length == 0) {
                            resolve({
                                http: 204,
                                status: "Success",
                                result: "There are no water_module_users with this nif",
                                sewer_rate_data: {},
                            });
                        }
                        console.log("SEWERRATEDBHANDLER", results[0]);
                        resolve({
                            http: 200,
                            status: "Success",
                            sewer_rate_data: results[0],
                        });
                    });
                });
            });
        });
    }
    /**
    * GET ('/userByNif/:nif')
    * Getting the information about the user by a given nif
    *
    * @async
    * @param nif - The user nif
    *
    * @return
    */
    getWaterDeviceMunicipalityIdByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    let query = "SELECT * FROM water_municipality_info WHERE name = '" + name + "'";
                    console.log(query);
                    conn.query(query, (error, results) => {
                        conn.release();
                        if (error) {
                            reject({
                                http: 406,
                                status: "Failed",
                                error: error,
                            });
                        }
                        if (results.length && results.length == 0) {
                            resolve({
                                http: 204,
                                status: "Success",
                                result: "There is no municipality with the given name",
                                municipality_data: {},
                            });
                        }
                        resolve({
                            http: 200,
                            status: "Success",
                            municipality_data: results[0],
                        });
                    });
                });
            });
        });
    }
    /**
   * GET ('/userByNif/:nif')
   * Getting the information about the user by a given nif
   *
   * @async
   * @param nif - The user nif
   *
   * @return
   */
    getWaterDeviceByFilterTypeValue(type, value, user_id, page_index, page_size) {
        return __awaiter(this, void 0, void 0, function* () {
            const first_value = page_size * page_index - page_size;
            const second_value = page_size * page_index;
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    let query = "";
                    switch (type) {
                        case 'contractNumber':
                            query = "SELECT w.*,msr.usefor, o.observation_value, o.message_timestamp, s.device_e_u_i, s.sensor_name, water_module_users.first_name as user_name, water_module_users.address as user_address FROM water_devices w LEFT JOIN (SELECT observation_value, message_timestamp, device_id FROM water_module_observation ORDER BY id DESC LIMIT 1) o ON (o.device_id = w.id) LEFT JOIN (SELECT device_EUI AS device_e_u_i, id, name as sensor_name FROM sensor_info) s ON (w.sensor_id = s.id) LEFT JOIN water_module_users ON water_module_users.id=w.water_user_id LEFT JOIN municipality_sewer_rate msr on msr.id = w.sewer_rate_id WHERE w.user_id = " +
                                user_id +
                                " AND  `contract_number` ='" +
                                value + "'  ORDER BY w.id DESC LIMIT " +
                                first_value +
                                ", " +
                                page_size;
                            break;
                        case 'user':
                            query = "SELECT  w.*,msr.usefor,water_module_users.first_name,water_module_users.last_name, o.observation_value, o.message_timestamp, s.device_e_u_i, s.sensor_name, water_module_users.first_name as user_name, water_module_users.address as user_address FROM water_devices w LEFT JOIN (SELECT observation_value, message_timestamp, device_id FROM water_module_observation ORDER BY id DESC LIMIT 1) o ON (o.device_id = w.id) LEFT JOIN (SELECT device_EUI AS device_e_u_i, id, name as sensor_name FROM sensor_info) s ON (w.sensor_id = s.id) LEFT JOIN water_module_users ON water_module_users.id=w.water_user_id LEFT JOIN municipality_sewer_rate msr on msr.id = w.sewer_rate_id WHERE w.user_id = " +
                                user_id +
                                " AND  `first_name` like'%" +
                                value + "%' ORDER BY w.id DESC LIMIT " +
                                first_value +
                                ", " +
                                page_size;
                            break;
                        case 'sewer':
                            query = "SELECT w.*, msr.usefor,o.observation_value, o.message_timestamp, s.device_e_u_i, s.sensor_name, water_module_users.first_name as user_name, water_module_users.address as user_address FROM water_devices w LEFT JOIN (SELECT observation_value, message_timestamp, device_id FROM water_module_observation ORDER BY id DESC LIMIT 1) o ON (o.device_id = w.id) LEFT JOIN (SELECT device_EUI AS device_e_u_i, id, name as sensor_name FROM sensor_info) s ON (w.sensor_id = s.id) LEFT JOIN water_module_users ON water_module_users.id=w.water_user_id Left JOIN municipality_sewer_rate msr ON msr.id = w.sewer_rate_id WHERE w.user_id = " +
                                user_id +
                                " AND  `usefor` ='" +
                                value + "'  ORDER BY w.id DESC LIMIT " +
                                first_value +
                                ", " +
                                page_size;
                            break;
                    }
                    /*let query =
                      "SELECT * FROM `water_devices` WHERE `contract_number`='" + contractNumber + "'";*/
                    console.log(query);
                    conn.query(query, (error, results) => {
                        conn.release();
                        if (error) {
                            reject({
                                http: 406,
                                status: "Failed",
                                error: error,
                            });
                        }
                        if (results.length && results.length == 0) {
                            resolve({
                                http: 204,
                                status: "Success",
                                result: "There is no device with this contract number",
                                water_devices: {},
                            });
                        }
                        resolve({
                            http: 200,
                            status: "Success",
                            water_devices: results,
                        });
                    });
                });
            });
        });
    }
    /**
     * GET ('/userByNif/:nif')
     * Getting the information about the user by a given nif
     *
     * @async
     * @param nif - The user nif
     *
     * @return
     */
    getWaterDeviceDiameterIdByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    let query = "SELECT * FROM municipality_diameters WHERE name = '" + name + "'";
                    console.log(query);
                    conn.query(query, (error, results) => {
                        conn.release();
                        if (error) {
                            reject({
                                http: 406,
                                status: "Failed",
                                error: error,
                            });
                        }
                        if (results.length && results.length == 0) {
                            resolve({
                                http: 204,
                                status: "Success",
                                result: "There is no diameter with this name",
                                diameter_data: {},
                            });
                        }
                        resolve({
                            http: 200,
                            status: "Success",
                            diameter_data: results[0],
                        });
                    });
                });
            });
        });
    }
    /**
     * GET ('/:deviceId')
     *
     * @async
     * @param deviceId
     *
     * @returns
     */
    updateWaterDeviceByName(name, variable_name, description, units, contractNumber, deviceDiameter, installAddress, numContador, numModuleLora, provider, authToken, nif, groupId, municipality_name, sewerRateName) {
        return __awaiter(this, void 0, void 0, function* () {
            /*
            domestico -> 3
            comercial -> 4
            industrial -> 5
            */
            let water_user_id = 0;
            let municipalityId;
            let sewerRateId;
            let deviceDiameterId;
            if (nif) {
                let res = yield waterUsersController_1.default.getUserByNif(nif);
                console.log("resNif", res.user_module_data);
                if (res.http == 200) {
                    water_user_id = res.user_module_data.id;
                }
            }
            if (municipality_name) {
                let res = yield this.getWaterDeviceMunicipalityIdByName(municipality_name);
                console.log("resMunicipality", res.municipality_data);
                if (res.http == 200) {
                    municipalityId = res.municipality_data.id;
                    if (sewerRateName) {
                        let resSewer = yield this.getWaterDeviceSewerRateIdByNameAndMunicipalityId(sewerRateName, municipalityId);
                        console.log("resSewer", resSewer.sewer_rate_data);
                        if (resSewer.http == 200) {
                            sewerRateId = resSewer.sewer_rate_data.id;
                        }
                    }
                }
            }
            if (deviceDiameter) {
                let res = yield this.getWaterDeviceDiameterIdByName(deviceDiameter);
                console.log("resDiameter", res.diameter_data);
                if (res.http == 200) {
                    deviceDiameterId = res.diameter_data.id;
                }
            }
            if (description) {
                description = description.replace(/'/g, "");
            }
            if (installAddress) {
                installAddress = installAddress.replace(/'/g, "");
            }
            if (!groupId) {
                groupId = 'NULL';
            }
            var query = "UPDATE water_devices SET variable_name='" +
                variable_name +
                "', description='" +
                description +
                "',units='" +
                units +
                "',contract_number='" +
                contractNumber +
                "',installation_address='" +
                installAddress +
                "',numContador='" +
                numContador +
                "',numModuleLora='" +
                numModuleLora +
                "',provider='" +
                provider +
                "',authToken='" +
                authToken +
                "', water_user_id=" +
                water_user_id +
                ", water_group_id=" +
                groupId;
            if (municipalityId) {
                query += ", municipality_id=" + municipalityId;
            }
            if (deviceDiameterId) {
                query += ", device_diameter=" + deviceDiameterId;
            }
            if (sewerRateId) {
                query += ", sewer_rate_id=" + sewerRateId;
            }
            query += " WHERE name='" +
                name +
                "'";
            console.log(query);
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
                            result: results,
                        });
                    });
                });
            });
        });
    }
    /**
     * GET ('/:deviceId')
     *
     * @async
     * @param deviceId
     *
     * @returns
     */
    updateWaterDeviceById(id, name, variable_name, description, units, contractNumber, deviceDiameter, installAddress, numContador, numModuleLora, sensorId, water_user_id, municipality_id, sewer_rate_id, coeficiente_corrector) {
        return __awaiter(this, void 0, void 0, function* () {
            if (description) {
                description = description.replace(/'/g, "");
            }
            if (installAddress) {
                installAddress = installAddress.replace(/'/g, "");
            }
            let devDiam;
            if (!deviceDiameter) {
                devDiam = 0;
            }
            else {
                devDiam = deviceDiameter;
            }
            var query = "UPDATE water_devices SET name='" +
                name +
                "',variable_name='" +
                variable_name +
                "', description='" +
                description +
                "',units='" +
                units +
                "',contract_number='" +
                contractNumber +
                "',device_diameter='" +
                devDiam +
                "',installation_address='" +
                installAddress +
                "',numContador='" +
                numContador +
                "',numModuleLora='" +
                numModuleLora +
                "',sensor_id='" +
                sensorId +
                "', water_user_id=" +
                water_user_id +
                ", municipality_id=" +
                municipality_id +
                ", sewer_rate_id=" +
                sewer_rate_id +
                ", coeficiente_corrector='" +
                coeficiente_corrector +
                "' WHERE id='" +
                id +
                "'";
            console.log("query", query);
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
                            result: results,
                        });
                    });
                });
            });
        });
    }
}
exports.default = new WaterDevicesController();
