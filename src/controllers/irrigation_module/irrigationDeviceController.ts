import db from "../../database";
import irrigationDeviceInputController from "./irrigationDeviceInputController";
import irrigationDeviceOutputController from "./irrigationDeviceOutputController";

/*
 * /users
 */
class IrrigationDeviceController {
    /**
     * GET ('/information/:id')
     * Getting the information about the user
     * 
     * @async
     * @param id - The user Id
     * 
     * @return 
     */
    public async getIrrigationDeviceById(id: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                let query = "SELECT * FROM irrigation_device WHERE id = " + id;

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
                            result: 'There is no irrigation device with this ID',
                            user_data: {}
                        })
                    }

                    resolve({
                        http: 200,
                        status: 'Success',
                        user_data: results[0]
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
    public async getIrrigationDeviceOutputCount(irrigationDeviceId: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {
                let query = "SELECT * FROM `irrigation_device_output` WHERE irrigation_device_output.status=1 and irrigation_device_output.irrigationDeviceId=" + irrigationDeviceId + ";";

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
                            result: []
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
    public async getIrrigationDeviceOutputTotalCount(irrigationDeviceId: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {
                let query = "SELECT irrigation_device_output.*, sensor_info.id, sensor_info.app_KEY, sensor_info.device_EUI, sensor_gateway_pkid.mac_number, sensor_gateway_pkid.sensor_id FROM `irrigation_device_output` LEFT JOIN sensor_info ON sensor_info.id = irrigation_device_output.sensorId LEFT JOIN sensor_gateway_pkid ON sensor_gateway_pkid.sensor_id = sensor_info.id WHERE irrigation_device_output.irrigationDeviceId=" + irrigationDeviceId + ";";

                conn.query(query, (error: any, results: any) => {
                    conn.release()
                    console.log('123', results)

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
                            result: []
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
    public async getIrrigationDeviceListing(userId: number, pageSize: number, pageIndex: number): Promise<object> {
        const first_value = (pageSize * pageIndex) - pageSize;

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {
                //let query = "SELECT * FROM irrigation_device INNER JOIN irrigation_device_output ON irrigation_device_output.irrigationDeviceId = irrigation_device.id WHERE userId=" + userId + " AND irrigation_device_output.status=1 ORDER BY irrigation_device.id DESC LIMIT " + first_value + ', ' + pageSize;
                let query = "SELECT irrigation_device.*, users.first_name, irrigation_device_type.name AS deviceTypeName FROM irrigation_device INNER JOIN users ON users.id=irrigation_device.userId INNER JOIN irrigation_device_type ON irrigation_device_type.id=irrigation_device.deviceTypeId WHERE userId=" + userId + " ORDER BY irrigation_device.id DESC LIMIT " + first_value + ', ' + pageSize;
                //let query = "SELECT irrigation_device.*, COUNT(*) as openIrrigationOutputs FROM irrigation_device INNER JOIN irrigation_device_output ON irrigation_device_output.irrigationDeviceId = irrigation_device.id WHERE userId=" + userId + " AND irrigation_device_output.status=1 GROUP BY irrigation_device.id" + " ORDER BY irrigation_device.id DESC LIMIT " + first_value + ', ' + pageSize;
                console.log(query)
                conn.query(query, async (error: any, results: any) => {
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
                            result: []
                        })
                    }
                    console.log(results)
                    let contador: any = 0;
                    for (const irrigationDevice of results) {
                        let outputRes: any = await this.getIrrigationDeviceOutputCount(irrigationDevice.id)
                        if (outputRes.result) {
                            results[contador].openIrrigationOutputs = outputRes.result
                        } else {
                            results[contador].openIrrigationOutputs = 0
                        }
                        let outputTotalRes: any = await this.getIrrigationDeviceOutputTotalCount(irrigationDevice.id)
                        if (outputTotalRes.result) {
                            results[contador].totalIrrigationOutputs = outputTotalRes.result
                        } else {
                            results[contador].totalIrrigationOutputs = 0
                        }

                        let inputTotalRes: any = await this.getIrrigationInputDevicesByIrregationDeviceId(irrigationDevice.id)
                        console.log("inputTotalRes", inputTotalRes)
                        if (inputTotalRes.result) {
                            results[contador].totalIrrigationSensors = inputTotalRes.result.sensorsCount
                        } else {
                            results[contador].totalIrrigationSensors = 0
                        }
                        contador++;
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
    public async getIrrigationInputDevicesByIrregationDeviceId(irrigationDeviceId: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                let query = "SELECT COUNT(*) as sensorsCount FROM irrigation_device_input WHERE irrigationDeviceId=" + irrigationDeviceId + ";";
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
                    if (results.length != 0) {
                        resolve({
                            http: 200,
                            status: 'Success',
                            message: 'Irrigation device inputs retrieved succesfully',
                            result: results[0]
                        })
                    } else {
                        resolve({
                            http: 204,
                            status: 'Success',
                            message: "Irrigation device inputs could not be retrieved",
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
    public async storeIrrigationDevice(name: string, nameSentilo: string, latitude: number, longitude: number,
        description: string, status: boolean, userId: number, deviceTypeId: number, valves: any[], sensors: any[]): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                let query = "INSERT INTO irrigation_device (name,nameSentilo,latitude,longitude,description,status," +
                    "userId,deviceTypeId) VALUES ('" + name + "','" + nameSentilo + "'," + latitude + "," +
                    longitude + ",'" + description + "'," + status + "," + userId + "," + deviceTypeId + ")"

                conn.query(query, async (error: any, results: any) => {
                    conn.release()

                    if (error) {
                        reject({
                            http: 406,
                            status: 'Failed',
                            error: error
                        })
                    }

                    if (results.affectedRows == 1) {
                        let irrigationDeviceInsertId = results.insertId
                        let valvesInserted: number = 0
                        let contador: number = 1
                        for (const irrigationDeviceOutput of valves) {
                            let deviceOutputRes: any = await irrigationDeviceOutputController.storeIrrigationOutputDevice(
                                irrigationDeviceInsertId, irrigationDeviceOutput.sensorId, contador,
                                "", false, irrigationDeviceOutput.name)
                            if (deviceOutputRes.http == 200) {
                                valvesInserted++
                            }
                            contador++
                        }
                        let sensorsInserted: number = 0
                        contador = 1
                        for (const irrigationDeviceInput of sensors) {
                            let deviceInputRes: any = await irrigationDeviceInputController.storeIrrigationInputDevice(irrigationDeviceInsertId, irrigationDeviceInput.sensorId, 0, 0, contador,irrigationDeviceInput.name)
                            if (deviceInputRes.http == 200) {
                                sensorsInserted++
                            }
                            contador++
                        }

                        resolve({
                            http: 200,
                            status: 'Success',
                            result: 'Irrigation device inserted succesfully',
                            insertId: irrigationDeviceInsertId,
                            valvesInserted: valvesInserted,
                            sensorsInserted: sensorsInserted
                        })
                    } else {
                        resolve({
                            http: 204,
                            status: 'Success',
                            message: "Irrigation device could not be inserted",
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
    public async updateIrrigationDevice(id: number, name: string, nameSentilo: string, latitude: number,
        longitude: number, description: string, status: boolean, userId: number, deviceTypeId: number, valves: any[], sensors: any[]): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                let query = "UPDATE irrigation_device SET name='" + name + "', nameSentilo='" + nameSentilo +
                    "', latitude=" + latitude + ",longitude=" + longitude + ", description='" + description + "', status=" + status +
                    ", userId=" + userId + ",deviceTypeId=" + deviceTypeId + " WHERE id=" + id + ";"

                conn.query(query, async (error: any, results: any) => {
                    conn.release()

                    if (error) {
                        reject({
                            http: 406,
                            status: 'Failed',
                            error: error
                        })
                    }
                    console.log(results)
                    try {
                        if (results && results.affectedRows != 0) {
                            let valvesUpdated: number = 0
                            for (const irrigationDeviceOutput of valves) {
                                let deviceOutputRes: any = await irrigationDeviceOutputController.updateIrrigationOutputDevice(
                                    irrigationDeviceOutput.id, irrigationDeviceOutput.irrigationDeviceId, irrigationDeviceOutput.sensorId, 
                                    irrigationDeviceOutput.sensorIndex, irrigationDeviceOutput.intervals, irrigationDeviceOutput.status, irrigationDeviceOutput.name)
                                if (deviceOutputRes.http == 200) {
                                    valvesUpdated++
                                }
                            }
                            let sensorsUpdated: number = 0
                            for (const irrigationDeviceInput of sensors) {
                                let deviceInputRes: any = await irrigationDeviceInputController.updateIrrigationInputDevice(
                                    irrigationDeviceInput.id, irrigationDeviceInput.irrigationDeviceId, irrigationDeviceInput.sensorId,
                                    irrigationDeviceInput.lastTemperature, irrigationDeviceInput.lastHumidity, irrigationDeviceInput.sensorIndex, irrigationDeviceInput.name)
                                if (deviceInputRes.http == 200) {
                                    sensorsUpdated++
                                }
                            }

                            resolve({
                                http: 200,
                                status: 'Success',
                                result: 'Irrigation device updated succesfully',
                                valvesUpdated: valvesUpdated,
                                sensorsUpdated: sensorsUpdated
                            })

                        } else {
                            resolve({
                                http: 204,
                                status: 'Success',
                                message: "Irrigation device could not be updated",
                                result: results
                            })
                        }
                    } catch (error) {
                        reject({
                            http: 406,
                            status: 'Failed',
                            error: error
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
    public async deleteIrrigationDevice(id: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                let query = "DELETE FROM irrigation_device WHERE id=" + id + ";"
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
                            result: 'There are no users with this ID'
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
}

export default new IrrigationDeviceController();