import db from "../../database";

/*
 * /users
 */
class IrrigationDeviceOutputController {
    /**
     * GET ('/information/:id')
     * Getting the information about the user
     * 
     * @async
     * @param id - The user Id
     * 
     * @return 
     */
    public async getIrrigationOutputDeviceById(id: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                let query = "SELECT * FROM irrigation_device_output INNER JOIN irrigation_device_link ON irrigation_device_link.irrigationDeviceOutputId=irrigation_device_output.id INNER JOIN irrigation_device_input ON irrigation_device_input.id=irrigation_device_link.irrigationDeviceInputId WHERE irrigation.device.output.id = " + id;
                console.log("queryGetIrrigationOutputDevice", query);

                conn.query(query, (error: any, results: any) => {
                    conn.release()

                    if (error) {
                        reject({
                            http: 406,
                            status: 'Failed',
                            error: error
                        })
                    }

                    if (results.length == 0) {
                        resolve({
                            http: 204,
                            status: 'Success',
                            result: 'There is no irrigation device output with this ID'
                        })
                    }

                    resolve({
                        http: 200,
                        status: 'Success',
                        result: results[0]
                    })
                })
            })
        })
    }

    /**
     * GET ('/information/:id')
     * Getting the information about the user
     * 
     * @async
     * @param id - The user Id
     * 
     * @return 
     */
    public async getIrrigationDeviceOutputInfoByIdAction(id: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

               // let query = "SELECT irrigation_device_output.* , irrigation_device_temphum.humidityLimit as valvehumidityLimit,irrigation_device_temphum.humidityLimitInferior as valvehumidityLimitInferior, irrigation_device.humidityLimit as controllerhumidityLimit ,irrigation_device.humidityLimitInferior as controllerhumidityLimitInferior,irrigation_device.parametersSensorDevEui,sensor_info.id as sensorId, sensor_info.device_eui as deviceEUI, sensor_info.network_server_mac as gateway_mac from irrigation_device_output INNER JOIN sensor_info ON irrigation_device_output.sensorId = sensor_info.id  INNER JOIN irrigation_device_temphum  ON irrigation_device_temphum.sensorId = irrigation_device_output.id  Inner Join irrigation_device On irrigation_device.sensorId = irrigation_device_output.sensorIdInput WHERE irrigation_device_output.id = " + id;
               let query = "SELECT irrigation_device_output.* , irrigation_device_temphum.humidityLimit as valvehumidityLimit,irrigation_device_temphum.humidityLimitTime as valvehumidityLimitTime,irrigation_device_temphum.humidityLimitInferior as valvehumidityLimitInferior,irrigation_device_temphum.humidityLimitInferiorTime as valvehumidityLimitInferiorTime,irrigation_device_temphum.active as valveactive, irrigation_device.humidityLimit as controllerhumidityLimit ,irrigation_device.humidityLimitInferior as controllerhumidityLimitInferior,irrigation_device.parametersSensorDevEui,sensor_info.id as sensorId, sensor_info.device_eui as deviceEUI, sensor_info.network_server_mac as gateway_mac from irrigation_device_output INNER JOIN sensor_info ON irrigation_device_output.sensorId = sensor_info.id  LEFT JOIN irrigation_device_temphum  ON irrigation_device_temphum.sensorId = irrigation_device_output.id  Inner Join irrigation_device On irrigation_device.sensorId = irrigation_device_output.sensorIdInput WHERE irrigation_device_output.id = " + id; 
               console.log("queryGetIrrigationOutputDevice", query);

                conn.query(query, (error: any, results: any) => {
                    conn.release()

                    if (error) {
                        reject({
                            http: 406,
                            status: 'Failed',
                            error: error
                        })
                    }

                    if (results.length == 0) {
                        resolve({
                            http: 204,
                            status: 'Success',
                            result: 'There is no irrigation device output with this ID'
                        })
                    }

                    resolve({
                        http: 200,
                        status: 'Success',
                        result: results[0]
                    })
                })
            })
        })
    }

    /**
     * GET ('/information/:id')
     * Getting the information about the user
     * 
     * @async
     * @param id - The user Id
     * 
     * @return 
     */
    public async getIrrigationOutputValveOnOffHistoryAction(irrigationDeviceId:number,valve:number,fromDate:string,toDate:string): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                let query = "SELECT * FROM irrigation_valve_onoff_history WHERE irrigationDeviceId=" + irrigationDeviceId + " AND  valveNumber = "+ valve +
               " AND timestamp >= '" + fromDate + "' and timestamp <= '" + toDate + " 23:59' ORDER BY timestamp" + ";";
               console.log("queryGetIrrigationOutputDevice", query);

                conn.query(query, (error: any, results: any) => {
                    conn.release()

                    if (error) {
                        reject({
                            http: 406,
                            status: 'Failed',
                            error: error
                        })
                    }

                    if (results.length == 0) {
                        resolve({
                            http: 204,
                            status: 'Success',
                            result: [],
                            message:'There is no irrigation device output with this ID'
                        })
                    }

                    resolve({
                        http: 200,
                        status: 'Success',
                        result: results
                    })
                })
            })
        })
    }

    /**
 * GET ('/information/:id')
 * Getting the information about the user
 * 
 * @async
 * @param id - The user Id
 * 
 * @return 
 */
    public async getOutputByIrrigationDeviceId(irrigationDeviceId: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                //let query = "SELECT irrigation_device_output.name,irrigation_device_output.description,irrigation_device_output.id,irrigation_device_output.sensorIdInput as inputSensorId FROM irrigation_device_output WHERE irrigation_device_output.irrigationDeviceId = " + irrigationDeviceId;
                let query = "SELECT irrigation_device_output.name,irrigation_device_output.description,irrigation_device_output.id,irrigation_device_output.sensorIdInput as inputSensorId, irrigation_device_input.name as inputSensorName,irrigation_device_output.sensorId as outputSensorId,irrigation_device_output.deviceTypeId as outputDeviceTypeId  FROM irrigation_device_output LEFT JOIN irrigation_device_link ON irrigation_device_link.irrigationDeviceOutputId=irrigation_device_output.id LEFT JOIN irrigation_device_input ON irrigation_device_input.id=irrigation_device_link.irrigationDeviceInputId WHERE irrigation_device_output.irrigationDeviceId = " + irrigationDeviceId;

                console.log(query)
                conn.query(query, (error: any, results: any) => {
                    conn.release()

                    if (error) {
                        reject({
                            http: 406,
                            status: 'Failed',
                            error: error
                        })
                    }

                    if (results && results.length == 0) {
                        resolve({
                            http: 204,
                            status: 'Success',
                            result: 'There is no irrigation device output with this ID'
                        })
                    }

                    resolve({
                        http: 200,
                        status: 'Success',
                        result: results
                    })
                })
            })
        })
    }

    /**
 * GET ('/information/:id')
 * Getting the information about the user
 * 
 * @async
 * @param id - The user Id
 * 
 * @return 
 */
    public async getOutputIndexUPDATE(irrigationOutputDeviceId: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                let query = "SELECT sensorIndex FROM irrigation_device_output WHERE id=" + irrigationOutputDeviceId;
                console.log(query);

                conn.query(query, (error: any, results: any) => {
                    conn.release()

                    if (error) {
                        reject({
                            http: 406,
                            status: 'Failed',
                            error: error
                        })
                    }

                    if (results.length == 0) {
                        resolve({
                            http: 204,
                            status: 'Success',
                            result: 'There is no irrigation device output with this ID'
                        })
                    }

                    resolve({
                        http: 200,
                        status: 'Success',
                        result: results[0]
                    })
                })
            })
        })
    }

    /**
* GET ('/information/:id')
* Getting the information about the user
* 
* @async
* @param id - The user Id
* 
* @return 
*/
    public async getOutputIndexINSERT(irrigationDeviceId: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                let query = "SELECT sensorIndex FROM irrigation_device_output WHERE irrigationDeviceId=" + irrigationDeviceId + " ORDER BY sensorIndex DESC LIMIT 1";
                console.log(query);

                conn.query(query, (error: any, results: any) => {
                    conn.release()

                    if (error) {
                        reject({
                            http: 406,
                            status: 'Failed',
                            error: error
                        })
                    }

                    if (results.length == 0) {
                        resolve({
                            http: 204,
                            status: 'Success',
                            result: 'There is no irrigation device output with this ID'
                        })
                    }

                    resolve({
                        http: 200,
                        status: 'Success',
                        result: results[0]
                    })
                })
            })
        })
    }

    /**
 * GET ('/information/:id')
 * Getting the information about the user
 * 
 * @async
 * @param id - The user Id
 * 
 * @return 
 */
    public async getByIrrigationDeviceIdAndIndex(irrigationDeviceId: number, sensorIndex: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                let query = "SELECT * FROM irrigation_device_output WHERE irrigationDeviceId=" + irrigationDeviceId + " AND sensorIndex=" + sensorIndex;
                console.log(query);

                conn.query(query, (error: any, results: any) => {
                    conn.release()

                    if (error) {
                        reject({
                            http: 406,
                            status: 'Failed',
                            error: error
                        })
                    }

                    if (results.length == 0) {
                        resolve({
                            http: 204,
                            status: 'Success',
                            result: 'There is no irrigation device output with this ID'
                        })
                    }

                    resolve({
                        http: 200,
                        status: 'Success',
                        result: results[0]
                    })
                })
            })
        })
    }

    /**
     * GET ('/information/:id')
     * Getting the information about the user
     * 
     * @async
     * @param id - The user Id
     * 
     * @return 
     */
    public async getIrrigationOutputDeviceIntervalById(id: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                let query = "SELECT id as valve,intervals as config FROM irrigation_device_output WHERE irrigationDeviceId = " + id;

                conn.query(query, (error: any, results: any) => {
                    conn.release()

                    if (error) {
                        reject({
                            http: 406,
                            status: 'Failed',
                            error: error
                        })
                    }

                    if (results.length == 0) {
                        resolve({
                            http: 204,
                            status: 'Success',
                            result: 'There is no interval on irrigation device output with this ID'
                        })
                    }

                    resolve({
                        http: 200,
                        status: 'Success',
                        result: results
                    })
                })
            })
        })
    }

    /**
     * GET ('/information/:id')
     * Getting the information about the user
     * 
     * @async
     * @param id - The user Id
     * 
     * @return 
     */
    public async storeIrrigationOutputDevice(irrigationDeviceId: number, sensorId: number,
        sensorIndex: number, intervals: string, status: boolean, name: string, sensorIdInput: number, description: string,deviceTypeId:number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {
            try {
                db.getConnection((err: any, conn: any) => {

                    let sensorIdInputCheck: any = sensorIdInput
                    console.log("sensorIdInput", sensorIdInput)
                    if (sensorIdInput == undefined) {
                        sensorIdInputCheck = 'NULL'
                    }
                    let query = "INSERT INTO irrigation_device_output (irrigationDeviceId,sensorId,sensorIndex,intervals,status,name,sensorIdInput,description,deviceTypeId)" +
                        " VALUES (" + irrigationDeviceId + "," + sensorId + "," + sensorIndex + ",'" +
                        intervals + "'," + status + ",'" + name + "'," + sensorIdInputCheck + ",'" + description + "',"+deviceTypeId+");"
                    console.log("query", query)
                    conn.query(query, (error: any, results: any) => {
                        conn.release()

                        if (error) {
                            reject({
                                http: 406,
                                status: 'Failed',
                                error: error
                            })
                        }
                        console.log(results, 'este es el undefined?')
                        if (results && results.affectedRows != undefined && results.affectedRows == 1) {
                            resolve({
                                http: 200,
                                status: 'Success',
                                result: 'Irrigation device output inserted succesfully',
                                insertId: results.insertId
                            })
                        } else {
                            resolve({
                                http: 204,
                                status: 'Success',
                                message: "Irrigation device output could not be inserted",
                                result: results
                            })
                        }
                    })
                })
            } catch (error) {
                reject({
                    http: 406,
                    status: 'Failed',
                    error: error
                })
            }

        })
    }

    /**
     * GET ('/information/:id')
     * Getting the information about the user
     * 
     * @async
     * @param id - The user Id
     * 
     * @return 
     */
    public async updateIrrigationOutputDevice(irrigationDeviceId: number, sensorId: number, index: number, name: string, sensorIdInput: number, description: string, deviceTypeId: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                let sensorIdInputCheck: any = sensorIdInput
                sensorIdInputCheck = 'NULL'

                if (sensorIdInput) {
                    sensorIdInputCheck = sensorIdInput
                }

                let query = "UPDATE irrigation_device_output SET sensorId=" + sensorId + ",sensorIdInput=" + sensorIdInputCheck + ",name='" + name + "',description='" + description + "' ,deviceTypeId=" + deviceTypeId + " WHERE `sensorIndex`=" + index + " AND irrigationDeviceId=" + irrigationDeviceId + ";"
                console.log("queryUpdOutput", query);

                conn.query(query, (error: any, results: any) => {
                    conn.release()

                    if (error) {
                        reject({
                            http: 406,
                            status: 'Failed',
                            error: error
                        })
                    }
                    console.log(results)
                    if (results && results.affectedRows == 1) {
                        resolve({
                            http: 200,
                            status: 'Success',
                            result: 'Irrigation device output updated succesfully'
                        })
                    } else {
                        resolve({
                            http: 204,
                            status: 'Success',
                            message: "Irrigation device output could not be updated",
                            result: results
                        })
                    }
                })
            })
        })
    }

    /**
     * GET ('/information/:id')
     * Getting the information about the user
     * 
     * @async
     * @param id - The user Id
     * 
     * @return 
     */
    public async updateIrrigationOutputDeviceInterval(irrigationDeviceId: number, intervals: any, valveIndex: any): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                let query = "UPDATE irrigation_device_output SET intervals='" + intervals + "' WHERE irrigationDeviceId=" + irrigationDeviceId
                    + " AND sensorIndex=" + valveIndex + ";"
                console.log(query)
                conn.query(query, (error: any, results: any) => {
                    conn.release()

                    if (error) {
                        reject({
                            http: 406,
                            status: 'Failed',
                            error: error
                        })
                    }
                    console.log(results)
                    if (results && results.affectedRows > 0) {
                        resolve({
                            http: 200,
                            status: 'Success',
                            result: 'Irrigation device output valve intervals updated succesfully'
                        })
                    } else {
                        resolve({
                            http: 204,
                            status: 'Success',
                            message: "Irrigation device output valve intervals could not be updated",
                            result: results
                        })
                    }
                })
            })
        })
    }

    /**
     * GET ('/information/:id')
     * Getting the information about the user
     * 
     * @async
     * @param id - The user Id
     * 
     * @return 
     */
    public async deleteIrrigationOutputDevice(id: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                let query = "DELETE FROM irrigation_device_output WHERE id=" + id + ";"
                conn.query(query, (error: any, results: any) => {
                    conn.release()

                    if (error) {
                        reject({
                            http: 406,
                            status: 'Failed',
                            error: error
                        })
                    }
                    console.log(results)

                    if (results.length == 0) {
                        resolve({
                            http: 204,
                            status: 'Success',
                            result: 'There is no irrigation device output with this ID'
                        })
                    }

                    resolve({
                        http: 200,
                        status: 'Success',
                        result: results[0]
                    })
                })
            })
        })
    }
