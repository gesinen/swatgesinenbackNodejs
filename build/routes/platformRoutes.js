"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class PlatformRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', (req, res) => {
            res.send('Hello');
        });
    }
}
const routes = new PlatformRoutes();
exports.default = routes.router;
