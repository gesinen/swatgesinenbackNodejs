"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.capacityModuleController = void 0;
class CapacityModuleController {
    getDeviceById(req, res) {
        res.send({
            response: req.params.id
        });
    }
}
exports.capacityModuleController = new CapacityModuleController();
