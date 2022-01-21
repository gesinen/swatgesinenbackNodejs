"use strict";
/**
 * Name: MqttRouter.ts
 * Date: 04 - 11 - 2021
 * Author: Alejandro Losa García
 * Description: Parent class that handles the mqtt routes
 */
Object.defineProperty(exports, "__esModule", { value: true });
const mqtt = require("mqtt");
class MqttRouter {
    // Constructor
    constructor() {
        // Atributes
        this.client = null;
        this.port = 8882;
        this.host = "mqtts://gesinen.es:" + this.port;
        this.username = "gesinen";
        this.password = "gesinen2110";
    }
    /**
     * Connect with the mqtt server
     * -> connect() ->
     */
    connect() {
        // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
        this.client = mqtt.connect(this.host, {
            username: this.username,
            password: this.password,
        });
        // Mqtt error calback
        this.client.on("error", (err) => {
            console.log(err);
            this.client.end();
        });
        // Connection callback
        this.client.on("connect", () => {
            console.log(`Server (MQTT) connected.`);
        });
    }
    /**
     * Suscribe and listen a topic
     * topic: Text -> suscribe() ->
     *
     * @param topic
     */
    suscribe(topic) {
        // Mqtt subscriptions
        this.client.subscribe(topic, { qos: 0 });
    }
    /**
     * Sends messages to the specified topic
     * topic: Text, message: Text -> publish() ->
     *
     * @param topic
     * @param message
     */
    publish(topic, message) {
        // Sends a mqtt message to topic
        this.client.publish(topic, message);
    }
    /**
     * Close the connection with the mqtt server
     * -> close() ->
     */
    close() {
        this.client.on("close", () => {
            console.log(`mqtt client disconnected`);
        });
    }
}
exports.default = MqttRouter;
