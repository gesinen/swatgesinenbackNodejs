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
class WaterUsersController {
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
                            water_users: results
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
exports.default = new WaterUsersController();
