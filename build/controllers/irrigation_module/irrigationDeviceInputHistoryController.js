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
 * /users
 */
class IrrigationDeviceInputHistoryController {
    /**
     * GET ('/information/:id')
     * Getting the information about the user
     *
     * @async
     * @param id - The user Id
     *
     * @return
     */
    storeIrrigationInputDeviceHistory(irrigationDeviceId, humidity, temperature) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    let query = "INSERT INTO irrigation_device_input_history (`irrigationDeviceInputId`, `humidity`, `temperature`)" +
                        " VALUES (" + irrigationDeviceId + "," + humidity + "," + temperature + ");";
                    console.log("query", query);
                    conn.query(query, (error, results) => {
                        conn.release();
                        if (error) {
                            reject({
                                http: 406,
                                status: 'Failed',
                                error: error
                            });
                        }
                        console.log(results);
                        if (results && results.affectedRows == 1) {
                            resolve({
                                http: 200,
                                status: 'Success',
                                result: 'Irrigation device input history inserted succesfully',
                                insertId: results.insertId
                            });
                        }
                        else {
                            resolve({
                                http: 204,
                                status: 'Success',
                                message: "Irrigation device input history could not be inserted",
                                result: results
                            });
                        }
                    });
                });
            });
        });
    }
    /**
     * GET ('/information/:id')
     * Getting the information about the user
     *
     * @async
     * @param id - The user Id
     *
     * @return
     */
    getIrrigationInputDeviceHistoryOnRange(irrigationDeviceInputId, fromDate, toDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    let query = "SELECT * FROM irrigation_device_input_history WHERE irrigationDeviceInputId=" + irrigationDeviceInputId + " AND " +
                        "timestamp >= '" + fromDate + "' and timestamp <= '" + toDate + " 23:59' ORDER BY timestamp" + ";";
                    console.log("query", query);
                    conn.query(query, (error, results) => {
                        conn.release();
                        if (error) {
                            reject({
                                http: 406,
                                status: 'Failed',
                                error: error
                            });
                        }
                        console.log(results);
                        if (results) {
                            resolve({
                                http: 200,
                                status: 'Success',
                                message: 'Irrigation device inputs history retrieved succesfully',
                                result: results
                            });
                        }
                        else {
                            resolve({
                                http: 204,
                                status: 'Success',
                                message: "Irrigation device inputs history could not be retrieved",
                                result: results
                            });
                        }
                    });
                });
            });
        });
    }
}
exports.default = new IrrigationDeviceInputHistoryController();
