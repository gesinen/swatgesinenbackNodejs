import db from "../../database";

/*
 * /users
 */
class IrrigationDeviceInputController {
    /**
     * GET ('/information/:id')
     * Getting the information about the user
     * 
     * @async
     * @param id - The user Id
     * 
     * @return 
     */
    public async getIrrigationInputDeviceById(id: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                let query = "SELECT * FROM irrigation_device_input WHERE id = " + id;

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
                            result: 'There is no irrigation device input with this ID'
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
    public async getInputByIrrigationDeviceId(irrigationDeviceId: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                let query = "SELECT * FROM irrigation_device_input WHERE irrigationDeviceId = " + irrigationDeviceId;

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
                            result: 'There is no irrigation device input with this ID'
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
    public async getIrrigationInputDeviceByIrrigationDeviceIdAndName(name: any, irrigationDeviceId: any): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                let query = "SELECT * FROM irrigation_device_input WHERE name = '" + name + "' AND irrigationDeviceId=" + irrigationDeviceId;
                console.log("query", query);

                conn.query(query, (error: any, results: any) => {
                    conn.release()

                    if (error) {
                        reject({
                            http: 406,
                            status: 'Failed',
                            error: error
                        })
                    }
                    console.log("res", results)

                    if (results == undefined) {
                        resolve({
                            http: 204,
                            status: 'Success',
                            result: 'There is no irrigation device input with this ID'
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
    public async storeIrrigationInputDevice(irrigationDeviceId: number, sensorId: number,
        lastTemperature: number, lastHumidity: number, sensorIndex: number, name: string,
        connectionType: String, authToken: string, provider: string): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {
                let providerCheck = provider
                if (provider == undefined) {
                    providerCheck = ''
                }
                let authCheck = authToken
                if (authToken == undefined) {
                    authCheck = ''
                }
                let query = "INSERT INTO irrigation_device_input (irrigationDeviceId,sensorId,lastHumidity,lastTemperature,sensorIndex, name,connectionType,authToken,provider)" +
                    " VALUES (" + irrigationDeviceId + "," + sensorId + "," + lastHumidity + "," +
                    lastTemperature + "," + sensorIndex + ", '" + name + "', '" + connectionType + "','" +
                    authCheck + "','" + providerCheck + "')"
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
                    console.log(results)
                    if (results && results.affectedRows == 1) {
                        resolve({
                            http: 200,
                            status: 'Success',
                            result: 'Irrigation device input inserted succesfully',
                            insertId: results.insertId
                        })
                    } else {
                        resolve({
                            http: 204,
                            status: 'Success',
                            message: "Irrigation device input could not be inserted",
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
                    console.log(results)
                    if (results) {
                        resolve({
                            http: 200,
                            status: 'Success',
                            message: 'Irrigation device inputs retrieved succesfully',
                            result: results.sensorsCount
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
    public async updateIrrigationInputDevice(id: number, sensorId: number, name: string, connectionType: string, authToken: string, provider: string): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {
                let providerCheck = provider
                if (provider == undefined) {
                    providerCheck = ''
                }
                let authCheck = authToken
                if (authToken == undefined) {
                    authCheck = ''
                }
                let query = "UPDATE irrigation_device_input SET sensorId=" + sensorId + ", name='" + name + "', connectionType='" +
                    connectionType + "', authToken='" + authCheck + "', provider='" + providerCheck + "' WHERE id=" + id + ";"
                conn.query(query, (error: any, results: any) => {
                    conn.release()
                    console.log(query)
                    if (error) {
                        reject({
                            http: 406,
                            status: 'Failed',
                            error: error
                        })
                    }
                    console.log(results)
                    if (results.affectedRows == 1) {
                        resolve({
                            http: 200,
                            status: 'Success',
                            result: 'Irrigation device input updated succesfully'
                        })
                    } else {
                        resolve({
                            http: 204,
                            status: 'Success',
                            message: "Irrigation device input could not be updated",
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
    public async deleteIrrigationInputDevice(id: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                let query = "DELETE FROM irrigation_device_input WHERE id=" + id + ";"
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
                            result: 'There is no irrigation device input with this ID'
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

export default new IrrigationDeviceInputController();