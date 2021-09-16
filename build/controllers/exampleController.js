"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exampleController = void 0;
class ExampleController {
    getDeviceById(req, res) {
        res.send({
            response: req.params.id
        });
    }
}
exports.exampleController = new ExampleController();
