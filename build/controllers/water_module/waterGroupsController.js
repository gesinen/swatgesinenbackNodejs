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
class WaterGroupsController {
    /**
     * GET ('/root/:user_id')
     *
     * @async
     * @param user_id
     *
     * @returns
     */
    getWaterRootGroupByUser(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            var query = "SELECT * FROM water_group WHERE parent_id = -1 AND user_id = " + user_id;
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
                                result: "Error no water groups found for the given user",
                            });
                        }
                        else {
                            console.log("Probando Grupos: ", results);
                            resolve({
                                http: 200,
                                status: "Success",
                                result: results,
                            });
                        }
                    });
                });
            });
        });
    }
    /**
     * GET ('/root/:user_id')
     *
     * @async
     * @param user_id
     *
     * @returns
     */
    getWaterGroupsByParent(group_id) {
        return __awaiter(this, void 0, void 0, function* () {
            var query = "SELECT * FROM water_group WHERE parent_id = " + group_id;
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
                                result: "Error no water groups found for the given user",
                            });
                        }
                        else {
                            console.log("Probando Grupos: ", results);
                            resolve({
                                http: 200,
                                status: "Success",
                                result: results,
                            });
                        }
                    });
                });
            });
        });
    }
    /**
     * GET ('/:user_id')
     *
     * @async
     * @param user_id
     *
     * @returns
     */
    getWaterGroupsByUser(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            var query = "SELECT * FROM water_group WHERE user_id = " + user_id;
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
                                result: "Error no water groups found for the given user",
                            });
                        }
                        else {
                            console.log("Probando Grupos: ", results);
                            resolve({
                                http: 200,
                                status: "Success",
                                result: results,
                            });
                        }
                    });
                });
            });
        });
    }
}
exports.default = new WaterGroupsController();
