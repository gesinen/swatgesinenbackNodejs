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
    public async getOutputByIrrigationDeviceId(irrigationDeviceId: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                //let query = "SELECT irrigation_device_output.name,irrigation_device_output.description,irrigation_device_output.id,irrigation_device_output.sensorIdInput as inputSensorId FROM irrigation_device_output WHERE irrigation_device_output.irrigationDeviceId = " + irrigationDeviceId;
                let query = "SELECT irrigation_device_output.name,irrigation_device_output.description,irrigation_device_output.id,irrigation_device_output.sensorIdInput as inputSensorId, irrigation_device_input.name as inputSensorName FROM irrigation_device_output LEFT JOIN irrigation_device_link ON irrigation_device_link.irrigationDeviceOutputId=irrigation_device_output.id LEFT JOIN irrigation_device_input ON irrigation_device_input.id=irrigation_device_link.irrigationDeviceInputId WHERE irrigation_device_output.irrigationDeviceId = " + irrigationDeviceId;

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
        sensorIndex: number, intervals: string, status: boolean, name: string, sensorIdInput: number, description: string): Promise<object> {

        return new Promise((resolve: any, reject: any) => {
            try {
                db.getConnection((err: any, conn: any) => {

                    let sensorIdInputCheck: any = sensorIdInput
                    console.log("sensorIdInput", sensorIdInput)
                    if (sensorIdInput == undefined) {
                        sensorIdInputCheck = 'NULL'
                    }
                    let query = "INSERT INTO irrigation_device_output (irrigationDeviceId,sensorId,sensorIndex,intervals,status,name,sensorIdInput,description)" +
                        " VALUES (" + irrigationDeviceId + "," + sensorId + "," + sensorIndex + ",'" +
                        intervals + "'," + status + ",'" + name + "'," + sensorIdInputCheck + ",'" + description + "');"
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
    public async updateIrrigationOutputDevice(irrigationDeviceId: number, sensorId: number, index: number, name: string, sensorIdInput: number, description: string): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                let sensorIdInputCheck: any = sensorIdInput
                sensorIdInputCheck = 'NULL'

                if (sensorIdInput) {
                    sensorIdInputCheck = sensorIdInput
                }

                let query = "UPDATE irrigation_device_output SET sensorId=" + sensorId + ",sensorIdInput=" + sensorIdInputCheck + ",name='" + name + "',description='" + description + "' WHERE `sensorIndex`=" + index + " AND irrigationDeviceId=" + irrigationDeviceId + ";"
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

}

export default new IrrigationDeviceOutputController();
