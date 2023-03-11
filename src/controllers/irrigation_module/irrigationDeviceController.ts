import db from "../../database";
import irrigationDeviceInputController from "./irrigationDeviceInputController";
import irrigationDeviceLinkController from "./irrigationDeviceLinkController";
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
    public async getIrrigationDeviceByIdInner(id: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                let query = "SELECT * FROM irrigation_device WHERE id=" + id;
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
                    console.log(results)

                    if (results && !results[0]) {
                        resolve({
                            http: 204,
                            status: 'Success',
                            result: 'There is no irrigation device with this ID',
                            irrigationDevice: {}
                        })
                    } else {
                        let irrigationDevice = results[0]
                        let irrigationInputRes: any = await irrigationDeviceInputController.getInputByIrrigationDeviceId(irrigationDevice.id)
                        let irrigationOutputRes: any = await irrigationDeviceOutputController.getOutputByIrrigationDeviceId(irrigationDevice.id)


                        if (irrigationOutputRes.http == 200) {
                            irrigationDevice.valves = (irrigationOutputRes.result)
                        } else {
                            irrigationDevice.valves = []
                        }
                        if (irrigationInputRes.http == 200) {
                            irrigationDevice.sensors = (irrigationInputRes.result)
                        } else {
                            irrigationDevice.sensors = []
                        }

                        resolve(irrigationDevice)
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
    public async getIrrigationDeviceById(id: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {
                let query = "SELECT * FROM `irrigation_device` WHERE id=" + id + ";";

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
                        result: results[0]
                    })
                })
            })
        })
    }

    public async getIrrigationDeviceTempHum(id: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {
                let query = "SELECT * FROM `irrigation_device_temphum` WHERE sensorId=" + id + ";";

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
                let query = "SELECT irrigation_device_output.*, sensor_info.id, sensor_info.app_KEY, sensor_info.device_EUI, sensor_info.network_server_mac as gateway_mac,sensor_gateway_pkid.mac_number, sensor_gateway_pkid.sensor_id FROM `irrigation_device_output` LEFT JOIN sensor_info ON sensor_info.id = irrigation_device_output.sensorId LEFT JOIN sensor_gateway_pkid ON sensor_gateway_pkid.sensor_id = sensor_info.id WHERE irrigation_device_output.irrigationDeviceId=" + irrigationDeviceId + ";";

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
    public async updateIrrigationDeviceRelatedSensor(irrigationDeviceId: number, relatedSensorDevEui: string, humidityLimit: number, humidityLimitInferior: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                let query = "UPDATE `irrigation_device` SET `parametersSensorDevEui` = '" + relatedSensorDevEui +
                    "', `humidityLimit` = '" + humidityLimit + "', `humidityLimitInferior` = '" + humidityLimitInferior + "' WHERE `irrigation_device`.`id` = " + irrigationDeviceId + ";";
                conn.query(query, (error: any, results: any) => {
                    conn.release()

                    if (error) {
                        reject({
                            http: 406,
                            status: 'Failed',
                            error: error
                        })
                    }
                    console.log("results", results)
                    if (results && results.affectedRows) {
                        resolve({
                            http: 200,
                            status: 'Success',
                            message: 'Irrigation device related sensor updated succesfully'
                        })
                    } else {
                        resolve({
                            http: 204,
                            status: 'Success',
                            message: "Irrigation device related sensor could not be updated",
                            result: results
                        })
                    }
                })
            })
        })
    }

    public async updateIrrigationDeviceRelatedSensorValves(irrigationDeviceId: number, valveNumber: number, humidityLimit: number, humidityLimitInferior: number, relatedSensorDevEui: string, active: boolean): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                let query = "SELECT * FROM irrigation_device_temphum WHERE sensorId =" + irrigationDeviceId + " AND valveNumber = " + valveNumber + ";"
                conn.query(query, async (error: any, results: any) => {
                    conn.release()

                    if (error) {
                        reject({
                            http: 406,
                            status: 'Failed',
                            error: error
                        })
                    }
                    console.log("results", results)
                    if (results.length == 0) {
                        results = await this.createNewTempHum(irrigationDeviceId, valveNumber, humidityLimit, humidityLimitInferior, relatedSensorDevEui, active)
                        console.log('entro en crear');
                    } else {
                        results = await this.updateTempHum(irrigationDeviceId, valveNumber, humidityLimit, humidityLimitInferior, relatedSensorDevEui, active)
                        console.log('entro en update');
                    }
                    resolve({
                        http: 204,
                        status: 'Success',
                        message: "Irrigation related device created",
                        result: results
                    })
                })
            })
        })
    }

    public async createNewTempHum(irrigationDeviceId: number, valveNumber: number, humidityLimit: number, humidityLimitInferior: number, relatedSensorDevEui: string, active: boolean): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                let query = "INSERT INTO irrigation_device_temphum (sensorId, valveNumber, humidityLimit, humidityLimitInferior, sensorDevEui, active)" + "VALUES (" + irrigationDeviceId + "," + valveNumber + "," + humidityLimit + "," + humidityLimitInferior + ",'" + relatedSensorDevEui + "'," + active + ");"
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
                            message: 'Irrigation device related sensor updated succesfully'
                        })
                    } else {
                        resolve({
                            http: 204,
                            status: 'Success',
                            message: "Irrigation device related sensor could not be updated",
                            result: results
                        })
                    }
                })
            })
        })
    }

    public async updateTempHum(irrigationDeviceId: number, valveNumber: number, humidityLimit: number, humidityLimitInferior: number, relatedSensorDevEui: string, active: boolean): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                let query = "UPDATE irrigation_device_temphum SET humidityLimit = " + humidityLimit + ", humidityLimitInferior = " + humidityLimitInferior + ", active = " + active + ", sensorDevEui = '" + relatedSensorDevEui + "' WHERE sensorId = " + irrigationDeviceId + " AND valveNumber = " + valveNumber + ";"
                console.log(query, 'query del update');
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
                            message: 'Irrigation device related sensor updated succesfully'
                        })
                    } else {
                        resolve({
                            http: 204,
                            status: 'Success',
                            message: "Irrigation device related sensor could not be updated",
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
                                       description: string, status: boolean, userId: number, deviceTypeId: number, valves: any[], sensors: any[], sensorId: any,parametersSensorDevEui:string): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {
                try {
                    let lat = latitude
                    let lng = longitude
                    if (!latitude) {
                        lat = null
                    }

                    if (!longitude) {
                        lng = null
                    }

                    let query = "INSERT INTO irrigation_device (name,nameSentilo,latitude,longitude,description,status," +
                        "userId,deviceTypeId, sensorId,parametersSensorDevEui, humidityLimit, intervalHours) VALUES ('" + name + "','" + nameSentilo + "'," + lat + "," +
                        lng + ",'" + description + "'," + status + "," + userId + "," + deviceTypeId + "," + sensorId + ",'" + parametersSensorDevEui + "', 100, '')"
                    console.log("INSERT IRRIG DEV", query)
                    conn.query(query, async (error: any, results: any) => {
                        conn.release()

                        if (error) {
                            reject({
                                http: 406,
                                status: 'Failed',
                                error: error
                            })
                        }
                        if (results && results.affectedRows == 1) {

                            // IRRIGATION DEVICE ID
                            let irrigationDeviceInsertId = results.insertId

                            // SENSORS
                            let sensorsInserted: number = 0
                            let contador: number = 1
                            if (sensors.length != 0) {
                                for (const irrigationDeviceInput of sensors) {
                                    let deviceInputRes: any = await irrigationDeviceInputController.storeIrrigationInputDevice(irrigationDeviceInsertId, irrigationDeviceInput.sensorId, 0, 0, contador, irrigationDeviceInput.name, irrigationDeviceInput.connectionType, irrigationDeviceInput.authtoken, irrigationDeviceInput.provider)
                                    if (deviceInputRes.http == 200) {
                                        sensorsInserted++
                                    }
                                    contador++
                                }
                            }


                            // VALVES
                            let valvesInserted: number = 0
                            contador = 1
                            if (valves.length != 0) {
                                for (const irrigationDeviceOutput of valves) {
                                    let indexRes: any = await irrigationDeviceOutputController.getOutputIndexINSERT(irrigationDeviceInsertId)
                                    let index: any = indexRes.result.sensorIndex
                                    if (index == undefined) {
                                        index = 1
                                    } else {
                                        index++
                                    }
                                    console.log("insertIndex", index)
                                    console.log("input valves", irrigationDeviceOutput)
                                    console.log(" ***** 1 *****")
                                    let deviceOutputRes: any = await irrigationDeviceOutputController.storeIrrigationOutputDevice(
                                        irrigationDeviceInsertId, irrigationDeviceOutput.inputSensorName, index, "", false, irrigationDeviceOutput.name,
                                        sensorId, irrigationDeviceOutput.description)
                                    console.log(" ***** 2 *****")
                                    console.log("deviceOutputRes", deviceOutputRes)
                                    if (deviceOutputRes.http == 200) {
                                        console.log(" ***** 3 *****")
                                        if (valves.length != 0 && sensors.length != 0) {
                                            console.log(" ***** 4 *****")
                                            let outputDeviceInsertId = deviceOutputRes.insertId
                                            console.log(deviceTypeId, 'esto es la previa, el tipo');
                                            if(deviceTypeId == 4){
                                                irrigationDeviceOutput.inputSensorName = 'a';
                                                console.log('que está pasando??');
                                            }
                                            let res: any = await irrigationDeviceInputController.getIrrigationInputDeviceByIrrigationDeviceIdAndName(irrigationDeviceOutput.inputSensorName, irrigationDeviceInsertId)
                                            console.log("resx", res)
                                            if (res.http == 200) {
                                                if (irrigationDeviceOutput.inputSensorName != undefined) {
                                                    let resLink = await irrigationDeviceLinkController.storeIrrigationDeviceLink(res.result.id, outputDeviceInsertId, irrigationDeviceInsertId)
                                                    console.log("resLink", resLink)
                                                }
                                            }
                                        }
                                        valvesInserted++
                                    }
                                    contador++
                                }
                                /*
                                for (const irrigationDeviceOutput of valves) {
                                    console.log("input valves", irrigationDeviceOutput)
                                    let deviceOutputRes: any = await irrigationDeviceOutputController.storeIrrigationOutputDevice(
                                        irrigationDeviceInsertId, irrigationDeviceOutput.id, contador,
                                        "", false, irrigationDeviceOutput.name, sensorId, irrigationDeviceOutput.description)
                                    if (deviceOutputRes.http == 200) {
                                        if (valves.length != 0 && sensors.length != 0) {
                                            let outputDeviceInsertId = deviceOutputRes.insertId
                                            let res: any = await irrigationDeviceInputController.getIrrigationInputDeviceByIrrigationDeviceIdAndName(irrigationDeviceOutput.inputSensorName, irrigationDeviceInsertId)
                                            console.log("resx", res)
                                            if (res.http == 200) {
                                                let resLink = await irrigationDeviceLinkController.storeIrrigationDeviceLink(res.result.id, outputDeviceInsertId, irrigationDeviceInsertId)
                                                console.log("resLink", resLink)
                                            }
                                        }
                                        valvesInserted++
                                    }
                                    contador++
                                }*/
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
                } catch (error) {
                    reject({
                        http: 406,
                        status: 'Failed',
                        error: error
                    })
                }

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
    public async updateIrrigationDevice(id: number, sensorId: number, name: string, nameSentilo: string, latitude: number,
                                        longitude: number, description: string, status: boolean, userId: number, deviceTypeId: number,
                                        valves: any[], sensors: any[]): Promise<object> {
        let valvesUpdate: any[] = []
        let valvesInsert: any[] = []
        let sensorsUpdate: any[] = []
        let sensorsInsert: any[] = []

        let myIndex: any = 0
        valves.forEach(valve => {
            myIndex++;
            valve.index = myIndex;
            if (valve._id == undefined) {
                valvesInsert.push(valve)
            } else {
                valvesUpdate.push(valve)
            }
        });
        sensors.forEach(sensor => {
            if (sensor._id == undefined) {
                sensorsInsert.push(sensor)
            } else {
                sensorsUpdate.push(sensor)
            }
        });
        console.log("valvesUpdate", valvesUpdate)
        console.log("valvesInsert", valvesInsert)

        console.log("sensorsUpdate", sensorsUpdate)
        console.log("sensorsInsert", sensorsInsert)

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {
                try {
                    let lat = latitude
                    let lng = longitude
                    if (!latitude) {
                        lat = null
                    }

                    if (!longitude) {
                        lng = null
                    }

                    let query = "UPDATE irrigation_device SET name='" + name + "', nameSentilo='" + nameSentilo +
                        "',sensorId=" + sensorId + ",latitude=" + lat + ",longitude=" + lng + ", description='" + description + "', status=" + status +
                        ", userId=" + userId + ",deviceTypeId=" + deviceTypeId + " WHERE id=" + id + ";"
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
                        console.log(results)
                        try {
                            if (results && results.affectedRows != 0) {

                                // SENSORS ( UPDATE )
                                let sensorsUpdated: number = 0
                                if (sensorsUpdate.length != 0) {

                                    for (const irrigationDeviceInput of sensorsUpdate) {
                                        console.log(irrigationDeviceInput)
                                        let deviceInputRes: any = await irrigationDeviceInputController.updateIrrigationInputDevice(
                                            irrigationDeviceInput.inputId, irrigationDeviceInput.sensorId,
                                            irrigationDeviceInput.name, irrigationDeviceInput.connectionType,
                                            irrigationDeviceInput.authtoken, irrigationDeviceInput.provider)
                                        if (deviceInputRes.http == 200) {
                                            sensorsUpdated++
                                        }
                                    }
                                }

                                // SENSORS ( INSERT )
                                let sensorsInserted: number = 0
                                let contador: number = 1
                                console.log("sensorsInsert FUERA", sensorsInsert)
                                if (sensorsInsert.length != 0) {
                                    console.log("sensorsInsert DENTRO", sensorsInsert)

                                    for (const irrigationDeviceInput of sensorsInsert) {
                                        let deviceInputRes: any = await irrigationDeviceInputController.storeIrrigationInputDevice(id, irrigationDeviceInput.sensorId, 0, 0, contador, irrigationDeviceInput.name, irrigationDeviceInput.connectionType, irrigationDeviceInput.authtoken, irrigationDeviceInput.provider)
                                        if (deviceInputRes.http == 200) {
                                            sensorsInserted++
                                        }
                                        contador++
                                    }
                                }

                                // VALVES ( UPDATE )
                                let valvesUpdated: number = 0
                                console.log(" SENSORID IBOX ", sensorId)
                                if (valvesUpdate.length != 0) {

                                    for (const irrigationDeviceOutput of valvesUpdate) {
                                        let indexRes: any = await irrigationDeviceOutputController.getOutputIndexUPDATE(irrigationDeviceOutput._id)
                                        let index: any = indexRes.result.sensorIndex

                                        console.log("updateIndex", index)
                                        let deviceOutputRes: any = await irrigationDeviceOutputController.updateIrrigationOutputDevice(id,
                                            irrigationDeviceOutput.inputSensorName, index, irrigationDeviceOutput.name, sensorId, irrigationDeviceOutput.description)
                                        console.log("updateIrrigationDeviceOutputRes", deviceOutputRes)
                                        if (deviceOutputRes.http == 200) {
                                            valvesUpdated++
                                            let resOutputGet: any = await irrigationDeviceOutputController.getByIrrigationDeviceIdAndIndex(id, index)
                                            let irrigationInputDeviceId: any = 'NULL';
                                            if (sensorId != undefined) {
                                                let resInput: any = await irrigationDeviceInputController.getIrrigationInputDeviceByIrrigationDeviceIdAndName(irrigationDeviceOutput.inputSensorName, id)
                                                console.log("resInput", resInput)
                                                irrigationInputDeviceId = resInput.result.id
                                            }
                                            console.log("resOutputGet", resOutputGet)
                                            await irrigationDeviceLinkController.deleteIrrigationLinkDeviceByOutputId(resOutputGet.result.id)
                                            if (sensorId != undefined) {
                                                await irrigationDeviceLinkController.storeIrrigationDeviceLink(irrigationInputDeviceId, resOutputGet.result.id, id)
                                            }
                                        }
                                    }
                                }

                                // VALVES ( INSERT )
                                let valvesInserted: number = 0
                                console.log("valvesInsert", valvesInsert)
                                console.log("valvesInsert.length", valvesInsert.length)
                                if (valvesInsert.length != 0) {

                                    for (const irrigationDeviceOutput of valvesInsert) {
                                        let indexRes: any = await irrigationDeviceOutputController.getOutputIndexINSERT(id)
                                        let index: any = indexRes.result.sensorIndex
                                        if (index == undefined) {
                                            index = 1
                                        } else {
                                            index++
                                        }
                                        console.log("insertIndex", index)
                                        console.log("input valves", irrigationDeviceOutput)
                                        console.log(" ***** 1 *****")
                                        let deviceOutputRes: any = await irrigationDeviceOutputController.storeIrrigationOutputDevice(
                                            id, irrigationDeviceOutput.id, index, "", false, irrigationDeviceOutput.name,
                                            sensorId, irrigationDeviceOutput.description)
                                        console.log(" ***** 2 *****")
                                        console.log("deviceOutputRes", deviceOutputRes)
                                        if (deviceOutputRes.http == 200) {
                                            console.log(" ***** 3 *****")
                                            if (valves.length != 0 && sensors.length != 0) {
                                                console.log(" ***** 4 *****")
                                                let outputDeviceInsertId = deviceOutputRes.insertId
                                                let res: any = await irrigationDeviceInputController.getIrrigationInputDeviceByIrrigationDeviceIdAndName(irrigationDeviceOutput.inputSensorName, id)
                                                console.log("resx", res)
                                                if (res.http == 200) {
                                                    if (irrigationDeviceOutput.inputSensorName != undefined) {
                                                        let resLink = await irrigationDeviceLinkController.storeIrrigationDeviceLink(res.result.id, outputDeviceInsertId, id)
                                                        console.log("resLink", resLink)
                                                    }
                                                }
                                            }
                                            valvesInserted++
                                        }
                                        contador++
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
                } catch (error) {
                    reject({
                        http: 406,
                        status: 'Failed',
                        error: error
                    })
                }

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

    public async getSensorTypeBySensorId(deviceEUI: string): Promise<object> {
        console.log(deviceEUI, "Que esta pasando aqui")

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                let query = "SELECT irrigation_device.deviceTypeId AS type FROM irrigation_device INNER JOIN sensor_info ON irrigation_device.sensorId = sensor_info.id WHERE sensor_info.device_EUI = '" + deviceEUI + "';";
                console.log(query, "Que esta pasando aqui")
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

    public async updateGeswatIrrigationIntervals(irrigationDeviceId: string, intervals: any): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                try{
                    let query = "UPDATE `irrigation_device` SET `intervalHours` = '" + intervals + "' WHERE irrigation_device.id = (SELECT irrigation_device.id AS type FROM irrigation_device INNER JOIN sensor_info ON irrigation_device.sensorId = sensor_info.id WHERE sensor_info.device_EUI = '" + irrigationDeviceId + "');";
                    console.log(query, "Que esta pasando aqui")
                    conn.query(query, (error: any, results: any) => {
                        conn.release()

                        if (error) {
                            reject({
                                http: 406,
                                status: 'Failed',
                                error: error
                            })
                        }

                        resolve({
                            http: 200,
                            status: 'Success',
                            result: results
                        })
                    })
                }
                catch (error) {
                    reject({
                        http: 406,
                        status: 'Failed',
                        error: error
                    })
                }
            })
        })
    }

    public async getGeswatInterval(id: string): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                let query = "SELECT irrigation_device.intervalHours AS intervalHours FROM irrigation_device WHERE irrigation_device.id = " + id + ";"
                conn.query(query, (error: any, results: any) => {
                    conn.release()

                    if (error) {
                        reject({
                            http: 406,
                            status: 'Failed',
                            error: error
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
}

export default new IrrigationDeviceController();
