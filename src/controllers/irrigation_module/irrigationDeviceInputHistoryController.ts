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
    public async storeIrrigationInputDeviceHistory(irrigationDeviceId: number, humidity: number,
        temperature: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                let query = "INSERT INTO irrigation_device_input_history (`irrigationDeviceInputId`, `humidity`, `temperature`)" +
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
    public async getIrrigationInputDeviceHistoryOnRange(irrigationDeviceInputId: number, fromDate: string, toDate: string): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {
                
                let query = "SELECT * FROM irrigation_device_input_history WHERE irrigationDeviceInputId=" + irrigationDeviceInputId + " AND "+
                "timestamp >= '" + fromDate + "' and timestamp <= '" + toDate + "' ORDER BY timestamp"+ ";";
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