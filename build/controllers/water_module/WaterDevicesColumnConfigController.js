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
class WaterDevicesColumnConfigController {
    // Create water device Column Config
    /**
     * POST ('/')
     * Create a new water device column Config
     *
     * @async
     * @param name
     * @param contract_number
     * @param user
     * @param user_id
     * @param units
     * @param counter_number
     * @param description
     * @param use_for
     * @param installation_address
     *
     * @returns
     */
    createWaterDeviceColumnConfig(name = false, contract_number = false, user = false, user_id = null, units = false, counter_number = false, description = false, use_for = false, installation_address = false) {
        return __awaiter(this, void 0, void 0, function* () {
            var query = "INSERT INTO water_module_device_column_config (name, user_id, description, units, contract_number, installation_address) VALUES (" +
                name +
                "," +
                user_id +
                "," +
                description +
                "," +
                units +
                "," +
                contract_number +
                "," +
                installation_address +
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
                            response: "The water device Config has been created successfully.",
                        });
                    });
                });
            });
        });
    }
    /**
     * PUT ('/')
     * Update a new water device column Config
     *
     * @async
     * @param name
     * @param contract_number
     * @param user
     * @param user_id
     * @param units
     * @param counter_number
     * @param description
     * @param use_for
     * @param installation_address
     *
     * @returns
     */
    UpdateWaterDeviceColumnConfig(name = false, contract_number = false, user = false, user_id = null, units = false, counter_number = false, description = false, use_for = false, installation_address = false) {
        return __awaiter(this, void 0, void 0, function* () {
            var query = "UPDATE water_module_device_column_config set name=" +
                name +
                ", description = " +
                description +
                ", units = " +
                units +
                ", contract_number = " +
                contract_number +
                ", installation_address = " +
                installation_address +
                " where user_id =" + user_id;
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
                            response: "The water device Config has been updated successfully.",
                        });
                    });
                });
            });
        });
    }
    /**
   * GET ('/:userId')
   *
   * @async
   * @param userId
   *
   * @returns
   */
    getWaterDeviceColumnConfigByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var query = "SELECT * FROM water_module_device_column_config where user_id=" + userId;
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
}
exports.default = new WaterDevicesColumnConfigController();
