import {Request, Response} from "express";
import db from "../../database";

/*
 * /water/
 */
class WaterObservationsController {

    /**
     * POST ('/import')
     * Importing water_obeservation_value records from xls file
     *
     * @param json_file_data xls file info formated on json
     * @param resolveCbFn fn called when values to insert are prepared
     *
     * @return
     */
    public async importFile(json_file_data: any, resolveCbFn: any): Promise<object> {
        return new Promise((resolve, reject) => {
            console.log("metodo del controller")
            db.getConnection((err: any, conn: any) => {
                console.log(err)
                console.log("dentro del db.getConnection")
                var insert_values_array: any = [];
                var values_to_insert = ""
                var record_counter = 0;
                console.log("importFile")

                json_file_data.water_info.forEach(function (element: any, index: any) {
                    var select_query = "SELECT water_devices.id, water_devices.sensor_id, water_devices.name, " +
                        "sensor_info.device_EUI FROM `water_devices` INNER JOIN sensor_info " +
                        "ON water_devices.sensor_id = sensor_info.id WHERE `contract_number` = '" + element.contract_number + "';";
                    conn.query(select_query, async (err: any, results: any) => {
                        if (err) {
                            reject({
                                http: 401,
                                status: 'Failed',
                                error: err
                            })
                        } else {
                            if (results && results.length == 0) {
                                console.log("contract_number not found")
                            } else {
                                let water_device_info = results[0];
                                values_to_insert += "(" + water_device_info.id + "," + water_device_info.sensor_id + ", '1', '" +
                                    water_device_info.name + "','" + water_device_info.device_EUI + "', 'S01', NULL, NULL, " +
                                    element.observation_value + ",'" + json_file_data.date + "', NULL, " + json_file_data.user_id +
                                    ", 'normal', 'normal', current_timestamp(), current_timestamp()),";
                            }
                            if (index == json_file_data.water_info.length - 1) {
                                resolve(resolveCbFn(values_to_insert.slice(0, -1)))
                            }
                        }
                    })
                })
            })
        });
    } // importFile()


    public async insertNewWaterObservations(insert_values: string) {
        return new Promise((resolve, reject) => {
            db.getConnection((err: any, conn: any) => {
                var insert_query =
                    "INSERT INTO `water_module_observation` (`device_id`, `sensor_id`, `var_id`, `device_name`, `device_eui`, `var_name`, `gateway_mac`, `sensor_type_id`, `observation_value`," +
                    " `message_timestamp`, `time`, `user_id`, `alert_type`, `observation_type`, `created_dt`, `updated_dt`)" +
                    " VALUES " + insert_values + ";";
                conn.query(insert_query, (err: any, results: any) => {
                    if (err) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: err
                        })
                    } else {

                        if (results && results.length == 0) {
                            resolve({
                                http: 204,
                                status: 'Success',
                                result: "Error importing water_module_observations",
                            })
                        } else {

                            resolve({
                                http: 200,
                                status: 'Success',
                                result: results
                            })
                        }
                    }
                })
            })
        });
    } // insertNewWaterObservations()
    
}

export default new WaterObservationsController();
