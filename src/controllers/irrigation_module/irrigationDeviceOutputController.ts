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

                let query = "SELECT * FROM irrigation_device_output WHERE id = " + id;

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
    public async storeIrrigationOutputDevice(irrigationDeviceId: number, sensorId: number,
        sensorIndex: number, intervals: string, status: boolean, name: string): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                let query = "INSERT INTO irrigation_device_output (irrigationDeviceId,sensorId,sensorIndex,intervals,status,name)" +
                    " VALUES (" + irrigationDeviceId + "," + sensorId + "," + sensorIndex + ",'" +
                    intervals + "'," + status + ",'" + name + "')"
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
                    if (results.affectedRows == 1) {
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
    public async updateIrrigationOutputDevice(id: number, irrigationDeviceId: number, sensorId: number,
        sensorIndex: number, intervals: string, status: boolean, name: string): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                let query = "UPDATE irrigation_device_output SET irrigationDeviceId=" + irrigationDeviceId + ", sensorId=" + sensorId +
                    ", sensorIndex=" + sensorIndex + ",intervals='" + intervals + "', status=" + status + ", name='" + name + "' WHERE id=" + id + ";"
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
                    if (results.affectedRows == 1) {
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
    public async updateIrrigationOutputDeviceIntervals(irrigationDeviceId: number, intervals: any[]): Promise<object> {

        let intevalsStr = ""
        intervals.forEach(interval => {
            intevalsStr += interval
        });
        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                let query = "UPDATE irrigation_device_output SET intervals='" + intervals + "'WHERE irrigationDeviceId=" + irrigationDeviceId + ";"
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
                    if (results.affectedRows > 0) {
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