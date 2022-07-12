import db from "../../database";

/*
 * /users
 */
class IrrigationDeviceInputHistoryController {

    /**
     * GET ('/information/:id')
     * Getting the information about the user
     * 
     * @async
     * @param id - The user Id
     * 
     * @return 
     */
    public async storeIrrigationInputDeviceHistory(irrigationDeviceInputId: number, humidity: number,
        temperature: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                let query = "INSERT INTO irrigation_device_input_history (`irrigationDeviceInputId`, `humidity`, `temperature`)" +
                    " VALUES (" + irrigationDeviceInputId + "," + humidity + "," + temperature + ");"
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
                            result: 'Irrigation device input history inserted succesfully',
                            insertId: results.insertId
                        })
                    } else {
                        resolve({
                            http: 204,
                            status: 'Success',
                            message: "Irrigation device input history could not be inserted",
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
         public async storeIrrigationInputDeviceHistoryLora(irrigationDeviceId: number, humidity: number,
            temperature: number): Promise<object> {
    
            return new Promise((resolve: any, reject: any) => {
    
                db.getConnection((err: any, conn: any) => {
    
                    let query = "INSERT INTO irrigation_device_input_history_lora (`irrigationDeviceId`, `humidity`, `temperature`)" +
                        " VALUES (" + irrigationDeviceId + "," + humidity + "," + temperature + ");"
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
                                result: 'Irrigation device input history inserted succesfully',
                                insertId: results.insertId
                            })
                        } else {
                            resolve({
                                http: 204,
                                status: 'Success',
                                message: "Irrigation device input history could not be inserted",
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
    public async getIrrigationInputDevice(irrigationDeviceId: number, inputIndex: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                let queryGetIrrigationInputId = "SELECT id FROM irrigation_device_input WHERE irrigationDeviceId=" +
                    irrigationDeviceId + " AND sensorIndex=" + inputIndex
                console.log("query", queryGetIrrigationInputId)
                conn.query(queryGetIrrigationInputId, (error: any, results: any) => {
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
                            message: 'Irrigation device input id history retrieved succesfully',
                            result: results[0]
                        })
                    } else {
                        resolve({
                            http: 204,
                            status: 'Success',
                            message: "Irrigation device input id could not be retrieved",
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
    public async getIrrigationInputDeviceHistoryOnRange(irrigationDeviceId: number, irrigationInputDeviceIndex: number, fromDate: string, toDate: string): Promise<object> {

        return new Promise(async (resolve: any, reject: any) => {
            var res: any = await this.getIrrigationInputDevice(irrigationDeviceId, irrigationInputDeviceIndex)
            var irrigationInputDeviceId = res.result.id
            db.getConnection((err: any, conn: any) => {

                let query = "SELECT * FROM irrigation_device_input_history WHERE irrigationDeviceInputId=" + irrigationInputDeviceId + " AND " +
                    "timestamp >= '" + fromDate + "' and timestamp <= '" + toDate + " 23:59' ORDER BY timestamp" + ";";
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
                            message: 'Irrigation device inputs history retrieved succesfully',
                            result: results
                        })
                    } else {
                        resolve({
                            http: 204,
                            status: 'Success',
                            message: "Irrigation device inputs history could not be retrieved",
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
     public async getIrrigationInputDeviceHistoryOnRangeLora(irrigationDeviceId: number, fromDate: string, toDate: string): Promise<object> {

        return new Promise(async (resolve: any, reject: any) => {
            db.getConnection((err: any, conn: any) => {

                let query = "SELECT * FROM irrigation_device_input_history_lora WHERE irrigationDeviceId=" + irrigationDeviceId + " AND " +
                    "timestamp >= '" + fromDate + "' and timestamp <= '" + toDate + " 23:59' ORDER BY timestamp" + ";";
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
                            message: 'Irrigation device inputs history retrieved succesfully',
                            result: results
                        })
                    } else {
                        resolve({
                            http: 204,
                            status: 'Success',
                            message: "Irrigation device inputs history could not be retrieved",
                            result: results
                        })
                    }
                })
            })
        })
    }
}

export default new IrrigationDeviceInputHistoryController();