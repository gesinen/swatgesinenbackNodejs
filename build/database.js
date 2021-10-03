"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
const conn = mysql_1.default.createPool({
    host: 'localhost',
    user: 'root',
    //password: 'Al8987154St12',
    password: '',
    database: 'swat_gesinen'
});
exports.default = conn;
