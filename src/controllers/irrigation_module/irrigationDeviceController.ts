import db from "../../database";

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
                let query = "SELECT COUNT(*) as openIrrigationOutputs FROM `irrigation_device_output` WHERE irrigation_device_output.status=1 and irrigation_device_output.irrigationDeviceId=" + irrigationDeviceId + ";";
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
                    if (results.length == 0) {
                        resolve({
                            http: 204,
                            status: 'Success',
                            result: 'There are no irrigation devices with the given user id'
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
    public async getIrrigationDeviceListing(userId: number, pageSize: number, pageIndex: number): Promise<object> {
        const first_value = (pageSize * pageIndex) - pageSize;

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {
                //let query = "SELECT * FROM irrigation_device INNER JOIN irrigation_device_output ON irrigation_device_output.irrigationDeviceId = irrigation_device.id WHERE userId=" + userId + " AND irrigation_device_output.status=1 ORDER BY irrigation_device.id DESC LIMIT " + first_value + ', ' + pageSize;
                let query = "SELECT * FROM irrigation_device WHERE userId=" + userId + " ORDER BY irrigation_device.id DESC LIMIT " + first_value + ', ' + pageSize;
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
                            result: 'There are no irrigation devices with the given user id'
                        })
                    }
                    console.log(results)
                    let contador: any = 0;
                    for (const irrigationDevice of results) {
                        let outputRes: any = await this.getIrrigationDeviceOutputCount(irrigationDevice.id)
                        if (outputRes.data) {
                            results[contador].openIrrigationOutputs = outputRes.data.openIrrigationOutputs
                        } else {
                            results[contador].openIrrigationOutputs = 0
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
    public async storeIrrigationDevice(name: string, nameSentilo: string, latitude: number, longitude: number,
        description: string, status: boolean, userId: number, deviceTypeId: number, valves: any[], sensors: any[]): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                let query = "INSERT INTO irrigation_device (name,nameSentilo,latitude,longitude,description,status," +
                    "userId,deviceTypeId) VALUES ('" + name + "','" + nameSentilo + "'," + latitude + "," +
                    longitude + ",'" + description + "'," + status + "," + userId + "," + deviceTypeId + ")"

                conn.query(query, (error: any, results: any) => {
                    conn.release()

                    if (error) {
                        reject({
                            http: 406,
                            status: 'Failed',
                            error: error
                        })
                    }

                    if (results.affectedRows == 1) {
                        
                        resolve({
                            http: 200,
                            status: 'Success',
                            result: 'Irrigation device inserted succesfully',
                            insertId: results.insertId
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
        longitude: number, description: string, status: boolean, userId: number, deviceTypeId: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                let query = "UPDATE irrigation_device SET name='" + name + "', nameSentilo='" + nameSentilo +
                    "', latitude=" + latitude + ",longitude=" + longitude + ", description='" + description + "', status=" + status +
                    ", userId=" + userId + ",deviceTypeId=" + deviceTypeId + " WHERE id=" + id + ";"

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
                            result: 'Irrigation device updated succesfully'
                        })
                    } else {
                        resolve({
                            http: 204,
                            status: 'Success',
                            message: "Irrigation device could not be updated",
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