import db from "../../database";

class WaterUsersController {

    /**
     * GET ('/all/:user_id')
     * 
     * @async
     * @param user_id 
     * 
     * @returns 
     */
    public async getAllWaterUsers(user_id: number) {

        var query = "SELECT * FROM water_module_users WHERE user_id = " + user_id;

        return new Promise ((resolve, reject) => {

            db.getConnection((error:any, conn:any) => {

                // If the connection with the database fails
                if (error) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: error
                    })
                }

                conn.query(query, (err:any, results:any) => {
                    conn.release()
                    
                    // If the query fails
                    if (err) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: err
                        })
                    }
                    
                    // Response
                    resolve({
                        http: 200,
                        status: 'Success',
                        water_users: results
                    })
                })
            })
        })
    }

    /**
     * GET ('/device/:user_id')
     * 
     * @async
     * @param user_id 
     * 
     * @returns 
     */
     public async getWaterUserDevice(user_id: number) {

        var query = "SELECT * FROM water_devices WHERE water_user_id = " + user_id;

        return new Promise ((resolve, reject) => {

            db.getConnection((error:any, conn:any) => {

                // If the connection with the database fails
                if (error) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: error
                    })
                }

                conn.query(query, (err:any, results:any) => {
                    conn.release()
                    
                    // If the query fails
                    if (err) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: err
                        })
                    }
                    
                    // Response
                    resolve({
                        http: 200,
                        status: 'Success',
                        water_devices: results
                    })
                })
            })
        })

    }
}

export default new WaterUsersController();