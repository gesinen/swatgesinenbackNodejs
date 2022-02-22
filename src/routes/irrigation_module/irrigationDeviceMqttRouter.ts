/**
 * Name: MeasureMqttRouter.ts
 * Date: 04 - 11 - 2021
 * Author: Alejandro Losa García
 * Description: Manages the MQTT interactions of the measure feature
 */

import MqttRouter from "../../MqttRouter";

export default class irrigationMqttRouter extends MqttRouter {
  // Constructor
  constructor() {
    super();
    this.connect();
  }

  /**
   * Save a new measure
   * GET postalcode/ambiental/1/#
   *
   * Body: {
   *  "deviceEui": 1,
   *  "value": 10.32,
   *  "unit": "ppm"
   *  "type": "CO2"
   * }
   *
   */
  /*public syncDevice = () => {
        this.suscribe('deviceSync');

        // When a message arrives
        this.client.on("message", async (topic: any, message: any) => {
            if (topic == 'deviceSync') {

                this.publish("deviceSync/" + jsonData.device.deviceEui,
                    '{\n\"SYNCHRONIZED\":\"' + jsonData.device.deviceEui + '\"\n}'
                )

            }
        });
    }*/
}
