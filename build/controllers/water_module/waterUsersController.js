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
class WaterUsersController {
    /**
     * GET ('/all/:user_id')
     *
     * @async
     * @param user_id
     *
     * @returns
     */
    getWaterUserMunicipalityId(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            var query = "SELECT id FROM `water_municipality_info` WHERE user_id = " +
                user_id +
                ";";
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
                        if (results && results.length == 0) {
                            resolve({
                                http: 204,
                                status: "Success",
                                result: "Error no water municipality found for the given user",
                            });
                        }
                        else {
                            resolve({
                                http: 200,
                                status: "Success",
                                result: results[0],
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
    getUserByNif(nif) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    let query = "SELECT * FROM water_module_users WHERE user_nif = '" + nif + "'";
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
                                user_module_data: {},
                            });
                        }
                        resolve({
                            http: 200,
                            status: "Success",
                            user_module_data: results[0],
                        });
                    });
                });
            });
        });
    }
    /**
     * GET ('/all/:user_id')
     *
     * @async
     * @param user_id
     *
     * @returns
     */
    getAllWaterUsers(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            var query = "SELECT * FROM water_module_users WHERE user_id = " + user_id;
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((error, conn) => {
                    // If the connection with the database fails
                    if (error) {
                        reject({
                            http: 401,
                            status: "Failed to connect to database",
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
                            water_users: results,
                        });
                    });
                });
            });
        });
    }
    /**
     * GET ('/device/:user_id')
     *
     * @async
     * @param user_id
     *
     * @returns
     */
    getWaterUserDevice(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            var query = "SELECT * FROM water_devices WHERE water_user_id = " + user_id;
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((error, conn) => {
                    // If the connection with the database fails
                    if (error) {
                        reject({
                            http: 401,
                            status: "Failed to connect to database",
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
     * POST ('/import')
     * Importing water_observation_value records from xls file
     * @param json_file_data xls file info formated on json
     * @return Promise
     */
    importFile(json_file_data, user_id, municipality_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                console.log("metodo del controller");
                database_1.default.getConnection((err, conn) => {
                    console.log(err);
                    var values_to_insert = "";
                    //console.log("file on controller")
                    console.log(json_file_data);
                    json_file_data.forEach((element, index) => {
                        values_to_insert +=
                            "('" +
                                Utils_1.Utils.checkUndefined(element.first_name) +
                                "','" +
                                Utils_1.Utils.checkUndefined(element.last_name) +
                                "','" +
                                Utils_1.Utils.checkUndefined(element.email) +
                                "','" +
                                Utils_1.Utils.checkUndefined(element.user_nif) +
                                "','" +
                                Utils_1.Utils.checkUndefined(element.mobile) +
                                "','" +
                                Utils_1.Utils.checkUndefined(user_id) +
                                "','" +
                                Utils_1.Utils.checkUndefined(municipality_id) +
                                "','" +
                                Utils_1.Utils.checkUndefined(element.house_no) +
                                "','" +
                                Utils_1.Utils.checkUndefined(element.street) +
                                "','" +
                                Utils_1.Utils.checkUndefined(element.address) +
                                "','" +
                                Utils_1.Utils.checkUndefined(element.city) +
                                "','" +
                                Utils_1.Utils.checkUndefined(element.state) +
                                "','" +
                                Utils_1.Utils.checkUndefined(element.country) +
                                "','" +
                                Utils_1.Utils.checkUndefined(element.zip_code) +
                                "','" +
                                Utils_1.Utils.checkUndefined(element.bill_house_no) +
                                "','" +
                                Utils_1.Utils.checkUndefined(element.bill_street) +
                                "','" +
                                Utils_1.Utils.checkUndefined(element.bill_address) +
                                "','" +
                                Utils_1.Utils.checkUndefined(element.bill_city) +
                                "','" +
                                Utils_1.Utils.checkUndefined(element.bill_state) +
                                "','" +
                                Utils_1.Utils.checkUndefined(element.bill_country) +
                                "','" +
                                Utils_1.Utils.checkUndefined(element.bank_name) +
                                "','" +
                                Utils_1.Utils.checkUndefined(element.bank_address) +
                                "','" +
                                Utils_1.Utils.checkUndefined(element.IBAN) +
                                "','" +
                                Utils_1.Utils.checkUndefined(element.profile_pic) +
                                "','" +
                                Utils_1.Utils.checkUndefined(element.account_certificate) +
                                "','" +
                                Utils_1.Utils.checkUndefined(element.idproof) +
                                "','" +
                                Utils_1.Utils.checkUndefined(element.sepa) +
                                "','" +
                                Utils_1.Utils.checkUndefined(element.dni) +
                                "'),";
                    });
                    var insert_query = "INSERT INTO `water_module_users` (`first_name`, `last_name`, `email`, `user_nif`, `mobile`, `user_id`," +
                        " `municipality_id`, `house_no`, `street`, `address`, `city`," +
                        " `state`, `country`, `bill_house_no`, `bill_street`, `bill_address`, `bill_city`," +
                        " `bill_state`, `bill_country`, `bill_zip_code`, `bank_name`, `bank_address`, `IBAN`, `profile_pic`," +
                        " `account_certificate`, `idproof`, `sepa`, `dni`) " +
                        " VALUES " +
                        values_to_insert.slice(0, -1) +
                        ";";
                    //console.log(insert_query)
                    conn.query(insert_query, (err, results) => {
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
                                    result: "Error importing water_module_observations",
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
    } // importFile()
}
exports.default = new WaterUsersController();
