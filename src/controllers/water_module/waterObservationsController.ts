import {Request, Response} from "express";
import db from "../../database";

/*
 * /water/
 */
class WaterObservationsController {

    /**
     * POST ('/import')
     * Importing water_observation_value records from xls file
     *
     * @param json_file_data xls file info formated on json
     * @param resolveCbFn fn called when values to insert are prepared
     *
     * @return
     */
    public async importFile(json_file_data: any, resolveCbFn: any): Promise<object> {
        return new Promise((resolve, reject) => {

            db.getConnection((err: any, conn: any) => {

                var insert_values_array: any = [];
                var values_to_insert = ""
                var record_counter = 0;


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

    /**
     * POST ('/getObservationValuesByDeviceId')
     * Getting al the observation records by device id in a range date
     *
     * @param devicesIdArray array storing the water_device ids
     * @param fromDate date of the observations
     * @param userColumnSelection column user has selected to be shown
     * @return
     */
    public async getObservationValuesByDeviceId(devicesIdArray: any, fromDate: any, userColumnSelection: any): Promise<object> {
        return new Promise((resolve, reject) => {
            var date = new Date(fromDate)

            var fromDateFormated = date.getFullYear() + "-" + (parseInt(String(date.getMonth()))+1) + "-" + date.getDate()
            var devicesIdPreparedSql = "";
            devicesIdArray.forEach((deviceId: any) => devicesIdPreparedSql += deviceId + ",");

            db.getConnection((err: any, conn: any) => {
                if (err) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: err
                    })
                }
                var select_query = "";
                if (userColumnSelection == "contract_number"){
                    select_query = "SELECT water_devices."+userColumnSelection+" AS user_column_selection, water_module_observation.observation_value, " +
                        "water_module_observation.message_timestamp FROM `water_devices` INNER JOIN water_module_observation " +
                        "ON water_devices.id = water_module_observation.device_id WHERE water_devices.id IN (" + devicesIdPreparedSql.slice(0, -1) + ") AND " +
                        "water_module_observation.message_timestamp BETWEEN '" +fromDateFormated+" 00:00:00' AND '" +fromDateFormated+" 23:59:00'" +
                        " ORDER BY `water_module_observation`.`message_timestamp` DESC;";
                } else {
                    select_query = "SELECT sensor_info."+userColumnSelection+" AS user_column_selection, water_module_observation.observation_value, " +
                        "water_module_observation.message_timestamp FROM `water_devices` INNER JOIN water_module_observation " +
                        "ON water_devices.id = water_module_observation.device_id INNER JOIN sensor_info ON sensor_info.id = water_module_observation.sensor_id WHERE water_devices.id IN (" + devicesIdPreparedSql.slice(0, -1) + ") AND " +
                        "water_module_observation.message_timestamp BETWEEN '" +fromDateFormated+" 00:00:00' AND '" +fromDateFormated+" 23:59:00'" +
                        " ORDER BY `water_module_observation`.`message_timestamp` DESC;";
                }

                conn.query(select_query, async (err: any, results: any) => {
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
                                result: [],
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
        })
    } // getObservationValuesByContractNum()
}

export default new WaterObservationsController();
