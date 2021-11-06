import db from "../../database";

export default class LoraDashboardController {

    public async getNetworkServerGeneralInformation( userId: number ) {

        var query = "SELECT s.*, sn.*, u.user_name FROM servers AS s INNER JOIN sensor_server_detail AS ssd ON s.id = ssd.server_id INNER JOIN sensor_info AS sn ON ssd.sensor_id = sn.id INNER JOIN users AS u ON u.id = s.user_id WHERE s.user_id = " + userId + " OR u.under_admin = " + userId;

        return new Promise((resolve, reject) => {
            
            db.getConnection((error:any, conn:any) => {
                
                if (error) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: error
                    })
                }

                conn.query( query, (err: any, results: any) => {
                    conn.release();

                    if (err) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: err
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
    } // ()


}