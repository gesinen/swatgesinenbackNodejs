import db from "../database";

/*
 * /users
 */
class UsersController {
    /**
     * GET ('/information/:id')
     * Getting the information about the user
     * 
     * @async
     * @param id - The user Id
     * 
     * @return 
     */
    public async getUserInformation (id:number): Promise<object> {
        
        return new Promise ((resolve, reject) => {
            
            db.getConnection((err, conn) => {
                
                let query = "SELECT id, email, user_name, first_name, last_name, phone, address, city, state, country FROM users WHERE id = " + id;
                
                conn.query(query, (error, results) => {
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
                            result: 'There are no users with this ID',
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
}

export default new UsersController();