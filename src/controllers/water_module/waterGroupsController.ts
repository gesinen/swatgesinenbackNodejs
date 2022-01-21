import db from "../../database";
import {Utils} from "../../utils/Utils";

class WaterGroupsController {

    /**
     * GET ('/all/:user_id')
     *
     * @async
     * @param user_id
     *
     * @returns
     */
    public async getWaterGroupsByUser(user_id: number) {

        var query = "SELECT * FROM water_group WHERE user_id = " + user_id;

        return new Promise((resolve, reject) => {

            db.getConnection((error: any, conn: any) => {

                // If the connection with the database fails
                if (error) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: error
                    })
                }

                conn.query(query, (err: any, results: any) => {
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
                    if (results && results.length == 0) {
                        resolve({
                            http: 204,
                            status: 'Success',
                            result: "Error no water groups found for the given user",
                        })
                    } else {
                        console.log('Probando Grupos: ', results)
                        resolve({
                            http: 200,
                            status: 'Success',
                            result: results
                        })
                    }
                })
            })
        })
    }

}

export default new WaterGroupsController();
