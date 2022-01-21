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
const database_1 = __importDefault(require("../database"));
/*
 * /users
 */
class UsersController {
    /**
     * GET ('/information/:id')
     * Getting the information about the user
     *
     * @async
     * @param id - The user Id
     *
     * @return
     */
    getUserInformation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    let query = "SELECT id, email, user_name, first_name, last_name, phone, address, city, state, country FROM users WHERE id = " + id;
                    conn.query(query, (error, results) => {
                        conn.release();
                        if (error) {
                            reject({
                                http: 406,
                                status: 'Failed',
                                error: error
                            });
                        }
                        if (results.length == 0) {
                            resolve({
                                http: 204,
                                status: 'Success',
                                result: 'There are no users with this ID',
                                user_data: {}
                            });
                        }
                        resolve({
                            http: 200,
                            status: 'Success',
                            user_data: results[0]
                        });
                    });
                });
            });
        });
    }
}
exports.default = new UsersController();
