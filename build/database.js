"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
const conn = mysql_1.default.createConnection({
    host: 'localhost',
    user: 'root',
    //password: 'Al8987154St12',
    password: 'root',
    database: 'swat_gesinen'
});
conn.connect((err) => {
    if (err) {
        console.error('Error connecting: ' + err.stack);
    }
});
exports.default = conn;