// new Method created By shesh 
    /**
     * GET ('/information/:id')
     * Getting the information about the user
     * 
     * @async
     * @param id - The user Id
     * 
     * @return 
     */
    public async createIrrigationDeviceValveConfigAction(data:any): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {
                console.log('data',data);
                let irrigationDeviceId = data.valveConfig.valve[0].irrigationDeviceId;
                let slotNumber = data.slotNumber;
                let valvConfig = JSON.stringify(data.valveConfig);
                let query = "Insert into irrigation_device_output_config (irrigationDeviceId,valveConfig,slotNumber) value("+irrigationDeviceId+",'"+valvConfig+"',"+slotNumber+")";
                console.log(query)
                conn.query(query, (error: any, results: any) => {
                    conn.release()

                    if (error) {
                        reject({
                            http: 406,
                            status: 'Failed',
                            error: error
                        })
                    }
                    console.log("results del crear", results)
                    if (results) {
                        resolve({
                            http: 200,
                            status: 'Success',
                            message: 'Irrigation device ooutput config created succesfully'
                        })
                    } else {
                        resolve({
                            http: 204,
                            status: 'Success',
                            message: "Irrigation device ooutput config Not created succesfully",
                            result: results
                        })
                    }
                })
            })
        })
    }

    /**
     * GET ('/information/:id')
     * Getting the information about the user
     * 
     * @async
     * @param id - The user Id  
     * 
     * @return 
     */
    public async updateIrrigationDeviceValveConfigSlotAction(id: number, data:any): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {
                console.log('update config',data.valveConfig.valve[0]);
                let irrigationDeviceId = data.valveConfig.valve[0].irrigationDeviceId;
                let valvConfig = JSON.stringify(data.valveConfig);
                let slotNumber = data.slotNumber;
                let query = "UPDATE irrigation_device_output_config SET slotNumber="+ slotNumber +", irrigationDeviceId='" + irrigationDeviceId + "' ,valveConfig='" + valvConfig + "' WHERE id=" + id+  ";"
                console.log(query)
                conn.query(query, (error: any, results: any) => {
                    conn.release()

                    if (error) {
                        reject({
                            http: 406,
                            status: 'Failed',
                            error: error
                        })
                    }
                    console.log(results)
                    if (results && results.affectedRows > 0) {
                        resolve({
                            http: 200,
                            status: 'Success',
                            result: 'Irrigation device output slot config  updated succesfully'
                        })
                    } else {
                        resolve({
                            http: 204,
                            status: 'Success',
                            message: "Irrigation device output valve slot config could not be updated",
                            result: results
                        })
                    }
                })
            })
        })
    }

    /**
     * GET ('/information/:id')
     * Getting the information about the user
     * 
     * @async
     * @param id - The user Id
     * 
     * @return 
     */
    public async getValvesConfigByIrrigationDeviceIdAction(id: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                let query = "SELECT * FROM irrigation_device_output_config WHERE irrigation_device_output_config.irrigationDeviceId=" + id+";";
                console.log("queryGetIrrigationOutputDevice", query);

                conn.query(query, (error: any, results: any) => {
                    conn.release()
                    console.log('results',results,results.length)
                    if (error) {
                        reject({
                            http: 406,
                            status: 'Failed',
                            error: error
                        })
                    }

                    if (results.length == 0) {
                        resolve({
                            http: 204,
                            status: 'Success',
                            result: 'There is no irrigation device output with this ID'
                        })
                    }

                    resolve({
                        http: 200,
                        status: 'Success',
                        result: results
                    })
                })
            })
        })
    }

    /**
     * GET ('/information/:id')
     * Getting the information about the user
     * 
     * @async
     * @param id - The user Id
     * 
     * @return 
     */
    public async SyncValvePlanConfigfromDeviceAction(deviceId: number,slotNumber:Number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                let query = "SELECT * FROM irrigation_device_output_config WHERE irrigation_device_output_config.irrigationDeviceId =" + deviceId+" AND irrigation_device_output_config.slotNumber = "+slotNumber+";";
                console.log("queryGetIrrigationOutputDevice", query);

                conn.query(query, (error: any, results: any) => {
                    conn.release()
                    console.log('results',results,results.length)
                    if (error) {
                        reject({
                            http: 406,
                            status: 'Failed',
                            error: error
                        })
                    }

                    if (results.length == 0) {
                        resolve({
                            http: 204,
                            status: 'Success',
                            opetation:'INSERT',
                            result: 'There is no irrigation device output config with this slot number and irrigation device'
                        })
                    }

                    resolve({
                        http: 200,
                        status: 'Success',
                        opetation:'UPDATE',
                        result: results
                    })
                })
            })
        })
    }

    /**
     * GET ('/information/:id')
     * Getting the information about the user
     * 
     * @async
     * @param id - The user Id
     * 
     * @return 
     */
    public async getIrrigationDeviceschedulePlansUpdatedDirectlyFromDeviceAction(id: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                let query = "SELECT * FROM irrigation_device_ouput_config_from_device WHERE irrigation_device_ouput_config_from_device.irrigationDeviceId=" + id+";";
                console.log("queryGetIrrigationOutputDevice", query);

                conn.query(query, (error: any, results: any) => {
                    conn.release()
                    console.log('results',results,results.length)
                    if (error) {
                        reject({
                            http: 406,
                            status: 'Failed',
                            error: error
                        })
                    }

                    if (results.length == 0) {
                        resolve({
                            http: 204,
                            status: 'Success',
                            result: 'There is no irrigation device output with this ID'
                        })
                    }

                    resolve({
                        http: 200,
                        status: 'Success',
                        result: results
                    })
                })
            })
        })
    }

    /**
     * GET ('/information/:id')
     * Getting the information about the user
     * 
     * @async
     * @param id - The user Id
     * 
     * @return 
     */
    public async deleteIrrigationSlotConfigAction(id: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                let query = "DELETE FROM irrigation_device_output_config WHERE id=" + id + ";"
                conn.query(query, (error: any, results: any) => {
                    conn.release()

                    if (error) {
                        reject({
                            http: 406,
                            status: 'Failed',
                            error: error
                        })
                    }
                    console.log(results)

                    if (results.length == 0) {
                        resolve({
                            http: 204,
                            status: 'Success',
                            result: 'There is no irrigation device output with this ID'
                        })
                    }

                    resolve({
                        http: 200,
                        status: 'Success',
                        result: results[0]
                    })
                })
            })
        })
    }

    public async UpdateIrrigationOutputValveStatusModeAction(id: number,sensorIndex: number,valvestatusMode: any): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                let query = "UPDATE irrigation_device_output SET output_status_mode = '" + valvestatusMode + "' WHERE sensorId = " + id +" AND  sensorIndex = "+sensorIndex+";"
                console.log(query, 'update the status Mode of Valve');
                conn.query(query, (error: any, results: any) => {
                    conn.release()

                    if (error) {
                        reject({
                            http: 406,
                            status: 'Failed',
                            error: error
                        })
                    }
                    console.log("results del update", results)
                    if (results) {
                        resolve({
                            http: 200,
                            status: 'Success',
                            message: 'Irrigation device output valve statusMode updated succesfully'
                        })
                    } else {
                        resolve({
                            http: 204,
                            status: 'Success',
                            message: "Irrigation device output valve statusMode  could not be updated",
                            result: results
                        })
                    }
                })
            })
        })
    }


}

export default new IrrigationDeviceOutputController();
