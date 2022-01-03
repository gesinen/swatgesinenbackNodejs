"use strict";
/**
 * Name: MeasureMqttRouter.ts
 * Date: 04 - 11 - 2021
 * Author: Alejandro Losa García
 * Description: Manages the MQTT interactions of the measure feature
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MqttRouter_1 = __importDefault(require("../../MqttRouter"));
class irrigationMqttRouter extends MqttRouter_1.default {
    // Constructor
    constructor() {
        super();
        this.connect();
    }
}
exports.default = irrigationMqttRouter;
