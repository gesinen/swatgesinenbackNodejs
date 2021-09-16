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
Object.defineProperty(exports, "__esModule", { value: true });
class CapacityDevicesController {
    /**
     * Creating a new capacity device
     * @param name
     * @param description
     * @param sensor_id
     * @param user_id
     * @param capacity
     * @param max_capacity
     * @param type
     * @param address
     * @param coordinates_x
     * @param coordinates_y
     * @returns True if the device is created well or False if there is an error
     */
    createCapacityDevice(name, description, sensor_id, user_id, capacity, max_capacity, type, address, coordinates_x, coordinates_y) {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = {
                name: name,
                description: description,
                sensor_id: sensor_id,
                user_id: user_id,
                capacity: capacity,
                max_capacity: max_capacity,
                type: type,
                address: address,
                coordinates_x: coordinates_x,
                coordinates_y: coordinates_y
            };
            return obj;
        });
    }
}
exports.default = new CapacityDevicesController();
