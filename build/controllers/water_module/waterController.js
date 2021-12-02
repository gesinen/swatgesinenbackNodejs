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
class WaterController {
    /**
     * POST ('/import')
     * Importing water_obeservation_value records from xls file
     *
     * @param json_file_data xls file info formated on json
     * @param resolveCbFn fn called when values to insert are prepared
     *
     * @return
     */
    importFile(json_file_data, resolveCbFn) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    var insert_values_array = [];
                    var values_to_insert = "";
                    var record_counter = 0;
                    json_file_data.water_info.forEach(function (element, index) {
                        var select_query = "SELECT water_devices.id, water_devices.sensor_id, water_devices.name, " +
                            "sensor_info.device_EUI FROM `water_devices` INNER JOIN sensor_info " +
                            "ON water_devices.sensor_id = sensor_info.id WHERE `contract_number` = '" + element.contract_number + "';";
                        conn.query(select_query, (err, results) => __awaiter(this, void 0, void 0, function* () {
                            if (err) {
                                reject({
                                    http: 401,
                                    status: 'Failed',
                                    error: err
                                });
                            }
                            else {
                                if (results && results.length == 0) {
                                }
                                else {
                                    let water_device_info = results[0];
                                    values_to_insert += "(" + water_device_info.id + "," + water_device_info.sensor_id + ", '1', '" +
                                        water_device_info.name + "','" + water_device_info.device_EUI + "', 'S01', NULL, NULL, " +
                                        element.observation_value + ",'" + json_file_data.date + "', NULL, " + json_file_data.user_id +
                                        ", 'normal', 'normal', current_timestamp(), current_timestamp()),";
                                }
                                if (index == json_file_data.water_info.length - 1) {
                                    resolve(resolveCbFn(values_to_insert.slice(0, -1)));
                                }
                            }
                        }));
                    });
                });
            });
        });
    } // importFile()
    insertNewWaterObservations(insert_values) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    var insert_query = "INSERT INTO `water_module_observation` (`device_id`, `sensor_id`, `var_id`, `device_name`, `device_eui`, `var_name`, `gateway_mac`, `sensor_type_id`, `observation_value`," +
                        " `message_timestamp`, `time`, `user_id`, `alert_type`, `observation_type`, `created_dt`, `updated_dt`)" +
                        " VALUES " + insert_values + ";";
                    conn.query(insert_query, (err, results) => {
                        if (err) {
                            reject({
                                http: 401,
                                status: 'Failed',
                                error: err
                            });
                        }
                        else {
                            if (results && results.length == 0) {
                                resolve({
                                    http: 204,
                                    status: 'Success',
                                    result: "Error importing water_module_observations",
                                });
                            }
                            else {
                                resolve({
                                    http: 200,
                                    status: 'Success',
                                    result: results
                                });
                            }
                        }
                    });
                });
            });
        });
    } // insertNewWaterObservations()
}
exports.default = new WaterController();
