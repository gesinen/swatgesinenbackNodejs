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
class WaterDevicesController {
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
    createWaterDevice(name, sensor_id, variable_name = null, water_group_id = null, water_user_id = null, user_id, municipality_id = null, description = null, units = null, contract_number = null, device_diameter = null, sewer_rate_id = null, installation_address = null) {
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
            if (units) {
                units = "'" + units + "'";
            }
            if (contract_number) {
                contract_number = "'" + contract_number + "'";
            }
            if (installation_address) {
                installation_address = "'" + installation_address + "'";
            }
            var query = "INSERT INTO water_devices (name, sensor_id, variable_name, water_group_id, water_user_id, user_id, municipality_id, description, units, contract_number, device_diameter, sewer_rate_id, installation_address) VALUES (" + name + "," + sensor_id + "," + variable_name + "," + water_group_id + "," + water_user_id + "," + user_id + "," + municipality_id + "," + description + "," + units + "," + contract_number + "," + device_diameter + "," + sewer_rate_id + "," + installation_address + ")";
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
                            status: 'Success',
                            response: 'The water device has been created successfully.'
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
            const first_value = (page_size * page_index) - page_size;
            const second_value = (page_size * page_index) - 1;
            //var query = "SELECT * FROM water_devices WHERE user_id = " + user_id + " ORDER BY id DESC LIMIT " + first_value + ', ' + second_value ;
            var query = "SELECT water_devices.*, water_module_observation.observation_value, water_module_observation.message_timestamp FROM water_devices INNER JOIN water_module_observation ON water_devices.id = water_module_observation.device_id WHERE water_devices.user_id = " + user_id + " ORDER BY water_devices.id DESC LIMIT " + first_value + ', ' + second_value;
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
                            status: 'Success',
                            water_devices: results
                        });
                    });
                });
            });
        });
    }
}
exports.default = new WaterDevicesController();
